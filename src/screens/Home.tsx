import { ScreenShell } from "../components/ScreenShell";
import { Badge, Button, CardPanel, StatCard } from "../components/ui";
import type { ScreenName, VocabularyDeck } from "../types";

type HomeProps = {
  availableDecks: VocabularyDeck[];
  completedDeckIds: string[];
  onNavigate: (screen: ScreenName) => void;
  onResetProgress: () => void;
  onSelectDeck: (deckId: string) => void;
  selectedDeckId: string;
  unlockedDeckIds: string[];
};

export function Home({
  availableDecks,
  completedDeckIds,
  onNavigate,
  onResetProgress,
  onSelectDeck,
  selectedDeckId,
  unlockedDeckIds,
}: HomeProps) {
  const selectedDeck =
    availableDecks.find((deck) => deck.id === selectedDeckId) ??
    availableDecks[0];
  const isSelectedDeckCompleted = completedDeckIds.includes(selectedDeck.id);

  function handleResetProgress() {
    const shouldReset = window.confirm(
      "Reset saved word mastery and permanent progress?",
    );

    if (shouldReset) {
      onResetProgress();
    }
  }

  return (
    <ScreenShell
      eyebrow="Campfire Gate"
      title="WordQuest"
      description="Review your vocabulary deck, train at camp, then descend into the dungeon."
      framed={false}
    >
      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.85fr]">
        <CardPanel className="border-amber-700/40 bg-gradient-to-br from-amber-100 via-orange-50 to-emerald-100">
          <div className="flex flex-wrap gap-2">
            <Badge tone="emerald">Vocabulary cards</Badge>
            <Badge tone="purple">Deckbuilder run</Badge>
            <Badge tone="amber">Placeholder art</Badge>
          </div>
          <h3 className="mt-5 max-w-2xl text-5xl font-black text-amber-950">
            Learn words. Trigger cards. Survive the dungeon.
          </h3>
          <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-amber-950/80">
            Permanent word mastery is saved locally. Current dungeon runs remain
            temporary and reset separately, just like a proper little roguelike.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={() => onNavigate("deck-review")}>
              Review Deck
            </Button>
            <Button
              type="button"
              onClick={() => onNavigate("training")}
              variant="secondary"
            >
              Training
            </Button>
            <Button
              type="button"
              onClick={() => onNavigate("dungeon")}
              variant="secondary"
            >
              Enter Dungeon
            </Button>
            <Button
              type="button"
              onClick={handleResetProgress}
              variant="danger"
            >
              Reset Progress
            </Button>
          </div>
        </CardPanel>
        <CardPanel className="border-emerald-800/30 bg-gradient-to-br from-emerald-100 to-amber-50">
          <div className="flex items-center gap-4">
            <p className="grid size-16 place-items-center rounded-lg border border-amber-900/20 bg-white/70 text-5xl shadow-inner" aria-hidden="true">
              🏕️
            </p>
            <div>
              <p className="font-black text-amber-950">Adventure Status</p>
              <p className="mt-1 text-sm font-medium text-amber-900/80">
                Cozy fantasy prototype, CSS-only visuals.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <StatCard
              label="Deck"
              value={selectedDeck.cards.length}
              helper="Active cards"
            />
            <StatCard
              label={selectedDeck.name}
              value={isSelectedDeckCompleted ? "Completed" : "In Progress"}
              helper={
                isSelectedDeckCompleted
                  ? "Permanent progress saved"
                  : "Defeat the boss to complete"
              }
              tone={isSelectedDeckCompleted ? "emerald" : "sky"}
            />
            <StatCard
              label="Mastery"
              value="0-5"
              helper="Saved locally"
              tone="emerald"
            />
            <StatCard
              label="Runs"
              value="Temp"
              helper="Not persisted"
              tone="amber"
            />
          </div>
        </CardPanel>
      </div>

      <CardPanel className="mt-6 border-amber-700/30 bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge tone="purple">Deck Selection</Badge>
            <h3 className="mt-2 text-2xl font-black text-amber-950">
              Choose your active deck
            </h3>
            <p className="mt-2 max-w-2xl text-sm font-bold text-amber-900/75">
              Deck Review, Training, Dungeon battles, shop mutations, and boss
              completion all use the selected deck. Changing decks starts a
              fresh run. Locked decks appear here but cannot be selected yet.
            </p>
          </div>
          <StatCard
            label="Available Decks"
            value={availableDecks.length}
            helper="Manual sample data"
            tone="emerald"
          />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {availableDecks.map((deck) => {
            const isSelected = deck.id === selectedDeckId;
            const isCompleted = completedDeckIds.includes(deck.id);
            const isUnlocked = unlockedDeckIds.includes(deck.id);
            const requirement =
              deck.id === "food-deck"
                ? "Complete Starter Deck to unlock."
                : "Unlocked by default.";

            return (
              <button
                key={deck.id}
                type="button"
                disabled={!isUnlocked}
                onClick={() => onSelectDeck(deck.id)}
                aria-pressed={isSelected}
                className={`rounded-xl border-2 p-4 text-left shadow-[0_8px_0_rgba(120,53,15,0.12)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                  !isUnlocked
                    ? "cursor-not-allowed border-slate-300 bg-slate-100/80 opacity-75"
                    : isSelected
                      ? "border-amber-700 bg-white ring-2 ring-amber-300"
                      : "border-amber-900/15 bg-white/70 hover:border-amber-500"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xl font-black text-amber-950">
                      {deck.name}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-6 text-amber-950/70">
                      {deck.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      tone={!isUnlocked ? "slate" : isSelected ? "amber" : "sky"}
                    >
                      {!isUnlocked
                        ? "Locked"
                        : isSelected
                          ? "Selected"
                          : "Choose"}
                    </Badge>
                    <Badge tone={isCompleted ? "emerald" : "sky"}>
                      {isCompleted ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <StatCard label="Cards" value={deck.cards.length} />
                  <StatCard
                    label="Access"
                    value={isUnlocked ? "Unlocked" : "Locked"}
                    helper={isUnlocked ? "Selectable" : requirement}
                    tone={isUnlocked ? "emerald" : "slate"}
                  />
                </div>
                {!isUnlocked && (
                  <p className="mt-3 rounded-md border border-slate-300 bg-white/70 px-3 py-2 text-sm font-bold text-slate-700">
                    {requirement}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </CardPanel>
    </ScreenShell>
  );
}
