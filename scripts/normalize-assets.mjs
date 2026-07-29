import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const sourceRoot = path.join(projectRoot, "Asset");
const outputRoot = path.join(projectRoot, "normalized_assets");
const dryRun = process.argv.includes("--dry-run");
const padding = 4;

const sheetGroups = [
  {
    source: "player",
    output: "player",
    frameSize: 64,
    alignment: "grounded",
    label: "Player",
  },
  {
    source: "monsters/slime",
    output: "monsters/slime",
    frameSize: 64,
    alignment: "grounded",
    label: "Slime",
  },
  {
    source: "monsters/bat",
    output: "monsters/bat",
    frameSize: 64,
    alignment: "hover",
    label: "Bat",
  },
  {
    source: "monsters/goblin",
    output: "monsters/goblin",
    frameSize: 64,
    alignment: "grounded",
    label: "Goblin",
  },
  {
    source: "elites/crystal-slime",
    output: "elites/crystal-slime",
    frameSize: 64,
    alignment: "grounded",
    label: "Elite Crystal Slime",
  },
  {
    source: "bosses/gatekeeper",
    output: "bosses/gatekeeper",
    frameSize: 128,
    alignment: "grounded",
    label: "Gatekeeper",
  },
  {
    source: "effects",
    output: "effects",
    frameSize: 64,
    alignment: "center",
    label: "Effect",
  },
];

const records = [];

function portablePath(absolutePath) {
  return path.relative(projectRoot, absolutePath).split(path.sep).join("/");
}

function assertInside(parent, child) {
  const relative = path.relative(parent, child);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Unsafe output path outside ${portablePath(parent)}: ${child}`);
  }
}

async function listPngFiles(directory) {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".png"))
      .map((entry) => path.join(directory, entry.name))
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function listPngFilesRecursive(directory) {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
          return listPngFilesRecursive(entryPath);
        }
        return entry.isFile() && entry.name.toLowerCase().endsWith(".png")
          ? [entryPath]
          : [];
      }),
    );
    return nested.flat().sort((a, b) => a.localeCompare(b));
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

function inferFrameCount(filename, width, height) {
  const warnings = [];
  const ratio = width / height;
  const roundedRatio = Math.round(ratio);
  const ratioLooksLikeFrames =
    roundedRatio >= 2 && roundedRatio <= 8 && Math.abs(ratio - roundedRatio) <= 0.03;

  if (filename.includes("_hit_sheet")) {
    if (Math.abs(ratio - 2) > 0.1) {
      warnings.push(
        `Filename implies 2 hit frames, but source aspect ratio is ${ratio.toFixed(2)}.`,
      );
    }
    return { count: 2, basis: "filename action (_hit_sheet)", warnings };
  }

  if (ratioLooksLikeFrames) {
    if (roundedRatio !== 4) {
      warnings.push(
        `Frame count ${roundedRatio} inferred from source aspect ratio instead of the common 4-frame layout.`,
      );
    }
    return { count: roundedRatio, basis: "source aspect ratio", warnings };
  }

  warnings.push(
    `Source aspect ratio ${ratio.toFixed(2)} does not identify an equal-square horizontal frame count; defaulted to 4 frames.`,
  );
  return { count: 4, basis: "default 4-frame action", warnings };
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
      const alpha = data[(y * info.width + x) * info.channels + 3];
      if (alpha <= 5) {
        continue;
      }
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }

  if (right < left || bottom < top) {
    return null;
  }

  return {
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1,
  };
}

async function transparencyWarning(sourcePath, assetKind) {
  if (assetKind === "background" || assetKind === "event") {
    return null;
  }

  const stats = await sharp(sourcePath).stats();
  if (stats.isOpaque) {
    return "No usable transparent pixels detected; possible baked preview/checkerboard/background requires manual cleanup.";
  }
  return null;
}

function placementTop(alignment, targetSize, renderedHeight, filename) {
  if (alignment === "grounded") {
    return targetSize - padding - renderedHeight;
  }
  if (alignment === "hover") {
    return Math.round((targetSize - renderedHeight) / 2);
  }
  if (filename.includes("effect_earth")) {
    return targetSize - padding - renderedHeight;
  }
  return Math.round((targetSize - renderedHeight) / 2);
}

async function ensureOutputDirectory(outputPath) {
  assertInside(outputRoot, outputPath);
  if (!dryRun) {
    await mkdir(path.dirname(outputPath), { recursive: true });
  }
}

async function processSheet(sourcePath, group) {
  const filename = path.basename(sourcePath);
  const outputPath = path.join(outputRoot, group.output, filename);
  const warnings = [];

  try {
    const metadata = await sharp(sourcePath).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error("Could not read source dimensions.");
    }

    const inference = inferFrameCount(filename, metadata.width, metadata.height);
    warnings.push(...inference.warnings);
    if (metadata.width % inference.count !== 0) {
      throw new Error(
        `Source width ${metadata.width} is not divisible by ${inference.count} frames.`,
      );
    }

    const sourceFrameWidth = metadata.width / inference.count;
    const sourceFrameAspect = sourceFrameWidth / metadata.height;
    if (Math.abs(sourceFrameAspect - 1) > 0.1) {
      warnings.push(
        `Each inferred source frame is ${sourceFrameWidth}x${metadata.height} (aspect ${sourceFrameAspect.toFixed(2)}), not approximately square.`,
      );
    }

    const alphaIssue = await transparencyWarning(sourcePath, "sheet");
    if (alphaIssue) {
      warnings.push(alphaIssue);
    }

    const frames = [];
    for (let index = 0; index < inference.count; index += 1) {
      const buffer = await sharp(sourcePath)
        .extract({
          left: index * sourceFrameWidth,
          top: 0,
          width: sourceFrameWidth,
          height: metadata.height,
        })
        .png()
        .toBuffer();
      const bounds = await alphaBounds(buffer);
      if (!bounds) {
        throw new Error(`Frame ${index + 1} contains no visible pixels.`);
      }
      frames.push({ buffer, bounds });
    }

    const sharedWidth = Math.max(...frames.map((frame) => frame.bounds.width));
    const sharedHeight = Math.max(...frames.map((frame) => frame.bounds.height));
    const available = group.frameSize - padding * 2;
    const scale = Math.min(available / sharedWidth, available / sharedHeight);

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
      const left =
        index * group.frameSize + Math.round((group.frameSize - renderedWidth) / 2);
      const top = placementTop(
        group.alignment,
        group.frameSize,
        renderedHeight,
        filename,
      );
      composites.push({ input: rendered, left, top });
    }

    const expectedWidth = group.frameSize * inference.count;
    const expectedHeight = group.frameSize;
    await ensureOutputDirectory(outputPath);
    if (!dryRun) {
      await sharp({
        create: {
          width: expectedWidth,
          height: expectedHeight,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite(composites)
        .png()
        .toFile(outputPath);
    }

    records.push({
      status: "processed",
      kind: group.label,
      source: portablePath(sourcePath),
      output: portablePath(outputPath),
      sourceDimensions: `${metadata.width}x${metadata.height}`,
      expectedDimensions: `${expectedWidth}x${expectedHeight}`,
      frameCount: inference.count,
      frameBasis: inference.basis,
      warnings,
    });
  } catch (error) {
    records.push({
      status: "skipped",
      kind: group.label,
      source: portablePath(sourcePath),
      output: portablePath(outputPath),
      sourceDimensions: "unknown",
      expectedDimensions: "not exported",
      frameCount: null,
      frameBasis: "not determined",
      warnings: [error.message],
    });
  }
}

async function processIcon(sourcePath) {
  const filename = path.basename(sourcePath);
  const outputPath = path.join(outputRoot, "ui", filename);
  const warnings = [];

  try {
    const metadata = await sharp(sourcePath).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error("Could not read source dimensions.");
    }
    const alphaIssue = await transparencyWarning(sourcePath, "icon");
    if (alphaIssue) {
      warnings.push(alphaIssue);
    }

    const sourceBuffer = await sharp(sourcePath).png().toBuffer();
    const bounds = await alphaBounds(sourceBuffer);
    if (!bounds) {
      throw new Error("Icon contains no visible pixels.");
    }
    const available = 64 - padding * 2;
    const scale = Math.min(available / bounds.width, available / bounds.height);
    const renderedWidth = Math.max(1, Math.round(bounds.width * scale));
    const renderedHeight = Math.max(1, Math.round(bounds.height * scale));
    const rendered = await sharp(sourceBuffer)
      .extract(bounds)
      .resize(renderedWidth, renderedHeight, {
        fit: "fill",
        kernel: sharp.kernel.nearest,
      })
      .png()
      .toBuffer();

    await ensureOutputDirectory(outputPath);
    if (!dryRun) {
      await sharp({
        create: {
          width: 64,
          height: 64,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([
          {
            input: rendered,
            left: Math.round((64 - renderedWidth) / 2),
            top: Math.round((64 - renderedHeight) / 2),
          },
        ])
        .png()
        .toFile(outputPath);
    }

    records.push({
      status: "processed",
      kind: "UI icon",
      source: portablePath(sourcePath),
      output: portablePath(outputPath),
      sourceDimensions: `${metadata.width}x${metadata.height}`,
      expectedDimensions: "64x64",
      frameCount: 1,
      frameBasis: "single icon",
      warnings,
    });
  } catch (error) {
    records.push({
      status: "skipped",
      kind: "UI icon",
      source: portablePath(sourcePath),
      output: portablePath(outputPath),
      sourceDimensions: "unknown",
      expectedDimensions: "not exported",
      frameCount: null,
      frameBasis: "not determined",
      warnings: [error.message],
    });
  }
}

async function copyPreserved(sourcePath, outputSubfolder, kind, expectedDimensions) {
  const outputPath = path.join(outputRoot, outputSubfolder, path.basename(sourcePath));
  const warnings = [];

  try {
    const metadata = await sharp(sourcePath).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error("Could not read source dimensions.");
    }
    const actualDimensions = `${metadata.width}x${metadata.height}`;
    if (expectedDimensions && actualDimensions !== expectedDimensions) {
      warnings.push(
        `Source dimensions ${actualDimensions} differ from provisional ${expectedDimensions}; preserved without resize.`,
      );
    }
    if (kind === "Card frame") {
      warnings.push(
        "Card frame dimensions are provisional and require UI text-readability testing.",
      );
    }
    if (kind === "Background") {
      warnings.push(
        "Background remains provisional and requires responsive crop/style QA.",
      );
    }

    await ensureOutputDirectory(outputPath);
    if (!dryRun) {
      await copyFile(sourcePath, outputPath);
    }
    records.push({
      status: "processed",
      kind,
      source: portablePath(sourcePath),
      output: portablePath(outputPath),
      sourceDimensions: actualDimensions,
      expectedDimensions: `${actualDimensions} (preserved)`,
      frameCount: 1,
      frameBasis: "preserve source dimensions",
      warnings,
    });
  } catch (error) {
    records.push({
      status: "skipped",
      kind,
      source: portablePath(sourcePath),
      output: portablePath(outputPath),
      sourceDimensions: "unknown",
      expectedDimensions: "not exported",
      frameCount: null,
      frameBasis: "not determined",
      warnings: [error.message],
    });
  }
}

function markdownCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

function buildReport() {
  const processed = records.filter((record) => record.status === "processed");
  const skipped = records.filter((record) => record.status === "skipped");
  const warned = records.filter((record) => record.warnings.length > 0);
  const possibleBackground = records.filter((record) =>
    record.warnings.some((warning) => warning.includes("possible baked")),
  );
  const inferred = records.filter(
    (record) => record.status === "processed" && record.frameCount > 1,
  );
  const aspectWarnings = records.filter((record) =>
    record.warnings.some(
      (warning) =>
        warning.includes("aspect ratio") || warning.includes("not approximately square"),
    ),
  );

  const lines = [
    "# Asset Normalization Report",
    "",
    `Run: ${new Date().toISOString()}`,
    "",
    `Mode: ${dryRun ? "Dry run (no files written)" : "Normal run"}`,
    "",
    "## Summary",
    "",
    `- Files processed: ${processed.length}`,
    `- Files skipped: ${skipped.length}`,
    `- Files with warnings: ${warned.length}`,
    `- Output root: \`normalized_assets/\``,
    "- Runtime integration: prohibited",
    "",
    "## Processed Files",
    "",
    "| Source | Source dimensions | Frames | Expected output | Output | Warnings |",
    "| --- | ---: | ---: | ---: | --- | --- |",
    ...processed.map(
      (record) =>
        `| \`${markdownCell(record.source)}\` | ${record.sourceDimensions} | ${record.frameCount} | ${record.expectedDimensions} | \`${markdownCell(record.output)}\` | ${markdownCell(record.warnings.join(" ")) || "None"} |`,
    ),
    "",
    "## Skipped Files",
    "",
    ...(skipped.length
      ? skipped.map(
          (record) =>
            `- \`${record.source}\`: ${record.warnings.join(" ") || "Skipped."}`,
        )
      : ["- None."]),
    "",
    "## Frame Count Inference",
    "",
    ...inferred.map(
      (record) =>
        `- \`${record.source}\`: ${record.frameCount} frames from ${record.frameBasis}.`,
    ),
    "",
    "## Possible Baked Background Or Checkerboard Issues",
    "",
    ...(possibleBackground.length
      ? possibleBackground.map((record) => `- \`${record.source}\``)
      : ["- None detected by the conservative opacity check."]),
    "",
    "## Source Aspect Ratio Warnings",
    "",
    ...(aspectWarnings.length
      ? aspectWarnings.map(
          (record) =>
            `- \`${record.source}\`: ${record.warnings
              .filter(
                (warning) =>
                  warning.includes("aspect ratio") ||
                  warning.includes("not approximately square"),
              )
              .join(" ")}`,
        )
      : ["- None."]),
    "",
    "## Manual QA Required",
    "",
    ...warned.map(
      (record) =>
        `- \`${record.output}\`: ${record.warnings.join(" ")}`,
    ),
    "",
    "## Safety",
    "",
    "- Source files under `Asset/` were read only and remain unchanged.",
    "- Outputs under `normalized_assets/` are normalization candidates, not integrated runtime assets.",
    "- No output was written to `src/assets/`.",
    "- Possible baked backgrounds are reported, not removed automatically.",
    "- Visual QA is required before any later runtime integration phase.",
    "",
  ];
  return lines.join("\n");
}

async function main() {
  for (const group of sheetGroups) {
    const files = await listPngFiles(path.join(sourceRoot, group.source));
    for (const sourcePath of files) {
      await processSheet(sourcePath, group);
    }
  }

  const uiDirectory = path.join(sourceRoot, "ui");
  const uiFiles = await listPngFiles(uiDirectory);
  const normalizedIcons = new Set([
    "ui_gold_coin.png",
    "ui_heart_hp.png",
    "ui_shield.png",
  ]);
  for (const sourcePath of uiFiles) {
    if (normalizedIcons.has(path.basename(sourcePath))) {
      await processIcon(sourcePath);
    } else if (path.basename(sourcePath) === "ui_vocabulary_card_frame.png") {
      await copyPreserved(sourcePath, "ui", "Card frame", null);
    } else {
      records.push({
        status: "skipped",
        kind: "UI",
        source: portablePath(sourcePath),
        output: "not exported",
        sourceDimensions: "unknown",
        expectedDimensions: "not configured",
        frameCount: null,
        frameBasis: "not configured",
        warnings: ["UI file is not included in the Phase 71C allowlist."],
      });
    }
  }

  for (const sourcePath of await listPngFiles(path.join(sourceRoot, "backgrounds"))) {
    await copyPreserved(sourcePath, "backgrounds", "Background", "1536x864");
  }

  for (const sourcePath of await listPngFiles(path.join(sourceRoot, "events"))) {
    await copyPreserved(sourcePath, "events", "Event illustration", "768x432");
  }

  for (const folder of ["incoming", "rejected"]) {
    for (const sourcePath of await listPngFilesRecursive(path.join(sourceRoot, folder))) {
      records.push({
        status: "skipped",
        kind: folder,
        source: portablePath(sourcePath),
        output: "not exported",
        sourceDimensions: "not inspected",
        expectedDimensions: "not configured",
        frameCount: null,
        frameBasis: "not configured",
        warnings: [`Files in Asset/${folder}/ require an explicit acceptance decision.`],
      });
    }
  }

  const report = buildReport();
  if (dryRun) {
    process.stdout.write(`${report}\n`);
  } else {
    await mkdir(outputRoot, { recursive: true });
    await writeFile(
      path.join(outputRoot, "NORMALIZATION_REPORT.md"),
      report,
      "utf8",
    );
    const processed = records.filter((record) => record.status === "processed").length;
    const skipped = records.filter((record) => record.status === "skipped").length;
    const warned = records.filter((record) => record.warnings.length > 0).length;
    console.log(
      `Normalization complete: ${processed} processed, ${skipped} skipped, ${warned} with warnings.`,
    );
    console.log("Report: normalized_assets/NORMALIZATION_REPORT.md");
  }
}

await main();
