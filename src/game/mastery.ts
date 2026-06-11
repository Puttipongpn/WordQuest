import {
  MASTERY_LOW_DAMAGE_BONUS,
  MASTERY_MAX_DAMAGE_BONUS,
  MASTERY_MEDIUM_DAMAGE_BONUS,
  MAX_WORD_MASTERY,
} from "./balance";

export function getMasterySourceCardId(cardId: string) {
  return cardId.split("-copy-")[0];
}

export function getMasteryDamageBonus(masteryLevel: number) {
  if (masteryLevel >= MAX_WORD_MASTERY) {
    return MASTERY_MAX_DAMAGE_BONUS;
  }

  if (masteryLevel >= 3) {
    return MASTERY_MEDIUM_DAMAGE_BONUS;
  }

  if (masteryLevel >= 1) {
    return MASTERY_LOW_DAMAGE_BONUS;
  }

  return 0;
}

export function getMasteryStatusLabel(masteryLevel: number) {
  return masteryLevel >= MAX_WORD_MASTERY ? "Mastered" : "Learning";
}
