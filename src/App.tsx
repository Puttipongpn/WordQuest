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
import type { RunProgressState, SavedPlayerProgress, ScreenName } from "./types";
import {
  createDefaultPlayerProgress,
  loadPlayerProgress,
  resetSavedProgress,
  savePlayerProgress,
} from "./utils/playerProgressStorage";

const maxWordMastery = 5;
const shopInterval = 5;

const initialRunProgress: RunProgressState = {
  monstersDefeated: 0,
  currentFloor: 1,
  nextShopAt: shopInterval,
};

function getNextShopAt(monstersDefeated: number) {
  if (monstersDefeated === 0) {
    return shopInterval;
  }

  if (monstersDefeated % shopInterval === 0) {
    return monstersDefeated;
  }

  return Math.ceil(monstersDefeated / shopInterval) * shopInterval;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("home");
  const [playerProgress, setPlayerProgress] =
    useState<SavedPlayerProgress>(loadPlayerProgress);
  const [runProgress, setRunProgress] =
    useState<RunProgressState>(initialRunProgress);

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

  function recordMonsterDefeated() {
    setRunProgress((currentProgress) => {
      const monstersDefeated = currentProgress.monstersDefeated + 1;

      return {
        monstersDefeated,
        currentFloor: monstersDefeated + 1,
        nextShopAt: getNextShopAt(monstersDefeated),
      };
    });
  }

  function resetRunProgress() {
    setRunProgress(initialRunProgress);
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
        {currentScreen === "dungeon" && (
          <Dungeon
            onMonsterDefeated={recordMonsterDefeated}
            onNavigate={setCurrentScreen}
            onResetRunProgress={resetRunProgress}
            runProgress={runProgress}
          />
        )}
        {currentScreen === "shop" && (
          <Shop onNavigate={setCurrentScreen} runProgress={runProgress} />
        )}
        {currentScreen === "run-result" && (
          <RunResult onNavigate={setCurrentScreen} />
        )}
      </main>
    </div>
  );
}
