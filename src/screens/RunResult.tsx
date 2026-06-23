import { ScreenShell } from "../components/ScreenShell";
import { Badge, Button, CardPanel } from "../components/ui";
import type { ScreenName } from "../types";

type RunResultProps = {
  onNavigate: (screen: ScreenName) => void;
};

export function RunResult({ onNavigate }: RunResultProps) {
  return (
    <ScreenShell
      eyebrow="Tavern Ledger"
      title="Adventure Ledger"
      description="A compact landing spot for run outcomes and future history."
      framed={false}
    >
      <CardPanel className="border-amber-700/30 bg-gradient-to-br from-amber-100 via-orange-50 to-emerald-50 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge tone="amber">Run Results</Badge>
            <h3 className="mt-3 text-3xl font-black text-amber-950">
              Run summaries appear in Dungeon
            </h3>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-5 text-amber-900/75">
              Victory and defeat screens show outcome, reward or loss, next
              action, and compact run stats as soon as a run ends.
            </p>
          </div>
          <Badge tone="emerald">Local Save</Badge>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <Button type="button" onClick={() => onNavigate("dungeon")}>
            Enter Dungeon
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
            onClick={() => onNavigate("deck-review")}
            variant="secondary"
          >
            Review Deck
          </Button>
        </div>

        <details className="mt-4 rounded-xl border border-amber-900/15 bg-white/70 p-3">
          <summary className="cursor-pointer font-black text-amber-950">
            What is saved?
          </summary>
          <div className="mt-3 grid gap-2 text-sm font-bold leading-5 text-amber-950/75 sm:grid-cols-2">
            <p>
              Permanent progress keeps word mastery, unlocked decks, completed
              decks, and best-run statistics.
            </p>
            <p>
              Temporary run state such as HP, shield, gold, shop upgrades,
              card changes, encounters, and Word Energy is not saved.
            </p>
          </div>
        </details>

        <Button
          type="button"
          onClick={() => onNavigate("home")}
          variant="ghost"
          className="mt-4"
        >
          Back Home
        </Button>
      </CardPanel>
    </ScreenShell>
  );
}
