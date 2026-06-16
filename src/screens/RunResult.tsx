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
      title="Adventure Ledger"
      description="A quiet tavern page for future standalone run history."
      framed={false}
    >
      <CardPanel className="border-amber-700/30 bg-gradient-to-br from-amber-100 via-orange-50 to-emerald-50">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Outcome" value="Dungeon" helper="Shown after runs" />
          <StatCard label="Rewards" value="Deck" helper="Boss completion" tone="amber" />
          <StatCard label="Progress" value="Local" helper="Browser save" tone="emerald" />
        </div>
        <p className="mt-5 text-sm font-medium leading-6 text-amber-950/75">
          Current Run Complete and Run Failed summaries appear inside the
          Dungeon when a run ends. This page is reserved for a future standalone
          history view.
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
