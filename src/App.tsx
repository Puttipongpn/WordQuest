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
import type { SavedPlayerProgress, ScreenName } from "./types";
import {
  createDefaultPlayerProgress,
  loadPlayerProgress,
  resetSavedProgress,
  savePlayerProgress,
} from "./utils/playerProgressStorage";

const maxWordMastery = 5;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("home");
  const [playerProgress, setPlayerProgress] =
    useState<SavedPlayerProgress>(loadPlayerProgress);

  const wordMastery = playerProgress.wordMastery;

  function increaseWordMastery(cardId: string) {
    setPlayerProgress((currentProgress) => {
      const nextMastery = Math.min(
        (currentProgress.wordMastery[cardId] ?? 0) + 1,
        maxWordMastery,
      );
      const nextProgress: SavedPlayerProgress = {
        ...currentProgress,
        wordMastery: {
          ...currentProgress.wordMastery,
          [cardId]: nextMastery,
        },
      };

      savePlayerProgress(nextProgress);

      return nextProgress;
    });
  }

  function resetPlayerProgress() {
    resetSavedProgress();
    setPlayerProgress(createDefaultPlayerProgress());
  }

  return (
    <div className="min-h-screen">
      <AppHeader currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      <main>
        {currentScreen === "home" && (
          <Home
            onNavigate={setCurrentScreen}
            onResetProgress={resetPlayerProgress}
          />
        )}
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
