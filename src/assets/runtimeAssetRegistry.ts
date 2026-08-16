import shieldBlockEffectUrl from "./effects/defense/effect_shield_block_sheet.png";
import earthEffectUrl from "./effects/elemental/effect_earth_sheet.png";
import fireEffectUrl from "./effects/elemental/effect_fire_sheet.png";
import waterEffectUrl from "./effects/elemental/effect_water_sheet.png";
import windEffectUrl from "./effects/elemental/effect_wind_sheet.png";
import upgradeSparkEffectUrl from "./effects/feedback/effect_upgrade_spark_sheet.png";
import gatekeeperAttackUrl from "./sprites/bosses/gatekeeper/boss_gatekeeper_attack_sheet.png";
import gatekeeperDefeatUrl from "./sprites/bosses/gatekeeper/boss_gatekeeper_defeat_sheet.png";
import gatekeeperHitUrl from "./sprites/bosses/gatekeeper/boss_gatekeeper_hit_sheet.png";
import gatekeeperIdleUrl from "./sprites/bosses/gatekeeper/boss_gatekeeper_idle_sheet.png";
import crystalSlimeAttackUrl from "./sprites/elites/crystal-slime/elite_crystal_slime_attack_sheet.png";
import crystalSlimeDefeatUrl from "./sprites/elites/crystal-slime/elite_crystal_slime_defeat_sheet.png";
import crystalSlimeHitUrl from "./sprites/elites/crystal-slime/elite_crystal_slime_hit_sheet.png";
import crystalSlimeIdleUrl from "./sprites/elites/crystal-slime/elite_crystal_slime_idle_sheet.png";
import batAttackUrl from "./sprites/monsters/bat/monster_bat_attack_sheet.png";
import batDefeatUrl from "./sprites/monsters/bat/monster_bat_defeat_sheet.png";
import batHitUrl from "./sprites/monsters/bat/monster_bat_hit_sheet.png";
import batIdleUrl from "./sprites/monsters/bat/monster_bat_idle_sheet.png";
import goblinAttackUrl from "./sprites/monsters/goblin/monster_goblin_attack_sheet.png";
import goblinDefeatUrl from "./sprites/monsters/goblin/monster_goblin_defeat_sheet.png";
import goblinHitUrl from "./sprites/monsters/goblin/monster_goblin_hit_sheet.png";
import goblinIdleUrl from "./sprites/monsters/goblin/monster_goblin_idle_sheet.png";
import slimeAttackUrl from "./sprites/monsters/slime/monster_slime_attack_sheet.png";
import slimeDefeatUrl from "./sprites/monsters/slime/monster_slime_defeat_sheet.png";
import slimeHitUrl from "./sprites/monsters/slime/monster_slime_hit_sheet.png";
import slimeIdleUrl from "./sprites/monsters/slime/monster_slime_idle_sheet.png";
import wordMageCastUrl from "./sprites/player/word-mage/player_word_mage_cast_attack_sheet.png";
import wordMageIdleUrl from "./sprites/player/word-mage/player_word_mage_idle_sheet.png";
import type { ElementType } from "../types";

export type StaticSpriteAsset = {
  src: string;
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
};

export type SpritesheetAnimationAsset = {
  assetId: string;
  file: string;
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
  animationType: "loop" | "one-shot";
  frameDurationMs: number;
  loop: boolean;
  reducedMotionFrame: number;
  fallbackIdentity: string;
  returnState: "idle" | "hold-final-frame";
};

export type ElementalEffectAnimationAsset = SpritesheetAnimationAsset & {
  element: ElementType;
  targetLayer: "enemy-portrait-overlay";
  fallbackBehavior: "skip";
  autoClear: true;
};

export type ShieldEffectAnimationAsset = SpritesheetAnimationAsset & {
  targetLayer: "player-portrait-overlay";
  fallbackBehavior: "skip";
  autoClear: true;
};

export type UpgradeSparkAnimationAsset = SpritesheetAnimationAsset & {
  targetLayer: "shop-card-icon-overlay";
  fallbackBehavior: "skip";
  autoClear: true;
};

function idleSheet(src: string, frameSize: number): StaticSpriteAsset {
  return {
    src,
    frameCount: 4,
    frameWidth: frameSize,
    frameHeight: frameSize,
  };
}

export const playerIdleAsset = idleSheet(wordMageIdleUrl, 64);

function oneShotAnimation(options: {
  assetId: string;
  fallbackIdentity: string;
  file: string;
  frameCount: number;
  frameDurationMs: number;
  frameSize: number;
  reducedMotionFrame: number;
  returnState?: SpritesheetAnimationAsset["returnState"];
}): SpritesheetAnimationAsset {
  return {
    assetId: options.assetId,
    file: options.file,
    frameCount: options.frameCount,
    frameWidth: options.frameSize,
    frameHeight: options.frameSize,
    animationType: "one-shot",
    frameDurationMs: options.frameDurationMs,
    loop: false,
    reducedMotionFrame: options.reducedMotionFrame,
    fallbackIdentity: options.fallbackIdentity,
    returnState: options.returnState ?? "idle",
  };
}

function elementalEffectAnimation(options: {
  assetId: string;
  element: ElementType;
  file: string;
}): ElementalEffectAnimationAsset {
  return {
    ...oneShotAnimation({
      assetId: options.assetId,
      file: options.file,
      frameCount: 4,
      frameSize: 64,
      frameDurationMs: 120,
      reducedMotionFrame: 2,
      fallbackIdentity: "",
    }),
    element: options.element,
    targetLayer: "enemy-portrait-overlay",
    fallbackBehavior: "skip",
    autoClear: true,
  };
}

export const shieldBlockEffectAnimation: ShieldEffectAnimationAsset = {
  ...oneShotAnimation({
    assetId: "effect_shield_block",
    file: shieldBlockEffectUrl,
    frameCount: 4,
    frameSize: 64,
    frameDurationMs: 120,
    reducedMotionFrame: 2,
    fallbackIdentity: "",
  }),
  targetLayer: "player-portrait-overlay",
  fallbackBehavior: "skip",
  autoClear: true,
};

export const upgradeSparkEffectAnimation: UpgradeSparkAnimationAsset = {
  ...oneShotAnimation({
    assetId: "effect_upgrade_spark",
    file: upgradeSparkEffectUrl,
    frameCount: 4,
    frameSize: 64,
    frameDurationMs: 120,
    reducedMotionFrame: 2,
    fallbackIdentity: "",
  }),
  targetLayer: "shop-card-icon-overlay",
  fallbackBehavior: "skip",
  autoClear: true,
};

export const playerCastAnimation = oneShotAnimation({
  assetId: "player_word_mage_cast_attack",
  file: wordMageCastUrl,
  frameCount: 6,
  frameSize: 64,
  frameDurationMs: 110,
  reducedMotionFrame: 3,
  fallbackIdentity: "Word Mage idle",
});

const encounterIdleAssets: Readonly<Record<string, StaticSpriteAsset>> = {
  "monster-slime": idleSheet(slimeIdleUrl, 64),
  "monster-bat": idleSheet(batIdleUrl, 64),
  "monster-goblin": idleSheet(goblinIdleUrl, 64),
  "elite-monster-slime": idleSheet(crystalSlimeIdleUrl, 64),
  "boss-gatekeeper": idleSheet(gatekeeperIdleUrl, 128),
};

const encounterHitAnimations: Readonly<
  Record<string, SpritesheetAnimationAsset>
> = {
  "monster-slime": oneShotAnimation({
    assetId: "monster_slime_hit",
    file: slimeHitUrl,
    frameCount: 2,
    frameSize: 64,
    frameDurationMs: 150,
    reducedMotionFrame: 1,
    fallbackIdentity: "Slime idle",
  }),
  "monster-bat": oneShotAnimation({
    assetId: "monster_bat_hit",
    file: batHitUrl,
    frameCount: 2,
    frameSize: 64,
    frameDurationMs: 150,
    reducedMotionFrame: 1,
    fallbackIdentity: "Bat idle",
  }),
  "monster-goblin": oneShotAnimation({
    assetId: "monster_goblin_hit",
    file: goblinHitUrl,
    frameCount: 2,
    frameSize: 64,
    frameDurationMs: 150,
    reducedMotionFrame: 1,
    fallbackIdentity: "Goblin idle",
  }),
  "elite-monster-slime": oneShotAnimation({
    assetId: "elite_crystal_slime_hit",
    file: crystalSlimeHitUrl,
    frameCount: 2,
    frameSize: 64,
    frameDurationMs: 150,
    reducedMotionFrame: 1,
    fallbackIdentity: "Elite Crystal Slime idle",
  }),
  "boss-gatekeeper": oneShotAnimation({
    assetId: "boss_gatekeeper_hit",
    file: gatekeeperHitUrl,
    frameCount: 2,
    frameSize: 128,
    frameDurationMs: 170,
    reducedMotionFrame: 1,
    fallbackIdentity: "Gatekeeper idle",
  }),
};

const encounterAttackAnimations: Readonly<
  Record<string, SpritesheetAnimationAsset>
> = {
  "monster-slime": oneShotAnimation({
    assetId: "monster_slime_attack",
    file: slimeAttackUrl,
    frameCount: 4,
    frameSize: 64,
    frameDurationMs: 120,
    reducedMotionFrame: 2,
    fallbackIdentity: "Slime idle",
  }),
  "monster-bat": oneShotAnimation({
    assetId: "monster_bat_attack",
    file: batAttackUrl,
    frameCount: 4,
    frameSize: 64,
    frameDurationMs: 120,
    reducedMotionFrame: 2,
    fallbackIdentity: "Bat idle",
  }),
  "monster-goblin": oneShotAnimation({
    assetId: "monster_goblin_attack",
    file: goblinAttackUrl,
    frameCount: 4,
    frameSize: 64,
    frameDurationMs: 120,
    reducedMotionFrame: 2,
    fallbackIdentity: "Goblin idle",
  }),
  "elite-monster-slime": oneShotAnimation({
    assetId: "elite_crystal_slime_attack",
    file: crystalSlimeAttackUrl,
    frameCount: 4,
    frameSize: 64,
    frameDurationMs: 120,
    reducedMotionFrame: 2,
    fallbackIdentity: "Elite Crystal Slime idle",
  }),
  "boss-gatekeeper": oneShotAnimation({
    assetId: "boss_gatekeeper_attack",
    file: gatekeeperAttackUrl,
    frameCount: 4,
    frameSize: 128,
    frameDurationMs: 140,
    reducedMotionFrame: 2,
    fallbackIdentity: "Gatekeeper idle",
  }),
};

const encounterDefeatAnimations: Readonly<
  Record<string, SpritesheetAnimationAsset>
> = {
  "monster-slime": oneShotAnimation({
    assetId: "monster_slime_defeat",
    file: slimeDefeatUrl,
    frameCount: 4,
    frameSize: 64,
    frameDurationMs: 150,
    reducedMotionFrame: 3,
    fallbackIdentity: "Slime idle",
    returnState: "hold-final-frame",
  }),
  "monster-bat": oneShotAnimation({
    assetId: "monster_bat_defeat",
    file: batDefeatUrl,
    frameCount: 4,
    frameSize: 64,
    frameDurationMs: 150,
    reducedMotionFrame: 3,
    fallbackIdentity: "Bat idle",
    returnState: "hold-final-frame",
  }),
  "monster-goblin": oneShotAnimation({
    assetId: "monster_goblin_defeat",
    file: goblinDefeatUrl,
    frameCount: 4,
    frameSize: 64,
    frameDurationMs: 150,
    reducedMotionFrame: 3,
    fallbackIdentity: "Goblin idle",
    returnState: "hold-final-frame",
  }),
  "elite-monster-slime": oneShotAnimation({
    assetId: "elite_crystal_slime_defeat",
    file: crystalSlimeDefeatUrl,
    frameCount: 4,
    frameSize: 64,
    frameDurationMs: 150,
    reducedMotionFrame: 3,
    fallbackIdentity: "Elite Crystal Slime idle",
    returnState: "hold-final-frame",
  }),
  "boss-gatekeeper": oneShotAnimation({
    assetId: "boss_gatekeeper_defeat",
    file: gatekeeperDefeatUrl,
    frameCount: 4,
    frameSize: 128,
    frameDurationMs: 180,
    reducedMotionFrame: 3,
    fallbackIdentity: "Gatekeeper idle",
    returnState: "hold-final-frame",
  }),
};

const elementalEffectAnimations: Readonly<
  Record<ElementType, ElementalEffectAnimationAsset>
> = {
  fire: elementalEffectAnimation({
    assetId: "effect_fire",
    element: "fire",
    file: fireEffectUrl,
  }),
  water: elementalEffectAnimation({
    assetId: "effect_water",
    element: "water",
    file: waterEffectUrl,
  }),
  wind: elementalEffectAnimation({
    assetId: "effect_wind",
    element: "wind",
    file: windEffectUrl,
  }),
  earth: elementalEffectAnimation({
    assetId: "effect_earth",
    element: "earth",
    file: earthEffectUrl,
  }),
};

export function getEncounterIdleAsset(encounterId: string) {
  return encounterIdleAssets[encounterId];
}

export function getEncounterHitAnimation(encounterId: string) {
  return encounterHitAnimations[encounterId];
}

export function getEncounterAttackAnimation(encounterId: string) {
  return encounterAttackAnimations[encounterId];
}

export function getEncounterDefeatAnimation(encounterId: string) {
  return encounterDefeatAnimations[encounterId];
}

export function getElementalEffectAnimation(element: ElementType) {
  return elementalEffectAnimations[element];
}
