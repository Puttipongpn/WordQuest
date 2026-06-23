# QA_CHECKLIST.md

Use this checklist before sharing or deploying the WordQuest prototype.

## Fresh Start

- Open the app on Home.
- Confirm Starter Deck is unlocked by default.
- Confirm locked decks show requirement text.
- Confirm Daily Life Deck appears after Nature Deck in the deck progression path.
- Confirm Emotion Deck appears after Daily Life Deck in the deck progression path.
- Confirm missing LocalStorage data falls back to default progress.
- Confirm invalid LocalStorage data does not crash the app and falls back safely.

## Learning Screens

- All 6 manual decks load.
- All manual decks contain 20 cards.
- Manual deck card ids are unique.
- Manual deck English words are unique unless intentionally duplicated.
- Thai meanings are reviewed for natural, concise wording.
- Part of speech labels use `Noun`, `Verb`, `Adjective`, or `Adverb`.
- Example sentences are reviewed for beginner-friendly cloze practice.
- Deck Review loads the selected deck.
- Deck Review filters and sorting are display-only and do not mutate progress.
- Card details show word, Thai meaning, example sentence, difficulty, attack, effects, and mastery.
- On desktop, Deck Review selected-card info panel stays below the sticky header/nav while scrolling and its long content remains reachable.
- Training loads the selected deck.
- Training question types rotate between recall/cloze styles.
- Correct Training answers increase word mastery by 1 up to 5.
- Wrong Training answers do not decrease mastery.
- Mastery persists after refresh.
- Daily Life Deck works in Deck Review when unlocked and selected.
- Emotion Deck works in Deck Review when unlocked and selected.
- Daily Life Deck works in Training when unlocked and selected.
- Emotion Deck works in Training when unlocked and selected.
- Each deck can be used in Training.

## Deck Review Compact Scan Mode

- Deck Review loads the currently selected deck.
- All 6 manual decks can be reviewed when unlocked and selected.
- Each manual deck still shows 20 cards.
- Top Deck Review summary is compact and does not dominate the page.
- Filter controls wrap cleanly.
- Sort control remains usable.
- Filters still work.
- Sorting still works.
- Card grid is scan-first.
- Grid cards show English word and Thai meaning.
- Grid cards show part of speech or difficulty.
- Grid cards show compact mastery state.
- Grid cards show ATK compactly.
- Grid cards show effects only when present.
- Grid cards do not show long helper text.
- Grid cards do not show `No Effect` badges.
- Grid cards do not show full effect descriptions.
- Grid cards do not show repeated per-card mastery progress bars.
- Selected card state is visible without making the card much taller.
- Selecting a card updates the detail panel.
- Detail panel shows word, Thai meaning, part of speech, and example sentence.
- Detail panel shows difficulty and base attack.
- Detail panel shows effects when present.
- Detail panel shows mastery value, mastery bonus, and learning guidance.
- Empty filtered states are compact and can return to all cards.
- Deck Review does not mutate mastery.
- Deck Review does not mutate run state.
- Mobile Deck Review has no horizontal overflow.

## Dungeon Battle

- Dungeon opens from Home.
- QA Helper appears in Dungeon only during development.
- Encounter Intro appears before Monster, Elite, and Boss combat.
- Start Battle generates a timed question.
- Word Choice is playable.
- Word Match follows the anti-hint rule: stats appear only on English card options.
- Word Scramble is playable with tile-based letter input.
- Word Scramble duplicate letters can be selected and returned safely.
- Word Scramble Check Word stays disabled until the selected answer length is complete.
- Timeout is treated as a wrong answer.
- Correct answers trigger card effects.
- Wrong answers and timeouts do not trigger card effects.
- Shield absorbs damage before HP.
- Element effects display and apply their first-pass effects.
- Mastery bonus appears when a mastered word triggers.
- Word Energy changes card selection weight without saving run state.
- Daily Life Deck works in Dungeon when unlocked and selected.
- Emotion Deck works in Dungeon when unlocked and selected.
- Word Scramble tile input works with Daily Life Deck and Emotion Deck words.
- Each deck can be used in Dungeon after it is unlocked and selected.
- Word Scramble tile input works with all current manual decks.

## Development QA Helper

- QA Helper appears only in development builds.
- Go To Shop Checkpoint does not break the active or next mini-game state.
- Go To Shop Checkpoint allows entering Shop and returning to Dungeon normally.
- QA Correct works in Word Choice.
- QA Correct works in Word Match.
- QA Correct works in Word Scramble.
- QA Wrong works in Word Choice.
- QA Wrong works in Word Match.
- QA Wrong works in Word Scramble.
- QA Wrong can trigger Run Failed if HP reaches 0 through enemy attack.
- QA Correct can defeat Monster, Elite, and Boss through the real combat path.
- QA Correct / QA Wrong do not create duplicate result overlays or duplicate next actions.
- QA Correct / QA Wrong are disabled before Start Battle, during events, during pause, after run end, and when no unanswered question is active.

## Shop

- Shop appears at checkpoints or through development QA helper testing.
- Shop offers are limited and can be rerolled with temporary gold.
- Purchase modal opens and shows eligible current-run cards.
- Upgrade Attack modifies only current-run cards.
- Add Shield modifies only current-run cards.
- Element items modify only current-run cards.
- Remove Card respects minimum deck size and distinct-word guards.
- Duplicate Card preserves current-run upgrades and creates a unique card id.
- Shop changes reset on run restart, run failure, deck change, page refresh, or Abandon Run.

## Shop Economy And Feedback

- First shop usually allows at least one basic upgrade after five normal monster defeats.
- Upgrade Attack target preview shows ATK before/after.
- Add Shield target preview shows SHD before/after.
- Add Element target preview shows element before/after.
- Remove Card target preview shows deck size before/after and current-run-only removal copy.
- Duplicate Card target preview shows deck size before/after and copy-keeps-upgrades copy.
- Purchase modal shows current gold, cost, and gold after purchase.
- Purchase success feedback appears clearly after the modal closes.
- Purchase receipt shows affected card or action.
- Purchase receipt shows gold spent and remaining gold.
- Insufficient gold shows needed/current/missing gold.
- Insufficient gold does not spend gold.
- Insufficient gold does not mutate cards or deck size.
- Reroll success clearly refreshes offers and spends gold.
- Reroll feedback shows gold before/after.
- Reroll failure does not spend gold or change offers.
- Shop offer cards show affordability state.
- Shop upgrades remain current-run-only.
- Shop changes reset on run end, abandon, refresh, deck change, or new run.
- Mobile Shop target modal remains usable with reachable confirm/cancel buttons.
- Sound toggle still works with shop buy/error/reroll sounds when enabled.

## Encounters

- Event encounters show choices immediately.
- Event rewards are temporary current-run effects.
- Events do not count toward boss progression.
- Elite encounters are visually distinct.
- Elite defeats count as monster defeats and grant bonus current-run gold.
- Boss becomes available at the configured boss milestone.
- Boss uses the same Card Trigger System as other battles.

## Run End States

- Run Complete shows selected deck, boss result, reward copy, and summary stats.
- Run Complete marks the selected deck completed.
- Run Complete unlocks the next deck when applicable.
- Completing Nature Deck unlocks Daily Life Deck.
- Completing Daily Life Deck unlocks Emotion Deck.
- Completing Emotion Deck shows More decks coming soon.
- Deck progression remains Starter → Food → Travel → Nature → Daily Life → Emotion.
- Run Failed shows selected deck and summary stats.
- Permanent best-run statistics update only after Run Complete or Run Failed.
- Run restart resets HP, shield, gold, encounter state, boss state, run progress, current-run deck, shop upgrades, and Word Energy.
- Run restart does not reset word mastery, unlocked decks, completed decks, or permanent statistics.

## Exit And Reset Safety

- Pause stops the Dungeon timer and disables question interaction.
- Resume continues the active battle.
- Abandon Run requires confirmation.
- Abandon Run clears only temporary run state.
- Abandon & Restart is removed or no longer shown.
- Reset Progress requires confirmation.
- Reset Progress clears word mastery, unlocked decks back to default, completed decks, and permanent statistics.
- Reset Progress returns deck access to Starter Deck only.

## Run Continue

- Pause opens modal.
- Resume continues current battle.
- Return Home leaves Dungeon without abandoning the run.
- Home shows Continue Run when an active run exists.
- Continue Run returns to the active run.
- Timer does not run while player is on Home.
- Continue Run does not create duplicate timers.
- Abandon Run requires confirmation.
- Abandon Run discards current run.
- Abandon Run does not clear word mastery, unlocked decks, completed decks, or permanent stats.
- Abandon & Restart is removed or no longer shown.
- Starting a new run while an active run exists requires confirmation.
- Run Complete clears active continue state.
- Run Failed clears active continue state.
- Page refresh can still lose active run state for Version 1.
- Reset Progress clears permanent progress and active run state.

## Home Hub Simplification

- Home loads.
- Primary action is visible quickly.
- Continue Run appears prominently when an active run exists.
- Start Adventure appears when no active run exists.
- Train remains available from Home.
- Review Deck remains available from Home.
- Selected deck summary is compact and readable.
- Selected deck summary shows mastery progress without large repeated stat cards.
- Deck selector is compact and scalable.
- Locked decks show short requirement copy.
- Unlocked decks can be selected.
- Locked decks cannot be selected.
- Selected deck affects Deck Review.
- Selected deck affects Training.
- Selected deck affects Dungeon.
- Deck progression path is compact.
- How to Play remains available but does not dominate Home.
- Records remain available but do not dominate Home.
- Reset Progress remains available and requires confirmation.
- Mobile Home has no horizontal overflow.
- Mobile Home does not require excessive scrolling before primary actions.
- Active run is still not persisted to LocalStorage.
- Page refresh can still lose active run state for Version 1.

## Responsive Smoke Test

- Home is usable on desktop and narrow/mobile viewport.
- Deck Review is usable on desktop and narrow/mobile viewport.
- Training is usable on desktop and narrow/mobile viewport.
- Dungeon active battle keeps player HP, enemy HP, timer, quiz, and answer controls reachable.
- Dungeon active battle uses reduced mobile side padding so the play area is wider.
- Starting a new Dungeon question on mobile scrolls near the timer and quiz area.
- Shop modal is usable on desktop and narrow/mobile viewport.
- Run Complete and Run Failed summaries are readable on desktop and narrow/mobile viewport.

## Future UI Hierarchy And Declutter

- Each screen has one clear primary action or primary decision.
- Secondary information does not visually compete with the primary action.
- Tertiary explanations, records, logs, and danger actions use progressive disclosure where practical.
- Home does not require excessive scrolling before play actions.
- Deck selector remains compact and scalable as deck count grows.
- Deck Review grid supports fast scanning without turning every word card into a mini-dashboard.
- Training keeps the current question and answer choices as the strongest visual focus.
- Dungeon active answering keeps quiz, player HP, enemy HP, and timer as the focus.
- Battle details remain available but are not always visually dominant during active answering.
- Shop offers are readable without long repeated text on every offer card.
- Shop affordability uses clear copy such as `Need +X gold` when the player cannot buy.
- Run Result makes outcome and next action clearer than detailed stat records.
- Badges and chips are limited to immediate decisions or important state.
- Danger actions are not visually dominant unless the player is in a confirmation flow.
- Mobile screens avoid horizontal overflow and excessive fixed-height panels.

## Global Density And Header

- Header is compact on desktop.
- Header is compact on mobile.
- Navigation remains readable and tappable.
- Active nav state is clear.
- Sound toggle remains reachable and usable.
- Primary buttons remain visually strongest.
- Secondary buttons are calmer than primary buttons.
- Danger buttons remain clear but are not visually dominant outside confirmation flows.
- Repeated cards are lighter than primary panels.
- Badge/chip clusters do not dominate the screen.
- Color hierarchy follows primary/safe/danger/neutral rules.
- Home compact hub still works.
- Deck Review still works and remains readable.
- Training still works and answer choices remain prominent.
- Dungeon battle remains playable with HP, enemy HP, timer, and answer controls readable.
- Shop remains usable and affordability/cost text remains clear.
- Run Result remains readable.
- No horizontal overflow on mobile.
- QA Helper remains dev-only.

## Motion And Feedback

- Dungeon correct answers show reward-style feedback without changing combat math.
- Dungeon wrong answers and timeouts show damage/error feedback without changing timer or attack rules.
- Card Trigger details appear only after answer or timeout resolution.
- Word Scramble letter tiles have press feedback and remain tappable on mobile.
- Shop success and not-enough-gold feedback are visually distinct.
- Training correct/wrong answers and mastery increases are visually distinct.
- Home and Deck Review selected deck/card states are easy to identify.
- Motion does not create horizontal overflow on mobile.
- With reduced-motion enabled, the UI remains readable and usable without required animation.

## Battle Stage

- Player presentation appears in Dungeon battle.
- Monster presentation appears in Dungeon battle.
- Elite presentation is visually distinct.
- Boss presentation is visually distinct.
- Event presentation remains discovery-style, not combat stance.
- Start Battle remains obvious.
- Timer still starts only after Start Battle.
- Quiz remains reachable on desktop.
- Quiz remains reachable on mobile.
- Result overlay actions remain reachable.
- Word Choice still works.
- Word Match still works.
- Word Scramble tile input still works.
- No answer is revealed before the player answers.
- Reduced-motion mode remains usable.
- Sound toggle still works.
- QA Helper remains dev-only.

## Sound

- Sound starts off by default.
- Sound toggle is visible and usable on desktop and mobile.
- Turning sound on does not crash the app.
- Turning sound off stops future sound effects.
- Sound preference persists separately from player progress.
- Correct Training answer sound plays when enabled.
- Wrong Training answer sound plays when enabled.
- Training completion sound plays once when enabled.
- Correct Dungeon answer sound plays when enabled.
- Wrong Dungeon answer sound plays when enabled.
- Timeout sound plays when enabled.
- Shield, hit, defeat, and victory sounds are subtle if encountered.
- Shop purchase sound plays when enabled.
- Shop not-enough-gold or blocked-purchase sound plays when enabled.
- Shop reroll sound plays when enabled.
- App works normally if sound is off.
- App works normally if the browser blocks or suspends audio.
- No important feedback depends only on sound.
- No external audio assets were added.

## Asset Prep

- `ASSET_PLAN.md` exists.
- Future cozy fantasy pixel-art direction is documented.
- Future asset naming convention is documented.
- Future sprite specs are documented.
- Future animation frame recommendations are documented.
- Future player asset list is documented.
- Future monster asset list is documented.
- Future boss asset list is documented.
- Future effects asset list is documented.
- Future UI and background asset lists are documented.
- Current monster and boss names are mapped to future asset filenames.
- Future image-generation prompt templates are documented.
- No real image assets are required for build.
- Missing assets cannot crash the current runtime.
- Current placeholder UI still works.
- Build passes.

## Production Readiness

- `npm install` completes.
- `npm audit` is reviewed before public deployment.
- `npm run build` completes.
- `npm run preview` serves the production build.
- Production build opens on Home.
- Production build does not expose QA Helper UI.
- Production build does not require audio asset files.
- Production HTML, JavaScript, and CSS assets return HTTP 200 from the preview server.
- Searching `dist` for `QA Helper`, `Development only`, `QA Correct`, `QA Wrong`, `Force Run Failed`, and `Force Run Complete` returns no matches.
- Vercel settings are still: Vite preset, build command `npm run build`, output directory `dist`.
- No backend, database, auth, API, or server runtime is required.
- Production demo URL is live: `https://word-quest-hazel.vercel.app/`.
- Live Vercel deployment returns HTTP 200 for HTML, generated JavaScript, and generated CSS.
- Progress on the live demo is saved locally in the user's browser with LocalStorage only.

## Production Preview Smoke Test

- Home loads in production preview.
- Deck selection shows all 6 manual decks with locked, unlocked, and completed states.
- Deck Review loads for the selected unlocked deck.
- Training loads for the selected unlocked deck and can save mastery.
- Refreshing production preview keeps saved mastery.
- Reset Progress clears word mastery, completed decks, unlocked decks back to default, and saved statistics.
- Dungeon opens in production preview without QA Helper controls.
- Encounter Intro appears before battle.
- Start Battle starts an active timed question.
- Word Choice, Word Match, and Word Scramble remain playable if encountered.
- Pause and Abandon Run controls remain reachable.
- Active run state is not restored after refresh.
- Narrow/mobile viewport keeps important Home, Training, Dungeon, quiz, pause, and result controls reachable.

## Post-Deploy Mobile Smoke Test

- Open `https://word-quest-hazel.vercel.app/` on a phone.
- Home is usable and deck progression cards do not overflow horizontally.
- Training is usable and answer buttons are tappable.
- Dungeon starts and Encounter Intro shows a reachable Start Battle button.
- Word Choice is playable on mobile.
- Word Match is playable on mobile.
- Word Match selected-pair footer and Check Pair button are reachable.
- Word Scramble tile input is playable on mobile.
- Word Scramble letter tiles wrap cleanly and duplicate letters still work.
- New questions should bring the mobile viewport back near the active timer/quiz area.
- Result overlays keep action buttons reachable.
- Pause modal is usable and Resume is reachable.
- Abandon Run confirmation is usable and destructive actions are clear.
- Shop target modal is usable if reached.
- Run Complete / Run Failed summary is readable if reached.
- QA Helper, QA Correct, and QA Wrong do not appear on the production URL.
- Full boss clear may still require longer manual playtesting.

## Production Manual Click-Through

- Open `https://word-quest-hazel.vercel.app/` on desktop.
- Open `https://word-quest-hazel.vercel.app/` on mobile.
- Confirm Home loads.
- Confirm all 6 decks appear.
- Confirm locked decks show requirement copy.
- Enter Training.
- Answer one Training question correctly.
- Refresh page and confirm mastery persists.
- Enter Dungeon.
- Confirm Encounter Intro appears.
- Tap Start Battle.
- Confirm timer starts only after Start Battle.
- Play Word Choice if encountered.
- Play Word Match if encountered.
- Play Word Scramble tile input if encountered.
- Confirm Pause works.
- Confirm Abandon Run confirmation works.
- Confirm result overlay buttons are reachable.
- Confirm no QA Helper appears on production.
- Confirm no horizontal overflow on mobile.
- Confirm Reset Progress still requires confirmation.
- Full boss clear may still require longer manual playtesting.

## External Playtest Feedback

- Ask whether the player understood what to do on Home.
- Ask whether Training felt useful and safe.
- Ask whether Dungeon mini-games were clear.
- Ask whether mobile layout was playable.
- Ask whether Shop offers and temporary upgrades were understandable.
- Ask whether permanent progress versus temporary run progress was clear.
- Ask whether anything felt confusing, too hard, or too easy.
- Ask whether any screen felt broken or hard to use on their phone.
- Record device/browser details for mobile layout issues when possible.

## Known Deferred Areas

- Real Oxford 3000 import.
- Real Oxford 3000 vocabulary import and broader production content.
- Final art assets.
- Sound effects.
- Advanced animations.
- Richer element interactions.
- Broader balance testing.
- Public deployment confirmation.
