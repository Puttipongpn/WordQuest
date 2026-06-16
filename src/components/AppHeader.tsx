import type { ScreenName } from "../types";

type AppHeaderProps = {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
};

const navItems: Array<{ screen: ScreenName; label: string; icon: string }> = [
  { screen: "home", label: "Home", icon: "🏕️" },
  { screen: "deck-review", label: "Deck", icon: "🃏" },
  { screen: "training", label: "Training", icon: "📚" },
  { screen: "dungeon", label: "Dungeon", icon: "⚔️" },
  { screen: "shop", label: "Shop", icon: "🛒" },
  { screen: "run-result", label: "Result", icon: "🏆" },
];

export function AppHeader({ currentScreen, onNavigate }: AppHeaderProps) {
  if (currentScreen === "dungeon") {
    return (
      <header className="h-14 border-b-2 border-amber-300/20 bg-stone-950/95 text-amber-50 shadow-lg sm:h-16">
        <div className="mx-auto flex h-full max-w-[1800px] items-center justify-between px-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg border border-amber-400/40 bg-amber-300/15 text-xl shadow-inner sm:size-10 sm:text-2xl">
              📖
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">
                WordQuest
              </p>
              <h1 className="text-base font-black leading-tight text-amber-50 sm:text-lg">
                Dungeon
              </h1>
            </div>
          </div>
          <p className="hidden text-xs font-black uppercase tracking-[0.2em] text-amber-100/70 sm:block">
            Battle Mode
          </p>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-10 border-b-2 border-amber-300/20 bg-gradient-to-r from-stone-950/95 via-emerald-950/95 to-stone-900/95 text-amber-50 shadow-[0_8px_28px_rgba(12,20,16,0.38)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-lg border border-amber-300/55 bg-amber-300/15 text-3xl shadow-[inset_0_0_18px_rgba(251,191,36,0.18),0_3px_0_rgba(120,53,15,0.35)]">
            📖
          </span>
          <div>
            <p className="text-sm font-extrabold uppercase text-amber-300">
              WordQuest
            </p>
            <h1 className="text-2xl font-black text-amber-50">
              Vocabulary Dungeon
            </h1>
          </div>
        </div>
        <nav
          className="flex gap-2 overflow-x-auto pb-1"
          aria-label="Main screens"
        >
          {navItems.map((item) => {
            const isActive = currentScreen === item.screen;

            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => onNavigate(item.screen)}
                className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-extrabold transition ${
                  isActive
                    ? "border-amber-200 bg-gradient-to-b from-amber-200 to-amber-400 text-amber-950 shadow-[0_4px_0_rgba(120,53,15,0.58)]"
                    : "border-amber-100/20 bg-amber-50/10 text-amber-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-amber-300 hover:bg-amber-100/20"
                }`}
              >
                <span className="mr-2" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
