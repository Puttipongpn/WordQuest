import { ScreenShell } from "../components/ScreenShell";
import { Badge, Button, CardPanel, StatCard } from "../components/ui";
import { starterDeck } from "../data";
import type { ScreenName } from "../types";

type HomeProps = {
  completedDeckIds: string[];
  onNavigate: (screen: ScreenName) => void;
  onResetProgress: () => void;
};

export function Home({
  completedDeckIds,
  onNavigate,
  onResetProgress,
}: HomeProps) {
  const isStarterDeckCompleted = completedDeckIds.includes(starterDeck.id);

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
            <StatCard label="Deck" value="20" helper="Starter cards" />
            <StatCard
              label="Starter Deck"
              value={isStarterDeckCompleted ? "Completed" : "In Progress"}
              helper={
                isStarterDeckCompleted
                  ? "Permanent progress saved"
                  : "Defeat the boss to complete"
              }
              tone={isStarterDeckCompleted ? "emerald" : "sky"}
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
    </ScreenShell>
  );
}
