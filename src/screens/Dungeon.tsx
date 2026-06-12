import { useEffect, useMemo, useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import {
  Badge,
  Button,
  CardPanel,
  ProgressBar,
  StatCard,
} from "../components/ui";
import { sampleBoss, sampleMonsters } from "../data";
import {
  ALTAR_HP_COST,
  BOSS_MONSTER_REQUIREMENT,
  EARTH_ATTACK_REDUCTION,
  ELITE_ATTACK_BONUS,
  ELITE_ENCOUNTER_WEIGHT,
  ELITE_GOLD_BONUS,
  ELITE_HP_MULTIPLIER,
  EVENT_ATTACK_UPGRADE_AMOUNT,
  EVENT_ENCOUNTER_WEIGHT,
  FIRE_BONUS_DAMAGE,
  INITIAL_SHIELD,
  MONSTER_ENCOUNTER_WEIGHT,
  PLAYER_MAX_HP,
  SHRINE_HEAL_AMOUNT,
  SHRINE_SHIELD_GAIN,
  TREASURE_GOLD_REWARD,
  WATER_SHIELD_GAIN,
  WIND_DEFEAT_GOLD_BONUS,
  WORD_CHOICE_TIME_LIMIT,
  WORD_MATCH_TIME_LIMIT,
  WORD_SCRAMBLE_TIME_LIMIT,
} from "../game/balance";
import {
  getMasteryDamageBonus,
  getMasterySourceCardId,
  getMasteryStatusLabel,
} from "../game/mastery";
import type {
  Monster,
  RunProgressState,
  RunStatistics,
  ScreenName,
  VocabularyDeck,
  WordCard,
  WordMasteryByCardId,
} from "../types";

type DungeonProps = {
  currentRunDeck: WordCard[];
  isSelectedDeckCompleted: boolean;
  onCompleteSelectedDeck: () => CompletionReward;
  onAddRandomElementToRunCard: () => { word: string; element: string } | null;
  onGainRunGold: (amount: number) => void;
  onMonsterDefeated: (options?: { isElite?: boolean; bonusGold?: number }) => void;
  onNavigate: (screen: ScreenName) => void;
  onRecordRunEnded: (
    outcome: "completed" | "failed",
    finalRunStatistics: RunStatistics,
  ) => void;
  onResetRun: () => void;
  onUpgradeRandomRunCardAttack: (amount?: number) => string | null;
  onUpdateRunStatistics: (nextStatistics: RunStatistics) => void;
  runGold: number;
  runProgress: RunProgressState;
  runStatistics: RunStatistics;
  selectedDeck: VocabularyDeck;
  wordMastery: WordMasteryByCardId;
};

type CompletionReward = {
  completedMessage: string;
  unlockMessage: string;
};

type BattleMiniGameType = "word-choice" | "word-match" | "word-scramble";
type EncounterType = "monster" | "elite" | "event";
type DungeonEventId = "treasure-chest" | "healing-shrine" | "strange-altar";
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
  effectsSummary?: string;
  rewardSummary?: string;
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

const battleMiniGames: BattleMiniGameType[] = [
  "word-choice",
  "word-match",
  "word-scramble",
];
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
];

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

function rotateCards(seed: number, deck: WordCard[]) {
  return deck.map(
    (_, index) => deck[(seed + index) % deck.length],
  );
}

function takeUniqueWordCards(cards: WordCard[], count: number) {
  const usedWords = new Set<string>();
  const uniqueCards: WordCard[] = [];

  for (const card of cards) {
    const wordKey = card.word.toLowerCase();

    if (usedWords.has(wordKey)) {
      continue;
    }

    usedWords.add(wordKey);
    uniqueCards.push(card);

    if (uniqueCards.length === count) {
      break;
    }
  }

  return uniqueCards;
}

function buildChoices(card: WordCard, cardIndex: number, deck: WordCard[]) {
  const distractors = deck
    .filter(
      (candidate) =>
        candidate.id !== card.id &&
        candidate.word.toLowerCase() !== card.word.toLowerCase(),
    )
    .slice(cardIndex, cardIndex + 3);

  if (distractors.length < 3) {
    const fallbackChoices = deck.filter(
      (candidate) =>
        candidate.id !== card.id &&
        candidate.word.toLowerCase() !== card.word.toLowerCase() &&
        !distractors.some((distractor) => distractor.id === candidate.id),
    );

    distractors.push(...fallbackChoices.slice(0, 3 - distractors.length));
  }

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
): WordChoiceQuestion {
  const cardIndex = seed % deck.length;
  const card = deck[cardIndex];

  return {
    card,
    promptType: chooseWordChoicePromptType(seed),
    choices: buildChoices(card, cardIndex + 1, deck),
  };
}

function buildWordMatchQuestion(seed: number, deck: WordCard[]): WordMatchQuestion {
  const cards = takeUniqueWordCards(rotateCards(seed, deck), 3);
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
): WordScrambleQuestion {
  const cards = takeUniqueWordCards(rotateCards(seed + 2, deck), 3);

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

function getEncounterFlavorText(
  encounter: Monster,
  options: { isBossEncounter: boolean; encounterType: EncounterType },
) {
  if (options.isBossEncounter) {
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

  return `${encounter.name} blocks your path.`;
}

export function Dungeon({
  currentRunDeck,
  isSelectedDeckCompleted,
  onCompleteSelectedDeck,
  onAddRandomElementToRunCard,
  onGainRunGold,
  onMonsterDefeated,
  onNavigate,
  onRecordRunEnded,
  onResetRun,
  onUpgradeRandomRunCardAttack,
  onUpdateRunStatistics,
  runGold,
  runProgress,
  runStatistics,
  selectedDeck,
  wordMastery,
}: DungeonProps) {
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
  const [battleLog, setBattleLog] = useState<BattleLog>({
    tone: "neutral",
    message: "Inspect the encounter, then start battle when ready.",
  });
  const [battleStatus, setBattleStatus] =
    useState<BattleStatus>("encounter-intro");

  const currentMonster = getMonsterForIndex(monsterIndex);
  const eliteMonster = createEliteMonster(currentMonster);
  const currentEncounter = isBossEncounter
    ? sampleBoss
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
    () => buildWordChoiceQuestion(questionSeed, currentRunDeck),
    [currentRunDeck, questionSeed],
  );
  const wordMatchQuestion = useMemo(
    () => buildWordMatchQuestion(questionSeed, currentRunDeck),
    [currentRunDeck, questionSeed],
  );
  const wordScrambleQuestion = useMemo(
    () => buildWordScrambleQuestion(questionSeed, currentRunDeck),
    [currentRunDeck, questionSeed],
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
  const isTimerRunning = battleStatus === "fighting" && !isPaused && !isAnswered;
  const canPauseBattle = battleStatus === "fighting" && !isPaused && !isAnswered;
  const canShowTriggeredCardDetails = battleLog.triggeredCard !== undefined;
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

  function resetAnswerState() {
    setSelectedChoiceId(null);
    setSelectedWordId(null);
    setSelectedMeaningId(null);
    setSelectedScrambleCardId(null);
    setScrambleAnswer("");
    setIsAnswered(false);
  }

  function advanceQuestion() {
    const nextMiniGameType = chooseBattleMiniGame();

    setIsPaused(false);
    setPendingEarthReduction(0);
    resetAnswerState();
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

    setIsPaused(false);
    resetAnswerState();
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

    setIsPaused(true);
    setBattleLog({
      tone: "neutral",
      message: "Battle paused. Timer and question input are stopped.",
    });
  }

  function resumeBattle() {
    setIsPaused(false);
    setBattleLog({
      tone: "neutral",
      message: "Battle resumed. Answer before the timer runs out.",
    });
  }

  function leaveRunFromPause() {
    setIsPaused(false);
    setEndedRunGold(runGold);
    setEndedRunStatistics(runStatistics);
    onRecordRunEnded("failed", runStatistics);
    setBattleStatus("run-failed");
    setBattleLog({
      tone: "danger",
      message: "Run abandoned from pause. Temporary run state was not saved.",
    });
  }

  function triggerCard(card: WordCard) {
    const cardShieldGained = getCardShieldAmount(card);
    const element = getCardElement(card);
    const masteryLevel = wordMastery[getMasterySourceCardId(card.id)] ?? 0;
    const masteryBonusDamage = getMasteryDamageBonus(masteryLevel);
    const elementBonusDamage =
      element?.element === "fire" ? FIRE_BONUS_DAMAGE : 0;
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
        setEndedRunGold(runGold + windGoldGained);
        setEndedRunStatistics(nextRunStatistics);
        onRecordRunEnded("completed", nextRunStatistics);
        onUpdateRunStatistics(nextRunStatistics);
        setHasCompletedBoss(true);
        setBattleStatus("run-complete");
        setBattleLog({
          tone: "success",
          message: `${card.word} triggered for ${totalDamageDealt} total damage. ${masteryBonusDamage > 0 ? `Mastery added +${masteryBonusDamage} damage. ` : ""}${elementFeedback ? `${elementFeedback} ` : ""}${totalShieldGained > 0 ? `Gained ${totalShieldGained} shield. ` : ""}${windGoldGained > 0 ? `Gained ${windGoldGained} extra gold. ` : ""}${sampleBoss.name} defeated. ${completionReward.completedMessage} ${completionReward.unlockMessage} Permanent progress saved.`,
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
        message: `${card.word} triggered for ${totalDamageDealt} total damage. ${masteryBonusDamage > 0 ? `Mastery added +${masteryBonusDamage} damage. ` : ""}${elementFeedback ? `${elementFeedback} ` : ""}${totalShieldGained > 0 ? `Gained ${totalShieldGained} shield. ` : ""}${windGoldGained > 0 ? `Gained ${windGoldGained} extra gold. ` : ""}${currentEncounter.name} defeated.${encounterType === "elite" ? ` Elite bonus: +${ELITE_GOLD_BONUS} gold.` : ""}`,
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
        effectsSummary,
      });
      return;
    }

    onUpdateRunStatistics(nextRunStatistics);
    setBattleLog({
      tone: "success",
      message: `${card.word} triggered for ${totalDamageDealt} total damage. ${masteryBonusDamage > 0 ? `Mastery added +${masteryBonusDamage} damage. ` : ""}${elementFeedback ? `${elementFeedback} ` : ""}${totalShieldGained > 0 ? `Gained ${totalShieldGained} shield.` : ""}`,
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

    if (nextPlayerHp === 0) {
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
      battleStatus !== "fighting"
    ) {
      return;
    }

    setIsAnswered(true);
    monsterAttack("Time's up!", true);
  }, [battleStatus, isAnswered, isPaused, timeRemaining]);

  function handleWordChoiceAnswer(choice: WordCard) {
    if (isAnswered || isPaused || battleStatus !== "fighting") {
      return;
    }

    setSelectedChoiceId(choice.id);
    setIsAnswered(true);

    if (choice.id === wordChoiceQuestion.card.id) {
      triggerCard(wordChoiceQuestion.card);
      return;
    }

    monsterAttack();
  }

  function handleWordMatchSubmit() {
    if (
      isAnswered ||
      isPaused ||
      battleStatus !== "fighting" ||
      selectedWordId === null ||
      selectedMeaningId === null
    ) {
      return;
    }

    setIsAnswered(true);

    if (selectedWordId === selectedMeaningId) {
      const triggeredCard = wordMatchQuestion.cards.find(
        (card) => card.id === selectedWordId,
      );

      if (triggeredCard) {
        triggerCard(triggeredCard);
      }
      return;
    }

    monsterAttack();
  }

  function handleWordScrambleSubmit() {
    if (
      isAnswered ||
      isPaused ||
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

    setIsAnswered(true);

    if (
      scrambleAnswer.trim().toLowerCase() === selectedOption.card.word.toLowerCase()
    ) {
      triggerCard(selectedOption.card);
      return;
    }

    monsterAttack();
  }

  function handleNextMonster() {
    const nextMonsterIndex = monsterIndex + 1;
    const nextMonster = getMonsterForIndex(nextMonsterIndex);
    const nextMiniGameType = chooseBattleMiniGame();
    const nextEncounterType = chooseEncounterType();
    const nextEliteMonster = createEliteMonster(nextMonster);
    const isNextEvent = nextEncounterType === "event";

    setMonsterIndex(nextMonsterIndex);
    setEncounterType(nextEncounterType);
    setMonsterHp(
      nextEncounterType === "elite" ? nextEliteMonster.maxHp : nextMonster.maxHp,
    );
    setPendingEarthReduction(0);
    setIsPaused(false);
    setBattleStatus(isNextEvent ? "event" : "encounter-intro");
    resetAnswerState();
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

    setMonsterIndex(nextMonsterIndex);
    setEncounterType(nextEncounterType);
    setMonsterHp(
      nextEncounterType === "elite" ? nextEliteMonster.maxHp : nextMonster.maxHp,
    );
    setPendingEarthReduction(0);
    setIsPaused(false);
    setBattleStatus(isNextEvent ? "event" : "encounter-intro");
    resetAnswerState();
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

    continueAfterEvent("Chose Leave. No reward or cost.");
  }

  function handleStartBoss() {
    const nextMiniGameType = chooseBattleMiniGame();

    setIsBossEncounter(true);
    setEncounterType("monster");
    setMonsterHp(sampleBoss.maxHp);
    setPendingEarthReduction(0);
    setIsPaused(false);
    setBattleStatus("encounter-intro");
    resetAnswerState();
    setQuestionSeed((current) => current + 1);
    setMiniGameType(nextMiniGameType);
    setTimeRemaining(getMiniGameTimeLimit(nextMiniGameType));
    setBattleLog({
      tone: "neutral",
      message: `${sampleBoss.name} appears. Inspect the boss before battle.`,
    });
  }

  function handleRestartRun() {
    const nextMiniGameType = chooseBattleMiniGame();

    onResetRun();
    setPlayerHp(PLAYER_MAX_HP);
    setShield(INITIAL_SHIELD);
    setPendingEarthReduction(0);
    setEndedRunGold(null);
    setEndedRunStatistics(null);
    setIsBossEncounter(false);
    setHasCompletedBoss(false);
    setEncounterType("monster");
    setEventIndex(0);
    setMonsterIndex(0);
    setMonsterHp(getMonsterForIndex(0).maxHp);
    setIsPaused(false);
    setBattleStatus("encounter-intro");
    resetAnswerState();
    setQuestionSeed((current) => current + 1);
    setMiniGameType(nextMiniGameType);
    setTimeRemaining(getMiniGameTimeLimit(nextMiniGameType));
    setBattleLog({
      tone: "neutral",
      message: "Run restarted. Inspect the encounter, then start battle when ready.",
    });
  }

  return (
    <ScreenShell
      eyebrow="Battle"
      title="Dungeon"
      description="Answer timed vocabulary mini-games to trigger cards. Run state here is local and temporary."
      framed={false}
      wide
      gameMode
    >
      {isEncounterIntro ? (
        <CardPanel className="mx-auto grid h-full max-w-5xl place-items-center overflow-hidden border-red-900/30 bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 p-4 text-amber-50">
          <section
            className={`relative w-full overflow-hidden rounded-3xl border-2 p-6 text-center shadow-[inset_0_0_55px_rgba(0,0,0,0.28)] ${encounterStageClass}`}
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
                {encounterLabel}
              </Badge>
              <div
                className={`mx-auto mt-4 grid size-28 place-items-center rounded-3xl border-4 text-6xl shadow-lg ${encounterPortraitClass}`}
              >
                {currentEncounter.imagePlaceholder}
              </div>
              <h3 className="mt-4 text-5xl font-black leading-none text-amber-50 drop-shadow">
                {currentEncounter.name}
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-base font-bold leading-7 text-amber-100/90">
                {encounterFlavorText}
              </p>
              <div className="mx-auto mt-5 grid max-w-xl gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border-2 border-red-200/20 bg-black/30 p-4">
                  <p className="text-xs font-black uppercase text-red-100/70">
                    HP
                  </p>
                  <p className="mt-1 text-4xl font-black text-red-100">
                    {currentEncounter.maxHp}
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-amber-200/20 bg-black/30 p-4">
                  <p className="text-xs font-black uppercase text-amber-100/70">
                    Attack
                  </p>
                  <p className="mt-1 text-4xl font-black text-amber-100">
                    {currentEncounter.attack}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Badge tone="sky">Timer starts after Start Battle</Badge>
                {isBossEncounter && <Badge tone="purple">Major Fight</Badge>}
                {encounterType === "elite" && (
                  <Badge tone="amber">
                    Elite Bonus +{ELITE_GOLD_BONUS} gold
                  </Badge>
                )}
              </div>
              <Button
                type="button"
                onClick={startBattleFromIntro}
                className="mt-7 min-w-64 px-8 py-3 text-lg"
              >
                Start Battle
              </Button>
            </div>
          </section>
        </CardPanel>
      ) : (
      <div className="grid h-full min-h-0 gap-3 xl:grid-cols-[minmax(0,1fr)_260px] 2xl:grid-cols-[minmax(0,1fr)_280px]">
        <CardPanel className="relative h-full min-h-0 overflow-hidden border-red-900/30 bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 p-3 text-amber-50">
          <div className="flex h-full min-h-0 flex-col gap-3">
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
                <Button
                  type="button"
                  onClick={() => onNavigate("run-result")}
                  variant="secondary"
                >
                  End Run
                </Button>
              </div>
            </div>

            <section
              className={`rounded-2xl border-2 p-2 shadow-[inset_0_0_28px_rgba(0,0,0,0.2)] ${encounterStageClass}`}
            >
              <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.78fr)] lg:items-center">
                <div className="grid gap-2 sm:grid-cols-[1.25fr_0.7fr_0.7fr_0.7fr_0.9fr]">
                  <div className="rounded-xl border border-red-100/15 bg-red-950/25 px-3 py-1.5">
                    <div className="flex items-center justify-between text-sm font-black text-red-50">
                      <span>Player HP</span>
                      <span>{playerHp} / {PLAYER_MAX_HP}</span>
                    </div>
                    <ProgressBar
                      value={playerHp}
                      max={PLAYER_MAX_HP}
                      tone="red"
                      label="Player HP"
                    />
                  </div>
                  <div className="rounded-xl border border-sky-100/15 bg-sky-950/25 px-3 py-1.5">
                    <p className="text-xs font-black uppercase text-sky-100/70">
                      Shield
                    </p>
                    <p className="text-xl font-black text-sky-50">{shield}</p>
                  </div>
                  <div className="rounded-xl border border-amber-100/15 bg-amber-950/25 px-3 py-1.5">
                    <p className="text-xs font-black uppercase text-amber-100/70">
                      Gold
                    </p>
                    <p className="text-xl font-black text-amber-50">{runGold}</p>
                  </div>
                  <div className="rounded-xl border border-stone-100/15 bg-stone-950/25 px-3 py-1.5">
                    <p className="text-xs font-black uppercase text-stone-100/70">
                      Floor
                    </p>
                    <p className="text-xl font-black text-stone-50">
                      {runProgress.currentFloor}
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-100/15 bg-emerald-950/25 px-3 py-1.5">
                    <p className="text-xs font-black uppercase text-emerald-100/70">
                      Progress
                    </p>
                    <p className="text-base font-black text-emerald-50">
                      {runProgress.monstersDefeated} / {runProgress.nextShopAt}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
                  <div
                    className={`grid size-12 place-items-center rounded-xl border-4 text-3xl shadow-lg ${encounterPortraitClass}`}
                  >
                    {isEventEncounter
                      ? currentEvent.icon
                      : currentEncounter.imagePlaceholder}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge
                        tone={
                          isBossEncounter
                            ? "red"
                            : encounterType === "elite"
                              ? "amber"
                              : isEventEncounter
                                ? "purple"
                                : "emerald"
                        }
                      >
                        {encounterLabel}
                      </Badge>
                      {!isEventEncounter && (
                        <Badge tone="red">ATK {currentEncounter.attack}</Badge>
                      )}
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
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <h3 className="truncate text-2xl font-black leading-none text-amber-50 drop-shadow">
                        {isEventEncounter ? currentEvent.title : currentEncounter.name}
                      </h3>
                      {!isEventEncounter && (
                        <span className="shrink-0 text-sm font-black text-amber-100">
                          {monsterHp} / {currentEncounter.maxHp}
                        </span>
                      )}
                    </div>
                    {!isEventEncounter && (
                      <ProgressBar
                        value={monsterHp}
                        max={currentEncounter.maxHp}
                        label={`${currentEncounter.name} HP`}
                        tone={
                          isBossEncounter || encounterType === "elite"
                            ? "red"
                            : "emerald"
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid h-10 shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-amber-200/15 bg-black/20 px-3">
              <div className="flex items-center gap-2 text-sm font-black text-sky-100">
                <span className="grid size-7 place-items-center rounded-full border border-sky-200/30 bg-sky-100/15">
                  🧙
                </span>
                Player
              </div>
              <div className="relative h-2 rounded-full bg-amber-100/20">
                <span className="absolute inset-y-0 left-2 right-2 rounded-full border-t border-dashed border-amber-100/45" />
              </div>
              <div className="flex items-center gap-2 text-sm font-black text-red-100">
                <span className="grid size-7 place-items-center rounded-full border border-red-200/30 bg-red-100/15">
                  {isEventEncounter ? "✨" : currentEncounter.imagePlaceholder}
                </span>
                {isEventEncounter ? "Event" : currentEncounter.name}
              </div>
            </section>

            <section className="flex min-h-0 flex-1 flex-col rounded-3xl border-2 border-amber-300/30 bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50 p-2 text-amber-950 shadow-[0_8px_0_rgba(120,53,15,0.2)]">
              <div className="min-h-0 flex-1 rounded-2xl border-2 border-amber-900/10 bg-white/80 p-2 shadow-inner">
                {isEventEncounter ? (
                  <div className="grid h-full min-h-[260px] content-center gap-3 sm:grid-cols-2">
                    {currentEvent.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleEventOption(option.id)}
                        className="rounded-xl border-2 border-amber-900/15 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-amber-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                      >
                        <p className="text-lg font-black text-amber-950">
                          {option.label}
                        </p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-amber-900/70">
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : miniGameType === "word-choice" ? (
                  <WordChoiceBattle
                    isAnswered={isAnswered}
                    question={wordChoiceQuestion}
                    selectedChoiceId={selectedChoiceId}
                    onAnswer={handleWordChoiceAnswer}
                    onNext={canAdvanceAfterAnswer ? advanceQuestion : undefined}
                    battleLog={battleLog}
                    wordMastery={wordMastery}
                  />
                ) : miniGameType === "word-match" ? (
                  <WordMatchBattle
                    isAnswered={isAnswered}
                    question={wordMatchQuestion}
                    selectedMeaningId={selectedMeaningId}
                    selectedWordId={selectedWordId}
                    onSelectMeaning={setSelectedMeaningId}
                    onSelectWord={setSelectedWordId}
                    onSubmit={handleWordMatchSubmit}
                    onNext={canAdvanceAfterAnswer ? advanceQuestion : undefined}
                    battleLog={battleLog}
                    wordMastery={wordMastery}
                  />
                ) : (
                  <WordScrambleBattle
                    answer={scrambleAnswer}
                    isAnswered={isAnswered}
                    question={wordScrambleQuestion}
                    selectedCardId={selectedScrambleCardId}
                    onAnswerChange={setScrambleAnswer}
                    onSelectCard={setSelectedScrambleCardId}
                    onSubmit={handleWordScrambleSubmit}
                    onNext={canAdvanceAfterAnswer ? advanceQuestion : undefined}
                    battleLog={battleLog}
                    wordMastery={wordMastery}
                  />
                )}
              </div>
            </section>

            {(isBossAvailable || isShopAvailable) && (
              <section className="rounded-xl border-2 border-amber-300/20 bg-amber-100/10 p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Badge tone={isBossAvailable ? "red" : "amber"}>
                      {isBossAvailable ? "Boss Available" : "Shop Available"}
                    </Badge>
                    <p className="mt-1 text-sm font-bold text-amber-50">
                      {isBossAvailable
                        ? `${sampleBoss.name} is ready.`
                        : `Shop checkpoint reached after ${runProgress.monstersDefeated} monsters.`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {isBossAvailable && (
                      <Button type="button" onClick={handleStartBoss}>
                        Start Boss Battle
                      </Button>
                    )}
                    {isShopAvailable && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onNavigate("shop")}
                      >
                        Go To Shop
                      </Button>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>

          {isPaused && (
            <div className="absolute inset-0 z-20 grid place-items-center bg-stone-950/70 p-5 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-3xl border-2 border-amber-300 bg-amber-50 p-6 text-center text-amber-950 shadow-[0_18px_0_rgba(120,53,15,0.24)]">
                <Badge tone="amber">Paused</Badge>
                <h3 className="mt-3 text-5xl font-black">PAUSED</h3>
                <p className="mt-3 text-sm font-bold leading-6 text-amber-900/75">
                  Timer stopped. Question inputs are disabled until you resume.
                </p>
                <div className="mt-6 grid gap-3">
                  <Button type="button" onClick={resumeBattle}>
                    Resume
                  </Button>
                  <Button type="button" onClick={leaveRunFromPause} variant="danger">
                    Leave Run
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardPanel>

        <aside className="grid min-h-0 gap-3 lg:grid-cols-2 xl:block xl:h-full xl:space-y-3 xl:overflow-hidden">
          {!isEventEncounter && (
            <section
              className={`rounded-2xl border-2 p-3 shadow-[0_8px_0_rgba(120,53,15,0.14)] ${
                timeRemaining === 0
                  ? "border-red-400 bg-red-100"
                  : isTimerLow && isTimerRunning
                    ? "border-red-400 bg-red-50 motion-safe:animate-pulse"
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
                  <p className="text-3xl font-black leading-none text-amber-950">
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

          {(isAnswered && battleStatus === "fighting") ||
          battleStatus === "monster-defeated" ||
          battleStatus === "run-failed" ? (
            <section className="rounded-2xl border-2 border-amber-800/20 bg-amber-50/95 p-3 shadow-[0_6px_0_rgba(120,53,15,0.12)]">
              {isAnswered && battleStatus === "fighting" && (
                <Button type="button" onClick={advanceQuestion} className="w-full">
                  Next Mini-Game
                </Button>
              )}
              {battleStatus === "monster-defeated" && (
                <div className="grid gap-2">
                  {!isBossAvailable && (
                    <Button type="button" onClick={handleNextMonster}>
                      Spawn Next Monster
                    </Button>
                  )}
                  {isBossAvailable && (
                    <Button type="button" onClick={handleStartBoss}>
                      Start Boss Battle
                    </Button>
                  )}
                  {isShopAvailable && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => onNavigate("shop")}
                    >
                      Go To Shop
                    </Button>
                  )}
                </div>
              )}
              {battleStatus === "run-failed" && (
                <Button
                  type="button"
                  onClick={handleRestartRun}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Restart Run
                </Button>
              )}
            </section>
          ) : null}

          {canShowTriggeredCardDetails && (
          <details className="rounded-2xl border-2 border-amber-800/30 bg-gradient-to-br from-amber-50 to-orange-100 p-3 shadow-[0_10px_0_rgba(120,53,15,0.16)]" open>
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
              <span className="flex flex-wrap gap-2">
                <Badge tone="purple">Card Trigger</Badge>
                <Badge tone="emerald">Resolved</Badge>
              </span>
              <Badge tone={sidePanelMastery >= 5 ? "emerald" : "amber"}>
                {getMasteryStatusLabel(sidePanelMastery)}
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
              <div className="rounded-xl border border-red-200 bg-red-50 p-2">
                <p className="text-xs font-black uppercase text-red-800/70">
                  Base
                </p>
                <p className="text-xl font-black text-red-950">
                  {battleLog.baseDamageDealt ?? sidePanelCard.baseAttack}
                </p>
              </div>
              <div className="rounded-xl border border-violet-200 bg-violet-50 p-2">
                <p className="text-xs font-black uppercase text-violet-800/70">
                  Element
                </p>
                <p className="text-xl font-black text-violet-950">
                  +{battleLog.elementBonusDamage ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-2">
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
            </div>
          </details>
          )}

          <details className="rounded-xl border-2 border-amber-800/20 bg-amber-50/90 p-3">
            <summary className="cursor-pointer font-black text-amber-950">
              Learning Info
            </summary>
            <p className="mt-2 text-sm font-medium leading-6 text-amber-950/75">
              Correct answers trigger the selected word card. Incorrect answers
              and timeouts let the encounter attack, with shield absorbing
              damage before HP.
            </p>
          </details>

          {battleStatus === "run-complete" && (
            <section className="rounded-xl border-2 border-emerald-300 bg-emerald-100 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="emerald">Run Complete</Badge>
                <p className="font-black text-emerald-950">
                  {battleLog.rewardSummary ?? `${selectedDeck.name} completed.`}
                </p>
              </div>
              <p className="mt-2 text-sm font-medium text-emerald-950/75">
                Permanent progress saved. Temporary run state was not saved.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                <StatCard label="Deck" value={selectedDeck.name} tone="emerald" />
                <StatCard label="Monsters" value={summaryStatistics.monstersDefeated} tone="emerald" />
                <StatCard label="Elites" value={summaryStatistics.eliteDefeated} tone="red" />
                <StatCard label="Events" value={summaryStatistics.eventsVisited} tone="purple" />
                <StatCard label="Boss" value={summaryStatistics.bossDefeated ? "Defeated" : "No"} tone="purple" />
                <StatCard label="Final Gold" value={summaryGold} tone="amber" />
                <StatCard label="Run Deck" value={currentRunDeck.length} tone="slate" />
                <StatCard label="Accuracy" value={`${summaryAccuracy}%`} tone="sky" />
                <StatCard label="Damage" value={summaryStatistics.totalDamageDealt} tone="red" />
                <StatCard label="Shield Gained" value={summaryStatistics.totalShieldGained} tone="sky" />
              </div>
              <div className="mt-4 grid gap-2">
                <Button type="button" onClick={handleRestartRun} variant="secondary">
                  Start Fresh Run
                </Button>
                <Button type="button" onClick={() => onNavigate("deck-review")}>
                  Review Completed Deck
                </Button>
                <Button type="button" onClick={() => onNavigate("home")} variant="ghost">
                  Back Home
                </Button>
              </div>
            </section>
          )}

          {battleStatus === "run-failed" && (
            <section className="rounded-xl border-2 border-red-300 bg-red-100 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="red">Run Failed</Badge>
                <p className="font-black text-red-950">
                  {selectedDeck.name} run ended.
                </p>
              </div>
              <p className="mt-2 text-sm font-medium text-red-950/75">
                Best run summary was saved. Active run state was not saved.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                <StatCard label="Deck" value={selectedDeck.name} tone="red" />
                <StatCard label="Monsters" value={summaryStatistics.monstersDefeated} tone="emerald" />
                <StatCard label="Elites" value={summaryStatistics.eliteDefeated} tone="red" />
                <StatCard label="Events" value={summaryStatistics.eventsVisited} tone="purple" />
                <StatCard label="Floor" value={runProgress.currentFloor} tone="slate" />
                <StatCard label="Final Gold" value={summaryGold} tone="amber" />
                <StatCard label="Accuracy" value={`${summaryAccuracy}%`} tone="sky" />
                <StatCard label="Damage" value={summaryStatistics.totalDamageDealt} tone="red" />
                <StatCard label="Shield Gained" value={summaryStatistics.totalShieldGained} tone="sky" />
              </div>
            </section>
          )}

        </aside>
      </div>
      )}
    </ScreenShell>
  );
}

type WordChoiceBattleProps = {
  battleLog: BattleLog;
  isAnswered: boolean;
  onNext?: () => void;
  question: WordChoiceQuestion;
  selectedChoiceId: string | null;
  onAnswer: (choice: WordCard) => void;
  wordMastery: WordMasteryByCardId;
};

function CardStatChips({
  card,
  wordMastery,
}: {
  card: WordCard;
  wordMastery: WordMasteryByCardId;
}) {
  const shieldAmount = getCardShieldAmount(card);
  const element = getCardElement(card);
  const masteryBonus = getCardMasteryBonus(card, wordMastery);

  return (
    <div className="flex shrink-0 flex-wrap justify-end gap-1">
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
  battleLog,
  correctAnswer,
  isAnswered,
  isCorrect,
  isTimeout,
  onNext,
}: {
  battleLog: BattleLog;
  correctAnswer: string;
  isAnswered: boolean;
  isCorrect: boolean;
  isTimeout?: boolean;
  onNext?: () => void;
}) {
  if (!isAnswered) {
    return null;
  }

  const toneClass = isCorrect
    ? "border-emerald-400 bg-emerald-50 text-emerald-950"
    : isTimeout
      ? "border-amber-400 bg-amber-50 text-amber-950"
      : "border-red-400 bg-red-50 text-red-950";
  const title = isCorrect ? "Correct!" : isTimeout ? "Timeout!" : "Wrong!";
  const resultLines = isCorrect
    ? [
        battleLog.damageDealt !== undefined
          ? `+${battleLog.damageDealt} Damage`
          : null,
        battleLog.shieldGained ? `Shield +${battleLog.shieldGained}` : null,
        battleLog.effectsSummary ? battleLog.effectsSummary : null,
      ].filter(Boolean)
    : [
        battleLog.damageTaken !== undefined
          ? `Enemy attacks for ${battleLog.damageTaken}`
          : null,
        battleLog.shieldAbsorbed ? `Shield blocked ${battleLog.shieldAbsorbed}` : null,
        battleLog.hpDamageTaken ? `HP -${battleLog.hpDamageTaken}` : null,
      ].filter(Boolean);

  return (
    <div className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-stone-950/35 p-3 backdrop-blur-[1px]">
      <div className={`pointer-events-auto w-full max-w-xs rounded-2xl border-2 p-4 text-center shadow-2xl ${toneClass}`}>
        <p className="text-2xl font-black">{title}</p>
        {resultLines.length > 0 && (
          <div className="mt-2 grid gap-1">
            {resultLines.slice(0, 3).map((line) => (
              <p key={line} className="text-sm font-black">
                {line}
              </p>
            ))}
          </div>
        )}
        <p className="mt-2 text-xs font-bold leading-5 opacity-80">
          Correct answer: {correctAnswer}
        </p>
        {onNext && (
          <Button type="button" onClick={onNext} className="mt-3 w-full">
            Next Mini-Game
          </Button>
        )}
      </div>
    </div>
  );
}

function WordChoiceBattle({
  battleLog,
  isAnswered,
  question,
  selectedChoiceId,
  onAnswer,
  onNext,
  wordMastery,
}: WordChoiceBattleProps) {
  const showsEnglishChoices =
    question.promptType === "thai-to-english" ||
    question.promptType === "sentence-cloze";

  return (
    <div className="relative h-full">
      <BattleResultOverlay
        battleLog={battleLog}
        correctAnswer={
          showsEnglishChoices
            ? `${question.card.word} = ${question.card.meaningTh}`
            : question.card.meaningTh
        }
        isAnswered={isAnswered}
        isCorrect={selectedChoiceId === question.card.id}
        isTimeout={selectedChoiceId === null}
        onNext={onNext}
      />
      <div className="rounded-2xl border-2 border-amber-900/10 bg-white/85 p-2 shadow-inner">
        <Badge tone="purple">
          {formatWordChoicePromptType(question.promptType)}
        </Badge>
        {question.promptType === "thai-to-english" ? (
          <div className="mt-1">
            <p className="text-3xl font-black leading-tight text-amber-950">
              {question.card.meaningTh}
            </p>
          </div>
        ) : question.promptType === "sentence-cloze" ? (
          <div className="mt-1">
            <p className="text-2xl font-black leading-tight text-amber-950">
              {blankTargetWord(
                question.card.exampleSentence,
                question.card.word,
              )}
            </p>
          </div>
        ) : (
          <div className="mt-1">
            <p className="text-4xl font-black capitalize leading-tight text-amber-950">
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
                  ? "border-emerald-500 bg-emerald-50 shadow-[0_5px_0_rgba(6,95,70,0.18)]"
                  : showWrong
                    ? "border-red-400 bg-red-50 shadow-[0_5px_0_rgba(127,29,29,0.16)]"
                    : "border-amber-900/10 bg-white hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
              } ${isAnswered ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-slate-950">
                    {showsEnglishChoices ? choice.word : choice.meaningTh}
                  </p>
                  <p className="truncate text-xs capitalize text-slate-500">
                    {showsEnglishChoices ? choice.partOfSpeech : choice.word}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <CardStatChips card={choice} wordMastery={wordMastery} />
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
  battleLog: BattleLog;
  isAnswered: boolean;
  onNext?: () => void;
  question: WordMatchQuestion;
  selectedMeaningId: string | null;
  selectedWordId: string | null;
  onSelectMeaning: (cardId: string) => void;
  onSelectWord: (cardId: string) => void;
  onSubmit: () => void;
  wordMastery: WordMasteryByCardId;
};

function WordMatchBattle({
  battleLog,
  isAnswered,
  question,
  selectedMeaningId,
  selectedWordId,
  onSelectMeaning,
  onSelectWord,
  onSubmit,
  onNext,
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
        battleLog={battleLog}
        correctAnswer={correctAnswer}
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        isTimeout={selectedWordId === null && selectedMeaningId === null}
        onNext={onNext}
      />
      <div className="grid min-h-0 flex-1 gap-2 md:grid-cols-2">
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
                  className={`min-h-20 rounded-xl border-2 px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    showCorrect
                      ? "border-emerald-500 bg-emerald-50 shadow-[0_5px_0_rgba(6,95,70,0.18)]"
                      : showWrong
                        ? "border-red-400 bg-red-50 shadow-[0_5px_0_rgba(127,29,29,0.16)]"
                        : isSelected
                          ? "border-emerald-500 bg-white shadow-md"
                          : "border-amber-900/10 bg-white hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold capitalize text-slate-950">
                        {card.word}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <CardStatChips card={card} wordMastery={wordMastery} />
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
                  className={`min-h-20 rounded-xl border-2 px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    showCorrect
                      ? "border-emerald-500 bg-emerald-50 shadow-[0_5px_0_rgba(6,95,70,0.18)]"
                      : showWrong
                        ? "border-red-400 bg-red-50 shadow-[0_5px_0_rgba(127,29,29,0.16)]"
                        : isSelected
                          ? "border-emerald-500 bg-white shadow-md"
                          : "border-amber-900/10 bg-white hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
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

      <div className="mt-2 flex shrink-0 flex-col gap-2 rounded-xl border-2 border-amber-900/10 bg-amber-50/85 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="truncate text-sm font-black text-amber-950">
          {selectedPairText}
        </p>
        <Button
          type="button"
          disabled={isAnswered || !selectedWordId || !selectedMeaningId}
          onClick={onSubmit}
          className="shrink-0"
        >
          Check Pair
        </Button>
      </div>
    </div>
  );
}

type WordScrambleBattleProps = {
  answer: string;
  battleLog: BattleLog;
  isAnswered: boolean;
  onNext?: () => void;
  question: WordScrambleQuestion;
  selectedCardId: string | null;
  onAnswerChange: (answer: string) => void;
  onSelectCard: (cardId: string) => void;
  onSubmit: () => void;
  wordMastery: WordMasteryByCardId;
};

function WordScrambleBattle({
  answer,
  battleLog,
  isAnswered,
  question,
  selectedCardId,
  onAnswerChange,
  onSelectCard,
  onSubmit,
  onNext,
  wordMastery,
}: WordScrambleBattleProps) {
  const selectedOption = question.options.find(
    (option) => option.card.id === selectedCardId,
  );
  const isCorrect =
    isAnswered &&
    selectedOption !== undefined &&
    answer.trim().toLowerCase() === selectedOption.card.word.toLowerCase();
  const isWrong = isAnswered && selectedOption !== undefined && !isCorrect;

  return (
    <div className="relative h-full">
      <BattleResultOverlay
        battleLog={battleLog}
        correctAnswer={
          selectedOption
            ? `${selectedOption.card.word} = ${selectedOption.card.meaningTh}`
            : "Choose a scrambled word first"
        }
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        isTimeout={isAnswered && selectedOption === undefined}
        onNext={onNext}
      />
      <div className="grid gap-2 sm:grid-cols-3">
        {question.options.map((option) => {
          const isSelected = selectedCardId === option.card.id;
          const showCorrect = isCorrect && isSelected;
          const showWrong = isWrong && isSelected;

          return (
            <button
              key={option.card.id}
              type="button"
              disabled={isAnswered}
              onClick={() => onSelectCard(option.card.id)}
              className={`rounded-xl border-2 px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                showCorrect
                  ? "border-emerald-500 bg-emerald-50 shadow-[0_5px_0_rgba(6,95,70,0.18)]"
                  : showWrong
                    ? "border-red-400 bg-red-50 shadow-[0_5px_0_rgba(127,29,29,0.16)]"
                    : isSelected
                      ? "border-emerald-500 bg-white shadow-md"
                      : "border-amber-900/10 bg-white hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-mono text-xl font-bold tracking-wide text-slate-950">
                    {option.scrambledWord}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <CardStatChips card={option.card} wordMastery={wordMastery} />
                  {!isAnswered && isSelected && (
                    <Badge tone="sky">Selected</Badge>
                  )}
                  {showCorrect && <Badge tone="emerald">Solved</Badge>}
                  {showWrong && <Badge tone="red">Wrong</Badge>}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-2 rounded-2xl border-2 border-amber-900/10 bg-white p-2 shadow-inner">
        <div className="flex flex-col gap-2 md:flex-row md:items-end">
          <div className="flex-1">
            <label
              htmlFor="word-scramble-answer"
              className="text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Typed answer
            </label>
            <input
              id="word-scramble-answer"
              type="text"
              value={answer}
              disabled={isAnswered || selectedOption === undefined}
              onChange={(event) => onAnswerChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onSubmit();
                }
              }}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base font-semibold text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 disabled:text-slate-500"
              placeholder={
                selectedOption
                  ? "Type the original word"
                  : "Choose a scrambled word first"
              }
            />
          </div>
          <Button
            type="button"
            disabled={isAnswered || selectedOption === undefined || answer.trim() === ""}
            onClick={onSubmit}
          >
            Check Word
          </Button>
        </div>
      </div>
    </div>
  );
}
