# WordQuest

WordQuest is a prototype vocabulary learning roguelike deckbuilder web game. It combines English vocabulary cards, deck review, mini-game practice, and a planned dungeon run system where correct answers trigger card effects.

The project is focused on becoming a simple, playable English vocabulary practice app before adding polish or final art.

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- LocalStorage for Version 1 save data

## Current Status

Prototype v0.1 is in progress.

Completed so far:

- Project scaffold with Vite, React, TypeScript, and Tailwind CSS
- Basic screen navigation with React state
- Placeholder screens for Home, Training, Dungeon, Shop, and Run Result
- Deck Review screen using the Starter Deck
- Shared TypeScript game data model
- Starter Deck seed data with 20 vocabulary cards
- Project documentation and decision log

## Core Features Planned

- Vocabulary decks built from English word cards
- Deck review before dungeon runs
- Training mini-games outside dungeon runs
- Dungeon battles using vocabulary mini-games
- Card effects based on Attack, Shield, and Element
- Temporary roguelike run upgrades
- Shop every 5 monsters
- Boss every 20 monsters
- Permanent vocabulary mastery progress
- LocalStorage save system

## Development Commands

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Version 1 Scope

Version 1 should include:

- Home screen
- Deck Review screen
- Training screen
- Dungeon battle screen
- Word Match mini-game
- Word Scramble mini-game
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

## Project Notes

WordQuest is a prototype vocabulary learning roguelike deckbuilder. The goal is to make the learning loop playable first, using simple placeholder visuals and local data before expanding into more complete game systems.
