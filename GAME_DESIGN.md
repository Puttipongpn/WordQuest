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

Version 1 will eventually save permanent progress with LocalStorage. The current prototype uses in-memory word mastery only.

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
- Mastery is stored in React state only.
- Mastery resets when the page refreshes.
- Mastery is not saved to LocalStorage yet.

Deck Review displays current in-memory mastery. Training updates in-memory mastery on correct answers.

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
- Updates in-memory word mastery on correct answers

## Dungeon Battle Plan

Dungeon battle logic has not started yet.

Planned battle rules:

- Player starts with HP, gold, and a current run copy of the selected deck.
- Player fights monsters one by one.
- Each battle uses a random mini-game.
- Correct answers deal damage.
- Wrong answers let the monster attack.
- Shield absorbs damage first.
- Defeating monsters gives gold.
- Shop appears every 5 monsters.
- Boss appears at monster 20.

## Mini-Game Plan

Training mini-games:

- Word Choice Training: implemented as an in-memory prototype.
- Match word to meaning: planned.

Battle mini-games:

- Word Match
- Word Scramble

Battle mini-games should eventually include timers. Difficulty should affect time limit and damage.

## Shop Plan

Shop logic has not started yet.

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

## Card Effects

Version 1 card effects are based on:

- Attack
- Shield
- Element

Card effects are stored as an optional `effects` array on `WordCard`. Simple cards can have no effects. Future cards can have one or more effects.

## Element Concept

Current element types:

- Fire
- Water
- Wind
- Earth

Elements are planned as simple card effect properties for Version 1. Detailed element interactions and balance rules are deferred until combat exists.

## Death Rule

Permanent progress survives death.

Run progress is completely lost on death.

This keeps roguelike tension while preserving vocabulary learning progress.

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
- Persistent mastery storage
