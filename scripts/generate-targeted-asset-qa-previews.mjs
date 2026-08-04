import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const sourceRoot = path.join(projectRoot, "normalized_assets_refined_targeted");
const previewRoot = path.join(sourceRoot, "qa_previews");
const dark = { r: 22, g: 24, b: 28, alpha: 1 };
const light = { r: 244, g: 243, b: 238, alpha: 1 };

function assertInside(parent, child) {
  const relative = path.relative(parent, child);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Unsafe path outside ${parent}: ${child}`);
  }
}

function portablePath(absolutePath) {
  return path.relative(projectRoot, absolutePath).split(path.sep).join("/");
}

async function createGatekeeperPreview() {
  const relative = "bosses/gatekeeper/boss_gatekeeper_attack_sheet.png";
  const sourcePath = path.join(sourceRoot, relative);
  const outputPath = path.join(
    previewRoot,
    "bosses/gatekeeper/boss_gatekeeper_attack_sheet_qa_preview.png",
  );
  assertInside(sourceRoot, sourcePath);
  assertInside(previewRoot, outputPath);
  const frameWidth = 128;
  const frameHeight = 128;
  const frameCount = 4;
  const scale = 4;
  const padding = 24;
  const gap = 16;
  const rowGap = 32;
  const displayWidth = frameWidth * scale;
  const displayHeight = frameHeight * scale;
  const canvasWidth =
    padding * 2 + displayWidth * frameCount + gap * (frameCount - 1);
  const lightTop = padding + displayHeight + rowGap;
  const canvasHeight = lightTop + displayHeight + padding;
  const composites = [];

  for (let frame = 0; frame < frameCount; frame += 1) {
    const enlarged = await sharp(sourcePath)
      .extract({
        left: frame * frameWidth,
        top: 0,
        width: frameWidth,
        height: frameHeight,
      })
      .resize(displayWidth, displayHeight, {
        fit: "fill",
        kernel: sharp.kernel.nearest,
      })
      .png()
      .toBuffer();
    const left = padding + frame * (displayWidth + gap);
    composites.push({ input: enlarged, left, top: padding });
    composites.push({ input: enlarged, left, top: lightTop });
  }

  const lightRow = await sharp({
    create: {
      width: canvasWidth,
      height: displayHeight + padding,
      channels: 4,
      background: light,
    },
  })
    .png()
    .toBuffer();
  composites.unshift({ input: lightRow, left: 0, top: lightTop });
  await mkdir(path.dirname(outputPath), { recursive: true });
  await sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: dark,
    },
  })
    .composite(composites)
    .png()
    .toFile(outputPath);
  return portablePath(outputPath);
}

async function createCardPreview() {
  const relative = "ui/ui_vocabulary_card_frame.png";
  const sourcePath = path.join(sourceRoot, relative);
  const outputPath = path.join(
    previewRoot,
    "ui/ui_vocabulary_card_frame_qa_preview.png",
  );
  assertInside(sourceRoot, sourcePath);
  assertInside(previewRoot, outputPath);
  const metadata = await sharp(sourcePath).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error("Could not read targeted card-frame dimensions.");
  }
  const displayHeight = 720;
  const displayWidth = Math.round(
    (metadata.width / metadata.height) * displayHeight,
  );
  const padding = 24;
  const gap = 24;
  const panelWidth = displayWidth + padding * 2;
  const canvasWidth = panelWidth * 2 + gap;
  const canvasHeight = displayHeight + padding * 2;
  const enlarged = await sharp(sourcePath)
    .resize(displayWidth, displayHeight, {
      fit: "fill",
      kernel: sharp.kernel.nearest,
    })
    .png()
    .toBuffer();
  const lightPanel = await sharp({
    create: {
      width: panelWidth,
      height: canvasHeight,
      channels: 4,
      background: light,
    },
  })
    .png()
    .toBuffer();
  await mkdir(path.dirname(outputPath), { recursive: true });
  await sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: dark,
    },
  })
    .composite([
      { input: lightPanel, left: panelWidth + gap, top: 0 },
      { input: enlarged, left: padding, top: padding },
      { input: enlarged, left: panelWidth + gap + padding, top: padding },
    ])
    .png()
    .toFile(outputPath);
  return portablePath(outputPath);
}

console.log(await createGatekeeperPreview());
console.log(await createCardPreview());
