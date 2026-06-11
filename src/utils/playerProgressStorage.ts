import {
  defaultUnlockedDeckIds,
  getUnlockedDeckIdsForCompletedDecks,
} from "../game/deckProgression";
import type { SavedPlayerProgress, WordMasteryByCardId } from "../types";

const saveKey = "wordquest.playerProgress";

export const saveVersion = 1;

export function createDefaultPlayerProgress(): SavedPlayerProgress {
  return {
    version: saveVersion,
    unlockedDeckIds: defaultUnlockedDeckIds,
    completedDeckIds: [],
    wordMastery: {},
    statistics: {
      totalCorrectAnswers: 0,
      totalWrongAnswers: 0,
      bestMonstersDefeated: 0,
      bestAccuracy: 0,
      bestDamageDealt: 0,
      completedRuns: 0,
      failedRuns: 0,
    },
  };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function parseWordMastery(value: unknown): WordMasteryByCardId | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const entries = Object.entries(value);
  const parsedEntries: Array<[string, number]> = [];

  for (const [cardId, mastery] of entries) {
    if (
      typeof mastery !== "number" ||
      !Number.isFinite(mastery) ||
      mastery < 0 ||
      mastery > 5
    ) {
      return null;
    }

    parsedEntries.push([cardId, Math.floor(mastery)]);
  }

  return Object.fromEntries(parsedEntries);
}

function parseStatistics(
  value: unknown,
): SavedPlayerProgress["statistics"] | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const statistics = value as Record<string, unknown>;
  const totalCorrectAnswers = statistics.totalCorrectAnswers;
  const totalWrongAnswers = statistics.totalWrongAnswers;
  const bestMonstersDefeated =
    statistics.bestMonstersDefeated ?? statistics.bestMonsterDefeated;
  const bestAccuracy = statistics.bestAccuracy ?? 0;
  const bestDamageDealt = statistics.bestDamageDealt ?? 0;
  const completedRuns = statistics.completedRuns ?? 0;
  const failedRuns = statistics.failedRuns ?? 0;

  if (
    typeof totalCorrectAnswers !== "number" ||
    typeof totalWrongAnswers !== "number" ||
    typeof bestMonstersDefeated !== "number" ||
    typeof bestAccuracy !== "number" ||
    typeof bestDamageDealt !== "number" ||
    typeof completedRuns !== "number" ||
    typeof failedRuns !== "number" ||
    !Number.isFinite(totalCorrectAnswers) ||
    !Number.isFinite(totalWrongAnswers) ||
    !Number.isFinite(bestMonstersDefeated) ||
    !Number.isFinite(bestAccuracy) ||
    !Number.isFinite(bestDamageDealt) ||
    !Number.isFinite(completedRuns) ||
    !Number.isFinite(failedRuns) ||
    totalCorrectAnswers < 0 ||
    totalWrongAnswers < 0 ||
    bestMonstersDefeated < 0 ||
    bestAccuracy < 0 ||
    bestDamageDealt < 0 ||
    completedRuns < 0 ||
    failedRuns < 0
  ) {
    return null;
  }

  return {
    totalCorrectAnswers,
    totalWrongAnswers,
    bestMonstersDefeated,
    bestAccuracy,
    bestDamageDealt,
    completedRuns,
    failedRuns,
  };
}

function parseSavedProgress(value: unknown): SavedPlayerProgress | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const savedProgress = value as Record<string, unknown>;

  if (savedProgress.version !== saveVersion) {
    return null;
  }

  const unlockedDeckIds = savedProgress.unlockedDeckIds;
  const completedDeckIds = savedProgress.completedDeckIds;
  const wordMastery = parseWordMastery(savedProgress.wordMastery);
  const statistics = parseStatistics(savedProgress.statistics);

  if (
    !isStringArray(unlockedDeckIds) ||
    !isStringArray(completedDeckIds) ||
    !wordMastery ||
    !statistics
  ) {
    return null;
  }

  const normalizedUnlockedDeckIds = getUnlockedDeckIdsForCompletedDecks(
    completedDeckIds,
    unlockedDeckIds,
  );

  return {
    version: saveVersion,
    unlockedDeckIds: normalizedUnlockedDeckIds,
    completedDeckIds,
    wordMastery,
    statistics,
  };
}

export function loadPlayerProgress(): SavedPlayerProgress {
  if (typeof window === "undefined") {
    return createDefaultPlayerProgress();
  }

  try {
    const storedProgress = window.localStorage.getItem(saveKey);

    if (!storedProgress) {
      return createDefaultPlayerProgress();
    }

    const parsedProgress = parseSavedProgress(JSON.parse(storedProgress));

    return parsedProgress ?? createDefaultPlayerProgress();
  } catch {
    return createDefaultPlayerProgress();
  }
}

export function savePlayerProgress(progress: SavedPlayerProgress) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(saveKey, JSON.stringify(progress));
  } catch {
    // Ignore storage write failures so the game can continue in memory.
  }
}

export function resetSavedProgress() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(saveKey);
  } catch {
    // Ignore storage failures so reset can still clear in-memory state.
  }
}
