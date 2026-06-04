import { ScreenShell } from "../components/ScreenShell";
import type { ScreenName } from "../types";

type RunResultProps = {
  onNavigate: (screen: ScreenName) => void;
};

export function RunResult({ onNavigate }: RunResultProps) {
  return (
    <ScreenShell eyebrow="Summary" title="Run Result">
      <p className="text-slate-700">
        Run win, loss, rewards, and permanent vocabulary progress updates will
        be summarized here.
      </p>
      <button
        type="button"
        onClick={() => onNavigate("home")}
        className="mt-5 rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
      >
        Back Home
      </button>
    </ScreenShell>
  );
}
