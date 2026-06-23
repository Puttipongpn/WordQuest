import type { ScreenName } from "../types";

type AppHeaderProps = {
  currentScreen: ScreenName;
  isSoundEnabled: boolean;
  onNavigate: (screen: ScreenName) => void;
  onToggleSound: () => void;
};

const navItems: Array<{ screen: ScreenName; label: string; icon: string }> = [
  { screen: "home", label: "Home", icon: "🏕️" },
  { screen: "deck-review", label: "Deck", icon: "🃏" },
  { screen: "training", label: "Training", icon: "📚" },
  { screen: "dungeon", label: "Dungeon", icon: "⚔️" },
  { screen: "shop", label: "Shop", icon: "🛒" },
  { screen: "run-result", label: "Result", icon: "🏆" },
];

export function AppHeader({
  currentScreen,
  isSoundEnabled,
  onNavigate,
  onToggleSound,
}: AppHeaderProps) {
  if (currentScreen === "dungeon") {
    return (
      <header className="h-12 border-b border-amber-300/15 bg-stone-950/95 text-amber-50 shadow-md sm:h-14">
        <div className="mx-auto flex h-full max-w-[1800px] items-center justify-between px-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-md border border-amber-400/30 bg-amber-300/10 text-lg shadow-inner sm:size-9 sm:text-xl">
              📖
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-300">
                WordQuest
              </p>
              <h1 className="text-sm font-black leading-tight text-amber-50 sm:text-base">
                Dungeon
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="hidden text-xs font-black uppercase tracking-[0.2em] text-amber-100/70 sm:block">
              Battle Mode
            </p>
            <SoundToggle
              isSoundEnabled={isSoundEnabled}
              onToggleSound={onToggleSound}
            />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-10 border-b border-amber-300/15 bg-gradient-to-r from-stone-950/95 via-emerald-950/95 to-stone-900/95 text-amber-50 shadow-[0_5px_18px_rgba(12,20,16,0.3)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-3 py-2 sm:px-5 lg:px-6">
        <div className="flex shrink-0 items-center gap-2">
          <span className="grid size-9 place-items-center rounded-md border border-amber-300/35 bg-amber-300/10 text-xl shadow-inner">
            📖
          </span>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-amber-300">
              WordQuest
            </p>
            <h1 className="text-base font-black leading-tight text-amber-50 sm:text-lg">
              Vocabulary Dungeon
            </h1>
          </div>
        </div>
        <nav
          className="order-3 flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-0.5 sm:order-none sm:ml-2"
          aria-label="Main screens"
        >
          {navItems.map((item) => {
            const isActive = currentScreen === item.screen;

            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => onNavigate(item.screen)}
                className={`shrink-0 rounded-md border px-2.5 py-1.5 text-xs font-extrabold transition sm:px-3 ${
                  isActive
                    ? "border-amber-200 bg-amber-300 text-amber-950 shadow-[0_2px_0_rgba(120,53,15,0.45)]"
                    : "border-amber-100/15 bg-amber-50/5 text-amber-100/85 hover:border-amber-300/70 hover:bg-amber-100/15"
                }`}
              >
                <span className="mr-1.5" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>
        <SoundToggle
          isSoundEnabled={isSoundEnabled}
          onToggleSound={onToggleSound}
        />
      </div>
    </header>
  );
}

type SoundToggleProps = {
  isSoundEnabled: boolean;
  onToggleSound: () => void;
};

function SoundToggle({ isSoundEnabled, onToggleSound }: SoundToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggleSound}
      aria-pressed={isSoundEnabled}
      className={`w-fit shrink-0 rounded-md border px-2.5 py-1.5 text-[11px] font-black uppercase tracking-[0.06em] transition hover:-translate-y-0.5 active:translate-y-0.5 ${
        isSoundEnabled
          ? "border-emerald-200 bg-emerald-100 text-emerald-950 shadow-[0_2px_0_rgba(6,78,59,0.32)]"
          : "border-amber-100/15 bg-amber-50/5 text-amber-100/85 hover:border-amber-300/70 hover:bg-amber-100/15"
      }`}
    >
      {isSoundEnabled ? "Sound On" : "Sound Off"}
    </button>
  );
}
