import type { VocabularyDeck } from "../types";

export const starterDeckId = "starter-deck";
export const foodDeckId = "food-deck";
export const travelDeckId = "travel-deck";
export const natureDeckId = "nature-deck";

export const defaultUnlockedDeckIds = [starterDeckId];

export const deckUnlockRules = [
  { completedDeckId: starterDeckId, unlockedDeckId: foodDeckId },
  { completedDeckId: foodDeckId, unlockedDeckId: travelDeckId },
  { completedDeckId: travelDeckId, unlockedDeckId: natureDeckId },
];

export function getNextUnlockedDeckId(deckId: string) {
  return deckUnlockRules.find((rule) => rule.completedDeckId === deckId)
    ?.unlockedDeckId;
}

export function getRequiredCompletedDeckId(deckId: string) {
  return deckUnlockRules.find((rule) => rule.unlockedDeckId === deckId)
    ?.completedDeckId;
}

export function getUnlockedDeckIdsForCompletedDecks(
  completedDeckIds: string[],
  existingUnlockedDeckIds: string[] = [],
) {
  const unlockedDeckIds = new Set([
    ...defaultUnlockedDeckIds,
    ...existingUnlockedDeckIds,
  ]);

  for (const rule of deckUnlockRules) {
    if (completedDeckIds.includes(rule.completedDeckId)) {
      unlockedDeckIds.add(rule.unlockedDeckId);
    }
  }

  return [...unlockedDeckIds];
}

export function getDeckRequirementText(
  deckId: string,
  availableDecks: VocabularyDeck[],
) {
  const requiredDeckId = getRequiredCompletedDeckId(deckId);

  if (!requiredDeckId) {
    return "Unlocked by default.";
  }

  const requiredDeck = availableDecks.find((deck) => deck.id === requiredDeckId);

  return `Complete ${requiredDeck?.name ?? "the previous deck"} to unlock.`;
}

export function getNextUnlockTarget(
  completedDeckIds: string[],
  availableDecks: VocabularyDeck[],
) {
  const nextRule = deckUnlockRules.find(
    (rule) => !completedDeckIds.includes(rule.completedDeckId),
  );

  if (!nextRule) {
    return "More decks coming soon.";
  }

  const completedDeck = availableDecks.find(
    (deck) => deck.id === nextRule.completedDeckId,
  );
  const unlockedDeck = availableDecks.find(
    (deck) => deck.id === nextRule.unlockedDeckId,
  );

  return `Complete ${completedDeck?.name ?? "the current deck"} to unlock ${
    unlockedDeck?.name ?? "the next deck"
  }.`;
}
