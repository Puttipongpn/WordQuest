import { useEffect, useMemo, useRef, useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import {
  Badge,
  Button,
  CardPanel,
  ProgressBar,
  StatCard,
} from "../components/ui";
import { sampleBoss, sampleBosses, sampleMonsters } from "../data";
import {
  ALTAR_HP_COST,
  BOSS_MONSTER_REQUIREMENT,
  CAMPFIRE_HEAL_AMOUNT,
  CURSED_DOOR_GOLD_REWARD,
  CURSED_DOOR_HP_COST,
  EARTH_ATTACK_REDUCTION,
  ELITE_ATTACK_BONUS,
  ELITE_ENCOUNTER_WEIGHT,
  ELITE_GOLD_BONUS,
  ELITE_HP_MULTIPLIER,
  EVENT_ATTACK_UPGRADE_AMOUNT,
  EVENT_CARD_SHIELD_UPGRADE_AMOUNT,
  EVENT_ENCOUNTER_WEIGHT,
  FIRE_BONUS_DAMAGE,
  INITIAL_SHIELD,
  MONSTER_ENCOUNTER_WEIGHT,
  MYSTIC_WELL_HEAL_AMOUNT,
  MYSTIC_WELL_SHIELD_GAIN,
  PLAYER_MAX_HP,
  SHRINE_HEAL_AMOUNT,
  SHRINE_SHIELD_GAIN,
  SHOP_INTERVAL,
  SIGNPOST_GOLD_REWARD,
  TREASURE_GOLD_REWARD,
  WATER_SHIELD_GAIN,
  WIND_DEFEAT_GOLD_BONUS,
  WORD_CHOICE_TIME_LIMIT,
  WORD_MATCH_TIME_LIMIT,
  WORD_SCRAMBLE_TIME_LIMIT,
} from "../game/balance";
import {
  getWordEnergyFeedback,
  getWordEnergyLabel,
  getWordUsageCount,
  selectCardsWithFatigue,
  summarizeWordFatigue,
  type WordFatigueByWord,
} from "../game/cardFatigue";
import {
  getMasteryDamageBonus,
  getMasterySourceCardId,
  getMasteryStatusLabel,
} from "../game/mastery";
import type {
  ActiveRunSummary,
  Monster,
  Boss,
  RunProgressState,
  RunStatistics,
  ScreenName,
  VocabularyDeck,
  WordCard,
  WordMasteryByCardId,
} from "../types";
import { playSound } from "../utils/soundManager";

type DungeonProps = {
  currentRunDeck: WordCard[];
  isSelectedDeckCompleted: boolean;
  onAbandonRun: () => void;
  onActiveRunStarted: () => void;
  onCompleteSelectedDeck: () => CompletionReward;
  onAddRandomElementToRunCard: () => { word: string; element: string } | null;
  onAddShieldToRandomRunCard: (amount?: number) => string | null;
  onIncreaseWordFatigue: (word: string) => void;
  onGainRunGold: (amount: number) => void;
  onMonsterDefeated: (options?: { isElite?: boolean; bonusGold?: number }) => void;
  onNavigate: (screen: ScreenName) => void;
  onQaAddRunGold: (amount: number) => void;
  onQaSetRunProgress: (monstersDefeated: number) => void;
  onRecordRunEnded: (
    outcome: "completed" | "failed",
    finalRunStatistics: RunStatistics,
  ) => void;
  onResetRun: () => void;
  onResetWordFatigue: () => void;
  onRecoverWordEnergy: () => void;
  onRunSnapshotChange: (
    snapshot: Pick<
      ActiveRunSummary,
      "playerHp" | "shield" | "encounterName" | "statusLabel"
    >,
  ) => void;
  onUpgradeRandomRunCardAttack: (amount?: number) => string | null;
  onUpdateRunStatistics: (nextStatistics: RunStatistics) => void;
  runGold: number;
  runProgress: RunProgressState;
  runStatistics: RunStatistics;
  selectedDeck: VocabularyDeck;
  wordFatigue: WordFatigueByWord;
  wordMastery: WordMasteryByCardId;
};

type CompletionReward = {
  completedMessage: string;
  unlockMessage: string;
};

type BattleMiniGameType = "word-choice" | "word-match" | "word-scramble";
type EncounterType = "monster" | "elite" | "event";
type DungeonEventId =
  | "treasure-chest"
  | "healing-shrine"
  | "strange-altar"
  | "campfire"
  | "lost-backpack"
  | "ancient-library"
  | "element-fountain"
  | "cursed-door"
  | "wandering-trainer"
  | "mystic-well"
  | "forgotten-signpost";
type BattleStatus =
  | "encounter-intro"
  | "fighting"
  | "event"
  | "monster-defeated"
  | "run-failed"
  | "run-complete";
type WordChoicePromptType =
  | "english-to-thai"
  | "thai-to-english"
  | "sentence-cloze";

type WordChoiceQuestion = {
  card: WordCard;
  promptType: WordChoicePromptType;
  choices: WordCard[];
};

type WordMatchQuestion = {
  cards: WordCard[];
  meanings: WordCard[];
};

type WordScrambleOption = {
  card: WordCard;
  scrambledWord: string;
};

type WordScrambleQuestion = {
  options: WordScrambleOption[];
};

type BattleLog = {
  tone: "neutral" | "success" | "danger";
  message: string;
  triggeredCard?: WordCard;
  baseDamageDealt?: number;
  elementBonusDamage?: number;
  damageDealt?: number;
  masteryLevel?: number;
  masteryBonusDamage?: number;
  damageTaken?: number;
  hpDamageTaken?: number;
  shieldAbsorbed?: number;
  cardShieldGained?: number;
  waterShieldGained?: number;
  shieldGained?: number;
  earthAttackReduction?: number;
  windGoldGained?: number;
  wordEnergyFeedback?: string;
  wordUsageCount?: number;
  effectsSummary?: string;
  rewardSummary?: string;
};

type BattleResultAction = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

type DungeonEvent = {
  id: DungeonEventId;
  icon: string;
  title: string;
  description: string;
  options: Array<{
    id: string;
    label: string;
    description: string;
  }>;
};

type DungeonEventOption = DungeonEvent["options"][number];

const battleMiniGames: BattleMiniGameType[] = [
  "word-choice",
  "word-match",
  "word-scramble",
];
const ENABLE_QA_HELPERS = import.meta.env.DEV;
const qaHelperLabel = ["QA", "Helper"].join(" ");
const qaCorrectLabel = ["QA", "Correct"].join(" ");
const qaWrongLabel = ["QA", "Wrong"].join(" ");
const developmentOnlyLabel = ["Development", "only"].join(" ");
const forceRunFailedLabel = ["Force", "Run", "Failed"].join(" ");
const forceRunCompleteLabel = ["Force", "Run", "Complete"].join(" ");
const wordChoicePromptTypes: WordChoicePromptType[] = [
  "thai-to-english",
  "sentence-cloze",
  "english-to-thai",
];

const dungeonEvents: DungeonEvent[] = [
  {
    id: "treasure-chest",
    icon: "✨",
    title: "Treasure Chest",
    description:
      "A warm golden chest hums beside the dungeon path. The lock opens when you approach.",
    options: [
      {
        id: "gold",
        label: "Take the coins",
        description: `Gain +${TREASURE_GOLD_REWARD} temporary gold.`,
      },
      {
        id: "attack",
        label: "Polish a card",
        description: `Upgrade a random current-run card attack by +${EVENT_ATTACK_UPGRADE_AMOUNT}.`,
      },
    ],
  },
  {
    id: "healing-shrine",
    icon: "✨",
    title: "Healing Shrine",
    description:
      "A quiet shrine glows with gentle blue light. It offers a small blessing before the next encounter.",
    options: [
      {
        id: "heal",
        label: "Recover HP",
        description: `Recover ${SHRINE_HEAL_AMOUNT} HP.`,
      },
      {
        id: "shield",
        label: "Raise ward",
        description: `Gain ${SHRINE_SHIELD_GAIN} shield.`,
      },
    ],
  },
  {
    id: "strange-altar",
    icon: "✨",
    title: "Strange Altar",
    description:
      "A strange altar offers unstable magic. Its runes promise power, but the price is real.",
    options: [
      {
        id: "element",
        label: "Touch the altar",
        description: `Lose ${ALTAR_HP_COST} HP and add a random element to a random current-run card.`,
      },
      {
        id: "leave",
        label: "Leave",
        description: "Continue without changing the run.",
      },
    ],
  },
  {
    id: "campfire",
    icon: "🔥",
    title: "Campfire",
    description:
      "A small campfire crackles in a safe alcove. The warmth steadies your thoughts.",
    options: [
      {
        id: "heal",
        label: "Rest",
        description: `Recover ${CAMPFIRE_HEAL_AMOUNT} HP.`,
      },
      {
        id: "focus",
        label: "Focus words",
        description: "Recover current-run Word Energy by 1 step.",
      },
      {
        id: "leave",
        label: "Move on",
        description: "Continue without changing the run.",
      },
    ],
  },
  {
    id: "lost-backpack",
    icon: "🎒",
    title: "Lost Backpack",
    description:
      "An old backpack rests under loose stones. A few supplies are still useful.",
    options: [
      {
        id: "gold",
        label: "Take spare coins",
        description: `Gain +${TREASURE_GOLD_REWARD} temporary gold.`,
      },
      {
        id: "attack",
        label: "Use a whetstone",
        description: `Upgrade a random current-run card attack by +${EVENT_ATTACK_UPGRADE_AMOUNT}.`,
      },
      {
        id: "leave",
        label: "Leave it",
        description: "Continue without changing the run.",
      },
    ],
  },
  {
    id: "ancient-library",
    icon: "📚",
    title: "Ancient Library",
    description:
      "Dusty shelves whisper with old vocabulary. You can take one quick lesson before moving on.",
    options: [
      {
        id: "attack",
        label: "Study battle verbs",
        description: `Upgrade a random current-run card attack by +${EVENT_ATTACK_UPGRADE_AMOUNT}.`,
      },
      {
        id: "gold",
        label: "Find a bookmark",
        description: `Gain +${SIGNPOST_GOLD_REWARD} temporary gold.`,
      },
      {
        id: "leave",
        label: "Close the book",
        description: "Continue without changing the run.",
      },
    ],
  },
  {
    id: "element-fountain",
    icon: "⛲",
    title: "Element Fountain",
    description:
      "Colored water circles a stone basin. One splash can enchant a current-run card.",
    options: [
      {
        id: "element",
        label: "Draw an element",
        description: "Add a random element to a random current-run card.",
      },
      {
        id: "card-shield",
        label: "Bottle a ward",
        description: `Add Shield +${EVENT_CARD_SHIELD_UPGRADE_AMOUNT} to a random current-run card.`,
      },
      {
        id: "leave",
        label: "Leave the fountain",
        description: "Continue without changing the run.",
      },
    ],
  },
  {
    id: "cursed-door",
    icon: "🚪",
    title: "Cursed Door",
    description:
      "A sealed door offers a bargain. The handle is cold, but treasure waits beyond it.",
    options: [
      {
        id: "gold",
        label: "Pay blood for gold",
        description: `Lose ${CURSED_DOOR_HP_COST} HP and gain +${CURSED_DOOR_GOLD_REWARD} gold.`,
      },
      {
        id: "attack",
        label: "Pay blood for power",
        description: `Lose ${CURSED_DOOR_HP_COST} HP and upgrade a random current-run card attack by +${EVENT_ATTACK_UPGRADE_AMOUNT}.`,
      },
      {
        id: "leave",
        label: "Step away",
        description: "Continue without changing the run.",
      },
    ],
  },
  {
    id: "wandering-trainer",
    icon: "🧙",
    title: "Wandering Trainer",
    description:
      "A traveling tutor offers one quick drill before vanishing deeper into the dungeon.",
    options: [
      {
        id: "attack",
        label: "Practice strikes",
        description: `Upgrade a random current-run card attack by +${EVENT_ATTACK_UPGRADE_AMOUNT}.`,
      },
      {
        id: "focus",
        label: "Practice recall",
        description: "Recover current-run Word Energy by 1 step.",
      },
      {
        id: "leave",
        label: "Save your strength",
        description: "Continue without changing the run.",
      },
    ],
  },
  {
    id: "mystic-well",
    icon: "💧",
    title: "Mystic Well",
    description:
      "A deep well reflects your next battle before it happens. The water feels protective.",
    options: [
      {
        id: "shield",
        label: "Raise a barrier",
        description: `Gain ${MYSTIC_WELL_SHIELD_GAIN} shield.`,
      },
      {
        id: "heal",
        label: "Drink carefully",
        description: `Recover ${MYSTIC_WELL_HEAL_AMOUNT} HP.`,
      },
      {
        id: "leave",
        label: "Leave the well",
        description: "Continue without changing the run.",
      },
    ],
  },
  {
    id: "forgotten-signpost",
    icon: "🪧",
    title: "Forgotten Signpost",
    description:
      "A half-buried sign points toward safer paths and a few coins hidden nearby.",
    options: [
      {
        id: "gold",
        label: "Search the path",
        description: `Gain +${SIGNPOST_GOLD_REWARD} temporary gold.`,
      },
      {
        id: "shield",
        label: "Prepare defense",
        description: `Gain ${SHRINE_SHIELD_GAIN} shield.`,
      },
      {
        id: "leave",
        label: "Keep walking",
        description: "Continue without changing the run.",
      },
    ],
  },
];

function formatQaHelperMessage(message: string) {
  return `${qaHelperLabel}: ${message}`;
}

function chooseBattleMiniGame(): BattleMiniGameType {
  const randomIndex = Math.floor(Math.random() * battleMiniGames.length);

  return battleMiniGames[randomIndex];
}

function chooseEncounterType(options?: { allowEvent?: boolean }): EncounterType {
  const totalWeight =
    MONSTER_ENCOUNTER_WEIGHT + EVENT_ENCOUNTER_WEIGHT + ELITE_ENCOUNTER_WEIGHT;
  const roll = Math.random() * totalWeight;

  if (roll < MONSTER_ENCOUNTER_WEIGHT) {
    return "monster";
  }

  if (
    options?.allowEvent !== false &&
    roll < MONSTER_ENCOUNTER_WEIGHT + EVENT_ENCOUNTER_WEIGHT
  ) {
    return "event";
  }

  return "elite";
}

function getMonsterForIndex(index: number): Monster {
  return sampleMonsters[index % sampleMonsters.length];
}

function createEliteMonster(monster: Monster): Monster {
  const eliteMaxHp = Math.round(monster.maxHp * ELITE_HP_MULTIPLIER);

  return {
    ...monster,
    id: `elite-${monster.id}`,
    name: `Elite ${monster.name}`,
    hp: eliteMaxHp,
    maxHp: eliteMaxHp,
    attack: monster.attack + ELITE_ATTACK_BONUS,
    imagePlaceholder: `👑 ${monster.imagePlaceholder}`,
  };
}

function chooseDungeonEvent(seed: number) {
  return dungeonEvents[seed % dungeonEvents.length];
}

function chooseBoss(seed: number) {
  return sampleBosses[seed % sampleBosses.length] ?? sampleBoss;
}

function buildChoices(
  card: WordCard,
  cardIndex: number,
  deck: WordCard[],
  usageByWord: WordFatigueByWord,
) {
  const distractors = selectCardsWithFatigue({
    count: 3,
    deck,
    excludeWords: [card.word],
    seed: cardIndex,
    usageByWord,
  });

  return [card, ...distractors].sort((left, right) =>
    left.meaningTh.localeCompare(right.meaningTh),
  );
}

function chooseWordChoicePromptType(seed: number): WordChoicePromptType {
  return wordChoicePromptTypes[seed % wordChoicePromptTypes.length];
}

function formatWordChoicePromptType(promptType: WordChoicePromptType) {
  if (promptType === "thai-to-english") {
    return "Thai Meaning → English Word";
  }

  if (promptType === "sentence-cloze") {
    return "Example Sentence Cloze";
  }

  return "English Word → Thai Meaning";
}

function blankTargetWord(sentence: string, word: string) {
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const wordPattern = new RegExp(`\\b${escapedWord}\\b`, "i");

  if (wordPattern.test(sentence)) {
    return sentence.replace(wordPattern, "____");
  }

  return `${sentence} (____ = ${word.length} letters)`;
}

function buildWordChoiceQuestion(
  seed: number,
  deck: WordCard[],
  usageByWord: WordFatigueByWord,
): WordChoiceQuestion {
  const card = selectCardsWithFatigue({
    count: 1,
    deck,
    seed,
    usageByWord,
  })[0] ?? deck[seed % deck.length];

  return {
    card,
    promptType: chooseWordChoicePromptType(seed),
    choices: buildChoices(card, seed + 1, deck, usageByWord),
  };
}

function buildWordMatchQuestion(
  seed: number,
  deck: WordCard[],
  usageByWord: WordFatigueByWord,
): WordMatchQuestion {
  const cards = selectCardsWithFatigue({
    count: 3,
    deck,
    seed,
    usageByWord,
  });
  const meanings = [...cards].sort((left, right) =>
    seed % 2 === 0
      ? right.meaningTh.localeCompare(left.meaningTh)
      : left.meaningTh.localeCompare(right.meaningTh),
  );

  return { cards, meanings };
}

function scrambleWord(word: string, seed: number) {
  const letters = word.toLowerCase().split("");

  if (letters.length <= 1) {
    return word;
  }

  const rotatedLetters = letters.map(
    (_, index) => letters[(index + seed + 1) % letters.length],
  );

  for (let index = 0; index < rotatedLetters.length - 1; index += 2) {
    const nextIndex = index + 1;
    const currentLetter = rotatedLetters[index];
    rotatedLetters[index] = rotatedLetters[nextIndex];
    rotatedLetters[nextIndex] = currentLetter;
  }

  const scrambledWord = rotatedLetters.join("");

  if (scrambledWord !== word.toLowerCase()) {
    return scrambledWord;
  }

  return [...letters].reverse().join("");
}

function buildWordScrambleQuestion(
  seed: number,
  deck: WordCard[],
  usageByWord: WordFatigueByWord,
): WordScrambleQuestion {
  const cards = selectCardsWithFatigue({
    count: 3,
    deck,
    seed: seed + 2,
    usageByWord,
  });

  return {
    options: cards.map((card, index) => ({
      card,
      scrambledWord: scrambleWord(card.word, seed + index),
    })),
  };
}

function formatMiniGameName(miniGameType: BattleMiniGameType) {
  if (miniGameType === "word-choice") {
    return "Word Choice";
  }

  if (miniGameType === "word-match") {
    return "Word Match";
  }

  return "Word Scramble";
}

function getMiniGameInstruction(miniGameType: BattleMiniGameType) {
  if (miniGameType === "word-choice") {
    return "เลือกคำตอบที่ถูกต้อง";
  }

  if (miniGameType === "word-match") {
    return "จับคู่คำอังกฤษกับความหมายไทย";
  }

  return "เลือกคำที่สลับ แล้วพิมพ์คำอังกฤษให้ถูก";
}

function getMiniGameTimeLimit(miniGameType: BattleMiniGameType) {
  if (miniGameType === "word-choice") {
    return WORD_CHOICE_TIME_LIMIT;
  }

  if (miniGameType === "word-match") {
    return WORD_MATCH_TIME_LIMIT;
  }

  return WORD_SCRAMBLE_TIME_LIMIT;
}

function getCardShieldAmount(card: WordCard) {
  return (
    card.effects?.reduce(
      (total, effect) => total + (effect.type === "shield" ? effect.amount : 0),
      0,
    ) ?? 0
  );
}

function getCardElement(card: WordCard) {
  return card.effects?.find((effect) => effect.type === "element");
}

function formatElementName(element: string) {
  return element.charAt(0).toUpperCase() + element.slice(1);
}

function getCardEffectsSummary(card: WordCard) {
  const shieldAmount = getCardShieldAmount(card);
  const effects = [`Attack ${card.baseAttack}`];

  if (shieldAmount > 0) {
    effects.push(`Shield +${shieldAmount}`);
  }

  const elements =
    card.effects
      ?.filter((effect) => effect.type === "element")
      .map(
        (effect) =>
          `Element: ${formatElementName(effect.element)}`,
      ) ?? [];

  return [...effects, ...elements].join(" / ");
}

function getCardMasteryBonus(card: WordCard, wordMastery: WordMasteryByCardId) {
  const mastery = wordMastery[getMasterySourceCardId(card.id)] ?? 0;

  return getMasteryDamageBonus(mastery);
}

function calculateRunAccuracy(statistics: RunStatistics) {
  if (statistics.questionsAnswered === 0) {
    return 0;
  }

  return Math.round(
    (statistics.correctAnswers / statistics.questionsAnswered) * 100,
  );
}

function getBattleFeedbackLabel(tone: BattleLog["tone"], message: string) {
  if (message.toLowerCase().includes("time's up")) {
    return "Time Out";
  }

  if (tone === "success") {
    return "Card Triggered";
  }

  if (tone === "danger") {
    return "Enemy Hit";
  }

  return "Awaiting Move";
}

function getBattleFeedbackIcon(tone: BattleLog["tone"], message: string) {
  if (message.toLowerCase().includes("time's up")) {
    return "⏳";
  }

  if (tone === "success") {
    return "✨";
  }

  if (tone === "danger") {
    return "💥";
  }

  return "🎴";
}

function getTimerStateLabel(
  isTimerRunning: boolean,
  isTimerLow: boolean,
  timeRemaining: number,
) {
  if (timeRemaining === 0) {
    return "Time Out";
  }

  if (!isTimerRunning) {
    return "Paused";
  }

  if (isTimerLow) {
    return "Hurry";
  }

  return "Counting";
}

function getStageFeedbackText({
  battleLog,
  battleStatus,
  currentEncounterName,
  encounterType,
  isBossEncounter,
}: {
  battleLog: BattleLog;
  battleStatus: BattleStatus;
  currentEncounterName: string;
  encounterType: EncounterType;
  isBossEncounter: boolean;
}) {
  if (battleStatus === "run-failed") {
    return "Run ended!";
  }

  if (battleStatus === "run-complete") {
    return `${currentEncounterName} defeated!`;
  }

  if (battleStatus === "monster-defeated") {
    return `${encounterType === "elite" ? "Elite" : currentEncounterName} defeated!`;
  }

  if ((battleLog.damageDealt ?? 0) > 0) {
    return "Player attacks!";
  }

  if ((battleLog.shieldAbsorbed ?? 0) > 0) {
    return `Shield blocked ${battleLog.shieldAbsorbed}!`;
  }

  if ((battleLog.hpDamageTaken ?? 0) > 0) {
    return `${isBossEncounter ? currentEncounterName : "Enemy"} hits back!`;
  }

  return "Choose your move.";
}

function getResultOverlayCopy({
  battleLog,
  encounterResultLabel,
  isCorrect,
  isDefeated,
  isTimeout,
}: {
  battleLog: BattleLog;
  encounterResultLabel?: string;
  isCorrect: boolean;
  isDefeated: boolean;
  isTimeout?: boolean;
}) {
  if (isDefeated) {
    return {
      title: "Defeated!",
      subtitle: isTimeout
        ? "Time ran out, and the enemy finished the run."
        : "The enemy's attack ended your run.",
    };
  }

  if (isCorrect) {
    if (encounterResultLabel) {
      return {
        title: encounterResultLabel,
        subtitle: "Your card ended the encounter.",
      };
    }

    return {
      title: (battleLog.damageDealt ?? 0) > 0 ? "Hit!" : "Correct!",
      subtitle: "Your card triggered.",
    };
  }

  if (isTimeout) {
    return {
      title: "Time Out!",
      subtitle: "No card triggered.",
    };
  }

  return {
    title: "Wrong!",
    subtitle: "No card triggered.",
  };
}

function getFloatingCombatText({
  battleLog,
  battleStatus,
}: {
  battleLog: BattleLog;
  battleStatus: BattleStatus;
}) {
  if (battleStatus === "run-failed") {
    return "DEFEATED";
  }

  if (battleStatus === "monster-defeated" || battleStatus === "run-complete") {
    return "DEFEATED";
  }

  if ((battleLog.damageDealt ?? 0) > 0) {
    return `-${battleLog.damageDealt} DMG`;
  }

  if ((battleLog.hpDamageTaken ?? 0) > 0) {
    return `-${battleLog.hpDamageTaken} HP`;
  }

  if ((battleLog.shieldAbsorbed ?? 0) > 0) {
    return `BLOCK ${battleLog.shieldAbsorbed}`;
  }

  if ((battleLog.shieldGained ?? 0) > 0) {
    return `+${battleLog.shieldGained} SHD`;
  }

  return "";
}

function getElementCombatText(battleLog: BattleLog) {
  if ((battleLog.elementBonusDamage ?? 0) > 0) {
    return `Fire +${battleLog.elementBonusDamage} DMG`;
  }

  if ((battleLog.waterShieldGained ?? 0) > 0) {
    return `Water +${battleLog.waterShieldGained} SHD`;
  }

  if ((battleLog.earthAttackReduction ?? 0) > 0) {
    return `Earth weakens attack`;
  }

  if ((battleLog.windGoldGained ?? 0) > 0) {
    return `Wind +${battleLog.windGoldGained} Gold`;
  }

  return "";
}

function getEncounterFlavorText(
  encounter: Monster,
  options: { isBossEncounter: boolean; encounterType: EncounterType },
) {
  if (options.isBossEncounter) {
    if (
      "introFlavor" in encounter &&
      typeof encounter.introFlavor === "string"
    ) {
      return encounter.introFlavor;
    }

    return "The guardian of forgotten words stands before you.";
  }

  if (options.encounterType === "elite") {
    return `${encounter.name} studies your deck with dangerous confidence.`;
  }

  const baseName = encounter.name.toLowerCase();

  if (baseName.includes("slime")) {
    return "A weak slime blocks your path.";
  }

  if (baseName.includes("goblin")) {
    return "A sneaky goblin jumps from the shadows.";
  }

  if (baseName.includes("bat")) {
    return "A fluttering bat circles above the dungeon path.";
  }

  if (baseName.includes("wolf")) {
    return "A hungry wolf watches your every move.";
  }

  if (baseName.includes("skeleton")) {
    return "An old skeleton rattles in the dark.";
  }

  if (baseName.includes("mushroom")) {
    return "A strange mushroom blocks the path.";
  }

  if (baseName.includes("wisp")) {
    return "A glowing wisp floats between forgotten words.";
  }

  if (baseName.includes("imp")) {
    return "A mischievous imp grins from the shadows.";
  }

  if (baseName.includes("stone bug")) {
    return "A stone-shelled bug scrapes across the dungeon floor.";
  }

  if (baseName.includes("dark crow")) {
    return "A dark crow watches from a broken archway.";
  }

  return `${encounter.name} blocks your path.`;
}

function getBossTitle(encounter: Monster) {
  if ("title" in encounter && typeof encounter.title === "string") {
    return encounter.title;
  }

  return undefined;
}

function getBossDefeatText(encounter: Monster) {
  if ("defeatText" in encounter && typeof encounter.defeatText === "string") {
    return encounter.defeatText;
  }

  return undefined;
}

export function Dungeon({
  currentRunDeck,
  isSelectedDeckCompleted,
  onAbandonRun,
  onActiveRunStarted,
  onCompleteSelectedDeck,
  onAddRandomElementToRunCard,
  onAddShieldToRandomRunCard,
  onIncreaseWordFatigue,
  onGainRunGold,
  onMonsterDefeated,
  onNavigate,
  onQaAddRunGold,
  onQaSetRunProgress,
  onRecordRunEnded,
  onResetRun,
  onResetWordFatigue,
  onRecoverWordEnergy,
  onRunSnapshotChange,
  onUpgradeRandomRunCardAttack,
  onUpdateRunStatistics,
  runGold,
  runProgress,
  runStatistics,
  selectedDeck,
  wordFatigue,
  wordMastery,
}: DungeonProps) {
  const mobilePlayAreaRef = useRef<HTMLDivElement | null>(null);
  const initialMiniGameType = useMemo(() => chooseBattleMiniGame(), []);
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [shield, setShield] = useState(INITIAL_SHIELD);
  const [monsterIndex, setMonsterIndex] = useState(0);
  const [encounterType, setEncounterType] =
    useState<EncounterType>("monster");
  const [eventIndex, setEventIndex] = useState(0);
  const [monsterHp, setMonsterHp] = useState(
    () => getMonsterForIndex(0).maxHp,
  );
  const [isBossEncounter, setIsBossEncounter] = useState(false);
  const [selectedBoss, setSelectedBoss] = useState<Boss>(sampleBoss);
  const [hasCompletedBoss, setHasCompletedBoss] = useState(false);
  const [questionSeed, setQuestionSeed] = useState(0);
  const [miniGameType, setMiniGameType] =
    useState<BattleMiniGameType>(initialMiniGameType);
  const [timeRemaining, setTimeRemaining] = useState(() =>
    getMiniGameTimeLimit(initialMiniGameType),
  );
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [selectedMeaningId, setSelectedMeaningId] = useState<string | null>(
    null,
  );
  const [selectedScrambleCardId, setSelectedScrambleCardId] = useState<
    string | null
  >(null);
  const [scrambleAnswer, setScrambleAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [pendingEarthReduction, setPendingEarthReduction] = useState(0);
  const [endedRunGold, setEndedRunGold] = useState<number | null>(null);
  const [endedRunStatistics, setEndedRunStatistics] =
    useState<RunStatistics | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isAbandonConfirmOpen, setIsAbandonConfirmOpen] = useState(false);
  const [battleLog, setBattleLog] = useState<BattleLog>({
    tone: "neutral",
    message: "Inspect the encounter, then start battle when ready.",
  });
  const [battleStatus, setBattleStatus] =
    useState<BattleStatus>("encounter-intro");
  const [questionWordFatigue, setQuestionWordFatigue] =
    useState<WordFatigueByWord>(wordFatigue);

  const currentMonster = getMonsterForIndex(monsterIndex);
  const eliteMonster = createEliteMonster(currentMonster);
  const currentEncounter = isBossEncounter
    ? selectedBoss
    : encounterType === "elite"
      ? eliteMonster
      : currentMonster;
  const currentEvent = chooseDungeonEvent(eventIndex);
  const isEventEncounter = battleStatus === "event";
  const isEncounterIntro = battleStatus === "encounter-intro";
  const encounterLabel = isBossEncounter
    ? "Boss"
    : encounterType === "elite"
      ? "Elite"
      : isEventEncounter
        ? "Event"
        : "Monster";
  const wordChoiceQuestion = useMemo(
    () => buildWordChoiceQuestion(questionSeed, currentRunDeck, questionWordFatigue),
    [currentRunDeck, questionSeed, questionWordFatigue],
  );
  const wordMatchQuestion = useMemo(
    () => buildWordMatchQuestion(questionSeed, currentRunDeck, questionWordFatigue),
    [currentRunDeck, questionSeed, questionWordFatigue],
  );
  const wordScrambleQuestion = useMemo(
    () => buildWordScrambleQuestion(questionSeed, currentRunDeck, questionWordFatigue),
    [currentRunDeck, questionSeed, questionWordFatigue],
  );
  const featuredCard =
    miniGameType === "word-choice"
      ? wordChoiceQuestion.card
      : miniGameType === "word-match"
        ? wordMatchQuestion.cards[0]
        : wordScrambleQuestion.options[0].card;
  const sidePanelCard = battleLog.triggeredCard ?? featuredCard;
  const sidePanelMastery =
    wordMastery[getMasterySourceCardId(sidePanelCard.id)] ?? 0;
  const sidePanelMasteryBonus = getMasteryDamageBonus(sidePanelMastery);
  const sidePanelCardShield = getCardShieldAmount(sidePanelCard);
  const sidePanelCardElement = getCardElement(sidePanelCard);
  const sidePanelWordUsage =
    battleLog.wordUsageCount ?? getWordUsageCount(wordFatigue, sidePanelCard.word);
  const wordEnergySummary = useMemo(
    () => summarizeWordFatigue(currentRunDeck, wordFatigue),
    [currentRunDeck, wordFatigue],
  );
  const isShopAvailable =
    runProgress.monstersDefeated > 0 &&
    runProgress.monstersDefeated === runProgress.nextShopAt;
  const isBossAvailable =
    runProgress.monstersDefeated >= BOSS_MONSTER_REQUIREMENT &&
    !isBossEncounter &&
    !hasCompletedBoss;
  const monstersUntilShop = Math.max(
    runProgress.nextShopAt - runProgress.monstersDefeated,
    0,
  );
  const miniGameTimeLimit = getMiniGameTimeLimit(miniGameType);
  const isTimerLow = timeRemaining <= 3;
  const isTimerRunning =
    battleStatus === "fighting" &&
    !isPaused &&
    !isAnswered &&
    !isAbandonConfirmOpen;
  const canPauseBattle =
    battleStatus === "fighting" &&
    !isPaused &&
    !isAnswered &&
    !isAbandonConfirmOpen;
  const canAbandonRun =
    battleStatus !== "run-complete" && battleStatus !== "run-failed";
  const canShowTriggeredCardDetails = battleLog.triggeredCard !== undefined;
  const activeQuestionScrollKey =
    battleStatus === "fighting" && !isAnswered
      ? `${miniGameType}-${questionSeed}-${currentEncounter.id}`
      : "";
  const encounterFlavorText = getEncounterFlavorText(currentEncounter, {
    isBossEncounter,
    encounterType,
  });
  const timerStateLabel = getTimerStateLabel(
    isTimerRunning,
    isTimerLow,
    timeRemaining,
  );
  const summaryStatistics = endedRunStatistics ?? runStatistics;
  const summaryGold = endedRunGold ?? runGold;
  const summaryAccuracy = calculateRunAccuracy(summaryStatistics);
  const battleFeedbackLabel = getBattleFeedbackLabel(
    battleLog.tone,
    battleLog.message,
  );
  const battleFeedbackIcon = getBattleFeedbackIcon(
    battleLog.tone,
    battleLog.message,
  );
  const stageFeedbackText = getStageFeedbackText({
    battleLog,
    battleStatus,
    currentEncounterName: currentEncounter.name,
    encounterType,
    isBossEncounter,
  });
  const floatingCombatText = getFloatingCombatText({ battleLog, battleStatus });
  const elementCombatText = getElementCombatText(battleLog);
  const playerTookHit = (battleLog.hpDamageTaken ?? 0) > 0;
  const shieldBlockedHit = (battleLog.shieldAbsorbed ?? 0) > 0;
  const encounterTookHit = (battleLog.damageDealt ?? 0) > 0;
  const encounterResolved =
    battleStatus === "monster-defeated" ||
    battleStatus === "run-complete" ||
    battleStatus === "run-failed";
  const encounterResultLabel =
    battleStatus === "run-complete"
      ? "Boss Defeated!"
      : battleStatus === "monster-defeated"
        ? encounterType === "elite"
          ? "Elite Defeated!"
          : "Monster Defeated!"
        : undefined;
  const battleStageMotionClass =
    battleStatus === "run-failed"
      ? "defeat-glow"
      : encounterTookHit
        ? "hit-flash"
        : playerTookHit
          ? "damage-shake"
          : shieldBlockedHit
            ? "shield-pulse"
            : "";
  const encounterStageClass = isEventEncounter
    ? "border-violet-300/40 bg-gradient-to-br from-violet-950 via-stone-950 to-amber-950"
    : isBossEncounter
      ? "border-red-300/50 bg-gradient-to-br from-red-950 via-stone-950 to-violet-950"
      : encounterType === "elite"
        ? "border-amber-300/50 bg-gradient-to-br from-red-950 via-stone-950 to-amber-950"
        : "border-emerald-300/35 bg-gradient-to-br from-stone-950 via-emerald-950 to-stone-900";
  const encounterPortraitClass = isEventEncounter
    ? "border-violet-200/40 bg-violet-100 text-violet-950 shadow-[0_0_34px_rgba(216,180,254,0.24)]"
    : isBossEncounter
      ? "border-red-200/50 bg-red-100 text-red-950 shadow-[0_0_42px_rgba(248,113,113,0.3)]"
      : encounterType === "elite"
        ? "border-amber-200/50 bg-amber-100 text-red-950 shadow-[0_0_34px_rgba(251,191,36,0.28)]"
        : "border-emerald-200/40 bg-emerald-100 text-emerald-950 shadow-[0_0_28px_rgba(52,211,153,0.18)]";
  const battleFeedbackClass =
    battleLog.tone === "success"
      ? "border-emerald-300 bg-gradient-to-br from-emerald-100 to-amber-50"
      : battleLog.tone === "danger"
        ? "border-red-300 bg-gradient-to-br from-red-100 to-amber-50"
        : "border-amber-800/30 bg-gradient-to-br from-amber-50 to-stone-100";
  const canAdvanceAfterAnswer = isAnswered && battleStatus === "fighting";
  const lastEventResultMessage = battleLog.message.startsWith("Event result:")
    ? battleLog.message
    : "";
  const runSnapshotStatus =
    isPaused
      ? "Paused"
      : battleStatus === "encounter-intro"
        ? "At encounter"
        : battleStatus === "event"
          ? "At event"
          : battleStatus === "monster-defeated"
            ? "Checkpoint"
            : battleStatus === "fighting"
              ? isAnswered
                ? "Answered"
                : "In battle"
              : battleStatus === "run-complete"
                ? "Complete"
                : battleStatus === "run-failed"
                  ? "Run failed"
                  : "Dungeon";

  useEffect(() => {
    onRunSnapshotChange({
      playerHp,
      shield,
      encounterName: isEventEncounter ? currentEvent.title : currentEncounter.name,
      statusLabel: runSnapshotStatus,
    });
  }, [
    currentEncounter.name,
    currentEvent.title,
    isEventEncounter,
    onRunSnapshotChange,
    playerHp,
    runSnapshotStatus,
    shield,
  ]);

  function getEventOptionUnavailableReason(
    option: DungeonEventOption,
  ): string | null {
    const costsHp =
      (currentEvent.id === "strange-altar" && option.id === "element") ||
      (currentEvent.id === "cursed-door" &&
        (option.id === "gold" || option.id === "attack"));

    if (costsHp) {
      const hpCost =
        currentEvent.id === "strange-altar"
          ? ALTAR_HP_COST
          : CURSED_DOOR_HP_COST;

      if (playerHp <= hpCost) {
        return `Not enough HP. Need more than ${hpCost} HP.`;
      }
    }

    const targetsRandomCard =
      (currentEvent.id === "treasure-chest" && option.id === "attack") ||
      (currentEvent.id === "lost-backpack" && option.id === "attack") ||
      (currentEvent.id === "ancient-library" && option.id === "attack") ||
      (currentEvent.id === "element-fountain" &&
        (option.id === "element" || option.id === "card-shield")) ||
      (currentEvent.id === "strange-altar" && option.id === "element") ||
      (currentEvent.id === "cursed-door" && option.id === "attack") ||
      (currentEvent.id === "wandering-trainer" && option.id === "attack");

    if (targetsRandomCard && currentRunDeck.length === 0) {
      return "No current-run cards available.";
    }

    return null;
  }

  function clearQuestionSelections() {
    setSelectedChoiceId(null);
    setSelectedWordId(null);
    setSelectedMeaningId(null);
    setSelectedScrambleCardId(null);
    setScrambleAnswer("");
  }

  function resetAnswerState() {
    clearQuestionSelections();
    setIsAnswered(false);
  }

  function advanceQuestion() {
    const nextMiniGameType = chooseBattleMiniGame();

    setIsPaused(false);
    setPendingEarthReduction(0);
    resetAnswerState();
    setQuestionWordFatigue(wordFatigue);
    setQuestionSeed((current) => current + 1);
    setMiniGameType(nextMiniGameType);
    setTimeRemaining(getMiniGameTimeLimit(nextMiniGameType));
    setBattleLog({
      tone: "neutral",
      message: "A new mini-game begins. Choose carefully.",
    });
  }

  function startBattleFromIntro() {
    const nextMiniGameType = chooseBattleMiniGame();

    playSound("ui-click");
    setIsPaused(false);
    resetAnswerState();
    setQuestionWordFatigue(wordFatigue);
    setQuestionSeed((current) => current + 1);
    setMiniGameType(nextMiniGameType);
    setTimeRemaining(getMiniGameTimeLimit(nextMiniGameType));
    setBattleStatus("fighting");
    setBattleLog({
      tone: "neutral",
      message: `${currentEncounter.name} battle started. Answer before the timer runs out.`,
    });
  }

  function pauseBattle() {
    if (!canPauseBattle) {
      return;
    }

    playSound("ui-click");
    setIsPaused(true);
    setBattleLog({
      tone: "neutral",
      message: "Battle paused. Timer and question input are stopped.",
    });
  }

  function openAbandonRunConfirm() {
    playSound("ui-click");
    setIsAbandonConfirmOpen(true);
  }

  function closeAbandonRunConfirm() {
    playSound("ui-click");
    setIsAbandonConfirmOpen(false);
  }

  function resumeBattle() {
    playSound("ui-click");
    setIsPaused(false);
    setBattleLog({
      tone: "neutral",
      message: "Battle resumed. Answer before the timer runs out.",
    });
  }

  function returnHomeWithRunPaused() {
    playSound("ui-click");
    setIsPaused(true);
    setIsAbandonConfirmOpen(false);
    setBattleLog({
      tone: "neutral",
      message: "Run paused and kept in memory. Continue Run from Home to resume.",
    });
    onNavigate("home");
  }

  function playDelayedSound(soundType: Parameters<typeof playSound>[0]) {
    if (typeof window === "undefined") {
      return;
    }

    window.setTimeout(() => playSound(soundType), 95);
  }

  function playCardTriggerSound(options: {
    isDefeated: boolean;
    shieldGained: number;
  }) {
    playSound(options.isDefeated ? "victory" : "correct");

    if (!options.isDefeated && options.shieldGained > 0) {
      playDelayedSound("shield");
    }
  }

  function playEnemyAttackSound(options: {
    isTimeout: boolean;
    isRunFailed: boolean;
    shieldAbsorbed: number;
    hpDamageTaken: number;
  }) {
    if (options.isRunFailed) {
      playSound("defeated");
      return;
    }

    playSound(options.isTimeout ? "timeout" : "wrong");

    if (options.shieldAbsorbed > 0) {
      playDelayedSound("shield");
      return;
    }

    if (options.hpDamageTaken > 0) {
      playDelayedSound("enemy-hit");
    }
  }

  function triggerCard(card: WordCard) {
    const cardShieldGained = getCardShieldAmount(card);
    const element = getCardElement(card);
    const masteryLevel = wordMastery[getMasterySourceCardId(card.id)] ?? 0;
    const masteryBonusDamage = getMasteryDamageBonus(masteryLevel);
    const elementBonusDamage =
      element?.element === "fire" ? FIRE_BONUS_DAMAGE : 0;
    const currentUsageCount = getWordUsageCount(wordFatigue, card.word);
    const nextUsageCount = currentUsageCount + 1;
    const wordEnergyFeedback = getWordEnergyFeedback(card.word, nextUsageCount);
    const waterShieldGained =
      element?.element === "water" ? WATER_SHIELD_GAIN : 0;
    const totalShieldGained = cardShieldGained + waterShieldGained;
    const totalDamageDealt =
      card.baseAttack + elementBonusDamage + masteryBonusDamage;
    const nextMonsterHp = Math.max(monsterHp - totalDamageDealt, 0);
    const isDefeated = nextMonsterHp === 0;
    const earthAttackReduction =
      element?.element === "earth" && !isDefeated
        ? EARTH_ATTACK_REDUCTION
        : 0;
    const windGoldGained =
      element?.element === "wind" && isDefeated
        ? WIND_DEFEAT_GOLD_BONUS
        : 0;
    const elementFeedback =
      element?.element === "fire"
        ? `Fire dealt +${FIRE_BONUS_DAMAGE} bonus damage.`
        : element?.element === "water"
          ? `Water granted +${WATER_SHIELD_GAIN} shield.`
          : element?.element === "wind" && windGoldGained > 0
            ? `Wind bonus: +${WIND_DEFEAT_GOLD_BONUS} gold on defeat.`
            : element?.element === "wind"
              ? "Wind waits for a defeating hit to grant bonus gold."
              : element?.element === "earth" && earthAttackReduction > 0
                ? `Earth weakened the next attack by ${EARTH_ATTACK_REDUCTION}.`
                : element?.element === "earth"
                  ? "Earth did not persist because the encounter was defeated."
                  : "";
    const effectsSummary = [
      `Base damage ${card.baseAttack}`,
      elementBonusDamage > 0 ? `Fire +${elementBonusDamage}` : null,
      masteryBonusDamage > 0 ? `Mastery +${masteryBonusDamage}` : null,
      cardShieldGained > 0 ? `Shield +${cardShieldGained}` : null,
      waterShieldGained > 0 ? `Water shield +${waterShieldGained}` : null,
      earthAttackReduction > 0
        ? `Next attack -${earthAttackReduction}`
        : null,
      windGoldGained > 0 ? `Wind gold +${windGoldGained}` : null,
      wordEnergyFeedback || null,
      element ? `Element: ${formatElementName(element.element)}` : null,
      `Total damage ${totalDamageDealt}`,
    ]
      .filter(Boolean)
      .join(" / ");

    setMonsterHp(nextMonsterHp);
    setPendingEarthReduction(earthAttackReduction);
    if (totalShieldGained > 0) {
      setShield((currentShield) => currentShield + totalShieldGained);
    }
    if (windGoldGained > 0) {
      onGainRunGold(windGoldGained);
    }
    onIncreaseWordFatigue(card.word);
    playCardTriggerSound({
      isDefeated,
      shieldGained: totalShieldGained,
    });

    const nextRunStatistics: RunStatistics = {
      ...runStatistics,
      questionsAnswered: runStatistics.questionsAnswered + 1,
      correctAnswers: runStatistics.correctAnswers + 1,
      bossDefeated: isBossEncounter && isDefeated,
      totalDamageDealt: runStatistics.totalDamageDealt + totalDamageDealt,
      totalShieldGained: runStatistics.totalShieldGained + totalShieldGained,
      goldEarned: runStatistics.goldEarned + windGoldGained,
    };

    if (isDefeated) {
      if (isBossEncounter) {
        const completionReward = onCompleteSelectedDeck();
        onResetWordFatigue();
        setEndedRunGold(runGold + windGoldGained);
        setEndedRunStatistics(nextRunStatistics);
        onRecordRunEnded("completed", nextRunStatistics);
        onUpdateRunStatistics(nextRunStatistics);
        setHasCompletedBoss(true);
        setBattleStatus("run-complete");
        const bossDefeatText = getBossDefeatText(currentEncounter);

        setBattleLog({
          tone: "success",
          message: `${card.word} triggered for ${totalDamageDealt} total damage. ${masteryBonusDamage > 0 ? `Mastery added +${masteryBonusDamage} damage. ` : ""}${elementFeedback ? `${elementFeedback} ` : ""}${wordEnergyFeedback ? `${wordEnergyFeedback} ` : ""}${totalShieldGained > 0 ? `Gained ${totalShieldGained} shield. ` : ""}${windGoldGained > 0 ? `Gained ${windGoldGained} extra gold. ` : ""}${currentEncounter.name} defeated. ${bossDefeatText ? `${bossDefeatText} ` : ""}${completionReward.completedMessage} ${completionReward.unlockMessage} Permanent progress saved.`,
          triggeredCard: card,
          baseDamageDealt: card.baseAttack,
          elementBonusDamage,
          masteryLevel,
          masteryBonusDamage,
          damageDealt: totalDamageDealt,
          cardShieldGained,
          waterShieldGained,
          shieldGained: totalShieldGained,
          earthAttackReduction,
          windGoldGained,
          wordEnergyFeedback,
          wordUsageCount: nextUsageCount,
          effectsSummary,
          rewardSummary: `${completionReward.completedMessage} ${completionReward.unlockMessage}`,
        });
        return;
      }

      onUpdateRunStatistics(nextRunStatistics);
      onMonsterDefeated({
        isElite: encounterType === "elite",
        bonusGold: encounterType === "elite" ? ELITE_GOLD_BONUS : 0,
      });
      setBattleStatus("monster-defeated");
      setBattleLog({
        tone: "success",
        message: `${card.word} triggered for ${totalDamageDealt} total damage. ${masteryBonusDamage > 0 ? `Mastery added +${masteryBonusDamage} damage. ` : ""}${elementFeedback ? `${elementFeedback} ` : ""}${wordEnergyFeedback ? `${wordEnergyFeedback} ` : ""}${totalShieldGained > 0 ? `Gained ${totalShieldGained} shield. ` : ""}${windGoldGained > 0 ? `Gained ${windGoldGained} extra gold. ` : ""}${currentEncounter.name} defeated.${encounterType === "elite" ? ` Elite bonus: +${ELITE_GOLD_BONUS} gold.` : ""}`,
        triggeredCard: card,
        baseDamageDealt: card.baseAttack,
        elementBonusDamage,
        masteryLevel,
        masteryBonusDamage,
        damageDealt: totalDamageDealt,
        cardShieldGained,
        waterShieldGained,
        shieldGained: totalShieldGained,
        earthAttackReduction,
        windGoldGained,
        wordEnergyFeedback,
        wordUsageCount: nextUsageCount,
        effectsSummary,
      });
      return;
    }

    onUpdateRunStatistics(nextRunStatistics);
    setBattleLog({
      tone: "success",
      message: `${card.word} triggered for ${totalDamageDealt} total damage. ${masteryBonusDamage > 0 ? `Mastery added +${masteryBonusDamage} damage. ` : ""}${elementFeedback ? `${elementFeedback} ` : ""}${wordEnergyFeedback ? `${wordEnergyFeedback} ` : ""}${totalShieldGained > 0 ? `Gained ${totalShieldGained} shield.` : ""}`,
      triggeredCard: card,
      baseDamageDealt: card.baseAttack,
      elementBonusDamage,
      masteryLevel,
      masteryBonusDamage,
      damageDealt: totalDamageDealt,
      cardShieldGained,
      waterShieldGained,
      shieldGained: totalShieldGained,
      earthAttackReduction,
      windGoldGained,
      wordEnergyFeedback,
      wordUsageCount: nextUsageCount,
      effectsSummary,
    });
  }

  function monsterAttack(reason = "Wrong answer.", isTimeout = false) {
    const attackReduction = Math.min(
      pendingEarthReduction,
      currentEncounter.attack,
    );
    const reducedAttack = Math.max(currentEncounter.attack - attackReduction, 0);
    const shieldAbsorbed = Math.min(shield, reducedAttack);
    const hpDamageTaken = reducedAttack - shieldAbsorbed;
    const nextShield = shield - shieldAbsorbed;
    const nextPlayerHp = Math.max(playerHp - hpDamageTaken, 0);
    const nextRunStatistics: RunStatistics = {
      ...runStatistics,
      questionsAnswered: runStatistics.questionsAnswered + 1,
      wrongAnswers: runStatistics.wrongAnswers + (isTimeout ? 0 : 1),
      timeouts: runStatistics.timeouts + (isTimeout ? 1 : 0),
    };

    setPendingEarthReduction(0);
    setShield(nextShield);
    setPlayerHp(nextPlayerHp);
    playEnemyAttackSound({
      isTimeout,
      isRunFailed: nextPlayerHp === 0,
      shieldAbsorbed,
      hpDamageTaken,
    });

    if (nextPlayerHp === 0) {
      onResetWordFatigue();
      setEndedRunGold(runGold);
      setEndedRunStatistics(nextRunStatistics);
      onRecordRunEnded("failed", nextRunStatistics);
      onUpdateRunStatistics(nextRunStatistics);
      setBattleStatus("run-failed");
      setBattleLog({
        tone: "danger",
        message: `${reason} No card triggered. ${currentEncounter.name} attacked for ${currentEncounter.attack}. ${attackReduction > 0 ? `Earth reduced it by ${attackReduction}. ` : ""}Shield absorbed ${shieldAbsorbed}; HP took ${hpDamageTaken}. Run Failed.`,
        damageTaken: reducedAttack,
        hpDamageTaken,
        shieldAbsorbed,
        earthAttackReduction: attackReduction,
      });
      return;
    }

    onUpdateRunStatistics(nextRunStatistics);
    setBattleLog({
      tone: "danger",
      message: `${reason} No card triggered. ${currentEncounter.name} attacked for ${currentEncounter.attack}. ${attackReduction > 0 ? `Earth reduced it by ${attackReduction}. ` : ""}Shield absorbed ${shieldAbsorbed}; HP took ${hpDamageTaken}.`,
      damageTaken: reducedAttack,
      hpDamageTaken,
      shieldAbsorbed,
      earthAttackReduction: attackReduction,
    });
  }

  useEffect(() => {
    if (!activeQuestionScrollKey) {
      return;
    }

    if (
      typeof window === "undefined" ||
      window.matchMedia("(min-width: 768px)").matches
    ) {
      return;
    }

    const scrollTimeoutId = window.setTimeout(() => {
      mobilePlayAreaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);

    return () => window.clearTimeout(scrollTimeoutId);
  }, [activeQuestionScrollKey]);

  useEffect(() => {
    if (!isTimerRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeRemaining((currentTime) => Math.max(currentTime - 1, 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isTimerRunning, miniGameType, questionSeed]);

  useEffect(() => {
    if (
      timeRemaining > 0 ||
      isAnswered ||
      isPaused ||
      isAbandonConfirmOpen ||
      battleStatus !== "fighting"
    ) {
      return;
    }

    setIsAnswered(true);
    monsterAttack("Time's up!", true);
  }, [battleStatus, isAbandonConfirmOpen, isAnswered, isPaused, timeRemaining]);

  function handleWordChoiceAnswer(choice: WordCard) {
    if (
      isAnswered ||
      isPaused ||
      isAbandonConfirmOpen ||
      battleStatus !== "fighting"
    ) {
      return;
    }

    setSelectedChoiceId(choice.id);

    if (choice.id === wordChoiceQuestion.card.id) {
      resolveCorrectAnswer(wordChoiceQuestion.card);
      return;
    }

    resolveWrongAnswer();
  }

  function handleWordMatchSubmit() {
    if (
      isAnswered ||
      isPaused ||
      isAbandonConfirmOpen ||
      battleStatus !== "fighting" ||
      selectedWordId === null ||
      selectedMeaningId === null
    ) {
      return;
    }

    if (selectedWordId === selectedMeaningId) {
      const triggeredCard = wordMatchQuestion.cards.find(
        (card) => card.id === selectedWordId,
      );

      if (triggeredCard) {
        resolveCorrectAnswer(triggeredCard);
      }
      return;
    }

    resolveWrongAnswer();
  }

  function handleWordScrambleSubmit() {
    if (
      isAnswered ||
      isPaused ||
      isAbandonConfirmOpen ||
      battleStatus !== "fighting" ||
      selectedScrambleCardId === null ||
      scrambleAnswer.trim() === ""
    ) {
      return;
    }

    const selectedOption = wordScrambleQuestion.options.find(
      (option) => option.card.id === selectedScrambleCardId,
    );

    if (!selectedOption) {
      return;
    }

    if (
      scrambleAnswer.trim().toLowerCase() === selectedOption.card.word.toLowerCase()
    ) {
      resolveCorrectAnswer(selectedOption.card);
      return;
    }

    resolveWrongAnswer();
  }

  function resolveCorrectAnswer(card: WordCard) {
    if (
      isAnswered ||
      isPaused ||
      isAbandonConfirmOpen ||
      battleStatus !== "fighting"
    ) {
      return;
    }

    setIsAnswered(true);
    triggerCard(card);
  }

  function resolveWrongAnswer(reason = "Wrong answer.") {
    if (
      isAnswered ||
      isPaused ||
      isAbandonConfirmOpen ||
      battleStatus !== "fighting"
    ) {
      return;
    }

    setIsAnswered(true);
    monsterAttack(reason);
  }

  function handleNextMonster() {
    const nextMonsterIndex = monsterIndex + 1;
    const nextMonster = getMonsterForIndex(nextMonsterIndex);
    const nextMiniGameType = chooseBattleMiniGame();
    const nextEncounterType = chooseEncounterType();
    const nextEliteMonster = createEliteMonster(nextMonster);
    const isNextEvent = nextEncounterType === "event";

    playSound("ui-click");
    setMonsterIndex(nextMonsterIndex);
    setEncounterType(nextEncounterType);
    setMonsterHp(
      nextEncounterType === "elite" ? nextEliteMonster.maxHp : nextMonster.maxHp,
    );
    setPendingEarthReduction(0);
    setIsPaused(false);
    setBattleStatus(isNextEvent ? "event" : "encounter-intro");
    resetAnswerState();
    setQuestionWordFatigue(wordFatigue);
    setQuestionSeed((current) => current + 1);
    if (isNextEvent) {
      setEventIndex((current) => current + 1);
    }
    setMiniGameType(nextMiniGameType);
    setTimeRemaining(getMiniGameTimeLimit(nextMiniGameType));
    setBattleLog({
      tone: "neutral",
      message: isNextEvent
        ? "A dungeon event appears. Choose one option to continue."
        : `${nextEncounterType === "elite" ? "An elite monster" : "A new monster"} appears. Inspect the encounter before battle.`,
    });
  }

  function continueAfterEvent(message: string) {
    const nextMonsterIndex = monsterIndex + 1;
    const nextMonster = getMonsterForIndex(nextMonsterIndex);
    const nextMiniGameType = chooseBattleMiniGame();
    const nextEncounterType = chooseEncounterType({ allowEvent: false });
    const nextEliteMonster = createEliteMonster(nextMonster);
    const isNextEvent = nextEncounterType === "event";

    playSound("event");
    setMonsterIndex(nextMonsterIndex);
    setEncounterType(nextEncounterType);
    setMonsterHp(
      nextEncounterType === "elite" ? nextEliteMonster.maxHp : nextMonster.maxHp,
    );
    setPendingEarthReduction(0);
    setIsPaused(false);
    setBattleStatus(isNextEvent ? "event" : "encounter-intro");
    resetAnswerState();
    setQuestionWordFatigue(wordFatigue);
    setQuestionSeed((current) => current + 1);
    if (isNextEvent) {
      setEventIndex((current) => current + 1);
    }
    setMiniGameType(nextMiniGameType);
    setTimeRemaining(getMiniGameTimeLimit(nextMiniGameType));
    setBattleLog({
      tone: "neutral",
      message: `Event result: ${message} Temporary run impact only. ${
        isNextEvent
          ? "Another event waits ahead."
          : nextEncounterType === "elite"
            ? "An elite encounter appears. Inspect it before battle."
            : "A monster encounter appears. Inspect it before battle."
      }`,
    });
  }

  function handleEventOption(optionId: string) {
    const option = currentEvent.options.find(
      (currentOption) => currentOption.id === optionId,
    );
    const unavailableReason = option
      ? getEventOptionUnavailableReason(option)
      : null;

    if (unavailableReason) {
      playSound("shop-error");
      setBattleLog({
        tone: "danger",
        message: `${currentEvent.title}: ${unavailableReason}`,
      });
      return;
    }

    const nextRunStatistics = {
      ...runStatistics,
      eventsVisited: runStatistics.eventsVisited + 1,
    };

    onUpdateRunStatistics(nextRunStatistics);

    if (currentEvent.id === "treasure-chest" && optionId === "gold") {
      onGainRunGold(TREASURE_GOLD_REWARD);
      continueAfterEvent(
        `Chose Take the coins. Reward: +${TREASURE_GOLD_REWARD} gold.`,
      );
      return;
    }

    if (currentEvent.id === "treasure-chest" && optionId === "attack") {
      const upgradedWord = onUpgradeRandomRunCardAttack(
        EVENT_ATTACK_UPGRADE_AMOUNT,
      );
      continueAfterEvent(
        upgradedWord
          ? `Chose Polish a card. Reward: ${upgradedWord} gained +${EVENT_ATTACK_UPGRADE_AMOUNT} attack.`
          : "Chose Polish a card. No card was available to upgrade.",
      );
      return;
    }

    if (currentEvent.id === "healing-shrine" && optionId === "heal") {
      const nextHp = Math.min(playerHp + SHRINE_HEAL_AMOUNT, PLAYER_MAX_HP);

      setPlayerHp(nextHp);
      continueAfterEvent(
        `Chose Recover HP. Reward: recovered ${nextHp - playerHp} HP.`,
      );
      return;
    }

    if (currentEvent.id === "healing-shrine" && optionId === "shield") {
      setShield((currentShield) => currentShield + SHRINE_SHIELD_GAIN);
      onUpdateRunStatistics({
        ...nextRunStatistics,
        totalShieldGained:
          nextRunStatistics.totalShieldGained + SHRINE_SHIELD_GAIN,
      });
      continueAfterEvent(
        `Chose Raise ward. Reward: gained ${SHRINE_SHIELD_GAIN} shield.`,
      );
      return;
    }

    if (currentEvent.id === "strange-altar" && optionId === "element") {
      const nextPlayerHp = Math.max(playerHp - ALTAR_HP_COST, 0);
      const elementReward = onAddRandomElementToRunCard();

      setPlayerHp(nextPlayerHp);

      if (nextPlayerHp === 0) {
        playSound("defeated");
        onResetWordFatigue();
        setEndedRunGold(runGold);
        setEndedRunStatistics(nextRunStatistics);
        onRecordRunEnded("failed", nextRunStatistics);
        setBattleStatus("run-failed");
        setBattleLog({
          tone: "danger",
          message: `Strange Altar: lost ${ALTAR_HP_COST} HP and the run failed.`,
        });
        return;
      }

      continueAfterEvent(
        elementReward
          ? `Chose Touch the altar. Cost: -${ALTAR_HP_COST} HP. Reward: ${elementReward.word} gained ${formatElementName(elementReward.element)}.`
          : `Chose Touch the altar. Cost: -${ALTAR_HP_COST} HP, but no card was available.`,
      );
      return;
    }

    if (currentEvent.id === "campfire" && optionId === "heal") {
      const nextHp = Math.min(playerHp + CAMPFIRE_HEAL_AMOUNT, PLAYER_MAX_HP);

      setPlayerHp(nextHp);
      continueAfterEvent(
        `Chose Rest. Reward: recovered ${nextHp - playerHp} HP.`,
      );
      return;
    }

    if (currentEvent.id === "campfire" && optionId === "focus") {
      onRecoverWordEnergy();
      continueAfterEvent(
        "Chose Focus words. Reward: Word Energy recovered by 1 step.",
      );
      return;
    }

    if (currentEvent.id === "lost-backpack" && optionId === "gold") {
      onGainRunGold(TREASURE_GOLD_REWARD);
      continueAfterEvent(
        `Chose Take spare coins. Reward: +${TREASURE_GOLD_REWARD} gold.`,
      );
      return;
    }

    if (currentEvent.id === "lost-backpack" && optionId === "attack") {
      const upgradedWord = onUpgradeRandomRunCardAttack(
        EVENT_ATTACK_UPGRADE_AMOUNT,
      );
      continueAfterEvent(
        upgradedWord
          ? `Chose Use a whetstone. Reward: ${upgradedWord} gained +${EVENT_ATTACK_UPGRADE_AMOUNT} attack.`
          : "Chose Use a whetstone. No card was available to upgrade.",
      );
      return;
    }

    if (currentEvent.id === "ancient-library" && optionId === "attack") {
      const upgradedWord = onUpgradeRandomRunCardAttack(
        EVENT_ATTACK_UPGRADE_AMOUNT,
      );
      continueAfterEvent(
        upgradedWord
          ? `Chose Study battle verbs. Reward: ${upgradedWord} gained +${EVENT_ATTACK_UPGRADE_AMOUNT} attack.`
          : "Chose Study battle verbs. No card was available to upgrade.",
      );
      return;
    }

    if (currentEvent.id === "ancient-library" && optionId === "gold") {
      onGainRunGold(SIGNPOST_GOLD_REWARD);
      continueAfterEvent(
        `Chose Find a bookmark. Reward: +${SIGNPOST_GOLD_REWARD} gold.`,
      );
      return;
    }

    if (currentEvent.id === "element-fountain" && optionId === "element") {
      const elementReward = onAddRandomElementToRunCard();

      continueAfterEvent(
        elementReward
          ? `Chose Draw an element. Reward: ${elementReward.word} gained ${formatElementName(elementReward.element)}.`
          : "Chose Draw an element. No card was available to enchant.",
      );
      return;
    }

    if (currentEvent.id === "element-fountain" && optionId === "card-shield") {
      const shieldedWord = onAddShieldToRandomRunCard(
        EVENT_CARD_SHIELD_UPGRADE_AMOUNT,
      );

      continueAfterEvent(
        shieldedWord
          ? `Chose Bottle a ward. Reward: ${shieldedWord} gained Shield +${EVENT_CARD_SHIELD_UPGRADE_AMOUNT}.`
          : "Chose Bottle a ward. No card was available to protect.",
      );
      return;
    }

    if (currentEvent.id === "cursed-door" && optionId === "gold") {
      const nextPlayerHp = Math.max(playerHp - CURSED_DOOR_HP_COST, 0);

      setPlayerHp(nextPlayerHp);

      if (nextPlayerHp === 0) {
        playSound("defeated");
        onResetWordFatigue();
        setEndedRunGold(runGold);
        setEndedRunStatistics(nextRunStatistics);
        onRecordRunEnded("failed", nextRunStatistics);
        setBattleStatus("run-failed");
        setBattleLog({
          tone: "danger",
          message: `Cursed Door: lost ${CURSED_DOOR_HP_COST} HP and the run failed.`,
        });
        return;
      }

      onGainRunGold(CURSED_DOOR_GOLD_REWARD);
      continueAfterEvent(
        `Chose Pay blood for gold. Cost: -${CURSED_DOOR_HP_COST} HP. Reward: +${CURSED_DOOR_GOLD_REWARD} gold.`,
      );
      return;
    }

    if (currentEvent.id === "cursed-door" && optionId === "attack") {
      const nextPlayerHp = Math.max(playerHp - CURSED_DOOR_HP_COST, 0);
      const upgradedWord = onUpgradeRandomRunCardAttack(
        EVENT_ATTACK_UPGRADE_AMOUNT,
      );

      setPlayerHp(nextPlayerHp);

      if (nextPlayerHp === 0) {
        playSound("defeated");
        onResetWordFatigue();
        setEndedRunGold(runGold);
        setEndedRunStatistics(nextRunStatistics);
        onRecordRunEnded("failed", nextRunStatistics);
        setBattleStatus("run-failed");
        setBattleLog({
          tone: "danger",
          message: `Cursed Door: lost ${CURSED_DOOR_HP_COST} HP and the run failed.`,
        });
        return;
      }

      continueAfterEvent(
        upgradedWord
          ? `Chose Pay blood for power. Cost: -${CURSED_DOOR_HP_COST} HP. Reward: ${upgradedWord} gained +${EVENT_ATTACK_UPGRADE_AMOUNT} attack.`
          : `Chose Pay blood for power. Cost: -${CURSED_DOOR_HP_COST} HP, but no card was available.`,
      );
      return;
    }

    if (currentEvent.id === "wandering-trainer" && optionId === "attack") {
      const upgradedWord = onUpgradeRandomRunCardAttack(
        EVENT_ATTACK_UPGRADE_AMOUNT,
      );
      continueAfterEvent(
        upgradedWord
          ? `Chose Practice strikes. Reward: ${upgradedWord} gained +${EVENT_ATTACK_UPGRADE_AMOUNT} attack.`
          : "Chose Practice strikes. No card was available to upgrade.",
      );
      return;
    }

    if (currentEvent.id === "wandering-trainer" && optionId === "focus") {
      onRecoverWordEnergy();
      continueAfterEvent(
        "Chose Practice recall. Reward: Word Energy recovered by 1 step.",
      );
      return;
    }

    if (currentEvent.id === "mystic-well" && optionId === "shield") {
      setShield((currentShield) => currentShield + MYSTIC_WELL_SHIELD_GAIN);
      onUpdateRunStatistics({
        ...nextRunStatistics,
        totalShieldGained:
          nextRunStatistics.totalShieldGained + MYSTIC_WELL_SHIELD_GAIN,
      });
      continueAfterEvent(
        `Chose Raise a barrier. Reward: gained ${MYSTIC_WELL_SHIELD_GAIN} shield.`,
      );
      return;
    }

    if (currentEvent.id === "mystic-well" && optionId === "heal") {
      const nextHp = Math.min(playerHp + MYSTIC_WELL_HEAL_AMOUNT, PLAYER_MAX_HP);

      setPlayerHp(nextHp);
      continueAfterEvent(
        `Chose Drink carefully. Reward: recovered ${nextHp - playerHp} HP.`,
      );
      return;
    }

    if (currentEvent.id === "forgotten-signpost" && optionId === "gold") {
      onGainRunGold(SIGNPOST_GOLD_REWARD);
      continueAfterEvent(
        `Chose Search the path. Reward: +${SIGNPOST_GOLD_REWARD} gold.`,
      );
      return;
    }

    if (currentEvent.id === "forgotten-signpost" && optionId === "shield") {
      setShield((currentShield) => currentShield + SHRINE_SHIELD_GAIN);
      onUpdateRunStatistics({
        ...nextRunStatistics,
        totalShieldGained:
          nextRunStatistics.totalShieldGained + SHRINE_SHIELD_GAIN,
      });
      continueAfterEvent(
        `Chose Prepare defense. Reward: gained ${SHRINE_SHIELD_GAIN} shield.`,
      );
      return;
    }

    continueAfterEvent("Chose Leave. No reward or cost.");
  }

  function handleStartBoss() {
    const nextMiniGameType = chooseBattleMiniGame();
    const nextBoss = chooseBoss(runProgress.monstersDefeated + questionSeed);

    playSound("ui-click");
    setIsBossEncounter(true);
    setSelectedBoss(nextBoss);
    setEncounterType("monster");
    setMonsterHp(nextBoss.maxHp);
    setPendingEarthReduction(0);
    setIsPaused(false);
    setBattleStatus("encounter-intro");
    resetAnswerState();
    setQuestionWordFatigue(wordFatigue);
    setQuestionSeed((current) => current + 1);
    setMiniGameType(nextMiniGameType);
    setTimeRemaining(getMiniGameTimeLimit(nextMiniGameType));
    setBattleLog({
      tone: "neutral",
      message: `${nextBoss.name} appears. The dungeon quiets before the final battle.`,
    });
  }

  function handleRestartRun() {
    const nextMiniGameType = chooseBattleMiniGame();

    playSound("ui-click");
    onActiveRunStarted();
    onResetRun();
    onResetWordFatigue();
    setPlayerHp(PLAYER_MAX_HP);
    setShield(INITIAL_SHIELD);
    setPendingEarthReduction(0);
    setEndedRunGold(null);
    setEndedRunStatistics(null);
    setIsBossEncounter(false);
    setSelectedBoss(sampleBoss);
    setHasCompletedBoss(false);
    setEncounterType("monster");
    setEventIndex(0);
    setMonsterIndex(0);
    setMonsterHp(getMonsterForIndex(0).maxHp);
    setIsPaused(false);
    setBattleStatus("encounter-intro");
    resetAnswerState();
    setQuestionWordFatigue({});
    setQuestionSeed((current) => current + 1);
    setMiniGameType(nextMiniGameType);
    setTimeRemaining(getMiniGameTimeLimit(nextMiniGameType));
    setBattleLog({
      tone: "neutral",
      message: "Run restarted. Inspect the encounter, then start battle when ready.",
    });
  }

  function abandonRunAndGoHome() {
    setIsAbandonConfirmOpen(false);
    setIsPaused(false);
    onAbandonRun();
    onResetWordFatigue();
    onNavigate("home");
  }

  function leaveEndedRun(screen: ScreenName) {
    onResetRun();
    onResetWordFatigue();
    onNavigate(screen);
  }

  function qaSetPlayerHpLow() {
    setPlayerHp(1);
    setShield(0);
    setBattleLog({
      tone: "neutral",
      message: formatQaHelperMessage(
        "Player HP set to 1 and shield set to 0 for Run Failed testing.",
      ),
    });
  }

  function qaHealPlayer() {
    setPlayerHp(PLAYER_MAX_HP);
    setBattleLog({
      tone: "neutral",
      message: formatQaHelperMessage("Player HP restored to max."),
    });
  }

  function qaAddGold() {
    onQaAddRunGold(50);
    setBattleLog({
      tone: "neutral",
      message: formatQaHelperMessage(
        "Added +50 temporary current-run gold. Permanent progress unchanged.",
      ),
    });
  }

  function qaShowShopCheckpoint() {
    const checkpoint =
      runProgress.monstersDefeated > 0 &&
      runProgress.monstersDefeated % SHOP_INTERVAL === 0
        ? runProgress.monstersDefeated
        : runProgress.nextShopAt;

    onQaSetRunProgress(checkpoint);
    setIsBossEncounter(false);
    setHasCompletedBoss(false);
    setPendingEarthReduction(0);
    setIsPaused(false);
    clearQuestionSelections();
    setIsAnswered(true);
    setQuestionWordFatigue(wordFatigue);
    setBattleStatus("monster-defeated");
    setBattleLog({
      tone: "neutral",
      message: formatQaHelperMessage(
        `Set monsters defeated to ${checkpoint} and safely resolved the active question state. Shop Available should be reachable from the result actions.`,
      ),
    });
  }

  const canUseQaBattleSkip =
    ENABLE_QA_HELPERS &&
    battleStatus === "fighting" &&
    !isAnswered &&
    !isPaused &&
    !isAbandonConfirmOpen;

  function qaResolveCorrectAnswer() {
    if (!canUseQaBattleSkip) {
      return;
    }

    if (miniGameType === "word-choice") {
      setSelectedChoiceId(wordChoiceQuestion.card.id);
      resolveCorrectAnswer(wordChoiceQuestion.card);
      return;
    }

    if (miniGameType === "word-match") {
      const card = wordMatchQuestion.cards[0];

      if (!card) {
        return;
      }

      setSelectedWordId(card.id);
      setSelectedMeaningId(card.id);
      resolveCorrectAnswer(card);
      return;
    }

    const option = wordScrambleQuestion.options[0];

    if (!option) {
      return;
    }

    setSelectedScrambleCardId(option.card.id);
    setScrambleAnswer(option.card.word.toLowerCase());
    resolveCorrectAnswer(option.card);
  }

  function qaResolveWrongAnswer() {
    if (!canUseQaBattleSkip) {
      return;
    }

    if (miniGameType === "word-choice") {
      const wrongChoice =
        wordChoiceQuestion.choices.find(
          (choice) => choice.id !== wordChoiceQuestion.card.id,
        ) ?? wordChoiceQuestion.choices[0];

      setSelectedChoiceId(wrongChoice?.id ?? null);
      resolveWrongAnswer(`${qaWrongLabel}.`);
      return;
    }

    if (miniGameType === "word-match") {
      const selectedWord = wordMatchQuestion.cards[0];
      const wrongMeaning =
        wordMatchQuestion.meanings.find(
          (meaning) => meaning.id !== selectedWord?.id,
        ) ?? wordMatchQuestion.meanings[1];

      setSelectedWordId(selectedWord?.id ?? null);
      setSelectedMeaningId(wrongMeaning?.id ?? null);
      resolveWrongAnswer(`${qaWrongLabel}.`);
      return;
    }

    const option = wordScrambleQuestion.options[0];

    setSelectedScrambleCardId(option?.card.id ?? null);
    setScrambleAnswer(option ? `${option.card.word.toLowerCase()}x` : "wrong");
    resolveWrongAnswer(`${qaWrongLabel}.`);
  }

  function qaTriggerEventEncounter() {
    const nextMiniGameType = chooseBattleMiniGame();

    setIsBossEncounter(false);
    setEncounterType("event");
    setPendingEarthReduction(0);
    setIsPaused(false);
    resetAnswerState();
    setQuestionWordFatigue(wordFatigue);
    setQuestionSeed((current) => current + 1);
    setEventIndex((current) => current + 1);
    setMiniGameType(nextMiniGameType);
    setTimeRemaining(getMiniGameTimeLimit(nextMiniGameType));
    setBattleStatus("event");
    setBattleLog({
      tone: "neutral",
      message: formatQaHelperMessage(
        "Forced an Event encounter. Event rewards remain current-run-only.",
      ),
    });
  }

  function qaTriggerEliteEncounter() {
    const nextMiniGameType = chooseBattleMiniGame();
    const nextEliteMonster = createEliteMonster(currentMonster);

    setIsBossEncounter(false);
    setEncounterType("elite");
    setMonsterHp(nextEliteMonster.maxHp);
    setPendingEarthReduction(0);
    setIsPaused(false);
    resetAnswerState();
    setQuestionWordFatigue(wordFatigue);
    setQuestionSeed((current) => current + 1);
    setMiniGameType(nextMiniGameType);
    setTimeRemaining(getMiniGameTimeLimit(nextMiniGameType));
    setBattleStatus("encounter-intro");
    setBattleLog({
      tone: "neutral",
      message: formatQaHelperMessage("Forced an Elite encounter intro."),
    });
  }

  function qaUnlockBossTest() {
    onQaSetRunProgress(BOSS_MONSTER_REQUIREMENT);
    setIsBossEncounter(false);
    setHasCompletedBoss(false);
    setPendingEarthReduction(0);
    setIsPaused(false);
    resetAnswerState();
    setBattleStatus("monster-defeated");
    setBattleLog({
      tone: "neutral",
      message: formatQaHelperMessage(
        `Set monsters defeated to ${BOSS_MONSTER_REQUIREMENT}. Boss Available should appear in the result actions.`,
      ),
    });
  }

  function qaStartBossTest() {
    handleStartBoss();
    setBattleLog({
      tone: "neutral",
      message: formatQaHelperMessage(
        "Started boss intro through the existing boss start flow.",
      ),
    });
  }

  function qaForceRunFailed() {
    if (battleStatus === "run-failed" || battleStatus === "run-complete") {
      return;
    }

    const nextRunStatistics: RunStatistics = {
      ...runStatistics,
      monstersDefeated: Math.max(
        runStatistics.monstersDefeated,
        runProgress.monstersDefeated,
      ),
      questionsAnswered: runStatistics.questionsAnswered + 1,
      wrongAnswers: runStatistics.wrongAnswers + 1,
    };

    setPlayerHp(0);
    setShield(0);
    setEndedRunGold(runGold);
    setEndedRunStatistics(nextRunStatistics);
    onResetWordFatigue();
    onRecordRunEnded("failed", nextRunStatistics);
    onUpdateRunStatistics(nextRunStatistics);
    setIsPaused(false);
    setPendingEarthReduction(0);
    resetAnswerState();
    setBattleStatus("run-failed");
    setBattleLog({
      tone: "danger",
      message: formatQaHelperMessage(
        "Forced Run Failed through the existing run-ended statistics handler. Permanent learning progress remains safe.",
      ),
      damageTaken: playerHp,
      hpDamageTaken: playerHp,
      shieldAbsorbed: 0,
    });
  }

  const resultActions: BattleResultAction[] = (() => {
    if (battleStatus === "run-complete") {
      return [
        {
          label: "Start Fresh Run",
          onClick: handleRestartRun,
          variant: "secondary",
        },
        {
          label: "Review Deck",
          onClick: () => leaveEndedRun("deck-review"),
        },
        {
          label: "Training",
          onClick: () => leaveEndedRun("training"),
          variant: "secondary",
        },
        {
          label: "Back Home",
          onClick: () => leaveEndedRun("home"),
          variant: "ghost",
        },
      ];
    }

    if (battleStatus === "run-failed") {
      return [
        {
          label: "Restart Run",
          onClick: handleRestartRun,
          variant: "danger",
        },
        {
          label: "Review Deck",
          onClick: () => leaveEndedRun("deck-review"),
        },
        {
          label: "Training",
          onClick: () => leaveEndedRun("training"),
          variant: "secondary",
        },
        {
          label: "Back Home",
          onClick: () => leaveEndedRun("home"),
          variant: "ghost",
        },
      ];
    }

    if (battleStatus === "monster-defeated") {
      if (isBossAvailable) {
        return [
          {
            label: "Start Boss Battle",
            onClick: handleStartBoss,
          },
          ...(isShopAvailable
            ? [
                {
                  label: "Go To Shop",
                  onClick: () => onNavigate("shop"),
                  variant: "secondary" as const,
                },
              ]
            : []),
        ];
      }

      if (isShopAvailable) {
        return [
          {
            label: "Go To Shop",
            onClick: () => onNavigate("shop"),
          },
          {
            label: "Continue Dungeon",
            onClick: handleNextMonster,
            variant: "secondary",
          },
        ];
      }

      return [
        {
          label: "Next Encounter",
          onClick: handleNextMonster,
        },
      ];
    }

    if (isAnswered && battleStatus === "fighting") {
      return [
        {
          label: "Next Mini-Game",
          onClick: advanceQuestion,
        },
      ];
    }

    return [];
  })();

  return (
    <ScreenShell
      eyebrow="Dungeon"
      title="Battle Chamber"
      description="Answer timed vocabulary mini-games to trigger cards. Current Run state stays temporary."
      framed={false}
      wide
      gameMode
    >
      {isEncounterIntro ? (
        <CardPanel className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl place-items-center border-red-900/30 bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 p-3 text-amber-50 sm:min-h-[calc(100vh-6rem)] sm:p-4 xl:h-full xl:min-h-0 xl:overflow-hidden">
          <section
            className={`relative w-full overflow-hidden rounded-3xl border-2 p-4 text-center shadow-[inset_0_0_55px_rgba(0,0,0,0.28)] sm:p-6 ${encounterStageClass}`}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/10 to-transparent" />
            <div className="relative mx-auto max-w-3xl">
              <Badge
                tone={
                  isBossEncounter
                    ? "red"
                    : encounterType === "elite"
                      ? "amber"
                      : "emerald"
                }
              >
                {isBossEncounter ? "BOSS" : encounterLabel}
              </Badge>
              <div
                className={`mx-auto mt-4 grid place-items-center rounded-3xl border-4 shadow-lg ${isBossEncounter ? "size-28 text-6xl ring-4 ring-red-300/25 sm:size-32 sm:text-7xl" : "size-24 text-5xl sm:size-28 sm:text-6xl"} ${encounterPortraitClass}`}
              >
                {currentEncounter.imagePlaceholder}
              </div>
              <h3 className="mt-4 text-4xl font-black leading-none text-amber-50 drop-shadow sm:text-5xl">
                {currentEncounter.name}
              </h3>
              {isBossEncounter && getBossTitle(currentEncounter) && (
                <p className="mt-2 text-sm font-black uppercase tracking-[0.24em] text-red-100/85">
                  {getBossTitle(currentEncounter)}
                </p>
              )}
              <p className="mx-auto mt-4 max-w-2xl text-base font-bold leading-7 text-amber-100/90">
                {encounterFlavorText}
              </p>
              {lastEventResultMessage && (
                <p className="mx-auto mt-4 max-w-2xl rounded-2xl border border-emerald-200/25 bg-emerald-100/10 px-4 py-3 text-sm font-black leading-6 text-emerald-100">
                  {lastEventResultMessage}
                </p>
              )}
              <div className="mx-auto mt-5 grid max-w-2xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-3xl border border-amber-100/15 bg-black/25 p-2 sm:gap-4 sm:p-3">
                <div className="min-w-0 rounded-2xl border border-sky-100/15 bg-sky-950/25 p-2 text-left">
                  <div className="flex items-center gap-2">
                    <div className="grid size-11 place-items-center rounded-xl border-2 border-sky-200/35 bg-sky-100 text-sm font-black text-sky-950">
                      WQ
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-sky-50">
                        Word Hero
                      </p>
                      <p className="text-xs font-bold text-sky-100/70">
                        HP {playerHp} / {PLAYER_MAX_HP}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="rounded-full border border-amber-200 bg-amber-100 px-2 py-1 text-xs font-black text-amber-950 shadow">
                  VS
                </p>
                <div className="min-w-0 rounded-2xl border border-red-100/15 bg-red-950/25 p-2 text-left">
                  <div className="flex items-center gap-2">
                    <div className={`grid size-11 place-items-center rounded-xl border-2 text-2xl ${encounterPortraitClass}`}>
                      {currentEncounter.imagePlaceholder}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-red-50">
                        {currentEncounter.name}
                      </p>
                      <p className="text-xs font-bold text-red-100/70">
                        ATK {currentEncounter.attack}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-auto mt-5 grid max-w-xl grid-cols-2 gap-3">
                <div className="rounded-2xl border-2 border-red-200/20 bg-black/30 p-3 sm:p-4">
                  <p className="text-xs font-black uppercase text-red-100/70">
                    HP
                  </p>
                  <p className="mt-1 text-3xl font-black text-red-100 sm:text-4xl">
                    {currentEncounter.maxHp}
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-amber-200/20 bg-black/30 p-3 sm:p-4">
                  <p className="text-xs font-black uppercase text-amber-100/70">
                    Attack
                  </p>
                  <p className="mt-1 text-3xl font-black text-amber-100 sm:text-4xl">
                    {currentEncounter.attack}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Badge tone="sky">Timer starts after Start Battle</Badge>
                {isBossEncounter && (
                  <>
                    <Badge tone="purple">Major Fight</Badge>
                    <Badge tone="red">
                      {selectedBoss.specialMoveName}
                    </Badge>
                  </>
                )}
                {encounterType === "elite" && (
                  <Badge tone="amber">
                    Elite Bonus +{ELITE_GOLD_BONUS} gold
                  </Badge>
                )}
              </div>
              <Button
                type="button"
                onClick={startBattleFromIntro}
                className="mt-7 w-full px-8 py-3 text-lg sm:w-auto sm:min-w-64"
              >
                {isBossEncounter ? "Start Boss Battle" : "Start Battle"}
              </Button>
              {ENABLE_QA_HELPERS && (
                <div className="mx-auto mt-5 max-w-3xl text-left">
                  <QaHelperPanel
                    canUseBattleSkip={canUseQaBattleSkip}
                    onAddGold={qaAddGold}
                    onForceRunFailed={qaForceRunFailed}
                    onHealPlayer={qaHealPlayer}
                    onQaCorrect={qaResolveCorrectAnswer}
                    onQaWrong={qaResolveWrongAnswer}
                    onSetHpLow={qaSetPlayerHpLow}
                    onShowShopCheckpoint={qaShowShopCheckpoint}
                    onStartBossTest={qaStartBossTest}
                    onTriggerElite={qaTriggerEliteEncounter}
                    onTriggerEvent={qaTriggerEventEncounter}
                    onUnlockBossTest={qaUnlockBossTest}
                  />
                </div>
              )}
            </div>
          </section>
        </CardPanel>
      ) : (
      <div className="grid gap-2 sm:gap-3 xl:h-full xl:min-h-0 xl:grid-cols-[minmax(0,1fr)_260px] 2xl:grid-cols-[minmax(0,1fr)_280px]">
        <CardPanel className="relative min-h-0 border-red-900/30 bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 p-1 text-amber-50 sm:p-3 xl:h-full xl:overflow-hidden">
          <div className="flex min-h-0 flex-col gap-2 sm:gap-3 xl:h-full">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <Badge
                  tone={
                    isBossEncounter || encounterType === "elite"
                      ? "red"
                      : isEventEncounter
                        ? "purple"
                        : "emerald"
                  }
                >
                  {isBossEncounter
                    ? "⚔ Boss"
                    : encounterType === "elite"
                      ? "👑 Elite"
                      : isEventEncounter
                        ? "✨ Event"
                        : "⚔ Monster"}
                </Badge>
                <Badge tone="purple">{selectedDeck.name}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {canPauseBattle && (
                  <Button type="button" onClick={pauseBattle} variant="secondary">
                    Pause
                  </Button>
                )}
                {canAbandonRun && (
                  <Button
                    type="button"
                    onClick={openAbandonRunConfirm}
                    variant="danger"
                  >
                    Abandon Run
                  </Button>
                )}
              </div>
            </div>

            <section
              className={`relative overflow-hidden rounded-2xl border-2 p-2 shadow-[inset_0_0_28px_rgba(0,0,0,0.2)] sm:p-3 ${encounterStageClass} ${battleStageMotionClass}`}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/10 to-transparent" />
              {isEventEncounter ? (
                <div className="relative grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center">
                  <div className="rounded-2xl border border-violet-100/20 bg-violet-950/30 p-3">
                    <div className="flex items-center gap-3">
                      <div className="grid size-14 place-items-center rounded-2xl border-4 border-violet-200/35 bg-violet-100 text-4xl text-violet-950 shadow-lg sm:size-16">
                        {currentEvent.icon}
                      </div>
                      <div className="min-w-0">
                        <Badge tone="purple">Dungeon Discovery</Badge>
                        <h3 className="mt-1 truncate text-2xl font-black leading-none text-amber-50">
                          {currentEvent.title}
                        </h3>
                        <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-violet-100/75">
                          Choose a temporary run result
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    <div className="rounded-xl border border-red-100/15 bg-red-950/25 px-2 py-1.5">
                      <p className="text-xs font-black uppercase text-red-100/70">HP</p>
                      <p className="text-lg font-black text-red-50">{playerHp}</p>
                    </div>
                    <div className="rounded-xl border border-sky-100/15 bg-sky-950/25 px-2 py-1.5">
                      <p className="text-xs font-black uppercase text-sky-100/70">Shield</p>
                      <p className="text-lg font-black text-sky-50">{shield}</p>
                    </div>
                    <div className="rounded-xl border border-amber-100/15 bg-amber-950/25 px-2 py-1.5">
                      <p className="text-xs font-black uppercase text-amber-100/70">Gold</p>
                      <p className="text-lg font-black text-amber-50">{runGold}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-100/15 bg-emerald-950/25 px-2 py-1.5">
                      <p className="text-xs font-black uppercase text-emerald-100/70">Floor</p>
                      <p className="text-lg font-black text-emerald-50">{runProgress.currentFloor}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative grid gap-2 md:grid-cols-[minmax(0,0.95fr)_minmax(6.5rem,0.38fr)_minmax(0,1fr)] md:items-stretch">
                  <div
                    className={`rounded-2xl border p-2 transition sm:p-3 ${
                      playerTookHit
                        ? "damage-shake border-red-200/70 bg-red-800/45 shadow-[0_0_24px_rgba(248,113,113,0.28)]"
                        : "border-sky-100/15 bg-sky-950/25"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid size-14 place-items-center rounded-2xl border-4 border-sky-200/35 bg-sky-100 text-lg font-black text-sky-950 shadow-lg sm:size-16">
                        WQ
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge tone="sky">Word Hero</Badge>
                          <Badge tone="amber">Gold {runGold}</Badge>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2 text-sm font-black text-red-50">
                          <span>HP</span>
                          <span>{playerHp} / {PLAYER_MAX_HP}</span>
                        </div>
                        <ProgressBar
                          value={playerHp}
                          max={PLAYER_MAX_HP}
                          tone="red"
                          label="Player HP"
                        />
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
                      <div
                        className={`rounded-xl border px-2 py-1 transition ${
                          shieldBlockedHit
                            ? "shield-pulse border-sky-200/70 bg-sky-700/35"
                            : "border-sky-100/15 bg-black/20"
                        }`}
                      >
                        <p className="text-[10px] font-black uppercase text-sky-100/70">Shield</p>
                        <p className="text-base font-black text-sky-50">{shield}</p>
                      </div>
                      <div className="rounded-xl border border-stone-100/15 bg-black/20 px-2 py-1">
                        <p className="text-[10px] font-black uppercase text-stone-100/70">Floor</p>
                        <p className="text-base font-black text-stone-50">{runProgress.currentFloor}</p>
                      </div>
                      <div className="rounded-xl border border-emerald-100/15 bg-black/20 px-2 py-1">
                        <p className="text-[10px] font-black uppercase text-emerald-100/70">Progress</p>
                        <p className="text-sm font-black text-emerald-50">
                          {runProgress.monstersDefeated}/{runProgress.nextShopAt}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex min-h-20 flex-col items-center justify-center rounded-2xl border border-amber-100/15 bg-black/25 px-2 py-2 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-100/65">
                      Battle Lane
                    </p>
                    <p className="attack-pop mt-1 rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-sm font-black text-amber-950 shadow">
                      {stageFeedbackText}
                    </p>
                    <p className="mt-1 text-2xl font-black leading-none text-amber-100">
                      VS
                    </p>
                    {(floatingCombatText || elementCombatText) && (
                      <div className="mt-1 flex max-w-full flex-wrap justify-center gap-1">
                        {floatingCombatText && (
                          <span className="attack-pop rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[11px] font-black text-emerald-950 shadow">
                            {floatingCombatText}
                          </span>
                        )}
                        {elementCombatText && (
                          <span className="attack-pop rounded-full border border-violet-200 bg-violet-100 px-2 py-0.5 text-[11px] font-black text-violet-950 shadow">
                            {elementCombatText}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className={`rounded-2xl border p-2 transition sm:p-3 ${
                      isBossEncounter
                        ? "border-red-200/45 bg-red-950/30 shadow-[0_0_32px_rgba(248,113,113,0.18)]"
                        : encounterType === "elite"
                          ? "border-amber-200/45 bg-amber-950/25 shadow-[0_0_28px_rgba(251,191,36,0.16)]"
                          : "border-emerald-100/15 bg-emerald-950/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid size-14 place-items-center rounded-2xl border-4 text-4xl shadow-lg transition sm:size-16 ${encounterPortraitClass} ${
                          encounterTookHit
                            ? "damage-shake scale-105 ring-4 ring-red-300/45"
                            : encounterResolved
                              ? "defeat-glow ring-4 ring-emerald-300/35"
                              : ""
                        }`}
                      >
                        {currentEncounter.imagePlaceholder}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge
                            tone={
                              isBossEncounter
                                ? "red"
                                : encounterType === "elite"
                                  ? "amber"
                                  : "emerald"
                            }
                          >
                            {isBossEncounter ? "BOSS" : encounterLabel}
                          </Badge>
                          <Badge tone="red">ATK {currentEncounter.attack}</Badge>
                          {isBossEncounter && getBossTitle(currentEncounter) && (
                            <Badge tone="purple">
                              {getBossTitle(currentEncounter)}
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-3">
                          <h3 className="truncate text-xl font-black leading-none text-amber-50 drop-shadow sm:text-2xl">
                            {currentEncounter.name}
                          </h3>
                          <span className="shrink-0 text-sm font-black text-amber-100">
                            {monsterHp} / {currentEncounter.maxHp}
                          </span>
                        </div>
                        <ProgressBar
                          value={monsterHp}
                          max={currentEncounter.maxHp}
                          label={`${isBossEncounter ? "BOSS " : ""}${currentEncounter.name} HP`}
                          tone={
                            isBossEncounter || encounterType === "elite"
                              ? "red"
                              : "emerald"
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge
                        tone={
                          hasCompletedBoss
                            ? "emerald"
                            : isBossAvailable || isBossEncounter
                              ? "red"
                              : "slate"
                        }
                      >
                        Boss{" "}
                        {hasCompletedBoss
                          ? "Done"
                          : isBossEncounter
                            ? "Active"
                            : isBossAvailable
                              ? "Ready"
                              : `${runProgress.monstersDefeated}/${BOSS_MONSTER_REQUIREMENT}`}
                      </Badge>
                      {isBossEncounter && (
                        <Badge tone="red">{selectedBoss.specialMoveName}</Badge>
                      )}
                      {encounterType === "elite" && (
                        <Badge tone="amber">Elite +{ELITE_GOLD_BONUS} gold</Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>

            <div
              ref={mobilePlayAreaRef}
              className="-mt-1 scroll-mt-1"
              aria-hidden="true"
            />

            {!isEventEncounter && (
              <section
                className={`rounded-2xl border-2 p-1.5 xl:hidden ${
                  timeRemaining === 0
                    ? "border-red-400 bg-red-100 text-red-950"
                    : isTimerLow && isTimerRunning
                      ? "border-red-400 bg-red-50 text-red-950"
                      : "border-amber-300/40 bg-amber-50 text-amber-950"
                }`}
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="emerald">{formatMiniGameName(miniGameType)}</Badge>
                      <Badge tone={isTimerLow && isTimerRunning ? "red" : "amber"}>
                        {timerStateLabel}
                      </Badge>
                    </div>
                    <p className="mt-1 truncate text-xs font-black text-amber-900/75">
                      {getMiniGameInstruction(miniGameType)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-3xl font-black leading-none ${
                        isTimerLow && isTimerRunning ? "text-red-700" : ""
                      }`}
                    >
                      {timeRemaining}s
                    </p>
                    <p className="text-[11px] font-black uppercase opacity-70">
                      / {miniGameTimeLimit}s
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <ProgressBar
                    value={timeRemaining}
                    max={miniGameTimeLimit}
                    tone={isTimerLow && isTimerRunning ? "red" : "amber"}
                    label="Mobile battle timer"
                  />
                </div>
              </section>
            )}

            <section className="hidden">
              <div className="flex items-center gap-2 text-sm font-black text-sky-100">
                <span className="grid size-7 place-items-center rounded-full border border-sky-200/30 bg-sky-100/15">
                  🧙
                </span>
                Player
              </div>
              <div className="relative h-6 rounded-full bg-amber-100/15">
                <span className="absolute inset-y-0 left-2 right-2 rounded-full border-t border-dashed border-amber-100/45" />
                <span
                  className={`attack-pop absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-0.5 text-xs font-black shadow ${
                    battleLog.tone === "success"
                      ? "border-emerald-200 bg-emerald-100 text-emerald-950"
                      : battleLog.tone === "danger"
                        ? "border-red-200 bg-red-100 text-red-950"
                        : "border-amber-200 bg-amber-100 text-amber-950"
                  }`}
                >
                  {stageFeedbackText}
                </span>
                {floatingCombatText && (
                  <span
                    className={`float-combat-text pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 rounded-full border px-2 py-0.5 text-[11px] font-black shadow ${
                      battleLog.tone === "success"
                        ? "border-emerald-200 bg-emerald-100 text-emerald-950"
                        : "border-red-200 bg-red-100 text-red-950"
                    }`}
                  >
                    {floatingCombatText}
                  </span>
                )}
                {elementCombatText && (
                  <span className="attack-pop absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-violet-200 bg-violet-100 px-2 py-0.5 text-[11px] font-black text-violet-950 shadow md:inline">
                    {elementCombatText}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm font-black text-red-100">
                <span className="grid size-7 place-items-center rounded-full border border-red-200/30 bg-red-100/15">
                  {isEventEncounter ? "✨" : currentEncounter.imagePlaceholder}
                </span>
                {isEventEncounter ? "Event" : currentEncounter.name}
              </div>
            </section>

            <section className="flex min-h-0 flex-col rounded-3xl border-2 border-amber-300/30 bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50 p-1 text-amber-950 shadow-[0_8px_0_rgba(120,53,15,0.2)] sm:p-2 xl:flex-1">
              <div className="min-h-[18rem] rounded-2xl border-2 border-amber-900/10 bg-white/80 p-1.5 shadow-inner sm:p-2 xl:min-h-0 xl:flex-1">
                {battleStatus === "run-complete" ||
                battleStatus === "run-failed" ? (
                  <RunEndingSummary
                    battleLog={battleLog}
                    currentRunDeckSize={currentRunDeck.length}
                    finalGold={summaryGold}
                    isComplete={battleStatus === "run-complete"}
                    onBackHome={() => leaveEndedRun("home")}
                    onReviewDeck={() => leaveEndedRun("deck-review")}
                    onRestartRun={handleRestartRun}
                    onTraining={() => leaveEndedRun("training")}
                    selectedBoss={selectedBoss}
                    selectedDeck={selectedDeck}
                    statistics={summaryStatistics}
                    summaryAccuracy={summaryAccuracy}
                    runProgress={runProgress}
                  />
                ) : isEventEncounter ? (
                  <div className="grid min-h-[260px] content-center gap-3 sm:grid-cols-2 xl:h-full">
                    {currentEvent.options.map((option) => {
                      const unavailableReason =
                        getEventOptionUnavailableReason(option);

                      return (
                        <button
                          key={option.id}
                          type="button"
                          disabled={unavailableReason !== null}
                          onClick={() => handleEventOption(option.id)}
                          className={`rounded-xl border-2 p-4 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                            unavailableReason
                              ? "cursor-not-allowed border-stone-300 bg-stone-100 text-stone-500 opacity-70"
                              : "border-amber-900/15 bg-white hover:-translate-y-0.5 hover:border-amber-500 hover:shadow-md"
                          }`}
                        >
                          <p
                            className={`text-lg font-black ${
                              unavailableReason
                                ? "text-stone-500"
                                : "text-amber-950"
                            }`}
                          >
                            {option.label}
                          </p>
                          <p
                            className={`mt-2 text-sm font-semibold leading-6 ${
                              unavailableReason
                                ? "text-stone-500"
                                : "text-amber-900/70"
                            }`}
                          >
                            {unavailableReason ?? option.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                ) : miniGameType === "word-choice" ? (
                  <WordChoiceBattle
                    isAnswered={isAnswered}
                    isDefeated={false}
                    encounterResultLabel={encounterResultLabel}
                    question={wordChoiceQuestion}
                    selectedChoiceId={selectedChoiceId}
                    onAnswer={handleWordChoiceAnswer}
                    actions={resultActions}
                    battleLog={battleLog}
                    wordFatigue={questionWordFatigue}
                    wordMastery={wordMastery}
                  />
                ) : miniGameType === "word-match" ? (
                  <WordMatchBattle
                    isAnswered={isAnswered}
                    isDefeated={false}
                    encounterResultLabel={encounterResultLabel}
                    question={wordMatchQuestion}
                    selectedMeaningId={selectedMeaningId}
                    selectedWordId={selectedWordId}
                    onSelectMeaning={setSelectedMeaningId}
                    onSelectWord={setSelectedWordId}
                    onSubmit={handleWordMatchSubmit}
                    actions={resultActions}
                    battleLog={battleLog}
                    wordFatigue={questionWordFatigue}
                    wordMastery={wordMastery}
                  />
                ) : (
                  <WordScrambleBattle
                    answer={scrambleAnswer}
                    isAnswered={isAnswered}
                    isDefeated={false}
                    encounterResultLabel={encounterResultLabel}
                    question={wordScrambleQuestion}
                    selectedCardId={selectedScrambleCardId}
                    onAnswerChange={setScrambleAnswer}
                    onSelectCard={setSelectedScrambleCardId}
                    onSubmit={handleWordScrambleSubmit}
                    actions={resultActions}
                    battleLog={battleLog}
                    wordFatigue={questionWordFatigue}
                    wordMastery={wordMastery}
                  />
                )}
              </div>
            </section>
          </div>

          {isPaused && (
            <div className="absolute inset-0 z-20 grid place-items-center bg-stone-950/70 p-2 backdrop-blur-sm sm:p-5">
              <div className="max-h-[min(86dvh,34rem)] w-full max-w-md overflow-y-auto rounded-3xl border-2 border-amber-300 bg-amber-50 p-3 text-center text-amber-950 shadow-[0_18px_0_rgba(120,53,15,0.24)] sm:max-h-[min(90vh,34rem)] sm:p-6">
                <Badge tone="amber">Paused</Badge>
                <h3 className="mt-3 text-5xl font-black">PAUSED</h3>
                <p className="mt-3 text-sm font-bold leading-6 text-amber-900/75">
                  Timer stopped. Resume continues this battle. Return Home keeps
                  this run available in memory. Abandon Run discards it.
                </p>
                <div className="mt-6 grid gap-3">
                  <Button type="button" onClick={resumeBattle}>
                    Resume
                  </Button>
                  <Button type="button" onClick={returnHomeWithRunPaused} variant="secondary">
                    Return Home
                  </Button>
                  <Button type="button" onClick={openAbandonRunConfirm} variant="danger">
                    Abandon Run
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isAbandonConfirmOpen && (
            <div className="absolute inset-0 z-30 grid place-items-center bg-stone-950/75 p-2 backdrop-blur-sm sm:p-5">
              <div className="max-h-[min(86dvh,38rem)] w-full max-w-lg overflow-y-auto rounded-3xl border-2 border-red-300 bg-amber-50 p-3 text-amber-950 shadow-[0_18px_0_rgba(127,29,29,0.24)] sm:max-h-[min(90vh,38rem)] sm:p-6">
                <Badge tone="red">Abandon Run</Badge>
                <h3 className="mt-3 text-3xl font-black">
                  Abandon current run?
                </h3>
                <p className="mt-3 text-sm font-bold leading-6 text-amber-900/80">
                  You will lose this run's HP, gold, shield, shop upgrades,
                  duplicated cards, removed cards, card enchantments, monster
                  state, boss state, and Word Energy.
                </p>
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-950">
                  <p>Your permanent progress stays safe:</p>
                  <p>word mastery, unlocked decks, completed decks, and saved best run stats.</p>
                </div>
                <div className="mt-6 grid gap-3">
                  <Button type="button" variant="secondary" onClick={closeAbandonRunConfirm}>
                    Continue Run
                  </Button>
                  <Button type="button" variant="danger" onClick={abandonRunAndGoHome}>
                    Abandon Run
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardPanel>

        <aside className="grid min-h-0 gap-3 lg:grid-cols-2 xl:block xl:h-full xl:max-h-full xl:space-y-3 xl:overflow-y-auto xl:overscroll-contain xl:pr-1">
          {!isEventEncounter && (
            <section
              className={`hidden rounded-2xl border-2 p-3 shadow-[0_8px_0_rgba(120,53,15,0.14)] xl:block ${
                timeRemaining === 0
                  ? "border-red-400 bg-red-100"
                  : isTimerLow && isTimerRunning
                    ? "hit-flash border-red-400 bg-red-50 motion-safe:animate-pulse"
                    : "border-amber-800/30 bg-gradient-to-br from-amber-50 to-stone-100"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge tone="emerald">{formatMiniGameName(miniGameType)}</Badge>
                  <p className="mt-2 text-sm font-black leading-5 text-amber-950">
                    {getMiniGameInstruction(miniGameType)}
                  </p>
                </div>
                <Badge tone={isTimerLow && isTimerRunning ? "red" : "amber"}>
                  {timerStateLabel}
                </Badge>
              </div>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold uppercase text-amber-800/70">
                    Timer
                  </p>
                  <p
                    className={`text-3xl font-black leading-none ${
                      isTimerLow && isTimerRunning
                        ? "attack-pop text-red-700"
                        : "text-amber-950"
                    }`}
                  >
                    {timeRemaining}s
                  </p>
                </div>
                <p className="text-sm font-black text-amber-900/60">
                  / {miniGameTimeLimit}s
                </p>
              </div>
              <div className="mt-2">
                <ProgressBar
                  value={timeRemaining}
                  max={miniGameTimeLimit}
                  tone={isTimerLow && isTimerRunning ? "red" : "amber"}
                  label="Battle timer"
                />
              </div>
            </section>
          )}

          <section className="rounded-2xl border-2 border-emerald-800/20 bg-emerald-50/95 p-3 shadow-[0_8px_0_rgba(6,95,70,0.1)]">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="emerald">Word Energy</Badge>
              <p className="text-xs font-black uppercase text-emerald-900/70">
                Current run
              </p>
            </div>
            <p className="mt-2 text-sm font-black leading-5 text-emerald-950">
              {wordEnergySummary.fresh} Fresh / {wordEnergySummary.used} Used /{" "}
              {wordEnergySummary.tired} Tired / {wordEnergySummary.resting} Low
            </p>
            <p className="mt-1 text-xs font-bold text-emerald-900/65">
              Shop visits restore 1 energy step.
            </p>
          </section>

          <details
            className={`rounded-2xl border-2 p-3 shadow-[0_8px_0_rgba(120,53,15,0.14)] ${battleFeedbackClass}`}
          >
            <summary className="flex cursor-pointer flex-wrap items-center gap-2">
              <span className="text-3xl" aria-hidden="true">
                {battleFeedbackIcon}
              </span>
              <p className="font-black text-amber-950">Battle Log</p>
              <Badge
                tone={
                  battleLog.tone === "success"
                    ? "emerald"
                    : battleLog.tone === "danger"
                      ? "red"
                      : "slate"
                }
              >
                {battleFeedbackLabel}
              </Badge>
            </summary>
            <p className="mt-2 line-clamp-3 text-sm font-medium text-amber-950/80">
              {battleLog.message}
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 [&>div]:p-2 [&_p:first-child]:text-xs [&_p:nth-child(2)]:text-xl">
              <StatCard label="Total DMG" value={battleLog.damageDealt ?? 0} tone="emerald" />
              <StatCard label="Taken" value={battleLog.damageTaken ?? 0} tone="red" />
              <StatCard label="Shield Block" value={battleLog.shieldAbsorbed ?? 0} tone="sky" />
              <StatCard label="Shield Gain" value={battleLog.shieldGained ?? 0} tone="sky" />
            </div>
          </details>

          {battleStatus === "run-failed" && !isAnswered ? (
            <section className="rounded-2xl border-2 border-amber-800/20 bg-amber-50/95 p-3 shadow-[0_6px_0_rgba(120,53,15,0.12)]">
              <Badge tone="red">Run Failed</Badge>
              <p className="mt-2 text-sm font-bold text-amber-950/80">
                The run ended outside an active quiz result.
              </p>
              <Button
                type="button"
                onClick={handleRestartRun}
                className="mt-3 w-full bg-red-600 hover:bg-red-700"
              >
                Restart Run
              </Button>
            </section>
          ) : null}

          {canShowTriggeredCardDetails && (
          <details className="result-pop rounded-2xl border-2 border-amber-800/30 bg-gradient-to-br from-amber-50 to-orange-100 p-3 shadow-[0_10px_0_rgba(120,53,15,0.16)]" open>
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
              <span className="flex flex-wrap gap-2">
                <Badge tone="purple">Card Trigger</Badge>
                <Badge tone="emerald">Resolved</Badge>
              </span>
              <Badge tone={sidePanelMastery >= 5 ? "emerald" : "amber"}>
                {getMasteryStatusLabel(sidePanelMastery)}
              </Badge>
              <Badge tone={sidePanelWordUsage >= 5 ? "slate" : "emerald"}>
                {getWordEnergyLabel(sidePanelWordUsage)}
              </Badge>
            </summary>
            <div className="mt-3 flex items-start gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-amber-900/15 bg-amber-100 text-3xl shadow-inner">
                {sidePanelCard.imagePlaceholder}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xl font-black capitalize text-amber-950">
                  {sidePanelCard.word}
                </p>
                <p className="mt-1 text-sm font-bold text-amber-900/75">
                  Attack {sidePanelCard.baseAttack} · Shield +{sidePanelCardShield}
                </p>
                <p className="mt-1 text-sm font-bold text-amber-900/75">
                  Element{" "}
                  {sidePanelCardElement
                    ? formatElementName(sidePanelCardElement.element)
                    : "None"}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="attack-pop rounded-xl border border-red-200 bg-red-50 p-2">
                <p className="text-xs font-black uppercase text-red-800/70">
                  Base
                </p>
                <p className="text-xl font-black text-red-950">
                  {battleLog.baseDamageDealt ?? sidePanelCard.baseAttack}
                </p>
              </div>
              <div className="attack-pop rounded-xl border border-violet-200 bg-violet-50 p-2">
                <p className="text-xs font-black uppercase text-violet-800/70">
                  Element
                </p>
                <p className="text-xl font-black text-violet-950">
                  +{battleLog.elementBonusDamage ?? 0}
                </p>
              </div>
              <div className="mastery-pulse rounded-xl border border-amber-200 bg-amber-50 p-2">
                <p className="text-xs font-black uppercase text-amber-800/70">
                  Mastery
                </p>
                <p className="text-xl font-black text-amber-950">
                  +{sidePanelMasteryBonus}
                </p>
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-amber-900/15 bg-white/70 p-3">
              <p className="text-xs font-extrabold uppercase text-amber-800/70">
                Final trigger result
              </p>
              <p className="mt-1 line-clamp-2 font-black text-amber-950">
                {battleLog.effectsSummary ?? "None yet"}
              </p>
              {(battleLog.damageDealt ?? 0) > 0 && (
                <p className="mt-2 text-sm font-black text-emerald-800">
                  Final damage: {battleLog.damageDealt}
                </p>
              )}
              <p className="mt-2 text-sm font-bold text-amber-900/70">
                Mastery: {sidePanelMastery} / 5
              </p>
              {battleLog.wordEnergyFeedback && (
                <p className="mt-1 text-sm font-bold text-emerald-800">
                  {battleLog.wordEnergyFeedback}
                </p>
              )}
            </div>
          </details>
          )}

          <details className="rounded-xl border-2 border-amber-800/20 bg-amber-50/90 p-3">
            <summary className="cursor-pointer font-black text-amber-950">
              Learning Info
            </summary>
            <div className="mt-2 grid gap-2 text-sm font-medium leading-6 text-amber-950/75">
              <p>
                Tap Start Battle before the timer begins. Correct answers
                trigger the selected word card.
              </p>
              <p>
                Card stats show attack, shield, element, mastery, and Word
                Energy. Wrong answers and timeouts let the encounter attack,
                with shield absorbing damage before HP.
              </p>
              <p>
                Pause stops the timer. Abandon Run exits only the current
                temporary run; permanent mastery and deck progress stay safe.
              </p>
              <p>
                Word Energy encourages variety: fresh words appear more often,
                overused words appear less often, and it resets after the run.
              </p>
            </div>
          </details>

          {ENABLE_QA_HELPERS && (
            <QaHelperPanel
              canUseBattleSkip={canUseQaBattleSkip}
              onAddGold={qaAddGold}
              onForceRunFailed={qaForceRunFailed}
              onHealPlayer={qaHealPlayer}
              onQaCorrect={qaResolveCorrectAnswer}
              onQaWrong={qaResolveWrongAnswer}
              onSetHpLow={qaSetPlayerHpLow}
              onShowShopCheckpoint={qaShowShopCheckpoint}
              onStartBossTest={qaStartBossTest}
              onTriggerElite={qaTriggerEliteEncounter}
              onTriggerEvent={qaTriggerEventEncounter}
              onUnlockBossTest={qaUnlockBossTest}
            />
          )}

        </aside>
      </div>
      )}
    </ScreenShell>
  );
}

function RunEndingSummary({
  battleLog,
  currentRunDeckSize,
  finalGold,
  isComplete,
  onBackHome,
  onRestartRun,
  onReviewDeck,
  onTraining,
  runProgress,
  selectedBoss,
  selectedDeck,
  statistics,
  summaryAccuracy,
}: {
  battleLog: BattleLog;
  currentRunDeckSize: number;
  finalGold: number;
  isComplete: boolean;
  onBackHome: () => void;
  onRestartRun: () => void;
  onReviewDeck: () => void;
  onTraining: () => void;
  runProgress: RunProgressState;
  selectedBoss: Boss;
  selectedDeck: VocabularyDeck;
  statistics: RunStatistics;
  summaryAccuracy: number;
}) {
  const bossTitle = getBossTitle(selectedBoss);
  const bossDefeatText = getBossDefeatText(selectedBoss);
  const keptItems = [
    "Word Mastery",
    "Unlocked Decks",
    "Completed Decks",
    "Saved Best Stats",
  ];
  const lostItems = [
    "HP",
    "Shield",
    "Gold",
    "Shop Upgrades",
    "Duplicated / Removed Cards",
    "Card Enchantments",
    "Word Energy",
  ];

  return (
    <section
      className={`overflow-y-auto rounded-2xl border-2 p-3 shadow-inner sm:p-4 xl:h-full ${
        isComplete
          ? "border-emerald-300 bg-gradient-to-br from-emerald-100 via-amber-50 to-white"
          : "border-red-300 bg-gradient-to-br from-red-100 via-amber-50 to-white"
      }`}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="space-y-4">
          <div className="rounded-3xl border-2 border-amber-900/10 bg-white/75 p-5 shadow-[0_10px_0_rgba(120,53,15,0.12)]">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={isComplete ? "emerald" : "red"}>
                {isComplete ? "Victory" : "Run Failed"}
              </Badge>
              <Badge tone="purple">{selectedDeck.name}</Badge>
            </div>
            <h3
              className={`mt-3 text-3xl font-black leading-none sm:text-4xl ${
                isComplete ? "text-emerald-950" : "text-red-950"
              }`}
            >
              {isComplete ? "Dungeon Cleared!" : "Your Run Ended"}
            </h3>
            <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-amber-950/75">
              {isComplete
                ? "Boss defeated, deck progress saved, and your permanent learning progress is safe."
                : "The run is over, but your learning progress remains. Review, train, and try again when ready."}
            </p>
          </div>

          {isComplete ? (
            <div className="rounded-3xl border-2 border-violet-200 bg-violet-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl border-2 border-violet-200 bg-white text-4xl shadow-inner">
                  {selectedBoss.imagePlaceholder}
                </span>
                <div className="min-w-0">
                  <Badge tone="purple">Boss Defeated</Badge>
                  <h4 className="mt-2 truncate text-2xl font-black text-violet-950">
                    {selectedBoss.name}
                  </h4>
                  {bossTitle && (
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-violet-800/70">
                      {bossTitle}
                    </p>
                  )}
                  <p className="mt-2 text-sm font-bold leading-6 text-violet-950/75">
                    {bossDefeatText ??
                      "The final guardian falls. Your words light the way forward."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-red-200 bg-red-50 p-4">
              <Badge tone="red">Failure Reason</Badge>
              <p className="mt-2 text-sm font-bold leading-6 text-red-950/75">
                {battleLog.message}
              </p>
              <p className="mt-2 text-sm font-black text-red-950">
                Permanent mastery is safe. Temporary run upgrades are lost.
              </p>
            </div>
          )}

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-3">
              <p className="text-xs font-black uppercase text-emerald-800/70">
                Permanent Progress Kept
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {keptItems.map((item) => (
                  <Badge key={item} tone="emerald">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border-2 border-stone-200 bg-stone-50 p-3">
              <p className="text-xs font-black uppercase text-stone-700/70">
                Temporary Run Lost
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {lostItems.map((item) => (
                  <Badge key={item} tone="slate">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border-2 border-amber-200 bg-amber-50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={isComplete ? "emerald" : "amber"}>
                {isComplete ? "Reward" : "Encouragement"}
              </Badge>
              <p className="font-black text-amber-950">
                {isComplete
                  ? battleLog.rewardSummary ?? `${selectedDeck.name} completed.`
                  : "Best run stats saved. Training progress is safe."}
              </p>
            </div>
            <p className="mt-2 text-sm font-bold leading-6 text-amber-900/75">
              {isComplete
                ? "Permanent progress saved. Any next-deck unlock uses the existing deck progression rules."
                : "Try reviewing the deck or training before the next run. Shop upgrades reset because they are current-run-only."}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <StatCard label="Deck" value={selectedDeck.name} tone={isComplete ? "emerald" : "red"} />
            <StatCard label="Boss" value={statistics.bossDefeated ? selectedBoss.name : "No"} tone="purple" />
            <StatCard label="Monsters" value={statistics.monstersDefeated} tone="emerald" />
            <StatCard label="Elites" value={statistics.eliteDefeated} tone="red" />
            <StatCard label="Events" value={statistics.eventsVisited} tone="purple" />
            <StatCard label="Floor" value={runProgress.currentFloor} tone="slate" />
            <StatCard label="Final Gold" value={finalGold} tone="amber" />
            <StatCard label="Run Deck" value={currentRunDeckSize} tone="slate" />
            <StatCard label="Correct" value={statistics.correctAnswers} tone="emerald" />
            <StatCard label="Wrong" value={statistics.wrongAnswers + statistics.timeouts} tone="red" />
            <StatCard label="Accuracy" value={`${summaryAccuracy}%`} tone="sky" />
            <StatCard label="Damage" value={statistics.totalDamageDealt} tone="red" />
            <StatCard label="Shield Gained" value={statistics.totalShieldGained} tone="sky" />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              onClick={onRestartRun}
              variant={isComplete ? "secondary" : "danger"}
            >
              {isComplete ? "Start Fresh Run" : "Restart Run"}
            </Button>
            <Button type="button" onClick={onReviewDeck}>
              Review Deck
            </Button>
            <Button type="button" onClick={onTraining} variant="secondary">
              Training
            </Button>
            <Button type="button" onClick={onBackHome} variant="ghost">
              Back Home
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

type QaHelperPanelProps = {
  canUseBattleSkip: boolean;
  onAddGold: () => void;
  onForceRunFailed: () => void;
  onHealPlayer: () => void;
  onQaCorrect: () => void;
  onQaWrong: () => void;
  onSetHpLow: () => void;
  onShowShopCheckpoint: () => void;
  onStartBossTest: () => void;
  onTriggerElite: () => void;
  onTriggerEvent: () => void;
  onUnlockBossTest: () => void;
};

function QaHelperPanel({
  canUseBattleSkip,
  onAddGold,
  onForceRunFailed,
  onHealPlayer,
  onQaCorrect,
  onQaWrong,
  onSetHpLow,
  onShowShopCheckpoint,
  onStartBossTest,
  onTriggerElite,
  onTriggerEvent,
  onUnlockBossTest,
}: QaHelperPanelProps) {
  return (
    <details className="rounded-2xl border-2 border-fuchsia-300 bg-fuchsia-50/95 p-3 text-fuchsia-950 shadow-[0_8px_0_rgba(112,26,117,0.14)]">
      <summary className="cursor-pointer">
        <span className="inline-flex flex-wrap items-center gap-2">
          <Badge tone="purple">{qaHelperLabel}</Badge>
          <span className="text-sm font-black uppercase text-fuchsia-900/70">
            {developmentOnlyLabel}
          </span>
        </span>
      </summary>
      <p className="mt-2 text-xs font-bold leading-5 text-fuchsia-950/75">
        These controls are gated by <code>import.meta.env.DEV</code>. They
        mutate temporary run state for testing and are not player-facing.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        <Button
          type="button"
          variant="secondary"
          disabled={!canUseBattleSkip}
          onClick={onQaCorrect}
        >
          {qaCorrectLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={!canUseBattleSkip}
          onClick={onQaWrong}
        >
          {qaWrongLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={onSetHpLow}>
          Set HP Low
        </Button>
        <Button type="button" variant="secondary" onClick={onHealPlayer}>
          Heal Player
        </Button>
        <Button type="button" variant="secondary" onClick={onAddGold}>
          Add +50 Gold
        </Button>
        <Button type="button" variant="secondary" onClick={onShowShopCheckpoint}>
          Go To Shop Checkpoint
        </Button>
        <Button type="button" variant="secondary" onClick={onTriggerEvent}>
          Trigger Event
        </Button>
        <Button type="button" variant="secondary" onClick={onTriggerElite}>
          Trigger Elite
        </Button>
        <Button type="button" variant="secondary" onClick={onUnlockBossTest}>
          Unlock Boss Test
        </Button>
        <Button type="button" variant="secondary" onClick={onStartBossTest}>
          Start Boss Test
        </Button>
        <Button type="button" variant="danger" onClick={onForceRunFailed}>
          {forceRunFailedLabel}
        </Button>
      </div>
      {!canUseBattleSkip && (
        <p className="mt-2 rounded-lg border border-fuchsia-200 bg-white/70 px-3 py-2 text-xs font-bold leading-5 text-fuchsia-950/70">
          {qaCorrectLabel} / {qaWrongLabel} are available only after Start
          Battle while an unanswered mini-game is active.
        </p>
      )}
      <p className="mt-3 rounded-lg border border-fuchsia-200 bg-white/70 px-3 py-2 text-xs font-bold leading-5 text-fuchsia-950/75">
        {forceRunCompleteLabel} is intentionally deferred because it can bypass
        the real boss defeat reward path. Use Start Boss Test, then defeat the
        boss through the existing battle flow.
      </p>
    </details>
  );
}

type WordChoiceBattleProps = {
  actions: BattleResultAction[];
  battleLog: BattleLog;
  encounterResultLabel?: string;
  isAnswered: boolean;
  isDefeated: boolean;
  question: WordChoiceQuestion;
  selectedChoiceId: string | null;
  onAnswer: (choice: WordCard) => void;
  wordFatigue: WordFatigueByWord;
  wordMastery: WordMasteryByCardId;
};

function CardStatChips({
  card,
  wordFatigue,
  wordMastery,
}: {
  card: WordCard;
  wordFatigue: WordFatigueByWord;
  wordMastery: WordMasteryByCardId;
}) {
  const shieldAmount = getCardShieldAmount(card);
  const element = getCardElement(card);
  const masteryBonus = getCardMasteryBonus(card, wordMastery);
  const usageCount = getWordUsageCount(wordFatigue, card.word);
  const energyLabel = getWordEnergyLabel(usageCount);

  return (
    <div className="flex max-w-full flex-wrap gap-1 sm:shrink-0 sm:justify-end">
      <span
        className={`rounded-full border px-1.5 py-0.5 text-[10px] font-black uppercase ${
          usageCount >= 5
            ? "border-stone-300 bg-stone-100 text-stone-700"
            : usageCount >= 3
              ? "border-orange-200 bg-orange-50 text-orange-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
        }`}
      >
        {energyLabel}
      </span>
      <span className="rounded-full border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-black uppercase text-red-800">
        ATK {card.baseAttack}
      </span>
      {shieldAmount > 0 && (
        <span className="rounded-full border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[10px] font-black uppercase text-sky-800">
          SHD +{shieldAmount}
        </span>
      )}
      {element && (
        <span className="rounded-full border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[10px] font-black uppercase text-violet-800">
          {formatElementName(element.element)}
        </span>
      )}
      {masteryBonus > 0 && (
        <span className="rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-black uppercase text-amber-800">
          M+{masteryBonus}
        </span>
      )}
    </div>
  );
}

function BattleResultOverlay({
  actions,
  battleLog,
  correctAnswer,
  encounterResultLabel,
  isAnswered,
  isCorrect,
  isDefeated,
  isTimeout,
}: {
  actions: BattleResultAction[];
  battleLog: BattleLog;
  correctAnswer: string;
  encounterResultLabel?: string;
  isAnswered: boolean;
  isCorrect: boolean;
  isDefeated: boolean;
  isTimeout?: boolean;
}) {
  if (!isAnswered) {
    return null;
  }

  const isNeutralCheckpoint = battleLog.tone === "neutral" && actions.length > 0;
  const toneClass = isDefeated
    ? "border-red-500 bg-gradient-to-br from-red-100 to-stone-100 text-red-950"
    : isNeutralCheckpoint
      ? "border-amber-400 bg-amber-50 text-amber-950"
    : isCorrect
    ? "border-emerald-400 bg-emerald-50 text-emerald-950"
    : isTimeout
      ? "border-amber-400 bg-amber-50 text-amber-950"
      : "border-red-400 bg-red-50 text-red-950";
  const { title, subtitle } = isNeutralCheckpoint
    ? {
        title: "Checkpoint Ready",
        subtitle: `${qaHelperLabel} safely prepared the normal result actions.`,
      }
    : getResultOverlayCopy({
        battleLog,
        encounterResultLabel,
        isCorrect,
        isDefeated,
        isTimeout,
      });
  const elementLine = getElementCombatText(battleLog);
  const resultIcon = isDefeated
    ? "💀"
    : isNeutralCheckpoint
      ? "🧭"
    : encounterResultLabel
      ? "🏆"
      : isCorrect
        ? "⚔"
        : isTimeout
          ? "⏳"
          : "💥";
  const actionHint = actions.some((action) => action.label === "Go To Shop")
    ? "Shop checkpoint reached."
    : actions.some((action) => action.label === "Start Boss Battle")
      ? "Boss available."
      : "";
  const resultLines = isNeutralCheckpoint
    ? []
    : isCorrect
    ? [
        battleLog.damageDealt !== undefined
          ? `+${battleLog.damageDealt} Damage`
          : null,
        battleLog.shieldGained ? `Shield +${battleLog.shieldGained}` : null,
        elementLine || null,
        battleLog.masteryBonusDamage
          ? `Mastery +${battleLog.masteryBonusDamage}`
          : null,
        battleLog.wordEnergyFeedback ?? null,
      ].filter(Boolean)
    : [
        battleLog.damageTaken !== undefined
          ? `Enemy attacks for ${battleLog.damageTaken}`
          : null,
        battleLog.shieldAbsorbed ? `Shield blocked ${battleLog.shieldAbsorbed}` : null,
        battleLog.hpDamageTaken ? `HP -${battleLog.hpDamageTaken}` : null,
      ].filter(Boolean);

  return (
    <div className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-stone-950/45 p-2 backdrop-blur-[2px] sm:p-3">
      <div className={`result-pop pointer-events-auto max-h-[min(82dvh,30rem)] w-full max-w-[min(21rem,calc(100vw-1rem))] overflow-y-auto rounded-2xl border-2 p-2.5 text-center shadow-[0_18px_0_rgba(28,25,23,0.22)] sm:max-h-[min(88vh,32rem)] sm:max-w-[min(22rem,calc(100vw-2rem))] sm:p-4 ${toneClass}`}>
        <p className="attack-pop text-3xl leading-none" aria-hidden="true">
          {resultIcon}
        </p>
        <p className="text-xl font-black leading-none sm:text-3xl">{title}</p>
        <p className="mt-1 text-xs font-black uppercase opacity-70">
          {subtitle}
        </p>
        {resultLines.length > 0 && (
          <div className="mt-3 grid gap-1">
            {resultLines.slice(0, 4).map((line) => (
              <p
                key={line}
                className={`rounded-lg bg-white/60 px-2 py-1 text-sm font-black shadow-inner ${
                  isCorrect ? "reward-pulse" : "damage-shake"
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        )}
        <p className="mt-2 text-xs font-bold leading-5 opacity-80">
          Correct answer: {correctAnswer}
        </p>
        {actionHint && (
          <p className="mt-2 rounded-full bg-white/50 px-2 py-1 text-xs font-black uppercase opacity-85">
            {actionHint}
          </p>
        )}
        {actions.length > 0 && (
          <div className="mt-3 grid gap-2">
            {actions.map((action) => (
              <Button
                key={action.label}
                type="button"
                onClick={action.onClick}
                variant={action.variant}
                className="w-full"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WordChoiceBattle({
  actions,
  battleLog,
  encounterResultLabel,
  isAnswered,
  isDefeated,
  question,
  selectedChoiceId,
  onAnswer,
  wordFatigue,
  wordMastery,
}: WordChoiceBattleProps) {
  const showsEnglishChoices =
    question.promptType === "thai-to-english" ||
    question.promptType === "sentence-cloze";

  return (
    <div className="relative h-full">
      <BattleResultOverlay
        actions={actions}
        battleLog={battleLog}
        correctAnswer={
          showsEnglishChoices
            ? `${question.card.word} = ${question.card.meaningTh}`
            : question.card.meaningTh
        }
        encounterResultLabel={encounterResultLabel}
        isAnswered={isAnswered}
        isCorrect={selectedChoiceId === question.card.id}
        isDefeated={isDefeated}
        isTimeout={selectedChoiceId === null}
      />
      <div className="rounded-2xl border-2 border-amber-900/10 bg-white/85 p-2 shadow-inner">
        <Badge tone="purple">
          {formatWordChoicePromptType(question.promptType)}
        </Badge>
        {question.promptType === "thai-to-english" ? (
          <div className="mt-1">
            <p className="text-2xl font-black leading-tight text-amber-950 sm:text-3xl">
              {question.card.meaningTh}
            </p>
          </div>
        ) : question.promptType === "sentence-cloze" ? (
          <div className="mt-1">
            <p className="text-xl font-black leading-tight text-amber-950 sm:text-2xl">
              {blankTargetWord(
                question.card.exampleSentence,
                question.card.word,
              )}
            </p>
          </div>
        ) : (
          <div className="mt-1">
            <p className="text-3xl font-black capitalize leading-tight text-amber-950 sm:text-4xl">
              {question.card.word}
            </p>
          </div>
        )}
      </div>

      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {question.choices.map((choice) => {
          const isSelected = selectedChoiceId === choice.id;
          const isCorrectChoice = choice.id === question.card.id;
          const showCorrect = isAnswered && isCorrectChoice;
          const showWrong = isAnswered && isSelected && !isCorrectChoice;

          return (
            <button
              key={choice.id}
              type="button"
              disabled={isAnswered}
              onClick={() => onAnswer(choice)}
              className={`min-h-12 rounded-xl border-2 px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                showCorrect
                  ? "reward-pulse border-emerald-500 bg-emerald-50 shadow-[0_5px_0_rgba(6,95,70,0.18)]"
                  : showWrong
                    ? "damage-shake border-red-400 bg-red-50 shadow-[0_5px_0_rgba(127,29,29,0.16)]"
                    : "border-amber-900/10 bg-white hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md active:translate-y-0.5"
              } ${isAnswered ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-slate-950">
                    {showsEnglishChoices ? choice.word : choice.meaningTh}
                  </p>
                  <p className="truncate text-xs capitalize text-slate-500">
                    {showsEnglishChoices ? choice.partOfSpeech : choice.word}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <CardStatChips
                    card={choice}
                    wordFatigue={wordFatigue}
                    wordMastery={wordMastery}
                  />
                  {showCorrect && <Badge tone="emerald">Correct</Badge>}
                  {showWrong && <Badge tone="red">Wrong</Badge>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

type WordMatchBattleProps = {
  actions: BattleResultAction[];
  battleLog: BattleLog;
  encounterResultLabel?: string;
  isAnswered: boolean;
  isDefeated: boolean;
  question: WordMatchQuestion;
  selectedMeaningId: string | null;
  selectedWordId: string | null;
  onSelectMeaning: (cardId: string) => void;
  onSelectWord: (cardId: string) => void;
  onSubmit: () => void;
  wordFatigue: WordFatigueByWord;
  wordMastery: WordMasteryByCardId;
};

function WordMatchBattle({
  actions,
  battleLog,
  encounterResultLabel,
  isAnswered,
  isDefeated,
  question,
  selectedMeaningId,
  selectedWordId,
  onSelectMeaning,
  onSelectWord,
  onSubmit,
  wordFatigue,
  wordMastery,
}: WordMatchBattleProps) {
  const selectedWord = question.cards.find((card) => card.id === selectedWordId);
  const selectedMeaning = question.meanings.find(
    (card) => card.id === selectedMeaningId,
  );
  const isCorrect =
    isAnswered && selectedWordId !== null && selectedWordId === selectedMeaningId;
  const correctAnswer = selectedWord
    ? `${selectedWord.word} = ${selectedWord.meaningTh}`
    : "Choose a word and meaning";
  const selectedPairText =
    selectedWord && selectedMeaning
      ? `Selected: ${selectedWord.word} + ${selectedMeaning.meaningTh}`
      : "Choose 1 card and 1 meaning";

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <BattleResultOverlay
        actions={actions}
        battleLog={battleLog}
        correctAnswer={correctAnswer}
        encounterResultLabel={encounterResultLabel}
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        isDefeated={isDefeated}
        isTimeout={selectedWordId === null && selectedMeaningId === null}
      />
      <div className="grid min-h-0 flex-1 gap-1.5 sm:gap-2 md:grid-cols-2">
        <div className="min-h-0">
          <p className="mb-1 text-xs font-black uppercase tracking-wide text-emerald-800/75">
            เลือกการ์ด
          </p>
          <div className="grid gap-2">
            {question.cards.map((card) => {
              const isSelected = selectedWordId === card.id;
              const showCorrect =
                isAnswered && isSelected && selectedMeaningId === card.id;
              const showWrong =
                isAnswered && isSelected && selectedMeaningId !== card.id;

              return (
                <button
                  key={card.id}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => onSelectWord(card.id)}
                  className={`min-h-16 rounded-xl border-2 px-2.5 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:min-h-20 sm:px-3 ${
                    showCorrect
                      ? "reward-pulse border-emerald-500 bg-emerald-50 shadow-[0_5px_0_rgba(6,95,70,0.18)]"
                      : showWrong
                        ? "damage-shake border-red-400 bg-red-50 shadow-[0_5px_0_rgba(127,29,29,0.16)]"
                        : isSelected
                          ? "selected-glow border-emerald-500 bg-white shadow-md"
                          : "border-amber-900/10 bg-white hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md active:translate-y-0.5"
                  }`}
                >
                  <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold capitalize text-slate-950">
                        {card.word}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <CardStatChips
                        card={card}
                        wordFatigue={wordFatigue}
                        wordMastery={wordMastery}
                      />
                      {!isAnswered && isSelected && (
                        <Badge tone="sky">Selected</Badge>
                      )}
                      {showCorrect && <Badge tone="emerald">Match</Badge>}
                      {showWrong && <Badge tone="red">Wrong</Badge>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-0">
          <p className="mb-1 text-xs font-black uppercase tracking-wide text-amber-800/75">
            เลือกความหมาย
          </p>
          <div className="grid gap-2">
            {question.meanings.map((card) => {
              const isSelected = selectedMeaningId === card.id;
              const showCorrect =
                isAnswered && isSelected && selectedWordId === card.id;
              const showWrong =
                isAnswered && isSelected && selectedWordId !== card.id;

              return (
                <button
                  key={card.id}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => onSelectMeaning(card.id)}
                  className={`min-h-16 rounded-xl border-2 px-2.5 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:min-h-20 sm:px-3 ${
                    showCorrect
                      ? "reward-pulse border-emerald-500 bg-emerald-50 shadow-[0_5px_0_rgba(6,95,70,0.18)]"
                      : showWrong
                        ? "damage-shake border-red-400 bg-red-50 shadow-[0_5px_0_rgba(127,29,29,0.16)]"
                        : isSelected
                          ? "selected-glow border-emerald-500 bg-white shadow-md"
                          : "border-amber-900/10 bg-white hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md active:translate-y-0.5"
                  }`}
                >
                  <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-slate-950">
                        {card.meaningTh}
                      </p>
                      <p className="truncate text-xs capitalize text-slate-500">
                        {card.partOfSpeech}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {!isAnswered && isSelected && (
                        <Badge tone="sky">Selected</Badge>
                      )}
                      {showCorrect && <Badge tone="emerald">Match</Badge>}
                      {showWrong && <Badge tone="red">Wrong</Badge>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-[1] mt-2 flex shrink-0 flex-col gap-2 rounded-xl border-2 border-amber-900/10 bg-amber-50/95 px-2.5 py-2 shadow-md sm:flex-row sm:items-center sm:justify-between sm:px-3">
        <p className="line-clamp-2 text-xs font-black text-amber-950 sm:truncate sm:text-sm">
          {selectedPairText}
        </p>
        <Button
          type="button"
          disabled={isAnswered || !selectedWordId || !selectedMeaningId}
          onClick={onSubmit}
          className="w-full shrink-0 sm:w-auto"
        >
          Check Pair
        </Button>
      </div>
    </div>
  );
}

type WordScrambleBattleProps = {
  actions: BattleResultAction[];
  answer: string;
  battleLog: BattleLog;
  encounterResultLabel?: string;
  isAnswered: boolean;
  isDefeated: boolean;
  question: WordScrambleQuestion;
  selectedCardId: string | null;
  onAnswerChange: (answer: string) => void;
  onSelectCard: (cardId: string) => void;
  onSubmit: () => void;
  wordFatigue: WordFatigueByWord;
  wordMastery: WordMasteryByCardId;
};

type ScrambleLetterTile = {
  id: string;
  letter: string;
  originalIndex: number;
};

function createScrambleLetterTiles(
  card: WordCard,
  scrambledWord: string,
): ScrambleLetterTile[] {
  const sourceTiles = card.word
    .trim()
    .toLowerCase()
    .split("")
    .map((letter, index) => ({
      id: `${card.id}-tile-${index}-${letter}`,
      letter,
      originalIndex: index,
    }));
  const usedSourceTileIds = new Set<string>();
  const orderedTiles: ScrambleLetterTile[] = [];

  for (const scrambledLetter of scrambledWord.toLowerCase().split("")) {
    const matchingTile = sourceTiles.find(
      (tile) =>
        tile.letter === scrambledLetter && !usedSourceTileIds.has(tile.id),
    );

    if (!matchingTile) {
      continue;
    }

    usedSourceTileIds.add(matchingTile.id);
    orderedTiles.push(matchingTile);
  }

  const remainingTiles = sourceTiles.filter(
    (tile) => !usedSourceTileIds.has(tile.id),
  );

  return [...orderedTiles, ...remainingTiles];
}

function WordScrambleBattle({
  actions,
  answer,
  battleLog,
  encounterResultLabel,
  isAnswered,
  isDefeated,
  question,
  selectedCardId,
  onAnswerChange,
  onSelectCard,
  onSubmit,
  wordFatigue,
  wordMastery,
}: WordScrambleBattleProps) {
  const selectedOption = question.options.find(
    (option) => option.card.id === selectedCardId,
  );
  const [availableTiles, setAvailableTiles] = useState<ScrambleLetterTile[]>([]);
  const [answerTiles, setAnswerTiles] = useState<ScrambleLetterTile[]>([]);
  const isCorrect =
    isAnswered &&
    selectedOption !== undefined &&
    answer.trim().toLowerCase() === selectedOption.card.word.toLowerCase();
  const isWrong = isAnswered && selectedOption !== undefined && !isCorrect;
  const selectedWordLength = selectedOption?.card.word.trim().length ?? 0;
  const canCheckWord =
    !isAnswered &&
    selectedOption !== undefined &&
    answerTiles.length === selectedWordLength;

  useEffect(() => {
    if (!selectedOption) {
      setAvailableTiles([]);
      setAnswerTiles([]);
      onAnswerChange("");
      return;
    }

    setAvailableTiles(
      createScrambleLetterTiles(selectedOption.card, selectedOption.scrambledWord),
    );
    setAnswerTiles([]);
    onAnswerChange("");
  }, [onAnswerChange, selectedOption]);

  function updateAnswerTiles(nextAnswerTiles: ScrambleLetterTile[]) {
    setAnswerTiles(nextAnswerTiles);
    onAnswerChange(nextAnswerTiles.map((tile) => tile.letter).join(""));
  }

  function selectScrambledOption(cardId: string) {
    onSelectCard(cardId);
    onAnswerChange("");
  }

  function moveTileToAnswer(tile: ScrambleLetterTile) {
    if (isAnswered) {
      return;
    }

    setAvailableTiles((currentTiles) =>
      currentTiles.filter((currentTile) => currentTile.id !== tile.id),
    );
    updateAnswerTiles([...answerTiles, tile]);
  }

  function returnTileToBank(tile: ScrambleLetterTile) {
    if (isAnswered) {
      return;
    }

    updateAnswerTiles(
      answerTiles.filter((currentTile) => currentTile.id !== tile.id),
    );
    setAvailableTiles((currentTiles) => [...currentTiles, tile]);
  }

  function clearAnswerTiles() {
    if (!selectedOption || isAnswered) {
      return;
    }

    setAvailableTiles(
      createScrambleLetterTiles(selectedOption.card, selectedOption.scrambledWord),
    );
    updateAnswerTiles([]);
  }

  return (
    <div className="relative h-full">
      <BattleResultOverlay
        actions={actions}
        battleLog={battleLog}
        correctAnswer={
          selectedOption
            ? `${selectedOption.card.word} = ${selectedOption.card.meaningTh}`
            : "Choose a scrambled word first"
        }
        encounterResultLabel={encounterResultLabel}
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        isDefeated={isDefeated}
        isTimeout={isAnswered && selectedOption === undefined}
      />
      <div className="grid gap-1.5 sm:grid-cols-3 sm:gap-2">
        {question.options.map((option) => {
          const isSelected = selectedCardId === option.card.id;
          const showCorrect = isCorrect && isSelected;
          const showWrong = isWrong && isSelected;

          return (
            <button
              key={option.card.id}
              type="button"
              disabled={isAnswered}
              onClick={() => selectScrambledOption(option.card.id)}
              className={`rounded-xl border-2 px-2 py-1.5 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:px-3 sm:py-2 ${
                showCorrect
                  ? "reward-pulse border-emerald-500 bg-emerald-50 shadow-[0_5px_0_rgba(6,95,70,0.18)]"
                  : showWrong
                    ? "damage-shake border-red-400 bg-red-50 shadow-[0_5px_0_rgba(127,29,29,0.16)]"
                    : isSelected
                      ? "selected-glow border-emerald-500 bg-white shadow-md"
                      : "border-amber-900/10 bg-white hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md active:translate-y-0.5"
              }`}
            >
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <div className="min-w-0">
                  <p className="break-words font-mono text-base font-bold tracking-wide text-slate-950 sm:text-xl">
                    {option.scrambledWord}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                  {!isAnswered && isSelected && (
                    <Badge tone="sky">Selected</Badge>
                  )}
                  {showCorrect && <Badge tone="emerald">Solved</Badge>}
                  {showWrong && <Badge tone="red">Wrong</Badge>}
                </div>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5 sm:mt-2 sm:gap-2">
                <CardStatChips
                  card={option.card}
                  wordFatigue={wordFatigue}
                  wordMastery={wordMastery}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-2 rounded-2xl border-2 border-amber-900/10 bg-white p-2 shadow-inner">
        <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-black uppercase tracking-wide text-amber-800/75">
                Build your answer
              </p>
              {selectedOption && (
                <Badge tone={canCheckWord ? "emerald" : "amber"}>
                  {answerTiles.length} / {selectedWordLength}
                </Badge>
              )}
            </div>
            <div className="mt-1.5 min-h-12 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/80 p-1.5 sm:mt-2 sm:min-h-14 sm:p-2">
              {answerTiles.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {answerTiles.map((tile) => (
                    <button
                      key={tile.id}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => returnTileToBank(tile)}
                      className="grid size-10 place-items-center rounded-lg border-2 border-emerald-500 bg-emerald-100 font-mono text-lg font-black uppercase text-emerald-950 shadow-[0_3px_0_rgba(6,95,70,0.22)] transition hover:-translate-y-0.5 active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:cursor-default disabled:hover:translate-y-0 sm:size-11 sm:text-xl"
                    >
                      {tile.letter}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="px-2 py-2 text-sm font-bold text-amber-900/65 sm:py-3">
                  {selectedOption
                    ? "Tap letters below to build the word."
                    : "Choose a scrambled word first."}
                </p>
              )}
            </div>

            <div className="mt-2 sm:mt-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-black uppercase tracking-wide text-amber-800/75">
                  Letter Tiles
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  className="px-3 py-1 text-xs"
                  disabled={isAnswered || answerTiles.length === 0}
                  onClick={clearAnswerTiles}
                >
                  Clear Answer
                </Button>
              </div>
              <div className="mt-1.5 min-h-12 rounded-xl border border-amber-900/10 bg-slate-50 p-1.5 sm:mt-2 sm:min-h-14 sm:p-2">
                {availableTiles.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {availableTiles.map((tile) => (
                      <button
                        key={tile.id}
                        type="button"
                        disabled={isAnswered || !selectedOption}
                        onClick={() => moveTileToAnswer(tile)}
                        className="grid size-10 place-items-center rounded-lg border-2 border-amber-300 bg-gradient-to-b from-amber-100 to-yellow-200 font-mono text-lg font-black uppercase text-amber-950 shadow-[0_3px_0_rgba(120,53,15,0.22)] transition hover:-translate-y-0.5 active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-default disabled:opacity-60 disabled:hover:translate-y-0 sm:size-11 sm:text-xl"
                      >
                        {tile.letter}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="px-2 py-3 text-sm font-bold text-slate-500">
                    {selectedOption
                      ? "All letters are in your answer."
                      : "Letter tiles appear after choosing a card."}
                  </p>
                )}
              </div>
            </div>
          </div>
          <Button
            type="button"
            disabled={!canCheckWord}
            onClick={onSubmit}
            className="w-full lg:w-auto"
          >
            Check Word
          </Button>
        </div>
      </div>
    </div>
  );
}
