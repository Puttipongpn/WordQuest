# GAME_DESIGN.md

## Project Concept

WordQuest is a prototype vocabulary learning roguelike deckbuilder web game. The goal is to create a simple and fun English vocabulary practice app where players review word cards, train with mini-games, and eventually use vocabulary knowledge to survive dungeon battles.

The project prioritizes a playable learning loop before final art, balancing, or advanced systems.

## Visual Direction

The current prototype uses a cozy fantasy dungeon learning game style.

Current presentation rules:

- Use CSS, Tailwind, emoji, and simple placeholder icons only.
- Make the app feel like a fantasy deckbuilder game before adding final art.
- Use warm adventure backgrounds, game-like panels, collectible vocabulary cards, battle-style dungeon panels, and fantasy shop cards.
- Phase 51 strengthens the shared visual identity with a warmer dungeon-camp background, game-like panel shadows, brighter badge/button treatments, camp hub language, spellbook Deck Review language, training-room language, merchant Shop language, and tavern ledger Run Result language.
- Phase 51 remains a CSS/Tailwind/emoji placeholder pass only; it does not add final generated art, sound, animation libraries, external UI libraries, or new gameplay systems.
- Dungeon battle presentation should prioritize monster/boss encounter first, active mini-game second, player HP/status third, and keep trigger-rule explanations in secondary or collapsible areas.
- Phase 30 Dungeon presentation uses a battle-stage structure: encounter stage, action arena, player-side status band, battle log, and card trigger feedback panel.
- Phase 34 Dungeon presentation prioritizes no-scroll gameplay visibility on desktop: player status, encounter status, current quiz, timer, and recent combat feedback should be visible together when possible.
- Dungeon uses a wider battle-screen layout with persistent top player/encounter panels, a central quiz arena, and a compact side feedback panel.
- Encounter Intro and Active Battle use separate layouts: intro is compact inspection-only with Start Battle visible, while active battle hides intro and gives most space to the current quiz.
- Dungeon uses true fullscreen battle mode: normal app navigation chrome is hidden, the header stays compact, and the battle screen occupies the remaining viewport with the quiz as the primary content.
- Active Dungeon battle should fit inside a 1366x768 desktop viewport: player HP, monster HP, timer, current quiz, and answer controls stay visible, while battle log, card trigger details, and learning info live in compact accordions.
- Active battle should not reveal the triggered card, target card, correct answer, or final result before the player answers.
- Battle answer options should carry compact card stats, including attack, shield, element, and mastery bonus where relevant, so players can make deckbuilder decisions without a persistent answer-leaking trigger preview.
- Result feedback should appear only after answer, timeout, or resolution, preferably as a compact overlay or popup inside the quiz area.
- Battle option cards should place compact stats on the right side of each option to reduce vertical height and improve scan speed.
- Timer and short quiz instructions may live in the Battle Control Panel instead of the quiz arena to preserve vertical space for the actual interaction.
- Result feedback should use a compact centered overlay with a dimmed quiz backdrop instead of an inline panel that pushes answer controls down.
- In Word Match, compact card stats should appear only on the English card side because that side is the card that can trigger; Thai meaning options should not show stats.
- Word Match should use a compact selected-pair footer with Check Pair so the action remains close to the choices without wasting vertical space.
- Word Scramble option cards should keep scrambled text readable; card stat chips should wrap below the scrambled letters instead of covering or truncating them.
- Word Scramble uses tile-based letter input for Version 1: players choose a scrambled card, tap letter tiles to build the answer, and can tap answer tiles to return them.
- Mobile battle layout should prioritize playable quiz controls first; secondary battle log, learning, and trigger details can collapse or move below the arena.
- On mobile and narrow screens, Dungeon battle can scroll vertically when needed; quiz controls, timer, player/enemy status, result actions, Pause, and Abandon controls must remain reachable rather than being clipped by fixed viewport assumptions.
- Mobile Dungeon uses a compact top battle status and timer/control strip near the quiz, while secondary panels move below the active play area.
- Post-deploy mobile polish should remain targeted: reduce mobile spacing, keep Word Match and Word Scramble controls tappable, keep result and modal actions reachable, and avoid full UI redesigns unless explicitly requested.
- Mobile Dungeon should minimize side padding in active battle so the real play area is as wide as possible.
- When a new active Dungeon question starts on mobile, the screen may automatically scroll to the top of the play area near the timer and quiz to reduce repeated manual scrolling.
- A compact battle-stage strip may reserve space for future player/monster presentation, but it should not reduce quiz usability or add gameplay rules.
- Monster, Elite, Boss, and Event encounters should feel visually distinct while using placeholder assets only.
- Combat feedback should make damage, hits, shield gain, shield absorption, timeout state, and triggered card effects easy to scan.
- If a wrong answer, timeout, or enemy hit reduces player HP to 0, result feedback should use `Defeated!` style messaging rather than generic wrong/timeout wording.
- Compact result overlays can use stronger game-result titles such as Hit, Monster Defeated, Elite Defeated, Boss Defeated, Time Out, Wrong, and Defeated while preserving the underlying combat rules.
- The compact battle stage strip can show short presentation-only feedback such as player attacks, shield blocked, encounter defeated, or run ended.
- Phase 60 battle stage presentation uses placeholder-only CSS, Tailwind, emoji/text/icon-like visuals, and existing components.
- Active Dungeon battles should read as a simple scene with player side, encounter side, and a compact action lane, while keeping the quiz as the primary playable area.
- Player presentation may show only existing run information such as HP, shield, gold, floor, and run progress; it must not add customization, equipment, or new stats.
- Monster, Elite, Boss, and Event presentation should be visually distinct. Events should remain discovery-style rather than combat stance.
- Battle stage and character presentation are presentation-only and must never change combat math, timers, answer checking, run state, save behavior, deck unlocks, Word Energy, or encounter progression.
- Battle stage visuals must not reveal hidden answers, trigger cards, correct answers, or result data before the player answers.
- Mobile battle remains quiz-first; stage visuals must stay compact and must not push timer, quiz controls, result actions, Pause, or Abandon controls out of reach.
- Battle stage motion uses CSS-only animation hooks such as hit flash, damage shake, shield pulse, attack pop, defeat glow, result pop, and floating combat text.
- Motion effects are presentation-only and should never change combat rules, timer values, save behavior, or run progression.
- Motion should remain subtle, readable, and safe for reduced-motion users.
- Phase 58 expands game-feel motion with CSS-only reward pulses, selected-card glow, mastery pulse, answer feedback motion, shop feedback motion, and tile/button press feedback.
- Motion must not reveal hidden answers, trigger cards, or result information before the player answers.
- Reduced-motion users should receive readable state changes without required animation.
- Phase 59 adds optional sound effects using browser-native Web Audio generation only.
- Sound is off by default, player-controlled, subtle, and presentation-only.
- Sound must initialize only after player interaction and must fail safely if the browser blocks or lacks audio support.
- Sound settings are UI preferences saved separately from player progress with `wordquest_audio_settings`.
- Sound must never change combat math, timers, answer checking, HP, shield, run state, save behavior, deck unlocks, Word Energy, shop/event/boss effects, or encounter progression.
- Important feedback must always remain visible through text, UI state, and motion; sound must never communicate critical information by itself.
- Do not add external audio assets, generated audio files, sound libraries, new dependencies, backend services, APIs, auth, database, Oxford 3000 import, new timer systems, advanced element interactions, or deployment changes as part of sound passes.
- Post-question and post-encounter actions should appear in one result overlay/action area to avoid duplicated battle controls.
- Player-facing encounter continuation should use labels such as `Next Encounter` or `Continue Dungeon`, not `Spawn Next Monster`.
- Keep text readable and the app responsive on desktop and reasonable mobile widths.
- Do not add final generated art assets, external UI libraries, backend services, APIs, auth, database, Oxford 3000 import, new timer systems, or advanced element interactions as part of visual or sound passes.

## UI Hierarchy And Declutter Direction

Phase 64A adds `UI_HIERARCHY_GUIDE.md` as the practical guide for future UI declutter work.

Accepted direction:

- Each screen should answer: what does the player need to decide right now?
- If a screen has more than 3 to 4 competing decisions, the screen should be simplified.
- Primary actions should be obvious.
- Secondary information should support the primary action without competing for attention.
- Tertiary information should usually be collapsed, moved lower, or placed in detail panels, modals, accordions, or result screens.
- Repeated cards and lists should use scan view by default and move full details into detail views.
- Badges and chips should be limited to information that affects immediate decisions or clarifies important state.
- Color should be simplified: gold/orange for primary action, green for safe/positive, red for danger/error, and muted parchment/brown/grey for normal information.
- Future UI passes should reduce dashboard-like density while preserving the cozy fantasy deckbuilder identity.

Page priority summary:

- Home: choose what to do now.
- Deck Review: scan vocabulary and inspect one selected word.
- Training: answer the current learning question.
- Dungeon: answer the current battle question, with HP, enemy HP, and timer as secondary critical state.
- Shop: choose an upgrade, then choose a target card.
- Run Result: understand the result and choose the next action.

Phase 64A is documentation-only. It does not redesign screens, change gameplay, add assets, change save rules, or change deployment setup.

Phase 64B applies the guide to Home only:

- Home is a compact Campfire Hub centered on the selected deck and next action.
- Continue Run / Start Adventure is the primary Home action depending on active-run state.
- Train and Review Deck are secondary actions.
- Deck selection uses compact scan cards instead of large dashboard-like deck cards.
- Records, How to Play, local save explanation, and Reset Progress use lower-priority collapsible sections.
- Phase 64B does not change selected deck rules, active-run memory rules, reset rules, gameplay, saves, deck unlocks, combat, timers, shop, events, boss behavior, Word Energy, assets, or deployment.

Phase 65 applies the guide to global/shared UI primitives:

- The app header and navigation should stay compact, readable, and tappable without acting like a large marketing header.
- Shared badges, cards, stat cards, progress bars, and secondary buttons should default to calmer colors, lighter shadows, and tighter spacing.
- Primary actions may remain visually strong, but repeated cards and secondary badges should be lighter by default.
- Dungeon critical state such as HP, enemy HP, timer, and answer controls must remain readable after global density changes.
- Phase 65 does not change gameplay, saves, deck unlocks, combat, timers, shop, events, boss behavior, Word Energy, assets, or deployment.

## Future Asset Direction

Phase 61 prepares future real assets through `ASSET_PLAN.md` only.

Asset direction rules:

- Future real assets should use cozy fantasy pixel art.
- The style should stay friendly, readable, warm, beginner-friendly, and suitable for vocabulary learning.
- Side-view battle art should support the current Phase 60 layout: player on the left, encounter on the right, quiz as the main playable area.
- Future assets should be integrated gradually and must always have safe emoji/text/CSS placeholder fallbacks.
- Missing or failed assets must never crash the app or block gameplay.
- Assets must not reveal hidden answers, target cards, correct answers, or result information before the player answers.
- Assets must not change combat math, timers, answer checking, HP, shield, gold, mastery, Word Energy, deck unlocks, save behavior, shop/event/boss effects, or encounter progression.
- Mobile readability is more important than visual detail.
- No final art assets or image files are added in Phase 61.
- Future generated assets should follow `ASSET_PLAN.md` for style, specs, naming, prompts, and integration rules.

## Development QA Helpers

Dungeon can include development-only QA helpers to speed up prototype testing.

Current QA helper rules:

- QA helpers are gated by `import.meta.env.DEV`.
- QA helpers must not appear in production builds.
- QA helpers are not player-facing cheat systems.
- QA helper state is not saved to LocalStorage.
- QA helper actions may mutate temporary run state for testing, such as HP, shield, gold, monster/event/boss state, run progress, and current encounter type.
- QA helper actions must not directly write word mastery, unlocked deck ids, completed deck ids, or permanent statistics.
- QA Helper `Go To Shop Checkpoint` should leave Dungeon in the same safe result/action state as a real shop checkpoint, not in a half-active battle question.
- Development-only `QA Correct` and `QA Wrong` buttons may simulate battle answers only through the same resolution paths used by real Word Choice, Word Match, and Word Scramble submissions.
- QA Correct can trigger existing card effects, damage, mastery bonuses, element effects, shield effects, Word Energy usage, encounter defeat, and boss completion through the normal Card Trigger System.
- QA Wrong can trigger existing enemy attack, shield absorption, HP damage, and Run Failed behavior through the normal wrong-answer path.
- QA Correct and QA Wrong are available only during active unanswered Dungeon battle questions.
- Run completion should still be tested through the real boss defeat flow. Force Run Complete is intentionally deferred to avoid bypassing completion reward logic.

## Prototype Deployment Scope

The current prototype is prepared for simple static demo deployment.

Deployment scope rules:

- Production demo URL is `https://word-quest-hazel.vercel.app/`.
- Recommended deployment target is Vercel with the Vite preset.
- Build command is `npm run build`.
- Output directory is `dist`.
- Deployment status is live on Vercel.
- Deployment prep does not add backend services, databases, authentication, APIs, React Router, final art assets, audio asset files, or new gameplay systems.
- Production builds must not expose development QA Helper UI.
- Deployment does not change LocalStorage behavior: permanent progress remains browser-local, and active run state remains temporary and unsaved.

Phase 54 dry-run verification:

- `npm run build` must pass before sharing or deploying.
- `npm run preview` should serve the static production build locally.
- Production preview should serve `index.html`, generated JavaScript, and generated CSS with HTTP 200.
- Built output should not include development QA Helper UI strings.
- A browser-click smoke test should still be completed manually or with browser automation before a public demo if automation is available.

Phase 56 live verification:

- The production URL returned HTTP 200 from Vercel.
- The generated JavaScript and CSS assets returned HTTP 200.
- Post-deploy mobile polish changed presentation only and did not alter combat math, timers, mastery, save schema, shop/event/boss effects, deck unlocks, or Word Energy rules.

## Core Loop

1. Player receives or selects a vocabulary deck.
2. Player reviews vocabulary cards.
3. Player trains with practice mini-games outside dungeon runs.
4. Player enters the dungeon.
5. Player fights monsters using vocabulary mini-games.
6. Correct answers trigger card effects such as attack, shield, or element power.
7. Every 5 monsters, the shop appears.
8. Every 20 monsters, a boss appears.
9. Defeating the boss completes the run and marks the current deck completed.

## Player Guidance

WordQuest includes lightweight player-facing guidance for external playtesting.

Guidance rules:

- Home includes a compact collapsible How to Play guide.
- How to Play explains Deck Review, Training, Dungeon, Shop, Boss completion, permanent progress, temporary run progress, and LocalStorage prototype limits.
- Training guidance explains that practice is untimed, correct answers increase mastery, wrong answers do not reduce mastery, and mastery can improve Dungeon damage.
- Dungeon guidance stays compact and collapsible so mobile battle remains quiz-first.
- Shop guidance explains limited offers, rerolls, target-card selection, and current-run-only upgrades.
- Feedback collection is documentation-only unless a real feedback URL is provided later.

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
- Current run deck copy
- Monsters defeated
- Current floor
- Next shop checkpoint

Version 1 saves permanent progress with LocalStorage. The current prototype persists word mastery, unlocked deck progress, and completed deck progress.

Current saved data includes:

- Save `version: 1`
- Word mastery
- Unlocked deck ids
- Completed deck ids
- Permanent statistics:
  - Total correct answers from ended runs
  - Total wrong answers from ended runs
  - Best monsters defeated
  - Best accuracy
  - Best damage dealt
  - Completed runs
  - Failed runs

Current saved data intentionally excludes:

- Gold
- Current HP
- Shield
- Shop upgrades
- Card enchantments
- Duplicated cards
- Removed cards
- Current run deck copy
- Monster state
- Monsters defeated
- Current floor
- Next shop checkpoint
- Current dungeon run state

Run summary statistics are saved only after a run completes or fails. Active run state is never persisted.

Sound settings are not player progress. They use a separate LocalStorage key and must not change the saved player progress schema.

## Run Exit Safety

Dungeon uses explicit `Abandon Run` wording for leaving an active temporary run.

Phase 62 adds an in-session Continue Run / Return Home flow.

Continue Run rules:

- Active dungeon runs may be preserved in React memory across screen navigation.
- Version 1 still does not persist active run state to LocalStorage.
- If the page is refreshed or closed, the active run can still be lost.
- Return Home is non-destructive: it leaves Dungeon, pauses the timer, keeps the current run in memory, and lets Home show Continue Run.
- Continue Run returns to the active in-memory run.
- Starting a new run while an active run exists should require confirmation because it abandons the current temporary run.

Abandon Run rules:

- Abandon Run ends only the current temporary run.
- Abandon Run never clears word mastery, unlocked decks, completed decks, or saved permanent statistics.
- Abandon Run resets temporary HP, shield, gold, shop upgrades, card enchantments, duplicated cards, removed cards, current-run deck copy, monster state, boss state, event state, floor/progression state, and Word Energy.
- Abandon Run requires confirmation before resetting the temporary run.
- Confirmed Abandon Run resets temporary run state and returns Home.
- `Abandon & Restart` is intentionally removed from the player-facing flow; players can start a new run after abandoning if they want a fresh run.
- Run Complete and Run Failed navigation actions clear temporary run state before leaving Dungeon.

Reset Progress is different from Abandon Run. Reset Progress is the only player action that clears permanent progress in LocalStorage.

## Deck System

Vocabulary is represented as decks of word cards.

Current decks:

- `Starter Deck`
- Stored in `src/data/starterDeck.ts`
- `Food Deck`
- Stored in `src/data/foodDeck.ts`
- `Travel Deck`
- Stored in `src/data/travelDeck.ts`
- `Nature Deck`
- Stored in `src/data/natureDeck.ts`
- `Daily Life Deck`
- Stored in `src/data/dailyLifeDeck.ts`
- `Emotion Deck`
- Stored in `src/data/emotionDeck.ts`
- Each deck contains 20 manual sample vocabulary cards
- All decks are exported through `availableDecks` from `src/data`

Current selected deck rules:

- `Starter Deck` is selected by default.
- Home acts as the main game hub.
- Home shows the selected deck, selected deck status, deck description, card count, mastered word count, average mastery, mastery progress, and next recommended action.
- Home shows the manual deck progression path: Starter Deck → Food Deck → Travel Deck → Nature Deck → Daily Life Deck → Emotion Deck.
- Home deck cards show locked, unlocked, selected, and completed states; unlock requirement copy; card count; mastery summary; and a select action when available.
- Home mastery summaries are display-only and use existing saved word mastery.
- Home Best Run summary uses existing saved permanent statistics.
- Home keeps Reset Progress in a separate danger-zone section with confirmation.
- Home includes local-save copy explaining permanent progress is saved in this browser/device.
- Starter Deck is unlocked by default.
- Food Deck starts locked.
- Travel Deck starts locked.
- Nature Deck starts locked.
- Daily Life Deck starts locked.
- Emotion Deck starts locked.
- Completing Starter Deck unlocks Food Deck.
- Completing Food Deck unlocks Travel Deck.
- Completing Travel Deck unlocks Nature Deck.
- Completing Nature Deck unlocks Daily Life Deck.
- Completing Daily Life Deck unlocks Emotion Deck.
- Completing Emotion Deck marks it completed and shows `More decks coming soon`.
- Deck Review uses the selected deck.
- Training uses the selected deck.
- Dungeon current-run deck starts as a temporary copy of the selected deck.
- Shop purchases mutate only the selected deck's current-run copy.
- Boss defeat marks the selected deck completed in permanent progress.
- Changing decks starts a fresh temporary run and does not reset word mastery or completed deck ids.
- Locked decks cannot be selected.
- If a selected deck is locked or unavailable, the app falls back to Starter Deck.

Decks should target around 20 words each. The long-term source for vocabulary is Oxford 3000, but manual seed data is used first.

Real Oxford 3000 import and progression beyond the current manual sample chain are intentionally deferred.

## Deck Review

Deck Review is a selected-deck learning preparation screen.

Current Deck Review rules:

- Uses the app-level selected deck.
- Shows selected deck name, description, locked/unlocked/completed status, total cards, mastered words, average mastery, weak word count, and deck mastery progress.
- Gives short readiness guidance, such as training first when average mastery is low or entering Dungeon when many words are mastered.
- Provides display-only filters for All, Weak, Unmastered, Mastered, Attack High, and Has Effect.
- Provides display-only sorting for default deck order, mastery low/high, difficulty low/high, attack high, and alphabetical.
- Card grid entries show English word, Thai meaning, part of speech, difficulty, mastery, mastery guidance, base attack, effects, and mastered status.
- Selected card details show image placeholder, English word, Thai meaning, part of speech, example sentence, difficulty, mastery, mastery Dungeon damage bonus, base attack, effects, and short battle-role copy.
- Deck Review can navigate to Training, Dungeon, or Home.
- Deck Review does not change mastery.
- Deck Review does not change permanent progress, current-run deck, HP, shield, gold, Word Energy, dungeon run state, shop state, events, bosses, timers, or LocalStorage.

Deck Review should feel like a vocabulary card collection, study journal, or adventure notebook rather than an admin table.

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

Manual deck content quality rules:

- `partOfSpeech` labels use `Noun`, `Verb`, `Adjective`, or `Adverb`.
- Thai meanings should be natural, concise, and focused on the meaning used by the example sentence.
- Example sentences should be short, beginner-friendly, and include the target word clearly for cloze practice.
- Base attack should stay within the current difficulty guidelines unless a future balance pass explicitly changes it.
- Manual deck effects should stay thematic and lightweight, using only existing attack, shield, and element effects.
- Manual deck card ids and English words should remain unique across current manual decks where practical.

## Word Mastery Concept

Each word card has mastery from `0` to `5`.

Current prototype rules:

- Default mastery is `0`.
- Correct answers in Training increase that word's mastery by `1`.
- Mastery cannot exceed `5`.
- Wrong answers do not decrease mastery.
- Mastery is loaded from LocalStorage on app start.
- Mastery is saved to LocalStorage when Training answers increase mastery.
- Missing, invalid, or incompatible save data falls back to default progress.
- Permanent mastery grants small Dungeon damage bonuses when the mastered word card triggers correctly.
- Mastery 0 grants no Dungeon damage bonus.
- Mastery 1-2 grants +1 Dungeon damage.
- Mastery 3-4 grants +2 Dungeon damage.
- Mastery 5 grants +3 Dungeon damage.
- Mastery bonuses do not mutate the current-run deck and do not save active run state.

Deck Review displays current saved mastery after page refresh and shows the current mastery bonus. Training updates mastery on correct answers and shows mastery before/after feedback.

## Word Energy / Card Fatigue

Word Energy is a current-run-only card fatigue system that encourages vocabulary variety during Dungeon battles.

Current rules:

- Fatigue is tracked by normalized word text, not card id.
- Duplicated copies of the same word share the same fatigue count.
- Usage increases only when a Dungeon word card triggers correctly.
- Wrong answers, timeouts, event choices, shop purchases, Training answers, and Deck Review do not increase usage.
- Usage 0 is Fresh.
- Usage 1-2 is Used.
- Usage 3-4 is Tired.
- Usage 5 or more is Low Energy.
- Fresh words have battle question selection weight 5.
- Used words have selection weight 3.
- Tired words have selection weight 2.
- Low Energy words are avoided if enough non-low-energy words are available.
- Low Energy words can still appear as fallback if needed to keep Word Choice, Word Match, or Word Scramble playable.
- Fatigue affects card appearance chance only.
- Fatigue does not reduce damage, shield, element effects, mastery bonuses, or combat rewards.
- Leaving Shop for Dungeon recovers Word Energy by reducing each tracked usage count by 1 to a minimum of 0.
- Fatigue resets with temporary run state on run reset, run failure, run completion, deck change, Reset Progress, or page refresh.
- Fatigue is not saved to LocalStorage.

Dungeon option cards show compact Word Energy chips where card stats are already shown. In Word Match, fatigue is shown only on the English card side. Dungeon also shows a compact Word Energy summary for current-run diagnostics.

## Basic Balance

First-pass balance values live in `src/game/balance.ts`.

Current prototype targets:

- Starter Deck should feel approachable for early learners.
- Food Deck can feel slightly more demanding through vocabulary, not new combat rules.
- Travel Deck, Nature Deck, Daily Life Deck, and Emotion Deck extend progression through vocabulary themes, not new combat rules.
- A run should leave enough room to reach the first shop without feeling impossible.
- The boss should feel stronger than regular monsters without being unfair.
- Dungeon timers should add pressure but remain beginner-friendly.

Current shared values:

- Player max HP: `32`
- Starting gold: `20`
- Gold per monster defeated: `7`
- Shop interval: every `5` defeated monsters
- Boss requirement: `20` defeated monsters
- Upgrade Attack amount: `+2`
- Add Shield amount: `+3`
- Minimum current-run deck size: `5`
- Minimum distinct visible words for battle questions: `4`
- Word Choice timer: `14` seconds
- Word Match timer: `20` seconds
- Word Scramble timer: `24` seconds
- Shop reroll cost: `5` temporary gold
- Upgrade Attack cost: `30` temporary gold
- Add Shield cost: `30` temporary gold
- Add Element cost: `40` temporary gold
- Remove Card cost: `40` temporary gold
- Duplicate Card cost: `50` temporary gold
- Fire bonus damage: `+2`
- Water shield gain: `+2`
- Earth attack reduction: `2`
- Wind defeat gold bonus: `+1`
- Encounter weights: Monster `70`, Event `20`, Elite `10`
- Elite HP multiplier: `1.5`
- Elite attack bonus: `+2`
- Elite bonus gold: `+10`
- Treasure Chest gold: `+10`
- Event attack upgrade: `+1`
- Healing Shrine HP recovery: `5`
- Healing Shrine shield gain: `5`
- Strange Altar HP cost: `5`

Card baseAttack values remain unchanged in the first balance pass. Static timer values are still first-pass values; difficulty scaling and advanced balance systems are deferred.

Phase 47 reviewed these values during a full prototype QA pass and did not change any balance constants.

Phase 49 made the first focused numeric tuning pass using the Phase 48 development-only QA helper paths as reference. Changes were intentionally small:

- Gold per monster defeated changed from `6` to `7` so the first shop is more reachable and can support one meaningful purchase plus a small reroll buffer.
- Add Shield cost changed from `40` to `35` so defensive card upgrades compete more fairly with Upgrade Attack.
- Word Scramble timer changed from `22` to `24` seconds to reduce mobile typing pressure without changing Training or other timer rules.
- Shop reroll cost remains `5`, but now lives in `src/game/balance.ts` with the other shop economy values.

Phase 49 left player HP, starting gold, shop interval, boss requirement, monster stats, elite stats, boss stats, event rewards, encounter weights, mastery bonuses, element effects, and Word Energy thresholds unchanged.

Phase 63 tuned Shop economy and feedback while leaving gold income and combat values unchanged:

- Starting gold remains `20`.
- Gold per normal monster remains `7`, so a normal first shop is usually around `55` gold after five defeated monsters.
- Elite bonus gold remains `10`.
- Event gold remains Treasure Chest/Lost Backpack `10`, Ancient Library/Forgotten Signpost `8`, and Cursed Door `15`.
- Shop reroll remains `5`.
- Upgrade Attack cost changed from `35` to `30`.
- Add Shield cost changed from `35` to `30`.
- Add Element cost changed from `45` to `40`.
- Remove Card cost changed from `30` to `40` so deck trimming remains strategic instead of cheaper than basic upgrades.
- Duplicate Card remains `50`.
- The expected first-shop feel is one meaningful basic upgrade, or sometimes one reroll plus a basic upgrade, without letting players buy every offer.

## Training Mode

Training mode is outside dungeon runs.

Training must not change:

- HP
- Gold
- Shield
- Run state
- Shop state
- Dungeon progress
- Timers

Current Training implementation:

- Recall-focused Word Choice Training
- Uses the selected deck
- Has a setup flow before each session
- Supports Quick Practice, Weak Words, Unmastered Words, and Review All modes
- Supports 5 question, 10 question, 20 question, and all available target word session lengths
- Quick Practice uses a mixed set from the selected deck
- Weak Words prioritizes words at mastery 0-2 and can fall back to higher mastery words when needed
- Unmastered Words targets words below mastery 5 and shows a friendly message if all words are mastered
- Review All can use any word from the selected deck
- Randomly selects between English Word to Thai Meaning, Thai Meaning to English Word, and Example Sentence Cloze question types
- English-to-Thai questions show an English word and 4 Thai meaning choices
- Thai-to-English questions show a Thai meaning and 4 English word choices
- Cloze questions blank the target word from the example sentence and ask for the correct English word
- Shows the current question type clearly
- Shows correct/wrong feedback
- Reveals the correct answer after selection
- Advances with Next and shows a Training Complete summary after the final question
- Training Complete shows deck, mode, answered count, correct count, wrong count, accuracy, mastery increases, newly mastered words, and actions for Train Again, Change Training Mode, Review Deck, Enter Dungeon, and Back Home
- Updates saved word mastery on correct answers
- Training is intentionally untimed so players can practice safely.

## Dungeon Battle Foundation

The first dungeon battle and run progression foundation is implemented with temporary React state only.

Current battle rules:

- Player has HP, functional shield, and gold display.
- Dungeon run progression tracks monsters defeated, current floor, and next shop checkpoint.
- The run deck starts as a temporary copy of the selected deck.
- Dungeon battle questions use the current-run deck copy.
- Current sample monsters are Slime, Goblin, Bat, Wolf, Skeleton, Mushroom, Wisp, Imp, Stone Bug, and Dark Crow.
- Each monster has name, HP, max HP, and attack.
- Phase 37 expands placeholder monster variety while preserving existing encounter and combat rules.
- Monster variety currently uses manual placeholder emoji/icons and beginner-friendly values, not a complex scaling system.
- Current encounter types are Monster, Elite, and Event.
- Monster encounters use existing battle rules.
- Elite encounters use stronger versions of existing sample monsters.
- Elite monsters have 1.5x normal monster HP, normal attack +2, stronger styling, and +10 bonus current-run gold on defeat.
- Elite encounters count as monster defeats for shop and boss progression.
- Event encounters are non-combat choices.
- Events do not count as defeated monsters and do not advance boss progression.
- Event rewards are temporary current-run rewards and are not saved to LocalStorage.
- After resolving an Event, the next generated encounter cannot be another Event.
- After resolving an Event, the next Encounter Intro should show the last Event result so the player can see the chosen reward or cost before starting the next battle.
- Battle questions use selected deck vocabulary cards through the current-run deck copy.
- Each battle question randomly selects Word Choice, Word Match, or Word Scramble.
- Monster, Elite, and Boss encounters enter Encounter Intro before active combat.
- Encounter Intro shows encounter information, HP, attack, and flavor text.
- Encounter Intro does not start the timer and does not allow battle actions.
- Pressing Start Battle begins the existing battle mini-game flow.
- Event encounters do not use Encounter Intro and show choices immediately.
- Dungeon battle questions are timed.
- Word Choice has a 14-second time limit.
- Word Match has a 20-second time limit.
- Word Scramble has a 24-second time limit.
- Timer countdown runs only while a Dungeon battle question is active, unpaused, and unanswered.
- Pause is available during active Monster, Elite, and Boss combat.
- Pause stops the timer and disables question interaction until Resume.
- Abandon Run from Pause opens the current-run abandon confirmation and never clears permanent progress.
- If time reaches 0, the result is treated as a wrong answer.
- Word Choice uses recall-focused prompts instead of image-only prompts.
- Word Choice can ask English Word to Thai Meaning, Thai Meaning to English Word, or Example Sentence Cloze.
- Word Choice choices match the prompt direction and reveal the correct answer after selection.
- Word Match shows 3 English words and 3 Thai meanings.
- Word Match asks the player to select one English word and one Thai meaning.
- Word Scramble shows 3 scrambled English word options from the current-run deck.
- Word Scramble asks the player to choose one scrambled card and build the original English word with letter tiles.
- Word Scramble letter tiles are generated from the selected word in scrambled order.
- Word Scramble duplicate letters use unique tile ids.
- Word Scramble allows tapped answer tiles to return to the available tile pool.
- Word Scramble disables Check Word until the selected answer length matches the target word length.
- Correct answers trigger the selected word card.
- Correct Word Match pairs trigger the selected English word card.
- Correct Word Scramble answers trigger the selected scrambled word card.
- Correct Dungeon card triggers increase current-run Word Energy fatigue for that normalized word.
- Triggered cards deal damage equal to `baseAttack`.
- If a current-run card has been upgraded in the shop, the upgraded `baseAttack` is used for battle damage.
- If a triggered card has saved word mastery, its permanent mastery damage bonus is added to final damage.
- If a triggered card has a shield effect, the player gains that shield while the card still deals `baseAttack` damage.
- If a triggered card has an element effect, Dungeon applies that element's first-pass gameplay effect.
- Fire deals +2 bonus damage.
- Water grants +2 shield.
- Wind grants +1 extra temporary gold if the triggered hit defeats the monster or boss.
- Earth reduces the immediate next monster or boss attack by 2.
- Earth pending reduction resets after it is used, after the battle question advances, when a new monster starts, when boss battle starts, or when the run restarts.
- Incorrect answers do not trigger card effects.
- Incorrect answers cause the current monster to attack.
- Timeout does not trigger card effects and causes the current monster or boss to attack.
- Monster attacks reduce player shield before damaging player HP.
- Shield starts at 0 each run and is temporary run progress.
- When monster HP reaches 0, the screen shows `Monster Defeated`.
- Defeating a monster increases `monstersDefeated` by 1.
- Defeating a monster grants +6 temporary gold.
- Current-run statistics track questions answered, correct answers, wrong answers, timeouts, monsters defeated, elite defeated, events visited, boss defeated, total damage dealt, total shield gained, gold earned, cards upgraded, cards removed, cards duplicated, and elements added.
- Healing Shrine shield rewards count toward total shield gained in run summaries.
- Shop checkpoints occur every 5 defeated monsters.
- When a shop checkpoint is reached, Dungeon shows `Shop Available`.
- Dungeon can route to Shop with a `Go To Shop` button.
- Shop can route back to Dungeon with a `Back To Dungeon` button.
- Shop can mutate the current-run deck through Remove Card and Duplicate Card purchases.
- Removed cards no longer appear in Dungeon mini-games.
- Duplicated cards are added as extra current-run deck entries and may appear more often.
- Battle question builders avoid showing the same word twice in a single question, even when duplicates exist in the run deck.
- Battle question builders use Word Energy weights to make heavily repeated words less likely to appear, while preserving fallback behavior for playability.
- Remove Card is guarded so battle questions keep enough distinct visible words.
- After a monster is defeated, the player can spawn the next sample monster.
- Boss becomes available after 20 defeated monsters.
- Boss encounters select from a placeholder boss pool when the boss battle starts.
- Current placeholder bosses are Gatekeeper, Word Warden, Grammar Golem, Shadow Reader, and Memory Dragon.
- Boss HP / attack values stay beginner-friendly, currently in the 64-76 HP and 7-10 attack range.
- Boss metadata can include title, intro flavor text, defeat text, and special move name for presentation only.
- Boss battles use the same Word Choice, Word Match, Word Scramble, Card Trigger System, current-run deck, attack, shield, and element display behavior as regular monster battles.
- Wrong boss battle answers cause boss attacks, and shield absorbs boss damage before HP.
- When boss HP reaches 0, the screen shows `Run Complete`.
- Run Complete appears as a main battle-arena victory result screen, not a narrow side-panel report.
- Run Complete shows selected deck name, boss defeated, deck completion / unlock reward feedback, final gold, current-run deck size, correct answers, wrong answers, timeouts, accuracy, total damage dealt, and total shield gained.
- Run Complete also shows elites defeated and events visited.
- Run Complete shows boss icon, boss name, boss title, and defeat text when available.
- Boss defeat marks the selected deck completed in `completedDeckIds`.
- Completed deck ids are saved in LocalStorage permanent progress.
- If Starter Deck is completed, Food Deck is unlocked in `unlockedDeckIds`.
- If Food Deck is completed, Travel Deck is unlocked in `unlockedDeckIds`.
- If Travel Deck is completed, Nature Deck is unlocked in `unlockedDeckIds`.
- If Nature Deck is completed, Daily Life Deck is unlocked in `unlockedDeckIds`.
- If Daily Life Deck is completed, Emotion Deck is unlocked in `unlockedDeckIds`.
- If Emotion Deck is completed, Run Complete shows that more decks are coming soon.
- Run Complete shows reward feedback that the selected deck was completed and permanent progress was saved.
- Boss defeat does not unlock decks beyond Emotion Deck yet.
- When player HP reaches 0, the screen shows `Run Failed`.
- Run Failed appears as a main battle-arena result screen with encouraging copy.
- Run Failed shows selected deck name, failure reason, monsters defeated, current floor, final gold, correct answers, wrong answers, timeouts, accuracy, total damage dealt, and total shield gained.
- Run Failed also shows elites defeated and events visited.
- Both ending screens show compact Permanent Progress Kept and Temporary Run Lost sections.
- Ending actions are centralized in the main result screen: Start Fresh Run / Restart Run, Review Deck, Training, and Back Home.
- Completed and failed run summaries update permanent best run stats in LocalStorage.
- After run failure, the player can restart the local run.

Deferred dungeon systems:

- Run rewards beyond the selected deck completion marker
- Advanced element interactions
- Real Oxford 3000 progression beyond the manual sample decks
- Permanent mastery updates from battle

Dungeon battle and run progression state are still temporary React state only. LocalStorage is used for permanent progress, not current run progress.

Timer and pause state are temporary Dungeon UI/combat state and are not saved to LocalStorage.

Run statistics are temporary while a run is active. Only end-of-run summary records update permanent best run stats.

Current Event encounters:

- Treasure Chest
  - Gain +10 gold, or
  - Upgrade a random current-run card attack by +1
- Healing Shrine
  - Recover 5 HP, or
  - Gain 5 shield
- Strange Altar
  - Lose 5 HP and add a random element to a random current-run card, or
  - Leave
- Campfire
  - Recover 6 HP, recover current-run Word Energy by 1 step, or
  - Leave
- Lost Backpack
  - Gain +10 gold, upgrade a random current-run card attack by +1, or
  - Leave
- Ancient Library
  - Upgrade a random current-run card attack by +1, gain +8 gold, or
  - Leave
- Element Fountain
  - Add a random element to a random current-run card, add Shield +2 to a random current-run card, or
  - Leave
- Cursed Door
  - Lose 6 HP and gain +15 gold, lose 6 HP and upgrade a random current-run card attack by +1, or
  - Leave
- Wandering Trainer
  - Upgrade a random current-run card attack by +1, recover current-run Word Energy by 1 step, or
  - Leave
- Mystic Well
  - Gain 6 shield, recover 6 HP, or
  - Leave
- Forgotten Signpost
  - Gain +8 gold, gain 5 shield, or
  - Leave

Expanded Event rewards are current-run-only. They may affect temporary HP, shield, gold, Word Energy, or the current-run deck copy, but they do not modify word mastery, deck unlocks, completed decks, permanent statistics, source deck data, or LocalStorage.

Event safety rules:

- Events do not count as monster defeats.
- Events do not advance boss progress or trigger shop checkpoints by themselves.
- HP-cost event choices are disabled when the cost would reduce player HP to 0 or below.
- Random-card event choices target only cards currently present in the current-run deck.
- Duplicated current-run cards are valid random event targets.
- Removed cards are not valid event targets.
- Word Energy recovery from events affects only current-run fatigue and is not saved.

## Mini-Game Plan

Training mini-games:

- Recall-focused Word Choice Training: implemented with local question state and saved mastery updates.
- English Word to Thai Meaning: implemented.
- Thai Meaning to English Word: implemented.
- Example Sentence Cloze: implemented.
- Match word to meaning: planned.

Battle mini-games:

- Word Choice: implemented.
- Word Choice uses English/Thai recall and cloze-style prompts rather than image-only prompts.
- Word Choice has a 14-second Dungeon battle timer.
- Word Match: implemented.
- Word Match has a 20-second Dungeon battle timer.
- Word Scramble: implemented with tile-based letter input, 3 scrambled current-run card options, and Card Trigger System effects.
- Word Scramble has a 24-second Dungeon battle timer.

Battle mini-game timers currently use simple static values first. Difficulty-based timer scaling is deferred.

## Shop Plan

Shop presentation is implemented. The active shop purchases are `Upgrade Attack`, `Add Shield`, the four Add Element items, `Remove Card`, and `Duplicate Card`.

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

Future shop upgrades should modify card effects or card behavior rather than directly increasing generic player stats.

Current shop rules:

- Shop item data lives in `src/data/shopItems.ts`.
- The Shop screen is labeled `Current Run Shop`.
- Shop upgrades are explained as temporary current-run upgrades.
- The Shop uses limited randomized offers instead of exposing every deck-editing control at once.
- Each shop visit shows 4 randomized item offers from the existing shop item pool.
- Shop offer cards show icon placeholder, name, description, cost, type, eligible target count, current-run label, and affordability state.
- Selecting a shop offer opens a focused modal with up to 4 eligible current-run word card targets.
- Purchase confirmation happens in the modal before spending temporary gold or mutating the current-run deck.
- Target modal previews show current gold, item cost, gold after purchase, and the target-specific before/after change.
- Upgrade Attack previews show ATK before/after.
- Add Shield previews show SHD before/after.
- Add Element previews show element before/after.
- Remove Card previews show deck size before/after and current-run-only removal copy.
- Duplicate Card previews show deck size before/after and explain that copies keep current upgrades.
- Shop offers can be rerolled for 5 temporary current-run gold.
- Rerolling shop offers spends gold, refreshes visible offers, shows reroll feedback, does not mutate the deck, and is not saved to LocalStorage.
- `Upgrade Attack` is purchasable.
- `Upgrade Attack` uses its existing shop item cost.
- If the player has enough temporary gold, the player can choose one current-run card and increase its `baseAttack` by +2.
- `Add Shield` is purchasable.
- `Add Shield` uses its existing shop item cost.
- If the player has enough temporary gold, the player can choose one current-run card and add Shield +3.
- If the selected card already has a shield effect, Add Shield increases that shield effect by +3.
- `Add Fire Element`, `Add Water Element`, `Add Wind Element`, and `Add Earth Element` are purchasable.
- Element purchases use each shop item's existing cost.
- If the player has enough temporary gold, the player can choose one current-run card and add or replace that card's element effect.
- A card may have one element effect for now.
- Element effects started as display-only in Phase 14 and now apply simple first-pass Dungeon effects from Phase 26.
- `Remove Card` is purchasable.
- `Remove Card` uses its existing shop item cost.
- If the player has enough temporary gold and the current-run deck has more than 5 cards, the player can choose one current-run card and remove it.
- The minimum current-run deck size is 5 cards.
- Remove Card must leave at least 4 distinct visible words in the current-run deck.
- Remove Card target offers filter out cards that would break minimum deck or visible-word safety rules.
- `Duplicate Card` is purchasable.
- `Duplicate Card` uses its existing shop item cost.
- If the player has enough temporary gold, the player can choose one current-run card and add a unique-id copy of it to the current-run deck.
- Duplicates preserve current-run upgrades, including upgraded `baseAttack`, shield effects, and element effects.
- Successful purchases show a compact receipt with affected card/action, before/after values, gold spent, remaining gold, and current-run-only reminder.
- If the player does not have enough temporary gold, the Shop shows not-enough-gold feedback with needed/current/missing gold and does not mutate state.
- If a selected current-run card becomes stale after deck mutation, purchase logic refuses the purchase and the Shop falls back to a valid selection.
- Dungeon can route to Shop when a checkpoint is available.
- Shop can route back to Dungeon.
- Shop upgrades modify only current-run cards.
- Shop upgrades, shield effects, element effects, remove/duplicate mutations, gold, and current-run deck changes are not saved to LocalStorage.

## Card Effects

Version 1 card effects are based on:

- Attack
- Shield
- Element

Card effects are stored as an optional `effects` array on `WordCard`. Simple cards can have no effects. Future cards can have one or more effects.

## Card Trigger System

Mini-games use vocabulary cards.

Rules:

- A correct answer successfully triggers the selected word card.
- Triggering a word card activates that card's effects.
- Version 1 effects:
  - Attack
  - Shield
  - Element
- Attack effects currently use the card's `baseAttack` for damage.
- Shield effects currently add player shield when the card triggers.
- Element effects now apply simple first-pass gameplay effects during Dungeon battles.
- Incorrect answers do not trigger card effects.
- Future shop upgrades and enchantments modify card effects, not player stats directly.

The battle system should be built around card-triggered effects rather than a generic player attack stat.

## Element Concept

Current element types:

- Fire
- Water
- Wind
- Earth

Elements are simple current-run card effect properties with first-pass Dungeon gameplay effects.

Current element rules:

- A card may have one element effect for now.
- Adding a new element to a card replaces the previous element.
- Element effects are temporary current-run card effects.
- Element effects are not saved to LocalStorage.
- Triggered cards display their element and gameplay effect in the battle effects summary.
- Fire: deal +2 bonus damage.
- Water: gain +2 shield.
- Wind: gain +1 extra temporary gold if the triggered hit defeats the monster or boss.
- Earth: reduce the immediate next monster or boss attack by 2.
- Earth does not persist forever; the pending reduction resets after use or when the battle question advances.
- Weakness, resistance, element matchups, scaling, and advanced balance rules are deferred.

## Death Rule

Permanent progress survives death.

Run progress is completely lost on death.

This keeps roguelike tension while preserving vocabulary learning progress.

## Reset Progress

The Home screen includes a simple reset progress action.

Reset progress rules:

- Show a distinct confirmation modal before clearing permanent progress.
- Clear the LocalStorage saved player progress.
- Reset in-memory progress back to defaults.
- Clear word mastery, unlocked decks, completed decks, and best run stats.
- Do not affect any backend or remote state because none exists in Version 1.

## Save Versioning

Saved player progress includes `version: 1`.

If saved data is missing, invalid, or incompatible with the current version, the app falls back to default progress and does not crash.

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
- Save migrations beyond version 1
