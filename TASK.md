# TASK.md

## Current Goal

Build the first playable prototype of the vocabulary roguelike deckbuilder web game.

## Phase 1: Project Setup

Create a Vite + React + TypeScript + Tailwind project.

Add basic folder structure:

src/
- components/
- screens/
- game/
- data/
- types/
- utils/

Create basic routes or screen state for:

- Home
- Deck Review
- Training
- Dungeon
- Shop
- Run Result

## Phase 2: Data Model

Create TypeScript types for:

- WordCard
- VocabularyDeck
- PlayerProgress
- RunState
- Monster
- Boss
- ShopItem
- ElementType
- MiniGameType
- WordMastery

Create sample vocabulary decks manually for now.

Each deck should have around 20 words.

Each word card should include:

- id
- word
- meaningTh
- partOfSpeech
- difficulty
- exampleSentence
- imagePlaceholder
- baseAttack
- optional effects

## Phase 3: Deck Review

Create Deck Review screen.

Player should be able to:

- view current deck
- flip card or expand card detail
- see word
- see Thai meaning
- see example sentence
- see difficulty
- see mastery status

## Phase 4: Training Mode

Create simple training mode outside dungeon.

Training should not affect HP or run state.

Add mini-games:

1. Image / word choice quiz
2. Match word to meaning

Training should update word mastery lightly.

## Phase 5: Dungeon Battle

Create dungeon run system.

Rules:

- Player starts with HP, gold, current deck copy
- Fight monster one by one
- Each monster battle uses a random mini-game
- Correct answer deals damage
- Wrong answer lets monster attack
- Shield absorbs damage first
- Defeating monster gives gold
- Shop appears every 5 monsters
- Boss appears at monster 20

## Phase 6: Mini-Games

Implement first 2 battle mini-games:

1. Word Match
   - show multiple English words and Thai meanings
   - player selects one correct pair
   - selected card triggers attack/effects

2. Word Scramble
   - show multiple scrambled word choices
   - player chooses which word to solve
   - harder word gives more damage
   - solving correctly triggers card effects

Each mini-game should have a timer.

Difficulty affects time limit and damage.

## Phase 7: Shop

Create shop screen.

Shop appears every 5 monsters.

Add these shop items:

- Upgrade Attack
- Add Fire Element
- Add Water Element
- Add Wind Element
- Add Earth Element
- Add Shield
- Remove Card
- Duplicate Card

Shop upgrades affect only the current run.

## Phase 8: Save System

Use LocalStorage.

Save permanent progress:

- unlocked decks
- word mastery
- completed decks
- best run stats

Do not save temporary run upgrades after death.

## Phase 9: Polish

Add simple UI polish:

- card layout
- monster area
- HP bar
- shield bar
- dungeon progress
- shop item cards
- result screen

Use placeholder art only.