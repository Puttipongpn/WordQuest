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
import { starterDeck } from "./data";
import type {
  ElementType,
  RunProgressState,
  SavedPlayerProgress,
  ScreenName,
  WordCard,
} from "./types";
import {
  createDefaultPlayerProgress,
  loadPlayerProgress,
  resetSavedProgress,
  savePlayerProgress,
} from "./utils/playerProgressStorage";

const maxWordMastery = 5;
const shopInterval = 5;
const initialRunGold = 20;
const monsterGoldReward = 5;
const attackUpgradeAmount = 2;
const shieldUpgradeAmount = 3;

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

function createRunDeckCopy(): WordCard[] {
  return starterDeck.cards.map((card) => ({
    ...card,
    effects: card.effects?.map((effect) => ({ ...effect })),
  }));
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("home");
  const [playerProgress, setPlayerProgress] =
    useState<SavedPlayerProgress>(loadPlayerProgress);
  const [runProgress, setRunProgress] =
    useState<RunProgressState>(initialRunProgress);
  const [runGold, setRunGold] = useState(initialRunGold);
  const [currentRunDeck, setCurrentRunDeck] = useState<WordCard[]>(
    createRunDeckCopy,
  );

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
    setRunGold((currentGold) => currentGold + monsterGoldReward);
    setRunProgress((currentProgress) => {
      const monstersDefeated = currentProgress.monstersDefeated + 1;

      return {
        monstersDefeated,
        currentFloor: monstersDefeated + 1,
        nextShopAt: getNextShopAt(monstersDefeated),
      };
    });
  }

  function resetCurrentRun() {
    setRunProgress(initialRunProgress);
    setRunGold(initialRunGold);
    setCurrentRunDeck(createRunDeckCopy());
  }

  function purchaseAttackUpgrade(cardId: string, cost: number) {
    if (runGold < cost) {
      return false;
    }

    setRunGold((currentGold) => currentGold - cost);
    setCurrentRunDeck((currentDeck) =>
      currentDeck.map((card) =>
        card.id === cardId
          ? {
              ...card,
              baseAttack: card.baseAttack + attackUpgradeAmount,
            }
          : card,
      ),
    );

    return true;
  }

  function purchaseShieldUpgrade(cardId: string, cost: number) {
    if (runGold < cost) {
      return false;
    }

    setRunGold((currentGold) => currentGold - cost);
    setCurrentRunDeck((currentDeck) =>
      currentDeck.map((card) => {
        if (card.id !== cardId) {
          return card;
        }

        const effects = card.effects ?? [];
        const existingShieldEffect = effects.find(
          (effect) => effect.type === "shield",
        );

        if (existingShieldEffect) {
          let hasUpgradedShield = false;

          return {
            ...card,
            effects: effects.map((effect) => {
              if (effect.type !== "shield" || hasUpgradedShield) {
                return effect;
              }

              hasUpgradedShield = true;

              return {
                ...effect,
                amount: effect.amount + shieldUpgradeAmount,
                description: `Gain ${effect.amount + shieldUpgradeAmount} shield when triggered.`,
              };
            }),
          };
        }

        return {
          ...card,
          effects: [
            ...effects,
            {
              type: "shield",
              amount: shieldUpgradeAmount,
              description: `Gain ${shieldUpgradeAmount} shield when triggered.`,
            },
          ],
        };
      }),
    );

    return true;
  }

  function purchaseElementUpgrade(
    cardId: string,
    cost: number,
    element: ElementType,
  ) {
    if (runGold < cost) {
      return false;
    }

    setRunGold((currentGold) => currentGold - cost);
    setCurrentRunDeck((currentDeck) =>
      currentDeck.map((card) => {
        if (card.id !== cardId) {
          return card;
        }

        const effectsWithoutElement =
          card.effects?.filter((effect) => effect.type !== "element") ?? [];

        return {
          ...card,
          effects: [
            ...effectsWithoutElement,
            {
              type: "element",
              element,
              amount: 1,
              description: `Element: ${element}`,
            },
          ],
        };
      }),
    );

    return true;
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
            currentRunDeck={currentRunDeck}
            onMonsterDefeated={recordMonsterDefeated}
            onNavigate={setCurrentScreen}
            onResetRun={resetCurrentRun}
            runGold={runGold}
            runProgress={runProgress}
          />
        )}
        {currentScreen === "shop" && (
          <Shop
            currentRunDeck={currentRunDeck}
            onNavigate={setCurrentScreen}
            onPurchaseAttackUpgrade={purchaseAttackUpgrade}
            onPurchaseElementUpgrade={purchaseElementUpgrade}
            onPurchaseShieldUpgrade={purchaseShieldUpgrade}
            runGold={runGold}
            runProgress={runProgress}
          />
        )}
        {currentScreen === "run-result" && (
          <RunResult onNavigate={setCurrentScreen} />
        )}
      </main>
    </div>
  );
}
