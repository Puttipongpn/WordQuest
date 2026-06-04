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
import { availableDecks, starterDeck } from "./data";
import type {
  ElementType,
  RunProgressState,
  SavedPlayerProgress,
  ScreenName,
  VocabularyDeck,
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
const minimumRunDeckSize = 5;
const minimumBattleWordOptions = 4;
let duplicateCardSequence = 0;

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

function createRunDeckCopy(deck: VocabularyDeck): WordCard[] {
  return deck.cards.map((card) => ({
    ...card,
    effects: card.effects?.map((effect) => ({ ...effect })),
  }));
}

function createDuplicateRunCard(card: WordCard): WordCard {
  duplicateCardSequence += 1;

  return {
    ...card,
    id: `${card.id}-copy-${Date.now()}-${duplicateCardSequence}`,
    effects: card.effects?.map((effect) => ({ ...effect })),
  };
}

function countUniqueWords(deck: WordCard[]) {
  return new Set(deck.map((card) => card.word.toLowerCase())).size;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("home");
  const [selectedDeckId, setSelectedDeckId] = useState(starterDeck.id);
  const [playerProgress, setPlayerProgress] =
    useState<SavedPlayerProgress>(loadPlayerProgress);
  const [runProgress, setRunProgress] =
    useState<RunProgressState>(initialRunProgress);
  const [runGold, setRunGold] = useState(initialRunGold);
  const [currentRunDeck, setCurrentRunDeck] = useState<WordCard[]>(
    () => createRunDeckCopy(starterDeck),
  );

  const selectedDeck =
    availableDecks.find((deck) => deck.id === selectedDeckId) ?? starterDeck;
  const wordMastery = playerProgress.wordMastery;
  const completedDeckIds = playerProgress.completedDeckIds;

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

  function markSelectedDeckCompleted() {
    setPlayerProgress((currentProgress) => {
      if (currentProgress.completedDeckIds.includes(selectedDeck.id)) {
        return currentProgress;
      }

      const nextProgress: SavedPlayerProgress = {
        ...currentProgress,
        completedDeckIds: [
          ...currentProgress.completedDeckIds,
          selectedDeck.id,
        ],
      };

      savePlayerProgress(nextProgress);

      return nextProgress;
    });
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
    setCurrentRunDeck(createRunDeckCopy(selectedDeck));
  }

  function selectDeck(deckId: string) {
    const nextDeck =
      availableDecks.find((deck) => deck.id === deckId) ?? starterDeck;

    if (nextDeck.id === selectedDeck.id) {
      return;
    }

    setSelectedDeckId(nextDeck.id);
    setRunProgress(initialRunProgress);
    setRunGold(initialRunGold);
    setCurrentRunDeck(createRunDeckCopy(nextDeck));
  }

  function purchaseAttackUpgrade(cardId: string, cost: number) {
    if (
      runGold < cost ||
      !currentRunDeck.some((card) => card.id === cardId)
    ) {
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
    if (
      runGold < cost ||
      !currentRunDeck.some((card) => card.id === cardId)
    ) {
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
    if (
      runGold < cost ||
      !currentRunDeck.some((card) => card.id === cardId)
    ) {
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

  function purchaseRemoveCard(cardId: string, cost: number) {
    const deckAfterRemoval = currentRunDeck.filter((card) => card.id !== cardId);

    if (
      runGold < cost ||
      currentRunDeck.length <= minimumRunDeckSize ||
      deckAfterRemoval.length === currentRunDeck.length ||
      deckAfterRemoval.length < minimumRunDeckSize ||
      countUniqueWords(deckAfterRemoval) < minimumBattleWordOptions
    ) {
      return false;
    }

    setRunGold((currentGold) => currentGold - cost);
    setCurrentRunDeck((currentDeck) =>
      currentDeck.length <= minimumRunDeckSize
        ? currentDeck
        : currentDeck.filter((card) => card.id !== cardId),
    );

    return true;
  }

  function purchaseDuplicateCard(cardId: string, cost: number) {
    if (
      runGold < cost ||
      !currentRunDeck.some((card) => card.id === cardId)
    ) {
      return false;
    }

    setRunGold((currentGold) => currentGold - cost);
    setCurrentRunDeck((currentDeck) => {
      const cardToDuplicate = currentDeck.find((card) => card.id === cardId);

      if (!cardToDuplicate) {
        return currentDeck;
      }

      return [
        ...currentDeck,
        createDuplicateRunCard(cardToDuplicate),
      ];
    });

    return true;
  }

  return (
    <div className="min-h-screen">
      <AppHeader currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      <main>
        {currentScreen === "home" && (
          <Home
            availableDecks={availableDecks}
            completedDeckIds={completedDeckIds}
            onNavigate={setCurrentScreen}
            onResetProgress={resetPlayerProgress}
            onSelectDeck={selectDeck}
            selectedDeckId={selectedDeck.id}
          />
        )}
        {currentScreen === "deck-review" && (
          <DeckReview
            completedDeckIds={completedDeckIds}
            deck={selectedDeck}
            wordMastery={wordMastery}
          />
        )}
        {currentScreen === "training" && (
          <Training
            deck={selectedDeck}
            wordMastery={wordMastery}
            onIncreaseWordMastery={increaseWordMastery}
          />
        )}
        {currentScreen === "dungeon" && (
          <Dungeon
            key={selectedDeck.id}
            currentRunDeck={currentRunDeck}
            isSelectedDeckCompleted={completedDeckIds.includes(selectedDeck.id)}
            onCompleteSelectedDeck={markSelectedDeckCompleted}
            onMonsterDefeated={recordMonsterDefeated}
            onNavigate={setCurrentScreen}
            onResetRun={resetCurrentRun}
            runGold={runGold}
            runProgress={runProgress}
            selectedDeck={selectedDeck}
          />
        )}
        {currentScreen === "shop" && (
          <Shop
            currentRunDeck={currentRunDeck}
            onNavigate={setCurrentScreen}
            onPurchaseDuplicateCard={purchaseDuplicateCard}
            onPurchaseAttackUpgrade={purchaseAttackUpgrade}
            onPurchaseElementUpgrade={purchaseElementUpgrade}
            onPurchaseRemoveCard={purchaseRemoveCard}
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
