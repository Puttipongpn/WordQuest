# PROJECT_STATUS.md

## Project Name

Vocabulary Dungeon Deckbuilder

## Current Version

Prototype v0.1

## Current Status

Phase 3 Deck Review screen is complete. GitHub backup is configured on `origin/main`.

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

## In Progress

- None

## Next Task

Start Phase 4: build Training mode presentation and first simple training interactions.

## Required Project Documents

The following documents are required and must be updated after every completed task:

- `PROJECT_STATUS.md`
- `HANDOFF.md`
- `DECISIONS.md`

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
- Training mode
- More mini-games
- Dungeon battle logic
- Shop logic
- Save system
- Balancing
- Mobile polish
