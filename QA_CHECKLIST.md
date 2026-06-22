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
- Reset Progress requires confirmation.
- Reset Progress clears word mastery, unlocked decks back to default, completed decks, and permanent statistics.
- Reset Progress returns deck access to Starter Deck only.

## Responsive Smoke Test

- Home is usable on desktop and narrow/mobile viewport.
- Deck Review is usable on desktop and narrow/mobile viewport.
- Training is usable on desktop and narrow/mobile viewport.
- Dungeon active battle keeps player HP, enemy HP, timer, quiz, and answer controls reachable.
- Shop modal is usable on desktop and narrow/mobile viewport.
- Run Complete and Run Failed summaries are readable on desktop and narrow/mobile viewport.

## Production Readiness

- `npm install` completes.
- `npm audit` is reviewed before public deployment.
- `npm run build` completes.
- `npm run preview` serves the production build.
- Production build opens on Home.
- Production build does not expose QA Helper UI.
- Searching `dist` for `QA Helper`, `Development only`, `QA Correct`, `QA Wrong`, and `Force Run Failed` returns no matches.

## Known Deferred Areas

- Real Oxford 3000 import.
- Real Oxford 3000 vocabulary import and broader production content.
- Final art assets.
- Sound effects.
- Advanced animations.
- Richer element interactions.
- Broader balance testing.
- Public deployment confirmation.
