import { useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import { starterDeck } from "../data";
import type {
  CardEffect,
  DifficultyLevel,
  WordCard,
  WordMasteryByCardId,
} from "../types";

const masteryTarget = 5;

type DeckReviewProps = {
  wordMastery: WordMasteryByCardId;
};

const difficultyLabels: Record<DifficultyLevel, string> = {
  1: "Easy",
  2: "Medium",
  3: "Hard",
};

function formatDifficulty(difficulty: DifficultyLevel) {
  return `${difficulty} - ${difficultyLabels[difficulty]}`;
}

function formatEffect(effect: CardEffect) {
  if (effect.type === "element") {
    return `${effect.description} (${effect.element}, ${effect.amount})`;
  }

  return `${effect.description} (${effect.type}, ${effect.amount})`;
}

export function DeckReview({ wordMastery }: DeckReviewProps) {
  const [selectedCard, setSelectedCard] = useState<WordCard>(
    starterDeck.cards[0],
  );

  const selectedMastery = wordMastery[selectedCard.id] ?? 0;
  const totalMastery = starterDeck.cards.reduce(
    (sum, card) => sum + (wordMastery[card.id] ?? 0),
    0,
  );
  const totalMasteryTarget = starterDeck.cards.length * masteryTarget;

  return (
    <ScreenShell eyebrow="Cards" title="Deck Review" framed={false}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <div className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-950">
                  {starterDeck.name}
                </h3>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  {starterDeck.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-64">
                <div className="rounded-md bg-slate-100 p-3">
                  <p className="font-semibold text-slate-950">
                    {starterDeck.cards.length}
                  </p>
                  <p className="text-slate-600">Total cards</p>
                </div>
                <div className="rounded-md bg-emerald-50 p-3">
                  <p className="font-semibold text-emerald-800">
                    {totalMastery} / {totalMasteryTarget}
                  </p>
                  <p className="text-slate-600">Mastery</p>
                </div>
              </div>
            </div>
          </section>

          <section
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
            aria-label={`${starterDeck.name} cards`}
          >
            {starterDeck.cards.map((card) => {
              const isSelected = selectedCard.id === card.id;
              const cardMastery = wordMastery[card.id] ?? 0;
              const masteryPercent = (cardMastery / masteryTarget) * 100;

              return (
                <button
                  key={card.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCard(card)}
                  className={`min-h-44 rounded-lg border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isSelected
                      ? "border-emerald-600 ring-2 ring-emerald-100"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-14 place-items-center rounded-md bg-slate-100 text-3xl">
                      {card.imagePlaceholder}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {formatDifficulty(card.difficulty)}
                    </span>
                  </div>
                  <div className="mt-5">
                    <p className="text-xl font-bold capitalize text-slate-950">
                      {card.word}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Base attack {card.baseAttack}
                    </p>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${masteryPercent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    Mastery {cardMastery} / {masteryTarget}
                  </p>
                </button>
              );
            })}
          </section>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6 lg:self-start">
          <div className="flex items-start gap-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-md bg-slate-100 text-4xl">
              {selectedCard.imagePlaceholder}
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Card Detail
              </p>
              <h3 className="text-3xl font-bold capitalize text-slate-950">
                {selectedCard.word}
              </h3>
            </div>
          </div>

          <dl className="mt-6 grid gap-4">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Thai meaning
              </dt>
              <dd className="mt-1 text-lg font-semibold text-slate-950">
                {selectedCard.meaningTh}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Part of speech
              </dt>
              <dd className="mt-1 capitalize text-slate-800">
                {selectedCard.partOfSpeech}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Example sentence
              </dt>
              <dd className="mt-1 text-slate-800">
                {selectedCard.exampleSentence}
              </dd>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-slate-100 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Difficulty
                </dt>
                <dd className="mt-1 font-semibold text-slate-950">
                  {formatDifficulty(selectedCard.difficulty)}
                </dd>
              </div>
              <div className="rounded-md bg-slate-100 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Base attack
                </dt>
                <dd className="mt-1 font-semibold text-slate-950">
                  {selectedCard.baseAttack}
                </dd>
              </div>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Effects
              </dt>
              <dd className="mt-2">
                {selectedCard.effects && selectedCard.effects.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedCard.effects.map((effect) => (
                      <li
                        key={`${effect.type}-${effect.description}`}
                        className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                      >
                        {formatEffect(effect)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    No effect
                  </p>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Mastery
              </dt>
              <dd className="mt-2">
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{
                      width: `${(selectedMastery / masteryTarget) * 100}%`,
                    }}
                  />
                </div>
                <p className="mt-2 font-semibold text-slate-950">
                  {selectedMastery} / {masteryTarget}
                </p>
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </ScreenShell>
  );
}
