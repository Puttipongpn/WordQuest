export { sampleBoss } from "./bosses";
export { foodDeck } from "./foodDeck";
export { natureDeck } from "./natureDeck";
export { sampleMonsters } from "./monsters";
export { sampleShopItems } from "./shopItems";
export { starterDeck } from "./starterDeck";
export { travelDeck } from "./travelDeck";

import { foodDeck } from "./foodDeck";
import { natureDeck } from "./natureDeck";
import { starterDeck } from "./starterDeck";
import { travelDeck } from "./travelDeck";

export const availableDecks = [starterDeck, foodDeck, travelDeck, natureDeck];
