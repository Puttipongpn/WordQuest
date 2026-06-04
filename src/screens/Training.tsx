import { useMemo, useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import {
  Badge,
  Button,
  CardPanel,
  ProgressBar,
  StatCard,
} from "../components/ui";
import { starterDeck } from "../data";
import type { WordCard, WordMasteryByCardId } from "../types";

type AnswerResult = "correct" | "wrong";

type TrainingQuestion = {
  card: WordCard;
  promptType: "image" | "word";
  choices: WordCard[];
};

const trainingCards = starterDeck.cards.slice(0, 10);
const masteryTarget = 5;

type TrainingProps = {
  wordMastery: WordMasteryByCardId;
  onIncreaseWordMastery: (cardId: string) => void;
};

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
    left.word.localeCompare(right.word),
  );
}

function buildQuestions() {
  return trainingCards.map((card, index): TrainingQuestion => {
    return {
      card,
      promptType: index % 2 === 0 ? "image" : "word",
      choices: buildChoices(card, index + 1),
    };
  });
}

export function Training({
  wordMastery,
  onIncreaseWordMastery,
}: TrainingProps) {
  const questions = useMemo(() => buildQuestions(), []);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const currentQuestion = questions[questionIndex];
  const isAnswered = result !== null;
  const isLastQuestion = questionIndex === questions.length - 1;
  const currentMastery = wordMastery[currentQuestion.card.id] ?? 0;

  function handleAnswer(choice: WordCard) {
    if (isAnswered) {
      return;
    }

    const isCorrect = choice.id === currentQuestion.card.id;

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
      description="Practice outside dungeon runs. Correct answers save word mastery only."
      framed={false}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <CardPanel className="border-sky-800/25 bg-gradient-to-br from-sky-50 via-amber-50 to-emerald-50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Badge tone="emerald">Word Choice Training</Badge>
              <h3 className="mt-1 text-2xl font-black text-amber-950">
                Choose the correct Thai meaning
              </h3>
              <p className="mt-2 max-w-2xl text-sm font-medium text-amber-950/75">
                Training saves word mastery only. It does not change HP, gold,
                shield, dungeon progress, shop state, or current run progress.
              </p>
            </div>
            <Badge>Question {questionIndex + 1} / {questions.length}</Badge>
          </div>

          <div className="mt-6 rounded-xl border-2 border-sky-900/20 bg-gradient-to-br from-white to-sky-100 p-5 shadow-inner">
            <p className="text-sm font-extrabold uppercase text-sky-800">
              Practice Prompt
            </p>
            {currentQuestion.promptType === "image" ? (
              <div className="mt-4 flex items-center gap-4">
                <span className="grid size-24 place-items-center rounded-xl border border-sky-900/15 bg-white text-6xl shadow-inner">
                  {currentQuestion.card.imagePlaceholder}
                </span>
                <div>
                  <p className="text-lg font-black text-amber-950">
                    What does this picture represent?
                  </p>
                  <p className="mt-1 text-sm font-medium text-amber-950/70">
                    Select the matching Thai meaning.
                  </p>
                </div>
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
                      {currentQuestion.card.meaningTh}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {currentQuestion.card.exampleSentence}
                  </p>
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
                Deck: {starterDeck.name}
              </p>
              <p className="mt-1 text-sm font-medium text-amber-950/70">
                Using {questions.length} of {starterDeck.cards.length} cards for
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
                  max={masteryTarget}
                  label={`${currentQuestion.card.word} mastery`}
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                {currentMastery} / {masteryTarget}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </ScreenShell>
  );
}
