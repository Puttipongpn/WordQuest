# UI_HIERARCHY_GUIDE.md

This guide records the Phase 64A UX declutter strategy for WordQuest.

It exists to keep future UI implementation phases focused. Phase 64A is planning and documentation only. It does not redesign screens, change gameplay, add assets, change save rules, or add dependencies.

## Core Problem

Recent game designer feedback identified a major UI hierarchy issue:

- The game shows too much information at once.
- Several screens feel like a debug dashboard with a fantasy skin.
- Headers, badges, chips, stat cards, helper text, panels, and nested cards compete for attention.
- Important player actions can feel visually equal to secondary or tertiary information.
- The UI needs stronger hierarchy, less visual noise, clearer primary actions, and better progressive disclosure.

The guiding question for every screen is:

**What does the player need to decide right now?**

If a screen presents more than 3 to 4 competing decisions, it should be simplified. The primary action should be obvious. Secondary information should support that action without competing with it. Tertiary information should usually be collapsed, moved lower, or placed in a detail panel, modal, accordion, or result screen.

## UI Hierarchy Principles

- Start every screen by identifying one primary player decision.
- Keep the main action and critical state visible without forcing the player to scan every panel.
- Show secondary information only when it helps the current decision.
- Move explanations, records, rules, and detailed stats into progressive disclosure.
- Prefer one strong focal panel over many equally loud cards.
- Avoid repeating the same helper copy, badges, and progress bars in every item of a list.
- Repeated cards should be scan-first, not mini dashboards.
- Detail panels and modals can carry full information after the player chooses an item.
- Danger actions should be clear but should not visually dominate normal play screens unless the user is in a confirmation flow.
- Mobile layouts should preserve tappable controls, avoid horizontal overflow, and avoid excessive fixed-height panels.

## Page-By-Page Decision Map

### Home

Primary purpose: choose what to do now.

Primary decisions:

- Continue Run if an active run exists.
- Start Adventure.
- Train.
- Review Deck.
- Select Deck.

Secondary information:

- Compact selected deck progress.
- Compact next unlock target.

Tertiary information:

- Best run records.
- How to Play.
- Local save explanation.
- Danger Zone / Reset Progress.

Future direction:

- Home should act like a hub, not a full dashboard.
- It should surface the next best action and keep records/rules lower or collapsed.

### Deck Review

Primary purpose: scan vocabulary and inspect one selected word.

Primary decision:

- Which word should the player inspect or practice next?

Scan grid should show:

- Word.
- Thai meaning.
- Part of speech or difficulty.
- Mastery dots or compact mastery state.
- Small effect icon only if relevant.

Detail panel should hold:

- Example sentence.
- Base attack.
- Full effects.
- Mastery bonus.
- Learning guidance.
- Longer copy.

Avoid:

- Repeated progress bars on every grid card.
- "No Effect" badges on every card.
- Full stats on every card.
- Long helper text inside repeated cards.

Phase 66 implementation note:

- Deck Review uses compact scan cards by default.
- The grid keeps word, Thai meaning, part of speech or difficulty, compact mastery, selected state, ATK, and effects only when present.
- The selected-card detail panel carries example sentence, full effects, base attack, mastery value, mastery bonus, battle role guidance, and learning guidance.

### Training

Primary purpose: answer the current learning question.

Primary decision:

- Which answer is correct?

Secondary information:

- Mastery gain.
- Correct answer reveal.

Tertiary information:

- Session stats.
- Training mode notes.
- Longer guidance.

Future direction:

- The current question, answer choices, and feedback should dominate.
- Stats and guidance should not compete with answer choices.

### Dungeon

Primary purpose: answer the current battle question.

Primary decision:

- Which answer or pair is correct before the timer ends?

Secondary information:

- Player HP and shield.
- Enemy HP and attack.
- Timer.

Tertiary information:

- Battle log.
- Learning info.
- Card trigger details.
- Full Word Energy summary.

During active answering, show only:

- Player HP/shield.
- Enemy HP/attack.
- Timer.
- Question.
- Answer controls.

After resolving an answer, show:

- Compact result overlay.
- Damage, shield, gold, mastery, and element changes.
- Correct answer.
- Next action.

Preserve:

- No answer leaks before answer.
- Quiz-first mobile layout.
- Result overlay actions remain reachable.

### Shop

Primary purpose: choose an upgrade.

Primary decisions:

- Which offer is worth buying?
- Which target card should receive the upgrade after choosing an offer?

Secondary information:

- Current gold.
- Item cost.
- One-line effect.
- Disabled reason or needed gold.

Tertiary information:

- Full current-run-only explanation.
- Long shop rules.
- Detailed target previews.
- Before/after values.

Future direction:

- Offer cards should be compact and readable.
- The player should not need to inspect every card just to learn they cannot afford an item.
- If gold is insufficient, show "Need X more gold."
- Avoid labels like "After Trade -X" because they look like negative gold is allowed.

### Run Result

Primary purpose: understand the result and choose the next action.

Primary decisions:

- Restart.
- Return Home.
- Review Deck.
- Train.

Secondary information:

- Run outcome.
- Selected deck.
- Reward/unlock message.
- Compact stats summary.

Tertiary information:

- Detailed run records.
- Full stat grids.
- Long explanations.

## Color Usage Rules

Use a simpler color hierarchy:

1. Primary action: gold / orange
   - Use only for main action buttons and the one most important action.

2. Safe / positive: green
   - Use for success, unlocked, mastery, healing, and positive rewards.

3. Danger / error: red
   - Use for HP low, wrong answers, abandon, reset, blocked purchases, and destructive confirmations.

4. Neutral info: muted brown / grey / parchment
   - Use for normal information and non-critical states.

Rules:

- One screen should have no more than 1 to 2 visually dominant colors.
- Avoid rainbow badge sets.
- Reduce saturated badge backgrounds.
- Prefer subtle border, icon, or text treatment over loud colored pills.
- Do not make every state chip visually heavy.
- Reserve high contrast for active decisions, critical warnings, and results.

## Badge And Chip Rules

Badges and chips are allowed when the information affects immediate player decision or clarifies meaningful risk.

Allowed examples:

- Locked.
- Selected.
- Completed.
- Need +X gold.
- Low HP.
- Correct / Wrong.
- Current-run warning in Shop.
- Card stats inside battle choices.

Move to help text, detail panels, or remove if repeated:

- Vocabulary Cards.
- Deckbuilder Run.
- Training Untimed.
- Dungeon Timed.
- Saved Locally.
- No Effect on every card.
- Current-run on every shop item.
- Eligible count on every shop item.
- Repeated helper badges.

Rule:

Use chips sparingly. A chip should either change player action or clarify a risk.

## Card Density Rules

### Level 1: Main Panel

Use for major screen areas.

Examples:

- Selected deck summary.
- Battle arena.
- Shop area.
- Run result summary.

Allowed styling:

- Stronger border.
- Stronger shadow.
- More spacious padding.

### Level 2: Sub Card

Use for repeated items or secondary sections.

Examples:

- Deck item.
- Word card.
- Shop offer.
- Training answer option.

Allowed styling:

- Light border.
- Minimal shadow.
- Compact padding.
- Short labels only.

### Level 3: Inline Chip

Use for tiny state markers.

Examples:

- Locked.
- ATK.
- Shield.
- Need +Gold.

Allowed styling:

- No heavy shadow.
- No strong gradient.
- No large padding.

Rules:

- Do not use heavy border, shadow, gradient, and colored badges on every nested element.
- Avoid repeating progress bars on many cards at once.
- Avoid long helper text inside repeated cards.
- Put full details in a detail panel, modal, accordion, or result screen.

## Header Density Rules

Current issue:

- The header can take too much vertical space.
- Several screens show both large brand/title treatment and large page title treatment.

Target:

- Compact app bar.
- Desktop height target around 72 to 88px where practical.
- Keep logo / WordQuest readable.
- Move long page titles into screen content.
- Keep sound/settings compact.
- Avoid showing both large brand title and large page title in the global header on every screen.

Do not implement this until a future implementation phase explicitly requests it.

## Progressive Disclosure Rules

Always visible:

- Primary action.
- Current screen task.
- Critical state needed to act.

Collapsible or secondary:

- How to Play.
- Best Run Records.
- Local save explanation.
- Danger Zone.
- Long shop rules.
- Battle logs.
- Learning info.
- Card trigger details.
- Full Word Energy summary.

Rule:

Information should be visible when useful, not permanently visible just because it exists.

## Scan View Vs Detail View

Scan view:

- List, grid, or repeated card surface.
- Shows only what is needed to choose an item.
- Low density.
- Short labels.

Detail view:

- Selected item panel, modal, accordion, or result screen.
- Shows full stats, descriptions, examples, effects, and explanations.

Apply this split to:

- Deck selector.
- Deck Review card grid.
- Shop offers.
- Target card selection.
- Run records.
- Battle details.

## Future Home Declutter Plan

Home should become:

1. Current Deck Panel
   - Selected deck name.
   - Mastery percent.
   - Word count.
   - Next recommendation.
   - Primary action buttons.

2. Compact Progress Strip
   - Starter -> Food -> Travel -> Nature -> Daily Life -> Emotion.

3. Compact Best Run Summary
   - Best monsters.
   - Best accuracy.
   - Completed decks / runs.

Collapse or move:

- Full local save explanation.
- Full How to Play.
- Full deck cards.
- Full best run grid.
- Danger Zone.

This should become a future implementation phase, not Phase 64A.

Phase 64B implemented the first Home declutter pass:

- Home now uses a compact selected-deck hub.
- Continue Run / Start Adventure is the primary action.
- Train and Review Deck are secondary actions.
- Deck selection uses compact scan cards.
- Records, How to Play, local save explanation, and Reset Progress are lower-priority collapsible sections.

Phase 65 implemented the first global density pass:

- Header and navigation are more compact.
- Shared badges, cards, stat cards, progress bars, and buttons use calmer default visual tokens.
- Repeated cards and secondary states should inherit lighter shared primitives unless a screen has a specific primary decision that needs stronger treatment.
- Future screen-specific declutter phases should avoid reintroducing heavy badge clusters, oversized repeated cards, or dense stat-card grids.

## Future Deck Review Declutter Plan

Grid cards should show only:

- Word.
- Thai meaning.
- Part of speech / difficulty.
- Mastery dots.
- Small effect icon if relevant.

Move full info to the detail panel:

- Example sentence.
- Base attack.
- Full effects.
- Mastery bonus.
- Learning guidance.
- Long copy.

Remove from repeated cards:

- Repeated progress bars.
- Repeated warning/helper text.
- "No Effect" badge.
- Full stats on every card.

## Future Dungeon Declutter Plan

During answering, show only:

- Player HP/shield.
- Enemy HP/attack.
- Timer.
- Question.
- Answer choices.

Hide or collapse during active answering:

- Battle log.
- Learning info.
- Card trigger details.
- Full Word Energy summary.

After resolving an answer, show:

- Compact result overlay.
- Damage/shield/gold changes.
- Correct answer.
- Next action.

Keep:

- No answer leaks before answer.
- Quiz-first mobile layout.
- Result overlay actions reachable.

## Future Shop Declutter Plan

Offer cards should show only:

- Icon.
- Item name.
- Cost.
- One-line effect.
- Disabled reason if any.
- One primary action.

Move to modal/detail:

- Full explanation.
- Target previews.
- Before/after values.
- Current-run-only full copy.

Affordability rules:

- If not enough gold, show "Need X more gold."
- Avoid "After Trade -X" because it looks like negative gold is allowed.
- Do not force the player through full target selection just to discover they cannot buy, unless they explicitly inspect.

Phase 67 implementation note:

- Shop offer cards use compact scan mode by default.
- Offer cards keep icon, name, cost, one-line effect, affordability, not-eligible state, and one primary Inspect action.
- Target previews, before/after values, and current-run-only details live in the modal or receipt.
- Purchase and reroll receipts appear near the top of Shop so players can see what changed without hunting below the offer grid.
- Placeholder upgrade feedback uses CSS/emoji only and remains understandable without motion or sound.

Phase 67.1 implementation note:

- Shop target selection presents up to four vocabulary cards as card-like choices.
- Successful purchases use a compact card upgrade ceremony instead of a large dashboard-style receipt.
- Ceremony feedback emphasizes the affected card, before/after change, floating upgrade text, and gold spent.
- Insufficient-gold feedback should stay compact through chips, disabled actions, and short inline copy.

## Typography Rules

Suggested hierarchy:

- Page title: large / bold.
- Section title: medium / bold.
- Card title: medium.
- Label: small / uppercase / muted.
- Body: normal weight.
- Helper text: small / muted.
- Button: bold only where needed.

Avoid making every label bold and visually loud.

## Future Phase Roadmap

Suggested order:

- Phase 64A: UX Declutter Strategy + UI Hierarchy Guide.
- Phase 64B: Home Hub Simplification + Compact Deck Selector.
- Phase 65: Header + Global Density / Visual Token Pass.
- Phase 66: Deck Review Compact Scan Mode.
- Phase 67: Shop Compact Offers + Purchase Feedback Visibility Hotfix.
- Phase 68: Dungeon Side Panel Declutter.
- Phase 69: Training / Run Result Density Pass.
- Phase 70: Resume asset generation / pixel art prompt pack.

The exact numbering can be adjusted if project priorities change.

## QA Checklist Strategy

Future UI declutter QA should check:

- Each screen has one clear primary action.
- Secondary information does not compete with the primary action.
- Home does not require excessive scrolling before play actions.
- Deck selector remains compact and scalable.
- Deck Review grid supports fast scanning.
- Shop offers are readable without long repeated text.
- Dungeon active answering keeps quiz, HP, enemy HP, and timer as the focus.
- Battle details are available but not always visually dominant.
- Danger actions are not visually dominant unless needed.
- Mobile screens avoid horizontal overflow and excessive fixed-height panels.

## Preserved Rules

Phase 64A does not change:

- Selected deck behavior.
- Deck unlock behavior.
- Training mastery rules.
- Dungeon combat rules.
- Timer rules.
- Shop item effects.
- Shop economy values.
- Event effects.
- Boss effects.
- Word Energy rules.
- Run Continue behavior.
- LocalStorage permanent progress only.
- Active run not persisted to LocalStorage.
- Deployment setup.
- Backend scope.
- Final art asset deferral.
