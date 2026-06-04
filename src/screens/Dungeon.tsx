import { useMemo, useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import {
  Badge,
  Button,
  CardPanel,
  ProgressBar,
  StatCard,
} from "../components/ui";
import { sampleBoss, sampleMonsters } from "../data";
import type { Monster, RunProgressState, ScreenName, WordCard } from "../types";

type DungeonProps = {
  currentRunDeck: WordCard[];
  isStarterDeckCompleted: boolean;
  onCompleteStarterDeck: () => void;
  onMonsterDefeated: () => void;
  onNavigate: (screen: ScreenName) => void;
  onResetRun: () => void;
  runGold: number;
  runProgress: RunProgressState;
};

type BattleMiniGameType = "word-choice" | "word-match" | "word-scramble";

type WordChoiceQuestion = {
  card: WordCard;
  promptType: "image" | "word";
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
  damageDealt?: number;
  damageTaken?: number;
  hpDamageTaken?: number;
  shieldAbsorbed?: number;
  shieldGained?: number;
  effectsSummary?: string;
};

const initialPlayerHp = 30;
const initialShield = 0;
const bossMilestone = 20;
const battleMiniGames: BattleMiniGameType[] = [
  "word-choice",
  "word-match",
  "word-scramble",
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

function buildWordChoiceQuestion(
  seed: number,
  deck: WordCard[],
): WordChoiceQuestion {
  const cardIndex = seed % deck.length;
  const card = deck[cardIndex];

  return {
    card,
    promptType: seed % 2 === 0 ? "image" : "word",
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

function getCardShieldAmount(card: WordCard) {
  return (
    card.effects?.reduce(
      (total, effect) => total + (effect.type === "shield" ? effect.amount : 0),
      0,
    ) ?? 0
  );
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
          `Element: ${effect.element.charAt(0).toUpperCase()}${effect.element.slice(1)}`,
      ) ?? [];

  return [...effects, ...elements].join(" / ");
}

export function Dungeon({
  currentRunDeck,
  isStarterDeckCompleted,
  onCompleteStarterDeck,
  onMonsterDefeated,
  onNavigate,
  onResetRun,
  runGold,
  runProgress,
}: DungeonProps) {
  const [playerHp, setPlayerHp] = useState(initialPlayerHp);
  const [shield, setShield] = useState(initialShield);
  const [monsterIndex, setMonsterIndex] = useState(0);
  const [monsterHp, setMonsterHp] = useState(
    () => getMonsterForIndex(0).maxHp,
  );
  const [isBossEncounter, setIsBossEncounter] = useState(false);
  const [hasCompletedBoss, setHasCompletedBoss] = useState(false);
  const [questionSeed, setQuestionSeed] = useState(0);
  const [miniGameType, setMiniGameType] = useState<BattleMiniGameType>(() =>
    chooseBattleMiniGame(),
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
  const isShopAvailable =
    runProgress.monstersDefeated > 0 &&
    runProgress.monstersDefeated === runProgress.nextShopAt;
  const isBossAvailable =
    runProgress.monstersDefeated >= bossMilestone &&
    !isBossEncounter &&
    !hasCompletedBoss;
  const monstersUntilShop = Math.max(
    runProgress.nextShopAt - runProgress.monstersDefeated,
    0,
  );

  function resetAnswerState() {
    setSelectedChoiceId(null);
    setSelectedWordId(null);
    setSelectedMeaningId(null);
    setSelectedScrambleCardId(null);
    setScrambleAnswer("");
    setIsAnswered(false);
  }

  function advanceQuestion() {
    resetAnswerState();
    setQuestionSeed((current) => current + 1);
    setMiniGameType(chooseBattleMiniGame());
    setBattleLog({
      tone: "neutral",
      message: "A new mini-game begins. Choose carefully.",
    });
  }

  function triggerCard(card: WordCard) {
    const shieldGained = getCardShieldAmount(card);
    const effectsSummary = getCardEffectsSummary(card);
    const nextMonsterHp = Math.max(monsterHp - card.baseAttack, 0);

    setMonsterHp(nextMonsterHp);
    if (shieldGained > 0) {
      setShield((currentShield) => currentShield + shieldGained);
    }

    if (nextMonsterHp === 0) {
      if (isBossEncounter) {
        onCompleteStarterDeck();
        setHasCompletedBoss(true);
        setBattleStatus("run-complete");
        setBattleLog({
          tone: "success",
          message: `${card.word} triggered for ${card.baseAttack} damage${shieldGained > 0 ? ` and gained ${shieldGained} shield` : ""}. ${sampleBoss.name} defeated. Starter Deck completed. Permanent progress saved.`,
          triggeredCard: card,
          damageDealt: card.baseAttack,
          shieldGained,
          effectsSummary,
        });
        return;
      }

      onMonsterDefeated();
      setBattleStatus("monster-defeated");
      setBattleLog({
        tone: "success",
        message: `${card.word} triggered for ${card.baseAttack} damage${shieldGained > 0 ? ` and gained ${shieldGained} shield` : ""}. ${currentEncounter.name} defeated.`,
        triggeredCard: card,
        damageDealt: card.baseAttack,
        shieldGained,
        effectsSummary,
      });
      return;
    }

    setBattleLog({
      tone: "success",
      message: `${card.word} triggered for ${card.baseAttack} damage${shieldGained > 0 ? ` and gained ${shieldGained} shield` : ""}.`,
      triggeredCard: card,
      damageDealt: card.baseAttack,
      shieldGained,
      effectsSummary,
    });
  }

  function monsterAttack() {
    const shieldAbsorbed = Math.min(shield, currentEncounter.attack);
    const hpDamageTaken = currentEncounter.attack - shieldAbsorbed;
    const nextShield = shield - shieldAbsorbed;
    const nextPlayerHp = Math.max(playerHp - hpDamageTaken, 0);

    setShield(nextShield);
    setPlayerHp(nextPlayerHp);

    if (nextPlayerHp === 0) {
      setBattleStatus("run-failed");
      setBattleLog({
        tone: "danger",
        message: `Wrong answer. No card triggered. ${currentEncounter.name} attacked for ${currentEncounter.attack}. Shield absorbed ${shieldAbsorbed}; HP took ${hpDamageTaken}. Run Failed.`,
        damageTaken: currentEncounter.attack,
        hpDamageTaken,
        shieldAbsorbed,
      });
      return;
    }

    setBattleLog({
      tone: "danger",
      message: `Wrong answer. No card triggered. ${currentEncounter.name} attacked for ${currentEncounter.attack}. Shield absorbed ${shieldAbsorbed}; HP took ${hpDamageTaken}.`,
      damageTaken: currentEncounter.attack,
      hpDamageTaken,
      shieldAbsorbed,
    });
  }

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

    setMonsterIndex(nextMonsterIndex);
    setMonsterHp(nextMonster.maxHp);
    setBattleStatus("fighting");
    resetAnswerState();
    setQuestionSeed((current) => current + 1);
    setMiniGameType(chooseBattleMiniGame());
    setBattleLog({
      tone: "neutral",
      message: "A new monster appears. A new mini-game begins.",
    });
  }

  function handleStartBoss() {
    setIsBossEncounter(true);
    setMonsterHp(sampleBoss.maxHp);
    setBattleStatus("fighting");
    resetAnswerState();
    setQuestionSeed((current) => current + 1);
    setMiniGameType(chooseBattleMiniGame());
    setBattleLog({
      tone: "neutral",
      message: `${sampleBoss.name} appears. Defeat the boss to complete the run.`,
    });
  }

  function handleRestartRun() {
    onResetRun();
    setPlayerHp(initialPlayerHp);
    setShield(initialShield);
    setIsBossEncounter(false);
    setHasCompletedBoss(false);
    setMonsterIndex(0);
    setMonsterHp(getMonsterForIndex(0).maxHp);
    setBattleStatus("fighting");
    resetAnswerState();
    setQuestionSeed((current) => current + 1);
    setMiniGameType(chooseBattleMiniGame());
    setBattleLog({
      tone: "neutral",
      message: "Run restarted. Choose the correct answer to trigger a card.",
    });
  }

  return (
    <ScreenShell
      eyebrow="Battle"
      title="Dungeon"
      description="Answer vocabulary mini-games to trigger cards. Run state here is local and temporary."
      framed={false}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <CardPanel>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Badge tone="emerald">Battle Mini-Game</Badge>
              <h3 className="mt-1 text-2xl font-bold text-slate-950">
                {formatMiniGameName(miniGameType)}
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Temporary run flow only. Shop routing, current-run purchases,
                the first boss encounter, and the first permanent deck
                completion reward exist. Run state is still not saved.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => onNavigate("run-result")}
              variant="secondary"
            >
              End Run
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Monsters Defeated"
              value={runProgress.monstersDefeated}
              helper={`Floor ${runProgress.currentFloor}`}
              tone="emerald"
            />
            <StatCard
              label="Next Shop"
              value={isShopAvailable ? "Ready" : runProgress.nextShopAt}
              helper={
                isShopAvailable
                  ? "Shop checkpoint reached"
                  : `${monstersUntilShop} until shop`
              }
              tone={isShopAvailable ? "amber" : "slate"}
            />
            <StatCard
              label="Current Run Progress"
              value={
                isShopAvailable
                  ? "Shop Available"
                  : `${runProgress.monstersDefeated} / ${runProgress.nextShopAt}`
              }
              helper="Temporary run state"
              tone={isShopAvailable ? "amber" : "sky"}
            />
            <StatCard
              label="Boss"
              value={
                hasCompletedBoss
                  ? "Defeated"
                  : isBossEncounter
                    ? "Active"
                    : isBossAvailable
                      ? "Available"
                      : `${runProgress.monstersDefeated} / ${bossMilestone}`
              }
              helper="Monster 20 milestone"
              tone={
                hasCompletedBoss
                  ? "emerald"
                  : isBossAvailable || isBossEncounter
                    ? "red"
                    : "slate"
              }
            />
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge
                  tone={isBossAvailable ? "red" : isShopAvailable ? "amber" : "sky"}
                >
                  {isBossAvailable
                    ? "Boss Available"
                    : isShopAvailable
                      ? "Shop Available"
                      : "Run Progress"}
                </Badge>
                <p className="mt-2 text-sm font-semibold text-slate-950">
                  {isBossAvailable
                    ? `${sampleBoss.name} is ready after ${bossMilestone} defeated monsters.`
                    : `Monster Defeated: ${runProgress.monstersDefeated} / ${runProgress.nextShopAt} until Shop`}
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
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Player HP"
              value={`${playerHp} / ${initialPlayerHp}`}
              tone="red"
            >
              <ProgressBar
                value={playerHp}
                max={initialPlayerHp}
                tone="red"
                label="Player HP"
              />
            </StatCard>
            <StatCard
              label="Shield"
              value={shield}
              helper="Absorbs monster damage before HP"
              tone="sky"
            />
            <StatCard
              label="Gold"
              value={runGold}
              helper="+5 when a monster is defeated"
              tone="amber"
            />
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="grid size-16 place-items-center rounded-md bg-white text-4xl shadow-sm">
                  {currentEncounter.imagePlaceholder}
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Current {encounterLabel}
                  </p>
                  <h4 className="text-2xl font-bold text-slate-950">
                    {currentEncounter.name}
                  </h4>
                  <p className="text-sm text-slate-600">
                    Attack {currentEncounter.attack}
                  </p>
                </div>
              </div>
              <div className="min-w-44">
                <p className="text-sm font-semibold text-slate-700">
                  HP {monsterHp} / {currentEncounter.maxHp}
                </p>
                <div className="mt-2">
                  <ProgressBar
                    value={monsterHp}
                    max={currentEncounter.maxHp}
                    label={`${currentEncounter.name} HP`}
                    tone={isBossEncounter ? "red" : "emerald"}
                  />
                </div>
                <Badge tone="red" className="mt-3">
                  {encounterLabel} Attack {currentEncounter.attack}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Badge tone="emerald">{formatMiniGameName(miniGameType)}</Badge>
              <p className="text-sm text-slate-500">
                Correct answers trigger the selected word card.
              </p>
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
          </div>

          <div
            className={`mt-5 rounded-lg border p-4 ${
              battleLog.tone === "success"
                ? "border-emerald-200 bg-emerald-50"
                : battleLog.tone === "danger"
                  ? "border-red-200 bg-red-50"
                  : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-slate-950">Battle Feedback</p>
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
            <p className="mt-1 text-slate-700">{battleLog.message}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-md bg-white/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Triggered card
                </p>
                <p className="mt-1 font-semibold capitalize text-slate-950">
                  {battleLog.triggeredCard?.word ?? "None"}
                </p>
              </div>
              <div className="rounded-md bg-white/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Damage dealt
                </p>
                <p className="mt-1 font-semibold text-slate-950">
                  {battleLog.damageDealt ?? 0}
                </p>
              </div>
              <div className="rounded-md bg-white/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Damage taken
                </p>
                <p className="mt-1 font-semibold text-slate-950">
                  {battleLog.damageTaken ?? 0}
                </p>
              </div>
              <div className="rounded-md bg-white/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Shield absorbed
                </p>
                <p className="mt-1 font-semibold text-slate-950">
                  {battleLog.shieldAbsorbed ?? 0}
                </p>
              </div>
              <div className="rounded-md bg-white/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  HP damage
                </p>
                <p className="mt-1 font-semibold text-slate-950">
                  {battleLog.hpDamageTaken ?? 0}
                </p>
              </div>
              <div className="rounded-md bg-white/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Shield gained
                </p>
                <p className="mt-1 font-semibold text-slate-950">
                  {battleLog.shieldGained ?? 0}
                </p>
              </div>
            </div>
            <div className="mt-3 rounded-md bg-white/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Triggered effects
              </p>
              <p className="mt-1 font-semibold text-slate-950">
                {battleLog.effectsSummary ?? "None"}
              </p>
            </div>
            {isAnswered && battleStatus === "fighting" && (
              <Button
                type="button"
                onClick={advanceQuestion}
                className="mt-4"
              >
                Next Mini-Game
              </Button>
            )}
            {battleStatus === "monster-defeated" && (
              <div className="mt-4 flex flex-wrap gap-3">
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
            {battleStatus === "run-complete" && (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-white/70 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="emerald">Run Complete</Badge>
                  <p className="font-semibold text-slate-950">
                    Starter Deck completed. Permanent progress saved.
                  </p>
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  Next deck unlock coming soon. Temporary run upgrades, gold,
                  HP, shield, monster state, boss state, and run deck changes
                  were not saved.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    label="Monsters Defeated"
                    value={runProgress.monstersDefeated}
                    tone="emerald"
                  />
                  <StatCard
                    label="Current Floor"
                    value={runProgress.currentFloor}
                    tone="sky"
                  />
                  <StatCard label="Final Gold" value={runGold} tone="amber" />
                  <StatCard
                    label="Run Deck Size"
                    value={currentRunDeck.length}
                    tone="slate"
                  />
                  <StatCard
                    label="Deck Reward"
                    value="Completed"
                    helper={
                      isStarterDeckCompleted
                        ? "Already saved"
                        : "Saved after boss defeat"
                    }
                    tone="emerald"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleRestartRun}
                  className="mt-4"
                  variant="secondary"
                >
                  Restart Run
                </Button>
              </div>
            )}
            {battleStatus === "run-failed" && (
              <Button
                type="button"
                onClick={handleRestartRun}
                className="mt-4 bg-red-600 hover:bg-red-700"
              >
                Restart Run
              </Button>
            )}
          </div>
        </CardPanel>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:self-start">
          <Badge tone="emerald">Card Trigger System</Badge>
          <div className="mt-4 flex items-start gap-4">
            <span className="grid size-14 place-items-center rounded-md bg-slate-100 text-3xl">
              {featuredCard.imagePlaceholder}
            </span>
            <div>
              <p className="text-xl font-bold capitalize text-slate-950">
                {featuredCard.word}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Base attack {featuredCard.baseAttack}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Shield effect +{getCardShieldAmount(featuredCard)}
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-md border border-slate-200 p-4">
            <p className="font-semibold text-slate-950">Current mini-game</p>
            <p className="mt-1 text-sm text-slate-600">
              {formatMiniGameName(miniGameType)}
            </p>
          </div>
          <div className="mt-4 rounded-md border border-slate-200 p-4">
            <p className="font-semibold text-slate-950">Trigger rule</p>
            <p className="mt-2 text-sm text-slate-600">
              Correct answers trigger the selected word card and deal damage
              equal to base attack. Shield effects add player shield when the
              card triggers. Incorrect answers do not trigger card effects and
              cause monster attack damage, with shield absorbing damage before
              HP.
            </p>
          </div>
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
  return (
    <div className="mt-5">
      {question.promptType === "image" ? (
        <div className="flex flex-col gap-4 rounded-lg bg-slate-50 p-5 sm:flex-row sm:items-center">
          <span className="grid size-20 place-items-center rounded-md bg-white text-5xl shadow-sm">
            {question.card.imagePlaceholder}
          </span>
          <div>
            <p className="font-semibold text-slate-950">
              Which Thai meaning matches this card?
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Pick one answer to trigger the prompt card.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-slate-50 p-5">
          <p className="text-5xl font-bold capitalize text-slate-950">
            {question.card.word}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Choose the correct Thai meaning to trigger this card.
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
                    {choice.meaningTh}
                  </p>
                  <p className="mt-1 text-sm capitalize text-slate-500">
                    {choice.partOfSpeech}
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
