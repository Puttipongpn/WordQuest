# AGENTS.md

## Project

This project is a vocabulary learning roguelike deckbuilder web game.

The goal is not to make a commercial game, but to create a simple and fun English vocabulary practice web app.

Core concept:

- English vocabulary cards
- Deck-based learning
- Mini-game battles
- Roguelike run system
- Shop upgrades inspired by Balatro / deckbuilder games
- Oxford 3000 vocabulary as the main word source

## Tech Stack

Use:

- Vite
- React
- TypeScript
- Tailwind CSS
- LocalStorage for version 1

Do not use backend, database, authentication, or API in version 1 unless explicitly requested.

## Development Style

Work in small steps.

Do not rewrite the whole app unless necessary.

Prefer simple readable code over clever abstractions.

Keep components small and understandable.

Use TypeScript types for game data, cards, deck, run state, monsters, items, and mini-games.

## Game Rules

The game has two types of progress:

### Permanent Progress

This is saved permanently:

- unlocked decks
- word mastery
- player learning progress
- completed decks
- statistics

### Run Progress

This is temporary and resets when the player dies or finishes the run:

- gold
- current HP / shield
- shop upgrades
- card enchantments
- duplicated cards
- removed cards
- run items

If the player dies, only the current run is lost. Permanent vocabulary progress remains.

## Main Loop

1. Player receives a vocabulary deck.
2. Player reviews vocabulary cards.
3. Player can train in practice mini-games.
4. Player enters dungeon.
5. Player fights monsters using vocabulary mini-games.
6. Correct answers trigger card attack / shield / element effects.
7. Every 5 monsters, shop appears.
8. Every 20 monsters, boss appears.
9. Defeating boss completes the run and unlocks next deck or progress reward.

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

Do not spend time on final art assets yet. Use emoji, CSS, or simple placeholders.

## Coding Rules

- Keep game logic separate from UI where possible.
- Put shared types in `src/types`.
- Put seed vocabulary data in `src/data`.
- Put pure game logic in `src/game`.
- Put React screens in `src/screens`.
- Put reusable UI components in `src/components`.

## Documentation Maintenance

After every completed task:

- Update `PROJECT_STATUS.md`
- Update `HANDOFF.md`
- Update `DECISIONS.md`

Record any new architecture decisions and major design changes.

## Important

Do not change the core game direction without asking.

Do not add complex backend features.

Do not add online multiplayer, leaderboard, account system, or payment system.

Focus on making the game playable first.
