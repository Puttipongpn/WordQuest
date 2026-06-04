import type { ScreenName } from "../types";

type AppHeaderProps = {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
};

const navItems: Array<{ screen: ScreenName; label: string }> = [
  { screen: "home", label: "Home" },
  { screen: "deck-review", label: "Deck Review" },
  { screen: "training", label: "Training" },
  { screen: "dungeon", label: "Dungeon" },
  { screen: "shop", label: "Shop" },
  { screen: "run-result", label: "Run Result" },
];

export function AppHeader({ currentScreen, onNavigate }: AppHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Vocabulary Dungeon
          </p>
          <h1 className="text-2xl font-bold text-slate-950">
            Roguelike Deckbuilder Prototype
          </h1>
        </div>
        <nav className="flex flex-wrap gap-2" aria-label="Main screens">
          {navItems.map((item) => {
            const isActive = currentScreen === item.screen;

            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => onNavigate(item.screen)}
                className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
