export { sampleBoss } from "./bosses";
export { foodDeck } from "./foodDeck";
export { sampleMonsters } from "./monsters";
export { sampleShopItems } from "./shopItems";
export { starterDeck } from "./starterDeck";

import { foodDeck } from "./foodDeck";
import { starterDeck } from "./starterDeck";

export const availableDecks = [starterDeck, foodDeck];
