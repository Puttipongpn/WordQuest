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
  return (
    <header className="sticky top-0 z-10 border-b-2 border-emerald-200/20 bg-[#132d28]/95 text-amber-50 shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-lg border border-amber-400/50 bg-amber-300/15 text-3xl shadow-inner">
            📖
          </span>
          <div>
            <p className="text-sm font-extrabold uppercase text-amber-300">
              WordQuest
            </p>
            <h1 className="text-2xl font-black text-amber-50">
              Cozy Dungeon Deckbuilder
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
                    ? "border-amber-300 bg-amber-300 text-amber-950 shadow-[0_4px_0_rgba(120,53,15,0.55)]"
                    : "border-amber-100/20 bg-amber-50/10 text-amber-100 hover:border-amber-300 hover:bg-amber-100/20"
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
