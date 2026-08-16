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

## Training Density

- Training mode selection is compact and readable.
- Training mode cards show mode name, one-line purpose, and selected state.
- Training question count choices remain usable.
- Training active question appears quickly.
- Training answer controls are visually dominant.
- Training progress is visible but compact.
- Correct feedback is clear.
- Wrong feedback is clear.
- Mastery gain feedback is clear but not oversized.
- Training Complete summary is clear.
- Training Complete actions remain available.
- Training Complete detailed stats remain available in lower-priority details.
- All Training modes still work.
- Correct answers still increase mastery.
- Wrong answers do not decrease mastery.
- Mobile Training has no horizontal overflow.

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
- QA Helper expands with a single disclosure control, not nested expand controls.
- Encounter Intro appears before Monster, Elite, and Boss combat.
- Start Battle generates a timed question.
- Active battle keeps the quiz, timer, player HP/shield, enemy HP/attack, and answer controls visually dominant.
- Word Energy, Battle Log, Learning Info, Card Trigger details, and QA Helper do not dominate the screen while an unanswered battle question is active.
- Card Trigger details do not reveal the selected trigger card before the player answers.
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
- Offer cards are compact and readable.
- Offer cards show item name, cost, one-line effect, and affordability.
- Unaffordable offers show `Need +X gold`.
- Player does not need to open a modal to know an offer is unaffordable.
- Large not-enough-gold panels are not used.
- Upgrade Attack target preview shows ATK before/after.
- Add Shield target preview shows SHD before/after.
- Add Element target preview shows element before/after.
- Remove Card target preview shows deck size before/after and current-run-only removal copy.
- Duplicate Card target preview shows deck size before/after and copy-keeps-upgrades copy.
- Purchase modal shows current gold, cost, and gold after purchase.
- Purchase modal shows missing gold instead of negative gold when unaffordable.
- Purchase modal remains compact and usable.
- Target modal shows vocabulary cards as card-like choices.
- Target cards show compact before/after previews.
- Confirm is disabled when purchase is invalid.
- Successful Upgrade Attack shows a card upgrade ceremony.
- Successful Add Shield shows a card upgrade ceremony.
- Successful Add Element shows a card upgrade ceremony.
- Remove Card success shows compact card/result feedback.
- Duplicate Card success shows compact card/result feedback.
- Floating stat/gold feedback is visible.
- Success feedback does not rely on sound.
- Reduced-motion mode still shows readable static feedback.
- Insufficient gold shows needed/current/missing gold.
- Insufficient gold does not spend gold.
- Insufficient gold does not mutate cards or deck size.
- Reroll success clearly refreshes offers and spends gold.
- Reroll feedback shows gold spent and remaining gold.
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

## Run Result Density

- Run Complete outcome is immediately clear.
- Run Failed outcome is immediately clear.
- Run Result primary action is obvious.
- Reward or unlock message is clear.
- Failure encouragement and permanent-progress-safe copy are clear.
- Permanent kept vs temporary lost information remains available.
- Detailed stats do not dominate the result screen.
- Full run details remain available through disclosure.
- Run Complete still marks completed deck and unlocks the next deck as before.
- Run Failed still preserves permanent progress.
- Temporary run state still resets after run end.
- Mobile Run Result has no horizontal overflow.

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
- Dungeon side information remains available through compact disclosures without causing horizontal overflow.
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
- Dungeon result details become easier to inspect after an answer, timeout, or encounter result.
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

- Phase 71D.1.1 report exists at `normalized_assets_refined/REFINEMENT_REPORT.md`.
- Ten refined PNG candidates exist under `normalized_assets_refined/` with exact configured dimensions and alpha channels.
- Ten enlarged dark/light previews exist under `normalized_assets_refined/qa_previews/` with visible frame gaps.
- Refined post-preview estimate is recorded as 1 pass, 9 needs review, and 0 fail.
- Word Mage large white pockets and confirmed walk edge fragments are removed.
- Word Mage cream costume, book, staff, eye, and blue crystal details remain intact.
- Word Mage small neutral fringe remains needs review before pass approval.
- Slime/Bat/Goblin frame counts, silhouettes, attack trail, hover placement, and grounded placement remain intact.
- Confirmed Bat side fragments and detached Goblin frame-2 ground residue are removed.
- Goblin remaining short under-foot gray edge receives intent/cleanup review.
- Fire and Elite Crystal Slime detect-only outputs remain pixel-identical to fixed candidates.
- Gatekeeper refined reference remains pixel-identical to the fixed clean pass.
- Gold Coin localized cleanup removes five fringe pixels and preserves main highlights.
- Refinement report records source/output paths, dimensions, frames, strategy, removed pixels/percentage, residual estimate, status, notes, and next action.
- Broad global threshold cleanup is not used because it can damage intended bright details.
- `Asset/`, `normalized_assets/`, and `normalized_assets_fixed/` remain unchanged.
- At the Phase 71D.1.1 automated checkpoint, Phase 71D.3 remained blocked; later Human acceptance authorized the completed full run.
- Runtime integration remains prohibited and `src/assets/` remains absent/unused.
- Phase 71D.2 Human QA report exists at `normalized_assets_fixed/HUMAN_VISUAL_QA_REPORT.md`.
- Ten enlarged nearest-neighbor previews exist under `normalized_assets_fixed/qa_previews/`.
- Every preview shows separated frames on dark and light backgrounds without modifying the normalized candidate.
- All 10 corrected candidates were inspected for edge cleanliness, transparency quality, frame slicing, cadence, baseline, and glow readability.
- Phase 71D.2 totals are recorded: 1 pass, 3 needs review, and 6 fail.
- Word Mage idle and walk are failed for visible opaque white/light-gray silhouette contamination.
- Slime idle/attack, Bat idle, and Goblin idle are failed for edge residue, detached fragments, or pale ground remnants.
- Fire, Elite Crystal Slime idle, and Gold Coin remain needs review.
- Gatekeeper idle is the clean pass/reference candidate.
- All candidates contain transparent pixels, but surviving visible pixels use hard alpha with no partial-alpha glow falloff.
- Frame counts and cell isolation are correct across the subset; current failures are cleanup/source-quality issues rather than three-frame inference errors.
- Phase 71D.1 preliminary estimates are superseded by enlarged Phase 71D.2 Human QA.
- Phase 71D.3 was blocked by this Phase 71D.2 result and was later authorized only after the refined subset review.
- Phase 71D.1.1 source-aware cleanup is recommended before repeating subset QA.
- No normalized PNG, runtime code, React import, manifest, playback, or `src/assets/` file is changed by Human QA.
- Phase 71D.1 report exists at `normalized_assets_fixed/FIX_PASS_REPORT.md`.
- Phase 71D.1 processes only the required 10-file representative subset.
- Corrected subset output dimensions match configured 64x64 or 128x128 frame-cell expectations.
- Slime idle/attack and Bat idle use explicit four-frame overrides and no longer show the previous three-frame slicing.
- Player walk uses six frames; configured hit sheets use two frames; standard non-hit sheets use four frames.
- Probable checkerboard detection and cleanup metrics are recorded per attempted file.
- Conservative cleanup affects only light, low-saturation pixels connected to outer edges and stops when its safety gate is not met.
- Original `Asset/` files remain unchanged, and failed Phase 71C history remains under `normalized_assets/`.
- Preliminary subset visual estimate was recorded as 8 pass, 2 needs review, and 0 fail; Phase 71D.2 supersedes it.
- Player walk receives playback cadence/final-pose review before broader approval.
- Fire receives glow/particle review on light and dark battle backgrounds before broader approval.
- Full corrected normalization does not begin until the representative subset is explicitly approved.
- Unsafe cleanup requires manual transparent cleanup or source regeneration.
- `normalized_assets_fixed/` is not imported by React and is not treated as runtime-ready.
- Phase 71D visual QA report exists at `normalized_assets/VISUAL_QA_REPORT.md`.
- All 34 normalized PNG outputs were inspected.
- QA totals are recorded: 0 pass, 1 needs review, 33 fail.
- Every report row includes path, detected/expected dimensions, status, notes, and recommended action.
- Batch summaries exist for player, monsters, effects, UI/card/background, boss, events, and elite.
- Visible checkerboard/preview backgrounds are treated as failures even when the PNG has an alpha channel.
- Incorrect frame inference and cross-frame clipping are treated as failures.
- The provisional background remains needs review pending responsive/style QA.
- No event output exists for QA.
- Phase 71E runtime integration remains blocked.
- Corrected outputs must repeat visual QA and receive explicit human approval.
- Phase 71D edits no source/normalized images and changes no app/gameplay behavior.
- Phase 71C script exists at `scripts/normalize-assets.mjs`.
- `sharp` is development-only and is not imported by the React app.
- Dry-run mode analyzes inputs without writing outputs.
- Normal mode writes only under `normalized_assets/`.
- The normalization report records processed/skipped files, dimensions, inference, warnings, possible baked backgrounds, and manual-QA needs.
- First run processed 34 files and skipped three ambiguous incoming files.
- No event PNG files were available during the first run.
- Output dimensions match configured frame/canvas targets or explicitly preserved source dimensions.
- `Asset/` source hashes remain unchanged after normalization.
- `src/assets/` remains absent and unused.
- Opaque/possible baked backgrounds are flagged rather than removed aggressively.
- Bat/Goblin defeat aspect warnings and inferred three/six-frame sheets receive manual visual QA.
- Card frame and background preserved-dimension warnings receive UI/responsive QA.
- Normalized outputs are not treated as runtime-ready until visual QA passes.
- No asset imports, manifest, animation playback, gameplay changes, or runtime integration were added.
- Phase 71B is documented as script/manual-checklist planning only; no script or conversion was performed.
- Normalization input inventory includes Batches 1A through 1G.
- Player, monster, elite, boss, effect, UI, event, background, and card-frame output targets are documented.
- Future script behavior covers source reading, optional frame splitting, alpha bounds, shared bounds, aspect-safe resizing, target placement, ground/hover/effect alignment, sheet recombination, alpha PNG export, and source preservation.
- Manual normalization checklist confirms source/final names, frame count/size, alpha, frame bounds, approved-reference scale, placement, final canvas, prohibited text/runes, mobile readability, and unchanged gameplay meaning.
- Root `Asset/` is documented as temporary source/reference staging only and is never imported directly.
- Recommended future `Asset/` organization includes player, monster species, Crystal Slime, Gatekeeper, effects, UI, backgrounds, events, incoming, rejected, and notes.
- `src/assets/` remains empty or unused until a later explicit integration phase and receives only normalized runtime-ready exports.
- Phase 71B creates no folders, moves no files, renames no images, and creates no inventory or script.
- Completed Phase 71B.1 organization permissions and prohibitions are documented.
- Phase 71B.1 category/species folders exist under root `Asset/`.
- Canonical-pattern source files are moved into their documented source categories.
- Ambiguously named player-like candidates remain preserved in `Asset/incoming/`.
- `Asset/notes/SOURCE_ASSET_INVENTORY.md` records moved, renamed, ambiguous, rejected, and missing event-pattern files.
- No source file was overwritten, deleted, or renamed without clear canonical evidence.
- No image pixels, dimensions, crops, encoding, or alpha were modified.
- `src/assets/` was not created or modified.
- Runtime integration remains prohibited after source organization.
- Runtime integration remains gated on normalized exports, visual QA, safe fallbacks, non-crashing loading, reduced-motion consideration, mobile readability, and unchanged gameplay rules.
- Event Illustration Batch 1F generated files and review decisions are documented.
- Treasure Chest reveals no exact reward, amount, item, or outcome.
- Strange Altar remains mysterious but friendly, not cursed, demonic, horror-like, or ritualistic.
- Healing Shrine is marked for a restorative-identity polish to reduce overlap with Strange Altar.
- Event illustrations contain no characters/monsters, readable text/runes/labels, or outcome/value spoilers.
- Event illustrations are checked with event-panel overlays and mobile crop/readability before future integration.
- Elite Enemy Batch 1G generated files and review decisions are documented.
- Elite Crystal Slime identity, left-facing orientation, and action reads are documented.
- Elite hit scale/spacing and possible duplicate idle filename are marked for later normalization.
- Elite sheets require clean alpha, split/cropped frames, 64x64 cells where appropriate, centering, grounded baseline alignment, consistent action scale, stable filenames, and preserved originals.
- Encounter visual hierarchy is documented as presentation-only and does not alter encounter behavior.
- Batch 1F and 1G remain source/reference candidates and are not imported into runtime.
- Batch 1F and 1G assets do not change or imply changes to shop, event, boss, elite, combat, save, or encounter-progression rules.
- Batch 1F and 1G assets do not hide quiz UI, Thai text, controls, HP/shield UI, event choices, or battle feedback.
- Phase 71A is documented as planning-only; no normalization or runtime integration was performed.
- Source/reference and normalized runtime asset categories are defined.
- Recommended `asset_sources/{player,monsters,elites,effects,ui,backgrounds,bosses,events}` and `src/assets/{player,monsters,elites,effects,ui,backgrounds,bosses,events}` models are documented but not created.
- `src/assets` is reserved for normalized runtime-ready files in a later explicit phase.
- Target cells are documented: 64x64 for player, small monsters, and effects; 128x128 for bosses; 64x64 for UI icons.
- Expected sheet dimensions are documented: 256x64, 128x64, 384x64, 512x128, and 256x128 as applicable.
- Vocabulary card frame dimensions remain provisional pending UI testing.
- The 1536x864 dungeon background remains provisional pending style, crop, responsive-use, and readability planning.
- Normalization workflow includes alpha checks, preview/checkerboard cleanup, frame splitting, per-frame cropping, shared bounds, aspect-safe resizing, alignment, recombination, stable naming, source preservation, and visual QA.
- Player, grounded monster, Bat hover, effect, boss, and background baseline/placement rules are documented.
- Known candidate-specific normalization and polish notes are documented for every Phase 70 batch.
- Runtime integration requires approved planning, normalized files, visual QA, fallbacks, non-crashing load failure, reduced-motion consideration, readability review, and preserved gameplay safety.
- Assets do not obscure Thai text or make answer choices harder to scan.
- Missing assets retain safe placeholder fallbacks.
- No normalization scripts, asset manifest, runtime imports, animation playback, or dependencies were added in Phase 71A.
- `ASSET_PLAN.md` exists.
- `ASSET_PROMPTS.md` exists.
- Future cozy fantasy pixel-art direction is documented.
- Pixel Art Style Bible is documented.
- Shared prompt rules are documented.
- Negative prompt rules are documented.
- First asset batch plan is documented.
- Player prompts exist.
- Monster prompts exist.
- Boss prompts exist.
- Effect prompts exist.
- Background prompts exist.
- Vocabulary card prompts exist.
- UI icon prompts exist.
- Future Codex integration notes are documented.
- Future asset naming convention is documented.
- Future sprite specs are documented.
- Future animation frame recommendations are documented.
- Future player asset list is documented.
- Future monster asset list is documented.
- Future boss asset list is documented.
- Future effects asset list is documented.
- Player Batch 1A generated source/reference candidates are documented.
- Monster Batch 1B generated source/reference candidates are documented.
- Effects Batch 1C generated source/reference candidates are documented.
- Effects Batch 1C review decisions are documented.
- UI/Card/Background Batch 1D generated source/reference candidates are documented.
- Boss Batch 1E generated source/reference candidates are documented.
- Boss Batch 1E review decisions are documented.
- Gatekeeper boss visual identity is documented.
- Gatekeeper boss orientation is documented as facing left.
- Gatekeeper attack action reads toward the left.
- Gatekeeper idle reads as a stable guardian stance.
- Gatekeeper attack reads as a compact teal-gold guardian pulse or stone-hand strike without implying a new mechanic.
- Gatekeeper hit reads as a simple flinch reaction and is marked for scale normalization.
- Gatekeeper defeat reads as peaceful guardian deactivation or stone-gate settling, not violent death.
- Effects Batch 1C remains source/reference only, not runtime-normalized.
- Boss Batch 1E remains source/reference only, not runtime-normalized.
- Effects Batch 1C is not imported into runtime.
- Boss Batch 1E is not imported into runtime.
- Effects Batch 1C does not require an asset manifest.
- Boss Batch 1E does not require an asset manifest.
- Effects Batch 1C does not require animation playback.
- Boss Batch 1E does not require animation playback.
- Effect assets are presentation-only and do not imply rule changes.
- Boss assets are presentation-only and do not imply rule changes or new boss mechanics.
- Effect assets do not reveal hidden answers, target cards, correct answers, triggered cards, or result information before the player answers.
- Boss assets do not reveal hidden answers, target cards, correct answers, triggered cards, or result information before the player answers.
- Effect assets do not contain readable text, letters, numbers, stat labels, answer-like symbols, or readable runes.
- Boss assets do not contain readable text, letters, numbers, stat labels, answer-like symbols, or readable runes.
- Effect assets stay compact enough to avoid hiding quiz text, Thai text, answer choices, controls, HP/shield UI, or battle feedback.
- Boss assets remain readable on mobile and do not hide quiz UI or controls.
- Effect assets remain readable on mobile and are not visually noisy.
- Accepted effect sources still need alpha verification before runtime integration.
- Accepted boss sources still need alpha verification before runtime integration.
- Accepted effect sources still need frame splitting and bounds cropping before runtime integration.
- Accepted boss sources still need frame splitting and sprite bounds cropping before runtime integration.
- Accepted effect sources still need consistent 64x64 frame cells where appropriate before runtime integration.
- Accepted boss sources still need consistent 128x128 boss frame cells where appropriate before runtime integration.
- Accepted effect sources still need centering and vertical placement checks before runtime integration.
- Accepted boss sources still need centering, ground baseline alignment, and scale normalization across idle, attack, hit, and defeat before runtime integration.
- Earth effects preserve lower/grounded placement during normalization.
- Generated duplicate boss filenames are renamed during normalization if necessary.
- Original generated effect sources are preserved separately from normalized runtime-ready exports.
- Original generated boss sources are preserved separately from normalized runtime-ready exports.
- Future UI and background asset lists are documented.
- Current monster and boss names are mapped to future asset filenames.
- Future image-generation prompt templates are documented.
- No real image assets were added during documentation-only asset prep.
- No runtime asset imports were added during documentation-only asset prep.
- No gameplay behavior changed during documentation-only asset prep.
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

## Phase 71D.3 Full Refined Normalization QA

Automated run verification:

- [x] Human acceptance of the Phase 71D.1.1 refined subset was recorded before the full run.
- [x] `npm run normalize-assets:refined-full` completed.
- [x] 34 files were attempted, 34 files were output, and 0 files were skipped.
- [x] Output files were written only under `normalized_assets_refined_full/`.
- [x] `Asset/`, `normalized_assets/`, `normalized_assets_fixed/`, and `normalized_assets_refined/` were not overwritten.
- [x] Explicit frame counts and configured target dimensions were preserved.
- [x] Player idle is `256x64`; player walk and cast/attack are `384x64`.
- [x] Four-frame small-monster/elite/effect sheets are `256x64`; hit sheets are `128x64`.
- [x] Four-frame boss sheets are `512x128`; boss hit is `256x128`.
- [x] UI Gold Coin, Heart HP, and Shield icons are `64x64`.
- [x] Vocabulary card frame and dungeon background preserve source dimensions.
- [x] The accepted 10-file refined subset matches the full-run outputs byte-for-byte.
- [x] Broad global bright-pixel deletion was not used.
- [x] Ambiguous glow, highlight, clothing, page, crystal, particle, and sparkle pixels use protected or detect-only handling.
- [x] No event PNGs were present; the report records that no event output/preview was produced.
- [x] `FULL_REFINED_NORMALIZATION_REPORT.md` records outputs, dimensions, frames, strategies, warnings, Human QA, manual cleanup, and regeneration watchlists.

Preview verification:

- [x] `npm run asset-qa-previews:refined-full` completed.
- [x] 33 QA previews were generated under `normalized_assets_refined_full/qa_previews/`.
- [x] All player, monster, elite, boss, effect, and UI icon candidates have enlarged nearest-neighbor previews.
- [x] Sprite/icon previews contain dark and light rows with visible frame gaps.
- [x] One dungeon background preview was generated without modifying the normalized candidate.
- [x] Run a dedicated Human Visual QA pass across all 34 normalized candidates.
- [x] Review Word Mage cast/attack edge cleanliness, frame slicing, and six-frame cadence.
- [x] Review Bat and Goblin defeat cross-frame slicing; regenerate or manually re-layout if confirmed.
- [x] Review Goblin attack frame-edge action pixels.
- [x] Review every hit sheet for scale, spacing, baseline, and reaction readability.
- [x] Review Fire hard-alpha glow/particles and Wind contrast on dark and light backgrounds.
- [x] Review Elite Crystal Slime and Gatekeeper highlights/glow without deleting intentional bright pixels.
- [x] Review UI icons at native 64px and inspect card-frame transparency/text-safe insets.
- [ ] Review dungeon background responsive crop, style fit, quiz readability, and mobile composition.
- [ ] Add event overlay/mobile QA when event PNG sources become available.
- [x] Do not begin runtime integration planning until the full refined set passes Human Visual QA and receives explicit approval; Phase 71D.5 cleared the blocking findings.

Safety verification:

- [x] `src/assets/` remains absent/unused.
- [x] No React asset imports, `assetManifest`, animation playback, or runtime asset code were added.
- [x] No gameplay, save, combat, timer, mastery, deck unlock, Word Energy, shop, event, elite, boss, encounter progression, or deployment behavior changed.

## Phase 71D.3.1 Defeat Frame-Region Correction QA

- [x] Confirm Bat and Goblin defeat sources are `1536x1024` nonuniform pose canvases rather than equal-width logical sheets.
- [x] Confirm the old equal cuts at `384/768/1152` cross visible Bat/Goblin pixels.
- [x] Configure four explicit non-overlapping source regions for each affected file.
- [x] Validate region count, integer coordinates, positive widths, source bounds, and non-overlap.
- [x] Preserve original source files and existing source alpha.
- [x] Regenerate Bat defeat as `256x64` with four complete `64x64` frames.
- [x] Regenerate Goblin defeat as `256x64` with four complete `64x64` frames.
- [x] Confirm no corrected frame alpha bound touches a cell edge.
- [x] Regenerate dark/light nearest-neighbor previews with visible frame gaps.
- [x] Confirm Bat wings and Goblin ears/body are no longer split across neighboring frames.
- [ ] Confirm final cadence and particle ownership during the full-set Human Visual QA pass.
- [ ] Keep both files as normalized candidates until full-set Human Visual QA receives explicit approval.
- [x] Do not modify gameplay, runtime asset imports, animation playback, save behavior, progression, deployment, or `src/assets/`.

## Phase 71D.4 Full-Set Human Visual QA

- [x] Inspect all 34 normalized candidates under `normalized_assets_refined_full/`.
- [x] Inspect all 33 enlarged dark/light previews under `normalized_assets_refined_full/qa_previews/`.
- [x] Verify configured dimensions and frame counts for every sprite, effect, and UI icon.
- [x] Check transparency, checkerboard contamination, frame isolation, cross-frame slicing, scale, baseline, cadence, glow, contrast, text contamination, and mobile readability risk.
- [x] Inspect the preserved vocabulary card frame and dungeon background directly at source dimensions.
- [x] Record per-file status, issue type, notes, and recommended action in `FULL_HUMAN_VISUAL_QA_REPORT.md`.
- [x] Record totals of 18 pass, 14 needs review, and 2 fail.
- [x] Confirm corrected Bat and Goblin defeat sheets pass frame-isolation review.
- [x] Resolve Gatekeeper attack source-frame isolation with explicit regions; source regeneration was not required.
- [x] Resolve vocabulary card-frame transparency with safety-gated targeted cleanup.
- [ ] Apply the 11 listed localized edge/glow/contrast cleanup actions in Phase 71D.5.
- [ ] Revisit Elite Crystal Slime hit normalization/scale configuration.
- [x] Repeat focused Human QA for every Phase 71D.5 output.
- [ ] Defer dungeon-background responsive crop and quiz readability checks until runtime layout QA is explicitly authorized.
- [x] Keep Phase 71D.3 outputs as normalized candidates only.
- [x] Keep runtime integration prohibited and `src/assets/` absent/unused.
- [x] Confirm no gameplay, save, combat, progression, deployment, or runtime asset code changed.
- [x] Do not begin Phase 71E Runtime Integration Planning until the blocking failures are cleared and changed assets receive explicit Human approval.

## Phase 71D.5 Targeted Cleanup / Regeneration QA

- [x] Limit processing to Gatekeeper attack and the vocabulary card frame.
- [x] Preserve all files under `Asset/` and all earlier normalized output folders.
- [x] Measure Gatekeeper source foreground gaps before selecting nonuniform frame regions.
- [x] Configure Gatekeeper regions `0-625`, `626-1241`, `1242-1944`, and `1945-2507`.
- [x] Produce a `512x128` Gatekeeper attack sheet with four `128x128` frames.
- [x] Confirm body, key, attack arc, and particles remain with their intended pose.
- [x] Confirm no Gatekeeper frame alpha bound touches a cell edge.
- [x] Record thin neutral ground/shadow lines in frames 2 and 3 as non-blocking polish.
- [x] Confirm no alternate true-transparent card-frame source exists under `Asset/ui/`.
- [x] Apply safety-gated edge-connected cleanup only to the exterior neutral checkerboard.
- [x] Preserve card-frame dimensions at `1058x1487`.
- [x] Confirm the targeted card frame contains 187,660 genuine transparent pixels.
- [x] Confirm dark/light preview backgrounds show through around the decorative frame without visible checkerboard.
- [x] Generate targeted dark/light previews under `normalized_assets_refined_targeted/qa_previews/`.
- [x] Record 2 fixed and 0 still failing in `TARGETED_CLEANUP_REPORT.md`.
- [x] Keep Phase 71D.4 needs-review assets in a non-blocking polish backlog.
- [x] Keep every targeted output as a candidate only.
- [x] Keep runtime integration prohibited and `src/assets/` absent/unused.
- [x] Confirm no gameplay, save, combat, progression, deployment, or runtime asset code changed.
- [x] Permit Phase 71E Runtime Integration Planning only; require a later explicit phase for implementation.

## Phase 71E Runtime Integration Planning QA

- [x] Keep Phase 71E documentation-only and planning-only.
- [x] Create `RUNTIME_ASSET_INVENTORY.md`.
- [x] Inventory all 34 logical candidates with file, source path, category, use, frames, dimensions, readiness, and backlog notes.
- [x] Separate UI/card, icons, backgrounds, and empty event coverage clearly.
- [x] Use targeted Gatekeeper attack and card-frame paths instead of obsolete full-run candidates.
- [x] Create `RUNTIME_ASSET_STRUCTURE_PROPOSAL.md` without creating the proposed folders.
- [x] Define lowercase snake_case filenames and stable metadata ID conventions.
- [x] Define candidate copy provenance and source-precedence rules.
- [x] Define fallback-first ownership boundaries and a staged integration order.
- [x] Create `RUNTIME_INTEGRATION_MAPPING.md`.
- [x] Map current Slime, Bat, Goblin, Elite Slime, and Gatekeeper IDs without changing encounter data.
- [x] Record missing player actions, monsters, bosses, elite identities, and events as fallback coverage gaps.
- [x] Define explicit future frame, animation type, playback-purpose, baseline, facing, anchor, fallback, reduced-motion, and readiness metadata.
- [x] Require presentation triggers to occur only after authoritative gameplay resolution.
- [x] Require animation completion callbacks to remain independent from combat, saves, rewards, progression, purchases, and answer checking.
- [x] Carry all non-blocking visual issues into a separate polish backlog.
- [x] Keep `src/assets/` absent/unused.
- [x] Add no PNG copies, React imports, asset manifest, animation playback, or dependencies.
- [x] Change no gameplay, save, combat, timer, mastery, unlock, Word Energy, shop, event, elite, boss, encounter progression, or deployment behavior.
- [x] Recommend Phase 71F Controlled Runtime Integration only after a new explicit implementation request.

## Phase 71F.1 Controlled Runtime Asset Copy And Static Identity QA

- [x] Run the baseline production build before editing runtime files.
- [x] Create the proposed tracked runtime categories under `src/assets/`.
- [x] Copy all 34 planning-ready candidates and verify 34 source/destination SHA-256 matches.
- [x] Use the Phase 71D.5 targeted Gatekeeper attack and vocabulary card-frame files.
- [x] Use `normalized_assets_refined_full/` for the other 32 candidates.
- [x] Import no file from raw `Asset/` or prior normalization-history folders.
- [x] Keep the registry limited to Word Mage, Slime, Bat, Goblin, Elite Crystal Slime, and Gatekeeper idle sheets.
- [x] Render the first frame only; add no idle loop or one-shot animation playback.
- [x] Render static identities in both encounter-intro and active-battle stage presentation.
- [x] Preserve current emoji/CSS output for unmapped identities and image-load failures.
- [x] Keep fallback portrait dimensions stable after a forced image failure.
- [x] Verify Slime, Elite Slime, and Gatekeeper encounter-ID mappings.
- [x] Verify desktop and `390px` mobile layouts with no horizontal overflow or hidden quiz controls.
- [x] Keep reduced-motion output static without adding motion-specific runtime state.
- [x] Confirm the production bundle emits only the six imported idle sheets.
- [x] Keep copied action, effect, UI, icon, card-frame, and background candidates dormant.
- [x] Add no dependencies, asset manifest, action/effect playback, or animation-controlled gameplay callbacks.
- [x] Change no gameplay, save, combat, timer, mastery, unlock, Word Energy, shop, event, elite, boss, encounter progression, or deployment behavior.
- [x] Run the final production build successfully.

## Phase 71F.2 Controlled Battle Action Animation Foundation QA

- [x] Run the baseline production build before editing runtime files.
- [x] Add a reusable explicit-metadata `SpritesheetAnimation` component.
- [x] Import only Word Mage cast and the five approved enemy hit sheets.
- [x] Record asset ID, file, frames, dimensions, animation type, frame duration, loop behavior, reduced-motion frame, and fallback identity.
- [x] Trigger presentation only after an already-committed positive-damage success result.
- [x] Play enemy hit only when resolved encounter HP remains above zero.
- [x] Return one-shot presentation to idle without changing gameplay state.
- [x] Keep Next Mini-Game and Next Encounter available during playback.
- [x] Verify Word Choice, Word Match, and Word Scramble correct-answer paths.
- [x] Verify observed HP reduction matches displayed final damage in all three mini-games.
- [x] Verify wrong answers preserve existing player damage and play no cast/hit animation.
- [x] Verify a real timeout preserves existing result behavior and plays no cast/hit animation.
- [x] Verify defeating damage plays player cast, suppresses living-enemy hit, and keeps result actions immediate.
- [x] Verify normal motion advances frames and returns both actors to idle.
- [x] Verify reduced motion uses configured static representative frames.
- [x] Force both action images to fail and confirm idle fallback plus responsive controls.
- [x] Verify an unmapped Word Warden displays the existing emoji/CSS fallback.
- [x] Verify `390px` mobile has no horizontal overflow and battle controls remain readable.
- [x] Keep enemy attack, defeat, effects, shield block, upgrade spark, walk, UI icons, card frame, and background unimplemented.
- [x] Change no gameplay, save, combat, answer checking, timer, HP/shield/gold/mastery, Word Energy, shop, event, elite, boss, reward, unlock, progression, dependency, or deployment behavior.
- [x] Run the final production build successfully.

## Phase 71F.3 Controlled Enemy Attack Animation Slice QA

- [x] Run the baseline production build before editing runtime files.
- [x] Import only Slime, Bat, Goblin, Elite Crystal Slime, and Gatekeeper attack sheets.
- [x] Use the targeted Phase 71D.5 Gatekeeper attack runtime copy.
- [x] Add explicit frames, dimensions, cadence, animation type, reduced-motion frame, fallback identity, and idle return state.
- [x] Mark presentation eligibility only after the existing wrong-answer/timeout resolution path commits its result log.
- [x] Play no player cast or enemy hit during wrong-answer/timeout attack presentation.
- [x] Return one-shot enemy attack presentation to idle without changing game state.
- [x] Verify Word Choice wrong answer preserves 4 Slime damage exactly once.
- [x] Verify Word Match wrong answer preserves 4 Slime damage exactly once.
- [x] Verify Word Scramble wrong answer preserves 4 Slime damage exactly once.
- [x] Verify a real Word Match timeout preserves 5 Goblin damage exactly once.
- [x] Verify 5 shield absorbs all 5 Goblin damage with no HP loss or duplicate update.
- [x] Verify a real 1 HP wrong answer reaches Run Failed and Restart Run is immediately available during playback.
- [x] Verify Next Mini-Game remains available during normal attack and timeout playback.
- [x] Verify reduced motion shows configured static attack frame 2.
- [x] Force an attack image failure and confirm idle fallback, responsive controls, and no duplicate damage.
- [x] Verify Gatekeeper uses `boss_gatekeeper_attack` presentation.
- [x] Verify unmapped Shadow Reader keeps its emoji/CSS fallback and resolved damage.
- [x] Verify `390px` mobile has no horizontal overflow and readable battle/result UI.
- [x] Keep defeat, effects, shield block, upgrade spark, walk, player defend/hurt/victory, UI icons, card frame, and background unimplemented.
- [x] Change no gameplay, save, combat, answer checking, timer, HP/shield/gold/mastery, Word Energy, shop, event, elite, boss, reward, unlock, progression, dependency, or deployment behavior.
- [x] Run the final production build successfully.

## Phase 71F.4 Controlled Enemy Defeat Animation Slice QA

- [x] Run the baseline production build before editing runtime files.
- [x] Import only Slime, Bat, Goblin, Elite Crystal Slime, and Gatekeeper defeat sheets.
- [x] Add explicit frame count, dimensions, cadence, animation type, reduced-motion frame, fallback identity, and final-frame hold metadata.
- [x] Add defeat eligibility only inside existing authoritative HP-zero result branches.
- [x] Preserve Word Mage cast and suppress living-enemy hit on the same defeating result.
- [x] Keep Next Encounter and Run Complete actions available from the first defeat frame.
- [x] Verify Word Choice defeats Bat through the existing damage/result flow.
- [x] Verify Word Match defeats Goblin through the existing damage/result flow.
- [x] Verify Word Scramble defeats an unmapped normal Wolf and retains emoji fallback.
- [x] Verify Elite Crystal Slime defeat and existing gold/progress update exactly once.
- [x] Verify Gatekeeper defeat reaches Run Complete and exposes existing actions immediately.
- [x] Confirm normal-motion defeat advances frames and holds final frame 3.
- [x] Confirm reduced motion displays static defeat frame 3.
- [x] Confirm reward/progression LocalStorage remains stable after playback.
- [x] Verify living-enemy hit from Phase 71F.2 remains unchanged.
- [x] Verify wrong-answer and real-timeout enemy attack from Phase 71F.3 remain unchanged.
- [x] Force a defeat image failure and confirm loaded idle fallback, responsive actions, and no crash.
- [x] Verify `390px` mobile has no horizontal overflow and Next Encounter remains reachable.
- [x] Keep effects, shield block, upgrade spark, walk, player defend/hurt/victory, UI icons, card frame, and background unimplemented.
- [x] Change no gameplay, save, combat, answer checking, timer, HP/shield/gold/mastery, Word Energy, shop, event, elite, boss, reward, unlock, progression, dependency, or deployment behavior.
- [x] Run the final production build successfully.

## Phase 71F.5 Controlled Elemental Effect Animation Slice QA

- [x] Run the baseline production build before editing runtime files.
- [x] Import only Fire, Water, Wind, and Earth effect sheets.
- [x] Add explicit asset ID, file, element, frame count, dimensions, cadence, animation type, reduced-motion frame, target layer, fallback, return state, and auto-clear metadata.
- [x] Derive elemental presentation only from the existing successful result after the card effect has resolved.
- [x] Verify Fire appears only after a resolved Fire card effect.
- [x] Verify Water appears only after a resolved Water card effect.
- [x] Verify Wind appears only after a resolved Wind card effect.
- [x] Verify Earth appears only after a resolved Earth card effect.
- [x] Verify non-element correct answers do not show an elemental effect.
- [x] Verify wrong answers and real timeouts do not show an elemental effect.
- [x] Verify Word Mage cast and living hit or defeat presentation remain independent from the effect overlay.
- [x] Keep result actions available while the effect is playing and confirm playback auto-clears.
- [x] Confirm LocalStorage remains stable after effect playback completion.
- [x] Force an effect-image failure and confirm silent clear, responsive actions, and no crash.
- [x] Confirm reduced motion displays static frame 2 and then clears.
- [x] Verify `390px` mobile has no horizontal overflow, the effect remains inside the enemy portrait, and no button is obscured.
- [x] Keep shield block, upgrade spark, walk, player defend/hurt/victory, UI icons, card frame, and background unimplemented.
- [x] Change no gameplay, save, combat, answer checking, timer, HP/shield/gold/mastery, Word Energy, shop, event, elite, boss, reward, unlock, progression, dependency, or deployment behavior.
- [x] Run the final production build successfully.

## Phase 71F.6 Controlled Shield Block Effect Slice QA

- [x] Run the baseline production build before editing runtime files.
- [x] Import only `effect_shield_block_sheet.png`.
- [x] Add explicit asset ID, file, frame count, dimensions, cadence, animation type, reduced-motion frame, target layer, fallback, return state, and auto-clear metadata.
- [x] Derive shield presentation only from positive resolved `shieldGained` or `shieldAbsorbed` BattleLog data.
- [x] Verify a correct shield card shows shield feedback after shield gain resolves.
- [x] Verify a correct non-shield result does not show shield feedback.
- [x] Verify a wrong answer with shield absorption shows shield feedback after damage resolves.
- [x] Verify a wrong answer with zero shield does not show shield feedback.
- [x] Verify a real timeout with shield absorption shows shield feedback after damage resolves.
- [x] Verify shield and HP remain stable after playback completion.
- [x] Verify mapped Slime attack continues while shield absorption feedback plays.
- [x] Verify Water elemental and shield overlays can play together without conflict.
- [x] Keep Next Mini-Game/result actions available during shield playback and confirm auto-clear.
- [x] Force shield-effect image failure and confirm silent clear, responsive actions, and no crash.
- [x] Confirm reduced motion displays static frame 2 and then clears.
- [x] Verify `390px` mobile has no horizontal overflow, the effect remains inside the player portrait, and no button is obscured.
- [x] Keep upgrade spark, walk, player defend/hurt/victory, UI icons, card frame, and background unimplemented.
- [x] Change no gameplay, save, combat, answer checking, timer, HP/shield/gold/mastery, Word Energy, shop, event, elite, boss, reward, unlock, progression, dependency, or deployment behavior.
- [x] Run the final production build successfully.

## Phase 71F.7 Controlled Upgrade Spark Effect Slice QA

- [x] Run the baseline production build before editing runtime files.
- [x] Import only `effect_upgrade_spark_sheet.png`.
- [x] Add explicit asset ID, file, frame count, dimensions, cadence, animation type, reduced-motion frame, target layer, fallback, return state, and auto-clear metadata.
- [x] Trigger presentation only after the existing purchase callback returns success for Upgrade Attack, Add Shield, or Add Element.
- [x] Verify Upgrade Attack deducts gold and applies exactly one `+2 ATK` mutation before one spark plays.
- [x] Verify Add Shield deducts gold and applies exactly one `SHD +3` mutation before one spark plays.
- [x] Verify Add Element deducts gold and applies exactly one selected element mutation before one spark plays.
- [x] Verify insufficient gold leaves Confirm disabled and shows no spark.
- [x] Verify cancel and reroll show no spark and preserve their existing behavior.
- [x] Keep Remove Card and Duplicate Card intentionally unmapped in this phase.
- [x] Confirm playback auto-clears without blocking or closing the purchase ceremony.
- [x] Force upgrade-spark image failure and confirm silent clear, enabled Continue, and no crash.
- [x] Confirm reduced motion displays static frame 2 and then clears.
- [x] Verify `390px` mobile has no horizontal overflow and the fixed icon overlay does not overlap card text or Continue.
- [x] Keep walk, player defend/hurt/victory, UI icons, card frame, and background unimplemented.
- [x] Change no gameplay, save, combat, answer checking, timer, HP/shield/gold/mastery formulas, Word Energy, shop cost/value, event, elite, boss, reward, unlock, progression, dependency, or deployment behavior.
- [x] Run the final production build successfully.

## Phase 71F.8 Controlled Runtime UI Icon Slice QA

- [x] Run the baseline production build before editing runtime files.
- [x] Import only `ui_gold_coin.png`, `ui_heart_hp.png`, and `ui_shield.png`.
- [x] Add explicit static asset IDs, files, and `64x64` dimensions.
- [x] Add reusable decorative `StaticUiIcon` rendering with stable dimensions and load-failure fallback.
- [x] Keep all Gold, HP, Shield, Cost, affordability, and missing-gold text/values visible and authoritative.
- [x] Verify Dungeon encounter-intro HP remains `32 / 32` and readable.
- [x] Verify active Dungeon Gold, HP, and Shield values remain correct and readable.
- [x] Verify an existing wrong-answer flow still changes HP once and plays mapped enemy attack presentation.
- [x] Verify existing correct-answer cast and living-enemy hit presentation still works.
- [x] Verify Shop Gold, offer Cost, modal Gold/Cost/After, affordability, and missing-gold copy remain correct.
- [x] Verify insufficient-gold confirmation remains disabled and no spark starts.
- [x] Verify a successful mapped Shop purchase still plays the existing upgrade spark after the transaction.
- [x] Force Heart, Gold, and Shield image failures and confirm labels, values, actions, layout, and state remain usable without a crash.
- [x] Verify `390px` Dungeon and Shop have no horizontal overflow or hidden result/purchase controls.
- [x] Keep vocabulary card frame, dungeon background, walk, and player defend/hurt/victory unimplemented.
- [x] Change no gameplay, save, combat, answer checking, timer, HP/shield/gold/mastery, Word Energy, shop cost/value, event, elite, boss, reward, unlock, progression, dependency, or deployment behavior.
- [x] Run the final production build successfully.

## Phase 71F.9 Controlled Vocabulary Card Frame Slice QA

- [x] Run the baseline production build before editing runtime files.
- [x] Import only the targeted repaired `ui_vocabulary_card_frame.png` runtime copy.
- [x] Verify the runtime file SHA-256 matches the Phase 71D.5 targeted candidate.
- [x] Add explicit asset ID, `1058x1487` dimensions, and 9-slice metadata.
- [x] Add reusable pointer-free `DecorativeCardFrame` rendering with local load-failure fallback.
- [x] Frame only the Deck Review selected-card detail, Training prompt, and selected Shop target card.
- [x] Keep answer buttons, small Deck grid cards, unselected Shop cards, and modal controls unframed.
- [x] Verify Deck selection updates the framed detail while English/Thai/example/mastery/stats remain readable and selectable.
- [x] Verify Training question text remains readable and answer feedback/Next remain unchanged.
- [x] Verify Shop selection moves exactly one frame and keeps cost, preview, ATK, SHD, element, Cancel, and Confirm readable/reachable.
- [x] Force the frame image to fail and confirm the original selected-card UI and modal controls remain usable without a crash.
- [x] Verify prior Word Mage cast, enemy attack, Gold/HP/Shield icons, and Shop upgrade spark still work.
- [x] Verify `390px` Deck, Training, and Shop have no horizontal overflow or hidden selected-card/modal controls.
- [x] Keep dungeon background, walk, and player defend/hurt/victory unimplemented.
- [x] Change no gameplay, card data/effects, save, combat, answer checking, timer, HP/shield/gold/mastery, Word Energy, Shop cost/value/purchase logic, event, elite, boss, reward, unlock, progression, dependency, or deployment behavior.
- [x] Run the final production build successfully.

## Phase 71F.10 Controlled Dungeon Background Slice QA

- [x] Run the baseline production build before editing runtime files.
- [x] Import only `background_dungeon_battle_01.png` from the verified runtime copy.
- [x] Add explicit asset ID, `1672x941` dimensions, and centered object-position metadata.
- [x] Add reusable pointer-free `DecorativeBattleBackground` rendering with conservative contrast overlay and local load-failure fallback.
- [x] Apply the image only behind Dungeon encounter intro and active non-event battle stages.
- [x] Keep Training, Deck Review, Shop, Run Result, events, and the global app background unchanged.
- [x] Verify encounter intro identity, HP, attack, Start Battle, and QA Helper remain readable/reachable.
- [x] Verify active Word Choice question and all answer buttons remain dominant and readable.
- [x] Verify Word Match choices remain readable and no correctness hint is introduced before resolution.
- [x] Verify Word Scramble tiles/input/action controls remain readable and reachable.
- [x] Verify timer, HP, shield, gold, enemy HP, battle log, and result actions remain readable and authoritative.
- [x] Verify prior battle animations/overlays, Shop spark, UI icons, and vocabulary card frame remain unchanged.
- [x] Force background image failure and confirm the original stage styling, status, and actions remain usable without a crash.
- [x] Verify reduced motion keeps the background static without a loading transition.
- [x] Verify `390px` Dungeon has no horizontal overflow or hidden answer controls.
- [x] Keep player walk and player defend/hurt/victory unimplemented.
- [x] Change no gameplay, save, combat, answer checking, timer, HP/shield/gold/mastery, Word Energy, Shop, event, elite, boss, reward, unlock, progression, dependency, or deployment behavior.
- [x] Run the final production build successfully.

## Phase 71G Visual Regression And Playability QA Pass

- [x] Confirm Phase 71F.10 status from `PROJECT_STATUS.md` and `HANDOFF.md` before editing.
- [x] Run the baseline production build successfully.
- [x] Test Home, Deck Review, Training, Dungeon, Shop, and Run Result on desktop.
- [x] Verify English, Thai meanings, examples, answers, timer, HP, shield, gold, enemy status, logs, costs, modal buttons, and result actions remain readable.
- [x] Test Word Choice, Word Match, and Word Scramble correct and wrong branches.
- [x] Test a real timeout, shield absorption, mastery bonus damage, Word Energy use, monster defeat, elite reward, boss completion, and run failure.
- [x] Test a mapped Shop purchase, upgrade spark, 5-gold reroll, affordability UI, modal actions, and return to Dungeon.
- [x] Observe normal-motion Word Mage cast, enemy hit/attack/defeat, all four elemental overlays, shield overlay, and Shop spark.
- [x] Target Elite Crystal Slime and Gatekeeper idle/attack/hit/defeat mappings through existing QA flows.
- [x] Confirm an unmapped boss keeps emoji/CSS fallback.
- [x] Force card-frame, Dungeon-background, Gold/HP/Shield-icon, actor/action, and effect failures; confirm readable fallback and no crash.
- [x] Verify reduced motion uses configured static cast/hit frames and does not gate actions.
- [x] Test Home, Deck Review, Training, Dungeon, Shop modal, Run Failed, and Run Result at `390px` with no horizontal overflow or hidden required actions.
- [x] Confirm clean-profile Training mastery persists from 0 to 1 after reload.
- [x] Confirm battle/Shop presentation and asset failures do not write player progress.
- [x] Confirm no run-state LocalStorage key exists and no Continue Run appears after reload.
- [x] Record zero blocking visual, gameplay, fallback, or persistence regressions and apply no unnecessary runtime fix.
- [x] Keep player walk and player defend/hurt/victory unimplemented.
- [x] Change no gameplay, save schema, combat, answer checking, timer, HP/shield/gold/mastery, Word Energy, Shop, event, elite, boss, reward, unlock, progression, asset, dependency, or deployment behavior.
- [x] Create `VISUAL_REGRESSION_QA_REPORT.md` and run the final production build successfully.
