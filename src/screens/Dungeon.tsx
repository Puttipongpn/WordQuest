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
import type {
  Monster,
  RunProgressState,
  RunStatistics,
  ScreenName,
  VocabularyDeck,
  WordCard,
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
};

type CompletionReward = {
  completedMessage: string;
  unlockMessage: string;
};

type BattleMiniGameType = "word-choice" | "word-match" | "word-scramble";
type EncounterType = "monster" | "elite" | "event";
type DungeonEventId = "treasure-chest" | "healing-shrine" | "strange-altar";
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
  const [battleLog, setBattleLog] = useState<BattleLog>({
    tone: "neutral",
    message: "Choose a correct answer to trigger a word card.",
  });
  const [battleStatus, setBattleStatus] = useState<
    "fighting" | "event" | "monster-defeated" | "run-failed" | "run-complete"
  >("fighting");

  const currentMonster = getMonsterForIndex(monsterIndex);
  const eliteMonster = createEliteMonster(currentMonster);
  const currentEncounter = isBossEncounter
    ? sampleBoss
    : encounterType === "elite"
      ? eliteMonster
      : currentMonster;
  const currentEvent = chooseDungeonEvent(eventIndex);
  const isEventEncounter = battleStatus === "event";
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
  const isTimerRunning = battleStatus === "fighting" && !isAnswered;
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

  function triggerCard(card: WordCard) {
    const cardShieldGained = getCardShieldAmount(card);
    const element = getCardElement(card);
    const elementBonusDamage =
      element?.element === "fire" ? FIRE_BONUS_DAMAGE : 0;
    const waterShieldGained =
      element?.element === "water" ? WATER_SHIELD_GAIN : 0;
    const totalShieldGained = cardShieldGained + waterShieldGained;
    const totalDamageDealt = card.baseAttack + elementBonusDamage;
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
          message: `${card.word} triggered for ${totalDamageDealt} total damage. ${elementFeedback ? `${elementFeedback} ` : ""}${totalShieldGained > 0 ? `Gained ${totalShieldGained} shield. ` : ""}${windGoldGained > 0 ? `Gained ${windGoldGained} extra gold. ` : ""}${sampleBoss.name} defeated. ${completionReward.completedMessage} ${completionReward.unlockMessage} Permanent progress saved.`,
          triggeredCard: card,
          baseDamageDealt: card.baseAttack,
          elementBonusDamage,
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
        message: `${card.word} triggered for ${totalDamageDealt} total damage. ${elementFeedback ? `${elementFeedback} ` : ""}${totalShieldGained > 0 ? `Gained ${totalShieldGained} shield. ` : ""}${windGoldGained > 0 ? `Gained ${windGoldGained} extra gold. ` : ""}${currentEncounter.name} defeated.${encounterType === "elite" ? ` Elite bonus: +${ELITE_GOLD_BONUS} gold.` : ""}`,
        triggeredCard: card,
        baseDamageDealt: card.baseAttack,
        elementBonusDamage,
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
      message: `${card.word} triggered for ${totalDamageDealt} total damage. ${elementFeedback ? `${elementFeedback} ` : ""}${totalShieldGained > 0 ? `Gained ${totalShieldGained} shield.` : ""}`,
      triggeredCard: card,
      baseDamageDealt: card.baseAttack,
      elementBonusDamage,
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
    if (timeRemaining > 0 || isAnswered || battleStatus !== "fighting") {
      return;
    }

    setIsAnswered(true);
    monsterAttack("Time's up!", true);
  }, [battleStatus, isAnswered, timeRemaining]);

  function handleWordChoiceAnswer(choice: WordCard) {
    if (isAnswered || battleStatus !== "fighting") {
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
    setBattleStatus(isNextEvent ? "event" : "fighting");
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
        : `${nextEncounterType === "elite" ? "An elite monster" : "A new monster"} appears. A new mini-game begins.`,
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
    setBattleStatus(isNextEvent ? "event" : "fighting");
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
            ? "An elite encounter begins."
            : "A monster encounter begins."
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
    setBattleStatus("fighting");
    resetAnswerState();
    setQuestionSeed((current) => current + 1);
    setMiniGameType(nextMiniGameType);
    setTimeRemaining(getMiniGameTimeLimit(nextMiniGameType));
    setBattleLog({
      tone: "neutral",
      message: `${sampleBoss.name} appears. Defeat the boss to complete the run.`,
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
    setBattleStatus("fighting");
    resetAnswerState();
    setQuestionSeed((current) => current + 1);
    setMiniGameType(nextMiniGameType);
    setTimeRemaining(getMiniGameTimeLimit(nextMiniGameType));
    setBattleLog({
      tone: "neutral",
      message: "Run restarted. Choose the correct answer to trigger a card.",
    });
  }

  return (
    <ScreenShell
      eyebrow="Battle"
      title="Dungeon"
      description="Answer timed vocabulary mini-games to trigger cards. Run state here is local and temporary."
      framed={false}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
        <CardPanel className="overflow-hidden border-red-900/30 bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 text-amber-50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            <Button
              type="button"
              onClick={() => onNavigate("run-result")}
              variant="secondary"
            >
              End Run
            </Button>
          </div>

          <section
            className={`relative mt-5 overflow-hidden rounded-3xl border-2 p-5 shadow-[inset_0_0_55px_rgba(0,0,0,0.28)] ${encounterStageClass}`}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/10 to-transparent" />
            <div className="relative mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-200/80">
                Encounter Stage
              </p>
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
            </div>
            {isEventEncounter ? (
              <div className="relative grid gap-5 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
                <div
                  className={`grid size-32 place-items-center rounded-3xl border-4 text-7xl ${encounterPortraitClass}`}
                >
                  {currentEvent.icon}
                </div>
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-violet-200">
                    Non-Combat Choice
                  </p>
                  <h3 className="mt-1 text-4xl font-black text-amber-50">
                    {currentEvent.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-amber-100">
                    {currentEvent.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge tone="purple">No Combat</Badge>
                    <Badge tone="amber">Does Not Count For Boss</Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative grid gap-5 md:grid-cols-[minmax(0,180px)_minmax(0,1fr)_minmax(0,240px)] md:items-center">
                <div className="rounded-3xl border border-amber-100/10 bg-black/15 p-3 text-center">
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-amber-200/75">
                    Enemy
                  </p>
                  <div
                    className={`mx-auto grid size-32 place-items-center rounded-3xl border-4 text-7xl ${encounterPortraitClass}`}
                  >
                    {currentEncounter.imagePlaceholder}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-amber-300">
                    {isBossEncounter
                      ? "Boss Encounter"
                      : encounterType === "elite"
                        ? "Elite Encounter"
                        : "Monster Encounter"}
                  </p>
                  <h3 className="mt-1 text-5xl font-black leading-none text-amber-50 drop-shadow">
                    {currentEncounter.name}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-amber-100/85">
                    Win vocabulary mini-games to trigger cards. A wrong answer
                    or timeout lets this encounter strike back.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge tone="red">{encounterLabel} Attack {currentEncounter.attack}</Badge>
                    {isBossEncounter && <Badge tone="purple">Major Fight</Badge>}
                    {encounterType === "elite" && (
                      <Badge tone="amber">Elite Bonus +{ELITE_GOLD_BONUS} gold</Badge>
                    )}
                    {!isBossEncounter && (
                      <Badge tone="amber">
                        Boss after {BOSS_MONSTER_REQUIREMENT}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="rounded-2xl border-2 border-amber-200/20 bg-black/25 p-4">
                  <div className="flex items-center justify-between gap-3 text-sm font-black text-amber-100">
                    <span>Enemy HP</span>
                    <span>{monsterHp} / {currentEncounter.maxHp}</span>
                  </div>
                  <div className="mt-3">
                    <ProgressBar
                      value={monsterHp}
                      max={currentEncounter.maxHp}
                      label={`${currentEncounter.name} HP`}
                      tone={isBossEncounter || encounterType === "elite" ? "red" : "emerald"}
                    />
                  </div>
                  <div className="mt-4 rounded-xl border border-red-200/20 bg-red-950/30 p-3">
                    <p className="text-xs font-black uppercase text-red-100/70">
                      Threat
                    </p>
                    <p className="mt-1 text-3xl font-black text-red-100">
                      {currentEncounter.attack}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="mt-6 rounded-3xl border-2 border-amber-300/30 bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50 p-5 text-amber-950 shadow-[0_10px_0_rgba(120,53,15,0.22)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge tone={isEventEncounter ? "purple" : "emerald"}>
                  {isEventEncounter ? "Event Choice" : formatMiniGameName(miniGameType)}
                </Badge>
                <h3 className="mt-2 text-4xl font-black leading-tight text-amber-950">
                  {isEventEncounter
                    ? "Choose one event option"
                    : "Answer to trigger your card"}
                </h3>
                <p className="mt-1 text-sm font-semibold text-amber-900/70">
                  {isEventEncounter
                    ? "Events are not battles. Their rewards stay temporary for the current run."
                    : "Dungeon questions are timed; Training stays untimed for safe practice."}
                </p>
              </div>
              {!isEventEncounter && (
                <div
                  className={`min-w-48 rounded-2xl border-2 p-4 shadow-inner ${
                    timeRemaining === 0
                      ? "border-red-400 bg-red-100"
                      : isTimerLow && isTimerRunning
                        ? "border-red-400 bg-red-50 motion-safe:animate-pulse"
                        : "border-amber-900/15 bg-white/85"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-extrabold uppercase text-amber-800/70">
                      Battle Timer
                    </p>
                    <Badge tone={isTimerLow && isTimerRunning ? "red" : "amber"}>
                      {timerStateLabel}
                    </Badge>
                  </div>
                  <p className="mt-1 text-4xl font-black text-amber-950">
                    {timeRemaining}s
                    <span className="ml-1 text-base text-amber-900/60">
                      / {miniGameTimeLimit}s
                    </span>
                  </p>
                  <div className="mt-2">
                    <ProgressBar
                      value={timeRemaining}
                      max={miniGameTimeLimit}
                      tone={isTimerLow && isTimerRunning ? "red" : "amber"}
                      label="Battle timer"
                    />
                  </div>
                </div>
              )}
            </div>

            {isEventEncounter ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
              />
            )}
          </section>

          <section className="mt-6 rounded-3xl border-2 border-amber-200/20 bg-black/20 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-200/80">
                Player Side
              </p>
              <Badge tone="sky">Current Run</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
              label="Player HP"
              value={`${playerHp} / ${PLAYER_MAX_HP}`}
              tone="red"
            >
              <ProgressBar
                value={playerHp}
                max={PLAYER_MAX_HP}
                tone="red"
                label="Player HP"
              />
            </StatCard>
            <StatCard label="Shield" value={shield} tone="sky" />
            <StatCard label="Gold" value={runGold} tone="amber" />
            <StatCard
              label="Run"
              value={`${runProgress.monstersDefeated} / ${runProgress.nextShopAt}`}
              helper={`Floor ${runProgress.currentFloor}`}
              tone={isShopAvailable ? "amber" : "slate"}
            />
            <StatCard
              label="Boss"
              value={
                hasCompletedBoss
                  ? "Done"
                  : isBossEncounter
                    ? "Active"
                    : isBossAvailable
                      ? "Ready"
                      : `${runProgress.monstersDefeated} / ${BOSS_MONSTER_REQUIREMENT}`
              }
              tone={
                hasCompletedBoss
                  ? "emerald"
                  : isBossAvailable || isBossEncounter
                    ? "red"
                  : "slate"
              }
            />
            </div>
          </section>

          {(isBossAvailable || isShopAvailable) && (
            <section className="mt-4 rounded-xl border-2 border-amber-300/20 bg-amber-100/10 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Badge
                    tone={isBossAvailable ? "red" : "amber"}
                  >
                    {isBossAvailable ? "Boss Available" : "Shop Available"}
                  </Badge>
                  <p className="mt-2 text-sm font-bold text-amber-50">
                    {isBossAvailable
                      ? `${sampleBoss.name} is ready. You can start the boss battle now or visit the shop first if a checkpoint is available.`
                      : `Shop checkpoint reached after ${runProgress.monstersDefeated} monsters.`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
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
        </CardPanel>

        <aside className="space-y-4 lg:self-start">
          <section
            className={`rounded-2xl border-2 p-4 shadow-[0_8px_0_rgba(120,53,15,0.14)] ${battleFeedbackClass}`}
          >
            <div className="flex flex-wrap items-center gap-2">
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
            </div>
            <p className="mt-2 text-sm font-medium text-amber-950/80">
              {battleLog.message}
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {(battleLog.damageDealt ?? 0) > 0 && (
                <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-950 px-4 py-3 text-emerald-50 shadow-[0_5px_0_rgba(6,78,59,0.4)]">
                  <p className="text-xs font-black uppercase text-emerald-200/80">
                    Damage Burst
                  </p>
                  <p className="mt-1 text-4xl font-black">
                    -{battleLog.damageDealt}
                  </p>
                </div>
              )}
              {(battleLog.damageTaken ?? 0) > 0 && (
                <div className="rounded-2xl border-2 border-red-400 bg-red-950 px-4 py-3 text-red-50 shadow-[0_5px_0_rgba(127,29,29,0.42)]">
                  <p className="text-xs font-black uppercase text-red-200/80">
                    Incoming Hit
                  </p>
                  <p className="mt-1 text-4xl font-black">
                    -{battleLog.damageTaken}
                  </p>
                </div>
              )}
              {(battleLog.shieldGained ?? 0) > 0 && (
                <div className="rounded-2xl border-2 border-sky-300 bg-sky-950 px-4 py-3 text-sky-50 shadow-[0_5px_0_rgba(12,74,110,0.35)]">
                  <p className="text-xs font-black uppercase text-sky-200/80">
                    Ward Raised
                  </p>
                  <p className="mt-1 text-4xl font-black">
                    +{battleLog.shieldGained}
                  </p>
                </div>
              )}
              {(battleLog.shieldAbsorbed ?? 0) > 0 && (
                <div className="rounded-2xl border-2 border-sky-300 bg-white px-4 py-3 text-sky-950 shadow-[0_5px_0_rgba(12,74,110,0.16)]">
                  <p className="text-xs font-black uppercase text-sky-900/70">
                    Shield Blocked
                  </p>
                  <p className="mt-1 text-4xl font-black">
                    {battleLog.shieldAbsorbed}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <StatCard label="Base DMG" value={battleLog.baseDamageDealt ?? 0} tone="emerald" />
              <StatCard label="Element DMG" value={battleLog.elementBonusDamage ?? 0} tone="purple" />
              <StatCard label="Total DMG" value={battleLog.damageDealt ?? 0} tone="emerald" />
              <StatCard label="Taken" value={battleLog.damageTaken ?? 0} tone="red" />
              <StatCard label="Shield Block" value={battleLog.shieldAbsorbed ?? 0} tone="sky" />
              <StatCard label="HP Damage" value={battleLog.hpDamageTaken ?? 0} tone="red" />
              <StatCard label="Card Shield" value={battleLog.cardShieldGained ?? 0} tone="sky" />
              <StatCard label="Water Shield" value={battleLog.waterShieldGained ?? 0} tone="sky" />
              <StatCard label="Earth Reduce" value={battleLog.earthAttackReduction ?? 0} tone="amber" />
              <StatCard label="Wind Gold" value={battleLog.windGoldGained ?? 0} tone="amber" />
            </div>

            {isAnswered && battleStatus === "fighting" && (
              <Button type="button" onClick={advanceQuestion} className="mt-4 w-full">
                Next Mini-Game
              </Button>
            )}
            {battleStatus === "monster-defeated" && (
              <div className="mt-4 grid gap-2">
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
                className="mt-4 w-full bg-red-600 hover:bg-red-700"
              >
                Restart Run
              </Button>
            )}
          </section>

          <section className="rounded-2xl border-2 border-amber-800/30 bg-gradient-to-br from-amber-50 to-orange-100 p-5 shadow-[0_10px_0_rgba(120,53,15,0.16)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge tone="purple">Card Trigger</Badge>
              <Badge tone={battleLog.triggeredCard ? "emerald" : "slate"}>
                {battleLog.triggeredCard ? "Active" : "Preview"}
              </Badge>
            </div>
            <div className="mt-4 flex items-start gap-4">
              <span className="grid size-20 place-items-center rounded-2xl border-2 border-amber-900/15 bg-amber-100 text-5xl shadow-inner">
                {sidePanelCard.imagePlaceholder}
              </span>
              <div>
                <p className="text-2xl font-black capitalize text-amber-950">
                  {sidePanelCard.word}
                </p>
                <p className="mt-1 text-sm font-bold text-amber-900/75">
                  Current card attack {sidePanelCard.baseAttack}
                </p>
                <p className="mt-1 text-sm font-bold text-amber-900/75">
                  Shield effect +{sidePanelCardShield}
                </p>
                <p className="mt-1 text-sm font-bold text-amber-900/75">
                  Element{" "}
                  {sidePanelCardElement
                    ? formatElementName(sidePanelCardElement.element)
                    : "None"}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                <p className="text-xs font-black uppercase text-red-800/70">
                  Attack
                </p>
                <p className="mt-1 text-2xl font-black text-red-950">
                  {sidePanelCard.baseAttack}
                </p>
              </div>
              <div className="rounded-xl border border-sky-200 bg-sky-50 p-3">
                <p className="text-xs font-black uppercase text-sky-800/70">
                  Shield
                </p>
                <p className="mt-1 text-2xl font-black text-sky-950">
                  +{sidePanelCardShield}
                </p>
              </div>
              <div className="rounded-xl border border-violet-200 bg-violet-50 p-3">
                <p className="text-xs font-black uppercase text-violet-800/70">
                  Element
                </p>
                <p className="mt-1 text-lg font-black text-violet-950">
                  {sidePanelCardElement
                    ? formatElementName(sidePanelCardElement.element)
                    : "None"}
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-amber-900/15 bg-white/70 p-3">
              <p className="text-xs font-extrabold uppercase text-amber-800/70">
                Final trigger result
              </p>
              <p className="mt-1 font-black text-amber-950">
                {battleLog.effectsSummary ?? "None yet"}
              </p>
              {(battleLog.damageDealt ?? 0) > 0 && (
                <p className="mt-2 text-sm font-black text-emerald-800">
                  Final damage: {battleLog.damageDealt}
                  {(battleLog.elementBonusDamage ?? 0) > 0
                    ? ` including +${battleLog.elementBonusDamage} element damage`
                    : ""}
                </p>
              )}
            </div>
          </section>

          {battleStatus === "run-complete" && (
            <section className="rounded-xl border-2 border-emerald-300 bg-emerald-100 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="emerald">Run Complete</Badge>
                <p className="font-black text-emerald-950">
                  {battleLog.rewardSummary ?? `${selectedDeck.name} completed.`}
                </p>
              </div>
              <p className="mt-2 text-sm font-medium text-emerald-950/75">
                Permanent progress saved. Temporary run upgrades, gold, HP,
                shield, monster state, boss state, and run deck changes were not
                saved.
              </p>
              <div className="mt-4 grid gap-2">
                <StatCard label="Deck" value={selectedDeck.name} tone="emerald" />
                <StatCard label="Monsters" value={summaryStatistics.monstersDefeated} tone="emerald" />
                <StatCard label="Elites" value={summaryStatistics.eliteDefeated} tone="red" />
                <StatCard label="Events" value={summaryStatistics.eventsVisited} tone="purple" />
                <StatCard label="Boss" value={summaryStatistics.bossDefeated ? "Defeated" : "No"} tone="purple" />
                <StatCard label="Final Gold" value={summaryGold} tone="amber" />
                <StatCard label="Run Deck" value={currentRunDeck.length} tone="slate" />
                <StatCard label="Correct" value={summaryStatistics.correctAnswers} tone="emerald" />
                <StatCard label="Wrong" value={summaryStatistics.wrongAnswers} tone="red" />
                <StatCard label="Timeouts" value={summaryStatistics.timeouts} tone="amber" />
                <StatCard label="Accuracy" value={`${summaryAccuracy}%`} tone="sky" />
                <StatCard label="Damage" value={summaryStatistics.totalDamageDealt} tone="red" />
                <StatCard label="Shield Gained" value={summaryStatistics.totalShieldGained} tone="sky" />
                <StatCard
                  label="Deck Reward"
                  value="Completed"
                  helper={isSelectedDeckCompleted ? "Already saved" : "Saved after boss defeat"}
                  tone="emerald"
                />
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
                Best run summary was saved. Active HP, shield, gold, monster
                state, timer state, shop upgrades, and run deck changes were not
                saved.
              </p>
              <div className="mt-4 grid gap-2">
                <StatCard label="Deck" value={selectedDeck.name} tone="red" />
                <StatCard label="Monsters" value={summaryStatistics.monstersDefeated} tone="emerald" />
                <StatCard label="Elites" value={summaryStatistics.eliteDefeated} tone="red" />
                <StatCard label="Events" value={summaryStatistics.eventsVisited} tone="purple" />
                <StatCard label="Floor" value={runProgress.currentFloor} tone="slate" />
                <StatCard label="Final Gold" value={summaryGold} tone="amber" />
                <StatCard label="Correct" value={summaryStatistics.correctAnswers} tone="emerald" />
                <StatCard label="Wrong" value={summaryStatistics.wrongAnswers} tone="red" />
                <StatCard label="Timeouts" value={summaryStatistics.timeouts} tone="amber" />
                <StatCard label="Accuracy" value={`${summaryAccuracy}%`} tone="sky" />
                <StatCard label="Damage" value={summaryStatistics.totalDamageDealt} tone="red" />
                <StatCard label="Shield Gained" value={summaryStatistics.totalShieldGained} tone="sky" />
              </div>
            </section>
          )}

          <details className="rounded-xl border-2 border-amber-800/20 bg-amber-50/90 p-4">
            <summary className="cursor-pointer font-black text-amber-950">
              Trigger Rule
            </summary>
            <p className="mt-2 text-sm font-medium leading-6 text-amber-950/75">
              Correct answers trigger the selected word card and deal damage
              equal to base attack. Shield effects add player shield when the
              card triggers. Element effects add first-pass bonuses: Fire deals
              bonus damage, Water grants shield, Wind grants extra gold on
              defeat, and Earth reduces the next attack. Incorrect answers do
              not trigger card effects and cause monster attack damage, with
              shield absorbing damage before HP.
            </p>
          </details>
        </aside>
      </div>
    </ScreenShell>
  );
}

type WordChoiceBattleProps = {
  isAnswered: boolean;
  question: WordChoiceQuestion;
  selectedChoiceId: string | null;
  onAnswer: (choice: WordCard) => void;
};

function WordChoiceBattle({
  isAnswered,
  question,
  selectedChoiceId,
  onAnswer,
}: WordChoiceBattleProps) {
  const showsEnglishChoices =
    question.promptType === "thai-to-english" ||
    question.promptType === "sentence-cloze";

  return (
    <div className="mt-5">
      <div className="rounded-2xl border-2 border-amber-900/10 bg-white/85 p-5 shadow-inner">
        <Badge tone="purple">
          {formatWordChoicePromptType(question.promptType)}
        </Badge>
        {question.promptType === "thai-to-english" ? (
          <div className="mt-4">
            <p className="text-4xl font-black text-amber-950">
              {question.card.meaningTh}
            </p>
            <p className="mt-2 text-sm font-semibold text-amber-900/65">
              Choose the English word to trigger this card.
            </p>
          </div>
        ) : question.promptType === "sentence-cloze" ? (
          <div className="mt-4">
            <p className="text-3xl font-black leading-tight text-amber-950">
              {blankTargetWord(
                question.card.exampleSentence,
                question.card.word,
              )}
            </p>
            <p className="mt-2 text-sm font-semibold text-amber-900/65">
              Complete the sentence to trigger the hidden word card.
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-5xl font-black capitalize text-amber-950">
              {question.card.word}
            </p>
            <p className="mt-2 text-sm font-semibold text-amber-900/65">
              Choose the correct Thai meaning to trigger this card.
            </p>
          </div>
        )}
      </div>

      {isAnswered && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm font-semibold text-amber-950">
            Correct answer:{" "}
            <span className="capitalize">
              {showsEnglishChoices ? question.card.word : question.card.meaningTh}
            </span>
          </p>
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
              className={`min-h-20 rounded-2xl border-2 p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                showCorrect
                  ? "border-emerald-500 bg-emerald-50 shadow-[0_5px_0_rgba(6,95,70,0.18)]"
                  : showWrong
                    ? "border-red-400 bg-red-50 shadow-[0_5px_0_rgba(127,29,29,0.16)]"
                    : "border-amber-900/10 bg-white hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
              } ${isAnswered ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-950">
                    {showsEnglishChoices ? choice.word : choice.meaningTh}
                  </p>
                  <p className="mt-1 text-sm capitalize text-slate-500">
                    {showsEnglishChoices ? choice.partOfSpeech : choice.word}
                  </p>
                </div>
                {showCorrect && <Badge tone="emerald">Correct</Badge>}
                {showWrong && <Badge tone="red">Wrong</Badge>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

type WordMatchBattleProps = {
  isAnswered: boolean;
  question: WordMatchQuestion;
  selectedMeaningId: string | null;
  selectedWordId: string | null;
  onSelectMeaning: (cardId: string) => void;
  onSelectWord: (cardId: string) => void;
  onSubmit: () => void;
};

function WordMatchBattle({
  isAnswered,
  question,
  selectedMeaningId,
  selectedWordId,
  onSelectMeaning,
  onSelectWord,
  onSubmit,
}: WordMatchBattleProps) {
  return (
    <div className="mt-5">
      <div className="rounded-2xl border-2 border-amber-900/10 bg-white/85 p-5 shadow-inner">
        <p className="font-black text-amber-950">
          Match one English word with its Thai meaning.
        </p>
        <p className="mt-1 text-sm font-semibold text-amber-900/65">
          A correct pair triggers the selected English word card.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-amber-800/70">
            English words
          </p>
          <div className="mt-2 grid gap-3">
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
                  className={`rounded-2xl border-2 p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    showCorrect
                      ? "border-emerald-500 bg-emerald-50 shadow-[0_5px_0_rgba(6,95,70,0.18)]"
                      : showWrong
                        ? "border-red-400 bg-red-50 shadow-[0_5px_0_rgba(127,29,29,0.16)]"
                        : isSelected
                          ? "border-emerald-500 bg-white shadow-md"
                          : "border-amber-900/10 bg-white hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold capitalize text-slate-950">
                        {card.word}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Base attack {card.baseAttack}
                      </p>
                    </div>
                    {!isAnswered && isSelected && (
                      <Badge tone="sky">Selected</Badge>
                    )}
                    {showCorrect && <Badge tone="emerald">Match</Badge>}
                    {showWrong && <Badge tone="red">Wrong</Badge>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-wide text-amber-800/70">
            Thai meanings
          </p>
          <div className="mt-2 grid gap-3">
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
                  className={`rounded-2xl border-2 p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    showCorrect
                      ? "border-emerald-500 bg-emerald-50 shadow-[0_5px_0_rgba(6,95,70,0.18)]"
                      : showWrong
                        ? "border-red-400 bg-red-50 shadow-[0_5px_0_rgba(127,29,29,0.16)]"
                        : isSelected
                          ? "border-emerald-500 bg-white shadow-md"
                          : "border-amber-900/10 bg-white hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">
                        {card.meaningTh}
                      </p>
                      <p className="mt-1 text-sm capitalize text-slate-500">
                        {card.partOfSpeech}
                      </p>
                    </div>
                    {!isAnswered && isSelected && (
                      <Badge tone="sky">Selected</Badge>
                    )}
                    {showCorrect && <Badge tone="emerald">Match</Badge>}
                    {showWrong && <Badge tone="red">Wrong</Badge>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Button
        type="button"
        disabled={isAnswered || !selectedWordId || !selectedMeaningId}
        onClick={onSubmit}
        className="mt-5"
      >
        Check Pair
      </Button>
    </div>
  );
}

type WordScrambleBattleProps = {
  answer: string;
  isAnswered: boolean;
  question: WordScrambleQuestion;
  selectedCardId: string | null;
  onAnswerChange: (answer: string) => void;
  onSelectCard: (cardId: string) => void;
  onSubmit: () => void;
};

function WordScrambleBattle({
  answer,
  isAnswered,
  question,
  selectedCardId,
  onAnswerChange,
  onSelectCard,
  onSubmit,
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
    <div className="mt-5">
      <div className="rounded-2xl border-2 border-amber-900/10 bg-white/85 p-5 shadow-inner">
        <p className="font-black text-amber-950">
          Choose one scrambled word, then type the original English word.
        </p>
        <p className="mt-1 text-sm font-semibold text-amber-900/65">
          A correct typed answer triggers the selected current-run card.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
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
              className={`rounded-2xl border-2 p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                showCorrect
                  ? "border-emerald-500 bg-emerald-50 shadow-[0_5px_0_rgba(6,95,70,0.18)]"
                  : showWrong
                    ? "border-red-400 bg-red-50 shadow-[0_5px_0_rgba(127,29,29,0.16)]"
                    : isSelected
                      ? "border-emerald-500 bg-white shadow-md"
                      : "border-amber-900/10 bg-white hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-2xl font-bold tracking-wide text-slate-950">
                    {option.scrambledWord}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Attack {option.card.baseAttack}
                    {getCardShieldAmount(option.card) > 0
                      ? ` / Shield +${getCardShieldAmount(option.card)}`
                      : ""}
                  </p>
                </div>
                {!isAnswered && isSelected && <Badge tone="sky">Selected</Badge>}
                {showCorrect && <Badge tone="emerald">Solved</Badge>}
                {showWrong && <Badge tone="red">Wrong</Badge>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border-2 border-amber-900/10 bg-white p-4 shadow-inner">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label
              htmlFor="word-scramble-answer"
              className="text-sm font-semibold uppercase tracking-wide text-slate-500"
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
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-lg font-semibold text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 disabled:text-slate-500"
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

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Selected scrambled card
            </p>
            <p className="mt-1 font-mono text-lg font-bold text-slate-950">
              {selectedOption?.scrambledWord ?? "None"}
            </p>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Typed answer
            </p>
            <p className="mt-1 font-semibold text-slate-950">
              {answer.trim() || "None"}
            </p>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Correct word
            </p>
            <p className="mt-1 font-semibold capitalize text-slate-950">
              {isAnswered ? selectedOption?.card.word : "Hidden"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
