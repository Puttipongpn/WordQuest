import { ScreenShell } from "../components/ScreenShell";
import { Button, CardPanel, StatCard } from "../components/ui";
import type { ScreenName } from "../types";

type RunResultProps = {
  onNavigate: (screen: ScreenName) => void;
};

export function RunResult({ onNavigate }: RunResultProps) {
  return (
    <ScreenShell
      eyebrow="Tavern Ledger"
      title="Run Result"
      description="A placeholder summary for future run outcomes, rewards, and learning progress."
      framed={false}
    >
      <CardPanel className="border-amber-700/30 bg-gradient-to-br from-amber-100 to-orange-50">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Outcome" value="Pending" helper="Win/loss later" />
          <StatCard label="Rewards" value="0" helper="Deferred" tone="amber" />
          <StatCard label="Progress" value="Saved" helper="Mastery only" tone="emerald" />
        </div>
        <p className="mt-5 text-sm font-medium leading-6 text-amber-950/75">
          Run win, loss, rewards, and permanent vocabulary progress updates will
          be summarized here after those systems exist.
        </p>
        <Button
          type="button"
          onClick={() => onNavigate("home")}
          className="mt-5"
      >
        Back Home
        </Button>
      </CardPanel>
    </ScreenShell>
  );
}
