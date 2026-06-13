# HANDOFF.md

## Project Overview

Vocabulary Dungeon Deckbuilder is a web-first English vocabulary learning roguelike deckbuilder. The project is meant to be a simple, fun vocabulary practice app, not a commercial game.

The core loop combines vocabulary cards, deck review, practice mini-games, dungeon battles, temporary run upgrades, and permanent vocabulary mastery progress.

## Current Project Status

Current version: Prototype v0.1

Current phase: Phase 39 complete.

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
- Added static time limits, currently tuned to Word Choice 14 seconds, Word Match 20 seconds, and Word Scramble 22 seconds.
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

- Home: polished entry screen with flow badges, primary actions, reset progress, prototype summary, selected deck completion status, compact Best Run summary, and deck selection with locked/unlocked/completed states for Starter Deck, Food Deck, Travel Deck, and Nature Deck.
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

The build passed successfully after dependencies were installed, after Phase 2 data model work, after Phase 3 Deck Review work, after Phase 4 Training work, after Phase 4.5 mastery/design work, after Phase 5 dungeon battle foundation work, after Phase 6 battle mini-game structure work, after Phase 7 shop presentation work, after Phase 8 LocalStorage save work, after Phase 9 UI polish work, after Phase 10 run progression work, after Phase 11 first shop purchase work, after Phase 12 basic shield system work, after Phase 13 Word Scramble work, after Phase 14 basic element shop work, after Phase 15 current-run deck mutation work, after Phase 16 boss battle foundation work, after Phase 17 permanent deck completion reward work, after Phase 18 gameplay flow QA cleanup work, after Phase 19 game-style visual direction work, after Phase 20 Dungeon battle layout refactor work, after Phase 21 deck selection foundation work, after Phase 22 deck unlock progression foundation work, after Phase 23 learning mini-game redesign work, after Phase 24 Dungeon battle timer foundation work, after Phase 25 basic balance pass work, after Phase 26 element interaction foundation work, after Phase 27 run stats / best run summary work, after Phase 28 elite/event encounter foundation work, after Phase 29 full run playtest/tuning work, after Phase 30 Dungeon battle presentation work, after Phase 31 expanded deck progression work, after Phase 32 Encounter Intro / Pause System work, after Phase 33 Mastery System Gameplay Pass work, after Phase 34 Full Battle Screen Layout Refactor work, after Phase 34.1 Dungeon Layout Hotfix work, after Phase 34.2 True Fullscreen Battle Mode work, after Phase 34.3 Battle Screen Fit Pass work, after Phase 34.4 Mini-game UX + Battle Readability Refactor work, after Phase 34.5 Battle Option Density + Result Overlay Hotfix work, after Phase 34.6 Word Match Anti-Hint + Mini-game Composition Pass work, after Phase 35 Combat Feedback + Defeat Presentation Pass work, after Phase 36 Battle Stage Animation Hooks + Motion Polish work, after Phase 36.1 Unified Encounter Resolution Actions Hotfix work, after Phase 37 Enemy Variety Pass work, after Phase 38 Shop Offer Redesign work, and after Phase 39 Card Fatigue / Word Energy System work.

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
- `src/data/bosses.ts`: sample boss data with Gatekeeper.
- `src/data/shopItems.ts`: sample current-run shop item placeholders.
- `src/data/index.ts`: data exports, including `availableDecks`.

Current balance values:

- Player max HP: `32`
- Starting gold: `20`
- Gold per defeated monster: `6`
- Shop interval: every `5` defeated monsters
- Boss requirement: `20` defeated monsters
- Gatekeeper boss: `76` HP and `8` attack
- Upgrade Attack amount: `+2`
- Add Shield amount: `+3`
- Minimum current-run deck size: `5`
- Minimum distinct visible words for battle questions: `4`
- Dungeon timers: Word Choice `14s`, Word Match `20s`, Word Scramble `22s`
- Element values: Fire `+2` damage, Water `+2` shield, Earth `-2` next attack, Wind `+1` gold on defeat
- Encounter weights: Monster `70`, Event `20`, Elite `10`
- Elite rules: `1.5x` HP, `+2` attack, `+10` bonus current-run gold
- Event rewards: Treasure +10 gold or +1 random card attack, Shrine +5 HP or +5 shield, Altar -5 HP plus random element or leave
- Card baseAttack values were not changed in Phase 25.

Repository files:

- `.gitignore`: excludes `node_modules/`, `dist/`, environment files, `.DS_Store`, logs, and TypeScript build info.
- `README.md`: project overview, tech stack, status, planned features, commands, and Version 1 scope.
- `GAME_DESIGN.md`: central gameplay design reference for project concept, systems, rules, planned features, and deferred scope.

Current Deck Review implementation:

- `src/screens/DeckReview.tsx` receives the selected deck from `src/App.tsx`.
- It receives current `wordMastery` from `src/App.tsx`.
- All cards render in a responsive grid.
- Clicking a card stores the selected card in local React state.
- The selected card detail panel shows word, Thai meaning, part of speech, example sentence, difficulty, base attack, effects, and mastery placeholder.
- Mastery displays persisted values from `0 / 5`, mastered status, and the current Dungeon mastery damage bonus.
- Deck summary shows deck name, total cards, and current total saved mastery.
- Deck Review does not mutate mastery and has no persistence, save logic, battle logic, shop logic, or training interaction logic.
- Phase 9 UI polish added clearer badges, stat cards, and progress bars for scanability.

Current Training implementation:

- `src/screens/Training.tsx` receives the selected deck from `src/App.tsx`.
- The current Training mode is recall-focused Word Choice Training.
- It uses the first 10 cards from the selected deck.
- Each question randomly uses English Word to Thai Meaning, Thai Meaning to English Word, or Example Sentence Cloze.
- Each question shows the current question type clearly.
- English-to-Thai questions show an English word and 4 Thai meaning choices.
- Thai-to-English questions show a Thai meaning and 4 English word choices.
- Cloze questions blank the target word from the example sentence and ask for the correct English word.
- Player selection shows correct/wrong feedback and reveals the correct answer.
- Correct-answer feedback shows mastery before/after, Mastery increased, and Mastered at 5/5.
- A Next button advances to the next question.
- The final question shows a Restart button that resets the local training session.
- Training progress shows current question, total questions, correct count, and incorrect count.
- Training is untimed; this is intentional so players can practice safely before timed Dungeon battles.
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
- `completedDeckIds` stores completed deck ids for Starter Deck, Food Deck, Travel Deck, and Nature Deck after boss defeat.
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
- Current events are Treasure Chest, Healing Shrine, and Strange Altar.
- Battle questions use a simple mini-game structure and the current-run deck.
- Each battle question randomly selects Word Choice, Word Match, or Word Scramble.
- Monster, Elite, and Boss encounters first enter `Encounter Intro` before battle questions or timers begin.
- Encounter Intro shows encounter information, HP, attack, and flavor text with a `Start Battle` button.
- Events do not use Encounter Intro and continue to show choices immediately.
- Dungeon battle questions are timed.
- Current static time limits are Word Choice 14 seconds, Word Match 20 seconds, and Word Scramble 22 seconds.
- Timer countdown runs only while a Dungeon battle question is active, unpaused, and unanswered.
- Pause is available during active Monster, Elite, or Boss combat. It stops the timer and blocks question interaction until Resume.
- Leave Run from Pause ends the run through the existing Run Failed flow and does not save temporary run state.
- Timeout is treated as a wrong answer and causes the current monster or boss to attack.
- Word Choice shows one prompt card with an English-to-Thai, Thai-to-English, or cloze-style prompt.
- Word Choice uses answer choices that match the prompt direction and clearly reveals the correct answer after selection.
- Word Match shows 3 English words and 3 Thai meanings.
- Word Match requires selecting one English word and one Thai meaning.
- Word Scramble shows 3 scrambled English word options from the current-run deck.
- Word Scramble asks the player to choose one scrambled card and type the original English word.
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
- The first boss is Gatekeeper with 76 HP and 8 attack.
- Boss battles use the same mini-games and Card Trigger System as regular monsters.
- Boss defeat creates a Run Complete state with monsters defeated, current floor, final gold, and current-run deck size.
- Run Complete summary shows selected deck name, monsters defeated, elites defeated, events visited, boss defeated, final gold, current-run deck size, correct answers, wrong answers, timeouts, accuracy, total damage dealt, and total shield gained.
- Boss defeat marks the selected deck as completed in permanent LocalStorage progress.
- Home and Deck Review display selected deck completion status.
- Run Failed summary shows selected deck name, monsters defeated, elites defeated, events visited, current floor, final gold, correct answers, wrong answers, timeouts, accuracy, total damage dealt, and total shield gained.
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
- Phase 31 added `src/game/deckProgression.ts` for deck progression helpers without changing the LocalStorage save shape.
- Phase 31 improved Home deck progression display with locked, unlocked, completed, requirement text, and next unlock target.
- Phase 32 added Encounter Intro before Monster, Elite, and Boss combat.
- Phase 32 added Start Battle so timers and active questions begin only after the player chooses to start combat.
- Phase 32 added a Pause overlay during active combat with Resume and Leave Run actions.
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
- Usage 0 is Fresh, usage 1 is Used, usage 2 is Tired, and usage 3+ is Resting.
- Fresh words have the highest selection weight, Used words are reduced, Tired words are reduced further, and Resting words are avoided when enough other words are available.
- Resting words are allowed as fallback so mini-game generation remains playable.
- Fatigue affects Word Choice, Word Match, and Word Scramble appearance chance only.
- Fatigue does not reduce attack, shield, element effects, mastery bonuses, or any other combat math.
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
- Word Scramble uses typed input first.
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

If the player dies, permanent progress survives death and run progress is completely lost.

Temporary run upgrades should not be saved as permanent progress after death.

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
- Word Scramble correct typed answers trigger the selected scrambled word card.
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
- Completing Nature Deck shows more-decks-coming-soon reward feedback.
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
- Starter Deck is unlocked by default.
- Food Deck starts locked and unlocks after Starter Deck completion.
- Travel Deck starts locked and unlocks after Food Deck completion.
- Nature Deck starts locked and unlocks after Travel Deck completion.
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
  - Has a 22-second Dungeon battle time limit.
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

Phase 39 is complete.

Recommended next task:

Continue with the next explicitly requested phase or feature. Do not add backend, run rewards beyond deck completion, Training timers, persistent run state, advanced element interactions, Oxford 3000 import, or final art assets unless explicitly requested.
