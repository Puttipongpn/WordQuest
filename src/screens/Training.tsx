import { useMemo, useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
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
    <ScreenShell eyebrow="Practice" title="Training" framed={false}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Word Choice Training
              </p>
              <h3 className="mt-1 text-2xl font-bold text-slate-950">
                Choose the correct Thai meaning
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Training updates in-memory word mastery only. It does not
                change HP, gold, shield, dungeon progress, shop state, or saved
                progress.
              </p>
            </div>
            <div className="rounded-md bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800">
              Question {questionIndex + 1} / {questions.length}
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Prompt
            </p>
            {currentQuestion.promptType === "image" ? (
              <div className="mt-4 flex items-center gap-4">
                <span className="grid size-20 place-items-center rounded-md bg-white text-5xl shadow-sm">
                  {currentQuestion.card.imagePlaceholder}
                </span>
                <div>
                  <p className="font-semibold text-slate-950">
                    What does this picture represent?
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Select the matching Thai meaning.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-5xl font-bold capitalize text-slate-950">
                  {currentQuestion.card.word}
                </p>
                <p className="mt-2 text-sm text-slate-600">
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
                  className={`min-h-20 rounded-lg border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    showCorrect
                      ? "border-emerald-500 bg-emerald-50"
                      : showWrong
                        ? "border-red-400 bg-red-50"
                        : "border-slate-200 bg-white hover:border-emerald-500 hover:shadow-sm"
                  } ${isAnswered ? "cursor-default" : "cursor-pointer"}`}
                >
                  <p className="text-lg font-semibold text-slate-950">
                    {choice.meaningTh}
                  </p>
                  <p className="mt-1 text-sm capitalize text-slate-500">
                    {choice.partOfSpeech}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-5 min-h-28 rounded-lg border border-slate-200 bg-white p-4">
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
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
                >
                  {isLastQuestion ? "Restart" : "Next"}
                </button>
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
        </section>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Training Progress
          </p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-md bg-slate-100 p-4">
              <p className="text-2xl font-bold text-slate-950">
                {questionIndex + 1} / {questions.length}
              </p>
              <p className="text-sm text-slate-600">Current question</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-emerald-50 p-4">
                <p className="text-2xl font-bold text-emerald-800">
                  {correctCount}
                </p>
                <p className="text-sm text-slate-600">Correct</p>
              </div>
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-2xl font-bold text-red-700">
                  {incorrectCount}
                </p>
                <p className="text-sm text-slate-600">Incorrect</p>
              </div>
            </div>
            <div className="rounded-md border border-slate-200 p-4">
              <p className="font-semibold text-slate-950">
                Deck: {starterDeck.name}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Using {questions.length} of {starterDeck.cards.length} cards for
                this first training prototype.
              </p>
            </div>
            <div className="rounded-md border border-slate-200 p-4">
              <p className="font-semibold capitalize text-slate-950">
                {currentQuestion.card.word} mastery
              </p>
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{
                    width: `${(currentMastery / masteryTarget) * 100}%`,
                  }}
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
