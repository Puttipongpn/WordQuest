# HANDOFF.md

## Project Overview

Vocabulary Dungeon Deckbuilder is a web-first English vocabulary learning roguelike deckbuilder. The project is meant to be a simple, fun vocabulary practice app, not a commercial game.

The core loop combines vocabulary cards, deck review, practice mini-games, dungeon battles, temporary run upgrades, and permanent vocabulary mastery progress.

## Current Project Status

Current version: Prototype v0.1

Current phase: Phase 3 complete. Phase 4 has not started yet.

The project has a Vite + React + TypeScript + Tailwind CSS scaffold with simple screen navigation using React state. It does not use React Router, backend services, databases, authentication, or external APIs.

## Completed Work

- Created the Vite project scaffold.
- Added React with TypeScript.
- Added Tailwind CSS, PostCSS, and Autoprefixer.
- Added the requested source folder structure:
  - `src/components`
  - `src/screens`
  - `src/game`
  - `src/data`
  - `src/types`
  - `src/utils`
- Added simple React state-based navigation.
- Added placeholder screens for the full Version 1 app flow.
- Added reusable shell/header components for basic layout.
- Added the first shared navigation type in `src/types/navigation.ts`.
- Verified the project with `npm run build`.
- Created required project maintenance documents:
  - `PROJECT_STATUS.md`
  - `HANDOFF.md`
  - `DECISIONS.md`
- Added documentation maintenance rules to `AGENTS.md`.
- Created shared TypeScript game data model in `src/types/game.ts`.
- Exported shared game types from `src/types/index.ts`.
- Created the first sample vocabulary deck, `Starter Deck`, in `src/data/starterDeck.ts`.
- Exported vocabulary data from `src/data/index.ts`.
- Verified the project again with `npm run build` after Phase 2.
- Built the Deck Review screen using `Starter Deck` from `src/data`.
- Added a responsive card grid for all 20 starter cards.
- Added a click-to-select card detail view.
- Added deck summary information with total card count and mastery placeholder.
- Added per-card mastery placeholder display as `0 / 5`.
- Added optional unframed rendering to `ScreenShell` for screens that render their own card layouts.
- Verified the project again with `npm run build` after Phase 3.

## Implemented Screens

The following screens are implemented or stubbed:

- Home: entry screen with buttons to review a deck or enter the dungeon.
- Deck Review: implemented vocabulary presentation screen using `Starter Deck`.
- Training: placeholder for non-dungeon practice mini-games.
- Dungeon: placeholder battle area with links to Shop and Run Result.
- Shop: placeholder current-run upgrade cards.
- Run Result: placeholder summary screen with a button back to Home.

Navigation is controlled by `currentScreen` state in `src/App.tsx`.

## Build Status

The production build has been verified with:

```sh
npm run build
```

The build passed successfully after dependencies were installed, after Phase 2 data model work, and after Phase 3 Deck Review work.

The local development server can be started with:

```sh
npm run dev -- --host 127.0.0.1
```

## Current Architecture

The app is intentionally small and simple.

- `src/App.tsx`: owns the current screen state and renders the active screen.
- `src/components`: reusable UI pieces such as the app header and screen layout shell.
- `src/screens`: top-level screen components.
- `src/types`: shared TypeScript types.
- `src/game`: reserved for pure game logic.
- `src/data`: reserved for seed vocabulary decks and game data.
- `src/utils`: reserved for utility helpers.

Expected architecture direction:

- Keep game logic separate from React UI where practical.
- Put reusable shared types in `src/types`.
- Put seed vocabulary data in `src/data`.
- Put pure game rules and state transitions in `src/game`.
- Put screens in `src/screens`.
- Put reusable UI components in `src/components`.

Current shared type files:

- `src/types/navigation.ts`: screen navigation names.
- `src/types/game.ts`: vocabulary cards, decks, player progress, run state, monsters, bosses, shop items, elements, mini-game types, and mastery data.

Current data files:

- `src/data/starterDeck.ts`: the first sample vocabulary deck.
- `src/data/index.ts`: data exports.

Current Deck Review implementation:

- `src/screens/DeckReview.tsx` imports `starterDeck` from `src/data`.
- All cards render in a responsive grid.
- Clicking a card stores the selected card in local React state.
- The selected card detail panel shows word, Thai meaning, part of speech, example sentence, difficulty, base attack, effects, and mastery placeholder.
- Mastery is display-only and hardcoded as `0 / 5` per card for now.
- Deck summary shows deck name, total cards, and a placeholder total mastery value.
- No persistence, save logic, battle logic, shop logic, or training logic is connected to Deck Review.

## Version 1 Scope

Version 1 should include:

- Home screen
- Deck review screen
- Training screen
- Dungeon battle screen
- At least 2 mini-games:
  - Word Match
  - Word Scramble
- Basic shop
- Basic monster battle
- LocalStorage save system
- Simple placeholder visuals

Version 1 should not include:

- Backend
- Database
- Authentication
- External API integration
- Online multiplayer
- Leaderboards
- Account system
- Payment system
- Final art assets

## Game Design Decisions

- The project is web-first.
- The game is a vocabulary learning roguelike deckbuilder.
- Vocabulary is represented as cards.
- The main vocabulary source should eventually be Oxford 3000.
- Decks should target around 20 words each.
- The player reviews a deck before entering the dungeon.
- Training exists outside dungeon runs and should not affect HP or run state.
- Dungeon battles use vocabulary mini-games.
- Version 1 card effects are based on Attack, Shield, and Element.
- Correct answers trigger card attack, shield, or element effects.
- Wrong answers allow monsters to attack.
- Shop upgrades are inspired by Balatro and other deckbuilder games.
- Placeholder visuals are preferred for Version 1.

## Permanent Progress Rules

Permanent progress survives death and run completion.

Permanent progress includes:

- Unlocked decks
- Word mastery
- Player learning progress
- Completed decks
- Statistics
- Best run stats

Permanent progress should be saved in LocalStorage for Version 1.

## Run Progress Rules

Run progress is temporary.

Run progress includes:

- Gold
- Current HP
- Shield
- Shop upgrades
- Card enchantments
- Duplicated cards
- Removed cards
- Run items

If the player dies, permanent progress survives death and run progress is completely lost.

Temporary run upgrades should not be saved as permanent progress after death.

## Dungeon Flow

The planned main loop is:

1. Player receives a vocabulary deck.
2. Player reviews vocabulary cards.
3. Player can train in practice mini-games.
4. Player enters the dungeon.
5. Player fights monsters using vocabulary mini-games.
6. Correct answers trigger card attack, shield, or element effects.
7. Every 5 monsters, the shop appears.
8. Every 20 monsters, a boss appears.
9. Defeating the boss completes the run and unlocks the next deck or another progress reward.

Planned battle rules:

- Player starts with HP, gold, and a current run copy of the selected deck.
- The player fights monsters one by one.
- Each monster battle uses a random mini-game.
- Correct answers deal damage.
- Wrong answers let the monster attack.
- Shield absorbs damage first.
- Defeating monsters gives gold.
- Shop appears every 5 monsters.
- Boss appears at monster 20.

## Deck System

Current deck model:

- Each vocabulary deck contains around 20 words.
- Each word is represented as a `WordCard`.
- The first sample deck is `Starter Deck`.
- `Starter Deck` contains 20 realistic sample word cards.
- Seed vocabulary data lives in `src/data`.

Current word card fields:

- `id`
- `word`
- `meaningTh`
- `partOfSpeech`
- `difficulty`
- `exampleSentence`
- `imagePlaceholder`
- `baseAttack`
- optional effects

Version 1 card effects should stay simple and be based on:

- Attack
- Shield
- Element

Card effects are stored as an optional `effects` array on `WordCard`. This keeps simple cards lightweight while allowing cards to gain one or more typed effects later.

Difficulty is numeric only:

- `1` = Easy
- `2` = Medium
- `3` = Hard

Do not introduce CEFR levels yet.

## Mini-Games Planned

Initial battle mini-games:

- Word Match
  - Show multiple English words and Thai meanings.
  - Player selects one correct pair.
  - Selected card triggers attack or effects.
- Word Scramble
  - Show multiple scrambled word choices.
  - Player chooses which word to solve.
  - Harder words give more damage.
  - Solving correctly triggers card effects.

Training mini-games planned:

- Image / word choice quiz
- Match word to meaning

Mini-games should eventually include timers. Difficulty should affect time limit and damage.

## Shop System Planned

The shop appears every 5 monsters.

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

## Required Project Documents

These documents are required project maintenance files:

- `PROJECT_STATUS.md`: current progress, completed work, active task, and next task.
- `HANDOFF.md`: project handoff context for another developer or AI agent.
- `DECISIONS.md`: accepted decision log.

After every completed task, update all three documents as needed.

## Next Recommended Task

Phase 4 has not started yet.

Recommended next task:

Build Training mode presentation and the first simple training interactions without changing dungeon HP or run state.
