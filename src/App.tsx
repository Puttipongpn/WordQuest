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
import {
  ADD_SHIELD_AMOUNT,
  EVENT_CARD_SHIELD_UPGRADE_AMOUNT,
  EVENT_ATTACK_UPGRADE_AMOUNT,
  GOLD_PER_MONSTER,
  MAX_WORD_MASTERY,
  MIN_DISTINCT_VISIBLE_WORDS,
  MIN_RUN_DECK_SIZE,
  SHOP_INTERVAL,
  STARTING_GOLD,
  UPGRADE_ATTACK_AMOUNT,
} from "./game/balance";
import {
  getNextUnlockedDeckId,
  getUnlockedDeckIdsForCompletedDecks,
} from "./game/deckProgression";
import {
  incrementWordUsage,
  recoverWordEnergy,
  type WordFatigueByWord,
} from "./game/cardFatigue";
import type {
  ElementType,
  RunProgressState,
  RunStatistics,
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

const initialRunStatistics: RunStatistics = {
  questionsAnswered: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  timeouts: 0,
  monstersDefeated: 0,
  eliteDefeated: 0,
  eventsVisited: 0,
  bossDefeated: false,
  totalDamageDealt: 0,
  totalShieldGained: 0,
  goldEarned: 0,
  cardsUpgradedCount: 0,
  cardsRemovedCount: 0,
  cardsDuplicatedCount: 0,
  elementsAddedCount: 0,
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

const elementTypes: ElementType[] = ["fire", "water", "wind", "earth"];

function calculateAccuracy(statistics: RunStatistics) {
  if (statistics.questionsAnswered === 0) {
    return 0;
  }

  return Math.round(
    (statistics.correctAnswers / statistics.questionsAnswered) * 100,
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("home");
  const [selectedDeckId, setSelectedDeckId] = useState(starterDeck.id);
  const [playerProgress, setPlayerProgress] =
    useState<SavedPlayerProgress>(loadPlayerProgress);
  const [runProgress, setRunProgress] =
    useState<RunProgressState>(initialRunProgress);
  const [runGold, setRunGold] = useState(STARTING_GOLD);
  const [runStatistics, setRunStatistics] =
    useState<RunStatistics>(initialRunStatistics);
  const [wordFatigue, setWordFatigue] = useState<WordFatigueByWord>({});
  const [currentRunDeck, setCurrentRunDeck] = useState<WordCard[]>(
    () => createRunDeckCopy(starterDeck),
  );

  const wordMastery = playerProgress.wordMastery;
  const completedDeckIds = playerProgress.completedDeckIds;
  const unlockedDeckIds = getUnlockedDeckIdsForCompletedDecks(
    completedDeckIds,
    playerProgress.unlockedDeckIds,
  );
  const selectedDeck =
    availableDecks.find(
      (deck) =>
        deck.id === selectedDeckId && unlockedDeckIds.includes(deck.id),
    ) ?? starterDeck;
  const playerStatistics = playerProgress.statistics;

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
    setRunStatistics(initialRunStatistics);
    setWordFatigue({});
    setCurrentRunDeck(createRunDeckCopy(starterDeck));
  }

  function markSelectedDeckCompleted(): CompletionReward {
    setPlayerProgress((currentProgress) => {
      const completedDeckIds = currentProgress.completedDeckIds.includes(
        selectedDeck.id,
      )
        ? currentProgress.completedDeckIds
        : [...currentProgress.completedDeckIds, selectedDeck.id];
      const unlockedDeckIds = getUnlockedDeckIdsForCompletedDecks(
        completedDeckIds,
        currentProgress.unlockedDeckIds,
      );

      const nextProgress: SavedPlayerProgress = {
        ...currentProgress,
        unlockedDeckIds,
        completedDeckIds,
      };

      savePlayerProgress(nextProgress);

      return nextProgress;
    });

    const nextUnlockedDeckId = getNextUnlockedDeckId(selectedDeck.id);
    const nextUnlockedDeck = availableDecks.find(
      (deck) => deck.id === nextUnlockedDeckId,
    );

    return {
      completedMessage: `${selectedDeck.name} completed!`,
      unlockMessage: nextUnlockedDeck
        ? `${nextUnlockedDeck.name} unlocked!`
        : "More decks coming soon.",
    };
  }

  function recordMonsterDefeated(options?: { isElite?: boolean; bonusGold?: number }) {
    const bonusGold = options?.bonusGold ?? 0;

    setRunGold((currentGold) => currentGold + GOLD_PER_MONSTER + bonusGold);
    setRunStatistics((currentStatistics) => ({
      ...currentStatistics,
      monstersDefeated: currentStatistics.monstersDefeated + 1,
      eliteDefeated:
        currentStatistics.eliteDefeated + (options?.isElite ? 1 : 0),
      goldEarned: currentStatistics.goldEarned + GOLD_PER_MONSTER + bonusGold,
    }));
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
    setRunStatistics((currentStatistics) => ({
      ...currentStatistics,
      goldEarned: currentStatistics.goldEarned + amount,
    }));
  }

  function upgradeRandomRunCardAttack(amount = EVENT_ATTACK_UPGRADE_AMOUNT) {
    if (currentRunDeck.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * currentRunDeck.length);
    const selectedCard = currentRunDeck[randomIndex];

    setCurrentRunDeck((currentDeck) =>
      currentDeck.map((card) =>
        card.id === selectedCard.id
          ? {
              ...card,
              baseAttack: card.baseAttack + amount,
            }
          : card,
      ),
    );
    setRunStatistics((currentStatistics) => ({
      ...currentStatistics,
      cardsUpgradedCount: currentStatistics.cardsUpgradedCount + 1,
    }));

    return selectedCard.word;
  }

  function addRandomElementToRunCard() {
    if (currentRunDeck.length === 0) {
      return null;
    }

    const randomCardIndex = Math.floor(Math.random() * currentRunDeck.length);
    const randomElementIndex = Math.floor(Math.random() * elementTypes.length);
    const selectedCard = currentRunDeck[randomCardIndex];
    const element = elementTypes[randomElementIndex];

    setCurrentRunDeck((currentDeck) =>
      currentDeck.map((card) => {
        if (card.id !== selectedCard.id) {
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

    setRunStatistics((currentStatistics) => ({
      ...currentStatistics,
      elementsAddedCount: currentStatistics.elementsAddedCount + 1,
    }));

    return { word: selectedCard.word, element };
  }

  function addShieldToRandomRunCard(amount = EVENT_CARD_SHIELD_UPGRADE_AMOUNT) {
    if (currentRunDeck.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * currentRunDeck.length);
    const selectedCard = currentRunDeck[randomIndex];

    setCurrentRunDeck((currentDeck) =>
      currentDeck.map((card) => {
        if (card.id !== selectedCard.id) {
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
                amount: effect.amount + amount,
                description: `Gain ${effect.amount + amount} shield when triggered.`,
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
              amount,
              description: `Gain ${amount} shield when triggered.`,
            },
          ],
        };
      }),
    );
    setRunStatistics((currentStatistics) => ({
      ...currentStatistics,
      cardsUpgradedCount: currentStatistics.cardsUpgradedCount + 1,
    }));

    return selectedCard.word;
  }

  function updateRunStatistics(nextStatistics: RunStatistics) {
    setRunStatistics(nextStatistics);
  }

  function recordRunEnded(
    outcome: "completed" | "failed",
    finalRunStatistics: RunStatistics,
  ) {
    setPlayerProgress((currentProgress) => {
      const nextStatistics = {
        ...currentProgress.statistics,
        totalCorrectAnswers:
          currentProgress.statistics.totalCorrectAnswers +
          finalRunStatistics.correctAnswers,
        totalWrongAnswers:
          currentProgress.statistics.totalWrongAnswers +
          finalRunStatistics.wrongAnswers +
          finalRunStatistics.timeouts,
        bestMonstersDefeated: Math.max(
          currentProgress.statistics.bestMonstersDefeated,
          finalRunStatistics.monstersDefeated,
        ),
        bestAccuracy: Math.max(
          currentProgress.statistics.bestAccuracy,
          calculateAccuracy(finalRunStatistics),
        ),
        bestDamageDealt: Math.max(
          currentProgress.statistics.bestDamageDealt,
          finalRunStatistics.totalDamageDealt,
        ),
        completedRuns:
          currentProgress.statistics.completedRuns +
          (outcome === "completed" ? 1 : 0),
        failedRuns:
          currentProgress.statistics.failedRuns +
          (outcome === "failed" ? 1 : 0),
      };
      const nextProgress: SavedPlayerProgress = {
        ...currentProgress,
        statistics: nextStatistics,
      };

      savePlayerProgress(nextProgress);

      return nextProgress;
    });
  }

  function resetCurrentRun() {
    setRunProgress(initialRunProgress);
    setRunGold(STARTING_GOLD);
    setRunStatistics(initialRunStatistics);
    setWordFatigue({});
    setCurrentRunDeck(createRunDeckCopy(selectedDeck));
  }

  function resetWordFatigue() {
    setWordFatigue({});
  }

  function increaseWordFatigue(word: string) {
    setWordFatigue((currentFatigue) =>
      incrementWordUsage(currentFatigue, word),
    );
  }

  function recoverRunWordEnergy() {
    setWordFatigue((currentFatigue) => recoverWordEnergy(currentFatigue));
  }

  function navigateToScreen(screen: ScreenName) {
    if (currentScreen === "shop" && screen === "dungeon") {
      recoverRunWordEnergy();
    }

    setCurrentScreen(screen);
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
    setRunStatistics(initialRunStatistics);
    setWordFatigue({});
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
    setRunStatistics((currentStatistics) => ({
      ...currentStatistics,
      cardsUpgradedCount: currentStatistics.cardsUpgradedCount + 1,
    }));
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
    setRunStatistics((currentStatistics) => ({
      ...currentStatistics,
      cardsUpgradedCount: currentStatistics.cardsUpgradedCount + 1,
    }));
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
    setRunStatistics((currentStatistics) => ({
      ...currentStatistics,
      elementsAddedCount: currentStatistics.elementsAddedCount + 1,
    }));
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
    setRunStatistics((currentStatistics) => ({
      ...currentStatistics,
      cardsRemovedCount: currentStatistics.cardsRemovedCount + 1,
    }));
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
    setRunStatistics((currentStatistics) => ({
      ...currentStatistics,
      cardsDuplicatedCount: currentStatistics.cardsDuplicatedCount + 1,
    }));
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

  function spendRunGold(cost: number) {
    if (runGold < cost) {
      return false;
    }

    setRunGold((currentGold) => currentGold - cost);

    return true;
  }

  return (
    <div className="min-h-screen">
      <AppHeader currentScreen={currentScreen} onNavigate={navigateToScreen} />
      <main>
        {currentScreen === "home" && (
          <Home
            availableDecks={availableDecks}
            completedDeckIds={completedDeckIds}
            onNavigate={navigateToScreen}
            onResetProgress={resetPlayerProgress}
            onSelectDeck={selectDeck}
            playerStatistics={playerStatistics}
            selectedDeckId={selectedDeck.id}
            unlockedDeckIds={unlockedDeckIds}
            wordMastery={wordMastery}
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
            onNavigate={navigateToScreen}
          />
        )}
        {currentScreen === "dungeon" && (
          <Dungeon
            key={selectedDeck.id}
            currentRunDeck={currentRunDeck}
            isSelectedDeckCompleted={completedDeckIds.includes(selectedDeck.id)}
            onCompleteSelectedDeck={markSelectedDeckCompleted}
            onIncreaseWordFatigue={increaseWordFatigue}
            onGainRunGold={gainRunGold}
            onMonsterDefeated={recordMonsterDefeated}
            onNavigate={navigateToScreen}
            onRecordRunEnded={recordRunEnded}
            onResetRun={resetCurrentRun}
            onResetWordFatigue={resetWordFatigue}
            onUpgradeRandomRunCardAttack={upgradeRandomRunCardAttack}
            onAddRandomElementToRunCard={addRandomElementToRunCard}
            onAddShieldToRandomRunCard={addShieldToRandomRunCard}
            onRecoverWordEnergy={recoverRunWordEnergy}
            onUpdateRunStatistics={updateRunStatistics}
            runGold={runGold}
            runProgress={runProgress}
            runStatistics={runStatistics}
            selectedDeck={selectedDeck}
            wordFatigue={wordFatigue}
            wordMastery={wordMastery}
          />
        )}
        {currentScreen === "shop" && (
          <Shop
            currentRunDeck={currentRunDeck}
            onNavigate={navigateToScreen}
            onPurchaseDuplicateCard={purchaseDuplicateCard}
            onPurchaseAttackUpgrade={purchaseAttackUpgrade}
            onPurchaseElementUpgrade={purchaseElementUpgrade}
            onPurchaseRemoveCard={purchaseRemoveCard}
            onPurchaseShieldUpgrade={purchaseShieldUpgrade}
            onSpendRunGold={spendRunGold}
            runGold={runGold}
            runProgress={runProgress}
          />
        )}
        {currentScreen === "run-result" && (
          <RunResult onNavigate={navigateToScreen} />
        )}
      </main>
    </div>
  );
}
