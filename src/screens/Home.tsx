import { ScreenShell } from "../components/ScreenShell";
import type { ScreenName } from "../types";

type HomeProps = {
  onNavigate: (screen: ScreenName) => void;
  onResetProgress: () => void;
};

export function Home({ onNavigate, onResetProgress }: HomeProps) {
  function handleResetProgress() {
    const shouldReset = window.confirm(
      "Reset saved word mastery and permanent progress?",
    );

    if (shouldReset) {
      onResetProgress();
    }
  }

  return (
    <ScreenShell eyebrow="Start" title="Home">
      <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-lg text-slate-700">
            Choose a vocabulary deck, review the cards, train with mini-games,
            then enter the dungeon when you are ready.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate("deck-review")}
              className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
            >
              Review Deck
            </button>
            <button
              type="button"
              onClick={() => onNavigate("dungeon")}
              className="rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-800 hover:border-emerald-500 hover:text-emerald-700"
            >
              Enter Dungeon
            </button>
            <button
              type="button"
              onClick={handleResetProgress}
              className="rounded-md border border-red-200 px-4 py-2 font-semibold text-red-700 hover:border-red-400 hover:bg-red-50"
            >
              Reset Progress
            </button>
          </div>
        </div>
        <div className="rounded-md bg-slate-100 p-5">
          <p className="text-5xl" aria-hidden="true">
            🃏
          </p>
          <p className="mt-3 font-semibold text-slate-900">Prototype Shell</p>
          <p className="mt-1 text-sm text-slate-600">
            Placeholder visuals only. Game systems arrive in later phases.
          </p>
        </div>
      </div>
    </ScreenShell>
  );
}
