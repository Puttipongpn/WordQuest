import { useEffect, useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import { Badge, CardPanel, ProgressBar, StatCard } from "../components/ui";
import type {
  CardEffect,
  DifficultyLevel,
  VocabularyDeck,
  WordCard,
  WordMasteryByCardId,
} from "../types";

const masteryTarget = 5;

type DeckReviewProps = {
  completedDeckIds: string[];
  deck: VocabularyDeck;
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

export function DeckReview({
  completedDeckIds,
  deck,
  wordMastery,
}: DeckReviewProps) {
  const [selectedCard, setSelectedCard] = useState<WordCard>(deck.cards[0]);
  const isDeckCompleted = completedDeckIds.includes(deck.id);

  useEffect(() => {
    setSelectedCard((currentCard) =>
      deck.cards.some((card) => card.id === currentCard.id)
        ? currentCard
        : deck.cards[0],
    );
  }, [deck]);

  const selectedMastery = wordMastery[selectedCard.id] ?? 0;
  const totalMastery = deck.cards.reduce(
    (sum, card) => sum + (wordMastery[card.id] ?? 0),
    0,
  );
  const totalMasteryTarget = deck.cards.length * masteryTarget;

  return (
    <ScreenShell
      eyebrow="Cards"
      title="Deck Review"
      description={`Scan ${deck.name}, inspect card effects, and track saved mastery.`}
      framed={false}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <div className="space-y-5">
          <CardPanel className="border-amber-700/30 bg-gradient-to-br from-amber-100 to-stone-50">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-black text-amber-950">
                    {deck.name}
                  </h3>
                  <Badge tone={isDeckCompleted ? "emerald" : "sky"}>
                    {isDeckCompleted ? "Completed" : "In Progress"}
                  </Badge>
                </div>
                <p className="mt-2 max-w-2xl text-sm font-medium text-amber-950/75">
                  {deck.description}
                </p>
                <p className="mt-2 text-sm font-bold text-amber-900">
                  {isDeckCompleted
                    ? `${deck.name} completed. Permanent progress saved.`
                    : "Defeat the boss in Dungeon to mark this deck completed."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-64">
                <StatCard label="Total cards" value={deck.cards.length} />
                <StatCard
                  label="Mastery"
                  value={`${totalMastery} / ${totalMasteryTarget}`}
                  tone="emerald"
                />
                <StatCard
                  label="Deck Status"
                  value={isDeckCompleted ? "Complete" : "Open"}
                  helper="Saved progress"
                  tone={isDeckCompleted ? "emerald" : "sky"}
                />
              </div>
            </div>
          </CardPanel>

          <section
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
            aria-label={`${deck.name} cards`}
          >
            {deck.cards.map((card) => {
              const isSelected = selectedCard.id === card.id;
              const cardMastery = wordMastery[card.id] ?? 0;

              return (
                <button
                  key={card.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCard(card)}
                  className={`min-h-52 rounded-xl border-2 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-4 text-left shadow-[0_8px_0_rgba(120,53,15,0.14)] transition hover:-translate-y-1 hover:border-amber-600 hover:shadow-[0_12px_0_rgba(120,53,15,0.18)] focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    isSelected
                      ? "border-amber-700 ring-2 ring-amber-300"
                      : "border-amber-900/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-16 place-items-center rounded-lg border border-amber-900/15 bg-amber-100 text-4xl shadow-inner">
                      {card.imagePlaceholder}
                    </span>
                    <Badge
                      tone={
                        card.difficulty === 3
                          ? "red"
                          : card.difficulty === 2
                            ? "amber"
                            : "emerald"
                      }
                    >
                      {formatDifficulty(card.difficulty)}
                    </Badge>
                  </div>
                  <div className="mt-5">
                    <p className="text-2xl font-black capitalize text-amber-950">
                      {card.word}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge tone="slate">ATK {card.baseAttack}</Badge>
                      <Badge tone={card.effects?.length ? "purple" : "slate"}>
                        {card.effects?.length ?? 0} effects
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4">
                    <ProgressBar
                      value={cardMastery}
                      max={masteryTarget}
                      label={`${card.word} mastery`}
                    />
                  </div>
                  <p className="mt-2 text-xs font-extrabold uppercase text-amber-900/70">
                    Mastery {cardMastery} / {masteryTarget}
                  </p>
                </button>
              );
            })}
          </section>
        </div>

        <aside className="rounded-xl border-2 border-amber-800/30 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-[0_10px_0_rgba(120,53,15,0.16)] lg:sticky lg:top-32 lg:self-start">
          <div className="flex items-start gap-4">
            <span className="grid size-20 shrink-0 place-items-center rounded-lg border border-amber-900/20 bg-white/80 text-5xl shadow-inner">
              {selectedCard.imagePlaceholder}
            </span>
            <div>
              <p className="text-sm font-extrabold uppercase text-amber-700">
                Selected Card
              </p>
              <h3 className="text-4xl font-black capitalize text-amber-950">
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
              <StatCard
                label="Difficulty"
                value={formatDifficulty(selectedCard.difficulty)}
                tone={
                  selectedCard.difficulty === 3
                    ? "red"
                    : selectedCard.difficulty === 2
                      ? "amber"
                      : "emerald"
                }
              />
              <StatCard label="Base attack" value={selectedCard.baseAttack} />
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
                        className="rounded-md border border-amber-900/15 bg-amber-100/70 px-3 py-2 text-sm font-medium text-amber-950"
                      >
                        {formatEffect(effect)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-md border border-amber-900/15 bg-amber-100/70 px-3 py-2 text-sm font-medium text-amber-950/70">
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
                <ProgressBar
                  value={selectedMastery}
                  max={masteryTarget}
                  label={`${selectedCard.word} mastery`}
                />
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
