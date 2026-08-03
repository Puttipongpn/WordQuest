import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { assetRefinementConfig } from "./asset-normalization.config.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const outputRoot = path.join(projectRoot, "normalized_assets_refined");
const records = [];

function assertInside(parent, child) {
  const relative = path.relative(parent, child);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Unsafe path outside ${parent}: ${child}`);
  }
}

function pixelOffset(info, x, y) {
  return (y * info.width + x) * info.channels;
}

function isNeutral(data, offset, minBrightness, maxChroma) {
  if (data[offset + 3] === 0) {
    return false;
  }
  const red = data[offset];
  const green = data[offset + 1];
  const blue = data[offset + 2];
  return (
    Math.min(red, green, blue) >= minBrightness &&
    Math.max(red, green, blue) - Math.min(red, green, blue) <= maxChroma
  );
}

function clearPixel(data, offset) {
  data[offset] = 0;
  data[offset + 1] = 0;
  data[offset + 2] = 0;
  data[offset + 3] = 0;
}

function removeNeutralComponent(data, info, frameWidth, seed) {
  const startOffset = pixelOffset(
    info,
    seed.frame * frameWidth + seed.x,
    seed.y,
  );
  if (
    !isNeutral(
      data,
      startOffset,
      seed.minBrightness,
      seed.maxChroma,
    )
  ) {
    throw new Error(
      `Neutral seed did not match at frame ${seed.frame + 1} (${seed.x},${seed.y}).`,
    );
  }

  const seen = new Uint8Array(frameWidth * info.height);
  const queue = [seed.y * frameWidth + seed.x];
  seen[queue[0]] = 1;
  const pixels = [];
  while (queue.length) {
    const current = queue.pop();
    const x = current % frameWidth;
    const y = Math.floor(current / frameWidth);
    pixels.push([x, y]);
    for (const [dx, dy] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      const nextX = x + dx;
      const nextY = y + dy;
      if (
        nextX < 0 ||
        nextX >= frameWidth ||
        nextY < 0 ||
        nextY >= info.height
      ) {
        continue;
      }
      const localIndex = nextY * frameWidth + nextX;
      const offset = pixelOffset(
        info,
        seed.frame * frameWidth + nextX,
        nextY,
      );
      if (
        !seen[localIndex] &&
        isNeutral(data, offset, seed.minBrightness, seed.maxChroma)
      ) {
        seen[localIndex] = 1;
        queue.push(localIndex);
      }
    }
  }
  for (const [x, y] of pixels) {
    clearPixel(data, pixelOffset(info, seed.frame * frameWidth + x, y));
  }
  return pixels.length;
}

function removeAlphaComponent(data, info, frameWidth, seed) {
  const startOffset = pixelOffset(
    info,
    seed.frame * frameWidth + seed.x,
    seed.y,
  );
  if (data[startOffset + 3] === 0) {
    throw new Error(
      `Alpha seed is transparent at frame ${seed.frame + 1} (${seed.x},${seed.y}).`,
    );
  }

  const seen = new Uint8Array(frameWidth * info.height);
  const queue = [seed.y * frameWidth + seed.x];
  seen[queue[0]] = 1;
  const pixels = [];
  while (queue.length) {
    const current = queue.pop();
    const x = current % frameWidth;
    const y = Math.floor(current / frameWidth);
    pixels.push([x, y]);
    for (const [dx, dy] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      const nextX = x + dx;
      const nextY = y + dy;
      if (
        nextX < 0 ||
        nextX >= frameWidth ||
        nextY < 0 ||
        nextY >= info.height
      ) {
        continue;
      }
      const localIndex = nextY * frameWidth + nextX;
      const offset = pixelOffset(
        info,
        seed.frame * frameWidth + nextX,
        nextY,
      );
      if (!seen[localIndex] && data[offset + 3] > 0) {
        seen[localIndex] = 1;
        queue.push(localIndex);
      }
    }
  }
  if (pixels.length > seed.maxPixels) {
    throw new Error(
      `Refused to remove ${pixels.length}-pixel component at frame ${seed.frame + 1}; limit is ${seed.maxPixels}.`,
    );
  }
  for (const [x, y] of pixels) {
    clearPixel(data, pixelOffset(info, seed.frame * frameWidth + x, y));
  }
  return pixels.length;
}

function isProtected(refinement, frame, x, y) {
  return (refinement.protectedRects ?? []).some(
    (rect) =>
      rect.frame === frame &&
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom,
  );
}

function removeNeutralBoundary(data, info, frameWidth, frameCount, refinement) {
  const settings = refinement.boundary;
  if (!settings) {
    return 0;
  }
  let removed = 0;
  for (let pass = 0; pass < settings.passes; pass += 1) {
    const pending = [];
    for (let frame = 0; frame < frameCount; frame += 1) {
      for (let y = 0; y < info.height; y += 1) {
        for (let x = 0; x < frameWidth; x += 1) {
          if (isProtected(refinement, frame, x, y)) {
            continue;
          }
          const offset = pixelOffset(info, frame * frameWidth + x, y);
          if (
            !isNeutral(
              data,
              offset,
              settings.minBrightness,
              settings.maxChroma,
            )
          ) {
            continue;
          }
          const touchesTransparency = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
            [x - 1, y - 1],
            [x + 1, y - 1],
            [x - 1, y + 1],
            [x + 1, y + 1],
          ].some(([nextX, nextY]) => {
            if (
              nextX < 0 ||
              nextX >= frameWidth ||
              nextY < 0 ||
              nextY >= info.height
            ) {
              return true;
            }
            return (
              data[
                pixelOffset(info, frame * frameWidth + nextX, nextY) + 3
              ] === 0
            );
          });
          if (touchesTransparency) {
            pending.push(offset);
          }
        }
      }
    }
    for (const offset of pending) {
      clearPixel(data, offset);
    }
    removed += pending.length;
    if (!pending.length) {
      break;
    }
  }
  return removed;
}

function residualNeutralBoundary(data, info, frameWidth, frameCount) {
  let count = 0;
  let visible = 0;
  for (let frame = 0; frame < frameCount; frame += 1) {
    for (let y = 0; y < info.height; y += 1) {
      for (let x = 0; x < frameWidth; x += 1) {
        const offset = pixelOffset(info, frame * frameWidth + x, y);
        if (data[offset + 3] === 0) {
          continue;
        }
        visible += 1;
        if (!isNeutral(data, offset, 175, 24)) {
          continue;
        }
        const touchesTransparency = [
          [x - 1, y],
          [x + 1, y],
          [x, y - 1],
          [x, y + 1],
        ].some(([nextX, nextY]) => {
          if (
            nextX < 0 ||
            nextX >= frameWidth ||
            nextY < 0 ||
            nextY >= info.height
          ) {
            return true;
          }
          return (
            data[
              pixelOffset(info, frame * frameWidth + nextX, nextY) + 3
            ] === 0
          );
        });
        if (touchesTransparency) {
          count += 1;
        }
      }
    }
  }
  return { count, percentage: visible ? (count / visible) * 100 : 0 };
}

function markdownCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

async function processEntry(entry) {
  const inputPath = path.join(projectRoot, entry.input);
  const outputPath = path.join(outputRoot, entry.output);
  assertInside(projectRoot, inputPath);
  assertInside(outputRoot, outputPath);
  await mkdir(path.dirname(outputPath), { recursive: true });

  if (entry.refinement.copyOnly) {
    await copyFile(inputPath, outputPath);
    records.push({
      ...entry,
      outputPath: path.relative(projectRoot, outputPath).split(path.sep).join("/"),
      actualDimensions: entry.expectedOutputDimensions,
      removed: 0,
      removedPercentage: 0,
      residual: { count: 0, percentage: 0 },
      statusEstimate: entry.refinement.statusEstimate,
      nextAction: entry.refinement.nextAction,
    });
    return;
  }

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const expectedWidth = entry.targetFrameWidth * entry.frameCount;
  if (info.width !== expectedWidth || info.height !== entry.targetFrameHeight) {
    throw new Error(
      `${entry.input} is ${info.width}x${info.height}; expected ${expectedWidth}x${entry.targetFrameHeight}.`,
    );
  }

  let visibleBefore = 0;
  for (let offset = 3; offset < data.length; offset += info.channels) {
    if (data[offset] > 0) {
      visibleBefore += 1;
    }
  }
  let removed = 0;
  for (const seed of entry.refinement.neutralSeeds ?? []) {
    removed += removeNeutralComponent(data, info, entry.targetFrameWidth, seed);
  }
  for (const seed of entry.refinement.alphaComponentSeeds ?? []) {
    removed += removeAlphaComponent(data, info, entry.targetFrameWidth, seed);
  }
  removed += removeNeutralBoundary(
    data,
    info,
    entry.targetFrameWidth,
    entry.frameCount,
    entry.refinement,
  );

  const residual = residualNeutralBoundary(
    data,
    info,
    entry.targetFrameWidth,
    entry.frameCount,
  );
  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .png()
    .toFile(outputPath);

  records.push({
    ...entry,
    outputPath: path.relative(projectRoot, outputPath).split(path.sep).join("/"),
    actualDimensions: `${info.width}x${info.height}`,
    removed,
    removedPercentage: visibleBefore ? (removed / visibleBefore) * 100 : 0,
    residual,
    statusEstimate: entry.refinement.statusEstimate,
    nextAction: entry.refinement.nextAction,
  });
}

function buildReport() {
  const pass = records.filter((record) => record.statusEstimate === "pass").length;
  const review = records.filter(
    (record) => record.statusEstimate === "needs review",
  ).length;
  const fail = records.filter((record) => record.statusEstimate === "fail").length;
  return [
    "# Phase 71D.1.1 Refinement Report",
    "",
    `Run: ${new Date().toISOString()}`,
    "",
    "Phase 71D.1.1 applies source-aware cleanup settings to the corrected subset. Runtime integration remains prohibited.",
    "",
    "## Summary",
    "",
    `- Files processed: ${records.length}`,
    `- Post-preview status estimate: ${pass} pass, ${review} needs review, ${fail} fail`,
    "- Output root: `normalized_assets_refined/`",
    "- Source, failed, and fixed histories remain unchanged.",
    "- Pixel-removal percentages use visible input pixels as the denominator.",
    "",
    "## Processed Files",
    "",
    "| Source | Refined output | Actual | Expected | Frames | Strategy | Pixels removed | Residual neutral-edge estimate | Status estimate | Notes | Next action |",
    "| --- | --- | ---: | ---: | ---: | --- | ---: | ---: | --- | --- | --- |",
    ...records.map(
      (record) =>
        `| \`${record.source}\` | \`${record.outputPath}\` | ${record.actualDimensions} | ${record.expectedOutputDimensions} | ${record.frameCount} | ${markdownCell(record.refinement.strategy)} | ${record.removed} (${record.removedPercentage.toFixed(3)}%) | ${record.residual.count} (${record.residual.percentage.toFixed(3)}%) | ${record.statusEstimate} | ${markdownCell(`${record.refinement.notes} ${record.refinement.qaNotes}`)} | ${markdownCell(record.nextAction)} |`,
    ),
    "",
    "## Safety",
    "",
    "- Broad global bright-pixel deletion was not used.",
    "- Word Mage crystal/staff highlight zones are protected from boundary cleanup.",
    "- Fire and Elite Crystal Slime use detect-only handling because intended bright pixels overlap neutral residue colors.",
    "- Gatekeeper idle is copied unchanged as the clean comparison reference.",
    "- No file under `Asset/`, `normalized_assets/`, or `normalized_assets_fixed/` was overwritten.",
    "- No file was written to `src/assets/` and no runtime code was changed.",
    "",
  ].join("\n");
}

for (const entry of assetRefinementConfig) {
  await processEntry(entry);
}
await mkdir(outputRoot, { recursive: true });
await writeFile(
  path.join(outputRoot, "REFINEMENT_REPORT.md"),
  buildReport(),
  "utf8",
);
console.log(`Refinement complete: ${records.length} files processed.`);
console.log("Report: normalized_assets_refined/REFINEMENT_REPORT.md");
