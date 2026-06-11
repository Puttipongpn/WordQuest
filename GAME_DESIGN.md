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
- Dungeon battle presentation should prioritize monster/boss encounter first, active mini-game second, player HP/status third, and keep trigger-rule explanations in secondary or collapsible areas.
- Phase 30 Dungeon presentation uses a battle-stage structure: encounter stage, action arena, player-side status band, battle log, and card trigger feedback panel.
- Monster, Elite, Boss, and Event encounters should feel visually distinct while using placeholder assets only.
- Combat feedback should make damage, hits, shield gain, shield absorption, timeout state, and triggered card effects easy to scan.
- Keep text readable and the app responsive on desktop and reasonable mobile widths.
- Do not add final generated art assets, external UI libraries, backend services, APIs, auth, database, Oxford 3000 import, new timer systems, or advanced element interactions as part of visual passes.

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

Version 1 saves permanent progress with LocalStorage. The current prototype persists word mastery, unlocked deck progress, and completed deck progress.

Current saved data includes:

- Save `version: 1`
- Word mastery
- Unlocked deck ids
- Completed deck ids
- Permanent statistics:
  - Total correct answers from ended runs
  - Total wrong answers from ended runs
  - Best monsters defeated
  - Best accuracy
  - Best damage dealt
  - Completed runs
  - Failed runs

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

Run summary statistics are saved only after a run completes or fails. Active run state is never persisted.

## Deck System

Vocabulary is represented as decks of word cards.

Current decks:

- `Starter Deck`
- Stored in `src/data/starterDeck.ts`
- `Food Deck`
- Stored in `src/data/foodDeck.ts`
- `Travel Deck`
- Stored in `src/data/travelDeck.ts`
- `Nature Deck`
- Stored in `src/data/natureDeck.ts`
- Each deck contains 20 manual sample vocabulary cards
- All decks are exported through `availableDecks` from `src/data`

Current selected deck rules:

- `Starter Deck` is selected by default.
- Home provides the first deck selection UI.
- Starter Deck is unlocked by default.
- Food Deck starts locked.
- Travel Deck starts locked.
- Nature Deck starts locked.
- Completing Starter Deck unlocks Food Deck.
- Completing Food Deck unlocks Travel Deck.
- Completing Travel Deck unlocks Nature Deck.
- Completing Nature Deck marks it completed and shows `More decks coming soon`.
- Deck Review uses the selected deck.
- Training uses the selected deck.
- Dungeon current-run deck starts as a temporary copy of the selected deck.
- Shop purchases mutate only the selected deck's current-run copy.
- Boss defeat marks the selected deck completed in permanent progress.
- Changing decks starts a fresh temporary run and does not reset word mastery or completed deck ids.
- Locked decks cannot be selected.
- If a selected deck is locked or unavailable, the app falls back to Starter Deck.

Decks should target around 20 words each. The long-term source for vocabulary is Oxford 3000, but manual seed data is used first.

Real Oxford 3000 import and progression beyond the current manual sample chain are intentionally deferred.

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
- Permanent mastery grants small Dungeon damage bonuses when the mastered word card triggers correctly.
- Mastery 0 grants no Dungeon damage bonus.
- Mastery 1-2 grants +1 Dungeon damage.
- Mastery 3-4 grants +2 Dungeon damage.
- Mastery 5 grants +3 Dungeon damage.
- Mastery bonuses do not mutate the current-run deck and do not save active run state.

Deck Review displays current saved mastery after page refresh and shows the current mastery bonus. Training updates mastery on correct answers and shows mastery before/after feedback.

## Basic Balance

First-pass balance values live in `src/game/balance.ts`.

Current prototype targets:

- Starter Deck should feel approachable for early learners.
- Food Deck can feel slightly more demanding through vocabulary, not new combat rules.
- Travel Deck and Nature Deck extend progression through vocabulary themes, not new combat rules.
- A run should leave enough room to reach the first shop without feeling impossible.
- The boss should feel stronger than regular monsters without being unfair.
- Dungeon timers should add pressure but remain beginner-friendly.

Current shared values:

- Player max HP: `32`
- Starting gold: `20`
- Gold per monster defeated: `6`
- Shop interval: every `5` defeated monsters
- Boss requirement: `20` defeated monsters
- Upgrade Attack amount: `+2`
- Add Shield amount: `+3`
- Minimum current-run deck size: `5`
- Minimum distinct visible words for battle questions: `4`
- Word Choice timer: `14` seconds
- Word Match timer: `20` seconds
- Word Scramble timer: `22` seconds
- Fire bonus damage: `+2`
- Water shield gain: `+2`
- Earth attack reduction: `2`
- Wind defeat gold bonus: `+1`
- Encounter weights: Monster `70`, Event `20`, Elite `10`
- Elite HP multiplier: `1.5`
- Elite attack bonus: `+2`
- Elite bonus gold: `+10`
- Treasure Chest gold: `+10`
- Event attack upgrade: `+1`
- Healing Shrine HP recovery: `5`
- Healing Shrine shield gain: `5`
- Strange Altar HP cost: `5`

Card baseAttack values remain unchanged in the first balance pass. Static timer values are still first-pass values; difficulty scaling and advanced balance systems are deferred.

## Training Mode

Training mode is outside dungeon runs.

Training must not change:

- HP
- Gold
- Shield
- Run state
- Shop state
- Dungeon progress
- Timers

Current mini-game:

- Recall-focused Word Choice Training
- Uses the selected deck
- Uses the first 10 cards for the first prototype
- Randomly selects between English Word to Thai Meaning, Thai Meaning to English Word, and Example Sentence Cloze question types
- English-to-Thai questions show an English word and 4 Thai meaning choices
- Thai-to-English questions show a Thai meaning and 4 English word choices
- Cloze questions blank the target word from the example sentence and ask for the correct English word
- Shows the current question type clearly
- Shows correct/wrong feedback
- Reveals the correct answer after selection
- Advances with Next or restarts after the final question
- Updates saved word mastery on correct answers
- Training is intentionally untimed so players can practice safely.

## Dungeon Battle Foundation

The first dungeon battle and run progression foundation is implemented with temporary React state only.

Current battle rules:

- Player has HP, functional shield, and gold display.
- Dungeon run progression tracks monsters defeated, current floor, and next shop checkpoint.
- The run deck starts as a temporary copy of the selected deck.
- Dungeon battle questions use the current-run deck copy.
- Current sample monsters are Slime, Goblin, and Bat.
- Each monster has name, HP, max HP, and attack.
- Current encounter types are Monster, Elite, and Event.
- Monster encounters use existing battle rules.
- Elite encounters use stronger versions of existing sample monsters.
- Elite monsters have 1.5x normal monster HP, normal attack +2, stronger styling, and +10 bonus current-run gold on defeat.
- Elite encounters count as monster defeats for shop and boss progression.
- Event encounters are non-combat choices.
- Events do not count as defeated monsters and do not advance boss progression.
- Event rewards are temporary current-run rewards and are not saved to LocalStorage.
- After resolving an Event, the next generated encounter cannot be another Event.
- Battle questions use selected deck vocabulary cards through the current-run deck copy.
- Each battle question randomly selects Word Choice, Word Match, or Word Scramble.
- Monster, Elite, and Boss encounters enter Encounter Intro before active combat.
- Encounter Intro shows encounter information, HP, attack, and flavor text.
- Encounter Intro does not start the timer and does not allow battle actions.
- Pressing Start Battle begins the existing battle mini-game flow.
- Event encounters do not use Encounter Intro and show choices immediately.
- Dungeon battle questions are timed.
- Word Choice has a 14-second time limit.
- Word Match has a 20-second time limit.
- Word Scramble has a 22-second time limit.
- Timer countdown runs only while a Dungeon battle question is active, unpaused, and unanswered.
- Pause is available during active Monster, Elite, and Boss combat.
- Pause stops the timer and disables question interaction until Resume.
- Leave Run from Pause ends the current run through the existing Run Failed flow without saving temporary run state.
- If time reaches 0, the result is treated as a wrong answer.
- Word Choice uses recall-focused prompts instead of image-only prompts.
- Word Choice can ask English Word to Thai Meaning, Thai Meaning to English Word, or Example Sentence Cloze.
- Word Choice choices match the prompt direction and reveal the correct answer after selection.
- Word Match shows 3 English words and 3 Thai meanings.
- Word Match asks the player to select one English word and one Thai meaning.
- Word Scramble shows 3 scrambled English word options from the current-run deck.
- Word Scramble asks the player to choose one scrambled card and type the original English word.
- Correct answers trigger the selected word card.
- Correct Word Match pairs trigger the selected English word card.
- Correct Word Scramble answers trigger the selected scrambled word card.
- Triggered cards deal damage equal to `baseAttack`.
- If a current-run card has been upgraded in the shop, the upgraded `baseAttack` is used for battle damage.
- If a triggered card has saved word mastery, its permanent mastery damage bonus is added to final damage.
- If a triggered card has a shield effect, the player gains that shield while the card still deals `baseAttack` damage.
- If a triggered card has an element effect, Dungeon applies that element's first-pass gameplay effect.
- Fire deals +2 bonus damage.
- Water grants +2 shield.
- Wind grants +1 extra temporary gold if the triggered hit defeats the monster or boss.
- Earth reduces the immediate next monster or boss attack by 2.
- Earth pending reduction resets after it is used, after the battle question advances, when a new monster starts, when boss battle starts, or when the run restarts.
- Incorrect answers do not trigger card effects.
- Incorrect answers cause the current monster to attack.
- Timeout does not trigger card effects and causes the current monster or boss to attack.
- Monster attacks reduce player shield before damaging player HP.
- Shield starts at 0 each run and is temporary run progress.
- When monster HP reaches 0, the screen shows `Monster Defeated`.
- Defeating a monster increases `monstersDefeated` by 1.
- Defeating a monster grants +6 temporary gold.
- Current-run statistics track questions answered, correct answers, wrong answers, timeouts, monsters defeated, elite defeated, events visited, boss defeated, total damage dealt, total shield gained, gold earned, cards upgraded, cards removed, cards duplicated, and elements added.
- Healing Shrine shield rewards count toward total shield gained in run summaries.
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
- The current sample boss is Gatekeeper, tuned to 76 HP and 8 attack.
- Boss battles use the same Word Choice, Word Match, Word Scramble, Card Trigger System, current-run deck, attack, shield, and element display behavior as regular monster battles.
- Wrong boss battle answers cause boss attacks, and shield absorbs boss damage before HP.
- When boss HP reaches 0, the screen shows `Run Complete`.
- Run Complete shows selected deck name, monsters defeated, boss defeated, final gold, current-run deck size, correct answers, wrong answers, timeouts, accuracy, total damage dealt, and total shield gained.
- Run Complete also shows elites defeated and events visited.
- Boss defeat marks the selected deck completed in `completedDeckIds`.
- Completed deck ids are saved in LocalStorage permanent progress.
- If Starter Deck is completed, Food Deck is unlocked in `unlockedDeckIds`.
- If Food Deck is completed, Travel Deck is unlocked in `unlockedDeckIds`.
- If Travel Deck is completed, Nature Deck is unlocked in `unlockedDeckIds`.
- If Nature Deck is completed, Run Complete shows that more decks are coming soon.
- Run Complete shows reward feedback that the selected deck was completed and permanent progress was saved.
- Boss defeat does not unlock decks beyond Nature Deck yet.
- When player HP reaches 0, the screen shows `Run Failed`.
- Run Failed shows selected deck name, monsters defeated, current floor, final gold, correct answers, wrong answers, timeouts, accuracy, total damage dealt, and total shield gained.
- Run Failed also shows elites defeated and events visited.
- Completed and failed run summaries update permanent best run stats in LocalStorage.
- After run failure, the player can restart the local run.

Deferred dungeon systems:

- Run rewards beyond the selected deck completion marker
- Advanced element interactions
- Real Oxford 3000 progression beyond the manual sample decks
- Permanent mastery updates from battle

Dungeon battle and run progression state are still temporary React state only. LocalStorage is used for permanent progress, not current run progress.

Timer and pause state are temporary Dungeon UI/combat state and are not saved to LocalStorage.

Run statistics are temporary while a run is active. Only end-of-run summary records update permanent best run stats.

Current Event encounters:

- Treasure Chest
  - Gain +10 gold, or
  - Upgrade a random current-run card attack by +1
- Healing Shrine
  - Recover 5 HP, or
  - Gain 5 shield
- Strange Altar
  - Lose 5 HP and add a random element to a random current-run card, or
  - Leave

## Mini-Game Plan

Training mini-games:

- Recall-focused Word Choice Training: implemented with local question state and saved mastery updates.
- English Word to Thai Meaning: implemented.
- Thai Meaning to English Word: implemented.
- Example Sentence Cloze: implemented.
- Match word to meaning: planned.

Battle mini-games:

- Word Choice: implemented.
- Word Choice uses English/Thai recall and cloze-style prompts rather than image-only prompts.
- Word Choice has a 14-second Dungeon battle timer.
- Word Match: implemented.
- Word Match has a 20-second Dungeon battle timer.
- Word Scramble: implemented with typed input, 3 scrambled current-run card options, and Card Trigger System effects.
- Word Scramble has a 22-second Dungeon battle timer.

Battle mini-game timers currently use simple static values first. Difficulty-based timer scaling is deferred.

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
- Element effects started as display-only in Phase 14 and now apply simple first-pass Dungeon effects from Phase 26.
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
- Element effects now apply simple first-pass gameplay effects during Dungeon battles.
- Incorrect answers do not trigger card effects.
- Future shop upgrades and enchantments modify card effects, not player stats directly.

The battle system should be built around card-triggered effects rather than a generic player attack stat.

## Element Concept

Current element types:

- Fire
- Water
- Wind
- Earth

Elements are simple current-run card effect properties with first-pass Dungeon gameplay effects.

Current element rules:

- A card may have one element effect for now.
- Adding a new element to a card replaces the previous element.
- Element effects are temporary current-run card effects.
- Element effects are not saved to LocalStorage.
- Triggered cards display their element and gameplay effect in the battle effects summary.
- Fire: deal +2 bonus damage.
- Water: gain +2 shield.
- Wind: gain +1 extra temporary gold if the triggered hit defeats the monster or boss.
- Earth: reduce the immediate next monster or boss attack by 2.
- Earth does not persist forever; the pending reduction resets after use or when the battle question advances.
- Weakness, resistance, element matchups, scaling, and advanced balance rules are deferred.

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
