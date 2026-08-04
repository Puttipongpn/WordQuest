import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { fullAssetRefinementConfig } from "./asset-normalization.config.mjs";
import {
  normalizeConfiguredAsset,
  refineNormalizedBuffer,
} from "./asset-normalization-operations.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const outputRoot = path.join(projectRoot, "normalized_assets_refined_targeted");
const gatekeeperSource =
  "Asset/bosses/gatekeeper/boss_gatekeeper_attack_sheet.png";
const cardFrameSource = "Asset/ui/ui_vocabulary_card_frame.png";

function assertInside(parent, child) {
  const relative = path.relative(parent, child);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Unsafe output path outside ${parent}: ${child}`);
  }
}

function portablePath(absolutePath) {
  return path.relative(projectRoot, absolutePath).split(path.sep).join("/");
}

function isEdgeBackground(red, green, blue, alpha) {
  return (
    alpha > 5 &&
    Math.min(red, green, blue) >= 214 &&
    Math.max(red, green, blue) - Math.min(red, green, blue) <= 20
  );
}

async function normalizeGatekeeperAttack() {
  const entry = fullAssetRefinementConfig.find(
    (candidate) => candidate.source === gatekeeperSource,
  );
  if (!entry?.sourceFrameRegions) {
    throw new Error("Gatekeeper attack explicit sourceFrameRegions are missing.");
  }

  const sourcePath = path.join(projectRoot, entry.source);
  const outputPath = path.join(outputRoot, entry.output);
  assertInside(outputRoot, outputPath);
  const normalized = await normalizeConfiguredAsset(sourcePath, entry);
  const refined = await refineNormalizedBuffer(normalized.buffer, entry);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await sharp(refined.buffer).png().toFile(outputPath);

  return {
    source: entry.source,
    output: portablePath(outputPath),
    dimensions: `${refined.width}x${refined.height}`,
    frames: entry.frameCount,
    regions: entry.sourceFrameRegions.map(
      (region) => `${region.left}-${region.left + region.width - 1}`,
    ),
    sourceRegionStrategy: normalized.sourceRegionStrategy,
    sourceCleanupApplied: normalized.cleanup.cleanupApplied,
    refinementPixelsRemoved: refined.removed,
  };
}

async function cleanCardFrameBackground() {
  const sourcePath = path.join(projectRoot, cardFrameSource);
  const outputPath = path.join(
    outputRoot,
    "ui/ui_vocabulary_card_frame.png",
  );
  assertInside(outputRoot, outputPath);
  const { data, info } = await sharp(sourcePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixelCount = info.width * info.height;
  const candidate = new Uint8Array(pixelCount);
  const connected = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  let queueStart = 0;
  let queueEnd = 0;
  let edgeSamples = 0;
  let edgeCandidates = 0;

  for (let index = 0; index < pixelCount; index += 1) {
    const offset = index * info.channels;
    candidate[index] = isEdgeBackground(
      data[offset],
      data[offset + 1],
      data[offset + 2],
      data[offset + 3],
    )
      ? 1
      : 0;
  }

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
    for (const delta of neighbors) {
      if ((delta === -1 && x === 0) || (delta === 1 && x === info.width - 1)) {
        continue;
      }
      if (
        (delta === -info.width && y === 0) ||
        (delta === info.width && y === info.height - 1)
      ) {
        continue;
      }
      const neighbor = index + delta;
      if (candidate[neighbor] && !connected[neighbor]) {
        connected[neighbor] = 1;
        queue[queueEnd] = neighbor;
        queueEnd += 1;
      }
    }
  }

  const edgeCandidateRatio = edgeCandidates / Math.max(1, edgeSamples);
  const removedRatio = queueEnd / pixelCount;
  if (
    edgeCandidateRatio < 0.95 ||
    removedRatio < 0.05 ||
    removedRatio > 0.35
  ) {
    throw new Error(
      `Card cleanup safety gate failed: edge=${edgeCandidateRatio.toFixed(4)}, removed=${removedRatio.toFixed(4)}.`,
    );
  }

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

  await mkdir(path.dirname(outputPath), { recursive: true });
  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .png()
    .toFile(outputPath);

  return {
    source: cardFrameSource,
    output: portablePath(outputPath),
    dimensions: `${info.width}x${info.height}`,
    edgeCandidateRatio,
    transparentPixelsCreated: queueEnd,
    transparentRatio: removedRatio,
    strategy:
      "remove only light low-saturation pixels connected to the outer canvas edge",
  };
}

const results = [
  await normalizeGatekeeperAttack(),
  await cleanCardFrameBackground(),
];
console.log(JSON.stringify(results, null, 2));
