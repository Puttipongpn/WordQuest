import { useEffect, useMemo, useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import {
  Badge,
  Button,
  CardPanel,
  ProgressBar,
  StatCard,
} from "../components/ui";
import { MAX_WORD_MASTERY } from "../game/balance";
import type {
  ScreenName,
  VocabularyDeck,
  WordCard,
  WordMasteryByCardId,
} from "../types";
import { playSound } from "../utils/soundManager";

type AnswerResult = "correct" | "wrong";
type TrainingQuestionType =
  | "english-to-thai"
  | "thai-to-english"
  | "sentence-cloze";
type TrainingMode = "quick" | "weak" | "unmastered" | "review";
type SessionLength = 5 | 10 | 20 | "all";
type TrainingPhase = "setup" | "active" | "complete";

type TrainingQuestion = {
  card: WordCard;
  questionType: TrainingQuestionType;
  choices: WordCard[];
};

type SessionStats = {
  correct: number;
  incorrect: number;
  masteryIncreases: number;
  newlyMasteredWords: string[];
};

const trainingQuestionTypes: TrainingQuestionType[] = [
  "thai-to-english",
  "sentence-cloze",
  "english-to-thai",
];

const trainingModes: Array<{
  id: TrainingMode;
  title: string;
  description: string;
  badge: string;
}> = [
  {
    id: "quick",
    title: "Quick Practice",
    description: "A balanced mix from the selected deck.",
    badge: "Default",
  },
  {
    id: "weak",
    title: "Weak Words",
    description: "Prioritize words at mastery 0-2.",
    badge: "Focus",
  },
  {
    id: "unmastered",
    title: "Unmastered Words",
    description: "Practice words below mastery 5.",
    badge: "Growth",
  },
  {
    id: "review",
    title: "Review All",
    description: "Use the full selected deck.",
    badge: "All Words",
  },
];

const sessionLengths: SessionLength[] = [5, 10, 20, "all"];

type TrainingProps = {
  deck: VocabularyDeck;
  wordMastery: WordMasteryByCardId;
  onIncreaseWordMastery: (cardId: string) => void;
  onNavigate: (screen: ScreenName) => void;
};

function getCardMastery(card: WordCard, wordMastery: WordMasteryByCardId) {
  return wordMastery[card.id] ?? 0;
}

function getDeckMasterySummary(
  deck: VocabularyDeck,
  wordMastery: WordMasteryByCardId,
) {
  const totalMastery = deck.cards.reduce(
    (total, card) => total + getCardMastery(card, wordMastery),
    0,
  );
  const masteredWords = deck.cards.filter(
    (card) => getCardMastery(card, wordMastery) >= MAX_WORD_MASTERY,
  ).length;
  const averageMastery =
    deck.cards.length > 0
      ? Number((totalMastery / deck.cards.length).toFixed(1))
      : 0;

  return {
    averageMastery,
    masteredWords,
    progressPercent:
      deck.cards.length > 0
        ? Math.round((totalMastery / (deck.cards.length * MAX_WORD_MASTERY)) * 100)
        : 0,
  };
}

function getModeCards(
  deck: VocabularyDeck,
  wordMastery: WordMasteryByCardId,
  mode: TrainingMode,
) {
  if (mode === "weak") {
    const weakCards = deck.cards.filter(
      (card) => getCardMastery(card, wordMastery) <= 2,
    );
    const fallbackCards = deck.cards.filter(
      (card) => getCardMastery(card, wordMastery) > 2,
    );

    return { primaryCards: weakCards, fallbackCards };
  }

  if (mode === "unmastered") {
    return {
      primaryCards: deck.cards.filter(
        (card) => getCardMastery(card, wordMastery) < MAX_WORD_MASTERY,
      ),
      fallbackCards: [],
    };
  }

  return { primaryCards: deck.cards, fallbackCards: [] };
}

function getModeAvailabilityMessage(
  deck: VocabularyDeck,
  wordMastery: WordMasteryByCardId,
  mode: TrainingMode,
) {
  const { primaryCards } = getModeCards(deck, wordMastery, mode);

  if (mode === "weak" && primaryCards.length === 0) {
    return "No weak words left in this deck. Try Review All or enter the dungeon.";
  }

  if (mode === "unmastered" && primaryCards.length === 0) {
    return "All words in this deck are mastered.";
  }

  return "";
}

function rotateCards(cards: WordCard[], seed: number) {
  if (cards.length === 0) {
    return [];
  }

  const offset = seed % cards.length;

  return [...cards.slice(offset), ...cards.slice(0, offset)];
}

function selectTrainingCards(
  deck: VocabularyDeck,
  wordMastery: WordMasteryByCardId,
  mode: TrainingMode,
  sessionLength: SessionLength,
) {
  const { primaryCards, fallbackCards } = getModeCards(deck, wordMastery, mode);

  if (primaryCards.length === 0) {
    return [];
  }

  const requestedCount =
    sessionLength === "all" ? primaryCards.length : sessionLength;
  const orderedCards = [
    ...rotateCards(primaryCards, requestedCount),
    ...rotateCards(fallbackCards, requestedCount + 2),
  ];
  const selectedCards: WordCard[] = [];

  for (let index = 0; index < requestedCount; index += 1) {
    const card = orderedCards[index % orderedCards.length];

    if (!card) {
      break;
    }

    selectedCards.push(card);
  }

  return selectedCards;
}

function buildChoices(card: WordCard, cardIndex: number, deck: VocabularyDeck) {
  const distractors = rotateCards(
    deck.cards.filter((candidate) => candidate.id !== card.id),
    cardIndex,
  ).slice(0, 3);

  return [card, ...distractors].sort((left, right) =>
    left.word.localeCompare(right.word),
  );
}

function chooseTrainingQuestionType(index: number): TrainingQuestionType {
  const randomOffset = Math.floor(Math.random() * trainingQuestionTypes.length);

  return trainingQuestionTypes[
    (index + randomOffset) % trainingQuestionTypes.length
  ];
}

function formatQuestionType(questionType: TrainingQuestionType) {
  if (questionType === "thai-to-english") {
    return "Thai Meaning → English Word";
  }

  if (questionType === "sentence-cloze") {
    return "Example Sentence Cloze";
  }

  return "English Word → Thai Meaning";
}

function formatTrainingMode(mode: TrainingMode) {
  return trainingModes.find((trainingMode) => trainingMode.id === mode)?.title;
}

function formatSessionLength(sessionLength: SessionLength) {
  return sessionLength === "all" ? "All available" : `${sessionLength} questions`;
}

function blankTargetWord(sentence: string, word: string) {
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const wordPattern = new RegExp(`\\b${escapedWord}\\b`, "i");

  if (wordPattern.test(sentence)) {
    return sentence.replace(wordPattern, "____");
  }

  return `${sentence} (____ = ${word.length} letters)`;
}

function buildQuestions(
  deck: VocabularyDeck,
  wordMastery: WordMasteryByCardId,
  mode: TrainingMode,
  sessionLength: SessionLength,
) {
  return selectTrainingCards(deck, wordMastery, mode, sessionLength).map(
    (card, index): TrainingQuestion => ({
      card,
      questionType: chooseTrainingQuestionType(index),
      choices: buildChoices(card, index + 1, deck),
    }),
  );
}

export function Training({
  deck,
  wordMastery,
  onIncreaseWordMastery,
  onNavigate,
}: TrainingProps) {
  const [phase, setPhase] = useState<TrainingPhase>("setup");
  const [trainingMode, setTrainingMode] = useState<TrainingMode>("quick");
  const [sessionLength, setSessionLength] = useState<SessionLength>(10);
  const [questions, setQuestions] = useState<TrainingQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [masteryBeforeAnswer, setMasteryBeforeAnswer] = useState<number | null>(
    null,
  );
  const [stats, setStats] = useState<SessionStats>({
    correct: 0,
    incorrect: 0,
    masteryIncreases: 0,
    newlyMasteredWords: [],
  });

  const deckMasterySummary = useMemo(
    () => getDeckMasterySummary(deck, wordMastery),
    [deck, wordMastery],
  );
  const availabilityMessage = getModeAvailabilityMessage(
    deck,
    wordMastery,
    trainingMode,
  );
  const currentQuestion = questions[questionIndex];
  const isAnswered = result !== null;
  const isLastQuestion = questionIndex === questions.length - 1;
  const currentMastery = currentQuestion
    ? getCardMastery(currentQuestion.card, wordMastery)
    : 0;
  const masteryAfterCorrectAnswer =
    masteryBeforeAnswer === null
      ? currentMastery
      : Math.min(masteryBeforeAnswer + 1, MAX_WORD_MASTERY);
  const answeredCount = stats.correct + stats.incorrect;
  const accuracy =
    answeredCount > 0 ? Math.round((stats.correct / answeredCount) * 100) : 0;

  useEffect(() => {
    resetToSetup();
  }, [deck.id]);

  function resetAnswerState() {
    setSelectedCardId(null);
    setResult(null);
    setMasteryBeforeAnswer(null);
  }

  function resetStats() {
    setStats({
      correct: 0,
      incorrect: 0,
      masteryIncreases: 0,
      newlyMasteredWords: [],
    });
  }

  function resetToSetup() {
    setPhase("setup");
    setQuestions([]);
    setQuestionIndex(0);
    resetAnswerState();
    resetStats();
  }

  function startSession() {
    const nextQuestions = buildQuestions(
      deck,
      wordMastery,
      trainingMode,
      sessionLength,
    );

    if (nextQuestions.length === 0) {
      return;
    }

    setQuestions(nextQuestions);
    setQuestionIndex(0);
    resetAnswerState();
    resetStats();
    setPhase("active");
    playSound("ui-click");
  }

  function handleAnswer(choice: WordCard) {
    if (isAnswered || !currentQuestion) {
      return;
    }

    const masteryBefore = getCardMastery(currentQuestion.card, wordMastery);
    const isCorrect = choice.id === currentQuestion.card.id;
    const willIncreaseMastery = isCorrect && masteryBefore < MAX_WORD_MASTERY;
    const willMasterWord = isCorrect && masteryBefore === MAX_WORD_MASTERY - 1;

    setMasteryBeforeAnswer(masteryBefore);
    setSelectedCardId(choice.id);
    setResult(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      playSound(willIncreaseMastery ? "mastery-up" : "correct");
      setStats((currentStats) => ({
        ...currentStats,
        correct: currentStats.correct + 1,
        masteryIncreases:
          currentStats.masteryIncreases + (willIncreaseMastery ? 1 : 0),
        newlyMasteredWords: willMasterWord
          ? [...currentStats.newlyMasteredWords, currentQuestion.card.word]
          : currentStats.newlyMasteredWords,
      }));
      onIncreaseWordMastery(currentQuestion.card.id);
      return;
    }

    playSound("wrong");
    setStats((currentStats) => ({
      ...currentStats,
      incorrect: currentStats.incorrect + 1,
    }));
  }

  function handleNext() {
    resetAnswerState();

    if (isLastQuestion) {
      setPhase("complete");
      playSound("victory");
      return;
    }

    setQuestionIndex((current) => current + 1);
  }

  function trainAgain() {
    startSession();
  }

  return (
    <ScreenShell
      eyebrow="Training Room"
      title="Camp Training"
      description="Practice safely before the dungeon. Training is untimed, and correct answers save word mastery only."
      framed={false}
    >
      {phase === "setup" ? (
        <TrainingSetup
          availabilityMessage={availabilityMessage}
          deck={deck}
          deckMasterySummary={deckMasterySummary}
          onSelectLength={setSessionLength}
          onSelectMode={setTrainingMode}
          onStart={startSession}
          sessionLength={sessionLength}
          trainingMode={trainingMode}
        />
      ) : phase === "complete" ? (
        <TrainingComplete
          accuracy={accuracy}
          deck={deck}
          onBackHome={() => onNavigate("home")}
          onChangeMode={resetToSetup}
          onEnterDungeon={() => onNavigate("dungeon")}
          onReviewDeck={() => onNavigate("deck-review")}
          onTrainAgain={trainAgain}
          sessionLength={questions.length}
          stats={stats}
          trainingMode={trainingMode}
        />
      ) : currentQuestion ? (
        <TrainingSession
          currentMastery={currentMastery}
          currentQuestion={currentQuestion}
          isAnswered={isAnswered}
          isLastQuestion={isLastQuestion}
          masteryAfterCorrectAnswer={masteryAfterCorrectAnswer}
          masteryBeforeAnswer={masteryBeforeAnswer}
          onAnswer={handleAnswer}
          onChangeMode={resetToSetup}
          onNext={handleNext}
          questionIndex={questionIndex}
          questionsLength={questions.length}
          result={result}
          selectedCardId={selectedCardId}
          stats={stats}
          trainingMode={trainingMode}
          deck={deck}
        />
      ) : null}
    </ScreenShell>
  );
}

function TrainingSetup({
  availabilityMessage,
  deck,
  deckMasterySummary,
  onSelectLength,
  onSelectMode,
  onStart,
  sessionLength,
  trainingMode,
}: {
  availabilityMessage: string;
  deck: VocabularyDeck;
  deckMasterySummary: ReturnType<typeof getDeckMasterySummary>;
  onSelectLength: (length: SessionLength) => void;
  onSelectMode: (mode: TrainingMode) => void;
  onStart: () => void;
  sessionLength: SessionLength;
  trainingMode: TrainingMode;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <CardPanel className="border-sky-800/25 bg-gradient-to-br from-sky-100 via-amber-50 to-emerald-100 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="emerald">Training</Badge>
              <Badge tone="purple">{deck.name}</Badge>
            </div>
            <h3 className="mt-2 text-2xl font-black text-amber-950">
              Choose practice
            </h3>
            <p className="mt-1 text-sm font-bold leading-5 text-amber-950/70">
              Pick a focus, then answer untimed vocabulary questions.
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-950">
            {deckMasterySummary.masteredWords} / {deck.cards.length} mastered
          </div>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {trainingModes.map((mode) => {
            const isSelected = trainingMode === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onSelectMode(mode.id)}
                className={`rounded-xl border-2 p-3 text-left shadow-sm transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                  isSelected
                    ? "border-amber-600 bg-white ring-2 ring-amber-300"
                    : "border-amber-900/15 bg-white/70 hover:border-amber-500"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-lg font-black text-amber-950">
                      {mode.title}
                    </p>
                    <p className="mt-1 text-sm font-bold leading-5 text-amber-900/70">
                      {mode.description}
                    </p>
                  </div>
                  <Badge tone={isSelected ? "amber" : "sky"}>
                    {isSelected ? "Ready" : mode.badge}
                  </Badge>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border-2 border-amber-900/10 bg-white/70 p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-black text-amber-950">Session length</p>
            <Button
              type="button"
              onClick={onStart}
              disabled={availabilityMessage !== ""}
            >
              Begin Practice
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {sessionLengths.map((length) => (
              <Button
                key={String(length)}
                type="button"
                onClick={() => onSelectLength(length)}
                variant={sessionLength === length ? "primary" : "secondary"}
              >
                {formatSessionLength(length)}
              </Button>
            ))}
          </div>
          {availabilityMessage && (
            <p className="mt-3 rounded-lg border border-amber-300 bg-amber-100 px-3 py-2 text-sm font-black text-amber-950">
              {availabilityMessage}
            </p>
          )}
        </div>
      </CardPanel>

      <aside className="rounded-xl border-2 border-amber-800/20 bg-amber-50/95 p-3 shadow-[0_6px_0_rgba(120,53,15,0.1)] lg:self-start">
        <div>
          <p className="text-xs font-extrabold uppercase text-amber-700">
            Selected deck
          </p>
          <h3 className="mt-1 text-xl font-black text-amber-950">
            {deck.name}
          </h3>
          <p className="mt-1 line-clamp-3 text-sm font-bold leading-5 text-amber-950/65">
            {deck.description}
          </p>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-amber-900/10 bg-white/70 p-2">
            <p className="text-[10px] font-black uppercase text-amber-800/65">
              Cards
            </p>
            <p className="text-lg font-black text-amber-950">
              {deck.cards.length}
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2">
            <p className="text-[10px] font-black uppercase text-emerald-800/65">
              Mastered
            </p>
            <p className="text-lg font-black text-emerald-950">
              {deckMasterySummary.masteredWords}
            </p>
          </div>
          <div className="rounded-lg border border-violet-200 bg-violet-50 p-2">
            <p className="text-[10px] font-black uppercase text-violet-800/65">
              Average
            </p>
            <p className="text-lg font-black text-violet-950">
              {deckMasterySummary.averageMastery}
            </p>
          </div>
        </div>
        <details className="mt-3 rounded-lg border border-amber-900/15 bg-white/70 p-3">
          <summary className="cursor-pointer font-black text-amber-950">
            Deck mastery
          </summary>
          <div className="mt-3">
            <p className="font-black text-amber-950">Mastery Progress</p>
            <div className="mt-3">
              <ProgressBar
                value={deckMasterySummary.progressPercent}
                max={100}
                label={`${deck.name} mastery`}
              />
            </div>
            <p className="mt-2 text-sm font-bold text-amber-900/75">
              {deckMasterySummary.progressPercent}% complete
            </p>
          </div>
        </details>
      </aside>
    </div>
  );
}

function TrainingSession({
  currentMastery,
  currentQuestion,
  deck,
  isAnswered,
  isLastQuestion,
  masteryAfterCorrectAnswer,
  masteryBeforeAnswer,
  onAnswer,
  onChangeMode,
  onNext,
  questionIndex,
  questionsLength,
  result,
  selectedCardId,
  stats,
  trainingMode,
}: {
  currentMastery: number;
  currentQuestion: TrainingQuestion;
  deck: VocabularyDeck;
  isAnswered: boolean;
  isLastQuestion: boolean;
  masteryAfterCorrectAnswer: number;
  masteryBeforeAnswer: number | null;
  onAnswer: (choice: WordCard) => void;
  onChangeMode: () => void;
  onNext: () => void;
  questionIndex: number;
  questionsLength: number;
  result: AnswerResult | null;
  selectedCardId: string | null;
  stats: SessionStats;
  trainingMode: TrainingMode;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
      <CardPanel className="border-sky-800/25 bg-gradient-to-br from-sky-100 via-amber-50 to-emerald-100 p-3 sm:p-4">
        <div className="flex flex-col gap-3 rounded-xl border border-sky-900/10 bg-white/65 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="purple">
              {formatQuestionType(currentQuestion.questionType)}
            </Badge>
            <span className="text-sm font-black text-amber-950">
              {deck.name} · {formatTrainingMode(trainingMode)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm font-black text-amber-950">
            <Badge>Q {questionIndex + 1} / {questionsLength}</Badge>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-900">
              {stats.correct} correct
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border-2 border-sky-900/20 bg-gradient-to-br from-white via-amber-50 to-sky-100 p-4 shadow-inner sm:p-5">
          <p className="text-sm font-extrabold uppercase text-sky-800">
            {formatQuestionType(currentQuestion.questionType)}
          </p>
          {currentQuestion.questionType === "thai-to-english" ? (
            <div className="mt-4">
              <p className="text-4xl font-black text-amber-950">
                {currentQuestion.card.meaningTh}
              </p>
              <p className="mt-2 text-sm font-medium text-amber-950/70">
                Choose the English word that matches this Thai meaning.
              </p>
            </div>
          ) : currentQuestion.questionType === "sentence-cloze" ? (
            <div className="mt-4">
              <p className="text-3xl font-black leading-tight text-amber-950">
                {blankTargetWord(
                  currentQuestion.card.exampleSentence,
                  currentQuestion.card.word,
                )}
              </p>
              <p className="mt-3 text-sm font-medium text-amber-950/70">
                Choose the English word that completes the sentence.
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-5xl font-black capitalize text-amber-950">
                {currentQuestion.card.word}
              </p>
              <p className="mt-2 text-sm font-medium text-amber-950/70">
                Select the matching Thai meaning.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {currentQuestion.choices.map((choice) => {
            const isSelected = selectedCardId === choice.id;
            const isCorrectChoice = choice.id === currentQuestion.card.id;
            const showCorrect = isAnswered && isCorrectChoice;
            const showWrong = isAnswered && isSelected && !isCorrectChoice;
            const showEnglishChoice =
              currentQuestion.questionType === "thai-to-english" ||
              currentQuestion.questionType === "sentence-cloze";

            return (
              <button
                key={choice.id}
                type="button"
                disabled={isAnswered}
                onClick={() => onAnswer(choice)}
                className={`min-h-20 rounded-xl border-2 p-3 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                  showCorrect
                    ? "reward-pulse border-emerald-500 bg-emerald-100 ring-1 ring-emerald-200"
                    : showWrong
                      ? "damage-shake border-red-400 bg-red-100 ring-1 ring-red-200"
                      : "border-amber-900/15 bg-white hover:-translate-y-0.5 hover:border-amber-500 hover:shadow-md active:translate-y-0.5"
                } ${isAnswered ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">
                      {showEnglishChoice ? choice.word : choice.meaningTh}
                    </p>
                    <p className="mt-1 text-sm capitalize text-slate-500">
                      {showEnglishChoice ? choice.partOfSpeech : choice.word}
                    </p>
                  </div>
                  {showCorrect && <Badge tone="emerald">Correct</Badge>}
                  {showWrong && <Badge tone="red">Wrong</Badge>}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border-2 border-amber-900/15 bg-amber-50/90 p-3 shadow-inner">
          {result ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p
                  className={`text-lg font-black ${
                    result === "correct" ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  {result === "correct" ? "Correct" : "Wrong"}
                </p>
                <p className="mt-1 text-slate-700">
                  Correct answer:{" "}
                  <span className="font-semibold text-slate-950">
                    {currentQuestion.questionType === "english-to-thai"
                      ? currentQuestion.card.meaningTh
                      : currentQuestion.card.word}
                  </span>
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                  {currentQuestion.card.exampleSentence}
                </p>
                {result === "correct" && masteryBeforeAnswer !== null && (
                  <div className="mastery-pulse mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                    <p className="text-sm font-black text-emerald-900">
                      {masteryAfterCorrectAnswer > masteryBeforeAnswer
                        ? "Mastery increased"
                        : "Already mastered"}
                    </p>
                    <p className="text-sm font-semibold text-emerald-800">
                      {masteryBeforeAnswer} / {MAX_WORD_MASTERY} →{" "}
                      {masteryAfterCorrectAnswer} / {MAX_WORD_MASTERY}
                    </p>
                    {masteryAfterCorrectAnswer === MAX_WORD_MASTERY && (
                      <Badge tone="emerald">Mastered!</Badge>
                    )}
                  </div>
                )}
              </div>
              <Button type="button" onClick={onNext} className="shrink-0">
                {isLastQuestion ? "Finish Training" : "Next"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-semibold text-slate-950">
                Choose the best answer. Training is untimed.
              </p>
              <Button type="button" onClick={onChangeMode} variant="ghost">
                Change Mode
              </Button>
            </div>
          )}
        </div>
      </CardPanel>

      <aside className="rounded-xl border-2 border-amber-800/20 bg-amber-50/95 p-3 shadow-[0_6px_0_rgba(120,53,15,0.1)] lg:self-start">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-extrabold uppercase text-amber-700">
            Session
          </p>
          <Badge tone="sky">Untimed</Badge>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-amber-900/10 bg-white/70 p-2">
            <p className="text-[10px] font-black uppercase text-amber-800/65">
              Q
            </p>
            <p className="text-lg font-black text-amber-950">
              {questionIndex + 1}/{questionsLength}
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2">
            <p className="text-[10px] font-black uppercase text-emerald-800/65">
              Right
            </p>
            <p className="text-lg font-black text-emerald-950">
              {stats.correct}
            </p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-2">
            <p className="text-[10px] font-black uppercase text-red-800/65">
              Wrong
            </p>
            <p className="text-lg font-black text-red-950">
              {stats.incorrect}
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-amber-900/15 bg-white/70 p-3">
          <p className="font-black capitalize text-amber-950">
            {currentQuestion.card.word} mastery
          </p>
          <div className="mt-2">
            <ProgressBar
              value={currentMastery}
              max={MAX_WORD_MASTERY}
              label={`${currentQuestion.card.word} mastery`}
            />
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            {currentMastery} / {MAX_WORD_MASTERY}
          </p>
        </div>

        <details className="mt-3 rounded-lg border border-amber-900/15 bg-white/70 p-3">
          <summary className="cursor-pointer font-black text-amber-950">
            Practice notes
          </summary>
          <div className="mt-2 grid gap-2 text-sm font-medium leading-5 text-amber-950/70">
            <p>Deck: {deck.name}</p>
            <p>
              Correct answers save mastery. Wrong answers do not reduce
              mastery, and active dungeon runs are untouched.
            </p>
            <div>
              <Button
                type="button"
                onClick={onChangeMode}
                variant="secondary"
                className="mt-1 w-full"
              >
                Change Mode
              </Button>
            </div>
          </div>
        </details>
      </aside>
    </div>
  );
}

function TrainingComplete({
  accuracy,
  deck,
  onBackHome,
  onChangeMode,
  onEnterDungeon,
  onReviewDeck,
  onTrainAgain,
  sessionLength,
  stats,
  trainingMode,
}: {
  accuracy: number;
  deck: VocabularyDeck;
  onBackHome: () => void;
  onChangeMode: () => void;
  onEnterDungeon: () => void;
  onReviewDeck: () => void;
  onTrainAgain: () => void;
  sessionLength: number;
  stats: SessionStats;
  trainingMode: TrainingMode;
}) {
  return (
    <CardPanel className="border-emerald-800/25 bg-gradient-to-br from-emerald-100 via-amber-50 to-sky-50 p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="emerald">Training Complete</Badge>
            <Badge tone="purple">{deck.name}</Badge>
          </div>
          <h3 className="mt-3 text-3xl font-black text-amber-950">
            Practice complete
          </h3>
          <p className="mt-2 max-w-2xl text-sm font-bold leading-5 text-amber-900/75">
            {stats.correct} correct out of {sessionLength}. Permanent mastery
            stayed safe and Dungeon run state was untouched.
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-white/75 px-3 py-2 text-sm font-black text-emerald-950">
          Accuracy {accuracy}%
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-xs font-black uppercase text-emerald-800/70">
            Correct
          </p>
          <p className="mt-1 text-2xl font-black text-emerald-950">
            {stats.correct} / {sessionLength}
          </p>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-3">
          <p className="text-xs font-black uppercase text-violet-800/70">
            Mastery gains
          </p>
          <p className="mt-1 text-2xl font-black text-violet-950">
            {stats.masteryIncreases}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-black uppercase text-amber-800/70">
            Mode
          </p>
          <p className="mt-1 text-lg font-black text-amber-950">
            {formatTrainingMode(trainingMode)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <Button type="button" onClick={onTrainAgain}>
          Train Again
        </Button>
        <Button type="button" onClick={onChangeMode} variant="secondary">
          Change Training Mode
        </Button>
        <Button type="button" onClick={onReviewDeck} variant="secondary">
          Review Deck
        </Button>
        <Button type="button" onClick={onEnterDungeon}>
          Enter Dungeon
        </Button>
        <Button type="button" onClick={onBackHome} variant="ghost">
          Back Home
        </Button>
      </div>

      <details className="mt-4 rounded-xl border-2 border-emerald-200 bg-white/70 p-3">
        <summary className="cursor-pointer font-black text-emerald-950">
          Session details
        </summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Answered"
            value={`${stats.correct + stats.incorrect} / ${sessionLength}`}
            tone="sky"
          />
          <StatCard label="Correct" value={stats.correct} tone="emerald" />
          <StatCard label="Wrong" value={stats.incorrect} tone="red" />
          <StatCard label="Accuracy" value={`${accuracy}%`} tone="amber" />
          <StatCard
            label="Improved"
            value={stats.masteryIncreases}
            helper="Mastery increases"
            tone="purple"
          />
        </div>
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <p className="font-black text-emerald-950">Newly mastered words</p>
          {stats.newlyMasteredWords.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {stats.newlyMasteredWords.map((word) => (
                <Badge key={word} tone="emerald">
                  {word}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm font-bold text-emerald-900/75">
              No new 5 / 5 words this session. Keep practicing.
            </p>
          )}
        </div>
      </details>
    </CardPanel>
  );
}
