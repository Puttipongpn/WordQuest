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
  BOSS_MONSTER_REQUIREMENT,
  EARTH_ATTACK_REDUCTION,
  FIRE_BONUS_DAMAGE,
  INITIAL_SHIELD,
  PLAYER_MAX_HP,
  WATER_SHIELD_GAIN,
  WIND_DEFEAT_GOLD_BONUS,
  WORD_CHOICE_TIME_LIMIT,
  WORD_MATCH_TIME_LIMIT,
  WORD_SCRAMBLE_TIME_LIMIT,
} from "../game/balance";
import type {
  Monster,
  RunProgressState,
  ScreenName,
  VocabularyDeck,
  WordCard,
} from "../types";

type DungeonProps = {
  currentRunDeck: WordCard[];
  isSelectedDeckCompleted: boolean;
  onCompleteSelectedDeck: () => CompletionReward;
  onGainRunGold: (amount: number) => void;
  onMonsterDefeated: () => void;
  onNavigate: (screen: ScreenName) => void;
  onResetRun: () => void;
  runGold: number;
  runProgress: RunProgressState;
  selectedDeck: VocabularyDeck;
};

type CompletionReward = {
  completedMessage: string;
  unlockMessage: string;
};

type BattleMiniGameType = "word-choice" | "word-match" | "word-scramble";
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

function chooseBattleMiniGame(): BattleMiniGameType {
  const randomIndex = Math.floor(Math.random() * battleMiniGames.length);

  return battleMiniGames[randomIndex];
}

function getMonsterForIndex(index: number): Monster {
  return sampleMonsters[index % sampleMonsters.length];
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

export function Dungeon({
  currentRunDeck,
  isSelectedDeckCompleted,
  onCompleteSelectedDeck,
  onGainRunGold,
  onMonsterDefeated,
  onNavigate,
  onResetRun,
  runGold,
  runProgress,
  selectedDeck,
}: DungeonProps) {
  const initialMiniGameType = useMemo(() => chooseBattleMiniGame(), []);
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [shield, setShield] = useState(INITIAL_SHIELD);
  const [monsterIndex, setMonsterIndex] = useState(0);
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
  const [battleLog, setBattleLog] = useState<BattleLog>({
    tone: "neutral",
    message: "Choose a correct answer to trigger a word card.",
  });
  const [battleStatus, setBattleStatus] = useState<
    "fighting" | "monster-defeated" | "run-failed" | "run-complete"
  >("fighting");

  const currentMonster = getMonsterForIndex(monsterIndex);
  const currentEncounter = isBossEncounter ? sampleBoss : currentMonster;
  const encounterLabel = isBossEncounter ? "Boss" : "Monster";
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

    if (isDefeated) {
      if (isBossEncounter) {
        const completionReward = onCompleteSelectedDeck();
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

      onMonsterDefeated();
      setBattleStatus("monster-defeated");
      setBattleLog({
        tone: "success",
        message: `${card.word} triggered for ${totalDamageDealt} total damage. ${elementFeedback ? `${elementFeedback} ` : ""}${totalShieldGained > 0 ? `Gained ${totalShieldGained} shield. ` : ""}${windGoldGained > 0 ? `Gained ${windGoldGained} extra gold. ` : ""}${currentEncounter.name} defeated.`,
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

  function monsterAttack(reason = "Wrong answer.") {
    const attackReduction = Math.min(
      pendingEarthReduction,
      currentEncounter.attack,
    );
    const reducedAttack = Math.max(currentEncounter.attack - attackReduction, 0);
    const shieldAbsorbed = Math.min(shield, reducedAttack);
    const hpDamageTaken = reducedAttack - shieldAbsorbed;
    const nextShield = shield - shieldAbsorbed;
    const nextPlayerHp = Math.max(playerHp - hpDamageTaken, 0);

    setPendingEarthReduction(0);
    setShield(nextShield);
    setPlayerHp(nextPlayerHp);

    if (nextPlayerHp === 0) {
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
    monsterAttack("Time's up!");
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

    setMonsterIndex(nextMonsterIndex);
    setMonsterHp(nextMonster.maxHp);
    setPendingEarthReduction(0);
    setBattleStatus("fighting");
    resetAnswerState();
    setQuestionSeed((current) => current + 1);
    setMiniGameType(nextMiniGameType);
    setTimeRemaining(getMiniGameTimeLimit(nextMiniGameType));
    setBattleLog({
      tone: "neutral",
      message: "A new monster appears. A new mini-game begins.",
    });
  }

  function handleStartBoss() {
    const nextMiniGameType = chooseBattleMiniGame();

    setIsBossEncounter(true);
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
    setIsBossEncounter(false);
    setHasCompletedBoss(false);
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
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
        <CardPanel className="border-red-900/30 bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 text-amber-50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Badge tone={isBossEncounter ? "red" : "emerald"}>
              {encounterLabel} Encounter
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

          <section className="mt-5 rounded-2xl border-2 border-red-300/20 bg-gradient-to-r from-red-950/70 via-stone-950/60 to-amber-950/70 p-5 shadow-inner">
            <div className="grid gap-5 md:grid-cols-[auto_minmax(0,1fr)_220px] md:items-center">
              <div className="grid size-28 place-items-center rounded-2xl border-2 border-amber-300/25 bg-amber-50/90 text-7xl shadow-inner">
                {currentEncounter.imagePlaceholder}
              </div>
              <div>
                <p className="text-sm font-extrabold uppercase text-amber-300">
                  Now Fighting
                </p>
                <h3 className="mt-1 text-4xl font-black text-amber-50">
                  {currentEncounter.name}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="red">{encounterLabel} Attack {currentEncounter.attack}</Badge>
                  {isBossEncounter && <Badge tone="purple">Boss Battle</Badge>}
                  {!isBossEncounter && (
                    <Badge tone="amber">
                      Boss after {BOSS_MONSTER_REQUIREMENT}
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between gap-3 text-sm font-black text-amber-100">
                  <span>Monster HP</span>
                  <span>{monsterHp} / {currentEncounter.maxHp}</span>
                </div>
                <div className="mt-2">
                  <ProgressBar
                    value={monsterHp}
                    max={currentEncounter.maxHp}
                    label={`${currentEncounter.name} HP`}
                    tone={isBossEncounter ? "red" : "emerald"}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border-2 border-amber-300/25 bg-amber-50/95 p-5 text-amber-950 shadow-[0_10px_0_rgba(120,53,15,0.22)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge tone="emerald">{formatMiniGameName(miniGameType)}</Badge>
                <h3 className="mt-2 text-3xl font-black text-amber-950">
                  Answer to trigger your card
                </h3>
                <p className="mt-1 text-sm font-semibold text-amber-900/70">
                  Dungeon questions are timed; Training stays untimed for safe practice.
                </p>
              </div>
              <div className="min-w-44 rounded-xl border-2 border-amber-900/15 bg-white/80 p-3 shadow-inner">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-extrabold uppercase text-amber-800/70">
                    Battle Timer
                  </p>
                  <Badge tone={isTimerLow && isTimerRunning ? "red" : "amber"}>
                    {timeRemaining}s / {miniGameTimeLimit}s
                  </Badge>
                </div>
                <div className="mt-2">
                  <ProgressBar
                    value={timeRemaining}
                    max={miniGameTimeLimit}
                    tone={isTimerLow && isTimerRunning ? "red" : "amber"}
                    label="Battle timer"
                  />
                </div>
              </div>
            </div>

            {miniGameType === "word-choice" ? (
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

          <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
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
            className={`rounded-xl border-2 p-4 shadow-[0_8px_0_rgba(120,53,15,0.14)] ${
              battleLog.tone === "success"
                ? "border-emerald-300 bg-emerald-100"
                : battleLog.tone === "danger"
                  ? "border-red-300 bg-red-100"
                  : "border-amber-800/30 bg-amber-50/95"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-black text-amber-950">Battle Feedback</p>
              <Badge
                tone={
                  battleLog.tone === "success"
                    ? "emerald"
                    : battleLog.tone === "danger"
                      ? "red"
                      : "slate"
                }
              >
                {battleLog.tone === "success"
                  ? "Correct"
                  : battleLog.tone === "danger"
                    ? "Wrong"
                    : "Waiting"}
              </Badge>
            </div>
            <p className="mt-2 text-sm font-medium text-amber-950/80">
              {battleLog.message}
            </p>

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

          <section className="rounded-xl border-2 border-amber-800/30 bg-amber-50/95 p-5 shadow-[0_10px_0_rgba(120,53,15,0.16)]">
            <Badge tone="purple">Triggered Card</Badge>
            <div className="mt-4 flex items-start gap-4">
              <span className="grid size-16 place-items-center rounded-lg border border-amber-900/15 bg-amber-100 text-4xl shadow-inner">
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
            <div className="mt-4 rounded-lg border border-amber-900/15 bg-white/70 p-3">
              <p className="text-xs font-extrabold uppercase text-amber-800/70">
                Triggered effects
              </p>
              <p className="mt-1 font-black text-amber-950">
                {battleLog.effectsSummary ?? "None yet"}
              </p>
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
                <StatCard label="Monsters" value={runProgress.monstersDefeated} tone="emerald" />
                <StatCard label="Final Gold" value={runGold} tone="amber" />
                <StatCard label="Run Deck" value={currentRunDeck.length} tone="slate" />
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
      <div className="rounded-lg bg-slate-50 p-5">
        <Badge tone="purple">
          {formatWordChoicePromptType(question.promptType)}
        </Badge>
        {question.promptType === "thai-to-english" ? (
          <div className="mt-4">
            <p className="text-4xl font-black text-slate-950">
              {question.card.meaningTh}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Choose the English word to trigger this card.
            </p>
          </div>
        ) : question.promptType === "sentence-cloze" ? (
          <div className="mt-4">
            <p className="text-3xl font-black leading-tight text-slate-950">
              {blankTargetWord(
                question.card.exampleSentence,
                question.card.word,
              )}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Complete the sentence to trigger the hidden word card.
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-5xl font-bold capitalize text-slate-950">
              {question.card.word}
            </p>
            <p className="mt-2 text-sm text-slate-600">
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
              className={`min-h-20 rounded-lg border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                showCorrect
                  ? "border-emerald-500 bg-emerald-50"
                  : showWrong
                    ? "border-red-400 bg-red-50"
                    : "border-slate-200 bg-white hover:border-emerald-500 hover:shadow-sm"
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
      <div className="rounded-lg bg-slate-50 p-5">
        <p className="font-semibold text-slate-950">
          Match one English word with its Thai meaning.
        </p>
        <p className="mt-1 text-sm text-slate-600">
          A correct pair triggers the selected English word card.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
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
                  className={`rounded-lg border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    showCorrect
                      ? "border-emerald-500 bg-emerald-50"
                      : showWrong
                        ? "border-red-400 bg-red-50"
                        : isSelected
                          ? "border-emerald-500 bg-white"
                          : "border-slate-200 bg-white hover:border-emerald-500 hover:shadow-sm"
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
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
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
                  className={`rounded-lg border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    showCorrect
                      ? "border-emerald-500 bg-emerald-50"
                      : showWrong
                        ? "border-red-400 bg-red-50"
                        : isSelected
                          ? "border-emerald-500 bg-white"
                          : "border-slate-200 bg-white hover:border-emerald-500 hover:shadow-sm"
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
      <div className="rounded-lg bg-slate-50 p-5">
        <p className="font-semibold text-slate-950">
          Choose one scrambled word, then type the original English word.
        </p>
        <p className="mt-1 text-sm text-slate-600">
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
              className={`rounded-lg border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                showCorrect
                  ? "border-emerald-500 bg-emerald-50"
                  : showWrong
                    ? "border-red-400 bg-red-50"
                    : isSelected
                      ? "border-emerald-500 bg-white"
                      : "border-slate-200 bg-white hover:border-emerald-500 hover:shadow-sm"
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

      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
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
