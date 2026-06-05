import { GOLD_PER_MONSTER } from "../game/balance";
import type { Monster } from "../types";

export const sampleMonsters: Monster[] = [
  {
    id: "monster-slime",
    name: "Slime",
    hp: 18,
    maxHp: 18,
    attack: 4,
    goldReward: GOLD_PER_MONSTER,
    imagePlaceholder: "🟢",
  },
  {
    id: "monster-goblin",
    name: "Goblin",
    hp: 24,
    maxHp: 24,
    attack: 6,
    goldReward: GOLD_PER_MONSTER,
    imagePlaceholder: "👺",
  },
  {
    id: "monster-bat",
    name: "Bat",
    hp: 20,
    maxHp: 20,
    attack: 5,
    goldReward: GOLD_PER_MONSTER,
    imagePlaceholder: "🦇",
  },
];
