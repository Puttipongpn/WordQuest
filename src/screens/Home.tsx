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
      eyebrow="Start"
      title="Home"
      description="Review cards, train vocabulary, then enter the dungeon when you are ready."
    >
      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.85fr]">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="emerald">Vocabulary cards</Badge>
            <Badge tone="sky">Mini-game battles</Badge>
            <Badge tone="amber">Local prototype</Badge>
          </div>
          <h3 className="mt-5 max-w-2xl text-2xl font-bold text-slate-950">
            Build mastery before battle, then trigger cards by answering
            vocabulary questions.
          </h3>
          <p className="mt-3 max-w-2xl text-slate-600">
            Permanent word mastery is saved locally. Current dungeon runs remain
            temporary and reset separately.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={() => onNavigate("deck-review")}>
              Review Deck
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
        </div>
        <CardPanel className="bg-gradient-to-br from-slate-50 to-emerald-50">
          <div className="flex items-center gap-4">
            <p className="text-5xl" aria-hidden="true">
              🃏
            </p>
            <div>
              <p className="font-semibold text-slate-900">Prototype v0.1</p>
              <p className="mt-1 text-sm text-slate-600">
                Placeholder visuals only.
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
