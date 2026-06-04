export type DifficultyLevel = 1 | 2 | 3;

export type ElementType = "fire" | "water" | "wind" | "earth";

export type MiniGameType =
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

export type PlayerProgress = {
  unlockedDeckIds: string[];
  completedDeckIds: string[];
  wordMastery: Record<string, WordMastery>;
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  bestMonsterDefeated: number;
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

export type Monster = {
  id: string;
  name: string;
  hp: number;
  attack: number;
  goldReward: number;
  imagePlaceholder: string;
};

export type Boss = Monster & {
  bossNumber: number;
  specialMoveName: string;
};

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: CardEffect | { type: "remove-card" } | { type: "duplicate-card" };
};
