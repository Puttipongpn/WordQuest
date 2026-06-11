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
import type { VocabularyDeck, WordCard, WordMasteryByCardId } from "../types";

type AnswerResult = "correct" | "wrong";
type TrainingQuestionType =
  | "english-to-thai"
  | "thai-to-english"
  | "sentence-cloze";

type TrainingQuestion = {
  card: WordCard;
  questionType: TrainingQuestionType;
  choices: WordCard[];
};

const trainingQuestionTypes: TrainingQuestionType[] = [
  "thai-to-english",
  "sentence-cloze",
  "english-to-thai",
];

type TrainingProps = {
  deck: VocabularyDeck;
  wordMastery: WordMasteryByCardId;
  onIncreaseWordMastery: (cardId: string) => void;
};

function buildChoices(card: WordCard, cardIndex: number, deck: VocabularyDeck) {
  const distractors = deck.cards
    .filter((candidate) => candidate.id !== card.id)
    .slice(cardIndex, cardIndex + 3);

  if (distractors.length < 3) {
    const fallbackChoices = deck.cards.filter(
      (candidate) =>
        candidate.id !== card.id &&
        !distractors.some((distractor) => distractor.id === candidate.id),
    );

    distractors.push(...fallbackChoices.slice(0, 3 - distractors.length));
  }

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

function blankTargetWord(sentence: string, word: string) {
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const wordPattern = new RegExp(`\\b${escapedWord}\\b`, "i");

  if (wordPattern.test(sentence)) {
    return sentence.replace(wordPattern, "____");
  }

  return `${sentence} (____ = ${word.length} letters)`;
}

function buildQuestions(deck: VocabularyDeck) {
  const trainingCards = deck.cards.slice(0, 10);

  return trainingCards.map((card, index): TrainingQuestion => {
    return {
      card,
      questionType: chooseTrainingQuestionType(index),
      choices: buildChoices(card, index + 1, deck),
    };
  });
}

export function Training({
  deck,
  wordMastery,
  onIncreaseWordMastery,
}: TrainingProps) {
  const questions = useMemo(() => buildQuestions(deck), [deck]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [masteryBeforeAnswer, setMasteryBeforeAnswer] = useState<number | null>(
    null,
  );

  const currentQuestion = questions[questionIndex];
  const isAnswered = result !== null;
  const isLastQuestion = questionIndex === questions.length - 1;
  const currentMastery = wordMastery[currentQuestion.card.id] ?? 0;
  const masteryAfterCorrectAnswer =
    masteryBeforeAnswer === null
      ? currentMastery
      : Math.min(masteryBeforeAnswer + 1, MAX_WORD_MASTERY);

  useEffect(() => {
    setQuestionIndex(0);
    setSelectedCardId(null);
    setResult(null);
    setMasteryBeforeAnswer(null);
    setCorrectCount(0);
    setIncorrectCount(0);
  }, [deck.id]);

  function handleAnswer(choice: WordCard) {
    if (isAnswered) {
      return;
    }

    const isCorrect = choice.id === currentQuestion.card.id;

    setMasteryBeforeAnswer(currentMastery);
    setSelectedCardId(choice.id);
    setResult(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      setCorrectCount((current) => current + 1);
      onIncreaseWordMastery(currentQuestion.card.id);
    } else {
      setIncorrectCount((current) => current + 1);
    }
  }

  function handleNext() {
    setSelectedCardId(null);
    setResult(null);
    setMasteryBeforeAnswer(null);

    if (isLastQuestion) {
      setQuestionIndex(0);
      setCorrectCount(0);
      setIncorrectCount(0);
      return;
    }

    setQuestionIndex((current) => current + 1);
  }

  return (
    <ScreenShell
      eyebrow="Practice"
      title="Training"
      description="Practice outside dungeon runs. Training is untimed, and correct answers save word mastery only."
      framed={false}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <CardPanel className="border-sky-800/25 bg-gradient-to-br from-sky-50 via-amber-50 to-emerald-50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Badge tone="emerald">Recall Training</Badge>
              <Badge tone="sky" className="ml-2">Untimed</Badge>
              <h3 className="mt-1 text-2xl font-black text-amber-950">
                Build recall with meaning and context
              </h3>
              <p className="mt-2 max-w-2xl text-sm font-medium text-amber-950/75">
                Training saves word mastery only. It does not change HP, gold,
                shield, dungeon progress, shop state, or current run progress.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="purple">
                {formatQuestionType(currentQuestion.questionType)}
              </Badge>
              <Badge>Question {questionIndex + 1} / {questions.length}</Badge>
            </div>
          </div>

          <div className="mt-6 rounded-xl border-2 border-sky-900/20 bg-gradient-to-br from-white to-sky-100 p-5 shadow-inner">
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

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
                  onClick={() => handleAnswer(choice)}
                  className={`min-h-24 rounded-xl border-2 p-4 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    showCorrect
                      ? "border-emerald-500 bg-emerald-100 ring-1 ring-emerald-200"
                      : showWrong
                        ? "border-red-400 bg-red-100 ring-1 ring-red-200"
                        : "border-amber-900/15 bg-white hover:-translate-y-0.5 hover:border-amber-500 hover:shadow-md"
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

          <div className="mt-5 min-h-28 rounded-xl border-2 border-amber-900/15 bg-amber-50/90 p-4 shadow-inner">
            {result ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p
                    className={`text-lg font-bold ${
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
                  <p className="mt-1 text-sm text-slate-500">
                    {currentQuestion.card.exampleSentence}
                  </p>
                  {result === "correct" && masteryBeforeAnswer !== null && (
                    <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                      <p className="text-sm font-black text-emerald-900">
                        {masteryAfterCorrectAnswer > masteryBeforeAnswer
                          ? "Mastery increased"
                          : "Mastery already at max"}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-emerald-800">
                        {masteryBeforeAnswer} / {MAX_WORD_MASTERY} →{" "}
                        {masteryAfterCorrectAnswer} / {MAX_WORD_MASTERY}
                      </p>
                      {masteryAfterCorrectAnswer === MAX_WORD_MASTERY && (
                        <Badge tone="emerald" className="mt-2">
                          Mastered!
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleNext}
                >
                  {isLastQuestion ? "Restart" : "Next"}
                </Button>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-slate-950">
                  Select one answer to check it.
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Feedback and the correct answer appear after your selection.
                </p>
              </div>
            )}
          </div>
        </CardPanel>

        <aside className="rounded-xl border-2 border-amber-800/25 bg-amber-50/95 p-5 shadow-[0_10px_0_rgba(120,53,15,0.14)] lg:self-start">
          <p className="text-sm font-extrabold uppercase text-amber-700">
            Training Room
          </p>
          <div className="mt-4 grid gap-3">
            <StatCard
              label="Current question"
              value={`${questionIndex + 1} / ${questions.length}`}
            />
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Correct" value={correctCount} tone="emerald" />
              <StatCard label="Incorrect" value={incorrectCount} tone="red" />
            </div>
            <div className="rounded-lg border border-amber-900/15 bg-white/70 p-4">
              <p className="font-black text-amber-950">
                Deck: {deck.name}
              </p>
              <p className="mt-1 text-sm font-medium text-amber-950/70">
                Using {questions.length} of {deck.cards.length} cards for
                this first training prototype.
              </p>
            </div>
            <div className="rounded-lg border border-amber-900/15 bg-white/70 p-4">
              <p className="font-black capitalize text-amber-950">
                {currentQuestion.card.word} mastery
              </p>
              <div className="mt-3">
                <ProgressBar
                  value={currentMastery}
                  max={MAX_WORD_MASTERY}
                  label={`${currentQuestion.card.word} mastery`}
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                {currentMastery} / {MAX_WORD_MASTERY}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </ScreenShell>
  );
}
