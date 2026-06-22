import { useEffect, useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import { Badge, Button, CardPanel, ProgressBar, StatCard } from "../components/ui";
import { getMasteryDamageBonus } from "../game/mastery";
import type {
  CardEffect,
  DifficultyLevel,
  ScreenName,
  VocabularyDeck,
  WordCard,
  WordMasteryByCardId,
} from "../types";

const masteryTarget = 5;

type DeckFilter =
  | "all"
  | "weak"
  | "unmastered"
  | "mastered"
  | "attack-high"
  | "has-effect";

type DeckSort =
  | "default"
  | "mastery-asc"
  | "mastery-desc"
  | "difficulty-asc"
  | "difficulty-desc"
  | "attack-desc"
  | "alphabetical";

type DeckReviewProps = {
  completedDeckIds: string[];
  deck: VocabularyDeck;
  onNavigate: (screen: ScreenName) => void;
  unlockedDeckIds: string[];
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

function getEffectSummary(card: WordCard) {
  if (!card.effects?.length) {
    return "No effect";
  }

  return card.effects
    .map((effect) => {
      if (effect.type === "element") {
        return `Element ${effect.element}`;
      }

      if (effect.type === "shield") {
        return `Shield +${effect.amount}`;
      }

      return `${effect.type} +${effect.amount}`;
    })
    .join(", ");
}

function getMasteryGuidance(mastery: number) {
  if (mastery <= 0) {
    return "New word. Practice this before dungeon.";
  }

  if (mastery <= 2) {
    return "Still weak. Training recommended.";
  }

  if (mastery <= 4) {
    return "Getting stronger.";
  }

  return "Mastered. Grants the highest mastery bonus.";
}

function getEmptyFilterCopy(filter: DeckFilter) {
  if (filter === "weak") {
    return "No weak words found. Try Review All or enter the dungeon.";
  }

  if (filter === "mastered") {
    return "No mastered words yet. Training can help.";
  }

  if (filter === "has-effect") {
    return "No cards with effects yet.";
  }

  if (filter === "attack-high") {
    return "No high-attack cards found for this deck.";
  }

  return "No cards match this view.";
}

const deckFilters: { id: DeckFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "weak", label: "Weak" },
  { id: "unmastered", label: "Unmastered" },
  { id: "mastered", label: "Mastered" },
  { id: "attack-high", label: "Attack High" },
  { id: "has-effect", label: "Has Effect" },
];

const deckSorts: { id: DeckSort; label: string }[] = [
  { id: "default", label: "Default deck order" },
  { id: "mastery-asc", label: "Mastery low to high" },
  { id: "mastery-desc", label: "Mastery high to low" },
  { id: "difficulty-asc", label: "Difficulty low to high" },
  { id: "difficulty-desc", label: "Difficulty high to low" },
  { id: "attack-desc", label: "Attack high to low" },
  { id: "alphabetical", label: "Alphabetical" },
];

export function DeckReview({
  completedDeckIds,
  deck,
  onNavigate,
  unlockedDeckIds,
  wordMastery,
}: DeckReviewProps) {
  const [selectedCard, setSelectedCard] = useState<WordCard>(deck.cards[0]);
  const [activeFilter, setActiveFilter] = useState<DeckFilter>("all");
  const [activeSort, setActiveSort] = useState<DeckSort>("default");
  const isDeckCompleted = completedDeckIds.includes(deck.id);
  const isDeckUnlocked = unlockedDeckIds.includes(deck.id);

  useEffect(() => {
    setSelectedCard((currentCard) =>
      deck.cards.some((card) => card.id === currentCard.id)
        ? currentCard
        : deck.cards[0],
    );
  }, [deck]);

  const selectedMastery = wordMastery[selectedCard.id] ?? 0;
  const selectedMasteryBonus = getMasteryDamageBonus(selectedMastery);
  const totalMastery = deck.cards.reduce(
    (sum, card) => sum + (wordMastery[card.id] ?? 0),
    0,
  );
  const totalMasteryTarget = deck.cards.length * masteryTarget;
  const masteredCards = deck.cards.filter(
    (card) => (wordMastery[card.id] ?? 0) >= masteryTarget,
  ).length;
  const weakCards = deck.cards.filter(
    (card) => (wordMastery[card.id] ?? 0) <= 2,
  ).length;
  const averageMastery =
    deck.cards.length > 0 ? totalMastery / deck.cards.length : 0;
  const averageAttack =
    deck.cards.length > 0
      ? deck.cards.reduce((sum, card) => sum + card.baseAttack, 0) /
        deck.cards.length
      : 0;
  const deckStatus = isDeckCompleted
    ? "Completed"
    : isDeckUnlocked
      ? "Unlocked"
      : "Locked";
  const readinessCopy = isDeckCompleted
    ? "Deck completed. You can replay it or try the next deck."
    : averageMastery < 2
      ? "Training first may help because mastery adds Dungeon damage."
      : masteredCards >= Math.ceil(deck.cards.length / 2)
        ? "This deck looks ready for a dungeon run."
        : "Review weak words, train mastery, then enter the dungeon.";
  const filteredCards = deck.cards.filter((card) => {
    const mastery = wordMastery[card.id] ?? 0;

    if (activeFilter === "weak") {
      return mastery <= 2;
    }

    if (activeFilter === "unmastered") {
      return mastery < masteryTarget;
    }

    if (activeFilter === "mastered") {
      return mastery >= masteryTarget;
    }

    if (activeFilter === "attack-high") {
      return card.baseAttack > averageAttack;
    }

    if (activeFilter === "has-effect") {
      return (card.effects?.length ?? 0) > 0;
    }

    return true;
  });
  const visibleCards = [...filteredCards].sort((leftCard, rightCard) => {
    const leftMastery = wordMastery[leftCard.id] ?? 0;
    const rightMastery = wordMastery[rightCard.id] ?? 0;

    if (activeSort === "mastery-asc") {
      return leftMastery - rightMastery;
    }

    if (activeSort === "mastery-desc") {
      return rightMastery - leftMastery;
    }

    if (activeSort === "difficulty-asc") {
      return leftCard.difficulty - rightCard.difficulty;
    }

    if (activeSort === "difficulty-desc") {
      return rightCard.difficulty - leftCard.difficulty;
    }

    if (activeSort === "attack-desc") {
      return rightCard.baseAttack - leftCard.baseAttack;
    }

    if (activeSort === "alphabetical") {
      return leftCard.word.localeCompare(rightCard.word);
    }

    return deck.cards.indexOf(leftCard) - deck.cards.indexOf(rightCard);
  });

  return (
    <ScreenShell
      eyebrow="Spellbook"
      title="Deck Review"
      description={`Open ${deck.name}, inspect weak words, and prepare your battle cards.`}
      framed={false}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <div className="space-y-5">
          <CardPanel className="border-amber-700/30 bg-gradient-to-br from-amber-100 via-yellow-50 to-stone-50">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-black text-amber-950">
                    {deck.name}
                  </h3>
                  <Badge tone={isDeckCompleted ? "emerald" : "sky"}>
                    {deckStatus}
                  </Badge>
                </div>
                <p className="mt-2 max-w-2xl text-sm font-medium text-amber-950/75">
                  {deck.description}
                </p>
                <p className="mt-3 max-w-2xl rounded-lg border border-amber-900/15 bg-white/65 px-3 py-2 text-sm font-bold text-amber-900">
                  {readinessCopy}
                </p>
                <p className="mt-2 text-sm font-bold text-emerald-800">
                  Mastery grants small Dungeon damage bonuses when a word card
                  triggers correctly.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={() => onNavigate("training")}
                    className="px-3 py-2 text-sm"
                  >
                    Start Training
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => onNavigate("dungeon")}
                    className="px-3 py-2 text-sm"
                  >
                    Enter Dungeon
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onNavigate("home")}
                    className="px-3 py-2 text-sm"
                  >
                    Back Home
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-64">
                <StatCard label="Total cards" value={deck.cards.length} />
                <StatCard
                  label="Mastered"
                  value={`${masteredCards} / ${deck.cards.length}`}
                  tone="emerald"
                />
                <StatCard
                  label="Average"
                  value={`${averageMastery.toFixed(1)} / ${masteryTarget}`}
                  helper="Mastery"
                  tone="amber"
                />
                <StatCard
                  label="Weak words"
                  value={weakCards}
                  helper="Mastery 0-2"
                  tone={weakCards > 0 ? "red" : "emerald"}
                />
                <div className="col-span-2 rounded-lg border border-emerald-300 bg-emerald-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-extrabold text-emerald-950">
                      Deck mastery
                    </p>
                    <p className="text-sm font-black text-emerald-950">
                      {totalMastery} / {totalMasteryTarget}
                    </p>
                  </div>
                  <div className="mt-3">
                    <ProgressBar
                      value={totalMastery}
                      max={totalMasteryTarget}
                      label={`${deck.name} mastery`}
                    />
                  </div>
                </div>
                <StatCard
                  label="Deck Status"
                  value={deckStatus}
                  helper={isDeckCompleted ? "Saved complete" : "Playable"}
                  tone={isDeckCompleted ? "emerald" : "sky"}
                />
              </div>
            </div>
          </CardPanel>

          <CardPanel className="border-violet-700/20 bg-gradient-to-br from-violet-50 via-amber-50 to-emerald-50 p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black uppercase text-violet-800">
                  Spellbook Tabs
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {deckFilters.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveFilter(filter.id)}
                      className={`rounded-full border px-3 py-2 text-xs font-black uppercase transition ${
                        activeFilter === filter.id
                          ? "border-emerald-800 bg-emerald-700 text-white shadow-[0_3px_0_rgba(6,78,59,0.35)]"
                          : "border-amber-900/20 bg-white/80 text-amber-950 hover:border-emerald-700"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="text-sm font-bold text-amber-950">
                Sort
                <select
                  value={activeSort}
                  onChange={(event) =>
                    setActiveSort(event.target.value as DeckSort)
                  }
                  className="mt-2 w-full rounded-lg border-2 border-amber-900/20 bg-white px-3 py-2 font-bold text-amber-950 shadow-inner outline-none focus:border-emerald-700 xl:w-64"
                >
                  {deckSorts.map((sort) => (
                    <option key={sort.id} value={sort.id}>
                      {sort.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onNavigate("training")}
                className="px-3 py-2 text-sm"
              >
                Train Weak Words
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onNavigate("training")}
                className="px-3 py-2 text-sm"
              >
                Train Unmastered
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onNavigate("training")}
                className="px-3 py-2 text-sm"
              >
                Quick Practice
              </Button>
            </div>
          </CardPanel>

          <section
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
            aria-label={`${deck.name} cards`}
          >
            {visibleCards.length === 0 && (
              <div className="rounded-xl border-2 border-dashed border-amber-900/25 bg-amber-50/70 p-6 text-center font-bold text-amber-950 sm:col-span-2 xl:col-span-3">
                {getEmptyFilterCopy(activeFilter)}
              </div>
            )}
            {visibleCards.map((card) => {
              const isSelected = selectedCard.id === card.id;
              const cardMastery = wordMastery[card.id] ?? 0;
              const isMastered = cardMastery >= masteryTarget;

              return (
                <button
                  key={card.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCard(card)}
                  className={`min-h-48 rounded-xl border-2 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-4 text-left shadow-[0_8px_0_rgba(120,53,15,0.14)] transition hover:-translate-y-1 hover:border-amber-600 hover:shadow-[0_12px_0_rgba(120,53,15,0.18)] focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    isSelected
                      ? "selected-glow border-amber-700 ring-2 ring-amber-300"
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
                    <p className="mt-1 text-base font-extrabold text-emerald-900">
                      {card.meaningTh}
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase text-slate-500">
                      {card.partOfSpeech}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge tone="slate">ATK {card.baseAttack}</Badge>
                      <Badge tone={card.effects?.length ? "purple" : "slate"}>
                        {getEffectSummary(card)}
                      </Badge>
                      <Badge tone={isMastered ? "emerald" : "amber"}>
                        {isMastered ? "Mastered" : `Mastery ${cardMastery}/5`}
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
                    {getMasteryGuidance(cardMastery)}
                  </p>
                </button>
              );
            })}
          </section>
        </div>

        <aside className="result-pop rounded-xl border-2 border-emerald-800/30 bg-gradient-to-br from-emerald-100 via-amber-50 to-yellow-50 p-5 shadow-[0_10px_0_rgba(120,53,15,0.18)] lg:sticky lg:top-32 lg:self-start">
          <div className="flex items-start gap-4">
            <span className="grid size-20 shrink-0 place-items-center rounded-lg border border-amber-900/20 bg-white/80 text-5xl shadow-inner">
              {selectedCard.imagePlaceholder}
            </span>
            <div>
              <p className="text-sm font-extrabold uppercase text-emerald-800">
                Open Card
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
              <StatCard
                label="Mastery bonus"
                value={`+${selectedMasteryBonus}`}
                helper="Dungeon damage"
                tone={selectedMasteryBonus > 0 ? "emerald" : "slate"}
              />
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
                <p className="mt-1 text-sm font-bold text-emerald-800">
                  Dungeon mastery bonus: +{selectedMasteryBonus} damage
                </p>
                <p className="mt-1 text-sm font-semibold text-amber-900">
                  {getMasteryGuidance(selectedMastery)}
                </p>
                {selectedMastery >= masteryTarget && (
                  <Badge tone="emerald" className="mt-2">
                    Mastered
                  </Badge>
                )}
              </dd>
            </div>
            <div className="rounded-lg border border-emerald-800/20 bg-emerald-50 px-3 py-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Battle role
              </dt>
              <dd className="mt-1 text-sm font-bold text-emerald-950">
                Correct Dungeon answers with this card deal base attack damage.
                Mastery can add bonus damage. Shop upgrades can improve this
                card during the current run only.
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </ScreenShell>
  );
}
