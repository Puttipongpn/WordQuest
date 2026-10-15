# Game UI Redesign Plan

Date: 2026-10-13
Planning milestone: Phase 72A - Game-First UI Direction And Work Planning
Status: Phase 72B prototype implemented (2026-10-14), ready for owner review. Phase 72C onward has not started.

## Start Here

The owner reports that WordQuest still feels like a website, with too many buttons, detail bands, and status panels. The requested direction is fewer competing controls, more visible characters, and stronger feedback during vocabulary-powered combat.

This is direct owner feedback, not a claim of completed external playtesting. Phase 71J's technical smoke pass remains historical evidence; passing that check did not establish that the game feels engaging. Phase 71K evidence review was previously recommended but is not recorded as completed. This owner-directed workstream takes priority, while its feedback method remains useful.

Read these documents in order:

1. [PROJECT_STATUS.md](PROJECT_STATUS.md) and [HANDOFF.md](HANDOFF.md): current checkpoint.
2. This plan: scope, work order, delivery gates, and implementation ownership.
3. [GAME_UI_SCREEN_SPEC.md](GAME_UI_SCREEN_SPEC.md): target screens, information placement, and motion contract.
4. [GAME_UI_QA_PLAN.md](GAME_UI_QA_PLAN.md): baseline, test matrix, and evidence required to accept changes.
5. [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), and [RUNTIME_INTEGRATION_MAPPING.md](RUNTIME_INTEGRATION_MAPPING.md): protected behavior and existing asset wiring.

## Outcome

Players should see who they are fighting, what they need to answer, and what their answer did. Characters occupy the battle scene; essential values support the decision; detailed explanations remain available without competing with play.

The first implementation is one Dungeon presentation slice. Do not begin a simultaneous redesign of all six screens. The existing [UI_HIERARCHY_GUIDE.md](UI_HIERARCHY_GUIDE.md) remains the maintained hierarchy reference; the screen spec extends it instead of creating a competing design system.

## Scope And Invariants

Allowed in later implementation phases: presentation composition, spacing, contrast, responsive layout, contextual access to existing information, and reuse of existing actor/effect components and resolved feedback.

Protected throughout this workstream:

- Combat math, answer checking, timer limits/start/pause/resume behavior, HP, shield, gold, mastery, Word Energy, and effect resolution.
- Shop inventory/count, affordability, purchase callbacks, costs/values, rerolls, rewards, event/elite/boss behavior, unlocks, and encounter progression.
- Permanent-progress save schema and memory-only run state; existing sound preference storage remains separate.
- Start Battle, Check Pair, Check Word, continuation, run-end, and destructive-action semantics. No automatic submission or progression.
- Existing anti-hint behavior: no answer, target, trigger, or result reveal before authoritative resolution.
- No new asset generation/imports, dependencies, backend, database, auth, external API, router, or deployment configuration.
- Player walk stays dormant; player defend/hurt/victory stay unimplemented. Do not expand the existing card-frame or background surfaces.

Moving a control does not authorize changing its behavior. In particular, removing direct Shop access or making a detail drawer pause gameplay is outside a pure layout change. Retain an equivalent route/handler or defer that change for a separate decision.

## Evidence And Work Items

| ID | Evidence / problem | Planned response | First phase |
| --- | --- | --- | --- |
| UI-01 | AppHeader exposes six peer navigation destinations outside Dungeon | One primary hub action; compact access to existing secondary destinations | 72E |
| UI-02 | Dungeon sprites sit inside nested status panels | Shared scene with visible actors and compact attached status | 72B |
| UI-03 | Desktop aside contains timer, energy, battle log, trigger details, and help | Timer beside quiz; details accessed on demand | 72B |
| UI-04 | Mobile QA image stacks player/lane/enemy before the question | Side-by-side actors with quiz-first height budget | 72B |
| UI-05 | Result feedback competes with expanded log/trigger panels | One result area plus optional detailed breakdown | 72C |
| UI-06 | Pause, abandon, and sound compete with gameplay controls | Contextual menu where existing state allows it | 72C |
| UI-07 | Home repeats deck/run metrics and navigation | Camp hub focused on continue/start, training, and spellbook | 72E |

Evidence sources: `src/components/AppHeader.tsx`, `src/screens/Dungeon.tsx`, `src/screens/Home.tsx`, `UI_HIERARCHY_GUIDE.md`, and historical `qa_artifacts/phase71h/dungeon-mobile.png`. Phase 72A did not perform a new live visual test. Refresh screenshots against the checked-out commit in Phase 72B.

## Work Sequence

| Phase | Deliverable and allowed work | Acceptance gate | Status |
| --- | --- | --- | --- |
| 72A - Direction And Work Planning | This plan, screen spec, QA plan, linked status/decision updates | Documentation is internally consistent; build passes; only Markdown changes | Complete |
| 72B - Dungeon Scene Prototype | Capture baseline; implement compact HUD, shared scene, and quiz layout using existing handlers/art; start with idle/answering states and verify all three mini-games | Desktop and 390px before/after review; all answers/status/controls accessible; no behavioral diff | Implemented; scoped QA recorded, owner review pending |
| 72C - Battle Feedback And Context Controls | Consolidate resolved result presentation; align existing cast/hit/attack/defeat/effect feedback with the scene; relocate optional details and menu controls | Correct/wrong/timeout/defeat, immediate continuation, menu state parity, reduced motion and failure paths pass | Not started |
| 72D - Dungeon Validation Gate | Full Dungeon QA plus short observed playtest; address only evidenced presentation defects | No blockers/high-severity regressions; owner accepts Dungeon direction before other screens change | Not started |
| 72E - Camp Hub And Navigation | Simplify Home and shared navigation while preserving every existing destination and run continuation | Primary action identifiable; route/access map and temporary/permanent-progress understanding verified | Not started |
| 72F - Spellbook And Training | Scan-first Deck Review; one selected detail; focused Training setup/question/result | Learning content remains accessible; mastery and answer behavior unchanged | Not started |
| 72G - Shop And Run Results | Shop offers as a coherent shop surface; concise purchase/run-result feedback | Same offers/costs/purchase effects; modal controls reachable; permanent/temporary outcomes understood | Not started |
| 72H - Cross-Screen Regression And Release Review | Desktop/mobile/accessibility/build/production-preview checks; collect release evidence | No blocking regression; reviewed commit identified before any separately authorized release action | Not started |

Implement one phase at a time. A phase is complete only after its own checks and documentation are updated. Do not tick future gates because the Phase 71G/71H tests once passed. The 72B prototype should be a runnable, reviewable code change, not a permanently duplicated game engine or new runtime mode.

## Implementation Ownership

| Existing owner | Intended use / boundary |
| --- | --- |
| `src/screens/Dungeon.tsx` | Compose scene, quiz, and result surfaces; retain authoritative resolution and timer handlers |
| `src/components/StaticBattleSprite.tsx`, `SpritesheetAnimation.tsx` | Reuse asset selection, explicit metadata, fallback, and reduced-motion behavior |
| `src/components/DecorativeBattleBackground.tsx` | Keep decoration on existing Dungeon intro/non-event battle surfaces |
| `src/assets/runtimeAssetRegistry.ts` | Reuse mapped assets and targeted Gatekeeper copy; no filename inference or new imports |
| `src/components/AppHeader.tsx`, `ScreenShell.tsx`, `ui.tsx` | Scoped presentation variants after the Dungeon gate; preserve sibling screens |
| `src/styles.css`, `tailwind.config.js` | Existing style ownership; record any later shared token changes with consumers |
| `src/screens/Home.tsx`, `DeckReview.tsx`, `Training.tsx`, `Shop.tsx`, `RunResult.tsx` | Work only in their scheduled phase |
| `src/game/`, `src/data/`, `src/types/`, `src/utils/` | Review for behavior parity; no gameplay/storage/data redesign |

Extract a small presentation component only when it helps the approved slice. No broad rewrite of the large Dungeon screen, new animation engine, or global theme replacement as incidental cleanup.

## Phase Working Checklist

- Read current status and this phase's scope; inspect branch/worktree and preserve unrelated work.
- Run the baseline build; report setup/build issues before editing. Install existing dependencies only if needed.
- Capture the relevant before states at the sizes in the QA plan; record the commit and actual gameplay values.
- State which UI items move, their new access paths, and any timer/focus implications before implementation.
- Implement the smallest cohesive slice; record deviations and unresolved choices.
- Run phase-specific QA and final build; capture matching after states and list untested cases honestly.
- Update PROJECT_STATUS, HANDOFF, QA_CHECKLIST, and this plan's phase status; update DECISIONS only for actual decisions and GAME_DESIGN only for accepted scope/rule changes.
- Keep a reviewable diff. Do not automatically push, deploy, or begin the next phase from this planning request.

## Risks And Deferred Choices

| Risk | Handling |
| --- | --- |
| Larger scene pushes quiz off screen | Shrink stage first; retain readable controls; permit short vertical scroll on short/zoomed screens |
| Removing labels makes icons ambiguous | Retain decision labels/numbers; tooltips and accessible names for utility icons; touch access without hover |
| Larger sprites expose normalized-art defects | Use conservative pixel scaling; record asset polish separately, retain fallbacks |
| New menu changes timer or abandon semantics | Map every relevant state before moving controls; keep old access where equivalence is not yet proven |
| Cosmetic sequence delays answer/result handling | Gameplay commits first; continuation never waits for playback |
| Prototype preference mistaken for user evidence | Separate owner acceptance, observed tester feedback, and technical QA |

Current review gate: **Phase 72B - Dungeon Scene Prototype**, with [fresh evidence and limitations](qa_artifacts/phase72b/REPORT.md). Stop for owner review; Phase 72C is not part of this delivery. Use the screen spec and QA plan as the acceptance contract. Pixel measurements, color values, and animation tuning remain prototype decisions to test, not approved gameplay changes.
