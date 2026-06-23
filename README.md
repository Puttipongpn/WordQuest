# WordQuest

WordQuest is a vocabulary learning roguelike deckbuilder prototype. Players review English vocabulary cards, practice in Training, then enter a dungeon where correct answers trigger card attacks, shields, elements, and current-run upgrades.

The project is a local-first prototype focused on proving the learning and roguelike loop before final art, backend services, or large vocabulary imports.

Live demo: https://word-quest-hazel.vercel.app/

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- LocalStorage for permanent Version 1 progress

## Install

```sh
npm install
```

## Development

```sh
npm run dev
```

Vite will print a local URL, usually `http://localhost:5173`.

## Build

```sh
npm run build
```

The production output is generated in `dist`.

## Preview Production Build

```sh
npm run preview
```

## Current Gameplay Loop

- Home: select an unlocked deck and review permanent progress.
- Deck Review: inspect vocabulary cards, mastery, effects, and learning guidance.
- Training: practice untimed vocabulary recall and increase permanent word mastery.
- Dungeon: fight timed vocabulary battles with Word Choice, Word Match, and Word Scramble.
- Shop: spend temporary run gold on current-run card upgrades.
- Events: choose temporary current-run rewards or costs.
- Boss: defeat the boss after dungeon progression to complete the selected deck.
- Run Complete / Run Failed: view run summaries and update permanent statistics only after a run ends.

## Share For Playtesting

Try the prototype: https://word-quest-hazel.vercel.app/

This is an early vocabulary roguelike demo. Please test Home, Deck Review,
Training, Dungeon battles, Shop if reached, mobile usability, and whether the
rules are clear. Progress is saved only in your current browser.

Suggested playtester questions:

- Did you understand what to do on Home?
- Was Training useful?
- Were the Dungeon mini-games clear?
- Was mobile layout playable?
- Was the Shop understandable?
- Did you understand what is permanent vs temporary?
- Was anything confusing or too hard?
- Did any screen feel broken on your phone?

## Save Behavior

Permanent progress is saved locally in the browser with LocalStorage:

- Word mastery
- Unlocked deck ids
- Completed deck ids
- Permanent statistics and best-run summaries

Temporary run state is not saved:

- HP
- Shield
- Gold
- Shop upgrades
- Duplicated cards
- Removed cards
- Card enchantments
- Monster, elite, event, and boss state
- Current-run deck
- Word Energy

Reset Progress clears saved permanent progress. Abandon Run only ends the current temporary run.

## QA Helper

The Dungeon QA Helper is development-only and gated by `import.meta.env.DEV`.

- It appears only while running the dev server.
- It should not appear in production builds.
- It mutates temporary run state for testing.
- It does not directly write permanent mastery, deck unlocks, completed decks, or saved statistics.

## Deployment

Recommended target: Vercel static deployment.

Current deployment status: live on Vercel at https://word-quest-hazel.vercel.app/

Suggested Vercel setup:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Use framework preset `Vite`.
4. Set build command to `npm run build`.
5. Set output directory to `dist`.
6. Deploy.

No Vite config changes are currently required for Vercel. GitHub Pages may require a base-path configuration, so it is not the default deploy target for this prototype.

Progress remains local to each browser through LocalStorage. The live demo does not use accounts, cloud saves, backend services, databases, authentication, or APIs.

## Latest Deploy Dry Run

Phase 54 verified the static deployment path locally:

- `npm run build` passed.
- `npm run preview` served the production build at `http://127.0.0.1:4173/`.
- Production HTML, JavaScript, and CSS assets returned HTTP 200.
- Built output did not contain QA Helper player-facing strings such as `QA Helper`, `QA Correct`, `QA Wrong`, `Force Run Failed`, `Force Run Complete`, or `Development only`.
- No real public deployment was performed.

Phase 56 verified the first live Vercel deployment with HTTP/static checks:

- Production URL: https://word-quest-hazel.vercel.app/
- Production HTML returned HTTP 200 from Vercel.
- Generated JavaScript and CSS assets returned HTTP 200.
- Post-deploy mobile polish was applied to Dungeon mini-games, result overlays, pause/abandon modals, and the Shop target modal without changing gameplay rules.

## Prototype Limitations / Roadmap

- No backend, database, authentication, or external API.
- Manual sample decks only.
- Oxford 3000 import is deferred.
- Final art assets are not included.
- Sound effects are not included.
- Advanced animations are intentionally limited.
- Element interactions are first-pass only.
- More balance testing is needed.
- Full boss clear takes time and still needs longer playtesting.
- Browser-click production smoke testing still needs manual tester access or an environment with browser automation.
- `npm audit` currently reports a high-severity `esbuild` advisory through the Vite toolchain; npm recommends a force fix with breaking dependency changes, so it has not been applied in this stabilization pass.

## Project Documents

- `GAME_DESIGN.md`: accepted gameplay design and rules.
- `PROJECT_STATUS.md`: current progress and completed phases.
- `HANDOFF.md`: detailed continuation context for another developer or AI agent.
- `DECISIONS.md`: accepted decisions.
- `QA_CHECKLIST.md`: manual prototype QA checklist.
- `UI_HIERARCHY_GUIDE.md`: UI declutter and hierarchy guide for future presentation work.
