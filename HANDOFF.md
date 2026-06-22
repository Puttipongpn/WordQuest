# HANDOFF.md

## Project Overview

Vocabulary Dungeon Deckbuilder is a web-first English vocabulary learning roguelike deckbuilder. The project is meant to be a simple, fun vocabulary practice app, not a commercial game.

The core loop combines vocabulary cards, deck review, practice mini-games, dungeon battles, temporary run upgrades, and permanent vocabulary mastery progress.

## Current Project Status

Current version: Prototype v0.1

Current phase: Phase 58 Game Feel / Motion Pass complete.

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
- Added temporary gold when a monster is defeated, currently tuned to +6.
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
- Element effects started as display-only in Phase 14; Phase 26 adds simple current-run-only gameplay effects while weakness and resistance remain deferred.
- Preserved Word Choice, Word Match, Word Scramble, Upgrade Attack, Add Shield, shield absorption, gold rewards, shop checkpoint routing, and run reset behavior.
- Kept remove card, duplicate card, boss logic, run rewards, timers, run persistence, advanced element interactions, and final art assets unimplemented.
- Verified the project again with `npm run build` after Phase 14.
- Activated Remove Card and Duplicate Card shop purchases.
- Remove Card lets the player choose one current-run card, spend the existing item cost, and remove that card from the current-run deck.
- Added a minimum current-run deck size of 5 cards and disabled Remove Card when the deck is too small.
- Duplicate Card lets the player choose one current-run card, spend the existing item cost, and add a unique-id copy to the current-run deck.
- Duplicates preserve current-run upgrades, including `baseAttack`, shield effects, and element effects.
- Updated Shop UI to show current deck size and card attack, shield, and element summaries for Remove/Duplicate previews.
- Dungeon mini-games continue to use the mutated current-run deck, so removed cards stop appearing and duplicated cards can appear more often.
- Dungeon question builders avoid showing the same word twice in a single battle question, even when duplicates exist in the run deck.
- Kept Remove/Duplicate mutations temporary and out of LocalStorage.
- Preserved Word Choice, Word Match, Word Scramble, Upgrade Attack, Add Shield, element effects, shield absorption, gold rewards, shop checkpoint routing, and run reset behavior.
- Kept boss logic, run rewards, deck unlocks, timers, persistent run state, advanced element interactions, and final art assets unimplemented.
- Verified the project again with `npm run build` after Phase 15.
- Added sample boss data in `src/data/bosses.ts`.
- Added the first boss, Gatekeeper, with higher HP, higher attack, and a placeholder icon.
- Boss becomes available after 20 defeated monsters.
- Added Boss Available UI and a Start Boss Battle action in Dungeon.
- Boss battles use the same Word Choice, Word Match, Word Scramble, Card Trigger System, current-run deck, attack, shield, and element display behavior.
- Wrong boss battle answers cause boss attacks, with shield absorbing damage before HP.
- Boss defeat creates a Run Complete state.
- Added a simple run completion summary with monsters defeated, current floor, final gold, and current-run deck size.
- Restarting a run resets boss state along with HP, shield, gold, monster state, run progression, and current-run deck changes.
- Kept run rewards, deck unlocks, timers, persistent run state, advanced element interactions, and final art assets unimplemented.
- Verified the project again with `npm run build` after Phase 16.
- Added the first permanent run completion reward.
- Boss defeat now marks `Starter Deck` as completed.
- Completed deck ids are saved in LocalStorage permanent progress.
- Home shows whether Starter Deck is completed.
- Deck Review shows Starter Deck completion status.
- Run Complete shows reward feedback: Starter Deck completed and permanent progress saved.
- Reset Progress clears completed deck ids along with saved word mastery.
- Kept real new deck unlocks, Oxford 3000 import, timers, advanced element interactions, backend, auth, and final art assets unimplemented.
- Verified the project again with `npm run build` after Phase 17.
- Performed full current-loop QA across Home, Deck Review, Training, Dungeon, Shop, Boss, Run Complete, and Reset Progress paths.
- Added shop purchase guards so stale or missing current-run card ids cannot spend gold.
- Made Duplicate Card ids more collision-resistant for rapid duplicate purchases.
- Added Remove Card safety requiring at least 5 current-run cards and at least 4 distinct visible words to remain after removal.
- Added Shop selection fallback after deck mutation so selected card ids stay valid.
- Improved current-run-only shop feedback and reset behavior copy.
- Improved Remove Card disabled/warning copy.
- Improved Boss Available copy to clarify boss/shop choice at the monster 20 milestone.
- Improved Run Complete actions with Start Fresh Run, Review Completed Deck, and Back Home.
- Verified the local dev server response during QA.
- Verified the project again with `npm run build` after Phase 18.
- Applied the first cozy fantasy dungeon visual direction pass using CSS, Tailwind, emoji, and placeholder icons only.
- Updated the global background, typography feel, reusable panels, badges, buttons, stat cards, and progress bars to feel more game-like.
- Updated navigation into game menu-style tabs with icons.
- Updated Home into a WordQuest title/start screen.
- Updated Deck Review cards to feel more like collectible cards.
- Updated Training to feel more like a practice mini-game room.
- Updated Dungeon to feel more like a battle screen.
- Updated Shop to feel more like a fantasy shop.
- Updated Run Result placeholder to match the game-style direction.
- Preserved Phase 18 safety guards, run reset rules, and permanent-progress-only LocalStorage rules.
- Kept final art assets, external UI libraries, backend, auth, database, API, Oxford 3000 import, timers, advanced element interactions, and new gameplay systems unimplemented.
- Verified the project again with `npm run build` after Phase 19.
- Verified the local dev server response; in-app browser visual QA was unavailable in this session because the browser surface was not available.
- Refactored Dungeon presentation into a battle-scene hierarchy without changing gameplay rules.
- Moved current monster/boss encounter to the top priority area with portrait, name, attack, and HP bar.
- Made the active mini-game the central visual focus.
- Moved player HP, shield, gold, run progress, and boss progress into a bottom battle status band.
- Moved triggered card, damage feedback, shield/HP damage feedback, and trigger-rule explanation into a secondary side panel.
- Moved verbose trigger-rule text into a collapsible details panel.
- Preserved all existing battle mini-games, current-run deck behavior, shop routing, boss routing, run completion reward, and LocalStorage behavior.
- Verified the project again with `npm run build` after Phase 20.
- Added a second manual sample vocabulary deck, `Food Deck`, with 20 food-related cards.
- Added `availableDecks` in `src/data` so app screens can access all manual sample decks.
- Added app-level selected deck state with `Starter Deck` as the default selected deck.
- Added Home deck selection UI showing each deck's name, description, card count, selected status, and completed status.
- Updated Deck Review and Training to use the selected deck instead of hardcoded Starter Deck data.
- Updated Dungeon so the current-run deck starts as a copy of the selected deck.
- Updated boss defeat / Run Complete so the selected deck id is marked completed in LocalStorage permanent progress.
- Changing decks resets temporary run state, gold, run progression, and current-run deck while preserving word mastery and completed deck ids.
- Preserved existing combat rules, shop purchases, run deck mutation, boss behavior, LocalStorage permanent-progress-only rules, and Oxford 3000 deferral.
- Verified the project again with `npm run build` after Phase 21.
- Implemented the first deck unlock progression foundation.
- Starter Deck is unlocked by default.
- Food Deck starts locked and appears in Home with requirement copy.
- Locked decks cannot be selected.
- Completing Starter Deck now marks Starter Deck completed and unlocks Food Deck in LocalStorage permanent progress.
- Completing Food Deck originally showed next-deck-coming-soon reward feedback before Phase 31 expanded manual deck progression.
- `unlockedDeckIds` now persists as active permanent progress rather than placeholder-only data.
- Reset Progress clears unlock progress back to default Starter-only access.
- Existing saved progress is normalized so Starter Deck remains unlocked and completed Starter Deck unlocks Food Deck.
- Selected deck fallback safety prevents locked or unavailable decks from crashing the app.
- Preserved existing selected deck flow, Review, Training, Dungeon, Shop, boss battles, current-run reset rules, and permanent-progress-only LocalStorage rules.
- Verified the project again with `npm run build` after Phase 22.
- Redesigned Training to focus on recall and contextual practice instead of simple picture-to-Thai recognition.
- Added random Training question types: English Word to Thai Meaning, Thai Meaning to English Word, and Example Sentence Cloze.
- Training shows the current question type, prompt, answer choices, correct/wrong feedback, and correct answer reveal.
- Correct Training answers still increase saved word mastery by 1, and wrong answers still do not decrease mastery.
- Updated Dungeon Word Choice prompts to prefer English/Thai recall and cloze-style prompts instead of image-only prompts.
- Preserved Word Match, Word Scramble, the Card Trigger System, selected deck, deck unlock progression, shop purchases, boss battles, Run Complete, and LocalStorage permanent-progress-only rules.
- Kept timers, advanced element interactions, Oxford 3000 import, backend, auth, database, API, shop rule changes, boss rule changes, save rule changes, and final art assets unimplemented.
- Verified the project again with `npm run build` after Phase 23.
- Added the first Dungeon-only battle timer foundation.
- Added static time limits, currently tuned to Word Choice 14 seconds, Word Match 20 seconds, and Word Scramble 24 seconds.
- Dungeon now shows remaining time, current mini-game limit, and a low-time warning style at 3 seconds or less.
- Countdown starts for active Dungeon battle questions and stops after an answer.
- Timeout is treated as a wrong answer: no card triggers, monster or boss attacks, and shield absorbs damage before HP.
- Timer resets on next question, next monster, boss battle start, and run restart.
- Timer does not run during Monster Defeated, Boss Available before starting boss, Shop routing, Run Failed, Run Complete, Shop, or Training.
- Training remains untimed for safe learning practice.
- Preserved selected deck, deck unlock progression, word mastery save, completed deck save, current-run deck, shop purchases, remove/duplicate card, boss battle, Run Complete, and LocalStorage permanent-progress-only rules.
- Verified the project again with `npm run build` after Phase 24.

## Implemented Screens

The following screens are implemented or stubbed:

- Home: polished game hub with selected deck hero, local-save copy, primary actions, selected deck mastery summary, compact Best Run summary, deck progression path, deck cards with locked/unlocked/selected/completed states, per-deck mastery summaries, and separate Reset Progress danger zone.
- Deck Review: polished vocabulary presentation screen using the selected deck, including mastery and deck completion status.
- Training: polished untimed recall-focused practice using the selected deck with English-to-Thai, Thai-to-English, and Example Sentence Cloze question types.
- Dungeon: polished timed local-state vocabulary card battle foundation with Monster, Elite, and Event encounters; Word Choice, Word Match, Word Scramble; temporary run progression; selected-deck current-run copy; run statistics; gold; shield absorption; first-pass element effects; shop checkpoint routing; boss encounter; Run Complete state; Run Failed summary; and permanent selected-deck completion reward.
- Shop: current-run shop with active Upgrade Attack, Add Shield, Add Element, Remove Card, and Duplicate Card purchases, temporary run gold costs, plus back-to-dungeon routing.
- Run Result: polished placeholder summary screen with a button back to Home.

Navigation is controlled by `currentScreen` state in `src/App.tsx`.

## Build Status

The production build has been verified with:

```sh
npm run build
```

The build passed successfully after dependencies were installed, after Phase 2 data model work, after Phase 3 Deck Review work, after Phase 4 Training work, after Phase 4.5 mastery/design work, after Phase 5 dungeon battle foundation work, after Phase 6 battle mini-game structure work, after Phase 7 shop presentation work, after Phase 8 LocalStorage save work, after Phase 9 UI polish work, after Phase 10 run progression work, after Phase 11 first shop purchase work, after Phase 12 basic shield system work, after Phase 13 Word Scramble work, after Phase 14 basic element shop work, after Phase 15 current-run deck mutation work, after Phase 16 boss battle foundation work, after Phase 17 permanent deck completion reward work, after Phase 18 gameplay flow QA cleanup work, after Phase 19 game-style visual direction work, after Phase 20 Dungeon battle layout refactor work, after Phase 21 deck selection foundation work, after Phase 22 deck unlock progression foundation work, after Phase 23 learning mini-game redesign work, after Phase 24 Dungeon battle timer foundation work, after Phase 25 basic balance pass work, after Phase 26 element interaction foundation work, after Phase 27 run stats / best run summary work, after Phase 28 elite/event encounter foundation work, after Phase 29 full run playtest/tuning work, after Phase 30 Dungeon battle presentation work, after Phase 31 expanded deck progression work, after Phase 32 Encounter Intro / Pause System work, after Phase 33 Mastery System Gameplay Pass work, after Phase 34 Full Battle Screen Layout Refactor work, after Phase 34.1 Dungeon Layout Hotfix work, after Phase 34.2 True Fullscreen Battle Mode work, after Phase 34.3 Battle Screen Fit Pass work, after Phase 34.4 Mini-game UX + Battle Readability Refactor work, after Phase 34.5 Battle Option Density + Result Overlay Hotfix work, after Phase 34.6 Word Match Anti-Hint + Mini-game Composition Pass work, after Phase 35 Combat Feedback + Defeat Presentation Pass work, after Phase 36 Battle Stage Animation Hooks + Motion Polish work, after Phase 36.1 Unified Encounter Resolution Actions Hotfix work, after Phase 37 Enemy Variety Pass work, after Phase 38 Shop Offer Redesign work, after Phase 39 Card Fatigue / Word Energy System work, after Phase 39.1 Word Energy Balance + Diagnostics Hotfix work, after Phase 39.2 Run Exit Flow + Permanent Progress Safety Hotfix work, after Phase 40 Event Expansion Pass work, after Phase 41 Event QA + Balance Pass work, after Phase 42 Boss Variety + Boss Presentation work, after Phase 43 Run Complete / Run Failed Summary Polish work, after Phase 44 Home / Deck Progress Polish work, after Phase 45 Training Mode Expansion work, after Phase 46 Deck Review Learning Polish work, after Phase 47 Full Prototype QA + Balance Pass work, after Phase 48 QA Helper + Full Prototype QA work, after Phase 49 First Balance Tuning work, after Phase 50 Prototype Stabilization + Deploy Prep work, and after Phase 51 Visual Identity + Game Feel Polish work.

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
- `src/game`: pure game rules and shared balance constants.
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
- `src/types/game.ts`: vocabulary cards, decks, player progress, run state, run statistics, player statistics, monsters, bosses, shop items, elements, mini-game types, and mastery data.

Current component files:

- `src/components/AppHeader.tsx`: responsive top navigation.
- `src/components/ScreenShell.tsx`: consistent screen spacing, title, and optional description.
- `src/components/ui.tsx`: small reusable presentation primitives: `Badge`, `Button`, `CardPanel`, `ProgressBar`, and `StatCard`.

Current utility files:

- `src/utils/playerProgressStorage.ts`: LocalStorage load, save, reset, default progress, save version, and validation fallback helpers.

Current game rule files:

- `src/game/balance.ts`: first-pass balance constants for player HP, shield, gold, shop interval, boss milestone, shop upgrade amounts, deck safety limits, Dungeon timer limits, and shop item costs.

Current data files:

- `src/data/starterDeck.ts`: the first sample vocabulary deck.
- `src/data/foodDeck.ts`: the second manual sample deck for multi-deck flow testing.
- `src/data/monsters.ts`: sample monster list with Slime, Goblin, and Bat.
- `src/data/bosses.ts`: placeholder boss pool with Gatekeeper, Word Warden, Grammar Golem, Shadow Reader, and Memory Dragon.
- `src/data/shopItems.ts`: sample current-run shop item placeholders.
- `src/data/index.ts`: data exports, including `availableDecks`.

Current balance values:

- Player max HP: `32`
- Starting gold: `20`
- Gold per defeated monster: `7`
- Shop interval: every `5` defeated monsters
- Boss requirement: `20` defeated monsters
- Boss pool values: `64-76` HP and `7-10` attack
- Upgrade Attack amount: `+2`
- Add Shield amount: `+3`
- Minimum current-run deck size: `5`
- Minimum distinct visible words for battle questions: `4`
- Dungeon timers: Word Choice `14s`, Word Match `20s`, Word Scramble `24s`
- Element values: Fire `+2` damage, Water `+2` shield, Earth `-2` next attack, Wind `+1` gold on defeat
- Encounter weights: Monster `70`, Event `20`, Elite `10`
- Elite rules: `1.5x` HP, `+2` attack, `+10` bonus current-run gold
- Event rewards: Treasure +10 gold or +1 random card attack; Shrine +5 HP or +5 shield; Altar -5 HP plus random element or leave; Campfire HP or Word Energy recovery; Lost Backpack gold or random attack upgrade; Ancient Library gold or random attack upgrade; Element Fountain random element or random card shield; Cursed Door HP-cost gold or attack upgrade; Wandering Trainer attack upgrade or Word Energy recovery; Mystic Well HP or shield; Forgotten Signpost gold or shield
- Card baseAttack values were not changed in Phase 25.

Repository files:

- `.gitignore`: excludes `node_modules/`, `dist/`, environment files, `.DS_Store`, logs, and TypeScript build info.
- `README.md`: project overview, tech stack, status, planned features, commands, and Version 1 scope.
- `GAME_DESIGN.md`: central gameplay design reference for project concept, systems, rules, planned features, and deferred scope.

Current Deck Review implementation:

- `src/screens/DeckReview.tsx` receives the selected deck from `src/App.tsx`.
- It receives current `wordMastery` from `src/App.tsx`.
- It receives unlocked deck ids and navigation from `src/App.tsx` for display status and compact screen handoff actions.
- Deck Review is now a learning preparation screen, not just a static card list.
- The top summary shows selected deck name, description, status, total card count, mastered words, average mastery, weak word count, and a deck mastery progress bar.
- Readiness copy helps the player decide whether to train first, enter Dungeon, replay a completed deck, or continue progression.
- Display-only filters are available for All, Weak, Unmastered, Mastered, Attack High, and Has Effect.
- Display-only sorting supports default deck order, mastery low/high, difficulty low/high, attack high, and alphabetical.
- Filter empty states explain what to do next, such as trying Review All, Training, or Dungeon.
- All matching cards render in a responsive grid.
- Clicking a card stores the selected card in local React state.
- Card grid entries show English word, Thai meaning, part of speech, difficulty, mastery, mastery guidance, mastery progress, base attack, effects, and mastered status.
- The selected card detail panel shows word, Thai meaning, part of speech, example sentence, image placeholder, difficulty, base attack, effects, mastery value, mastery guidance, and Dungeon mastery damage bonus.
- The selected card detail includes short battle-role copy explaining base attack damage, permanent mastery bonus damage, and current-run-only shop upgrades.
- Deck Review includes compact handoff buttons for Start Training, Enter Dungeon, Back Home, Train Weak Words, Train Unmastered, and Quick Practice. These navigate to Training or Dungeon only; they do not preselect a Training mode yet.
- Deck Review does not mutate mastery and has no persistence, save logic, battle logic, shop logic, event logic, boss logic, timer logic, or run-state logic.
- Phase 46 improved Deck Review learning usefulness while preserving all mastery and save rules.

## Phase 47 QA Summary

Phase 47 performed a code-path QA and light balance review across the playable prototype loop:

- Reviewed fresh progress, failure, and progression flows across Home, Deck Review, Training, Dungeon, Shop, Events, Elites, Boss, Run Complete, Run Failed, Abandon Run, Reset Progress, and deck unlocks.
- Confirmed the intended permanent-progress boundary remains: word mastery, unlocked deck ids, completed deck ids, and saved statistics are LocalStorage progress; HP, shield, gold, current-run deck changes, shop upgrades, encounter state, boss state, run progression, and Word Energy are temporary.
- Confirmed Abandon Run, ending actions, restarting, and changing selected deck reset temporary run state without clearing permanent progress.
- Confirmed Deck Review remains display-only and Training remains untimed with only correct answers increasing mastery.
- Confirmed Shop offers mutate only the current-run deck/gold and do not touch LocalStorage.
- Confirmed Events remain current-run-only, do not count as monster defeats, do not advance boss progress, and cannot immediately chain into another Event.
- Fixed one UX bug: Event result feedback was not visible after resolving an Event because the next Encounter Intro replaced the Event screen. The next Encounter Intro now shows the previous Event result message.
- Reviewed `src/game/balance.ts`; no balance constants were changed in Phase 47.
- Browser visual QA was not run because the Browser skill file advertised by the environment was unavailable in this session. Verification used code-path audit and `npm run build`.

## Phase 47 Mobile Battle Polish Summary

Phase 47 Mobile Battle Polish improved Dungeon usability on mobile and small screens without changing gameplay rules:

- `ScreenShell` game mode now allows vertical scrolling on mobile and keeps fixed no-scroll behavior only at desktop battle breakpoints.
- Dungeon active battle stacks vertically on mobile: compact player/enemy status, mobile timer/control strip, quiz arena, then secondary panels.
- Desktop keeps the fullscreen battle layout with central quiz and side control panel.
- Encounter Intro is more compact on mobile with smaller portrait/type, tighter HP/attack cards, and a full-width Start Battle button.
- The presentation-only battle lane is hidden on narrow screens so it does not push quiz controls below the fold.
- Word Choice, Word Match, and Word Scramble answer rows allow stat chips to wrap below text on mobile to avoid horizontal overflow.
- Word Match keeps stats only on the English card side and keeps Thai meaning options stat-free.
- Word Match selected-pair footer is sticky inside the quiz area so Check Pair remains reachable.
- Word Scramble allows long scrambled words to wrap safely and keeps typed answer controls stacked on mobile.
- Result overlays, Pause, Abandon confirmation, Run Complete/Failed summaries, and the Shop purchase modal gained mobile-safe max heights and scroll handling.
- Combat math, timer values, mastery, deck unlocks, LocalStorage, shop effects, event effects, boss rules, statistics, Word Energy, and current-run deck behavior were preserved.

## Phase 48 QA Helper Summary

Phase 48 added a development-only Dungeon QA Helper and performed another prototype code-path QA pass.

Implementation notes:

- `src/screens/Dungeon.tsx` defines `ENABLE_QA_HELPERS = import.meta.env.DEV`.
- `src/vite-env.d.ts` adds Vite environment typings so `import.meta.env.DEV` is available to TypeScript.
- QA Helper appears only inside Dungeon in development builds.
- Production builds should not include QA Helper UI. This was checked by searching `dist` for QA Helper strings after `npm run build`.
- QA Helper is not saved to LocalStorage and does not create player-facing cheat systems.
- App-level QA callbacks mutate temporary run gold and run progress only.

Current QA Helper actions:

- Set HP Low: sets player HP to 1 and shield to 0 for Run Failed testing.
- Heal Player: restores player HP to max.
- Add +50 Gold: adds temporary current-run gold without writing permanent progress.
- Go To Shop Checkpoint: sets defeated monster progress to the current shop checkpoint and shows result actions that can route to Shop.
- Go To Shop Checkpoint now clears active mini-game selections, marks the active question resolved, stops timer progression, and lands on the normal shop checkpoint result/action flow.
- Trigger Event: forces an immediate Event encounter.
- Trigger Elite: forces an Elite Encounter Intro.
- Unlock Boss Test: sets defeated monster progress to the boss requirement and shows Boss Available result actions.
- Start Boss Test: starts the existing boss intro flow without marking the deck completed.
- Force Run Failed: uses the existing run-ended statistics handler to test Run Failed summary and ending actions.
- QA Correct: development-only active battle helper that uses the same correct-answer resolution path as real mini-game submissions.
- QA Wrong: development-only active battle helper that uses the same wrong-answer / enemy-attack path as real mini-game submissions.

QA Correct and QA Wrong are disabled unless a Dungeon battle is active, unpaused, unanswered, and not blocked by abandon confirmation. They support Word Choice, Word Match, and Word Scramble without changing combat math, timer values, Word Energy rules, mastery rules, or save behavior.

Force Run Complete is intentionally deferred. Boss completion should be tested by using Start Boss Test and defeating the boss through the existing battle flow so the real completion and unlock logic runs.

Phase 48 QA findings:

- Fresh progress, learning screens, Dungeon encounter flow, Shop offer flow, Event flow, Elite flow, Boss availability/start, Run Failed, Abandon Run safety, Reset Progress boundaries, and mobile battle layout were inspected through code paths.
- No gameplay rules, balance values, timer values, save schema, deck unlock rules, shop effects, event effects, boss rules, Word Energy rules, or current-run deck rules were changed.
- No obvious permanent-progress safety regression was found.

Current Training implementation:

- `src/screens/Training.tsx` receives the selected deck, saved `wordMastery`, `onIncreaseWordMastery`, and `onNavigate` from `src/App.tsx`.
- Training has a setup flow before each session.
- Training modes are Quick Practice, Weak Words, Unmastered Words, and Review All.
- Session length choices are 5 questions, 10 questions, 20 questions, and all available target words.
- Quick Practice uses a mixed set from the selected deck.
- Weak Words prioritizes words at mastery 0-2 and can fall back to higher mastery words when needed.
- Unmastered Words targets words below mastery 5 and shows a friendly message when all words in the deck are mastered.
- Review All can use any word from the selected deck.
- Each question randomly uses English Word to Thai Meaning, Thai Meaning to English Word, or Example Sentence Cloze.
- Each question shows the current question type clearly.
- English-to-Thai questions show an English word and 4 Thai meaning choices.
- Thai-to-English questions show a Thai meaning and 4 English word choices.
- Cloze questions blank the target word from the example sentence and ask for the correct English word.
- Player selection shows correct/wrong feedback and reveals the correct answer.
- Correct-answer feedback shows mastery before/after, Mastery increased, and Mastered at 5/5.
- A Next button advances to the next question.
- The final question opens a Training Complete summary.
- Training Complete shows selected deck, training mode, answered count, correct count, wrong count, accuracy, mastery increases, and newly mastered words.
- Training Complete actions are Train Again, Change Training Mode, Review Deck, Enter Dungeon, and Back Home.
- Training progress shows current question, total questions, correct count, incorrect count, selected deck, selected mode, and current word mastery.
- Training is untimed; this is intentional so players can practice safely before timed Dungeon battles.
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
- Permanent mastery grants small Dungeon damage bonuses when a mastered word card triggers correctly.
- Current mastery damage bonus rules are: mastery 0 = +0 damage, mastery 1-2 = +1 damage, mastery 3-4 = +2 damage, mastery 5 = +3 damage.
- Mastery bonuses are read from permanent progress and do not mutate the current-run deck.
- Mastery bonuses do not save active run state.
- Dungeon card trigger feedback shows mastery level, mastery bonus damage, and final damage.

Current LocalStorage save implementation:

- `src/utils/playerProgressStorage.ts` owns LocalStorage access.
- Save key is internal to the utility.
- Save data includes `version: 1`.
- Saved permanent progress includes word mastery, unlocked deck ids, completed deck ids, and best run statistics.
- Permanent statistics include total correct answers from ended runs, total wrong answers from ended runs, best monsters defeated, best accuracy, best damage dealt, completed runs, and failed runs.
- `completedDeckIds` stores completed deck ids for Starter Deck, Food Deck, Travel Deck, Nature Deck, Daily Life Deck, and Emotion Deck after boss defeat.
- `unlockedDeckIds` starts with Starter Deck and unlocks the next manual deck after each completed deck in the current chain.
- Existing saves are normalized from `completedDeckIds` so completed Starter unlocks Food, completed Food unlocks Travel, and completed Travel unlocks Nature without changing the save data shape.
- Missing, invalid, or incompatible saved data falls back to default progress.
- Storage read/write failures are caught so the app can continue with in-memory state.
- Home exposes a `Reset Progress` action.
- Reset clears saved LocalStorage progress and resets in-memory progress to defaults.
- LocalStorage does not save gold, HP, shield, shop upgrades, duplicated cards, removed cards, card enchantments, monster state, or current dungeon run state.
- Active run statistics are temporary while a run is active. Only completed or failed run summaries update permanent best run stats.

Current Dungeon implementation:

- `src/screens/Dungeon.tsx` uses temporary React state only.
- `src/screens/Dungeon.tsx` imports `sampleMonsters` from `src/data`.
- `src/App.tsx` owns temporary current-run deck, gold, and run progression state so Dungeon can route to Shop and back while preserving current-run changes.
- `src/App.tsx` owns temporary current-run statistics and permanent best run statistics updates.
- Run progression tracks `monstersDefeated`, `currentFloor`, and `nextShopAt`.
- Current-run statistics track questions answered, correct answers, wrong answers, timeouts, monsters defeated, elites defeated, events visited, boss defeated, total damage dealt, total shield gained, gold earned, cards upgraded, cards removed, cards duplicated, and elements added.
- Healing Shrine shield rewards count toward total shield gained.
- The current-run deck starts as a copy of the selected deck.
- Shop upgrades must not mutate source deck data in `src/data`.
- Dungeon battle questions use the current-run deck, not the original seed deck.
- Player state includes HP, functional shield, and gold display.
- Monster state includes current monster, HP, max HP, and attack.
- Dungeon encounter state supports Monster, Elite, and Event encounters.
- Monster encounters use existing battle behavior.
- Elite encounters are generated from existing sample monsters with 1.5x HP, +2 attack, elite styling, and +10 bonus current-run gold on defeat.
- Elite encounters count as monster defeats for shop checkpoints and boss progression.
- Event encounters are non-combat choices and do not count as monster defeats.
- Event rewards are temporary current-run rewards and are not saved to LocalStorage.
- Event encounters cannot generate another Event immediately after resolution.
- Current events are Treasure Chest, Healing Shrine, Strange Altar, Campfire, Lost Backpack, Ancient Library, Element Fountain, Cursed Door, Wandering Trainer, Mystic Well, and Forgotten Signpost.
- Expanded event rewards remain current-run-only and can affect temporary HP, shield, gold, Word Energy, or the current-run deck copy.
- Event card upgrades target only cards currently present in the current-run deck. Removed cards are not eligible, and duplicated cards can be targeted as separate current-run entries.
- Event rewards never modify word mastery, deck unlocks, completed decks, permanent statistics, source deck data, or LocalStorage.
- Phase 41 audited event safety and balance. Event rewards remain modest and current-run-only.
- Phase 47 QA fixed Event result visibility: after resolving an Event, the next Encounter Intro shows the last Event result so the chosen reward/cost remains visible before the next battle starts.
- HP-cost event choices are disabled when the player does not have enough HP to survive the cost.
- Random-card event choices are disabled if no current-run card target exists.
- There are currently no gold-cost event choices, so events cannot spend gold or make gold negative.
- Battle questions use a simple mini-game structure and the current-run deck.
- Each battle question randomly selects Word Choice, Word Match, or Word Scramble.
- Monster, Elite, and Boss encounters first enter `Encounter Intro` before battle questions or timers begin.
- Encounter Intro shows encounter information, HP, attack, and flavor text with a `Start Battle` button.
- Events do not use Encounter Intro and continue to show choices immediately.
- Dungeon battle questions are timed.
- Current static time limits are Word Choice 14 seconds, Word Match 20 seconds, and Word Scramble 24 seconds.
- Timer countdown runs only while a Dungeon battle question is active, unpaused, and unanswered.
- Pause is available during active Monster, Elite, or Boss combat. It stops the timer and blocks question interaction until Resume.
- Abandon Run from Pause opens the current-run abandon confirmation and does not clear permanent progress.
- Timeout is treated as a wrong answer and causes the current monster or boss to attack.
- Word Choice shows one prompt card with an English-to-Thai, Thai-to-English, or cloze-style prompt.
- Word Choice uses answer choices that match the prompt direction and clearly reveals the correct answer after selection.
- Word Match shows 3 English words and 3 Thai meanings.
- Word Match requires selecting one English word and one Thai meaning.
- Word Scramble shows 3 scrambled English word options from the current-run deck.
- Word Scramble asks the player to choose one scrambled card and build the original English word with letter tiles.
- Word Scramble letter tiles use unique tile ids, so duplicate letters can be selected, returned, and checked safely.
- Word Scramble disables Check Word until the selected answer length matches the target word length.
- Correct Word Choice answers trigger the prompt word card.
- Correct Word Match pairs trigger the selected English word card.
- Correct Word Scramble answers trigger the selected scrambled word card.
- Triggered cards deal damage equal to `baseAttack`.
- Triggered cards use the current-run card's `baseAttack`, including any Upgrade Attack purchases.
- Triggered Fire cards deal +2 bonus damage.
- Triggered Water cards grant +2 extra shield.
- Triggered Wind cards grant +1 extra temporary gold if the hit defeats the monster or boss.
- Triggered Earth cards reduce the immediate next monster or boss attack by 2.
- Earth pending reduction resets after it is used, when the battle question advances, when a new monster starts, when boss battle starts, or when the run restarts.
- Incorrect answers do not trigger card effects.
- Incorrect answers cause the current monster to attack, with shield absorbing damage before HP.
- Battle feedback shows triggered card, base damage, element bonus damage, final total damage, damage taken, shield absorbed, HP damage, card shield gained, Water shield gained, Earth reduction, Wind gold, triggered effects, and correct/wrong result.
- Current Dungeon presentation uses a game-style battle stage: encounter stage at the top, mini-game action arena in the center, player-side status band below, and battle log / card trigger feedback in the side panel.
- Monster, Elite, Boss, and Event encounters have distinct placeholder visual treatment. This is presentation only and does not alter encounter logic.
- Timer feedback uses normal, hurry, paused, and timeout labels with larger countdown display.
- When monster HP reaches 0, the screen shows `Monster Defeated` and allows spawning the next sample monster.
- Defeating a monster increases `monstersDefeated` by 1.
- Defeating a monster grants +6 temporary gold.
- Shop checkpoints occur every 5 defeated monsters.
- At a shop checkpoint, Dungeon shows `Shop Available` and a `Go To Shop` button.
- Shop routing can mutate the current-run deck only through active current-run purchases.
- Restarting a failed run resets temporary run progression, gold, monster state, HP, shield, and the current-run deck back to a fresh copy of the selected deck.
- When player HP reaches 0, the screen shows `Run Failed` and allows restarting the local run.
- Gold starts at 20 and is functional for current-run shop purchases.
- Player max HP is 32 for the first balance pass.
- Shield starts at 0 and is functional temporary run state.
- Monster attacks reduce shield before damaging player HP.
- Triggered cards with shield effects add shield while still dealing `baseAttack` damage.
- Dungeon feedback shows total monster attack, shield absorbed, HP damage taken, shield gained, triggered card, and triggered effects summary.
- Boss becomes available after 20 defeated monsters.
- Boss battle start selects one boss from the placeholder boss pool.
- Bosses currently have presentation metadata only: title, intro flavor text, defeat text, and special move name.
- Boss battles use the same mini-games and Card Trigger System as regular monsters.
- Boss defeat creates a Run Complete state with a main battle-arena victory screen.
- Run Complete summary shows selected deck name, boss defeated, boss metadata when available, deck completion / unlock reward feedback, monsters defeated, elites defeated, events visited, final gold, current-run deck size, correct answers, wrong answers, timeouts, accuracy, total damage dealt, and total shield gained.
- Boss defeat marks the selected deck as completed in permanent LocalStorage progress.
- Home and Deck Review display selected deck completion status.
- Run Failed summary uses a main battle-arena result screen with encouraging copy, failure reason, selected deck name, monsters defeated, elites defeated, events visited, current floor, final gold, correct answers, wrong answers, timeouts, accuracy, total damage dealt, and total shield gained.
- Run Complete and Run Failed both show compact Permanent Progress Kept and Temporary Run Lost sections.
- Run ending actions are centralized in the main result screen: Start Fresh Run / Restart Run, Review Deck, Training, and Back Home.
- Completed and failed runs update permanent best run stats only after the run ends.
- Real Oxford 3000 progression beyond the manual sample decks, backend, API, advanced element weakness/resistance, and permanent mastery updates from battle are not connected yet. Dungeon run state is not saved to LocalStorage.
- Phase 9 UI polish added clearer player HP, monster HP, monster attack, mini-game type, triggered card, damage dealt, damage taken, and correct/wrong feedback presentation.
- Phase 12 added functional shield combat feedback.
- Phase 13 added Word Scramble with typed answer input.
- Phase 14 added display-only element effects from current-run shop purchases.
- Phase 15 added current-run deck mutation through Remove Card and Duplicate Card purchases.
- Phase 16 added Boss Available, Gatekeeper boss battle, and Run Complete state.
- Phase 17 added the first permanent completion reward; Phase 21 generalized it so boss defeat saves the selected deck id in `completedDeckIds`.
- Phase 23 redesigned Word Choice prompts for better vocabulary recall and context practice.
- Phase 24 added Dungeon-only battle timers and timeout-as-wrong-answer behavior.
- Phase 25 added shared balance constants, tuned player HP, gold per monster, Dungeon timer limits, and Gatekeeper stats.
- Phase 26 made elements functional with simple current-run-only Dungeon effects.
- Phase 27 added current-run statistics, Run Complete / Run Failed summaries, Home Best Run summary, and permanent best run stats saved only after run end.
- Phase 28 added Monster/Elite/Event encounter types, weighted encounter generation, three initial events, elite rewards, and run summary tracking for elites/events.
- Phase 29 audited the full run flow, prevented immediate Event-to-Event chains, kept balance values unchanged, and fixed Healing Shrine shield stat tracking.
- Phase 30 improved Dungeon battle presentation only, without changing combat math, save rules, deck rules, shop rules, timer rules, or encounter rules.
- Phase 30 reorganized the Dungeon screen around a clearer encounter stage, action arena, player-side status band, battle log, and card trigger feedback panel.
- Phase 30 made Monster, Elite, Boss, and Event encounters more visually distinct using Tailwind utility classes, emoji, and placeholder visuals only.
- Phase 30 improved combat feedback for damage dealt, incoming hits, shield gained, shield absorbed, timeout state, card triggers, and event results.
- Phase 31 added Travel Deck and Nature Deck as manual sample decks with 20 cards each.
- Phase 31 expanded the permanent unlock chain to Starter Deck → Food Deck → Travel Deck → Nature Deck.
- Phase 52 added Daily Life Deck and Emotion Deck as manual sample decks with 20 cards each.
- Phase 52 expanded the permanent unlock chain to Starter Deck → Food Deck → Travel Deck → Nature Deck → Daily Life Deck → Emotion Deck.
- Phase 31 added `src/game/deckProgression.ts` for deck progression helpers without changing the LocalStorage save shape.
- Phase 31 improved Home deck progression display with locked, unlocked, completed, requirement text, and next unlock target.
- Phase 32 added Encounter Intro before Monster, Elite, and Boss combat.
- Phase 32 added Start Battle so timers and active questions begin only after the player chooses to start combat.
- Phase 32 added a Pause overlay during active combat; Phase 39.2 now uses Resume and Abandon Run actions there.
- Phase 32 preserved Events as immediate non-combat choice encounters.
- Phase 33 made permanent word mastery useful in Dungeon battles through small triggered-card damage bonuses.
- Phase 33 improved mastery visibility in Training, Deck Review, and Dungeon card trigger feedback.
- Phase 34 refactored Dungeon into a wider battle-screen layout that prioritizes no-scroll gameplay visibility on desktop.
- Phase 34 moved player status and encounter status into persistent top panels, made the quiz arena the center focus, and compacted card/combat feedback into a side panel.
- Phase 34 changed presentation only and preserved combat math, timers, progression, save rules, mastery, elements, events, elites, boss behavior, shop behavior, statistics, and LocalStorage behavior.
- Phase 34.1 fixed Dungeon usability regressions by rendering Encounter Intro and Active Battle with separate layouts.
- Phase 34.1 Encounter Intro is compact and shows only encounter inspection content plus Start Battle; it does not show Battle Log, Card Trigger, Learning Panel, Quiz Arena, or combat feedback.
- Phase 34.1 Active Battle hides Encounter Intro, compresses player/enemy panels, reduces side feedback width, and keeps the quiz arena as the dominant content.
- Phase 34.2 added true fullscreen battle mode for Dungeon by hiding the normal app navigation tabs and using a compact 64px battle header.
- Phase 34.2 added `gameMode` support to `ScreenShell` so Dungeon can remove page title/description chrome and occupy the remaining viewport.
- Phase 34.2 compressed player/monster status into top battle bars, tightened quiz component spacing, and narrowed side widgets so the current question, timer, and answers dominate active combat.
- Phase 34.3 targets active Dungeon battle fit at 1366x768 by merging player and encounter status into one compact battle bar.
- Phase 34.3 collapses Battle Log, Card Trigger, and Learning Info into compact accordions while keeping required action buttons outside accordions.
- Phase 34.3 tightens Word Choice, Word Match, and Word Scramble layouts so answer controls remain visible without page scrolling.
- Phase 34.4 removes the persistent pre-answer Card Trigger preview during active questions so the battle UI does not reveal the selected/triggered answer early.
- Phase 34.4 moves useful card stats into each selectable option: attack, shield, element, and mastery bonus where applicable.
- Phase 34.4 simplifies battle mini-game headers and uses compact result overlays after correct answers, wrong answers, and timeouts.
- Phase 34.4 keeps secondary information compact/collapsible and reserves a small future battle-stage strip without changing any gameplay rules.
- Phase 34.5 moves option stat chips to the right side of each battle answer option so option cards stay shorter.
- Phase 34.5 moves timer and short mini-game instructions into the right-side Battle Control Panel, leaving the quiz arena primarily for prompt, options, and input.
- Phase 34.5 replaces layout-pushing result feedback with a centered compact overlay that dims the quiz area and can include the Next Mini-Game action.
- Phase 34.5 tightens Word Choice, Word Match, and Word Scramble spacing and removes redundant post-answer Word Scramble summary cards.
- Phase 34.6 keeps Word Match card stats only on the English word/card side because that side represents the card that can trigger.
- Phase 34.6 removes ATK, shield, element, and mastery chips from Thai meaning options to prevent stat-based matching hints.
- Phase 34.6 adds compact Word Match microcopy and a selected-pair footer with Check Pair inside the mini-game area.
- Phase 35 improves combat result presentation without changing combat rules.
- Phase 35 result overlays now use `Defeated!` wording when the player's HP reaches 0 instead of generic wrong/timeout wording.
- Phase 35 adds stronger overlay titles for Monster Defeated, Elite Defeated, and Boss Defeated outcomes.
- Phase 35 adds CSS/Tailwind-only feedback highlights for enemy damage, player HP damage, shield absorption, and compact stage feedback text.
- Phase 36 adds CSS-only animation hooks in `src/styles.css` for hit flash, damage shake, shield pulse, attack pop, defeat glow, result pop, and floating combat text.
- Phase 36 uses those hooks locally in Dungeon for player hit, shield block, enemy damage, defeat, result overlay, timer hurry, and floating combat text feedback.
- Phase 36 keeps motion presentation-only and preserves combat math, timers, mastery, elements, save rules, shop, boss, events, and progression.
- Phase 36.1 consolidates post-question and post-encounter actions into the result overlay/action area.
- Phase 36.1 removes duplicate action blocks below the battle arena and in the side panel for normal result flow.
- Phase 36.1 uses player-facing labels such as `Next Encounter` and `Continue Dungeon` instead of `Spawn Next Monster`.
- Phase 36.1 keeps a side-panel restart fallback only for run failures that occur outside an active quiz overlay.
- Phase 37 expands placeholder normal monster variety in `src/data/monsters.ts` from 3 monsters to 10 monsters.
- Phase 37 adds Wolf, Skeleton, Mushroom, Wisp, Imp, Stone Bug, and Dark Crow while preserving the existing Monster / Elite / Boss / Event systems.
- Phase 37 keeps Elite generation compatible with the expanded monster pool and does not change elite HP, attack, reward, or progression rules.
- Phase 37 adds flavor text for the new monsters through Dungeon's existing encounter intro helper without changing the monster type.
- Phase 38 redesigns the Shop from a full deck-editing screen into a roguelike-style limited offer screen.
- Phase 38 shows 4 randomized shop item offers per shop visit from the existing `sampleShopItems` pool.
- Phase 38 moves target card selection into a modal with up to 4 eligible current-run cards.
- Phase 38 keeps all existing shop effects and costs, including Upgrade Attack, Add Shield, Add Element, Remove Card, and Duplicate Card.
- Phase 38 adds a Reroll Offers action for 5 temporary current-run gold without mutating the deck or saving run state.
- Phase 38 preserves current-run-only shop mutation rules, permanent-progress-only LocalStorage rules, and all combat/save/boss/deck progression behavior.
- Phase 39 adds a current-run-only Word Energy / Card Fatigue system.
- Phase 39 tracks word usage by normalized word text, not card id, so duplicated copies share fatigue.
- Phase 39 increases fatigue only when a Dungeon word card triggers correctly.
- Phase 39 makes Word Choice, Word Match, and Word Scramble prefer fresher words through weighted selection while falling back to resting words if needed.
- Phase 39 shows compact Word Energy chips on battle option card stats; Word Match still shows stats only on the English side.
- Phase 39 adds short word-energy feedback after correct triggers without changing damage math.
- Phase 39 resets fatigue on run reset, run failure, run completion, selected deck change, and Reset Progress; fatigue is not saved to LocalStorage.
- Phase 39.1 softens Word Energy thresholds and weights so Low Energy appears later.
- Phase 39.1 changes the player-facing exhausted label from Resting to Low.
- Phase 39.1 adds a compact Dungeon Word Energy summary for Fresh, Used, Tired, and Low counts.
- Phase 39.1 adds current-run-only energy recovery when leaving Shop for Dungeon by reducing each tracked usage count by 1.
- Phase 39.1 keeps fatigue as appearance-chance-only and preserves all combat math, save rules, shop item effects, timers, mastery, elements, boss rules, event rewards, and deck unlocks.
- Phase 39.2 replaces ambiguous `End Run` / `Leave Run` wording with `Abandon Run`.
- Phase 39.2 adds an Abandon Run confirmation modal with Continue Run, Abandon & Go Home, and Abandon & Restart.
- Phase 39.2 makes Abandon Run reset only temporary run state and never clear word mastery, unlocked decks, completed decks, or permanent statistics.
- Phase 39.2 adds a distinct Home Reset Progress confirmation modal for clearing permanent progress.
- Phase 39.2 ensures Run Complete and Run Failed navigation actions clear temporary run state before leaving Dungeon.
- Phase 40 expands event variety with eight additional non-combat events.
- Phase 40 adds current-run-only event rewards for temporary gold, HP recovery, shield gain, Word Energy recovery, random current-run attack upgrades, random current-run shield upgrades, and random element additions.
- Phase 40 keeps events from counting toward monster defeats, shop checkpoints, or boss progression.
- Phase 40 keeps event rewards out of permanent progress and LocalStorage.
- Phase 41 adds event choice guards for HP-cost and random-card-target edge cases.
- Phase 41 confirms expanded events remain current-run-only, do not mutate permanent progress, and do not advance boss/shop progression.
- Phase 42 expands placeholder boss variety with Gatekeeper, Word Warden, Grammar Golem, Shadow Reader, and Memory Dragon.
- Phase 42 improves boss intro, active boss labeling, and Run Complete boss-name presentation using Tailwind/CSS and emoji placeholders only.
- Phase 42 preserves boss requirement, combat math, Card Trigger rules, deck completion rewards, deck unlocks, save rules, shop behavior, event behavior, timers, and mastery rules.
- Phase 43 moves Run Complete / Run Failed summaries into the main battle arena and removes duplicate ending action buttons from the side panel.
- Phase 43 clarifies permanent progress kept vs temporary run state lost without changing save rules.
- Phase 43 adds Training as an ending action alongside Review Deck and Back Home.
- Phase 44 improves Home and deck progression presentation without changing deck unlock rules or save rules.
- Phase 44 uses existing saved word mastery to show selected-deck and per-deck mastery summaries.
- Phase 44 keeps Reset Progress separate from normal play actions and preserves the existing confirmation behavior.
- Phase 45 expands Training mode selection and session length choice without adding Training timers or changing mastery rules.
- Phase 45 preserves Training isolation from dungeon HP, shield, gold, run deck, shop upgrades, event state, boss state, Word Energy, and run statistics.

Current Shop implementation:

- `src/screens/Shop.tsx` imports `sampleShopItems` from `src/data`.
- `src/data/shopItems.ts` defines current-run placeholder items.
- The Shop screen is labeled `Current Run Shop`.
- The screen explains that shop upgrades are temporary and affect only the current run.
- The main shop screen shows 4 randomized item offers per visit instead of all shop controls at once.
- Each shop offer card shows an icon placeholder, name, description, cost, type, and eligible target count.
- Selecting an offer opens a modal with up to 4 eligible current-run card targets.
- Purchase confirmation happens in the modal before spending gold or mutating the current-run deck.
- Reroll Offers costs 5 temporary current-run gold and refreshes the 4 visible offers.
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
- Element effects now apply simple current-run-only gameplay effects in Dungeon battles.
- The Shop shows success feedback after a purchase and not-enough-gold feedback when gold is insufficient.
- Remove Card and Duplicate Card are active purchases.
- Remove Card uses the existing shop item cost and removes the selected card from the current-run deck.
- Remove Card is disabled when the current-run deck has 5 or fewer cards.
- Remove Card targets are filtered so invalid removal targets are not offered in the modal.
- Duplicate Card uses the existing shop item cost and adds a unique-id copy of the selected card to the current-run deck.
- Duplicated cards preserve current-run upgrades, including upgraded attack, shield effects, and element effects.
- Phase 7 was presentation-only; Phase 11 added Upgrade Attack and Phase 12 added Add Shield.
- Phase 9 UI polish made item type, cost, preview-only state, and current-run-only messaging clearer.
- Phase 10 added `Back To Dungeon` routing.
- Advanced element interactions and balancing are deferred.

Current Word Energy / Card Fatigue implementation:

- `src/game/cardFatigue.ts` owns pure fatigue helpers.
- Fatigue is tracked by normalized word text in app-level current-run state.
- Usage increases only after a correct Dungeon card trigger.
- Usage does not increase on wrong answers, timeouts, events, shop purchases, Training answers, or Deck Review.
- Usage 0 is Fresh, usage 1-2 is Used, usage 3-4 is Tired, and usage 5+ is Low Energy.
- Fresh words have weight 5, Used words have weight 3, Tired words have weight 2, and Low Energy words are avoided when enough other words are available.
- Low Energy words are allowed as fallback so mini-game generation remains playable.
- Fatigue affects Word Choice, Word Match, and Word Scramble appearance chance only.
- Fatigue does not reduce attack, shield, element effects, mastery bonuses, or any other combat math.
- Leaving Shop for Dungeon recovers Word Energy by reducing each tracked usage count by 1 to a minimum of 0.
- Dungeon shows a compact Word Energy summary for Fresh, Used, Tired, and Low counts.
- Fatigue resets with temporary run state and is not saved to LocalStorage.

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
- Word Scramble now uses tile-based letter input for Version 1.
- Word Scramble uses the current-run deck and the Card Trigger System.
- Element shop items are active.
- A card may have one element effect for now.
- Element effects started as display-only in Phase 14 and became simple gameplay effects in Phase 26.
- Element effects are temporary current-run card effects and are not persisted.
- Remove Card is an active current-run shop purchase.
- Duplicate Card is an active current-run shop purchase.
- Minimum current-run deck size is 5 cards.
- Duplicates preserve current-run upgrades.
- Remove and Duplicate are temporary run deck mutations.
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

Current prototype note: word mastery, deck unlocks, completed decks, and best run summary statistics are persisted in LocalStorage.

Reset Progress is the only player action that clears permanent progress. Abandon Run, Restart Run, Back Home, selected deck changes, and run completion/failure navigation must not clear LocalStorage permanent progress.

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
- Encounter state
- Active event state
- Elite state
- Temporary event rewards
- Active run statistics before completion/failure
- Word Energy / fatigue

If the player dies, permanent progress survives death and run progress is completely lost.

Temporary run upgrades should not be saved as permanent progress after death.

Abandon Run also loses only the current temporary run. It resets HP, shield, gold, current-run deck changes, encounter state, boss state, run progression, and Word Energy while preserving word mastery, unlocked decks, completed decks, and permanent statistics.

Only summary statistics from completed or failed runs are saved as permanent best run stats.

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
- Current run deck starts as a copy of the selected deck.
- Gold starts at 20.
- The player fights monsters one by one.
- Run progression tracks monsters defeated, current floor, and next shop checkpoint.
- The current foundation randomly selects Word Choice, Word Match, or Word Scramble for each battle question.
- Correct answers trigger the selected word card.
- Word Scramble correct tile-built answers trigger the selected scrambled word card.
- Triggered word cards deal damage equal to `baseAttack` in the current foundation.
- Triggered word cards with shield effects add shield while still dealing `baseAttack` damage.
- Incorrect answers do not trigger card effects.
- Wrong answers let the monster attack, and shield absorbs damage before HP.
- Shield starts at 0 and is temporary run state.
- Gold is functional for Upgrade Attack and Add Shield purchases.
- Defeating a monster gives +6 gold.
- Shop checkpoints appear every 5 defeated monsters.
- Dungeon can route to Shop at a checkpoint.
- Shop can route back to Dungeon.
- Upgrade Attack can increase a current-run card's `baseAttack` by +2.
- Add Shield can add or increase Shield +3 on a current-run card.
- Element shop purchases can add or replace one simple gameplay element effect on a current-run card.
- Fire adds +2 damage, Water adds +2 shield, Wind adds +1 gold on defeat, and Earth reduces the next attack by 2.
- Remove Card can remove a current-run deck card as long as the deck stays above 5 cards.
- Remove Card also requires at least 4 distinct visible words to remain so battle questions have enough unique options.
- Duplicate Card can add a unique-id copy of a current-run card, preserving upgrades.
- Boss becomes available after 20 defeated monsters.
- Boss uses the same Card Trigger System as regular monsters.
- Boss defeat creates a Run Complete state.
- Boss defeat marks the selected deck as completed permanent progress.
- Completing Starter Deck unlocks Food Deck.
- Completing Food Deck unlocks Travel Deck.
- Completing Travel Deck unlocks Nature Deck.
- Completing Nature Deck unlocks Daily Life Deck.
- Completing Daily Life Deck unlocks Emotion Deck.
- Completing Emotion Deck shows more-decks-coming-soon reward feedback.
- Completed deck ids persist in LocalStorage and are cleared only by Reset Progress.
- Real Oxford 3000 progression beyond the manual sample decks and run rewards beyond deck completion are deferred.
- Phase 18 added QA cleanup for stale shop selections, purchase guards, duplicate id safety, clearer shop warnings, Boss Available copy, and Run Complete actions.

## Deck System

Current deck model:

- Each vocabulary deck contains around 20 words.
- Each word is represented as a `WordCard`.
- The first sample deck is `Starter Deck`.
- `Starter Deck` contains 20 realistic sample word cards.
- The second sample deck is `Food Deck`.
- `Food Deck` contains 20 manual food-related word cards.
- The third sample deck is `Travel Deck`.
- `Travel Deck` contains 20 manual travel-related word cards.
- The fourth sample deck is `Nature Deck`.
- `Nature Deck` contains 20 manual nature-related word cards.
- The fifth sample deck is `Daily Life Deck`.
- `Daily Life Deck` contains 20 manual daily action and object word cards.
- The sixth sample deck is `Emotion Deck`.
- `Emotion Deck` contains 20 manual feeling, mood, and expression word cards.
- Starter Deck is unlocked by default.
- Food Deck starts locked and unlocks after Starter Deck completion.
- Travel Deck starts locked and unlocks after Food Deck completion.
- Nature Deck starts locked and unlocks after Travel Deck completion.
- Daily Life Deck starts locked and unlocks after Nature Deck completion.
- Emotion Deck starts locked and unlocks after Daily Life Deck completion.
- App-level selected deck state controls Deck Review, Training, Dungeon current-run deck creation, and Run Complete deck completion.
- Changing decks starts a fresh temporary run without clearing word mastery or completed deck ids.
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
  - Shows one prompt card with English-to-Thai, Thai-to-English, or Example Sentence Cloze prompt.
  - Shows 4 choices matching the prompt direction.
  - Has a 14-second Dungeon battle time limit.
  - Correct answer triggers the prompt word card.
- Word Match
  - Shows 3 English words and 3 Thai meanings.
  - Player selects one English word and one Thai meaning.
  - Has a 20-second Dungeon battle time limit.
  - Correct pair triggers the selected English word card.
- Word Scramble
  - Show multiple scrambled word choices.
  - Player chooses which word to solve.
  - Player types the original English word.
  - Has a 24-second Dungeon battle time limit after Phase 49 tuning.
  - Solving correctly triggers the selected current-run card.
  - Current-run attack and shield upgrades apply through the Card Trigger System.

Training mini-games:

- Word Choice Training
  - Implemented with local state only.
  - Uses the selected deck data.
  - Randomly selects English-to-Thai, Thai-to-English, or Example Sentence Cloze prompts.
  - Uses 4 choices matching the prompt direction.
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
- Element shop actions are active and apply simple first-pass Dungeon effects.
- Remove and duplicate shop actions are active and mutate only the current-run deck.
- No shop upgrade is saved to LocalStorage.

## Required Project Documents

These documents are required project maintenance files:

- `PROJECT_STATUS.md`: current progress, completed work, active task, and next task.
- `HANDOFF.md`: project handoff context for another developer or AI agent.
- `DECISIONS.md`: accepted decision log.
- `GAME_DESIGN.md`: central accepted gameplay design reference.
- `QA_CHECKLIST.md`: manual prototype QA checklist before sharing or deploying.

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

## Phase 49 Balance Tuning Summary

Phase 49 performed the first focused numeric balance tuning pass after the development-only Dungeon QA Helper was added.

Values changed:

- `GOLD_PER_MONSTER`: `6` -> `7`
- `SHOP_ADD_SHIELD_COST`: `40` -> `35`
- `WORD_SCRAMBLE_TIME_LIMIT`: `22` -> `24`
- `SHOP_REROLL_COST`: added to `src/game/balance.ts` at `5`; the reroll price itself did not change.

Balance rationale:

- First-shop economy was slightly too tight at exactly `20 + 5 * 6 = 50` gold before optional event/elite rewards. Increasing monster gold to `7` gives a normal first-shop total of `55`, enough for one meaningful purchase with a small reroll buffer.
- Add Shield was too expensive compared with Upgrade Attack for a defensive effect that still requires correctly triggering the card. Matching the cost at `35` makes it a real first-shop defensive option.
- Word Scramble needed a little more time for typing, especially on mobile. The timer increased by only two seconds and Training remains untimed.

Values reviewed and left unchanged:

- Player max HP: `32`
- Starting gold: `20`
- Shop interval: every `5` defeated monsters
- Boss requirement: `20` defeated monsters
- Word Choice timer: `14`
- Word Match timer: `20`
- Upgrade Attack amount/cost: `+2` / `35`
- Add Shield amount: `+3`
- Add Element cost: `45`
- Remove Card cost: `30`
- Duplicate Card cost: `50`
- Monster HP/attack values
- Elite HP multiplier, attack bonus, bonus gold, and encounter weight
- Boss HP/attack values
- Event reward and HP-cost values
- Word Energy thresholds and weights
- Mastery bonus values and element effect values

QA notes:

- Phase 49 used code-path review and the Phase 48 QA helper affordances as the testing reference.
- Production `dist` output was checked for QA Helper strings after build; no QA helper UI text was found.
- No combat rules, save schema, deck unlock rules, event behavior, shop behavior, mastery rules, boss requirement, or LocalStorage rules changed.
- `npm run build` passed after the tuning changes.

Phase 49 is complete.

## Phase 50 Stabilization + Deploy Prep Summary

Phase 50 stabilized the current playable prototype for demo/deploy readiness without adding gameplay systems.

Completed:

- Rewrote `README.md` with install, development, build, preview, gameplay loop, save behavior, QA Helper, deployment, prototype limitations, and document references.
- Added `QA_CHECKLIST.md` for manual prototype checks across fresh start, learning screens, Dungeon battle, Shop, Events, Boss, run end states, exit/reset safety, responsive smoke testing, production build, and QA Helper safety.
- Updated `RunResult` copy so it points players toward the real Dungeon run summaries and frames the page as a future standalone history view.
- Documented Vercel as the preferred static deployment target.
- Added deployment scope notes to `GAME_DESIGN.md`.
- Added the Vercel static deployment decision to `DECISIONS.md`.

Deploy prep notes:

- Recommended host: Vercel.
- Framework preset: Vite.
- Build command: `npm run build`.
- Output directory: `dist`.
- The app has not been deployed yet.
- GitHub Pages is not the default target because it may require Vite base-path changes.
- `npm audit` reports a high-severity `esbuild` advisory through the Vite toolchain. npm's suggested `audit fix --force` path would make breaking dependency changes, so it is documented and deferred rather than applied in Phase 50.

Verification notes:

- Package scripts remain `dev`, `build`, and `preview`.
- LocalStorage fallback code still returns default progress for missing, invalid, or incompatible saved data.
- QA Helper remains gated by `import.meta.env.DEV`.
- Production `dist` output was checked for QA Helper strings after build.
- Production preview served HTML, JS, and CSS with HTTP 200 from localhost.
- No gameplay systems, decks, combat math, timers, mastery rules, deck unlock rules, save schema, shop effects, event effects, boss effects, backend, auth, database, API, React Router, final art assets, sound, or external UI libraries were added.
- `npm install`, `npm run build`, and production preview smoke checks passed.

Phase 50 is complete.

## Phase 51 Visual Identity + Game Feel Polish Summary

Phase 51 improved the prototype's shared visual identity and game feel using only CSS, Tailwind utility classes, emoji, and existing placeholder visuals.

Presentation changes:

- Strengthened the global cozy fantasy dungeon mood with a warmer layered CSS background and subtle screen lighting.
- Polished shared UI primitives in `src/components/ui.tsx`: card panels, badges, progress bars, stat cards, and buttons now have stronger game-like borders, shadows, hover states, pressed states, and contrast.
- Polished `ScreenShell` with adventure-style eyebrow treatment and divider lines.
- Polished `AppHeader` so normal navigation feels more like a camp menu, while Dungeon keeps its compact battle-mode header.
- Polished Home into a clearer Campfire Hub with stronger selected-deck hero treatment, `Open Spellbook`, `Train At Camp`, `Start Adventure`, `Adventurer Records`, and journey-map language.
- Polished Deck Review toward a spellbook/card collection feel with `Spellbook`, `Spellbook Tabs`, and `Open Card` language.
- Polished Training toward a camp preparation room with `Camp Training`, training station language, and practice-room copy.
- Polished Shop toward a roguelike merchant screen with `Refresh Wares`, `Inspect Ware`, `Enchant a card`, and `Confirm Trade`.
- Polished Run Result into an `Adventure Ledger` placeholder while keeping real run summaries inside Dungeon.
- Dungeon received only small copy polish; battle layout, answer visibility rules, result actions, and mobile safety rules were preserved.

Preserved:

- No gameplay systems were added.
- Combat math, timer values, mastery rules, deck unlock rules, save schema, shop effects, event effects, boss effects, Word Energy, and LocalStorage behavior were unchanged.
- No final art assets, sound, animation libraries, external UI libraries, backend, auth, database, API, React Router, or Oxford 3000 import were added.
- QA Helper remains development-only and gated by `import.meta.env.DEV`.

Verification notes:

- `npm run build` passed.
- Production preview served HTML, JS, and CSS with HTTP 200.
- Production `dist` output was checked for QA Helper strings; none were found.
- Browser visual automation was unavailable in this session, so visual verification used code review plus production preview HTTP and asset checks.

Phase 51 is complete.

## Phase 51.1 Word Scramble Tile Input + Selected Card Layout Hotfix Summary

Phase 51.1 fixed Word Scramble usability without changing combat rules or other systems.

Completed:

- Updated Word Scramble selected-card option layout so scrambled letters remain readable.
- Moved compact card stat chips to a wrapping row below scrambled text so they no longer cover or truncate the word.
- Replaced the prominent typed input with tile-based letter input.
- Added available letter tiles in scrambled order and an answer area built by tapping tiles.
- Added answer-tile return behavior and Clear Answer.
- Used unique tile ids for duplicate letters.
- Disabled Check Word until a scrambled card is selected and the built answer length matches the target word.

Preserved:

- Correct Word Scramble answers still trigger the selected current-run card.
- Wrong answers and timeouts still do not trigger cards and still cause enemy attacks.
- Damage, shield, element effects, mastery bonuses, Word Energy, timers, events, shop, boss, progression, Training, and save rules were unchanged.

Verification:

- `npm run build` passed after the hotfix.

Phase 51.1 is complete.

## Phase 52 Content Expansion / More Manual Decks Summary

Phase 52 expanded playable vocabulary content without adding gameplay systems or changing combat/save rules.

Completed:

- Added `Daily Life Deck` in `src/data/dailyLifeDeck.ts` with 20 manual everyday vocabulary cards.
- Added `Emotion Deck` in `src/data/emotionDeck.ts` with 20 manual feelings and expression vocabulary cards.
- Exported both decks through `availableDecks` after Nature Deck.
- Extended the manual unlock chain to Starter Deck → Food Deck → Travel Deck → Nature Deck → Daily Life Deck → Emotion Deck.
- Updated unlock normalization through existing `deckProgression.ts` rules without changing the LocalStorage save version.
- Updated Home journey path copy and project documentation for the six-deck chain.
- Updated `QA_CHECKLIST.md` with new deck progression and screen integration checks.

Preserved:

- No Oxford 3000 import was added.
- No backend, database, auth, API, React Router, achievements, sound, final art, animation libraries, or external UI libraries were added.
- Combat math, timers, mastery rules, shop/event/boss effects, Word Energy rules, save schema, and UI architecture were unchanged.

Verification:

- `npm run build` passed after Phase 52.

Phase 52 is complete.

## Phase 52.1 QA Helper Hotfix + Battle Skip Tools Summary

Phase 52.1 fixed QA Helper state safety and added development-only battle skip tools.

Completed:

- Fixed `Go To Shop Checkpoint` so it no longer leaves an active mini-game, timer, or selected answer state half-resolved.
- `Go To Shop Checkpoint` now moves the run to a shop checkpoint result state that can use the normal Go To Shop / Continue Dungeon flow.
- Added `QA Correct` and `QA Wrong` to the existing development-only QA Helper panel.
- QA Correct reuses the real correct-answer resolution path, including Card Trigger System effects, mastery damage, element effects, shield effects, Word Energy usage, encounter defeat, and boss completion.
- QA Wrong reuses the real wrong-answer path, including enemy attack, shield absorption, HP damage, and Run Failed when HP reaches 0.
- QA Correct and QA Wrong are disabled outside active unanswered combat.
- Updated `QA_CHECKLIST.md` with QA Helper skip checks and production safety checks.

Preserved:

- No player-facing cheat system was added.
- QA tools remain gated by `import.meta.env.DEV`.
- No permanent progress is directly written by QA Correct, QA Wrong, or Go To Shop QA.
- Combat math, timer values, mastery rules, Training behavior, deck unlocks, save schema, shop effects, event effects, boss requirement, boss completion reward, Word Energy rules, and Phase 52 decks were unchanged.

Verification:

- `npm run build` passed after Phase 52.1.
- Production `dist` output was checked for QA Helper strings after build.

Phase 52.1 is complete.

## Phase 53 Content QA + Vocabulary Quality Pass Summary

Phase 53 reviewed and improved manual vocabulary content quality across all six current decks without adding gameplay systems.

Completed:

- Reviewed Starter Deck, Food Deck, Travel Deck, Nature Deck, Daily Life Deck, and Emotion Deck.
- Normalized all manual deck `partOfSpeech` values to Title Case labels: `Noun`, `Verb`, and `Adjective`.
- Confirmed each manual deck has exactly 20 cards.
- Confirmed card ids are unique across all current manual cards.
- Confirmed English words are unique across all current manual decks.
- Cleaned up slash-heavy Thai meanings:
  - Nature `wild`: `ป่า / ตามธรรมชาติ` -> `ป่า`
  - Nature `fresh`: `สดชื่น / สดใหม่` -> `สดชื่น`
  - Daily Life `study`: `เรียน / อ่านหนังสือ` -> `เรียน`
  - Daily Life `carry`: `ถือ / แบก` -> `ถือ`
  - Daily Life `call`: `โทรหา / เรียก` -> `โทรหา`
  - Daily Life `watch`: `ดู / เฝ้าดู` -> `ดู`
- Improved Travel `direction` example sentence from `Ask for direction if you are lost.` to `The arrow shows the direction.`
- Improved card effect distribution with thematic additions:
  - Food `rice`: added Earth element
  - Food `milk`: added Water element
  - Food `egg`: added Shield +1
  - Food `dinner`: added Shield +2
  - Travel `bridge`: added Shield +2

Verification:

- Automated content audit confirmed 20 cards per deck, no duplicate card ids, no duplicate English words, no baseAttack outliers, and no slash-heavy Thai meanings.
- `npm run build` passed after Phase 53.

Preserved:

- No new decks or Oxford 3000 import were added.
- No gameplay systems, combat math, timer values, mastery rules, Training rules, deck unlock rules, save schema, shop/event/boss effects, Word Energy rules, LocalStorage policy, UI redesign, backend, auth, API, final art, sound, or external libraries were added.
- Phase 52 deck progression remains Starter Deck → Food Deck → Travel Deck → Nature Deck → Daily Life Deck → Emotion Deck.
- Phase 52.1 QA Helper behavior remains dev-only.

Phase 53 is complete.

## Phase 54 Deploy Dry Run + Production Smoke Test Summary

Phase 54 verified that the current prototype is ready for a simple static demo deployment dry run.

Completed:

- Ran `npm run build`; production build passed with no TypeScript or Vite build errors.
- Ran `npm run preview -- --host 127.0.0.1`; production preview served at `http://127.0.0.1:4173/`.
- Confirmed production preview returned HTTP 200 for:
  - `/`
  - generated JavaScript asset
  - generated CSS asset
- Confirmed the generated production HTML references the built JS and CSS assets correctly.
- Searched `dist` for development-only QA Helper UI strings and found no matches for:
  - `QA Helper`
  - `Development only`
  - `QA Correct`
  - `QA Wrong`
  - `Force Run Failed`
  - `Force Run Complete`
- Reviewed `README.md` deployment guidance.
- Added a README note summarizing the latest local deploy dry run.
- Updated `QA_CHECKLIST.md` with production preview smoke-test items and Vercel settings.

Static deployment readiness:

- Vercel remains the preferred target.
- Use Vite preset.
- Build command: `npm run build`.
- Output directory: `dist`.
- No backend, database, auth, API, or server runtime is required.
- LocalStorage remains the only Version 1 save mechanism.

Verification limitations:

- The in-app browser connector was unavailable in this session.
- Local Playwright is not installed in the project.
- Browser-click production smoke testing was therefore not completed in this pass.
- Verification used production build, production preview HTTP checks, production bundle string checks, and documentation review.
- A manual or automated browser click-through should still verify Home, Deck Review, Training, Dungeon, Reset Progress, and narrow/mobile battle screens before a public demo.

Preserved:

- No gameplay systems, new decks, Oxford 3000 import, backend, database, auth, API, React Router, final art, sound, external UI libraries, combat math changes, timer value changes, mastery rule changes, save schema changes, shop/event/boss effect changes, deck unlock changes, or Word Energy rule changes were added.

Phase 54 is complete.

## Phase 56 Post-Deploy Mobile Polish + Live Smoke Test Summary

Phase 56 verified the first live Vercel deployment and applied targeted mobile usability polish.

Production deployment:

- Live URL: `https://word-quest-hazel.vercel.app/`
- Deployment target: Vercel
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: none
- Save behavior: browser-local LocalStorage only

Live HTTP/static smoke check:

- Production URL returned HTTP 200 from Vercel.
- Production HTML served the app shell.
- Generated JavaScript asset returned HTTP 200.
- Generated CSS asset returned HTTP 200.

Targeted mobile polish applied:

- Dungeon result overlay uses tighter mobile sizing, `dvh` max-height, narrower mobile width, and more compact title spacing so action buttons stay reachable.
- Word Match uses smaller mobile card heights and tighter spacing.
- Word Match selected-pair footer uses compact mobile text and a full-width `Check Pair` button on mobile.
- Word Scramble option cards use tighter mobile padding and smaller scrambled text on narrow screens.
- Word Scramble answer and letter tile areas use smaller mobile tiles, tighter gaps, and more compact padding while preserving duplicate-letter tile behavior.
- Pause and Abandon Run modals use smaller mobile padding and `dvh` max-height with internal scrolling.
- Shop target modal uses smaller mobile padding, tighter target-card spacing, and a compact sticky action footer.

Preserved:

- No gameplay systems, new decks, Oxford 3000 import, backend, database, auth, API, React Router, achievements, sound, final art assets, animation libraries, external UI libraries, combat math changes, timer value changes, mastery rule changes, save schema changes, shop/event/boss effect changes, deck unlock changes, or Word Energy rule changes were added.
- QA Helper remains development-only.
- Vercel static deployment setup remains unchanged.

Verification:

- `npm run build` passed after Phase 56.
- Live deployment HTTP/static checks passed.
- Browser automation was not available in this environment, so full live browser click-through should still be completed manually on a phone or with browser automation when available.

Phase 56 is complete.

## Phase 56.1 Deploy Sync + Manual Click-Through Smoke Test Prep Summary

Phase 56.1 syncs the Phase 56 mobile polish to GitHub/Vercel and prepares live manual smoke testing.

Completed:

- Reviewed git status before syncing.
- Confirmed changed files are limited to Phase 56 mobile polish and documentation:
  - `src/screens/Dungeon.tsx`
  - `src/screens/Shop.tsx`
  - `README.md`
  - `PROJECT_STATUS.md`
  - `HANDOFF.md`
  - `GAME_DESIGN.md`
  - `QA_CHECKLIST.md`
- Confirmed no generated `dist`, `node_modules`, local env files, logs, or screenshots are part of the working tree.
- Added a dedicated `Production Manual Click-Through` checklist to `QA_CHECKLIST.md`.
- Verified `npm run build` passes before commit.
- Verified `git diff --check` passes.
- Verified production `dist` output does not include QA Helper UI strings.
- Verified local production preview served HTML, JavaScript, and CSS with HTTP 200.

Deployment sync:

- Commit message: `Phase 56.1 deploy sync and manual smoke prep`
- Push target: `origin main`
- Vercel is expected to redeploy automatically from GitHub after the push.
- Existing Vercel settings remain unchanged:
  - Framework preset: Vite
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variables: none

Manual verification still recommended:

- Browser automation was not available in this environment.
- No Playwright or browser automation dependency was added.
- After Vercel finishes redeploying, manually open `https://word-quest-hazel.vercel.app/` on desktop and phone and use the `Production Manual Click-Through` checklist in `QA_CHECKLIST.md`.

Preserved:

- No gameplay systems, new decks, Oxford 3000 import, backend, database, auth, API, React Router, achievements, sound, final art assets, animation libraries, external UI libraries, combat math changes, timer value changes, mastery rule changes, save schema changes, shop/event/boss effect changes, deck unlock changes, or Word Energy rule changes were added.

Phase 56.1 is complete.

## Mobile Dungeon Vertical Usability Adjustment Summary

This follow-up addressed phone feedback after Phase 56.1.

Completed:

- Reduced mobile `gameMode` shell padding so Dungeon has less side margin on portrait phone screens.
- Reduced mobile padding inside the active Dungeon battle frame and quiz arena.
- Added a mobile-only scroll anchor near the active timer/quiz area.
- Added an effect that scrolls to the play-area anchor when a new active Dungeon question starts.
- Updated documentation and QA checklist items for reduced mobile padding and question-start auto-scroll.

Rules preserved:

- No combat logic, timer values, progression, save rules, mastery rules, element rules, event rules, boss rules, shop rules, statistics behavior, QA Helper production gating, or LocalStorage behavior changed.
- The scroll behavior is presentation-only and runs only for mobile/narrow active Dungeon questions.

Manual QA recommendation:

- On a phone, start Dungeon, answer or timeout into the next mini-game, and confirm the viewport returns near the timer/quiz area instead of forcing the player to manually scroll back up.
- Confirm the wider mobile battle area does not introduce horizontal overflow.

## Phase 57 How to Play + Playtest Feedback Prep Summary

Phase 57 prepared the live prototype for external playtesting without changing gameplay.

Completed:

- Added a collapsible Home `How to Play` guide.
- Home How to Play explains:
  - Review Deck
  - Training
  - Dungeon
  - Shop
  - Boss completion
  - Permanent progress
  - Temporary run progress
  - LocalStorage-only prototype save limits
- Added Training helper copy explaining that Training is untimed, correct answers increase mastery, wrong answers do not reduce mastery, and mastery can add small Dungeon damage bonuses.
- Expanded Dungeon's compact `Learning Info` accordion with Start Battle, card trigger, wrong/timeout attacks, shield, Pause, Abandon Run, and Word Energy guidance.
- Added Shop helper copy explaining limited offers, rerolls, target-card selection, and current-run-only upgrades.
- Added README share-ready playtest copy for `https://word-quest-hazel.vercel.app/`.
- Added suggested external playtester questions to README and `QA_CHECKLIST.md`.

Preserved:

- No gameplay systems, decks, Oxford 3000 import, backend, database, auth, API, React Router, achievements, sound, final art assets, animation libraries, browser automation tooling, external UI libraries, combat math changes, timer value changes, mastery rule changes, save schema changes, shop/event/boss effect changes, deck unlock changes, or Word Energy rule changes were added.
- Guidance is compact/collapsible where needed so mobile battle remains quiz-first.
- Feedback collection is documentation-only; no feedback form or backend was added.

Verification:

- `npm run build` passed after Phase 57.
- QA Helper production-safety string checks remained clean in the production build.

## Phase 58 Game Feel / Motion Pass Summary

Phase 58 added subtle CSS-only motion and micro-feedback without changing gameplay.

Completed:

- Added shared CSS animation helpers for reward pulse, selected glow, and mastery pulse.
- Confirmed all motion helpers have `prefers-reduced-motion: reduce` fallbacks.
- Improved Dungeon feedback motion for correct/wrong answer states, result overlay lines, Card Trigger details, and Word Scramble letter tile press states.
- Improved Shop presentation feedback for wares, selected target cards, purchase success, and not-enough-gold/error states.
- Improved Training feedback motion for correct/wrong answers and mastery increases.
- Improved Home and Deck Review selected-card/deck feedback.

Preserved:

- No combat math, timer values, mastery rules, save schema, shop/event/boss effects, deck unlock rules, Word Energy rules, gameplay systems, decks, Oxford import, backend, database, auth, API, router, final art assets, sound, animation libraries, browser automation, or external UI libraries were added or changed.
- Motion is presentation-only and must not reveal answers, trigger cards, or result data before the player answers.

Verification:

- `npm run build` passed after Phase 58.

## Next Recommended Task

Recommended next task:

Continue with the next explicitly requested phase or feature. Do not add backend, run rewards beyond deck completion, Training timers, persistent run state, advanced element interactions, Oxford 3000 import, or final art assets unless explicitly requested.
