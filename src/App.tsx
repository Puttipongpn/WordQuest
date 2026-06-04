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
import type { ScreenName, WordMasteryByCardId } from "./types";

const maxWordMastery = 5;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("home");
  const [wordMastery, setWordMastery] = useState<WordMasteryByCardId>({});

  function increaseWordMastery(cardId: string) {
    setWordMastery((currentMastery) => {
      const nextMastery = Math.min(
        (currentMastery[cardId] ?? 0) + 1,
        maxWordMastery,
      );

      return {
        ...currentMastery,
        [cardId]: nextMastery,
      };
    });
  }

  return (
    <div className="min-h-screen">
      <AppHeader currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      <main>
        {currentScreen === "home" && <Home onNavigate={setCurrentScreen} />}
        {currentScreen === "deck-review" && (
          <DeckReview wordMastery={wordMastery} />
        )}
        {currentScreen === "training" && (
          <Training
            wordMastery={wordMastery}
            onIncreaseWordMastery={increaseWordMastery}
          />
        )}
        {currentScreen === "dungeon" && <Dungeon onNavigate={setCurrentScreen} />}
        {currentScreen === "shop" && <Shop />}
        {currentScreen === "run-result" && (
          <RunResult onNavigate={setCurrentScreen} />
        )}
      </main>
    </div>
  );
}
