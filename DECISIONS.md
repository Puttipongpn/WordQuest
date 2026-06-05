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
- Status: Accepted

### 2026-06-04: Scramble Uses Current-Run Deck and Card Trigger System

- Decision: Word Scramble chooses cards from the current-run deck, and correct typed answers trigger the selected scrambled word card.
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
- Status: Accepted

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

- Decision: Support multiple manual sample decks through `availableDecks`, starting with Starter Deck and Food Deck.
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

### 2026-06-04: Real Progression Beyond Food Deck Is Deferred

- Decision: Completing Food Deck marks it completed but does not unlock another real deck yet.
- Reason: Phase 22 should validate unlock persistence without adding more decks, Oxford 3000 imports, or advanced progression design.
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
