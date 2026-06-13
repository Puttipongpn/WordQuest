import {
  WORD_FATIGUE_FRESH_WEIGHT,
  WORD_FATIGUE_RESTING_FALLBACK_WEIGHT,
  WORD_FATIGUE_RESTING_THRESHOLD,
  WORD_FATIGUE_TIRED_THRESHOLD,
  WORD_FATIGUE_TIRED_WEIGHT,
  WORD_FATIGUE_USED_THRESHOLD,
  WORD_FATIGUE_USED_WEIGHT,
} from "./balance";
import type { WordCard } from "../types";

export type WordFatigueByWord = Record<string, number>;
export type WordFatigueState = "fresh" | "used" | "tired" | "resting";
export type WordFatigueSummary = Record<WordFatigueState, number>;

type SelectCardsWithFatigueOptions = {
  count: number;
  deck: WordCard[];
  excludeWords?: string[];
  seed: number;
  usageByWord: WordFatigueByWord;
};

export function normalizeWordForFatigue(word: string) {
  return word.trim().toLowerCase();
}

export function getWordFatigueState(usageCount: number): WordFatigueState {
  if (usageCount >= WORD_FATIGUE_RESTING_THRESHOLD) {
    return "resting";
  }

  if (usageCount >= WORD_FATIGUE_TIRED_THRESHOLD) {
    return "tired";
  }

  if (usageCount >= WORD_FATIGUE_USED_THRESHOLD) {
    return "used";
  }

  return "fresh";
}

export function getFatigueWeight(
  usageCount: number,
  fallbackMode = false,
) {
  const fatigueState = getWordFatigueState(usageCount);

  if (fatigueState === "fresh") {
    return WORD_FATIGUE_FRESH_WEIGHT;
  }

  if (fatigueState === "used") {
    return WORD_FATIGUE_USED_WEIGHT;
  }

  if (fatigueState === "tired") {
    return WORD_FATIGUE_TIRED_WEIGHT;
  }

  return fallbackMode ? WORD_FATIGUE_RESTING_FALLBACK_WEIGHT : 0;
}

export function incrementWordUsage(
  usageByWord: WordFatigueByWord,
  word: string,
) {
  const wordKey = normalizeWordForFatigue(word);

  return {
    ...usageByWord,
    [wordKey]: (usageByWord[wordKey] ?? 0) + 1,
  };
}

export function recoverWordEnergy(usageByWord: WordFatigueByWord) {
  const nextUsageByWord: WordFatigueByWord = {};

  for (const [word, usageCount] of Object.entries(usageByWord)) {
    const nextUsageCount = Math.max(usageCount - 1, 0);

    if (nextUsageCount > 0) {
      nextUsageByWord[word] = nextUsageCount;
    }
  }

  return nextUsageByWord;
}

export function getWordUsageCount(
  usageByWord: WordFatigueByWord,
  word: string,
) {
  return usageByWord[normalizeWordForFatigue(word)] ?? 0;
}

export function getWordEnergyLabel(usageCount: number) {
  const fatigueState = getWordFatigueState(usageCount);

  if (fatigueState === "fresh") {
    return "⚡ Fresh";
  }

  if (fatigueState === "used") {
    return "⚡ Used";
  }

  if (fatigueState === "tired") {
    return "⚡ Tired";
  }

  return "Low";
}

export function getWordEnergyFeedback(word: string, nextUsageCount: number) {
  const fatigueState = getWordFatigueState(nextUsageCount);

  if (fatigueState === "used") {
    return "";
  }

  if (fatigueState === "tired") {
    return `${word} is getting tired.`;
  }

  if (fatigueState === "resting") {
    return `${word} is low energy.`;
  }

  return "";
}

export function summarizeWordFatigue(
  cards: WordCard[],
  usageByWord: WordFatigueByWord,
): WordFatigueSummary {
  const summary: WordFatigueSummary = {
    fresh: 0,
    used: 0,
    tired: 0,
    resting: 0,
  };
  const countedWords = new Set<string>();

  for (const card of cards) {
    const wordKey = normalizeWordForFatigue(card.word);

    if (countedWords.has(wordKey)) {
      continue;
    }

    countedWords.add(wordKey);
    summary[getWordFatigueState(usageByWord[wordKey] ?? 0)] += 1;
  }

  return summary;
}

function seededRandom(seed: number) {
  const value = Math.sin(seed * 9301 + 49297) * 233280;

  return value - Math.floor(value);
}

function countDistinctNonRestingWords(
  cards: WordCard[],
  usageByWord: WordFatigueByWord,
) {
  const nonRestingWords = new Set<string>();

  for (const card of cards) {
    const wordKey = normalizeWordForFatigue(card.word);
    const usageCount = usageByWord[wordKey] ?? 0;

    if (getWordFatigueState(usageCount) !== "resting") {
      nonRestingWords.add(wordKey);
    }
  }

  return nonRestingWords.size;
}

export function selectCardsWithFatigue({
  count,
  deck,
  excludeWords = [],
  seed,
  usageByWord,
}: SelectCardsWithFatigueOptions) {
  const selectedCards: WordCard[] = [];
  const usedWords = new Set(excludeWords.map(normalizeWordForFatigue));

  for (let step = 0; step < count; step += 1) {
    const availableCards = deck.filter(
      (card) => !usedWords.has(normalizeWordForFatigue(card.word)),
    );

    if (availableCards.length === 0) {
      break;
    }

    const remainingCount = count - selectedCards.length;
    const fallbackMode =
      countDistinctNonRestingWords(availableCards, usageByWord) < remainingCount;
    const weightedCards = availableCards.map((card) => {
      const wordKey = normalizeWordForFatigue(card.word);

      return {
        card,
        weight: getFatigueWeight(usageByWord[wordKey] ?? 0, fallbackMode),
      };
    });
    const totalWeight = weightedCards.reduce(
      (total, item) => total + item.weight,
      0,
    );
    let selectedCard: WordCard;

    if (totalWeight <= 0) {
      selectedCard = availableCards[(seed + step) % availableCards.length];
    } else {
      let roll = seededRandom(seed + step + selectedCards.length + 1) * totalWeight;
      selectedCard = weightedCards[0].card;

      for (const item of weightedCards) {
        roll -= item.weight;

        if (roll <= 0) {
          selectedCard = item.card;
          break;
        }
      }
    }

    selectedCards.push(selectedCard);
    usedWords.add(normalizeWordForFatigue(selectedCard.word));
  }

  return selectedCards;
}
