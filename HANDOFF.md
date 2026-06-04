# HANDOFF.md

## Project Overview

Vocabulary Dungeon Deckbuilder is a web-first English vocabulary learning roguelike deckbuilder. The project is meant to be a simple, fun vocabulary practice app, not a commercial game.

The core loop combines vocabulary cards, deck review, practice mini-games, dungeon battles, temporary run upgrades, and permanent vocabulary mastery progress.

## Current Project Status

Current version: Prototype v0.1

Current phase: Phase 14 complete. Phase 15 has not started yet.

The project has a Vite + React + TypeScript + Tailwind CSS scaffold with simple screen navigation using React state. It does not use React Router, backend services, databases, authentication, or external APIs.

GitHub backup is configured:

- Remote: `https://github.com/Puttipongpn/WordQuest.git`
- Remote name: `origin`
- Main branch: `main`

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
- Initialized Git for the local project.
- Added `.gitignore` for generated files and local environment files.
- Added a proper `README.md` for WordQuest.
- Pushed the current project backup to GitHub on `origin/main`.
- Built Word Choice Training using `Starter Deck` from `src/data`.
- Added a local-state-only training question flow.
- Added 4 Thai meaning answer choices per question.
- Added correct/wrong feedback, correct answer reveal, and Next/Restart flow.
- Added training progress display with current question, total questions, correct count, and incorrect count.
- Verified the project again with `npm run build` after Phase 4.
- Created `GAME_DESIGN.md` as the central accepted game design document.
- Added app-level in-memory word mastery state.
- Passed mastery data to Deck Review and Training.
- Updated Deck Review to show current mastery values instead of hardcoded `0 / 5`.
- Updated Training so correct answers increase word mastery by 1.
- Clamped mastery to the range `0` to `5`.
- Kept mastery temporary with no LocalStorage persistence.
- Verified the project again with `npm run build` after Phase 4.5.
- Created sample monster data in `src/data/monsters.ts`.
- Built the first local-state Dungeon battle foundation.
- Added player HP, shield display, and gold display.
- Added current monster display with HP, max HP, and attack.
- Connected dungeon battle questions to `Starter Deck` cards.
- Added 4 Thai meaning answer choices for battle questions.
- Implemented card trigger rule for correct battle answers.
- Correct answers deal damage equal to the triggered card's `baseAttack`.
- Incorrect answers do not trigger cards and cause the monster to attack player HP.
- Added Monster Defeated and Run Failed states with next/restart actions.
- Verified the project again with `npm run build` after Phase 5.
- Refactored Dungeon battle questions into a simple battle mini-game structure.
- Kept Word Choice as the current one-card battle mini-game.
- Added the first battle Word Match mini-game.
- Added random battle mini-game selection between Word Choice and Word Match.
- Added Word Match pair selection with 3 English words and 3 Thai meanings.
- Preserved Card Trigger System behavior for both battle mini-games.
- Added visible triggered card, damage dealt, damage taken, and correct/wrong feedback.
- Verified the project again with `npm run build` after Phase 6.
- Created sample current-run shop item data in `src/data/shopItems.ts`.
- Added placeholder shop items for Upgrade Attack, Add Fire Element, Add Water Element, Add Wind Element, Add Earth Element, Add Shield, Remove Card, and Duplicate Card.
- Updated the Shop screen to render shop item cards from shared data.
- Labeled the Shop screen as `Current Run Shop`.
- Added copy explaining shop upgrades are temporary and affect only the current run.
- Kept shop actions as preview-only buttons with no purchase logic or state mutation.
- Verified the project again with `npm run build` after Phase 7.
- Created `src/utils/playerProgressStorage.ts` for LocalStorage permanent progress saves.
- Added versioned saved progress data with `version: 1`.
- Persisted word mastery, unlocked deck ids placeholder, completed deck ids placeholder, and statistics placeholder.
- Loaded saved word mastery when the app starts.
- Saved updated word mastery when Training answers are correct.
- Added safe fallback behavior for missing, invalid, or incompatible saved data.
- Added a Home screen reset progress action that clears LocalStorage and resets in-memory progress to defaults.
- Kept temporary run progress out of LocalStorage, including gold, HP, shield, shop upgrades, duplicated cards, removed cards, card enchantments, monster state, and current dungeon run state.
- Verified the project again with `npm run build` after Phase 8.
- Added simple reusable UI components in `src/components/ui.tsx`.
- Polished layout consistency across Home, Deck Review, Training, Dungeon, Shop, and Run Result.
- Improved header navigation and `ScreenShell` descriptions.
- Improved Deck Review scanability for difficulty, mastery, base attack, and effects.
- Improved Training answer states and progress readability.
- Improved Dungeon battle readability with stat cards, HP bars, monster attack badge, mini-game label, triggered card, damage dealt, damage taken, and correct/wrong feedback.
- Improved Shop readability with current-run messaging, item type badges, cost badges, and disabled preview-only buttons.
- Improved Run Result placeholder layout.
- Kept placeholder visuals only and did not add final art assets.
- Verified the project again with `npm run build` after Phase 9.
- Added temporary dungeon run progression state for monsters defeated, current floor, and next shop checkpoint.
- Increased `monstersDefeated` when a monster is defeated.
- Added Dungeon run progress UI showing monsters defeated, current floor, next shop, and current run progress.
- Added shop checkpoint detection at 5, 10, 15, and later multiples of 5.
- Added `Shop Available` display and `Go To Shop` routing from Dungeon.
- Added `Back To Dungeon` routing from Shop.
- Kept shop purchases, boss battles, run rewards, deck mutation, and element interactions unimplemented.
- Kept run progression temporary and out of LocalStorage.
- Preserved Word Choice, Word Match, and the Card Trigger System.
- Verified the project again with `npm run build` after Phase 10.
- Added a temporary current-run deck copy that starts from `Starter Deck`.
- Updated Dungeon battle questions to use the current-run deck instead of the source `Starter Deck`.
- Added temporary run gold starting at 20.
- Added +5 temporary gold when a monster is defeated.
- Added active `Upgrade Attack` purchase logic in the Shop.
- Added current-run card selection for Upgrade Attack purchases.
- Upgrade Attack increases the selected current-run card's `baseAttack` by +2 and subtracts the existing shop item cost.
- Added success and not-enough-gold shop feedback.
- Kept all other shop items preview-only / coming soon.
- Reset current-run deck, gold, monster state, HP, shield, and run progression on run restart.
- Kept shop upgrades, gold, and current-run deck changes out of LocalStorage.
- Kept element items, remove card, duplicate card, boss logic, run rewards, deck unlocks, and final art assets unimplemented.
- Verified the project again with `npm run build` after Phase 11.
- Made player shield functional in Dungeon battles.
- Monster attacks now reduce shield before damaging player HP.
- Triggered cards with shield effects now add shield while still dealing `baseAttack` damage.
- Activated the `Add Shield` shop purchase for current-run cards.
- Add Shield lets the player choose one current-run card and add or increase Shield by +3.
- Updated Dungeon feedback to show shield absorbed, HP damage taken, shield gained, and triggered effects summary.
- Kept shield, shield effects, shop upgrades, gold, and current-run deck changes temporary and out of LocalStorage.
- Kept element items, remove card, duplicate card, boss logic, run rewards, deck unlocks, and final art assets unimplemented.
- Verified the project again with `npm run build` after Phase 12.
- Added Word Scramble as the third Dungeon battle mini-game.
- Word Scramble randomly chooses 3 cards from the current-run deck and shows scrambled English word options.
- Word Scramble uses typed input for the first simple implementation.
- Correct Word Scramble answers trigger the selected current-run word card.
- Word Scramble uses current-run `baseAttack` and shield effects, including shop upgrades.
- Wrong Word Scramble answers do not trigger card effects and cause monster attacks with shield absorption.
- Added Word Scramble into random battle mini-game selection with Word Choice and Word Match.
- Preserved Upgrade Attack, Add Shield, shield absorption, gold rewards, shop checkpoint routing, and run reset behavior.
- Kept element items, remove card, duplicate card, boss logic, run rewards, timers, run persistence, and final art assets unimplemented.
- Verified the project again with `npm run build` after Phase 13.
- Activated Add Fire Element, Add Water Element, Add Wind Element, and Add Earth Element shop purchases.
- Element shop items let the player choose one current-run card and add or replace that card's element effect.
- A current-run card may have one element effect for now.
- Element effects are temporary current-run card effects and are not saved to LocalStorage.
- Dungeon triggered effects summary now displays element effects, such as `Element: Fire`.
- Element effects are display-only in Phase 14 and do not change damage, weakness, or resistance.
- Preserved Word Choice, Word Match, Word Scramble, Upgrade Attack, Add Shield, shield absorption, gold rewards, shop checkpoint routing, and run reset behavior.
- Kept remove card, duplicate card, boss logic, run rewards, timers, run persistence, advanced element interactions, and final art assets unimplemented.
- Verified the project again with `npm run build` after Phase 14.

## Implemented Screens

The following screens are implemented or stubbed:

- Home: polished entry screen with flow badges, primary actions, reset progress, and prototype summary.
- Deck Review: polished vocabulary presentation screen using `Starter Deck`.
- Training: polished first Word Choice Training interaction using `Starter Deck`.
- Dungeon: polished local-state vocabulary card battle foundation with Word Choice, Word Match, Word Scramble, temporary run progression, current-run deck, gold, shield absorption, and shop checkpoint routing.
- Shop: current-run shop with active Upgrade Attack and Add Shield purchases, preview-only remaining items, and back-to-dungeon routing.
- Run Result: polished placeholder summary screen with a button back to Home.

Navigation is controlled by `currentScreen` state in `src/App.tsx`.

## Build Status

The production build has been verified with:

```sh
npm run build
```

The build passed successfully after dependencies were installed, after Phase 2 data model work, after Phase 3 Deck Review work, after Phase 4 Training work, after Phase 4.5 mastery/design work, after Phase 5 dungeon battle foundation work, after Phase 6 battle mini-game structure work, after Phase 7 shop presentation work, after Phase 8 LocalStorage save work, after Phase 9 UI polish work, after Phase 10 run progression work, after Phase 11 first shop purchase work, after Phase 12 basic shield system work, after Phase 13 Word Scramble work, and after Phase 14 basic element shop work.

The local development server can be started with:

```sh
npm run dev -- --host 127.0.0.1
```

## Current Architecture

The app is intentionally small and simple.

- `src/App.tsx`: owns the current screen state and renders the active screen.
- `src/components`: reusable UI pieces such as the app header, screen layout shell, and small UI primitives.
- `src/screens`: top-level screen components.
- `src/types`: shared TypeScript types.
- `src/game`: reserved for pure game logic.
- `src/data`: reserved for seed vocabulary decks and game data.
- `src/utils`: utility helpers, currently including LocalStorage player progress save/load/reset.

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

Current component files:

- `src/components/AppHeader.tsx`: responsive top navigation.
- `src/components/ScreenShell.tsx`: consistent screen spacing, title, and optional description.
- `src/components/ui.tsx`: small reusable presentation primitives: `Badge`, `Button`, `CardPanel`, `ProgressBar`, and `StatCard`.

Current utility files:

- `src/utils/playerProgressStorage.ts`: LocalStorage load, save, reset, default progress, save version, and validation fallback helpers.

Current data files:

- `src/data/starterDeck.ts`: the first sample vocabulary deck.
- `src/data/monsters.ts`: sample monster list with Slime, Goblin, and Bat.
- `src/data/shopItems.ts`: sample current-run shop item placeholders.
- `src/data/index.ts`: data exports.

Repository files:

- `.gitignore`: excludes `node_modules/`, `dist/`, environment files, `.DS_Store`, logs, and TypeScript build info.
- `README.md`: project overview, tech stack, status, planned features, commands, and Version 1 scope.
- `GAME_DESIGN.md`: central gameplay design reference for project concept, systems, rules, planned features, and deferred scope.

Current Deck Review implementation:

- `src/screens/DeckReview.tsx` imports `starterDeck` from `src/data`.
- It receives current `wordMastery` from `src/App.tsx`.
- All cards render in a responsive grid.
- Clicking a card stores the selected card in local React state.
- The selected card detail panel shows word, Thai meaning, part of speech, example sentence, difficulty, base attack, effects, and mastery placeholder.
- Mastery displays persisted values from `0 / 5`.
- Deck summary shows deck name, total cards, and current total saved mastery.
- Deck Review does not mutate mastery and has no persistence, save logic, battle logic, shop logic, or training interaction logic.
- Phase 9 UI polish added clearer badges, stat cards, and progress bars for scanability.

Current Training implementation:

- `src/screens/Training.tsx` imports `starterDeck` from `src/data`.
- The first mini-game is Word Choice Training.
- It uses the first 10 cards from `Starter Deck`.
- Each question shows either the card image placeholder or English word as the prompt.
- Each question shows 4 Thai meaning answer choices.
- Player selection shows correct/wrong feedback and reveals the correct answer.
- A Next button advances to the next question.
- The final question shows a Restart button that resets the local training session.
- Training progress shows current question, total questions, correct count, and incorrect count.
- Training receives saved `wordMastery` and an `onIncreaseWordMastery` callback from `src/App.tsx`.
- Correct answers increase that word's mastery by 1 and save updated permanent progress to LocalStorage.
- Mastery cannot exceed 5.
- Wrong answers do not decrease mastery for now.
- Training does not change HP, gold, shield, run state, shop state, dungeon progress, or temporary run progress.
- Phase 9 UI polish made unanswered, correct, wrong, and correct-answer states clearer.

Current Word Mastery implementation:

- App-level permanent progress state lives in `src/App.tsx` as `SavedPlayerProgress`.
- Default mastery is `0` for cards that do not yet have an entry.
- Mastery range is `0` to `5`.
- Correct Training answers increase mastery by `1`.
- Wrong Training answers do not decrease mastery.
- Mastery is loaded from LocalStorage on app start.
- Mastery is saved to LocalStorage after correct Training answers.
- Deck Review shows saved mastery after page refresh.

Current LocalStorage save implementation:

- `src/utils/playerProgressStorage.ts` owns LocalStorage access.
- Save key is internal to the utility.
- Save data includes `version: 1`.
- Saved permanent progress includes word mastery, unlocked deck ids placeholder, completed deck ids placeholder, and statistics placeholder.
- Missing, invalid, or incompatible saved data falls back to default progress.
- Storage read/write failures are caught so the app can continue with in-memory state.
- Home exposes a `Reset Progress` action.
- Reset clears saved LocalStorage progress and resets in-memory progress to defaults.
- LocalStorage does not save gold, HP, shield, shop upgrades, duplicated cards, removed cards, card enchantments, monster state, or current dungeon run state.

Current Dungeon implementation:

- `src/screens/Dungeon.tsx` uses temporary React state only.
- `src/screens/Dungeon.tsx` imports `sampleMonsters` from `src/data`.
- `src/App.tsx` owns temporary current-run deck, gold, and run progression state so Dungeon can route to Shop and back while preserving current-run changes.
- Run progression tracks `monstersDefeated`, `currentFloor`, and `nextShopAt`.
- The current-run deck starts as a copy of `Starter Deck`.
- Shop upgrades must not mutate `src/data/starterDeck.ts`.
- Dungeon battle questions use the current-run deck, not the original seed deck.
- Player state includes HP, functional shield, and gold display.
- Monster state includes current monster, HP, max HP, and attack.
- Battle questions use a simple mini-game structure and the current-run deck.
- Each battle question randomly selects Word Choice, Word Match, or Word Scramble.
- Word Choice shows one prompt card and 4 Thai meaning answer choices.
- Word Match shows 3 English words and 3 Thai meanings.
- Word Match requires selecting one English word and one Thai meaning.
- Word Scramble shows 3 scrambled English word options from the current-run deck.
- Word Scramble asks the player to choose one scrambled card and type the original English word.
- Correct Word Choice answers trigger the prompt word card.
- Correct Word Match pairs trigger the selected English word card.
- Correct Word Scramble answers trigger the selected scrambled word card.
- Triggered cards deal damage equal to `baseAttack`.
- Triggered cards use the current-run card's `baseAttack`, including any Upgrade Attack purchases.
- Incorrect answers do not trigger card effects.
- Incorrect answers cause the current monster to attack, with shield absorbing damage before HP.
- Battle feedback shows triggered card, damage dealt, damage taken, shield absorbed, HP damage, shield gained, triggered effects, and correct/wrong result.
- When monster HP reaches 0, the screen shows `Monster Defeated` and allows spawning the next sample monster.
- Defeating a monster increases `monstersDefeated` by 1.
- Defeating a monster grants +5 temporary gold.
- Shop checkpoints occur every 5 defeated monsters.
- At a shop checkpoint, Dungeon shows `Shop Available` and a `Go To Shop` button.
- Shop routing can mutate the current-run deck only through active current-run purchases.
- Restarting a failed run resets temporary run progression, gold, monster state, HP, shield, and the current-run deck back to a fresh `Starter Deck` copy.
- When player HP reaches 0, the screen shows `Run Failed` and allows restarting the local run.
- Gold starts at 20 and is functional for Upgrade Attack and Add Shield purchases.
- Shield starts at 0 and is functional temporary run state.
- Monster attacks reduce shield before damaging player HP.
- Triggered cards with shield effects add shield while still dealing `baseAttack` damage.
- Dungeon feedback shows total monster attack, shield absorbed, HP damage taken, shield gained, triggered card, and triggered effects summary.
- No remove card, duplicate card, boss logic, run rewards, backend, API, advanced element interactions, or permanent mastery updates are connected to dungeon battle yet. Dungeon run state is not saved to LocalStorage.
- Phase 9 UI polish added clearer player HP, monster HP, monster attack, mini-game type, triggered card, damage dealt, damage taken, and correct/wrong feedback presentation.
- Phase 12 added functional shield combat feedback.
- Phase 13 added Word Scramble with typed answer input.
- Phase 14 added display-only element effects from current-run shop purchases.

Current Shop implementation:

- `src/screens/Shop.tsx` imports `sampleShopItems` from `src/data`.
- `src/data/shopItems.ts` defines current-run placeholder items.
- The Shop screen is labeled `Current Run Shop`.
- The screen explains that shop upgrades are temporary and affect only the current run.
- Each shop item card shows an icon placeholder, name, description, cost, and type.
- Upgrade Attack, Add Shield, and Add Fire/Water/Wind/Earth Element are active purchases.
- Upgrade Attack uses the existing shop item cost.
- The player can choose one card from the current-run deck for Upgrade Attack.
- Upgrade Attack increases the selected card's `baseAttack` by +2 and subtracts gold when the player has enough gold.
- Add Shield uses the existing shop item cost.
- The player can choose one card from the current-run deck for Add Shield.
- Add Shield adds Shield +3 to the selected card or increases an existing shield effect by +3.
- Element purchases use the existing shop item costs.
- The player can choose one card from the current-run deck for each element purchase.
- Element purchases add or replace the selected card's single element effect.
- Element effects are display-only in Phase 14 and do not change damage.
- The Shop shows success feedback after a purchase and not-enough-gold feedback when gold is insufficient.
- Remove Card and Duplicate Card have disabled coming-soon actions.
- Phase 7 was presentation-only; Phase 11 added Upgrade Attack and Phase 12 added Add Shield.
- Phase 9 UI polish made item type, cost, preview-only state, and current-run-only messaging clearer.
- Phase 10 added `Back To Dungeon` routing.
- Remove card, duplicate card, advanced element interactions, and balancing are deferred.

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
- Battle systems should be built around card-triggered effects: mini-games select or use vocabulary cards, correct answers trigger the selected card, and incorrect answers do not trigger card effects.
- Future shop upgrades and enchantments should modify card effects rather than player stats directly.
- Phase 7 shop item effects are placeholders only until purchase logic exists.
- LocalStorage saves permanent progress only.
- Run progress is not persisted.
- Saved progress uses `version: 1`.
- Phase 10 run progression is temporary and not saved to LocalStorage.
- Shop checkpoint routing is available every 5 defeated monsters.
- Phase 11 uses a temporary current-run deck copy.
- Upgrade Attack is the first active shop purchase.
- Add Shield is the second active shop purchase.
- Gold is temporary run progress.
- Shop upgrades are not persisted to LocalStorage.
- Shield absorbs monster damage before HP.
- Shield effects are temporary current-run card effects.
- Shield and shield effects are not persisted to LocalStorage.
- Word Scramble is the third battle mini-game.
- Word Scramble uses typed input first.
- Word Scramble uses the current-run deck and the Card Trigger System.
- Element shop items are active.
- A card may have one element effect for now.
- Element effects are display-only in Phase 14.
- Element effects are temporary current-run card effects and are not persisted.
- Wrong answers allow monsters to attack.
- Shop upgrades are inspired by Balatro and other deckbuilder games.
- Placeholder visuals are preferred for Version 1.
- Phase 9 introduced small reusable UI primitives for consistent presentation without changing gameplay rules.

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

Current prototype note: word mastery is persisted in LocalStorage. Other permanent progress categories currently exist as placeholders.

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
- Current run deck copy
- Monsters defeated
- Current floor
- Next shop checkpoint

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

Current battle foundation rules:

- Player starts with HP, gold, and a current run copy of the selected deck.
- Current run deck starts as a copy of `Starter Deck`.
- Gold starts at 20.
- The player fights monsters one by one.
- Run progression tracks monsters defeated, current floor, and next shop checkpoint.
- The current foundation randomly selects Word Choice, Word Match, or Word Scramble for each battle question.
- Correct answers trigger the selected word card.
- Word Scramble correct typed answers trigger the selected scrambled word card.
- Triggered word cards deal damage equal to `baseAttack` in the current foundation.
- Triggered word cards with shield effects add shield while still dealing `baseAttack` damage.
- Incorrect answers do not trigger card effects.
- Wrong answers let the monster attack, and shield absorbs damage before HP.
- Shield starts at 0 and is temporary run state.
- Gold is functional for Upgrade Attack and Add Shield purchases.
- Defeating a monster gives +5 gold.
- Shop checkpoints appear every 5 defeated monsters.
- Dungeon can route to Shop at a checkpoint.
- Shop can route back to Dungeon.
- Upgrade Attack can increase a current-run card's `baseAttack` by +2.
- Add Shield can add or increase Shield +3 on a current-run card.
- Element shop purchases can add or replace one display-only element effect on a current-run card.
- Remove and duplicate shop item purchases are not connected to dungeon runs yet.
- Boss appears at monster 20 later.
- Run rewards are deferred.

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

Card Trigger System:

- Mini-games use vocabulary cards.
- Correct answers trigger the selected word card.
- Triggered cards activate their effects.
- Version 1 triggered effects are Attack, Shield, and Element.
- Incorrect answers do not trigger card effects.
- Future shop upgrades and enchantments modify card effects, not player stats directly.

Difficulty is numeric only:

- `1` = Easy
- `2` = Medium
- `3` = Hard

Do not introduce CEFR levels yet.

## Mini-Games Planned

Initial battle mini-games:

- Word Choice
  - Shows one prompt card.
  - Shows 4 Thai meaning choices.
  - Correct answer triggers the prompt word card.
- Word Match
  - Shows 3 English words and 3 Thai meanings.
  - Player selects one English word and one Thai meaning.
  - Correct pair triggers the selected English word card.
- Word Scramble
  - Show multiple scrambled word choices.
  - Player chooses which word to solve.
  - Player types the original English word.
  - Solving correctly triggers the selected current-run card.
  - Current-run attack and shield upgrades apply through the Card Trigger System.

Training mini-games:

- Word Choice Training
  - Implemented with local state only.
  - Uses `Starter Deck` data.
  - Shows image placeholder or English word prompts.
  - Uses 4 Thai meaning answer choices.
  - Shows correct/wrong feedback and correct answer after selection.
  - Correct answers increase saved word mastery by 1.
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

Current shop state:

- Shop presentation is implemented.
- Shop item data lives in `src/data/shopItems.ts`.
- Upgrade Attack is active.
- Add Shield is active.
- Upgrade Attack modifies only current-run card attack.
- Add Shield modifies only current-run card shield effects.
- Active purchases cost gold and subtract from temporary run gold.
- Element shop actions are active and display-only in battle summaries.
- Remove and duplicate shop actions are preview-only / coming soon.
- No shop upgrade is saved to LocalStorage.

## Required Project Documents

These documents are required project maintenance files:

- `PROJECT_STATUS.md`: current progress, completed work, active task, and next task.
- `HANDOFF.md`: project handoff context for another developer or AI agent.
- `DECISIONS.md`: accepted decision log.
- `GAME_DESIGN.md`: central accepted gameplay design reference.

After every completed task, update these documents as needed. Update `GAME_DESIGN.md` when gameplay rules, systems, or scope change.

## GitHub Backup

The project is backed up to GitHub:

- Repository: `https://github.com/Puttipongpn/WordQuest.git`
- Branch: `main`
- Remote: `origin`

Use normal Git flow for future backups:

```sh
git status
git add .
git commit -m "Describe the change"
git push
```

## Next Recommended Task

Phase 14 is complete.

Recommended next task:

Continue with the next explicitly requested phase or feature. Do not add backend, boss logic, remove/duplicate shop purchase logic, run rewards, timers, persistent run state, advanced element interactions, or final art assets unless explicitly requested.
