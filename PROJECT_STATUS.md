# PROJECT_STATUS.md

## Project Name

Vocabulary Dungeon Deckbuilder

## Current Version

Prototype v0.1

## Current Status

Phase 7 shop presentation is complete. GitHub backup is configured on `origin/main`.

## Completed

- Created Vite + React + TypeScript + Tailwind project scaffold.
- Added basic source folder structure:
  - `src/components`
  - `src/screens`
  - `src/game`
  - `src/data`
  - `src/types`
  - `src/utils`
- Added React state-based screen navigation without React Router.
- Added placeholder screens:
  - Home
  - Deck Review
  - Training
  - Dungeon
  - Shop
  - Run Result
- Added reusable placeholder layout components.
- Verified production build with `npm run build`.
- Created required project documentation files:
  - `HANDOFF.md`
  - `DECISIONS.md`
- Added documentation maintenance rules to `AGENTS.md`.
- Added accepted documentation decisions for Version 1 card effects and death rules.
- Created shared TypeScript game data model in `src/types/game.ts`.
- Added the first sample vocabulary deck, `Starter Deck`, in `src/data/starterDeck.ts`.
- Exported vocabulary data from `src/data/index.ts`.
- Verified the project with `npm run build` after Phase 2.
- Built the Deck Review screen using `Starter Deck` from `src/data`.
- Added a responsive vocabulary card grid.
- Added click-to-select card detail view.
- Added deck summary with total cards and mastery progress placeholder.
- Added per-card mastery placeholder as `0 / 5`.
- Added optional unframed layout support to `ScreenShell` for screens that render their own cards.
- Verified the project with `npm run build` after Phase 3.
- Initialized Git for the project.
- Added `.gitignore` and project README.
- Added GitHub remote `origin`: `https://github.com/Puttipongpn/WordQuest.git`.
- Pushed the project backup to `origin/main`.
- Built Word Choice Training using `Starter Deck` from `src/data`.
- Added local-state-only training question flow.
- Added 4 answer choices per question with correct/wrong feedback.
- Added correct answer reveal and Next/Restart flow.
- Added training progress display with current question, total questions, correct count, and incorrect count.
- Verified the project with `npm run build` after Phase 4.
- Created `GAME_DESIGN.md` as the central accepted game design document.
- Added in-memory word mastery state at the app level.
- Passed current mastery data into Deck Review and Training.
- Updated Deck Review to display current mastery instead of hardcoded `0 / 5`.
- Updated Training so correct answers increase current word mastery by 1.
- Clamped word mastery to the range `0 / 5`.
- Kept mastery temporary with no LocalStorage persistence.
- Verified the project with `npm run build` after Phase 4.5.
- Documented the Card Trigger System before combat implementation.
- Created sample monster data in `src/data/monsters.ts`.
- Built the first local-state Dungeon battle foundation.
- Added player HP, shield display, and gold display.
- Added current monster display with HP, max HP, and attack.
- Connected dungeon battle questions to `Starter Deck` cards.
- Added 4 Thai meaning answer choices for battle questions.
- Correct battle answers trigger the selected word card and deal `baseAttack` damage.
- Incorrect battle answers do not trigger cards and cause monster attack damage.
- Added Monster Defeated and Run Failed states with next/restart actions.
- Verified the project with `npm run build` after Phase 5.
- Refactored Dungeon battle questions into a simple battle mini-game structure.
- Kept Word Choice as the existing battle question mini-game.
- Added the first battle Word Match mini-game.
- Added random mini-game selection between Word Choice and Word Match for each battle question.
- Added Word Match pair selection with 3 English words and 3 Thai meanings.
- Preserved the Card Trigger System for both battle mini-games.
- Added triggered card, damage dealt, damage taken, and correct/wrong feedback display.
- Verified the project with `npm run build` after Phase 6.
- Created sample current-run shop item data in `src/data/shopItems.ts`.
- Added placeholder shop items for attack upgrades, elements, shield, card removal, and card duplication.
- Updated the Shop screen to display item cards with icon, name, description, cost, and type.
- Labeled the shop as `Current Run Shop`.
- Added shop text explaining upgrades are temporary and affect only the current run.
- Kept shop buttons as preview-only with no purchase logic, card changes, deck changes, gold changes, or effect changes.
- Verified the project with `npm run build` after Phase 7.

## In Progress

- None

## Next Task

Start Phase 8 when requested: add the LocalStorage save system for permanent progress only.

## Required Project Documents

The following documents are required and must be updated after every completed task:

- `PROJECT_STATUS.md`
- `HANDOFF.md`
- `DECISIONS.md`
- `GAME_DESIGN.md` when gameplay rules, systems, or scope change

## Core Design Decisions

- Web app first
- No backend in version 1
- Use LocalStorage for save data
- Vocabulary is represented as cards
- Deck has around 20 words
- Player reviews deck before dungeon
- Dungeon uses only current deck plus small review pool later
- Shop appears every 5 monsters
- Boss appears at monster 20
- Death resets current run upgrades
- Run progress is completely lost on death
- Permanent vocabulary progress remains
- Version 1 card effects are based on Attack, Shield, and Element
- Card effects are stored as an optional `effects` array on `WordCard`
- Difficulty uses numeric levels: 1 = Easy, 2 = Medium, 3 = Hard
- Shared game types live in `src/types`
- Seed vocabulary data lives in `src/data`
- Deck Review loads `Starter Deck` directly from `src/data`
- Deck Review uses local React state for selected-card detail display
- Mastery display is a placeholder only: `0 / 5` per card
- GitHub backup remote is `https://github.com/Puttipongpn/WordQuest.git`
- Main branch is `main`
- Training mode uses `Starter Deck` from `src/data`
- Word Choice Training uses local React state only
- Training does not change HP, gold, shield, run state, shop state, dungeon progress, LocalStorage, or permanent mastery
- First training prototype uses 10 starter cards and 4 Thai meaning answer choices per question
- `GAME_DESIGN.md` is the central gameplay design reference
- Word mastery is currently in-memory only and resets on page refresh
- Word mastery range is `0` to `5`
- Correct Training answers increase word mastery by `1`
- Wrong Training answers do not decrease mastery in the Version 1 prototype
- Card Trigger System: correct mini-game answers trigger selected word cards and activate card effects
- Incorrect answers do not trigger card effects
- Future shop upgrades and enchantments modify card effects, not player stats directly
- Dungeon battle state is local React state only
- Phase 5 uses sample monsters: Slime, Goblin, and Bat
- Correct battle answers deal damage equal to the triggered card's `baseAttack`
- Wrong battle answers make the current monster attack player HP
- Phase 5 does not implement shop logic, boss logic, run rewards, LocalStorage, or permanent mastery updates from battle
- Dungeon battle supports Word Choice and Word Match mini-game structures
- Each battle question randomly selects Word Choice or Word Match
- Word Match uses 3 English words and 3 Thai meanings
- Correct Word Match pairs trigger the selected English word card
- Phase 6 still does not implement shop logic, boss logic, run rewards, LocalStorage, or permanent mastery updates from battle
- Shop presentation loads sample data from `src/data/shopItems.ts`
- Shop items are current-run only
- Phase 7 shop item effects are placeholders only
- Phase 7 does not implement purchase logic, boss logic, run rewards, LocalStorage, or permanent battle mastery updates

## Important Rules

Do not rewrite the whole app.

Do not add backend yet.

Do not add authentication yet.

Do not add final art assets yet.

Use placeholder visuals.

Keep game playable and simple.

## Known Missing Features

- Real Oxford 3000 import
- Final card art
- Monster art
- Shopkeeper art
- Sound effects
- More mini-games
- Full dungeon battle logic
- Shop purchase logic
- Save system
- Persistent mastery storage
- Balancing
- Mobile polish
