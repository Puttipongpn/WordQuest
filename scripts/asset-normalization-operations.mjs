import sharp from "sharp";

const padding = 4;

function pixelOffset(info, x, y) {
  return (y * info.width + x) * info.channels;
}

function isLightLowSaturation(red, green, blue) {
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  return minimum >= 214 && maximum - minimum <= 20;
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

export async function detectAndCleanBackground(sourcePath, cleanupMode) {
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
      if (connected[index]) {
        clearPixel(data, index * info.channels);
      }
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

export async function normalizeConfiguredAsset(sourcePath, entry) {
  const cleanup = await detectAndCleanBackground(sourcePath, entry.cleanupMode);
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

  const width = entry.targetFrameWidth * entry.frameCount;
  const height = entry.targetFrameHeight;
  const buffer = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toBuffer();

  return { buffer, width, height, cleanup };
}

function removeNeutralComponent(data, info, frameWidth, seed) {
  const startOffset = pixelOffset(info, seed.frame * frameWidth + seed.x, seed.y);
  if (!isNeutral(data, startOffset, seed.minBrightness, seed.maxChroma)) {
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
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
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
      const offset = pixelOffset(info, seed.frame * frameWidth + nextX, nextY);
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
  const startOffset = pixelOffset(info, seed.frame * frameWidth + seed.x, seed.y);
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
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
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
      const offset = pixelOffset(info, seed.frame * frameWidth + nextX, nextY);
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
          if (!isNeutral(data, offset, settings.minBrightness, settings.maxChroma)) {
            continue;
          }
          const touchesTransparency = [
            [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
            [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1],
          ].some(([nextX, nextY]) => {
            if (
              nextX < 0 ||
              nextX >= frameWidth ||
              nextY < 0 ||
              nextY >= info.height
            ) {
              return true;
            }
            return data[pixelOffset(info, frame * frameWidth + nextX, nextY) + 3] === 0;
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
        const touchesTransparency = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].some(
          ([nextX, nextY]) =>
            nextX < 0 ||
            nextX >= frameWidth ||
            nextY < 0 ||
            nextY >= info.height ||
            data[pixelOffset(info, frame * frameWidth + nextX, nextY) + 3] === 0,
        );
        if (touchesTransparency) {
          count += 1;
        }
      }
    }
  }
  return { count, percentage: visible ? (count / visible) * 100 : 0 };
}

export async function refineNormalizedBuffer(inputBuffer, entry) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const expectedWidth = entry.targetFrameWidth * entry.frameCount;
  if (info.width !== expectedWidth || info.height !== entry.targetFrameHeight) {
    throw new Error(
      `Normalized buffer is ${info.width}x${info.height}; expected ${expectedWidth}x${entry.targetFrameHeight}.`,
    );
  }

  let visibleBefore = 0;
  for (let offset = 3; offset < data.length; offset += info.channels) {
    if (data[offset] > 0) {
      visibleBefore += 1;
    }
  }

  let removed = 0;
  if (!entry.refinement.copyOnly) {
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
  }

  const residual = residualNeutralBoundary(
    data,
    info,
    entry.targetFrameWidth,
    entry.frameCount,
  );
  const buffer = entry.refinement.copyOnly
    ? inputBuffer
    : await sharp(data, {
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
    removed,
    removedPercentage: visibleBefore ? (removed / visibleBefore) * 100 : 0,
    residual,
  };
}
