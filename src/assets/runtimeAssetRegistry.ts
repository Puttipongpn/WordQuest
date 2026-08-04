import gatekeeperIdleUrl from "./sprites/bosses/gatekeeper/boss_gatekeeper_idle_sheet.png";
import crystalSlimeIdleUrl from "./sprites/elites/crystal-slime/elite_crystal_slime_idle_sheet.png";
import batIdleUrl from "./sprites/monsters/bat/monster_bat_idle_sheet.png";
import goblinIdleUrl from "./sprites/monsters/goblin/monster_goblin_idle_sheet.png";
import slimeIdleUrl from "./sprites/monsters/slime/monster_slime_idle_sheet.png";
import wordMageIdleUrl from "./sprites/player/word-mage/player_word_mage_idle_sheet.png";

export type StaticSpriteAsset = {
  src: string;
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
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

const encounterIdleAssets: Readonly<Record<string, StaticSpriteAsset>> = {
  "monster-slime": idleSheet(slimeIdleUrl, 64),
  "monster-bat": idleSheet(batIdleUrl, 64),
  "monster-goblin": idleSheet(goblinIdleUrl, 64),
  "elite-monster-slime": idleSheet(crystalSlimeIdleUrl, 64),
  "boss-gatekeeper": idleSheet(gatekeeperIdleUrl, 128),
};

export function getEncounterIdleAsset(encounterId: string) {
  return encounterIdleAssets[encounterId];
}
