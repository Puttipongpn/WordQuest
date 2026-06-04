# GAME_DESIGN.md

## Project Concept

WordQuest is a prototype vocabulary learning roguelike deckbuilder web game. The goal is to create a simple and fun English vocabulary practice app where players review word cards, train with mini-games, and eventually use vocabulary knowledge to survive dungeon battles.

The project prioritizes a playable learning loop before final art, balancing, or advanced systems.

## Visual Direction

The current prototype uses a cozy fantasy dungeon learning game style.

Current presentation rules:

- Use CSS, Tailwind, emoji, and simple placeholder icons only.
- Make the app feel like a fantasy deckbuilder game before adding final art.
- Use warm adventure backgrounds, game-like panels, collectible vocabulary cards, battle-style dungeon panels, and fantasy shop cards.
- Keep text readable and the app responsive on desktop and reasonable mobile widths.
- Do not add final generated art assets, external UI libraries, backend services, APIs, auth, database, Oxford 3000 import, timers, or advanced element interactions as part of the visual pass.

## Core Loop

1. Player receives or selects a vocabulary deck.
2. Player reviews vocabulary cards.
3. Player trains with practice mini-games outside dungeon runs.
4. Player enters the dungeon.
5. Player fights monsters using vocabulary mini-games.
6. Correct answers trigger card effects such as attack, shield, or element power.
7. Every 5 monsters, the shop appears.
8. Every 20 monsters, a boss appears.
9. Defeating the boss completes the run and marks the current deck completed.

## Permanent Progress vs Run Progress

The game separates long-term learning progress from temporary roguelike run progress.

Permanent progress survives death:

- Unlocked decks
- Word mastery
- Player learning progress
- Completed decks
- Statistics
- Best run stats

Run progress is temporary and is lost on death:

- Gold
- Current HP
- Shield
- Shop upgrades
- Card enchantments
- Duplicated cards
- Removed cards
- Run items
- Current run deck copy
- Monsters defeated
- Current floor
- Next shop checkpoint

Version 1 saves permanent progress with LocalStorage. The current prototype persists word mastery and completed deck progress.

Current saved data includes:

- Save `version: 1`
- Word mastery
- Unlocked deck ids placeholder
- Completed deck ids
- Statistics placeholder

Current saved data intentionally excludes:

- Gold
- Current HP
- Shield
- Shop upgrades
- Card enchantments
- Duplicated cards
- Removed cards
- Current run deck copy
- Monster state
- Monsters defeated
- Current floor
- Next shop checkpoint
- Current dungeon run state

## Deck System

Vocabulary is represented as decks of word cards.

Current deck:

- `Starter Deck`
- 20 realistic sample vocabulary cards
- Stored in `src/data/starterDeck.ts`
- Marked completed in permanent progress after the boss is defeated

Decks should target around 20 words each. The long-term source for vocabulary is Oxford 3000, but manual seed data is used first.

Real new deck unlocks are intentionally deferred.

## Word Card Structure

Each word card currently includes:

- `id`
- `word`
- `meaningTh`
- `partOfSpeech`
- `difficulty`
- `exampleSentence`
- `imagePlaceholder`
- `baseAttack`
- optional `effects`

Difficulty is numeric:

- `1` = Easy
- `2` = Medium
- `3` = Hard

CEFR levels are intentionally deferred.

## Word Mastery Concept

Each word card has mastery from `0` to `5`.

Current prototype rules:

- Default mastery is `0`.
- Correct answers in Training increase that word's mastery by `1`.
- Mastery cannot exceed `5`.
- Wrong answers do not decrease mastery.
- Mastery is loaded from LocalStorage on app start.
- Mastery is saved to LocalStorage when Training answers increase mastery.
- Missing, invalid, or incompatible save data falls back to default progress.

Deck Review displays current saved mastery after page refresh. Training updates mastery on correct answers.

## Training Mode

Training mode is outside dungeon runs.

Training must not change:

- HP
- Gold
- Shield
- Run state
- Shop state
- Dungeon progress

Current mini-game:

- Word Choice Training
- Uses `Starter Deck`
- Uses the first 10 cards for the first prototype
- Shows either image placeholder or English word prompts
- Shows 4 Thai meaning answer choices
- Shows correct/wrong feedback
- Reveals the correct answer after selection
- Advances with Next or restarts after the final question
- Updates saved word mastery on correct answers

## Dungeon Battle Foundation

The first dungeon battle and run progression foundation is implemented with temporary React state only.

Current battle rules:

- Player has HP, functional shield, and gold display.
- Dungeon run progression tracks monsters defeated, current floor, and next shop checkpoint.
- The run deck starts as a temporary copy of `Starter Deck`.
- Dungeon battle questions use the current-run deck copy.
- Current sample monsters are Slime, Goblin, and Bat.
- Each monster has name, HP, max HP, and attack.
- Battle questions use `Starter Deck` vocabulary cards.
- Each battle question randomly selects Word Choice, Word Match, or Word Scramble.
- Word Choice shows one prompt card and 4 Thai meaning choices.
- Word Match shows 3 English words and 3 Thai meanings.
- Word Match asks the player to select one English word and one Thai meaning.
- Word Scramble shows 3 scrambled English word options from the current-run deck.
- Word Scramble asks the player to choose one scrambled card and type the original English word.
- Correct answers trigger the selected word card.
- Correct Word Match pairs trigger the selected English word card.
- Correct Word Scramble answers trigger the selected scrambled word card.
- Triggered cards deal damage equal to `baseAttack`.
- If a current-run card has been upgraded in the shop, the upgraded `baseAttack` is used for battle damage.
- If a triggered card has a shield effect, the player gains that shield while the card still deals `baseAttack` damage.
- If a triggered card has an element effect, Dungeon displays that element in the triggered effects summary.
- Element effects do not change damage, weakness, or resistance in Phase 14.
- Incorrect answers do not trigger card effects.
- Incorrect answers cause the current monster to attack.
- Monster attacks reduce player shield before damaging player HP.
- Shield starts at 0 each run and is temporary run progress.
- When monster HP reaches 0, the screen shows `Monster Defeated`.
- Defeating a monster increases `monstersDefeated` by 1.
- Defeating a monster grants +5 temporary gold.
- Shop checkpoints occur every 5 defeated monsters.
- When a shop checkpoint is reached, Dungeon shows `Shop Available`.
- Dungeon can route to Shop with a `Go To Shop` button.
- Shop can route back to Dungeon with a `Back To Dungeon` button.
- Shop can mutate the current-run deck through Remove Card and Duplicate Card purchases.
- Removed cards no longer appear in Dungeon mini-games.
- Duplicated cards are added as extra current-run deck entries and may appear more often.
- Battle question builders avoid showing the same word twice in a single question, even when duplicates exist in the run deck.
- Remove Card is guarded so battle questions keep enough distinct visible words.
- After a monster is defeated, the player can spawn the next sample monster.
- Boss becomes available after 20 defeated monsters.
- The current sample boss is Gatekeeper.
- Boss battles use the same Word Choice, Word Match, Word Scramble, Card Trigger System, current-run deck, attack, shield, and element display behavior as regular monster battles.
- Wrong boss battle answers cause boss attacks, and shield absorbs boss damage before HP.
- When boss HP reaches 0, the screen shows `Run Complete`.
- Run Complete shows monsters defeated, current floor, final gold, and current-run deck size.
- Boss defeat marks Starter Deck completed in `completedDeckIds`.
- Completed deck ids are saved in LocalStorage permanent progress.
- Run Complete shows reward feedback that Starter Deck was completed and permanent progress was saved.
- Boss defeat does not unlock real new decks yet.
- When player HP reaches 0, the screen shows `Run Failed`.
- After run failure, the player can restart the local run.

Deferred dungeon systems:

- Run rewards beyond the Starter Deck completion marker
- Advanced element interactions
- Deck unlocks
- Permanent mastery updates from battle

Dungeon battle and run progression state are still temporary React state only. LocalStorage is used for permanent progress, not current run progress.

## Mini-Game Plan

Training mini-games:

- Word Choice Training: implemented with local question state and saved mastery updates.
- Match word to meaning: planned.

Battle mini-games:

- Word Choice: implemented.
- Word Match: implemented.
- Word Scramble: implemented with typed input, 3 scrambled current-run card options, and Card Trigger System effects.

Battle mini-games should eventually include timers. Difficulty should affect time limit and damage.

## Shop Plan

Shop presentation is implemented. The active shop purchases are `Upgrade Attack`, `Add Shield`, the four Add Element items, `Remove Card`, and `Duplicate Card`.

The shop appears every 5 monsters during dungeon runs.

Planned shop items:

- Upgrade Attack
- Add Fire Element
- Add Water Element
- Add Wind Element
- Add Earth Element
- Add Shield
- Remove Card
- Duplicate Card

Shop upgrades affect only the current run.

Future shop upgrades should modify card effects or card behavior rather than directly increasing generic player stats.

Current shop rules:

- Shop item data lives in `src/data/shopItems.ts`.
- The Shop screen is labeled `Current Run Shop`.
- Shop upgrades are explained as temporary current-run upgrades.
- Shop item cards show icon placeholder, name, description, cost, and type.
- `Upgrade Attack` is purchasable.
- `Upgrade Attack` uses its existing shop item cost.
- If the player has enough temporary gold, the player can choose one current-run card and increase its `baseAttack` by +2.
- `Add Shield` is purchasable.
- `Add Shield` uses its existing shop item cost.
- If the player has enough temporary gold, the player can choose one current-run card and add Shield +3.
- If the selected card already has a shield effect, Add Shield increases that shield effect by +3.
- `Add Fire Element`, `Add Water Element`, `Add Wind Element`, and `Add Earth Element` are purchasable.
- Element purchases use each shop item's existing cost.
- If the player has enough temporary gold, the player can choose one current-run card and add or replace that card's element effect.
- A card may have one element effect for now.
- Element effects are display-only in Phase 14 and do not modify damage, weakness, or resistance.
- `Remove Card` is purchasable.
- `Remove Card` uses its existing shop item cost.
- If the player has enough temporary gold and the current-run deck has more than 5 cards, the player can choose one current-run card and remove it.
- The minimum current-run deck size is 5 cards.
- Remove Card must leave at least 4 distinct visible words in the current-run deck.
- `Duplicate Card` is purchasable.
- `Duplicate Card` uses its existing shop item cost.
- If the player has enough temporary gold, the player can choose one current-run card and add a unique-id copy of it to the current-run deck.
- Duplicates preserve current-run upgrades, including upgraded `baseAttack`, shield effects, and element effects.
- If the player does not have enough temporary gold, the Shop shows not-enough-gold feedback.
- If a selected current-run card becomes stale after deck mutation, purchase logic refuses the purchase and the Shop falls back to a valid selection.
- Dungeon can route to Shop when a checkpoint is available.
- Shop can route back to Dungeon.
- Shop upgrades modify only current-run cards.
- Shop upgrades, shield effects, element effects, remove/duplicate mutations, gold, and current-run deck changes are not saved to LocalStorage.

## Card Effects

Version 1 card effects are based on:

- Attack
- Shield
- Element

Card effects are stored as an optional `effects` array on `WordCard`. Simple cards can have no effects. Future cards can have one or more effects.

## Card Trigger System

Mini-games use vocabulary cards.

Rules:

- A correct answer successfully triggers the selected word card.
- Triggering a word card activates that card's effects.
- Version 1 effects:
  - Attack
  - Shield
  - Element
- Attack effects currently use the card's `baseAttack` for damage.
- Shield effects currently add player shield when the card triggers.
- Element effects currently display in battle feedback only.
- Incorrect answers do not trigger card effects.
- Future shop upgrades and enchantments modify card effects, not player stats directly.

The battle system should be built around card-triggered effects rather than a generic player attack stat.

## Element Concept

Current element types:

- Fire
- Water
- Wind
- Earth

Elements are simple current-run card effect properties in Phase 14.

Current element rules:

- A card may have one element effect for now.
- Adding a new element to a card replaces the previous element.
- Element effects are temporary current-run card effects.
- Element effects are not saved to LocalStorage.
- Triggered cards display their element in the battle effects summary.
- Element effects do not change damage yet.
- Weakness, resistance, bonus damage, and advanced balance rules are deferred.

## Death Rule

Permanent progress survives death.

Run progress is completely lost on death.

This keeps roguelike tension while preserving vocabulary learning progress.

## Reset Progress

The Home screen includes a simple reset progress action.

Reset progress rules:

- Clear the LocalStorage saved player progress.
- Reset in-memory progress back to defaults.
- Do not affect any backend or remote state because none exists in Version 1.

## Save Versioning

Saved player progress includes `version: 1`.

If saved data is missing, invalid, or incompatible with the current version, the app falls back to default progress and does not crash.

## Version 1 Scope

Version 1 should include:

- Home screen
- Deck Review screen
- Training screen
- Dungeon battle screen
- At least 2 mini-games:
  - Word Match
  - Word Scramble
- Basic shop
- Basic monster battle
- LocalStorage save system
- Simple placeholder visuals

## Features Intentionally Deferred

- Backend
- Database
- Authentication
- External API integration
- Online multiplayer
- Leaderboards
- Account system
- Payment system
- Final art assets
- Real Oxford 3000 import
- Sound effects
- Advanced balancing
- Advanced element interactions
- Save migrations beyond version 1
