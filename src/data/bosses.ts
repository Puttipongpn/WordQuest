import type { Boss } from "../types";

export const sampleBosses: Boss[] = [
  {
    id: "boss-gatekeeper",
    name: "Gatekeeper",
    hp: 76,
    maxHp: 76,
    attack: 8,
    goldReward: 0,
    imagePlaceholder: "🚪",
    bossNumber: 1,
    specialMoveName: "Vocabulary Lock",
    title: "Baseline Guardian",
    introFlavor:
      "The dungeon quiets. A locked gate rises, and its keeper blocks the final path.",
    defeatText: "The final gate opens with a warm rush of remembered words.",
  },
  {
    id: "boss-word-warden",
    name: "Word Warden",
    hp: 72,
    maxHp: 72,
    attack: 8,
    goldReward: 0,
    imagePlaceholder: "📖",
    bossNumber: 2,
    specialMoveName: "Forgotten Sentence",
    title: "Guardian of Forgotten Words",
    introFlavor:
      "A robed guardian lifts a book of lost vocabulary and challenges your memory.",
    defeatText: "The Warden's book closes, its words finally remembered.",
  },
  {
    id: "boss-grammar-golem",
    name: "Grammar Golem",
    hp: 76,
    maxHp: 76,
    attack: 7,
    goldReward: 0,
    imagePlaceholder: "🗿",
    bossNumber: 3,
    specialMoveName: "Stone Clause",
    title: "Stone Sentence Guardian",
    introFlavor:
      "A stone guardian grinds into motion, each step echoing like heavy punctuation.",
    defeatText: "The golem crumbles into neat little grammar stones.",
  },
  {
    id: "boss-shadow-reader",
    name: "Shadow Reader",
    hp: 64,
    maxHp: 64,
    attack: 10,
    goldReward: 0,
    imagePlaceholder: "🌘",
    bossNumber: 4,
    specialMoveName: "Dark Annotation",
    title: "Dark Scholar",
    introFlavor:
      "A dark scholar reads from the edge of the torchlight, turning every answer into a test.",
    defeatText: "The shadows loosen, and the Reader's ink fades from the page.",
  },
  {
    id: "boss-memory-dragon",
    name: "Memory Dragon",
    hp: 76,
    maxHp: 76,
    attack: 10,
    goldReward: 0,
    imagePlaceholder: "🐉",
    bossNumber: 5,
    specialMoveName: "Recall Flame",
    title: "Vocabulary Beast",
    introFlavor:
      "A dragon made of old lessons coils around the exit and waits for your strongest words.",
    defeatText: "The dragon bows as its hoard of words becomes yours to keep.",
  },
];

export const sampleBoss: Boss = sampleBosses[0];
