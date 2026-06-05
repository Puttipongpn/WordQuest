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
import { availableDecks, foodDeck, starterDeck } from "./data";
import {
  ADD_SHIELD_AMOUNT,
  GOLD_PER_MONSTER,
  MAX_WORD_MASTERY,
  MIN_DISTINCT_VISIBLE_WORDS,
  MIN_RUN_DECK_SIZE,
  SHOP_INTERVAL,
  STARTING_GOLD,
  UPGRADE_ATTACK_AMOUNT,
} from "./game/balance";
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

let duplicateCardSequence = 0;

type CompletionReward = {
  completedMessage: string;
  unlockMessage: string;
};

const initialRunProgress: RunProgressState = {
  monstersDefeated: 0,
  currentFloor: 1,
  nextShopAt: SHOP_INTERVAL,
};

function getNextShopAt(monstersDefeated: number) {
  if (monstersDefeated === 0) {
    return SHOP_INTERVAL;
  }

  if (monstersDefeated % SHOP_INTERVAL === 0) {
    return monstersDefeated;
  }

  return Math.ceil(monstersDefeated / SHOP_INTERVAL) * SHOP_INTERVAL;
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
  const [runGold, setRunGold] = useState(STARTING_GOLD);
  const [currentRunDeck, setCurrentRunDeck] = useState<WordCard[]>(
    () => createRunDeckCopy(starterDeck),
  );

  const selectedDeck =
    availableDecks.find(
      (deck) =>
        deck.id === selectedDeckId &&
        playerProgress.unlockedDeckIds.includes(deck.id),
    ) ?? starterDeck;
  const wordMastery = playerProgress.wordMastery;
  const completedDeckIds = playerProgress.completedDeckIds;
  const unlockedDeckIds = playerProgress.unlockedDeckIds;

  function increaseWordMastery(cardId: string) {
    setPlayerProgress((currentProgress) => {
      const nextMastery = Math.min(
        (currentProgress.wordMastery[cardId] ?? 0) + 1,
        MAX_WORD_MASTERY,
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
    setSelectedDeckId(starterDeck.id);
    setRunProgress(initialRunProgress);
    setRunGold(STARTING_GOLD);
    setCurrentRunDeck(createRunDeckCopy(starterDeck));
  }

  function markSelectedDeckCompleted(): CompletionReward {
    setPlayerProgress((currentProgress) => {
      const completedDeckIds = currentProgress.completedDeckIds.includes(
        selectedDeck.id,
      )
        ? currentProgress.completedDeckIds
        : [...currentProgress.completedDeckIds, selectedDeck.id];
      const unlockedDeckIds = new Set(currentProgress.unlockedDeckIds);
      unlockedDeckIds.add(starterDeck.id);

      if (selectedDeck.id === starterDeck.id) {
        unlockedDeckIds.add(foodDeck.id);
      }

      const nextProgress: SavedPlayerProgress = {
        ...currentProgress,
        unlockedDeckIds: [...unlockedDeckIds],
        completedDeckIds,
      };

      savePlayerProgress(nextProgress);

      return nextProgress;
    });

    if (selectedDeck.id === starterDeck.id) {
      return {
        completedMessage: "Starter Deck completed!",
        unlockMessage: "Food Deck unlocked!",
      };
    }

    if (selectedDeck.id === foodDeck.id) {
      return {
        completedMessage: "Food Deck completed!",
        unlockMessage: "Next deck coming soon.",
      };
    }

    return {
      completedMessage: `${selectedDeck.name} completed!`,
      unlockMessage: "Next deck coming soon.",
    };
  }

  function recordMonsterDefeated() {
    setRunGold((currentGold) => currentGold + GOLD_PER_MONSTER);
    setRunProgress((currentProgress) => {
      const monstersDefeated = currentProgress.monstersDefeated + 1;

      return {
        monstersDefeated,
        currentFloor: monstersDefeated + 1,
        nextShopAt: getNextShopAt(monstersDefeated),
      };
    });
  }

  function gainRunGold(amount: number) {
    setRunGold((currentGold) => currentGold + amount);
  }

  function resetCurrentRun() {
    setRunProgress(initialRunProgress);
    setRunGold(STARTING_GOLD);
    setCurrentRunDeck(createRunDeckCopy(selectedDeck));
  }

  function selectDeck(deckId: string) {
    const nextDeck =
      availableDecks.find((deck) => deck.id === deckId) ?? starterDeck;

    if (
      nextDeck.id === selectedDeck.id ||
      !unlockedDeckIds.includes(nextDeck.id)
    ) {
      return;
    }

    setSelectedDeckId(nextDeck.id);
    setRunProgress(initialRunProgress);
    setRunGold(STARTING_GOLD);
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
              baseAttack: card.baseAttack + UPGRADE_ATTACK_AMOUNT,
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
                amount: effect.amount + ADD_SHIELD_AMOUNT,
                description: `Gain ${effect.amount + ADD_SHIELD_AMOUNT} shield when triggered.`,
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
              amount: ADD_SHIELD_AMOUNT,
              description: `Gain ${ADD_SHIELD_AMOUNT} shield when triggered.`,
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
      currentRunDeck.length <= MIN_RUN_DECK_SIZE ||
      deckAfterRemoval.length === currentRunDeck.length ||
      deckAfterRemoval.length < MIN_RUN_DECK_SIZE ||
      countUniqueWords(deckAfterRemoval) < MIN_DISTINCT_VISIBLE_WORDS
    ) {
      return false;
    }

    setRunGold((currentGold) => currentGold - cost);
    setCurrentRunDeck((currentDeck) =>
      currentDeck.length <= MIN_RUN_DECK_SIZE
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
            unlockedDeckIds={unlockedDeckIds}
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
            onGainRunGold={gainRunGold}
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
