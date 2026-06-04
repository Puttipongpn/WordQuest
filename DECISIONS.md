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
- Status: Accepted

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
- Status: Accepted

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

### 2026-06-04: Shop Upgrades Affect Only Current Run

- Decision: Shop upgrades, card enchantments, duplication, removal, and run items affect only the active run.
- Reason: Temporary upgrades preserve roguelike reset rules.
- Status: Accepted

### 2026-06-04: Placeholder Art for Version 1

- Decision: Use emoji, CSS, and simple placeholders for Version 1 visuals.
- Reason: The project should prioritize playable systems before final art.
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
