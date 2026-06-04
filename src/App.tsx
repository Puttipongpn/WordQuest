import { useState } from "react";
import { AppHeader } from "./components/AppHeader";
import {
  DeckReview,
  Dungeon,
  Home,
  RunResult,
  Shop,
  Training,
} from "./screens";
import type { ScreenName } from "./types";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("home");

  return (
    <div className="min-h-screen">
      <AppHeader currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      <main>
        {currentScreen === "home" && <Home onNavigate={setCurrentScreen} />}
        {currentScreen === "deck-review" && <DeckReview />}
        {currentScreen === "training" && <Training />}
        {currentScreen === "dungeon" && <Dungeon onNavigate={setCurrentScreen} />}
        {currentScreen === "shop" && <Shop />}
        {currentScreen === "run-result" && (
          <RunResult onNavigate={setCurrentScreen} />
        )}
      </main>
    </div>
  );
}
