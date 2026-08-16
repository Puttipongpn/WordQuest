# Phase 71H Release Candidate And Deployment Verification Report

Date: 2026-08-16

## Result

**Release candidate ready pending source-control sync and post-deploy verification.** The local production build and built-app smoke flow passed with no runtime, TypeScript, gameplay, persistence, fallback, reduced-motion, or mobile blocker. The existing Vercel deployment is reachable, but it serves different generated bundle hashes from this local release candidate. `origin/main` also remains at the earlier Phase 63 snapshot, so this RC has not yet been deployed.

## Build

- Command: `npm run build`
- Result: pass
- Toolchain result: TypeScript project build and Vite production build completed without errors.
- Modules transformed: 94
- Main local output: `assets/index-C9Sq5LlG.js` and `assets/index-_vk3ZSMv.css`
- New dependencies required: none

## Production Preview

- Command: existing Vite preview support, equivalent to `npm run preview -- --host 127.0.0.1 --port 4174`
- Preview URL: `http://127.0.0.1:4174/`
- HTML, generated JavaScript, and generated CSS each returned HTTP 200.
- Smoke testing exercised the built `dist/` application, not Vite development mode.
- Production `dist/` contained none of the six checked development-only strings: `QA Helper`, `QA Correct`, `QA Wrong`, `Force Run Failed`, `Force Run Complete`, or `Development only`.
- No console error was captured during the core smoke flow.

## Screens Smoke-Tested

- Home loaded the selected Starter Deck and primary actions.
- Deck Review loaded English/Thai learning content.
- Training resolved one deliberately wrong answer without writing progress, then one correct answer that saved mastery.
- Shop loaded through the existing main navigation with Gold and offer content intact.
- Run Result loaded through the existing main navigation with its Dungeon action available.
- Dungeon loaded encounter intro, started a deterministic Word Choice battle, resolved one correct and one wrong answer, and kept Next Mini-Game immediately available.

Phase 71G remains the broader regression basis for Word Match, Word Scramble, timeout, Shop purchase/reroll, elite, boss, run failure/completion, every integrated presentation effect, and full desktop/mobile playability.

## 390px Mobile Result

Home, Deck Review, Training, Shop, Run Result, and active Dungeon each reported `scrollWidth === clientWidth === 390`. The active Dungeon result action remained reachable after a wrong answer. No horizontal overflow or asset-caused hidden control was found.

QA evidence:

- `qa_artifacts/phase71h/home-desktop.png`
- `qa_artifacts/phase71h/dungeon-mobile.png`
- `qa_artifacts/phase71h/smoke-results.json`

## Runtime Asset Status

The Phase 71F.1 through Phase 71F.10 runtime set is unchanged: 34 approved candidates are copied under `src/assets/`, 33 are wired in controlled presentation roles, and the copied player walk sheet remains dormant. Player defend, hurt, and victory remain unimplemented. Card-frame and Dungeon-background usage did not expand. No event illustration candidate is present or integrated.

## Fallback And Reduced Motion

- A forced Dungeon background image error moved the component from image state to fallback state without disabling Next Mini-Game or crashing.
- Reduced-motion smoke testing held the Word Mage cast on configured static frame 3.
- Phase 71G remains the full fallback basis for actors, actions, effects, card frame, UI icons, background, unmapped identities, and reduced-motion hit behavior.

## Persistence

- Fresh-profile Training wrong answer left permanent progress unchanged.
- Training correct answer saved one mastery increment in `wordquest.playerProgress`.
- Dungeon correct/wrong presentation left that saved value byte-for-byte unchanged.
- The only LocalStorage key after the smoke flow was `wordquest.playerProgress`.
- No key containing `run` was present, so temporary run state remained memory-only.

## Live Deployment Check

- Existing demo: `https://word-quest-hazel.vercel.app/`
- Live HTML, JavaScript, and CSS returned HTTP 200 on 2026-08-16.
- Live generated assets were `assets/index-CSez_pnb.js` and `assets/index-C6s1gvmp.css`.
- Those hashes differ from the local RC output, so the live site is healthy but is not verified as this Phase 71H snapshot.
- GitHub remote `origin/main` is documented and present, but its locally known tip is `1acbf45` (Phase 63), not the current RC work on `redesign`.

## Known Non-Blocking Polish Backlog

- Localized sprite and UI-icon edge fringe.
- Elite Crystal Slime hit scale and detached attack segment review.
- Gatekeeper small shadow/dust contrast cleanup.
- Fire hard-alpha glow and Wind light-background contrast polish.
- Dungeon background pixel-art style consistency review.
- Broader vocabulary-card-frame use remains unapproved.
- Player walk and player defend/hurt/victory remain dormant or unimplemented.

## Deployment Readiness

Application readiness: **pass**.

Deployment state: **pending**. There is no code/runtime blocker, but the current RC must be committed and intentionally synchronized to the approved deployment branch before Vercel can represent this snapshot. Deployment configuration was not changed in Phase 71H.

## Recommendation

Proceed to **Phase 71I - Controlled Release Candidate Sync, Deployment, And Post-Deploy Verification** only after explicit authorization. That phase should commit/sync the intended RC, preserve the existing Vite/Vercel setup, wait for deployment, compare deployed asset hashes, and repeat a short live smoke check. Do not expand runtime presentation scope while performing the release.
