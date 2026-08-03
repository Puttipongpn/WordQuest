import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import {
  assetNormalizationConfig,
  fixPassSources,
} from "./asset-normalization.config.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const outputRoot = path.join(projectRoot, "normalized_assets_fixed");
const dryRun = process.argv.includes("--dry-run");
const padding = 4;
const records = [];
const visualQaEstimate = new Map([
  [
    "Asset/player/player_word_mage_walk_sheet.png",
    {
      status: "needs review",
      notes: "Transparency and six-frame isolation pass; review cadence and the narrower final pose in playback.",
    },
  ],
  [
    "Asset/effects/effect_fire_sheet.png",
    {
      status: "needs review",
      notes: "Transparency and four-frame isolation pass; confirm pale particles and glow on light and dark battle backgrounds.",
    },
  ],
]);

function portablePath(absolutePath) {
  return path.relative(projectRoot, absolutePath).split(path.sep).join("/");
}

function assertInside(parent, child) {
  const relative = path.relative(parent, child);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Unsafe output path outside ${portablePath(parent)}: ${child}`);
  }
}

function isLightLowSaturation(red, green, blue) {
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  return minimum >= 214 && maximum - minimum <= 20;
}

function percentage(value) {
  return `${(value * 100).toFixed(1)}%`;
}

async function detectAndCleanBackground(sourcePath, cleanupMode) {
  const { data, info } = await sharp(sourcePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixelCount = info.width * info.height;
  const candidate = new Uint8Array(pixelCount);
  let sourceOpaque = true;
  let coloredPixels = 0;

  for (let index = 0; index < pixelCount; index += 1) {
    const offset = index * info.channels;
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    const alpha = data[offset + 3];
    if (alpha < 255) {
      sourceOpaque = false;
    }
    if (alpha > 5 && isLightLowSaturation(red, green, blue)) {
      candidate[index] = 1;
    } else if (
      alpha > 5 &&
      Math.max(red, green, blue) - Math.min(red, green, blue) > 20
    ) {
      coloredPixels += 1;
    }
  }

  const connected = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  let queueStart = 0;
  let queueEnd = 0;
  let edgeSamples = 0;
  let edgeCandidates = 0;

  const enqueueEdge = (index) => {
    edgeSamples += 1;
    if (!candidate[index]) {
      return;
    }
    edgeCandidates += 1;
    if (!connected[index]) {
      connected[index] = 1;
      queue[queueEnd] = index;
      queueEnd += 1;
    }
  };

  for (let x = 0; x < info.width; x += 1) {
    enqueueEdge(x);
    enqueueEdge((info.height - 1) * info.width + x);
  }
  for (let y = 1; y < info.height - 1; y += 1) {
    enqueueEdge(y * info.width);
    enqueueEdge(y * info.width + info.width - 1);
  }

  const neighbors = [-1, 1, -info.width, info.width];
  while (queueStart < queueEnd) {
    const index = queue[queueStart];
    queueStart += 1;
    const x = index % info.width;
    const y = Math.floor(index / info.width);
    for (const offset of neighbors) {
      if ((offset === -1 && x === 0) || (offset === 1 && x === info.width - 1)) {
        continue;
      }
      if (
        (offset === -info.width && y === 0) ||
        (offset === info.width && y === info.height - 1)
      ) {
        continue;
      }
      const neighbor = index + offset;
      if (candidate[neighbor] && !connected[neighbor]) {
        connected[neighbor] = 1;
        queue[queueEnd] = neighbor;
        queueEnd += 1;
      }
    }
  }

  const edgeCandidateRatio = edgeCandidates / Math.max(1, edgeSamples);
  const connectedRatio = queueEnd / pixelCount;
  const coloredRatio = coloredPixels / pixelCount;
  const probableCheckerboard =
    sourceOpaque && edgeCandidateRatio >= 0.8 && connectedRatio >= 0.25;
  const cleanupSafe =
    probableCheckerboard && connectedRatio < 0.995 && coloredRatio >= 0.001;
  const cleanupApplied =
    cleanupMode === "conservative-checkerboard-remove" && cleanupSafe;

  if (cleanupApplied) {
    for (let index = 0; index < pixelCount; index += 1) {
      if (!connected[index]) {
        continue;
      }
      const offset = index * info.channels;
      data[offset] = 0;
      data[offset + 1] = 0;
      data[offset + 2] = 0;
      data[offset + 3] = 0;
    }
  }

  const buffer = await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .png()
    .toBuffer();

  return {
    buffer,
    width: info.width,
    height: info.height,
    probableCheckerboard,
    cleanupApplied,
    edgeCandidateRatio,
    connectedRatio,
  };
}

async function alphaBounds(imageBuffer) {
  const { data, info } = await sharp(imageBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let left = info.width;
  let top = info.height;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (data[(y * info.width + x) * info.channels + 3] <= 5) {
        continue;
      }
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }

  return right < left || bottom < top
    ? null
    : { left, top, width: right - left + 1, height: bottom - top + 1 };
}

function placementTop(mode, targetHeight, renderedHeight) {
  if (mode === "grounded" || mode === "lower") {
    return targetHeight - padding - renderedHeight;
  }
  return Math.round((targetHeight - renderedHeight) / 2);
}

async function exportEntry(entry) {
  const sourcePath = path.join(projectRoot, entry.source);
  const outputPath = path.join(outputRoot, entry.output);
  assertInside(projectRoot, sourcePath);
  assertInside(outputRoot, outputPath);
  const warnings = [];

  try {
    const cleanup = await detectAndCleanBackground(sourcePath, entry.cleanupMode);
    if (
      entry.cleanupMode === "conservative-checkerboard-remove" &&
      !cleanup.cleanupApplied
    ) {
      warnings.push(
        "Conservative checkerboard cleanup was not applied because the automated safety gate did not pass.",
      );
    }
    if (!cleanup.probableCheckerboard) {
      warnings.push(
        "No probable edge-connected light checkerboard/preview background was detected.",
      );
    }
    if (cleanup.width % entry.frameCount !== 0) {
      throw new Error(
        `Source width ${cleanup.width} is not divisible by configured frame count ${entry.frameCount}.`,
      );
    }

    const sourceFrameWidth = cleanup.width / entry.frameCount;
    const frames = [];
    for (let index = 0; index < entry.frameCount; index += 1) {
      const buffer = await sharp(cleanup.buffer)
        .extract({
          left: index * sourceFrameWidth,
          top: 0,
          width: sourceFrameWidth,
          height: cleanup.height,
        })
        .png()
        .toBuffer();
      const bounds = await alphaBounds(buffer);
      if (!bounds) {
        throw new Error(
          `Configured frame ${index + 1} contains no visible pixels after cleanup.`,
        );
      }
      frames.push({ buffer, bounds });
    }

    const sharedWidth = Math.max(...frames.map((frame) => frame.bounds.width));
    const sharedHeight = Math.max(...frames.map((frame) => frame.bounds.height));
    const availableWidth = entry.targetFrameWidth - padding * 2;
    const availableHeight = entry.targetFrameHeight - padding * 2;
    const scale = Math.min(
      availableWidth / sharedWidth,
      availableHeight / sharedHeight,
    );
    const composites = [];

    for (let index = 0; index < frames.length; index += 1) {
      const frame = frames[index];
      const renderedWidth = Math.max(1, Math.round(frame.bounds.width * scale));
      const renderedHeight = Math.max(1, Math.round(frame.bounds.height * scale));
      const rendered = await sharp(frame.buffer)
        .extract(frame.bounds)
        .resize(renderedWidth, renderedHeight, {
          fit: "fill",
          kernel: sharp.kernel.nearest,
        })
        .png()
        .toBuffer();
      composites.push({
        input: rendered,
        left:
          index * entry.targetFrameWidth +
          Math.round((entry.targetFrameWidth - renderedWidth) / 2),
        top: placementTop(
          entry.baselineMode,
          entry.targetFrameHeight,
          renderedHeight,
        ),
      });
    }

    const outputWidth = entry.targetFrameWidth * entry.frameCount;
    const outputHeight = entry.targetFrameHeight;
    if (!dryRun) {
      await mkdir(path.dirname(outputPath), { recursive: true });
      await sharp({
        create: {
          width: outputWidth,
          height: outputHeight,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite(composites)
        .png()
        .toFile(outputPath);
    }

    records.push({
      status: "output created",
      ...entry,
      sourceDimensions: `${cleanup.width}x${cleanup.height}`,
      detectedDimensions: `${outputWidth}x${outputHeight}`,
      checkerboardResult: cleanup.probableCheckerboard
        ? `probable (${percentage(cleanup.edgeCandidateRatio)} edge match)`
        : `not detected (${percentage(cleanup.edgeCandidateRatio)} edge match)`,
      cleanupResult: cleanup.cleanupApplied
        ? `applied; ${percentage(cleanup.connectedRatio)} of source made transparent`
        : "not applied",
      warnings,
      readyForHumanQa:
        cleanup.cleanupApplied && warnings.length === 0 ? "yes" : "yes, with warnings",
      regenerateSource: cleanup.cleanupApplied
        ? "no automated requirement; decide after visual QA"
        : "yes, unless manual transparent cleanup is approved",
    });
  } catch (error) {
    records.push({
      status: "failed",
      ...entry,
      sourceDimensions: "unknown",
      detectedDimensions: "not output",
      checkerboardResult: "not completed",
      cleanupResult: "not completed",
      warnings: [error.message],
      readyForHumanQa: "no",
      regenerateSource: "review source and configuration",
    });
  }
}

function markdownCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

function buildReport() {
  const created = records.filter((record) => record.status === "output created");
  const failed = records.filter((record) => record.status === "failed");
  const warned = records.filter((record) => record.warnings.length > 0);
  const reviewed = records.map((record) => ({
    source: record.source,
    ...(visualQaEstimate.get(record.source) ?? {
      status: record.status === "output created" ? "pass" : "fail",
      notes:
        record.status === "output created"
          ? "Clean transparency, expected dimensions, configured frame isolation, and stable placement in static inspection."
          : "No corrected output was available for visual inspection.",
    }),
  }));
  const visualPass = reviewed.filter((record) => record.status === "pass").length;
  const visualReview = reviewed.filter(
    (record) => record.status === "needs review",
  ).length;
  const visualFail = reviewed.filter((record) => record.status === "fail").length;
  return [
    "# Phase 71D.1 Fix Pass Report",
    "",
    `Run: ${new Date().toISOString()}`,
    "",
    `Mode: ${dryRun ? "Dry run (no files written)" : "Corrected subset run"}`,
    "",
    "Phase 71D.1 is a source-cleanup and normalization correction pass. Runtime integration remains prohibited.",
    "",
    "## Summary",
    "",
    `- Files attempted: ${records.length}`,
    `- Files successfully output: ${created.length}`,
    `- Files failed: ${failed.length}`,
    `- Files with remaining warnings: ${warned.length}`,
    `- Preliminary visual estimate: ${visualPass} pass, ${visualReview} needs review, ${visualFail} fail`,
    "- Corrected output root: `normalized_assets_fixed/`",
    "- Failed Phase 71C history remains under `normalized_assets/`.",
    "",
    "## Corrected Subset",
    "",
    "| Source | Source size | Output size | Expected | Frames | Cleanup mode | Checkerboard detection | Cleanup result | Ready for human QA | Regenerate transparent source? | Warnings |",
    "| --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- | --- |",
    ...records.map(
      (record) =>
        `| \`${markdownCell(record.source)}\` | ${record.sourceDimensions} | ${record.detectedDimensions} | ${record.expectedOutputDimensions} | ${record.frameCount} | ${record.cleanupMode} | ${record.checkerboardResult} | ${record.cleanupResult} | ${record.readyForHumanQa} | ${record.regenerateSource} | ${markdownCell(record.warnings.join(" ")) || "None"} |`,
    ),
    "",
    "## Configuration Notes",
    "",
    ...records.map((record) => `- \`${record.source}\`: ${record.notes}`),
    "",
    "## Preliminary Visual QA Estimate",
    "",
    "This static inspection is a fix-pass estimate, not final runtime approval.",
    "",
    "| Output | Estimate | Notes |",
    "| --- | --- | --- |",
    ...reviewed.map(
      (record) =>
        `| \`${record.source.replace(/^Asset\//, "normalized_assets_fixed/")}\` | ${record.status} | ${record.notes} |`,
    ),
    "",
    "## Remaining Gate",
    "",
    "- These outputs are corrected normalization candidates only.",
    "- Human visual QA must check transparency, frame isolation, scale, baseline, edge clipping, and mobile readability.",
    "- If conservative cleanup damages glow, particles, highlights, or silhouettes, regenerate or manually clean a true transparent source.",
    "- Do not import these files into React, create an asset manifest, implement playback, or write to `src/assets/`.",
    "- Do not rerun the full asset set until this representative subset is reviewed.",
    "",
    "## Safety",
    "",
    "- Original files under `Asset/` were read only and remain unchanged.",
    "- Existing failed outputs under `normalized_assets/` were not overwritten.",
    "- No gameplay, save, combat, progression, deployment, or runtime asset code was changed.",
    "",
  ].join("\n");
}

async function main() {
  const subset = assetNormalizationConfig.filter((entry) =>
    fixPassSources.has(entry.source),
  );
  if (subset.length !== fixPassSources.size) {
    throw new Error(
      `Fix-pass config mismatch: expected ${fixPassSources.size} entries, found ${subset.length}.`,
    );
  }
  for (const entry of subset) {
    await exportEntry(entry);
  }

  const report = buildReport();
  if (dryRun) {
    process.stdout.write(`${report}\n`);
    return;
  }
  await mkdir(outputRoot, { recursive: true });
  await writeFile(path.join(outputRoot, "FIX_PASS_REPORT.md"), report, "utf8");
  const created = records.filter((record) => record.status === "output created").length;
  const failed = records.filter((record) => record.status === "failed").length;
  console.log(`Phase 71D.1 fix pass complete: ${created} output, ${failed} failed.`);
  console.log("Report: normalized_assets_fixed/FIX_PASS_REPORT.md");
}

await main();
