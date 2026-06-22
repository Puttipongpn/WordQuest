export type DifficultyLevel = 1 | 2 | 3;

export type ElementType = "fire" | "water" | "wind" | "earth";

export type MiniGameType =
  | "word-choice"
  | "word-match"
  | "word-scramble"
  | "image-choice"
  | "meaning-match";

export type CardEffect =
  | {
      type: "attack";
      amount: number;
      description: string;
    }
  | {
      type: "shield";
      amount: number;
      description: string;
    }
  | {
      type: "element";
      element: ElementType;
      amount: number;
      description: string;
    };

export type WordCard = {
  id: string;
  word: string;
  meaningTh: string;
  partOfSpeech: string;
  difficulty: DifficultyLevel;
  exampleSentence: string;
  imagePlaceholder: string;
  baseAttack: number;
  effects?: CardEffect[];
};

export type VocabularyDeck = {
  id: string;
  name: string;
  description: string;
  cards: WordCard[];
};

export type WordMastery = {
  cardId: string;
  correctAnswers: number;
  wrongAnswers: number;
  masteryLevel: number;
  lastReviewedAt?: string;
};

export type WordMasteryByCardId = Record<string, number>;

export type RunStatistics = {
  questionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeouts: number;
  monstersDefeated: number;
  eliteDefeated: number;
  eventsVisited: number;
  bossDefeated: boolean;
  totalDamageDealt: number;
  totalShieldGained: number;
  goldEarned: number;
  cardsUpgradedCount: number;
  cardsRemovedCount: number;
  cardsDuplicatedCount: number;
  elementsAddedCount: number;
};

export type PlayerStatistics = {
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  bestMonstersDefeated: number;
  bestAccuracy: number;
  bestDamageDealt: number;
  completedRuns: number;
  failedRuns: number;
};

export type PlayerProgress = {
  unlockedDeckIds: string[];
  completedDeckIds: string[];
  wordMastery: Record<string, WordMastery>;
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  bestMonstersDefeated: number;
};

export type SavedPlayerProgress = {
  version: 1;
  unlockedDeckIds: string[];
  completedDeckIds: string[];
  wordMastery: WordMasteryByCardId;
  statistics: PlayerStatistics;
};

export type RunState = {
  deckId: string;
  currentHp: number;
  maxHp: number;
  shield: number;
  gold: number;
  monsterIndex: number;
  currentDeck: WordCard[];
  runItems: ShopItem[];
  removedCardIds: string[];
  duplicatedCardIds: string[];
  isComplete: boolean;
  isDefeated: boolean;
};

export type RunProgressState = {
  monstersDefeated: number;
  currentFloor: number;
  nextShopAt: number;
};

export type ActiveRunSummary = {
  deckName: string;
  currentFloor: number;
  monstersDefeated: number;
  nextShopAt: number;
  bossRequirement: number;
  gold: number;
  playerHp?: number;
  shield?: number;
  encounterName?: string;
  statusLabel?: string;
};

export type Monster = {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  goldReward: number;
  imagePlaceholder: string;
};

export type Boss = Monster & {
  bossNumber: number;
  specialMoveName: string;
  title?: string;
  introFlavor?: string;
  defeatText?: string;
};

export type ShopItemType =
  | "upgrade-attack"
  | "add-element"
  | "add-shield"
  | "remove-card"
  | "duplicate-card";

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: ShopItemType;
  icon: string;
  effect?: CardEffect | { type: "remove-card" } | { type: "duplicate-card" };
};
