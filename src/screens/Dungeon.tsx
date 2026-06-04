import { useMemo, useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import {
  Badge,
  Button,
  CardPanel,
  ProgressBar,
  StatCard,
} from "../components/ui";
import { sampleMonsters, starterDeck } from "../data";
import type { Monster, ScreenName, WordCard } from "../types";

type DungeonProps = {
  onNavigate: (screen: ScreenName) => void;
};

type BattleMiniGameType = "word-choice" | "word-match";

type WordChoiceQuestion = {
  card: WordCard;
  promptType: "image" | "word";
  choices: WordCard[];
};

type WordMatchQuestion = {
  cards: WordCard[];
  meanings: WordCard[];
};

type BattleLog = {
  tone: "neutral" | "success" | "danger";
  message: string;
  triggeredCard?: WordCard;
  damageDealt?: number;
  damageTaken?: number;
};

const initialPlayerHp = 30;
const initialShield = 0;
const initialGold = 0;

function chooseBattleMiniGame(): BattleMiniGameType {
  return Math.random() < 0.5 ? "word-choice" : "word-match";
}

function getMonsterForIndex(index: number): Monster {
  return sampleMonsters[index % sampleMonsters.length];
}

function rotateCards(seed: number) {
  return starterDeck.cards.map(
    (_, index) => starterDeck.cards[(seed + index) % starterDeck.cards.length],
  );
}

function buildChoices(card: WordCard, cardIndex: number) {
  const distractors = starterDeck.cards
    .filter((candidate) => candidate.id !== card.id)
    .slice(cardIndex, cardIndex + 3);

  if (distractors.length < 3) {
    const fallbackChoices = starterDeck.cards.filter(
      (candidate) =>
        candidate.id !== card.id &&
        !distractors.some((distractor) => distractor.id === candidate.id),
    );

    distractors.push(...fallbackChoices.slice(0, 3 - distractors.length));
  }

  return [card, ...distractors].sort((left, right) =>
    left.meaningTh.localeCompare(right.meaningTh),
  );
}

function buildWordChoiceQuestion(seed: number): WordChoiceQuestion {
  const cardIndex = seed % starterDeck.cards.length;
  const card = starterDeck.cards[cardIndex];

  return {
    card,
    promptType: seed % 2 === 0 ? "image" : "word",
    choices: buildChoices(card, cardIndex + 1),
  };
}

function buildWordMatchQuestion(seed: number): WordMatchQuestion {
  const cards = rotateCards(seed).slice(0, 3);
  const meanings = [...cards].sort((left, right) =>
    seed % 2 === 0
      ? right.meaningTh.localeCompare(left.meaningTh)
      : left.meaningTh.localeCompare(right.meaningTh),
  );

  return { cards, meanings };
}

function formatMiniGameName(miniGameType: BattleMiniGameType) {
  return miniGameType === "word-choice" ? "Word Choice" : "Word Match";
}

export function Dungeon({ onNavigate }: DungeonProps) {
  const [playerHp, setPlayerHp] = useState(initialPlayerHp);
  const [shield] = useState(initialShield);
  const [gold] = useState(initialGold);
  const [monsterIndex, setMonsterIndex] = useState(0);
  const [monsterHp, setMonsterHp] = useState(
    () => getMonsterForIndex(0).maxHp,
  );
  const [questionSeed, setQuestionSeed] = useState(0);
  const [miniGameType, setMiniGameType] = useState<BattleMiniGameType>(() =>
    chooseBattleMiniGame(),
  );
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [selectedMeaningId, setSelectedMeaningId] = useState<string | null>(
    null,
  );
  const [isAnswered, setIsAnswered] = useState(false);
  const [battleLog, setBattleLog] = useState<BattleLog>({
    tone: "neutral",
    message: "Choose a correct answer to trigger a word card.",
  });
  const [battleStatus, setBattleStatus] = useState<
    "fighting" | "monster-defeated" | "run-failed"
  >("fighting");

  const currentMonster = getMonsterForIndex(monsterIndex);
  const wordChoiceQuestion = useMemo(
    () => buildWordChoiceQuestion(questionSeed),
    [questionSeed],
  );
  const wordMatchQuestion = useMemo(
    () => buildWordMatchQuestion(questionSeed),
    [questionSeed],
  );
  const featuredCard =
    miniGameType === "word-choice"
      ? wordChoiceQuestion.card
      : wordMatchQuestion.cards[0];
  function resetAnswerState() {
    setSelectedChoiceId(null);
    setSelectedWordId(null);
    setSelectedMeaningId(null);
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
    const nextMonsterHp = Math.max(monsterHp - card.baseAttack, 0);

    setMonsterHp(nextMonsterHp);

    if (nextMonsterHp === 0) {
      setBattleStatus("monster-defeated");
      setBattleLog({
        tone: "success",
        message: `${card.word} triggered for ${card.baseAttack} damage. ${currentMonster.name} defeated.`,
        triggeredCard: card,
        damageDealt: card.baseAttack,
      });
      return;
    }

    setBattleLog({
      tone: "success",
      message: `${card.word} triggered for ${card.baseAttack} damage.`,
      triggeredCard: card,
      damageDealt: card.baseAttack,
    });
  }

  function monsterAttack() {
    const nextPlayerHp = Math.max(playerHp - currentMonster.attack, 0);
    setPlayerHp(nextPlayerHp);

    if (nextPlayerHp === 0) {
      setBattleStatus("run-failed");
      setBattleLog({
        tone: "danger",
        message: `Wrong answer. No card triggered. ${currentMonster.name} dealt ${currentMonster.attack} damage. Run Failed.`,
        damageTaken: currentMonster.attack,
      });
      return;
    }

    setBattleLog({
      tone: "danger",
      message: `Wrong answer. No card triggered. ${currentMonster.name} dealt ${currentMonster.attack} damage.`,
      damageTaken: currentMonster.attack,
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

  function handleRestartRun() {
    setPlayerHp(initialPlayerHp);
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
                Local battle state only. No shop, boss, rewards, save system, or
                permanent mastery updates are connected here yet.
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
              helper="Display only for now"
              tone="sky"
            />
            <StatCard
              label="Gold"
              value={gold}
              helper="No battle rewards yet"
              tone="amber"
            />
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="grid size-16 place-items-center rounded-md bg-white text-4xl shadow-sm">
                  {currentMonster.imagePlaceholder}
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Current Monster
                  </p>
                  <h4 className="text-2xl font-bold text-slate-950">
                    {currentMonster.name}
                  </h4>
                  <p className="text-sm text-slate-600">
                    Attack {currentMonster.attack}
                  </p>
                </div>
              </div>
              <div className="min-w-44">
                <p className="text-sm font-semibold text-slate-700">
                  HP {monsterHp} / {currentMonster.maxHp}
                </p>
                <div className="mt-2">
                  <ProgressBar
                    value={monsterHp}
                    max={currentMonster.maxHp}
                    label={`${currentMonster.name} HP`}
                  />
                </div>
                <Badge tone="red" className="mt-3">
                  Attack {currentMonster.attack}
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
            ) : (
              <WordMatchBattle
                isAnswered={isAnswered}
                question={wordMatchQuestion}
                selectedMeaningId={selectedMeaningId}
                selectedWordId={selectedWordId}
                onSelectMeaning={setSelectedMeaningId}
                onSelectWord={setSelectedWordId}
                onSubmit={handleWordMatchSubmit}
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
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
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
              <Button
                type="button"
                onClick={handleNextMonster}
                className="mt-4"
              >
                Spawn Next Monster
              </Button>
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
              equal to base attack. Incorrect answers do not trigger card
              effects and cause monster attack damage.
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
                    {!isAnswered && isSelected && <Badge tone="sky">Selected</Badge>}
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
                    {!isAnswered && isSelected && <Badge tone="sky">Selected</Badge>}
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
