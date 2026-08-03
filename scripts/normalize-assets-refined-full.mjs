import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
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
const sourceRoot = path.join(projectRoot, "Asset");
const outputRoot = path.join(projectRoot, "normalized_assets_refined_full");
const reportPath = path.join(outputRoot, "FULL_REFINED_NORMALIZATION_REPORT.md");
const records = [];

const preservedAssets = [
  {
    source: "Asset/ui/ui_vocabulary_card_frame.png",
    output: "ui/ui_vocabulary_card_frame.png",
    assetType: "ui-card-frame",
    sourceLayout: "single-image",
    frameCount: 1,
    strategy: "preserve source dimensions; no automated cleanup",
    qaNeed: "Check alpha/background cleanliness, text-safe inset, mobile readability, and responsive card use.",
    manualCleanup: "Likely; source preview/checkerboard contamination must be confirmed manually.",
    regenerate: "Regenerate from a true transparent source if baked preview pixels cannot be isolated safely.",
  },
  {
    source: "Asset/backgrounds/background_dungeon_battle_01.png",
    output: "backgrounds/background_dungeon_battle_01.png",
    assetType: "background",
    sourceLayout: "single-image",
    frameCount: 1,
    strategy: "preserve source dimensions; no automated cleanup",
    qaNeed: "Check responsive crop, battle readability, style consistency, and mobile composition.",
    manualCleanup: "No automatic cleanup; style/crop decisions remain manual.",
    regenerate: "Only if Human Visual QA rejects the source style, crop, or readability.",
  },
];

const knownWarnings = new Map([
  [
    "Asset/player/player_word_mage_cast_attack_sheet.png",
    ["Later cast frames need boundary clipping and six-frame cadence review."],
  ],
  [
    "Asset/monsters/bat/monster_bat_defeat_sheet.png",
    ["Explicit nonuniform source regions are applied; verify wing and particle ownership in Human Visual QA."],
  ],
  [
    "Asset/monsters/goblin/monster_goblin_attack_sheet.png",
    ["Attack pixels near source frame edges require Human Visual QA."],
  ],
  [
    "Asset/monsters/goblin/monster_goblin_defeat_sheet.png",
    ["Explicit nonuniform source regions are applied; verify ear, body, staff, and particle ownership in Human Visual QA."],
  ],
  [
    "Asset/effects/effect_wind_sheet.png",
    ["Weak contrast remains a source-polish concern, especially on light backgrounds."],
  ],
  [
    "Asset/effects/effect_fire_sheet.png",
    ["Hard-alpha flame glow and pale particles remain a Human Visual QA concern."],
  ],
  [
    "Asset/bosses/gatekeeper/boss_gatekeeper_hit_sheet.png",
    ["Hit scale must be compared with Gatekeeper idle, attack, and defeat."],
  ],
]);

function portablePath(absolutePath) {
  return path.relative(projectRoot, absolutePath).split(path.sep).join("/");
}

function assertInside(parent, child) {
  const relative = path.relative(parent, child);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Unsafe path outside ${portablePath(parent)}: ${child}`);
  }
}

function percentage(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function markdownCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
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

async function writeConfiguredAsset(entry) {
  const sourcePath = path.join(projectRoot, entry.source);
  const outputPath = path.join(outputRoot, entry.output);
  assertInside(sourceRoot, sourcePath);
  assertInside(outputRoot, outputPath);
  const warnings = [...(knownWarnings.get(entry.source) ?? [])];

  try {
    const normalized = await normalizeConfiguredAsset(sourcePath, entry);
    if (!normalized.cleanup.cleanupApplied && normalized.cleanup.sourceOpaque) {
      warnings.push(
        "Conservative edge-connected source cleanup was not applied because its safety gate did not pass.",
      );
    }
    if (!normalized.cleanup.probableCheckerboard && normalized.cleanup.sourceOpaque) {
      warnings.push(
        "A probable edge-connected light preview background was not detected; inspect transparency manually.",
      );
    }
    const refined = await refineNormalizedBuffer(normalized.buffer, entry);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await sharp(refined.buffer).png().toFile(outputPath);

    records.push({
      status: "output created",
      source: entry.source,
      outputPath: portablePath(outputPath),
      assetType: entry.assetType,
      sourceDimensions: `${normalized.cleanup.width}x${normalized.cleanup.height}`,
      actualDimensions: `${refined.width}x${refined.height}`,
      expectedDimensions: entry.expectedOutputDimensions,
      frameCount: entry.frameCount,
      strategy: `${normalized.sourceRegionStrategy}; ${entry.cleanupMode}; ${entry.refinement.strategy}`,
      cleanupSummary: `${normalized.cleanup.cleanupApplied ? "source cleanup applied" : normalized.cleanup.sourceOpaque ? "source cleanup not applied" : "existing source alpha preserved"}; ${refined.removed} normalized pixels removed; ${refined.residual.count} residual neutral-edge estimate`,
      warnings,
      humanQa: entry.refinement.nextAction,
      manualCleanup:
        warnings.length || refined.residual.count
          ? "Review required; clean only confirmed localized contamination."
          : "No automatic requirement; decide after Human Visual QA.",
      regenerate:
        warnings.some((warning) => warning.includes("source frame-boundary")) ||
        (!normalized.cleanup.cleanupApplied && normalized.cleanup.sourceOpaque)
          ? "Consider true-transparent/source regeneration if manual correction is unsafe."
          : "Not automatically required; decide after Human Visual QA.",
      sourceCleanup: normalized.cleanup.cleanupApplied,
      sourceCleanupRatio: normalized.cleanup.connectedRatio,
      refinedRemoved: refined.removed,
      residual: refined.residual.count,
    });
  } catch (error) {
    records.push({
      status: "skipped",
      source: entry.source,
      outputPath: portablePath(outputPath),
      assetType: entry.assetType,
      sourceDimensions: "unknown",
      actualDimensions: "not output",
      expectedDimensions: entry.expectedOutputDimensions,
      frameCount: entry.frameCount,
      strategy: `${entry.cleanupMode}; ${entry.refinement.strategy}`,
      cleanupSummary: "not completed",
      warnings: [error.message],
      humanQa: "No output available; resolve processing error.",
      manualCleanup: "Review source and explicit configuration.",
      regenerate: "Regenerate source only if configuration/manual repair cannot resolve the error.",
    });
  }
}

async function copyPreservedAsset(entry) {
  const sourcePath = path.join(projectRoot, entry.source);
  const outputPath = path.join(outputRoot, entry.output);
  assertInside(sourceRoot, sourcePath);
  assertInside(outputRoot, outputPath);

  try {
    const metadata = await sharp(sourcePath).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error("Could not read source dimensions.");
    }
    await mkdir(path.dirname(outputPath), { recursive: true });
    await copyFile(sourcePath, outputPath);
    const dimensions = `${metadata.width}x${metadata.height}`;
    records.push({
      status: "output created",
      source: entry.source,
      outputPath: portablePath(outputPath),
      assetType: entry.assetType,
      sourceDimensions: dimensions,
      actualDimensions: dimensions,
      expectedDimensions: `preserve ${dimensions}`,
      frameCount: entry.frameCount,
      strategy: entry.strategy,
      cleanupSummary: "pixel-identical source copy",
      warnings: [entry.qaNeed],
      humanQa: entry.qaNeed,
      manualCleanup: entry.manualCleanup,
      regenerate: entry.regenerate,
    });
  } catch (error) {
    records.push({
      status: "skipped",
      source: entry.source,
      outputPath: portablePath(outputPath),
      assetType: entry.assetType,
      sourceDimensions: "unknown",
      actualDimensions: "not output",
      expectedDimensions: "preserve source dimensions",
      frameCount: entry.frameCount,
      strategy: entry.strategy,
      cleanupSummary: "not completed",
      warnings: [error.message],
      humanQa: "No output available; resolve copy error.",
      manualCleanup: "Review source file.",
      regenerate: "Only if the source file is invalid.",
    });
  }
}

async function copyEventAssets() {
  const eventRoot = path.join(sourceRoot, "events");
  const eventPaths = await listPngFilesRecursive(eventRoot);
  for (const sourcePath of eventPaths) {
    const relative = path.relative(eventRoot, sourcePath);
    await copyPreservedAsset({
      source: portablePath(sourcePath),
      output: path.join("events", relative).split(path.sep).join("/"),
      assetType: "event-illustration",
      sourceLayout: "single-image",
      frameCount: 1,
      strategy: "preserve source dimensions; no automated cleanup",
      qaNeed: "Check overlay composition, anti-spoiler safety, responsive crop, and mobile readability.",
      manualCleanup: "No automatic cleanup; overlay/crop decisions remain manual.",
      regenerate: "Only if Human Visual QA rejects transparency, composition, or readability.",
    });
  }
  return eventPaths.length;
}

function buildReport(eventCount) {
  const created = records.filter((record) => record.status === "output created");
  const skipped = records.filter((record) => record.status === "skipped");
  const warned = records.filter((record) => record.warnings.length > 0);
  const nonuniformRegions = records.filter((record) =>
    record.strategy.startsWith("explicit nonuniform regions"),
  );
  const manual = records.filter(
    (record) => !record.manualCleanup.startsWith("No automatic requirement"),
  );
  const regenerate = records.filter(
    (record) => !record.regenerate.startsWith("Not automatically required") &&
      !record.regenerate.startsWith("Only if Human Visual QA"),
  );
  return [
    "# Full Refined Normalization Report",
    "",
    `Run: ${new Date().toISOString()}`,
    "",
    "Phase 71D.3 runs the refined source-aware pipeline across the full organized source set after Human acceptance of the 10-file refined subset. These are normalized candidates, not runtime assets.",
    "",
    "## Summary",
    "",
    `- Files attempted: ${records.length}`,
    `- Files successfully output: ${created.length}`,
    `- Files skipped: ${skipped.length}`,
    `- Files with warnings: ${warned.length}`,
    `- Files using explicit nonuniform source regions: ${nonuniformRegions.length}`,
    `- Event illustrations found: ${eventCount}`,
    "- Output root: `normalized_assets_refined_full/`",
    "- Every output requires a new Human Visual QA pass before runtime integration planning.",
    "- `src/assets/` remains absent/unused and runtime integration remains prohibited.",
    "",
    "## Output Inventory",
    "",
    "| Status | Source | Output | Source size | Actual | Expected | Frames | Cleanup strategy | Cleanup result | Warnings | Human QA | Manual cleanup | Regenerate true-transparent source? |",
    "| --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- | --- |",
    ...records.map(
      (record) =>
        `| ${record.status} | \`${record.source}\` | \`${record.outputPath}\` | ${record.sourceDimensions} | ${record.actualDimensions} | ${record.expectedDimensions} | ${record.frameCount} | ${markdownCell(record.strategy)} | ${markdownCell(record.cleanupSummary)} | ${markdownCell(record.warnings.join(" ")) || "None"} | ${markdownCell(record.humanQa)} | ${markdownCell(record.manualCleanup)} | ${markdownCell(record.regenerate)} |`,
    ),
    "",
    "## Files Requiring Human QA",
    "",
    ...created.map((record) => `- \`${record.outputPath}\`: ${record.humanQa}`),
    "",
    "## Files Requiring Manual Cleanup Review",
    "",
    ...(manual.length
      ? manual.map((record) => `- \`${record.outputPath}\`: ${record.manualCleanup}`)
      : ["- None identified automatically; Human Visual QA may still add localized work."]),
    "",
    "## Source Regeneration Watchlist",
    "",
    ...(regenerate.length
      ? regenerate.map((record) => `- \`${record.source}\`: ${record.regenerate}`)
      : ["- None identified automatically."]),
    "",
    "## Preserved And Deferred Assets",
    "",
    "- Vocabulary card frame and dungeon background are copied at source dimensions with no destructive cleanup.",
    eventCount
      ? "- Event illustrations are copied at source dimensions and remain outside runtime integration."
      : "- No event illustration PNGs were present under `Asset/events/`; no event preview can be generated in this run.",
    "- Missing player defend, hurt, and victory sheets were not synthesized; only existing organized source files were attempted.",
    "",
    "## Safety",
    "",
    "- Original files under `Asset/` were read only and remain unchanged.",
    "- Existing `normalized_assets/`, `normalized_assets_fixed/`, and `normalized_assets_refined/` histories were not overwritten.",
    "- Broad global bright-pixel deletion was not used.",
    "- Intentional glow, highlights, cream clothing, book pages, staff/crystal highlights, particles, and sparkles use protected or detect-only handling where configured.",
    "- No files were written to `src/assets/`; no React imports, asset manifest, animation playback, gameplay, save, combat, progression, deployment, or runtime asset code changed.",
    "",
  ].join("\n");
}

async function main() {
  for (const entry of fullAssetRefinementConfig) {
    await writeConfiguredAsset(entry);
  }
  for (const entry of preservedAssets) {
    await copyPreservedAsset(entry);
  }
  const eventCount = await copyEventAssets();
  await mkdir(outputRoot, { recursive: true });
  await writeFile(reportPath, buildReport(eventCount), "utf8");

  const created = records.filter((record) => record.status === "output created").length;
  const skipped = records.filter((record) => record.status === "skipped").length;
  console.log(`Phase 71D.3 full refined normalization complete: ${created} output, ${skipped} skipped.`);
  console.log(`Report: ${portablePath(reportPath)}`);
}

await main();
