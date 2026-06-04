import type { Monster } from "../types";

export const sampleMonsters: Monster[] = [
  {
    id: "monster-slime",
    name: "Slime",
    hp: 18,
    maxHp: 18,
    attack: 4,
    goldReward: 6,
    imagePlaceholder: "🟢",
  },
  {
    id: "monster-goblin",
    name: "Goblin",
    hp: 24,
    maxHp: 24,
    attack: 6,
    goldReward: 9,
    imagePlaceholder: "👺",
  },
  {
    id: "monster-bat",
    name: "Bat",
    hp: 20,
    maxHp: 20,
    attack: 5,
    goldReward: 7,
    imagePlaceholder: "🦇",
  },
];
