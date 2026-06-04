import { ScreenShell } from "../components/ScreenShell";
import type { ScreenName } from "../types";

type DungeonProps = {
  onNavigate: (screen: ScreenName) => void;
};

export function Dungeon({ onNavigate }: DungeonProps) {
  return (
    <ScreenShell eyebrow="Battle" title="Dungeon">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-4xl" aria-hidden="true">
            👾
          </p>
          <p className="mt-2 font-semibold text-slate-900">
            Placeholder Monster
          </p>
          <p className="text-sm text-slate-600">Battle logic comes later.</p>
        </div>
        <div className="rounded-md bg-emerald-50 p-4 md:col-span-2">
          <p className="font-semibold text-slate-900">Run Area</p>
          <p className="mt-2 text-slate-700">
            Mini-games, HP, shield, gold, and dungeon progress will appear here.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate("shop")}
              className="rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-800 hover:border-emerald-500 hover:text-emerald-700"
            >
              Visit Shop
            </button>
            <button
              type="button"
              onClick={() => onNavigate("run-result")}
              className="rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-800 hover:border-emerald-500 hover:text-emerald-700"
            >
              End Run
            </button>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
