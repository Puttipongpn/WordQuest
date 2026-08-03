import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import {
  assetNormalizationConfig,
  assetRefinementConfig,
  fixPassSources,
  fullAssetRefinementConfig,
} from "./asset-normalization.config.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const refinedMode = process.argv.includes("--refined");
const fullRefinedMode = process.argv.includes("--full-refined");
const sourceRoot = path.join(
  projectRoot,
  fullRefinedMode
    ? "normalized_assets_refined_full"
    : refinedMode
      ? "normalized_assets_refined"
      : "normalized_assets_fixed",
);
const previewRoot = path.join(sourceRoot, "qa_previews");
const padding = 24;
const frameGap = 16;
const rowGap = 32;

function assertInside(parent, child) {
  const relative = path.relative(parent, child);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Unsafe path outside ${parent}: ${child}`);
  }
}

async function createPreview(entry) {
  const sourcePath = path.join(sourceRoot, entry.output);
  const parsed = path.parse(entry.output);
  const outputPath = path.join(
    previewRoot,
    parsed.dir,
    `${parsed.name}_qa_preview.png`,
  );
  assertInside(sourceRoot, sourcePath);
  assertInside(previewRoot, outputPath);

  const metadata = await sharp(sourcePath).metadata();
  const expectedWidth = entry.targetFrameWidth * entry.frameCount;
  if (
    metadata.width !== expectedWidth ||
    metadata.height !== entry.targetFrameHeight
  ) {
    throw new Error(
      `${entry.output} is ${metadata.width}x${metadata.height}; expected ${expectedWidth}x${entry.targetFrameHeight}.`,
    );
  }

  const scale = entry.targetFrameWidth >= 128 ? 4 : 8;
  const displayWidth = entry.targetFrameWidth * scale;
  const displayHeight = entry.targetFrameHeight * scale;
  const canvasWidth =
    padding * 2 +
    displayWidth * entry.frameCount +
    frameGap * (entry.frameCount - 1);
  const lightRowTop = padding + displayHeight + rowGap;
  const canvasHeight = lightRowTop + displayHeight + padding;
  const composites = [];

  const lightBackground = await sharp({
    create: {
      width: canvasWidth,
      height: displayHeight + padding,
      channels: 4,
      background: { r: 244, g: 243, b: 238, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
  composites.push({ input: lightBackground, left: 0, top: lightRowTop });

  for (let index = 0; index < entry.frameCount; index += 1) {
    const enlargedFrame = await sharp(sourcePath)
      .extract({
        left: index * entry.targetFrameWidth,
        top: 0,
        width: entry.targetFrameWidth,
        height: entry.targetFrameHeight,
      })
      .resize(displayWidth, displayHeight, {
        fit: "fill",
        kernel: sharp.kernel.nearest,
      })
      .png()
      .toBuffer();
    const left = padding + index * (displayWidth + frameGap);
    composites.push({ input: enlargedFrame, left, top: padding });
    composites.push({ input: enlargedFrame, left, top: lightRowTop });
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 22, g: 24, b: 28, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toFile(outputPath);

  return path.relative(projectRoot, outputPath).split(path.sep).join("/");
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

async function createPreservedPreview(sourcePath) {
  const relative = path.relative(sourceRoot, sourcePath);
  const parsed = path.parse(relative);
  const outputPath = path.join(
    previewRoot,
    parsed.dir,
    `${parsed.name}_qa_preview.png`,
  );
  assertInside(sourceRoot, sourcePath);
  assertInside(previewRoot, outputPath);
  const metadata = await sharp(sourcePath).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Could not read dimensions for ${relative}.`);
  }
  const maxWidth = 1536;
  const maxHeight = 864;
  const scale = Math.min(1, maxWidth / metadata.width, maxHeight / metadata.height);
  const width = Math.max(1, Math.round(metadata.width * scale));
  const height = Math.max(1, Math.round(metadata.height * scale));
  await mkdir(path.dirname(outputPath), { recursive: true });
  await sharp(sourcePath)
    .resize(width, height, { fit: "fill", kernel: sharp.kernel.nearest })
    .png()
    .toFile(outputPath);
  return path.relative(projectRoot, outputPath).split(path.sep).join("/");
}

const subset = fullRefinedMode
  ? fullAssetRefinementConfig
  : refinedMode
    ? assetRefinementConfig
    : assetNormalizationConfig.filter((entry) => fixPassSources.has(entry.source));
const expectedCount = fullRefinedMode
  ? assetNormalizationConfig.length
  : fixPassSources.size;
if (subset.length !== expectedCount) {
  throw new Error(
    `Preview config mismatch: expected ${expectedCount}, found ${subset.length}.`,
  );
}

for (const entry of subset) {
  console.log(await createPreview(entry));
}

if (fullRefinedMode) {
  const preservedPreviewSources = [
    ...(await listPngFilesRecursive(path.join(sourceRoot, "backgrounds"))).slice(0, 1),
    ...(await listPngFilesRecursive(path.join(sourceRoot, "events"))),
  ];
  for (const sourcePath of preservedPreviewSources) {
    console.log(await createPreservedPreview(sourcePath));
  }
}
