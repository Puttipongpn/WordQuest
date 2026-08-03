const sheet = (
  source,
  assetType,
  frameCount,
  targetFrameWidth,
  targetFrameHeight,
  baselineMode,
  notes,
) => ({
  source,
  output: source.replace(/^Asset\//, ""),
  assetType,
  sourceLayout: "horizontal-strip",
  frameCount,
  targetFrameWidth,
  targetFrameHeight,
  baselineMode,
  expectedOutputDimensions: `${targetFrameWidth * frameCount}x${targetFrameHeight}`,
  notes,
  cleanupMode: "conservative-checkerboard-remove",
});

const icon = (source, notes) => ({
  source,
  output: source.replace(/^Asset\//, ""),
  assetType: "ui-icon",
  sourceLayout: "single-image",
  frameCount: 1,
  targetFrameWidth: 64,
  targetFrameHeight: 64,
  baselineMode: "centered",
  expectedOutputDimensions: "64x64",
  notes,
  cleanupMode: "conservative-checkerboard-remove",
});

export const assetNormalizationConfig = [
  sheet("Asset/player/player_word_mage_idle_sheet.png", "player-sheet", 4, 64, 64, "grounded", "Canonical Word Mage idle anchor."),
  sheet("Asset/player/player_word_mage_walk_sheet.png", "player-sheet", 6, 64, 64, "grounded", "Explicit six-frame player walk override."),
  sheet("Asset/player/player_word_mage_cast_attack_sheet.png", "player-sheet", 6, 64, 64, "grounded", "Explicit six-frame cast override; later frames still need edge QA."),

  sheet("Asset/monsters/slime/monster_slime_idle_sheet.png", "monster-sheet", 4, 64, 64, "grounded", "Four frames despite the source sheet's 3:1 overall aspect ratio."),
  sheet("Asset/monsters/slime/monster_slime_attack_sheet.png", "monster-sheet", 4, 64, 64, "grounded", "Four frames despite the source sheet's 3:1 overall aspect ratio."),
  sheet("Asset/monsters/slime/monster_slime_hit_sheet.png", "monster-sheet", 2, 64, 64, "grounded", "Explicit two-frame hit override; scale and spacing require visual QA."),
  sheet("Asset/monsters/slime/monster_slime_defeat_sheet.png", "monster-sheet", 4, 64, 64, "grounded", "Standard four-frame monster action."),

  sheet("Asset/monsters/bat/monster_bat_idle_sheet.png", "monster-sheet", 4, 64, 64, "hover", "Four frames despite the source sheet's 3:1 overall aspect ratio."),
  sheet("Asset/monsters/bat/monster_bat_attack_sheet.png", "monster-sheet", 4, 64, 64, "hover", "Standard four-frame monster action."),
  sheet("Asset/monsters/bat/monster_bat_hit_sheet.png", "monster-sheet", 2, 64, 64, "hover", "Explicit two-frame hit override; scale and spacing require visual QA."),
  sheet("Asset/monsters/bat/monster_bat_defeat_sheet.png", "monster-sheet", 4, 64, 64, "hover", "Known source frame-boundary problems may require regeneration."),

  sheet("Asset/monsters/goblin/monster_goblin_idle_sheet.png", "monster-sheet", 4, 64, 64, "grounded", "Standard four-frame monster action."),
  sheet("Asset/monsters/goblin/monster_goblin_attack_sheet.png", "monster-sheet", 4, 64, 64, "grounded", "Source action pixels require frame-edge visual QA."),
  sheet("Asset/monsters/goblin/monster_goblin_hit_sheet.png", "monster-sheet", 2, 64, 64, "grounded", "Explicit two-frame hit override; scale and spacing require visual QA."),
  sheet("Asset/monsters/goblin/monster_goblin_defeat_sheet.png", "monster-sheet", 4, 64, 64, "grounded", "Known source frame-boundary problems may require regeneration."),

  sheet("Asset/effects/effect_earth_sheet.png", "effect-sheet", 4, 64, 64, "lower", "Earth remains lower/grounded."),
  sheet("Asset/effects/effect_fire_sheet.png", "effect-sheet", 4, 64, 64, "centered", "Standard centered four-frame effect."),
  sheet("Asset/effects/effect_shield_block_sheet.png", "effect-sheet", 4, 64, 64, "centered", "Preserve the book-like barrier silhouette."),
  sheet("Asset/effects/effect_upgrade_spark_sheet.png", "effect-sheet", 4, 64, 64, "centered", "Standard centered four-frame effect."),
  sheet("Asset/effects/effect_water_sheet.png", "effect-sheet", 4, 64, 64, "centered", "Standard centered four-frame effect."),
  sheet("Asset/effects/effect_wind_sheet.png", "effect-sheet", 4, 64, 64, "centered", "Weak contrast remains a source-polish concern."),

  sheet("Asset/elites/crystal-slime/elite_crystal_slime_idle_sheet.png", "elite-sheet", 4, 64, 64, "grounded", "Standard four-frame elite idle action."),
  sheet("Asset/elites/crystal-slime/elite_crystal_slime_attack_sheet.png", "elite-sheet", 4, 64, 64, "grounded", "Standard four-frame elite attack action."),
  sheet("Asset/elites/crystal-slime/elite_crystal_slime_hit_sheet.png", "elite-sheet", 2, 64, 64, "grounded", "Explicit two-frame hit override; expected output is 128x64."),
  sheet("Asset/elites/crystal-slime/elite_crystal_slime_defeat_sheet.png", "elite-sheet", 4, 64, 64, "grounded", "Standard four-frame elite defeat action."),

  sheet("Asset/bosses/gatekeeper/boss_gatekeeper_idle_sheet.png", "boss-sheet", 4, 128, 128, "grounded", "Standard four-frame Gatekeeper idle action."),
  sheet("Asset/bosses/gatekeeper/boss_gatekeeper_attack_sheet.png", "boss-sheet", 4, 128, 128, "grounded", "Standard four-frame Gatekeeper attack action."),
  sheet("Asset/bosses/gatekeeper/boss_gatekeeper_hit_sheet.png", "boss-sheet", 2, 128, 128, "grounded", "Explicit two-frame hit override; expected output is 256x128."),
  sheet("Asset/bosses/gatekeeper/boss_gatekeeper_defeat_sheet.png", "boss-sheet", 4, 128, 128, "grounded", "Standard four-frame Gatekeeper defeat action."),

  icon("Asset/ui/ui_gold_coin.png", "Single 64x64 icon; remove only edge-connected light preview pixels."),
  icon("Asset/ui/ui_heart_hp.png", "Single 64x64 icon; remove only edge-connected light preview pixels."),
  icon("Asset/ui/ui_shield.png", "Single 64x64 icon; remove only edge-connected light preview pixels."),
];

export const fixPassSources = new Set([
  "Asset/player/player_word_mage_idle_sheet.png",
  "Asset/player/player_word_mage_walk_sheet.png",
  "Asset/monsters/slime/monster_slime_idle_sheet.png",
  "Asset/monsters/slime/monster_slime_attack_sheet.png",
  "Asset/monsters/bat/monster_bat_idle_sheet.png",
  "Asset/monsters/goblin/monster_goblin_idle_sheet.png",
  "Asset/effects/effect_fire_sheet.png",
  "Asset/ui/ui_gold_coin.png",
  "Asset/bosses/gatekeeper/boss_gatekeeper_idle_sheet.png",
  "Asset/elites/crystal-slime/elite_crystal_slime_idle_sheet.png",
]);

export const refinementSettings = {
  "Asset/player/player_word_mage_idle_sheet.png": {
    strategy: "seeded neutral pockets, detached residue, and protected neutral boundary cleanup",
    neutralSeeds: [
      { frame: 1, x: 43, y: 28, minBrightness: 220, maxChroma: 18 },
      { frame: 3, x: 43, y: 28, minBrightness: 220, maxChroma: 18 },
    ],
    alphaComponentSeeds: [
      { frame: 0, x: 47, y: 29, maxPixels: 8 },
      { frame: 2, x: 47, y: 30, maxPixels: 8 },
    ],
    boundary: { passes: 2, minBrightness: 175, maxChroma: 20 },
    protectedRects: [
      { frame: 0, left: 51, top: 7, right: 60, bottom: 27 },
      { frame: 1, left: 50, top: 7, right: 59, bottom: 27 },
      { frame: 2, left: 50, top: 7, right: 60, bottom: 27 },
      { frame: 3, left: 48, top: 7, right: 58, bottom: 27 },
    ],
    notes: "Protect staff/crystal highlights while removing enclosed neutral pockets behind the arm and staff.",
    statusEstimate: "needs review",
    qaNotes: "Large white pockets are gone and intended bright details remain; a few isolated neutral fringe pixels still need localized review.",
    nextAction: "Perform localized per-pixel cleanup or regenerate true-alpha source before pass approval.",
  },
  "Asset/player/player_word_mage_walk_sheet.png": {
    strategy: "per-frame seeded neutral pockets, detached fragment removal, and protected neutral boundary cleanup",
    neutralSeeds: [
      { frame: 0, x: 44, y: 34, minBrightness: 220, maxChroma: 18 },
      { frame: 1, x: 42, y: 34, minBrightness: 220, maxChroma: 18 },
      { frame: 2, x: 42, y: 35, minBrightness: 220, maxChroma: 18 },
      { frame: 3, x: 36, y: 34, minBrightness: 220, maxChroma: 18 },
      { frame: 4, x: 35, y: 34, minBrightness: 220, maxChroma: 18 },
      { frame: 5, x: 39, y: 35, minBrightness: 220, maxChroma: 18 },
    ],
    alphaComponentSeeds: [
      { frame: 3, x: 59, y: 48, maxPixels: 12 },
      { frame: 4, x: 59, y: 50, maxPixels: 16 },
    ],
    boundary: { passes: 2, minBrightness: 175, maxChroma: 20 },
    protectedRects: [
      { frame: 0, left: 49, top: 18, right: 57, bottom: 30 },
      { frame: 1, left: 47, top: 18, right: 55, bottom: 30 },
      { frame: 2, left: 47, top: 18, right: 55, bottom: 30 },
      { frame: 3, left: 41, top: 18, right: 50, bottom: 30 },
      { frame: 4, left: 40, top: 18, right: 47, bottom: 30 },
      { frame: 5, left: 44, top: 18, right: 52, bottom: 31 },
    ],
    notes: "Protect staff/crystal highlights; remove repeated enclosed white pockets and confirmed right-edge fragments.",
    statusEstimate: "needs review",
    qaNotes: "Repeated white pockets and right-edge fragments are gone; minor neutral fringe remains and cadence should be rechecked after final cleanup.",
    nextAction: "Perform localized per-pixel cleanup, then repeat cadence and dark/light QA.",
  },
  "Asset/monsters/slime/monster_slime_idle_sheet.png": {
    strategy: "per-frame neutral boundary cleanup",
    boundary: { passes: 2, minBrightness: 150, maxChroma: 28 },
    notes: "Preserve saturated green/yellow highlights while removing neutral fringe pixels.",
    statusEstimate: "needs review",
    qaNotes: "Neutral-edge heuristic reaches zero and the silhouette is preserved; a final human edge check is still required.",
    nextAction: "Repeat focused Human QA before pass approval.",
  },
  "Asset/monsters/slime/monster_slime_attack_sheet.png": {
    strategy: "per-frame neutral boundary cleanup",
    boundary: { passes: 2, minBrightness: 150, maxChroma: 28 },
    notes: "Preserve the green attack trail and remove only neutral fringe pixels.",
    statusEstimate: "needs review",
    qaNotes: "Attack trail and frame isolation remain intact; the refined hard edge still needs final approval.",
    nextAction: "Repeat focused Human QA before pass approval.",
  },
  "Asset/monsters/bat/monster_bat_idle_sheet.png": {
    strategy: "detached fragment removal and per-frame neutral boundary cleanup",
    alphaComponentSeeds: [
      { frame: 1, x: 5, y: 42, maxPixels: 12 },
      { frame: 2, x: 59, y: 38, maxPixels: 12 },
    ],
    boundary: { passes: 2, minBrightness: 150, maxChroma: 28 },
    notes: "Remove confirmed detached side fragments while preserving the saturated purple silhouette.",
    statusEstimate: "needs review",
    qaNotes: "Detached side fragments are gone and the hover silhouette is preserved; gray-purple edge pixels remain visually ambiguous.",
    nextAction: "Repeat focused Human QA before pass approval.",
  },
  "Asset/monsters/goblin/monster_goblin_idle_sheet.png": {
    strategy: "inconsistent ground-residue removal and per-frame neutral boundary cleanup",
    alphaComponentSeeds: [{ frame: 1, x: 30, y: 59, maxPixels: 48 }],
    boundary: { passes: 2, minBrightness: 150, maxChroma: 28 },
    notes: "Treat the frame-2 ground strip as residue because it is neutral, detached, and inconsistent across the idle cycle.",
    statusEstimate: "needs review",
    qaNotes: "The detached ground strip is removed, but a short under-foot gray edge remains and requires intent confirmation.",
    nextAction: "Confirm shadow intent or remove the remaining localized under-foot residue.",
  },
  "Asset/effects/effect_fire_sheet.png": {
    strategy: "source-aware detect only",
    notes: "Do not remove pale pixels automatically; they overlap the intentional hot flame core and particles. Recheck hard-alpha glow on both backgrounds.",
    statusEstimate: "needs review",
    qaNotes: "Warm flame and particles are preserved unchanged; pale particles remain weak on light backgrounds and glow still uses hard alpha.",
    nextAction: "Regenerate or manually author true-alpha glow if softer falloff is required.",
  },
  "Asset/elites/crystal-slime/elite_crystal_slime_idle_sheet.png": {
    strategy: "source-aware detect only",
    notes: "Do not remove pale pixels automatically because neutral-looking highlights overlap intended sparkles and crystal lighting.",
    statusEstimate: "needs review",
    qaNotes: "Intentional sparkles and crystal highlights are preserved unchanged; pale edge pixels remain source-ambiguous.",
    nextAction: "Use source-aware manual review before removing any pale sparkle or highlight.",
  },
  "Asset/ui/ui_gold_coin.png": {
    strategy: "localized seeded neutral fringe removal",
    neutralSeeds: [
      { frame: 0, x: 7, y: 45, minBrightness: 170, maxChroma: 30 },
      { frame: 0, x: 7, y: 19, minBrightness: 200, maxChroma: 30 },
    ],
    notes: "Remove only the localized neutral left-edge fringe; preserve white and yellow highlights elsewhere.",
    statusEstimate: "needs review",
    qaNotes: "Five localized fringe pixels are removed and highlights remain; final 64px edge/readability review is still required.",
    nextAction: "Inspect at native 64px and clean only confirmed remaining fringe pixels.",
  },
  "Asset/bosses/gatekeeper/boss_gatekeeper_idle_sheet.png": {
    strategy: "clean reference copy",
    copyOnly: true,
    notes: "Keep unchanged as the Phase 71D.2 clean comparison reference.",
    statusEstimate: "pass",
    qaNotes: "Copied unchanged and remains clean on both backgrounds.",
    nextAction: "Keep as comparison reference; runtime integration remains prohibited.",
  },
};

export const assetRefinementConfig = assetNormalizationConfig
  .filter((entry) => fixPassSources.has(entry.source))
  .map((entry) => ({
    ...entry,
    input: `normalized_assets_fixed/${entry.output}`,
    refinement: refinementSettings[entry.source],
  }));

const conservativeBoundaryRefinement = {
  strategy: "conservative neutral-boundary cleanup after source background removal",
  boundary: { passes: 2, minBrightness: 150, maxChroma: 28 },
  notes: "Remove only neutral pixels touching transparency; preserve saturated sprite colors and highlights.",
  statusEstimate: "needs review",
  qaNotes: "This action was not part of the accepted 10-file subset and requires full-set Human Visual QA.",
  nextAction: "Inspect edge cleanliness, frame slicing, scale, baseline, and action cadence on dark and light backgrounds.",
};

const detectOnlyRefinement = {
  strategy: "source-aware detect only after source background removal",
  notes: "Do not remove additional bright or neutral pixels automatically because they may be intentional glow, highlights, particles, clothing, book pages, or crystal detail.",
  statusEstimate: "needs review",
  qaNotes: "Ambiguous bright pixels are preserved for Human Visual QA.",
  nextAction: "Review on dark and light backgrounds; use localized cleanup or a true-alpha regenerated source if contamination is confirmed.",
};

function defaultFullRefinement(entry) {
  if (entry.assetType === "monster-sheet") {
    return { ...conservativeBoundaryRefinement };
  }
  return { ...detectOnlyRefinement };
}

export const fullAssetRefinementConfig = assetNormalizationConfig.map((entry) => ({
  ...entry,
  refinement: refinementSettings[entry.source] ?? defaultFullRefinement(entry),
}));
