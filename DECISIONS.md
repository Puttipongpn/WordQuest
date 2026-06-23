# DECISIONS.md

This file records accepted project decisions. Update it when architecture, scope, gameplay, data, or workflow decisions change.

## Decision Log

### 2026-06-04: Web-First Approach

- Decision: Build the project as a web app first.
- Reason: The goal is a simple and accessible vocabulary practice prototype.
- Status: Accepted

### 2026-06-04: Use Vite, React, TypeScript, and Tailwind CSS

- Decision: Use Vite + React + TypeScript + Tailwind CSS as the Version 1 tech stack.
- Reason: This stack supports fast prototyping, typed game data, component-based UI, and simple styling.
- Status: Accepted

### 2026-06-04: No Backend for Version 1

- Decision: Do not add backend services in Version 1 unless explicitly requested.
- Reason: Version 1 should focus on making the game playable with minimal complexity.
- Status: Accepted

### 2026-06-04: No Database for Version 1

- Decision: Do not add a database in Version 1.
- Reason: LocalStorage is enough for the first playable prototype.
- Status: Accepted

### 2026-06-04: No Authentication for Version 1

- Decision: Do not add login, accounts, or authentication in Version 1.
- Reason: Authentication does not help validate the core vocabulary roguelike loop.
- Status: Accepted

### 2026-06-04: No External API for Version 1

- Decision: Do not add external API integrations in Version 1 unless explicitly requested.
- Reason: The prototype should work locally with seed data and avoid unnecessary dependencies.
- Status: Accepted

### 2026-06-04: Use LocalStorage for Save Data

- Decision: Save Version 1 permanent progress in LocalStorage.
- Reason: LocalStorage is simple, browser-native, and fits a local prototype.
- Status: Accepted

### 2026-06-04: LocalStorage Saves Permanent Progress Only

- Decision: LocalStorage saves permanent progress only, including word mastery, unlocked deck ids, completed deck ids, and statistics placeholders.
- Reason: Persistent storage should protect vocabulary learning progress without weakening the roguelike run reset rules.
- Status: Accepted

### 2026-06-04: Run Progress Is Not Persisted

- Decision: Do not save gold, HP, shield, shop upgrades, duplicated cards, removed cards, card enchantments, monster state, or current dungeon run state.
- Reason: Run state must remain temporary so death and run completion can fully reset the current run.
- Status: Accepted

### 2026-06-04: Save Data Versioning

- Decision: Saved player progress includes a `version: 1` field.
- Reason: Save versioning gives future phases a simple migration point when saved data changes.
- Status: Accepted

### 2026-06-04: Reset Progress Action

- Decision: Add a simple Home screen action to clear saved progress and reset in-memory progress to defaults.
- Reason: A prototype needs an easy way to test fresh progress and recover from unwanted or invalid saves.
- Status: Accepted

### 2026-06-04: Separate Permanent Progress From Run Progress

- Decision: Treat permanent progress and run progress as different state categories.
- Reason: Vocabulary learning progress should survive death, while roguelike run upgrades should reset.
- Status: Accepted

### 2026-06-04: Permanent Vocabulary Mastery Survives Death

- Decision: Word mastery, unlocked decks, completed decks, learning progress, and statistics are permanent.
- Reason: The learning layer should reward practice even when the player loses a run.
- Status: Accepted

### 2026-06-04: Death Rule

- Decision: Permanent progress survives death. Run progress is completely lost on death.
- Reason: Maintain roguelike tension while preserving vocabulary learning progress.
- Status: Accepted

### 2026-06-04: Roguelike Run State Resets on Death

- Decision: Gold, HP, shield, shop upgrades, enchantments, duplicated cards, removed cards, and run items are temporary.
- Reason: This keeps the dungeon run structure roguelike and replayable.
- Status: Accepted

### 2026-06-04: Vocabulary Deck System

- Decision: Represent vocabulary as decks of word cards.
- Reason: Decks provide a natural bridge between learning review and deckbuilder battles.
- Status: Accepted

### 2026-06-04: Target Around 20 Words Per Deck

- Decision: Each vocabulary deck should contain around 20 words.
- Reason: This is small enough for focused learning and large enough to support card variety.
- Status: Accepted

### 2026-06-04: Oxford 3000 as Main Word Source

- Decision: Use Oxford 3000 vocabulary as the main long-term word source.
- Reason: Oxford 3000 is a recognized practical English vocabulary set.
- Status: Accepted

### 2026-06-04: Manual Seed Vocabulary First

- Decision: Create sample vocabulary decks manually before building a real Oxford 3000 import.
- Reason: Manual seed data is faster for validating gameplay and UI.
- Status: Accepted

### 2026-06-04: Seed Vocabulary Data Location

- Decision: Store seed vocabulary decks in `src/data`.
- Reason: Keeping seed data separate from UI and game logic makes it easier to replace or expand later.
- Status: Accepted

### 2026-06-04: Shared Game Types Location

- Decision: Store shared game data types in `src/types`.
- Reason: A central type layer keeps cards, decks, progress, monsters, shop items, and mini-games consistent across screens and game logic.
- Status: Accepted

### 2026-06-04: Numeric Difficulty Levels

- Decision: Use numeric difficulty levels where `1 = Easy`, `2 = Medium`, and `3 = Hard`.
- Reason: Numeric levels are simple to balance and enough for Version 1; CEFR levels are intentionally deferred.
- Status: Accepted

### 2026-06-04: Starter Deck Seed

- Decision: Create `Starter Deck` as the first sample vocabulary deck with 20 realistic word cards.
- Reason: A complete starter deck gives later screens and systems concrete data to build against.
- Status: Accepted

### 2026-06-04: Screen Navigation Uses React State Initially

- Decision: Use simple React state for screen navigation instead of React Router.
- Reason: The early prototype only needs a small number of screens and should stay simple.
- Status: Accepted

### 2026-06-04: Keep Game Logic Separate From UI

- Decision: Put pure game logic in `src/game` where practical and keep React screens focused on presentation.
- Reason: Separating rules from UI makes the game easier to test, reason about, and extend.
- Status: Accepted

### 2026-06-04: Source Folder Structure

- Decision: Use `src/components`, `src/screens`, `src/game`, `src/data`, `src/types`, and `src/utils`.
- Reason: The structure is simple and maps directly to the project responsibilities.
- Status: Accepted

### 2026-06-04: Initial Screens

- Decision: Version 1 shell includes Home, Deck Review, Training, Dungeon, Shop, and Run Result screens.
- Reason: These screens cover the planned game loop from review to battle to rewards.
- Status: Accepted

### 2026-06-04: Deck Review Uses Starter Deck

- Decision: The Deck Review screen loads `Starter Deck` directly from `src/data`.
- Reason: The first review screen should use real seed data before adding deck selection or unlock logic.
- Status: Superseded by `Selected Deck Controls Core Screens`

### 2026-06-04: Deck Review Card Selection State

- Decision: Deck Review uses local React state to track the currently selected card for the detail panel.
- Reason: Card inspection is presentation-only in Phase 3 and does not need persistence or global state.
- Status: Accepted

### 2026-06-04: Deck Review Mastery Placeholder

- Decision: Display mastery as `0 / 5` for every card in Deck Review.
- Reason: This makes the intended mastery UI visible before the LocalStorage save system exists.
- Status: Accepted

### 2026-06-04: ScreenShell Framing Option

- Decision: `ScreenShell` supports an optional unframed mode for screens that render their own card layouts.
- Reason: Deck Review needs repeated card elements and a detail panel without nesting them inside a larger card container.
- Status: Accepted

### 2026-06-04: Reusable UI Primitives for Presentation Polish

- Decision: Use small reusable UI primitives such as badges, buttons, card panels, progress bars, and stat cards for Phase 9 presentation polish.
- Reason: Shared primitives improve layout consistency and readability without changing gameplay rules or adding complex UI architecture.
- Status: Accepted

### 2026-06-04: Training Does Not Affect HP or Run State

- Decision: Training mode is outside dungeon runs and should not change dungeon HP or temporary run state.
- Reason: Practice should support learning without punishing or altering roguelike progress.
- Status: Accepted

### 2026-06-04: Training Uses Local State First

- Decision: The first Training implementation uses local React state only, with no LocalStorage or permanent mastery updates.
- Reason: Phase 4 should validate the training interaction before adding persistence or progress systems.
- Status: Accepted

### 2026-06-04: Word Choice Training First

- Decision: The first training mini-game is Word Choice Training using `Starter Deck`, 4 Thai meaning answer choices, and image or English word prompts.
- Reason: Word choice is simple to understand, works with existing seed card data, and fits the non-dungeon practice loop.
- Status: Superseded by `Selected Deck Controls Core Screens` for deck source; Word Choice Training remains accepted

### 2026-06-04: Training State Isolation

- Decision: Training must not change HP, gold, shield, run state, shop state, dungeon progress, LocalStorage, or permanent mastery in Phase 4.
- Reason: Training should remain outside dungeon runs and avoid accidental coupling with future battle/save systems.
- Status: Accepted

### 2026-06-04: GAME_DESIGN.md Required Design Document

- Decision: Maintain `GAME_DESIGN.md` as the central accepted gameplay design document.
- Reason: Gameplay systems need one readable source of truth before dungeon, mastery, shop, and mini-game systems become more complex.
- Status: Accepted

### 2026-06-04: In-Memory Mastery Before LocalStorage

- Decision: Implement word mastery in React state before adding LocalStorage persistence.
- Reason: In-memory mastery lets Deck Review and Training validate the learning loop before save-system complexity is introduced.
- Status: Accepted

### 2026-06-04: Mastery Range

- Decision: Each word card has mastery from `0` to `5`.
- Reason: A small fixed range is easy to display, understand, and balance for the Version 1 prototype.
- Status: Accepted

### 2026-06-04: Correct Training Answer Increases Mastery

- Decision: A correct Training answer increases that word's mastery by `1`.
- Reason: Correct answers should provide immediate learning progress feedback without requiring persistence yet.
- Status: Accepted

### 2026-06-04: Wrong Training Answer Does Not Decrease Mastery

- Decision: Wrong Training answers do not decrease mastery in the Version 1 prototype.
- Reason: Early training should encourage practice without punishing mistakes while the learning loop is still being built.
- Status: Accepted

### 2026-06-04: Initial Mini-Games

- Decision: Start with Word Match and Word Scramble as battle mini-games.
- Reason: These are simple, vocabulary-focused, and fit card-triggered battle effects.
- Status: Accepted

### 2026-06-04: Card Effects

- Decision: Version 1 card effects are based on Attack, Shield, and Element.
- Reason: These effects support simple roguelike combat while remaining easy to balance.
- Status: Accepted

### 2026-06-04: Card Effects Data Shape

- Decision: Store card effects as an optional `effects` array on `WordCard`, using simple typed entries for attack, shield, and element effects.
- Reason: An optional array keeps basic cards lightweight while allowing future cards to carry one or more effects.
- Status: Accepted

### 2026-06-04: Card Trigger System

- Decision: Correct mini-game answers trigger the selected vocabulary card, and triggered cards activate their effects.
- Reason: The game is a deckbuilder. Word cards should be the source of combat actions rather than a generic player attack stat.
- Status: Accepted

### 2026-06-04: Dungeon Battle Local State First

- Decision: The first dungeon battle foundation uses local React state only.
- Reason: The project needs a small playable battle loop before adding persistence, shop, boss, or reward systems.
- Status: Accepted

### 2026-06-04: Run Progression Foundation

- Decision: Add a temporary dungeon run progression foundation that tracks monsters defeated, current floor, and next shop checkpoint.
- Reason: The dungeon needs visible run flow before adding purchases, boss battles, rewards, deck mutation, or element interactions.
- Status: Accepted

### 2026-06-04: Shop Checkpoint Routing

- Decision: Show a shop checkpoint every 5 defeated monsters and allow Dungeon to route to Shop and back to Dungeon.
- Reason: This validates the planned dungeon-to-shop pacing without implementing purchase logic.
- Status: Accepted

### 2026-06-04: Temporary Run Progress

- Decision: Phase 10 run progression is temporary React state and is not saved to LocalStorage.
- Reason: Run progress should reset on page refresh, death, or future run completion while permanent learning progress remains separate.
- Status: Accepted

### 2026-06-04: Sample Monsters First

- Decision: Start dungeon battle with placeholder sample monsters: Slime, Goblin, and Bat.
- Reason: Simple monsters provide enough variety to validate battle flow without building monster progression yet.
- Status: Accepted

### 2026-06-04: Battle Damage Uses Triggered Card Base Attack

- Decision: Correct battle answers trigger the selected word card and deal damage equal to that card's `baseAttack`.
- Reason: This implements the Card Trigger System in the simplest playable way.
- Status: Accepted

### 2026-06-04: No Battle Rewards in Phase 5

- Decision: Phase 5 does not grant run rewards, gold rewards, permanent mastery, or unlocks from battle.
- Reason: The first dungeon foundation should validate combat flow before adding progression and reward systems.
- Status: Accepted

### 2026-06-04: No Shop or Boss Logic in Phase 5

- Decision: Phase 5 excludes shop logic and boss logic.
- Reason: Shop and boss systems should be layered on after the basic monster battle loop is stable.
- Status: Accepted

### 2026-06-04: Battle Mini-Game Structure

- Decision: Dungeon battle questions use a simple mini-game structure that can render different battle mini-game types.
- Reason: Combat needs a small extensible surface before adding more battle mini-games and timers.
- Status: Accepted

### 2026-06-04: Word Match Battle Mini-Game

- Decision: Add Word Match as the first battle mini-game beyond Word Choice, using 3 English words and 3 Thai meanings.
- Reason: Word Match fits the vocabulary learning goal and exercises the Card Trigger System with a selected word card.
- Status: Accepted

### 2026-06-04: Random Battle Mini-Game Selection

- Decision: Each battle question randomly selects between the currently implemented battle mini-games.
- Reason: Random selection adds early variety while keeping the battle loop simple.
- Status: Accepted

### 2026-06-04: Word Scramble Battle Mini-Game

- Decision: Add Word Scramble as the third Dungeon battle mini-game.
- Reason: Word Scramble adds spelling recall practice while still fitting the vocabulary card battle loop.
- Status: Accepted

### 2026-06-04: Typed Input First for Scramble

- Decision: The first Word Scramble implementation uses typed answer input instead of click-to-order letters.
- Reason: Typed input is simpler to implement, easier to maintain, and enough to validate the mini-game.
- Status: Superseded by `Word Scramble Uses Tile-Based Letter Input`

### 2026-06-04: Scramble Uses Current-Run Deck and Card Trigger System

- Decision: Word Scramble chooses cards from the current-run deck, and correct answers trigger the selected scrambled word card.
- Reason: Scramble must honor temporary attack and shield upgrades while keeping cards as the source of combat actions.
- Status: Accepted

### 2026-06-04: Mini-Games Should Use Timers

- Decision: Mini-games should eventually include timers, with difficulty affecting time limits and damage.
- Reason: Timers add battle tension and give difficulty a gameplay role.
- Status: Accepted

### 2026-06-04: Shop Every 5 Monsters

- Decision: Show the shop every 5 monsters.
- Reason: Regular shop breaks create deckbuilder pacing and upgrade choices.
- Status: Accepted

### 2026-06-04: Boss Every 20 Monsters

- Decision: Show a boss at monster 20.
- Reason: A boss gives each run a clear milestone and completion goal.
- Status: Accepted

### 2026-06-04: Boss Appears at Monster 20

- Decision: The first boss becomes available after 20 defeated monsters.
- Reason: A fixed milestone gives the prototype a clear run climax without needing a full floor system yet.
- Status: Accepted

### 2026-06-04: Boss Uses the Same Card Trigger System

- Decision: Boss battles use Word Choice, Word Match, Word Scramble, and the same triggered card effects as regular monster battles.
- Reason: Reusing the established battle system keeps boss implementation simple and ensures current-run card upgrades matter.
- Status: Accepted

### 2026-06-04: Boss Defeat Creates Run Complete State

- Decision: Defeating the boss shows Run Complete with a simple run summary.
- Reason: The prototype needs a visible run endpoint before rewards, unlocks, and completion persistence are added.
- Status: Accepted

### 2026-06-04: Run Rewards Are Deferred

- Decision: Run rewards beyond marking the current deck completed are deferred.
- Reason: The prototype should persist one simple completion reward before adding broader reward design, deck unlocks, or balancing.
- Status: Accepted

### 2026-06-04: Boss Defeat Marks Current Deck Completed

- Decision: Defeating the boss marks the current deck as completed.
- Reason: A small permanent completion reward makes Run Complete meaningful without adding full deck unlock design yet.
- Status: Accepted

### 2026-06-04: Completed Deck Ids Are Permanent Progress

- Decision: `completedDeckIds` are saved in LocalStorage permanent progress and are cleared only by Reset Progress.
- Reason: Deck completion should survive refreshes and failed runs while temporary run state remains unsaved.
- Status: Accepted

### 2026-06-04: Real Deck Unlocks Are Deferred

- Decision: Completing a deck does not unlock a real progression deck yet.
- Reason: Phase 17 should prove completion persistence before importing Oxford 3000 or adding deck unlock progression.
- Status: Accepted

### 2026-06-04: Shop Upgrades Affect Only Current Run

- Decision: Shop upgrades, card enchantments, duplication, removal, and run items affect only the active run.
- Reason: Temporary upgrades preserve roguelike reset rules.
- Status: Accepted

### 2026-06-04: Current Run Deck Copy

- Decision: Dungeon runs use a temporary copy of `Starter Deck`, and shop upgrades modify only that current-run copy.
- Reason: Shop upgrades need to affect battle cards without mutating seed data or permanent vocabulary progress.
- Status: Superseded by `Selected Deck Controls Core Screens`

### 2026-06-04: Upgrade Attack Purchase First

- Decision: Implement `Upgrade Attack` as the first active shop purchase before element, shield, remove, or duplicate items.
- Reason: A simple attack upgrade proves that shop purchases can modify current-run cards and affect battle damage.
- Status: Accepted

### 2026-06-04: Gold as Temporary Run Progress

- Decision: Gold starts at 20, increases by 5 when a monster is defeated, and is temporary run progress.
- Reason: Gold is needed to test the first shop purchase while preserving roguelike reset rules.
- Status: Accepted

### 2026-06-04: Shop Upgrades Are Not Persisted

- Decision: Current-run shop upgrades, gold, and modified run deck cards are not saved to LocalStorage.
- Reason: Run upgrades should reset on run restart, page refresh, or app reload and should not become permanent learning progress.
- Status: Accepted

### 2026-06-04: Shield Absorbs Damage Before HP

- Decision: Monster attacks reduce player shield before damaging player HP.
- Reason: Shield needs a clear defensive role that supports simple roguelike combat and readable battle feedback.
- Status: Accepted

### 2026-06-04: Add Shield as Second Active Shop Purchase

- Decision: Activate `Add Shield` after `Upgrade Attack` as the second current-run shop purchase.
- Reason: Add Shield proves that shop purchases can add card effects, not only change base attack.
- Status: Accepted

### 2026-06-04: Shield Effects Are Temporary Current-Run Card Effects

- Decision: Add Shield modifies only current-run card effects by adding or increasing Shield +3 on the selected card.
- Reason: Shop upgrades should affect the active run deck without mutating seed vocabulary data or permanent progress.
- Status: Accepted

### 2026-06-04: Shield Is Not Persisted

- Decision: Player shield and current-run card shield effects are not saved to LocalStorage.
- Reason: Shield is run progress and must reset on run restart, death, page refresh, or app reload.
- Status: Accepted

### 2026-06-04: Element Shop Items Are Active

- Decision: Activate Add Fire Element, Add Water Element, Add Wind Element, and Add Earth Element as current-run shop purchases.
- Reason: Element purchases complete the basic Version 1 card effect set without adding advanced combat interactions yet.
- Status: Accepted

### 2026-06-04: One Element Per Card for Now

- Decision: A current-run card may have one element effect for now, and buying a new element replaces any existing element on that card.
- Reason: One element per card keeps Phase 14 simple and avoids early balancing complexity.
- Status: Accepted

### 2026-06-04: Element Effects Are Display-Only in Phase 14

- Decision: Element effects show in battle feedback but do not change damage, weakness, resistance, or other combat math.
- Reason: The first element phase should validate card modification and UI feedback before adding advanced interactions.
- Status: Superseded by Phase 26 first-pass element gameplay effects

### 2026-06-04: Element Effects Are Temporary Current-Run Card Effects

- Decision: Element effects modify only current-run cards and are not saved to LocalStorage.
- Reason: Element upgrades are run progress and must reset with the current run.
- Status: Accepted

### 2026-06-04: Remove Card Active Shop Purchase

- Decision: Activate Remove Card as a current-run shop purchase.
- Reason: Removing cards is a core deckbuilder action and lets players shape the temporary run deck.
- Status: Accepted

### 2026-06-04: Duplicate Card Active Shop Purchase

- Decision: Activate Duplicate Card as a current-run shop purchase.
- Reason: Duplicating cards is a core deckbuilder action and lets players increase the chance of seeing upgraded cards.
- Status: Accepted

### 2026-06-04: Minimum Current-Run Deck Size

- Decision: The current-run deck cannot be reduced below 5 cards.
- Reason: A minimum deck size prevents battle mini-games from running out of card options and keeps runs playable.
- Status: Accepted

### 2026-06-04: Minimum Distinct Battle Words After Removal

- Decision: Remove Card must leave at least 4 distinct visible words in the current-run deck.
- Reason: Word Choice needs enough unique answer options, and Word Match / Word Scramble should not show duplicate visible words in one question.
- Status: Accepted

### 2026-06-04: Duplicates Preserve Current-Run Upgrades

- Decision: Duplicate Card copies the selected card's current-run attack, shield effects, and element effects.
- Reason: Duplication should reward run-building decisions by copying the card as it exists in the active run.
- Status: Accepted

### 2026-06-04: Remove and Duplicate Are Temporary Run Deck Mutations

- Decision: Removed cards and duplicated cards affect only the current-run deck and are not saved to LocalStorage.
- Reason: Deck mutation is run progress and must reset on death, run restart, page refresh, or app reload.
- Status: Accepted

### 2026-06-04: Shop Presentation First

- Decision: Build the Shop screen and sample shop item data before implementing purchase logic.
- Reason: The project needs a clear shop UI and data shape before card mutation, gold spending, and run routing are added.
- Status: Accepted

### 2026-06-04: Shop Items Are Current-Run Only

- Decision: Phase 7 shop item data represents current-run upgrades only.
- Reason: This keeps shop design aligned with the accepted permanent progress versus run progress split.
- Status: Accepted

### 2026-06-04: Shop Item Effects Are Placeholders in Phase 7

- Decision: Phase 7 shop item effects are preview placeholders and do not modify cards, decks, gold, run state, or card effects.
- Reason: Shop presentation should be validated before adding purchase behavior and balancing.
- Status: Accepted

### 2026-06-04: Placeholder Art for Version 1

- Decision: Use emoji, CSS, and simple placeholders for Version 1 visuals.
- Reason: The project should prioritize playable systems before final art.
- Status: Accepted

### 2026-06-04: Placeholder Game-Style UI Before Final Art

- Decision: Phase 19 applies a cozy fantasy dungeon game-style UI using CSS, Tailwind, emoji, and placeholder icons only.
- Reason: The prototype should feel more like a game before final art assets are generated or imported.
- Status: Accepted

### 2026-06-04: Multiple Decks Supported

- Decision: Support multiple manual sample decks through `availableDecks`, currently Starter Deck, Food Deck, Travel Deck, Nature Deck, Daily Life Deck, and Emotion Deck.
- Reason: The app needs to prove the multi-deck flow before importing Oxford 3000 or building advanced unlock progression.
- Status: Accepted

### 2026-06-04: Selected Deck Controls Core Screens

- Decision: The selected deck controls Deck Review, Training, Dungeon current-run deck creation, and Run Complete deck completion.
- Reason: Deck selection should be the single source of truth for the active learning and dungeon loop.
- Status: Accepted

### 2026-06-04: Changing Decks Resets Temporary Run State

- Decision: Changing decks resets temporary run state and the current-run deck, but does not reset word mastery or completed deck ids.
- Reason: A new active deck should start a fresh run while preserving permanent learning progress.
- Status: Accepted

### 2026-06-04: Oxford 3000 Import Still Deferred

- Decision: Do not import Oxford 3000 in Phase 21; continue using small manual sample decks.
- Reason: Manual decks are enough to validate multi-deck app flow without adding data import complexity.
- Status: Accepted

### 2026-06-04: Starter Deck Unlocked By Default

- Decision: Starter Deck is unlocked by default for all new or reset saves.
- Reason: Players need an always-available first deck to review, train, and enter dungeon runs.
- Status: Accepted

### 2026-06-04: Food Deck Unlocks After Starter Deck Completion

- Decision: Food Deck starts locked and unlocks when Starter Deck is completed.
- Reason: This proves deck unlock progression with existing manual decks before adding Oxford 3000 or broader progression.
- Status: Accepted

### 2026-06-04: Unlocked Deck Ids Are Permanent Progress

- Decision: `unlockedDeckIds` are saved in LocalStorage permanent progress and reset only through Reset Progress.
- Reason: Deck access should survive refreshes and failed runs while temporary run state remains unsaved.
- Status: Accepted

### 2026-06-04: Real Progression Beyond Food Deck Was Deferred In Phase 22

- Decision: Completing Food Deck marks it completed but does not unlock another real deck yet.
- Reason: Phase 22 should validate unlock persistence without adding more decks, Oxford 3000 imports, or advanced progression design.
- Status: Superseded by Phase 31

### 2026-06-11: Expanded Manual Deck Progression

- Decision: The manual deck unlock chain is Starter Deck → Food Deck → Travel Deck → Nature Deck, with Nature completion showing more-decks-coming-soon copy.
- Reason: The prototype needs longer-term deck progression content before Oxford 3000 import or advanced progression systems.
- Status: Superseded by Phase 52

### 2026-06-18: Expanded Manual Deck Progression Through Emotion Deck

- Decision: The manual deck unlock chain is Starter Deck → Food Deck → Travel Deck → Nature Deck → Daily Life Deck → Emotion Deck, with Emotion completion showing more-decks-coming-soon copy.
- Reason: Phase 52 expands playable vocabulary content while keeping Oxford 3000 import, new gameplay systems, save redesign, and final art deferred.
- Status: Accepted

### 2026-06-11: Deck Progression Helpers

- Decision: Store manual deck progression rules in `src/game/deckProgression.ts` while keeping the existing LocalStorage data shape.
- Reason: A shared helper keeps unlock requirements, Home copy, Run Complete rewards, and saved-progress normalization consistent without redesigning the save system.
- Status: Accepted

### 2026-06-05: Training Focuses On Recall

- Decision: Training should focus on vocabulary recall and contextual practice, not only recognition.
- Reason: Recall-oriented questions build stronger learning than simple picture-to-meaning multiple choice.
- Status: Accepted

### 2026-06-05: Cloze Questions For Context Practice

- Decision: Add Example Sentence Cloze questions that blank the target word and ask the player to choose the correct English word.
- Reason: Cloze prompts practice vocabulary in sentence context and connect word meaning to real usage.
- Status: Accepted

### 2026-06-05: Picture-To-Thai Is Not Main Training Pattern

- Decision: Picture-to-Thai choice is no longer the main Training or Dungeon Word Choice pattern.
- Reason: The format is useful as a light recognition prompt, but the prototype should prioritize English/Thai recall and sentence context.
- Status: Accepted

### 2026-06-05: Dungeon Mini-Games Use Timers

- Decision: Dungeon Word Choice, Word Match, and Word Scramble use battle timers.
- Reason: Dungeon battles should create pressure and combat tension, unlike safe practice in Training.
- Status: Accepted

### 2026-06-05: Training Remains Untimed

- Decision: Do not add timers to Training.
- Reason: Training is for safe learning and mastery practice without dungeon pressure.
- Status: Accepted

### 2026-06-05: Timeout Is Wrong Answer

- Decision: A Dungeon timeout is treated as a wrong answer.
- Reason: Timeout should preserve existing combat rules: no card trigger, monster or boss attacks, and shield absorbs damage before HP.
- Status: Accepted

### 2026-06-05: Static Timer Values First

- Decision: Use simple static time limits first, currently tuned to Word Choice 14 seconds, Word Match 20 seconds, and Word Scramble 22 seconds.
- Reason: Static values prove the timer system before difficulty scaling, balancing, or upgrades are introduced.
- Status: Accepted

### 2026-06-05: Basic Balance Constants

- Decision: Shared first-pass balance values live in `src/game/balance.ts`.
- Reason: Centralizing common numbers makes future tuning easier and reduces mismatches between UI copy, data, and gameplay logic.
- Status: Accepted

### 2026-06-05: Current Prototype Balance Targets

- Decision: First-pass tuning should keep Starter Deck approachable, give players enough room to reach the first shop, and make the boss stronger than normal monsters without feeling unfair.
- Reason: The prototype needs a playable baseline before advanced balancing, scaling, or Oxford 3000 vocabulary import.
- Status: Accepted

### 2026-06-05: Static Timer Values Remain First-Pass Values

- Decision: Dungeon timer limits remain static first-pass values rather than scaling by deck, difficulty, monster, or mastery.
- Reason: Static timers keep the current combat loop predictable while the prototype is still validating core learning and run systems.
- Status: Accepted

### 2026-06-05: Elements Have First-Pass Gameplay Effects

- Decision: Dungeon element effects are now functional: Fire adds damage, Water grants shield, Wind grants extra gold on defeat, and Earth reduces the next attack.
- Reason: Elements should matter in combat while staying small enough to balance during the prototype.
- Status: Accepted

### 2026-06-05: Element Effects Remain Current-Run Only

- Decision: Element effects and their combat benefits remain temporary current-run card effects and are not saved to LocalStorage.
- Reason: Element upgrades are shop/run progress, not permanent vocabulary learning progress.
- Status: Accepted

### 2026-06-05: Advanced Element Matchups Deferred

- Decision: Do not add elemental weakness, resistance, matchups, scaling, or advanced balance interactions yet.
- Reason: Phase 26 should prove simple element utility before adding complexity.
- Status: Accepted

### 2026-06-05: Run Summary Stats Saved After Run Ends

- Decision: Save run summary statistics only when a run completes or fails.
- Reason: The player should get meaningful run history without persisting active dungeon state.
- Status: Accepted

### 2026-06-05: Best Run Stats Are Permanent Progress

- Decision: Best monsters defeated, best accuracy, best damage dealt, completed runs, and failed runs are permanent statistics saved in LocalStorage.
- Reason: These summaries make runs feel meaningful while fitting the accepted permanent progress model.
- Status: Accepted

### 2026-06-05: Active Run State Remains Unsaved

- Decision: Do not save active HP, shield, gold, current-run deck, monster state, boss state, timer state, or shop upgrades while a run is in progress.
- Reason: Active dungeon progress is temporary roguelike run state and should reset on death, restart, refresh, or app reload.
- Status: Accepted

### 2026-06-05: Elite Encounters Are Temporary Run Content

- Decision: Elite encounters use stronger versions of existing sample monsters and provide current-run-only bonus gold.
- Reason: Elites add variety and risk during runs without adding permanent rewards or new progression systems.
- Status: Accepted

### 2026-06-05: Event Encounters Are Temporary Run Content

- Decision: Event encounters are non-combat current-run choices with temporary rewards or costs.
- Reason: Events make dungeon progression less repetitive without changing combat rules or save architecture.
- Status: Accepted

### 2026-06-05: Event Rewards Follow Roguelike Reset Rules

- Decision: Event rewards never bypass run reset rules and are not saved as permanent progress.
- Reason: Event rewards affect only the current run, matching shop upgrades, gold, shield, and run deck mutation rules.
- Status: Accepted

### 2026-06-05: Events Do Not Count Toward Boss Progression

- Decision: Event encounters do not count as monster defeats and do not advance shop or boss progression.
- Reason: Events are non-combat variety nodes, not combat victories.
- Status: Accepted

### 2026-06-05: Elite Encounters Count As Monster Defeats

- Decision: Defeating an Elite counts as a monster defeat for shop checkpoints and boss progression.
- Reason: Elites are combat encounters and should move the run forward like normal monsters.
- Status: Accepted

### 2026-06-05: Events Do Not Chain Immediately

- Decision: After resolving an Event, the next generated encounter cannot be another Event.
- Reason: Events should add variety without causing long non-combat chains or delaying the normal dungeon battle rhythm too much.
- Status: Accepted

### 2026-06-06: Phase 30 Placeholder Battle Presentation

- Decision: Phase 30 improves Dungeon game feel using CSS, Tailwind utility classes, emoji, and placeholder assets only.
- Reason: The prototype needs a stronger playable battle-scene feel before final art assets, while preserving current combat math, save rules, deck rules, shop rules, timer rules, and encounter rules.
- Status: Accepted

### 2026-06-11: Combat Encounter Intro Before Timers

- Decision: Combat encounters use Encounter Intro before timers begin.
- Reason: Players should be able to inspect Monster, Elite, and Boss encounters before a timed vocabulary question starts.
- Status: Accepted

### 2026-06-11: Pause Stops Active Dungeon Combat

- Decision: Pausing active Dungeon combat stops the timer and disables question interaction until Resume.
- Reason: Pause should be a true interruption state without changing combat math, save rules, or balance values.
- Status: Accepted

### 2026-06-11: Permanent Mastery Grants Small Dungeon Bonuses

- Decision: Permanent word mastery can grant small Dungeon combat bonuses.
- Reason: Mastery should feel useful in battle while remaining a permanent learning bonus that does not mutate current-run decks or save active run state.
- Status: Accepted

### 2026-06-11: Dungeon Battle Screens Prioritize No-Scroll Gameplay Visibility

- Decision: Dungeon battle screens prioritize no-scroll gameplay visibility on desktop.
- Reason: Player status, encounter status, timer, active quiz, and recent combat feedback should be visible together so combat feels like a game battle screen rather than a scrolling document page.
- Status: Accepted

### 2026-06-11: Encounter Intro And Active Battle Use Separate Layouts

- Decision: Encounter Intro and Active Battle use separate Dungeon layouts.
- Reason: Encounter inspection should keep Start Battle visible and avoid rendering battle feedback or quiz sections before combat, while active battle should make the current quiz the dominant playable area.
- Status: Accepted

### 2026-06-11: Dungeon Uses True Fullscreen Battle Mode

- Decision: Dungeon uses true fullscreen battle mode with normal navigation chrome hidden.
- Reason: Dungeon combat should feel like a game screen where the current question, timer, answers, and battle status are immediately playable instead of a scrollable web page or dashboard.
- Status: Accepted

### 2026-06-12: Active Battle Targets 1366x768 Fit

- Decision: Active Dungeon battle layouts should fit inside a 1366x768 desktop viewport.
- Reason: The minimum desktop target should keep player HP, monster HP, timer, current quiz, and answer controls visible without page scrolling; secondary information should collapse into accordions.
- Status: Accepted

### 2026-06-12: Active Battle Does Not Reveal Triggered Card Before Answer

- Decision: Active Dungeon battle should not show a persistent triggered-card or correct-target preview before the player answers.
- Reason: Pre-answer trigger previews can leak the answer and weaken vocabulary recall, especially in Word Choice, Word Match, and Word Scramble.
- Status: Accepted

### 2026-06-12: Card Stats Live On Answer Options

- Decision: Compact card stats such as attack, shield, element, and mastery bonus should appear on battle answer options where relevant.
- Reason: Players still need deckbuilder information while choosing, but that information should not reveal the correct answer through a separate trigger preview.
- Status: Accepted

### 2026-06-12: Battle Result Feedback Uses Compact Overlay

- Decision: Correct, wrong, and timeout feedback should appear as compact result overlays in the quiz area after the player answers or time expires.
- Reason: Feedback should be visible without pushing the active quiz and controls below the fold.
- Status: Accepted

### 2026-06-12: Mobile Battle Prioritizes Playable Quiz Controls

- Decision: On small screens, Dungeon battle layout should prioritize the current quiz and answer controls while secondary panels collapse or move below the arena.
- Reason: Mobile can tolerate some scrolling, but the playable question area must not be trapped or blocked by side information.
- Status: Accepted

### 2026-06-12: Battle Option Stats Sit On The Right

- Decision: Battle option cards should place compact stats on the right side of each option.
- Reason: Keeping ATK, shield, element, and mastery chips beside the answer text reduces vertical height and improves scan speed on smaller desktop screens.
- Status: Accepted

### 2026-06-12: Result Feedback Uses Non-Pushing Overlay

- Decision: Battle result feedback should appear as a compact centered overlay instead of an inline panel that pushes quiz layout down.
- Reason: Correct, wrong, and timeout feedback must be visible without causing answer controls or typed input to overflow below the viewport.
- Status: Accepted

### 2026-06-12: Timer And Short Instructions Can Live In Battle Control Panel

- Decision: The timer and short mini-game instruction may live in the right-side Battle Control Panel.
- Reason: Moving control/status information out of the quiz arena preserves space for the active prompt, answer options, typed input, and submit actions.
- Status: Accepted

### 2026-06-12: Word Match Stats Only On English Card Side

- Decision: Word Match shows card stats only on the English card side.
- Reason: The English side represents the card that can trigger, while showing stats on both English and Thai options can create stat-based answer hints.
- Status: Accepted

### 2026-06-12: Word Match Uses Compact Selected-Pair Footer

- Decision: Word Match uses a compact selected-pair footer with the Check Pair action.
- Reason: The footer keeps the current selection and submit action close to the choices without adding large instruction boxes or wasted vertical space.
- Status: Accepted

### 2026-06-12: Defeat Feedback Uses Defeated Messaging

- Decision: Result feedback should use `Defeated!` messaging when player HP reaches 0 instead of only generic wrong or timeout feedback.
- Reason: HP reaching 0 is a run-ending game outcome and should be communicated clearly and emotionally differently from an ordinary wrong answer.
- Status: Accepted

### 2026-06-12: Battle Motion Uses CSS-Only Hooks

- Decision: Battle stage motion uses CSS-only animation hooks and does not change combat rules.
- Reason: The prototype needs livelier combat feedback without adding animation libraries, sprite systems, or gameplay side effects.
- Status: Accepted

### 2026-06-12: Post-Encounter Actions Live In One Result Area

- Decision: Post-encounter actions should appear in a single result overlay/action area to avoid duplicated battle controls.
- Reason: A single action area makes the result flow clearer and prevents scattered buttons such as duplicated shop, next encounter, or restart actions.
- Status: Accepted

### 2026-06-12: Use Next Encounter Wording

- Decision: Use `Next Encounter`, `Continue Dungeon`, or similar labels instead of player-facing `Spawn Next Monster`.
- Reason: The next encounter may be a monster, elite, event, shop checkpoint, or boss milestone, so generic adventure wording is clearer.
- Status: Accepted

### 2026-06-13: Placeholder Monster Variety Expanded

- Decision: Expand placeholder normal monster variety while preserving existing encounter and combat rules.
- Reason: More monsters make runs feel less repetitive without adding new systems, scaling rules, art assets, or combat changes.
- Status: Accepted

### 2026-06-13: Shop Uses Limited Randomized Offers

- Decision: Shop uses limited randomized offers instead of exposing all deck-edit controls at once.
- Reason: A smaller offer set makes the shop feel more like a roguelike deckbuilder stop and less like an admin editing panel.
- Status: Accepted

### 2026-06-13: Shop Target Selection Uses Limited Modal

- Decision: Shop item target selection uses a limited random set of eligible current-run word cards in a modal.
- Reason: Focused target selection keeps purchases tactical, reduces visual overload, and avoids showing the full run deck for every shop item.
- Status: Accepted

### 2026-06-13: Shop Offers Can Be Rerolled With Run Gold

- Decision: Shop offers can be rerolled for 5 current-run gold.
- Reason: Rerolling gives controlled player choice while keeping shop outcomes temporary and within roguelike run reset rules.
- Status: Accepted

### 2026-06-13: Word Energy Is Current-Run Only

- Decision: Word Energy / Card Fatigue is current-run-only and encourages vocabulary variety without reducing permanent mastery.
- Reason: Repeated words should become less common during a run, but learned vocabulary progress should never be punished or downgraded.
- Status: Accepted

### 2026-06-13: Fatigue Is Tracked By Normalized Word

- Decision: Card fatigue is tracked by normalized word text instead of card id.
- Reason: Duplicated copies of the same word should share usage so duplication cannot bypass the vocabulary variety system.
- Status: Accepted

### 2026-06-13: Fatigue Affects Appearance Chance Only

- Decision: Fatigue affects battle question card appearance chance and does not reduce damage, shield, element effects, or mastery bonuses.
- Reason: Correct answers should remain rewarding while the system gently nudges the player toward varied vocabulary.
- Status: Accepted

### 2026-06-14: Word Energy Thresholds Are Softer

- Decision: Word Energy thresholds are softened so Low Energy appears at usage 5+ instead of usage 3+.
- Reason: Longer runs should still encourage vocabulary variety without making most of the deck look exhausted too early.
- Status: Accepted

### 2026-06-14: Shop Return Recovers Word Energy

- Decision: Leaving Shop for Dungeon recovers current-run Word Energy by reducing each tracked usage count by 1.
- Reason: Shop checkpoints are natural pacing breaks, and small recovery keeps long runs from feeling like every word is unusable.
- Status: Accepted

### 2026-06-14: Abandon Run Preserves Permanent Progress

- Decision: Abandon Run ends only the current temporary run and never clears permanent progress.
- Reason: Players need a safe way to leave a roguelike run without losing word mastery, unlocked decks, completed decks, or saved statistics.
- Status: Accepted

### 2026-06-14: Reset Progress Is The Only Permanent Reset

- Decision: Reset Progress is the only player action that clears permanent progress.
- Reason: Permanent learning progress should be protected from ambiguous run-exit actions.
- Status: Accepted

### 2026-06-14: Use Abandon Run Wording

- Decision: Replace player-facing `End Run` and `Leave Run` wording with `Abandon Run`.
- Reason: Abandon Run communicates that only the current temporary run will be lost.
- Status: Accepted

### 2026-06-14: Expanded Events Are Current-Run Only

- Decision: Expanded dungeon events provide current-run-only choices and never modify permanent progress unless explicitly designed in a later phase.
- Reason: Events should add run variety and tactical choices without bypassing roguelike reset rules or weakening the permanent-progress safety model.
- Status: Accepted

### 2026-06-14: Events Can Recover Word Energy

- Decision: Some non-combat events can recover current-run Word Energy by 1 step.
- Reason: Word Energy recovery gives events a learning-system reward that helps long runs feel less repetitive while remaining temporary and unsaved.
- Status: Accepted

### 2026-06-14: Event Cost Choices Are Guarded

- Decision: Event choices with HP costs are disabled when the player cannot survive the cost, and random-card event choices require a current-run card target.
- Reason: Events should create interesting choices without causing accidental run failure, invalid deck mutation, or unclear outcomes.
- Status: Accepted

### 2026-06-14: Boss Variety Uses Placeholder Boss Pool

- Decision: Boss encounters can select from a small placeholder boss pool while preserving the same boss requirement, Card Trigger battle system, and permanent completion reward rules.
- Reason: Boss fights should feel more like a run climax without adding advanced boss mechanics or changing progression/save systems.
- Status: Accepted

### 2026-06-14: Boss Presentation Uses Placeholder Visuals Only

- Decision: Boss intro and battle presentation use Tailwind/CSS styling, badges, flavor text, and emoji placeholders only.
- Reason: Phase 42 improves game feel while deferring final art assets, sound, animation libraries, and complex boss systems.
- Status: Accepted

### 2026-06-14: Run Ending Summaries Are Main Result Screens

- Decision: Run Complete and Run Failed summaries render in the main battle arena with centralized ending actions instead of as narrow side-panel reports.
- Reason: Ending a run should feel clear, rewarding, and game-like while avoiding duplicated action buttons.
- Status: Accepted

### 2026-06-14: Ending Screens Clarify Permanent vs Temporary Progress

- Decision: Run ending screens show compact Permanent Progress Kept and Temporary Run Lost sections.
- Reason: Players should understand that learning progress survives while temporary roguelike run state resets.
- Status: Accepted

### 2026-06-14: Home Acts As Main Game Hub

- Decision: Home presents selected deck status, deck progression, mastery summaries, best run stats, primary actions, and reset progress clarity.
- Reason: Players should understand what deck is active, what is unlocked, what to do next, and what progress is saved before entering the Dungeon.
- Status: Accepted

### 2026-06-14: Home Mastery Summaries Are Display-Only

- Decision: Home calculates deck mastery summaries from existing saved word mastery and does not modify mastery or save new data.
- Reason: Home should clarify learning progress without changing mastery rules or introducing new persistence behavior.
- Status: Accepted

### 2026-06-14: Training Uses Mode Selection

- Decision: Training supports Quick Practice, Weak Words, Unmastered Words, and Review All setup modes before a session starts.
- Reason: Players should be able to intentionally practice the kind of vocabulary they need before entering timed Dungeon battles.
- Status: Accepted

### 2026-06-14: Training Session Length Is Player-Selectable

- Decision: Training sessions support 5 questions, 10 questions, 20 questions, or all available target words.
- Reason: Short and longer sessions make Training useful for different amounts of available practice time without changing mastery rules.
- Status: Accepted

### 2026-06-14: Training Expansion Preserves Run Isolation

- Decision: Expanded Training still remains untimed and only updates permanent word mastery through existing correct-answer rules.
- Reason: Training should stay a safe learning space and must not affect HP, gold, shield, Word Energy, current-run deck, shop upgrades, dungeon state, or run statistics.
- Status: Accepted

### 2026-06-14: Deck Review Is A Learning Preparation Screen

- Decision: Deck Review should help players inspect the selected deck, identify weak/unmastered/mastered words, understand card battle roles, and choose Training or Dungeon next.
- Reason: Deck Review should support learning preparation rather than act as a static card list or admin table.
- Status: Accepted

### 2026-06-14: Deck Review Filters And Sorting Are Display-Only

- Decision: Deck Review can filter and sort cards by learning state, attack, effects, difficulty, mastery, and alphabetic order without changing deck data.
- Reason: Players need better ways to study and scan vocabulary while preserving mastery, save, run, and deck rules.
- Status: Accepted

### 2026-06-14: Deck Review Does Not Change Mastery

- Decision: Deck Review displays saved mastery, mastery guidance, and Dungeon mastery bonus information but never increases or decreases mastery.
- Reason: Mastery changes should remain tied to Training correct answers so learning progress stays intentional and understandable.
- Status: Accepted

### 2026-06-14: Event Results Stay Visible Before Next Battle

- Decision: After a dungeon Event resolves, the next Encounter Intro should show the last Event result before the player starts the next battle.
- Reason: Event rewards and costs should be clear to the player without adding new encounter systems or changing run rules.
- Status: Accepted

### 2026-06-16: Mobile Dungeon Prioritizes Reachable Quiz Controls

- Decision: On mobile and narrow screens, Dungeon battle may scroll vertically and should prioritize the quiz, answer controls, timer, and result actions over secondary panels.
- Reason: Mobile browsers have fragile viewport heights, so controls must remain reachable instead of being clipped by desktop-style fixed-height layouts.
- Status: Accepted

### 2026-06-16: Desktop Battle Keeps Fullscreen Fit Target

- Decision: Desktop Dungeon battle keeps the fullscreen/no-scroll fit target while mobile uses a more flexible stacked layout.
- Reason: Desktop and mobile need different layout strategies to preserve game feel without sacrificing playability.
- Status: Accepted

### 2026-06-16: Dungeon QA Helpers Are Development-Only

- Decision: Dungeon can include QA Helper controls gated by `import.meta.env.DEV`.
- Reason: Prototype QA needs fast access to Shop, Event, Elite, Boss, and Run Failed flows without turning helper controls into player-facing cheats.
- Status: Accepted

### 2026-06-16: Force Run Complete Is Deferred

- Decision: Do not add a fake Force Run Complete QA action yet.
- Reason: Run completion should use the real boss defeat path so deck completion, unlock rewards, and saved progress are tested through existing production logic.
- Status: Accepted

### 2026-06-18: QA Battle Skip Buttons Use Real Resolution Paths

- Decision: Development QA battle skip buttons may simulate correct or wrong answers only by using the same resolution paths as real mini-game answers.
- Reason: QA tools should speed up testing without creating separate combat math, bypassing the Card Trigger System, or directly writing permanent progress.
- Status: Accepted

### 2026-06-22: Manual Deck Content Quality Standards

- Decision: Manual deck cards use consistent Title Case part-of-speech labels, concise Thai meanings, beginner-friendly example sentences, and thematic lightweight effects.
- Reason: Consistent content makes Deck Review, Training, Dungeon mini-games, and mobile answer choices easier to read across all manual decks.
- Status: Accepted

### 2026-06-22: Mobile Dungeon Auto-Scrolls To Active Play Area

- Decision: On mobile and narrow screens, new active Dungeon questions may automatically scroll near the timer and quiz area.
- Reason: Phone players should not need to repeatedly scroll back up after each question when long battle content overflows vertically.
- Status: Accepted

### 2026-06-22: Player Guidance Stays Compact And Non-Blocking

- Decision: How to Play and prototype guidance should live in compact or collapsible areas and should not block Training, Dungeon battles, Shop purchases, or other core interactions.
- Reason: External playtesters need clear rules, but the prototype must keep mobile battle quiz-first and avoid tutorial flows that change gameplay.
- Status: Accepted

### 2026-06-22: Motion Is CSS-Only And Presentation-Only

- Decision: Game feel motion uses CSS-only presentation hooks and must never change combat rules, timer values, save behavior, run progression, or hidden-answer visibility.
- Reason: The prototype should feel more alive while preserving the tested gameplay loop, mobile usability, and reduced-motion accessibility.
- Status: Accepted

### 2026-06-22: Sound Effects Are Optional And Presentation-Only

- Decision: Sound effects are optional, player-controlled, browser-generated, and presentation-only. Sound must never communicate critical information by itself or change gameplay behavior.
- Reason: Native Web Audio can improve game feel without adding assets, dependencies, autoplay risk, or coupling sound preferences to permanent player progress.
- Status: Accepted

### 2026-06-22: Battle Stage Presentation Is Placeholder-Only

- Decision: Battle stage and character presentation are placeholder-only and presentation-only for Version 1. They must not reduce quiz usability or change gameplay behavior.
- Reason: Dungeon battles should feel more like a game scene while preserving the vocabulary quiz as the main interaction and avoiding final art, assets, dependencies, or rule changes.
- Status: Accepted

### 2026-06-22: Future Art Assets Need Safe Placeholder Fallbacks

- Decision: Final art assets are deferred. Future pixel-art assets must be integrated gradually with safe placeholder fallbacks and must not change gameplay behavior.
- Reason: WordQuest should be ready for real cozy fantasy pixel art later without making the current static demo depend on missing image files or altering the tested learning/combat loop.
- Status: Accepted

### 2026-06-23: Pixel Art Generation Uses A Prompt Pack First

- Decision: Future real pixel-art generation should follow `ASSET_PROMPTS.md` and `ASSET_PLAN.md`. Phase 70A creates prompt documentation only and does not add image files or runtime asset imports.
- Reason: A shared style bible, negative prompt rules, filenames, batch plan, and QA checklist should come before generating assets so future art stays consistent and safe to integrate.
- Status: Accepted

### 2026-06-23: Main Hero Identity Is Locked As Word Mage

- Decision: The canonical WordQuest main hero is a young male staff-and-spellbook `Word Mage` with fluffy short brown hair, bright blue eyes, blue cape with gold trim, cream-and-brown mage adventurer outfit, magical staff with blue crystal, and blue-and-gold spellbook/tome.
- Reason: Player-character concept exploration is complete, and future sprite, animation, portrait, and battle-scene assets need a stable identity for consistent production.
- Status: Accepted

### 2026-06-23: Future Player Assets Preserve The Word Mage Identity

- Decision: Future player assets should consistently preserve the locked Word Mage identity and should not reinterpret the protagonist as a swordsman, knight, rogue, archer, armored warrior, or generic adventurer.
- Reason: The player fantasy is vocabulary-powered spellcasting through staff, spellbook, elemental triggers, and word mastery.
- Status: Accepted

### 2026-06-22: Active Runs Can Continue In Memory Only

- Decision: Active dungeon runs may be preserved in React memory across screen navigation, but Version 1 still does not persist active run state to LocalStorage.
- Reason: Players need a clearer Return Home / Continue Run flow during one app session without weakening the roguelike reset rules or changing the save schema.
- Status: Accepted

### 2026-06-22: Return Home Is Non-Destructive

- Decision: Abandon Run means discarding the current temporary run. Returning Home is non-destructive and should preserve the active run in memory.
- Reason: Separating these actions makes Dungeon exit choices clearer and reduces accidental loss of temporary run progress.
- Status: Accepted

### 2026-06-22: Shop Purchase Feedback Shows What Changed

- Decision: Shop purchase feedback must clearly show what changed, including affected card, before/after values, gold spent, and remaining gold.
- Reason: Purchases should feel useful and understandable instead of only silently reducing temporary gold.
- Status: Accepted

### 2026-06-23: Shop Purchase Feedback Must Be Visible

- Decision: Shop purchase feedback must be visible without relying on sound or hidden state changes. Successful purchases should show a clear receipt and placeholder upgrade feedback until final card art/effects are added.
- Reason: Buying an upgrade is a key deckbuilder reward moment, so players should immediately understand what changed, how much gold was spent, and how much gold remains.
- Status: Accepted

### 2026-06-23: Shop Upgrades Feel Like Card Actions

- Decision: Shop upgrades should feel like card-game actions. Target selection should present vocabulary cards as card-like choices, and successful purchases should use compact upgrade ceremony feedback instead of dashboard-style receipts.
- Reason: Shop purchases are the core deckbuilder reward moment, so the interaction should emphasize the selected card and its change rather than a large information panel.
- Status: Accepted

### 2026-06-23: Dungeon Active Battle Prioritizes Quiz And Critical Battle State

- Decision: During active unanswered Dungeon battle, the current quiz, timer, player HP/shield, enemy HP/attack, and answer controls take priority. Battle Log, Learning Info, Card Trigger details, Word Energy diagnostics, and QA tools should use progressive disclosure.
- Reason: Timed combat is the player's immediate decision point, so secondary information should stay available without competing with the quiz or leaking answer/result information.
- Status: Accepted

### 2026-06-23: Training Prioritizes The Active Question

- Decision: Training should prioritize the active question and answer choices. Session stats, mode notes, deck mastery details, and long guidance should not compete with answering.
- Reason: Training is a safe learning space, but the immediate task is still choosing the correct answer; extra learning context should support the question without making the screen feel like a dashboard.
- Status: Accepted

### 2026-06-23: Run Result Prioritizes Outcome And Next Action

- Decision: Run Result and run-end summaries should prioritize outcome, reward/loss clarity, and next action before detailed statistics.
- Reason: At the end of a run, players need to know what happened, what permanent progress was kept or earned, what temporary progress was lost, and what to do next.
- Status: Accepted

### 2026-06-22: First Shop Should Usually Afford One Meaningful Upgrade

- Decision: Shop economy should let the first shop usually provide at least one meaningful upgrade while keeping Duplicate and Remove strategic.
- Reason: The first shop should feel rewarding without making every offer free or weakening current-run deckbuilding decisions.
- Status: Accepted

### 2026-06-23: UI Prioritizes The Player's Immediate Decision

- Decision: WordQuest UI should prioritize the player's immediate decision on each screen. Secondary and tertiary information should use progressive disclosure instead of being visible all the time.
- Reason: Game designer feedback identified information overload, weak hierarchy, and dashboard-like density as major usability risks.
- Status: Accepted

### 2026-06-23: Repeated Cards Use Scan View By Default

- Decision: Repeated cards and lists should use scan view by default and move full details into detail panels, modals, accordions, or result screens.
- Reason: Deck cards, shop offers, and record lists become harder to scan when every repeated item carries full stats, helper text, progress bars, and multiple chips.
- Status: Accepted

### 2026-06-23: Deck Review Repeated Cards Use Compact Scan Mode

- Decision: Deck Review repeated cards should use compact scan mode by default. Full vocabulary, battle, effect, and mastery details should live in the selected-card detail panel.
- Reason: Deck Review's primary decision is which word to inspect or practice next, so repeated cards should stay easy to scan without long helper copy, progress bars, or `No Effect` badges.
- Status: Accepted

### 2026-06-23: Badges And Chips Are Decision-Focused

- Decision: Badge and chip usage should be limited to information that affects immediate player decisions or important state.
- Reason: Too many colorful chips make normal information compete with primary actions and weaken screen hierarchy.
- Status: Accepted

### 2026-06-23: Home Prioritizes Immediate Play Decisions

- Decision: Home should prioritize immediate play decisions and compact selected-deck state. Records, guide text, save explanations, and danger actions should use progressive disclosure or lower-priority placement.
- Reason: Home is the main hub, so the player should quickly see Continue Run or Start Adventure, plus Train, Review Deck, and compact deck selection without reading a dashboard of secondary information first.
- Status: Accepted

### 2026-06-23: Global UI Primitives Support Hierarchy By Default

- Decision: Global UI primitives should support hierarchy by default: primary actions may be visually strong, repeated cards and secondary badges should be lighter, and detailed information should use progressive disclosure instead of permanent visual weight.
- Reason: Shared components set the baseline for every screen, so calmer defaults reduce dashboard noise without needing screen-by-screen rewrites.
- Status: Accepted

### 2026-06-16: Vercel Is Preferred For Static Demo Deployment

- Decision: Prepare the prototype for Vercel static deployment using the Vite preset, `npm run build`, and `dist` output.
- Reason: Vercel can host the current frontend-only prototype without backend services, database setup, or Vite base-path changes.
- Status: Accepted

### 2026-06-17: Word Scramble Uses Tile-Based Letter Input

- Decision: Word Scramble uses tile-based letter input for Version 1 instead of primary manual typed input.
- Reason: Letter tiles make the mini-game more playable, game-like, mobile-friendly, and safer for duplicate-letter words than a plain text box.
- Status: Accepted

### 2026-06-04: No Multiplayer, Leaderboards, Accounts, or Payments

- Decision: Do not add online multiplayer, leaderboards, account systems, or payment systems.
- Reason: These features are outside the prototype scope and would distract from the core learning loop.
- Status: Accepted

### 2026-06-04: Required Maintenance Documents

- Decision: Maintain `PROJECT_STATUS.md`, `HANDOFF.md`, and `DECISIONS.md` after completed tasks.
- Reason: The project should be easy for another developer or AI agent to continue without conversation history.
- Status: Accepted

### 2026-06-04: GitHub Backup Workflow

- Decision: Use Git with `main` as the primary branch and `origin` pointing to `https://github.com/Puttipongpn/WordQuest.git`.
- Reason: GitHub backup protects the current project state and gives future work a stable collaboration point.
- Status: Accepted
