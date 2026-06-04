# GAME_DESIGN.md

## Project Concept

WordQuest is a prototype vocabulary learning roguelike deckbuilder web game. The goal is to create a simple and fun English vocabulary practice app where players review word cards, train with mini-games, and eventually use vocabulary knowledge to survive dungeon battles.

The project prioritizes a playable learning loop before final art, balancing, or advanced systems.

## Core Loop

1. Player receives or selects a vocabulary deck.
2. Player reviews vocabulary cards.
3. Player trains with practice mini-games outside dungeon runs.
4. Player enters the dungeon.
5. Player fights monsters using vocabulary mini-games.
6. Correct answers trigger card effects such as attack, shield, or element power.
7. Every 5 monsters, the shop appears.
8. Every 20 monsters, a boss appears.
9. Defeating the boss completes the run and unlocks progress rewards later.

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

Version 1 saves permanent progress with LocalStorage. The current prototype persists word mastery and permanent progress placeholders only.

Current saved data includes:

- Save `version: 1`
- Word mastery
- Unlocked deck ids placeholder
- Completed deck ids placeholder
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

Decks should target around 20 words each. The long-term source for vocabulary is Oxford 3000, but manual seed data is used first.

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
- Each battle question randomly selects Word Choice or Word Match.
- Word Choice shows one prompt card and 4 Thai meaning choices.
- Word Match shows 3 English words and 3 Thai meanings.
- Word Match asks the player to select one English word and one Thai meaning.
- Correct answers trigger the selected word card.
- Correct Word Match pairs trigger the selected English word card.
- Triggered cards deal damage equal to `baseAttack`.
- If a current-run card has been upgraded in the shop, the upgraded `baseAttack` is used for battle damage.
- If a triggered card has a shield effect, the player gains that shield while the card still deals `baseAttack` damage.
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
- After a monster is defeated, the player can spawn the next sample monster.
- When player HP reaches 0, the screen shows `Run Failed`.
- After run failure, the player can restart the local run.

Deferred dungeon systems:

- Run rewards
- Remaining shop purchase logic for element, remove, and duplicate items
- Boss logic
- Permanent mastery updates from battle

Dungeon battle and run progression state are still temporary React state only. LocalStorage is used for permanent progress, not current run progress.

## Mini-Game Plan

Training mini-games:

- Word Choice Training: implemented with local question state and saved mastery updates.
- Match word to meaning: planned.

Battle mini-games:

- Word Choice: implemented.
- Word Match: implemented.
- Word Scramble

Battle mini-games should eventually include timers. Difficulty should affect time limit and damage.

## Shop Plan

Shop presentation is implemented. The active shop purchases are `Upgrade Attack` and `Add Shield`.

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
- If the player does not have enough temporary gold, the Shop shows not-enough-gold feedback.
- Element, remove, and duplicate shop items remain preview-only / coming soon.
- Dungeon can route to Shop when a checkpoint is available.
- Shop can route back to Dungeon.
- Shop upgrades modify only current-run cards.
- Shop upgrades, shield effects, gold, and current-run deck changes are not saved to LocalStorage.

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
- Incorrect answers do not trigger card effects.
- Future shop upgrades and enchantments modify card effects, not player stats directly.

The battle system should be built around card-triggered effects rather than a generic player attack stat.

## Element Concept

Current element types:

- Fire
- Water
- Wind
- Earth

Elements are planned as simple card effect properties for Version 1. Detailed element interactions and balance rules are deferred until element purchases or element cards exist.

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
