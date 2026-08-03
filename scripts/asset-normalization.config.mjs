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
