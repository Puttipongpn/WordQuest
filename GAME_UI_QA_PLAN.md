# Game UI Redesign QA Plan

Date: 2026-10-13
Status: Phase 72B scoped implementation evidence recorded on 2026-10-14 in [qa_artifacts/phase72b/REPORT.md](qa_artifacts/phase72b/REPORT.md). Owner review, native zoom/device checks and later phase gates remain open; unchecked items are not completed tests.
Scope and phase ownership: [GAME_UI_REDESIGN_PLAN.md](GAME_UI_REDESIGN_PLAN.md).

## Evidence Baseline

- Planning starts from commit `35fccce` on `main`, after Phase 71J.
- Phase 71G/71H/71I/71J reports are historical regression/release evidence. They do not prove a future redesigned UI passes.
- Before each implementation phase, record current commit, browser, viewport, deck, encounter, mini-game, and test setup. Capture the same states after the change.
- Use real UI flows for acceptance. Development QA helpers may create deterministic states locally, but label helper setup and do not claim it proves real answer-resolution behavior.
- Baseline sizes: 1366x768 desktop, 1440x900 desktop, 390x844 mobile, and 390x667 short mobile. Add 200% zoom and reduced motion on the changed flow.
- Store implementation evidence in `qa_artifacts/phase72b/` and later phase-specific folders only when those phases run. Do not create fake evidence or pass marks now.

## Measurable Presentation Gates

| Check | Acceptance |
| --- | --- |
| Active focus | One quiz area and one shared actor scene; no always-expanded log/trigger sidebar |
| Controls | One continuation for each resolved state; one contextual menu entry where legal; retain all required mini-game controls |
| Density | Record before/after counts of visible auxiliary buttons, standalone stat panels, repeated values, and framed regions at the same state; explain any count increase |
| Essential information | HP, shield, enemy HP/attack, timer and relevant option stats readable without opening details |
| Desktop space | At 1366x768 normal zoom, answer interaction and required action visible together where feasible; reduce stage before shrinking text |
| Mobile space | No horizontal overflow; all answers/actions reachable by normal scrolling; no clipping by fixed height, overlay, or sticky header |
| Feedback | Correct/wrong/timeout is understandable with animation and sound disabled |
| Stability | No answer/control displacement when images load, effects start, or result text changes |
| Detail access | Every relocated item has a discoverable access path; no newly hidden route or accidental timer change |

Counts support review, not a quota: do not remove meaningful answer options or stat labels to lower the count. A screenshot that fits but has unreadable Thai text fails.

## Implementation Test Matrix

| Case | Required observation | First required phase |
| --- | --- | --- |
| Word Choice correct/wrong | Same answer outcome and combat values; controls usable | 72B |
| Word Match correct/wrong | No target hints on Thai side; selected pair and Check Pair readable; same result | 72B |
| Word Scramble correct/wrong | Selection, duplicate letters, return tile, clear, Check Word all reachable; same result | 72B |
| Real timeout | Existing duration/expiry path; no double attack or animation delay | 72B |
| Intro and pause/resume | Start Battle required; timer holds/resumes per current behavior without reset | 72B / 72C |
| Menu/detail open/close | State-specific availability, focus and timer parity; abandon remains reachable including after failure | 72C |
| Correct element/shield result | Fire/Water/Wind/Earth and shield use resolved data; same damage/HP/gold/shield/energy | 72C |
| Wrong/timeout with shield | Same absorption and HP; attack/shield feedback once; no elemental success effect | 72C |
| Normal/elite/boss defeat | Same rewards/checkpoint/unlock/result behavior; immediate legal continuation | 72C |
| Run failure and event | Reachable existing actions/choices; no battle-background expansion to events | 72C |
| Fast continuation | Next works before playback ends; no stale effect on next question or encounter | 72C |
| Missing/unmapped/failed art | Actor fallback, silent failed effects, background/card/icon text fallback; no crash | Every affected phase |
| Reduced motion and sound off | Static/skip feedback sufficient; no required audio or moving-only information | Every affected phase |
| Navigation and new run | All previous destinations accessible; Continue preserves session; new-run/reset confirmation remains | 72E |
| Learning content | English/Thai/examples available; correct mastery persistence and untimed Training | 72F |
| Shop purchase/cancel/reroll | Same costs and offer count; one transaction; insufficient-gold behavior; modal focus and return intact | 72G |
| Run Result | Clear permanent versus temporary outcome; same save writes | 72G |
| Persistence | Mastery survives reload; temporary run does not; animation/loading/failure writes no progress | 72D and 72H |
| Production preview | Build app loads; QA Helper absent; smoke flows and fallback work | 72H |

For behavior parity, record before/after HP, shield, gold, damage, energy, mastery, and result actions for identical controlled inputs. Observe values after animation ends too. Test core paths through real answer handlers, not only forced-result helpers.

## Short Playtest Protocol

Use the [POST_RELEASE_MONITORING_REPORT.md](POST_RELEASE_MONITORING_REPORT.md) feedback fields and severity categories. Record owner feedback separately from external testers. A small exploratory round of 3-5 testers is a useful target, not statistical proof or an invented completion requirement.

Ask the tester to start a run, answer questions, inspect one result, pause/resume, and find the route back. Before explaining controls, record where they hesitate and whether they can identify the next action. Ask what changed after answering, whether effects distracted them, and what is permanent versus temporary. On mobile record unnecessary scrolling and missed taps.

Compare with the baseline when possible using the same device/tasks. Alternate order across testers if practical. Summarize observed problems and quotes; do not report subjective improvement from build/overflow checks alone. Owner review is the minimum direction gate before spreading the Dungeon treatment to other screens; unavailable external testing remains an explicit open item.

## Acceptance Record Template

```text
Phase / date:
Commit / branch:
Changed surfaces and files:
Baseline / after evidence paths:
Browser / viewport / motion / sound setting:
Setup (normal flow or named development helper):
Case / expected / observed:
Authoritative values before and after:
Visible control/panel counts before and after:
Issues (ID, severity, reproduction, scope, evidence):
Untested cases and reason:
Build / production-preview result:
Owner direction review:
Tester evidence (or not collected):
Decision: accepted / revise / blocked
Next scoped task:
```

## Gates And Rollback

- Blocker or High: stop phase promotion; reproduce and repair within scope, then retest affected paths. Do not redefine gameplay to bypass a UI failure.
- Medium: fix loss of readability, information access, or action reachability before accepting that surface; explicitly document remaining optional polish.
- Low/Backlog: record separately; new art, walk/defend/hurt/victory, and expanded frame/background use require their own scoped work.
- Keep each phase in a reviewable commit. To withdraw a committed presentation slice, prefer a reviewed revert of that slice, preserving unrelated work; do not reset shared history.
- Release review does not automatically authorize pushing/deploying. Record the accepted commit and follow the user's release instruction.

## Planning Checkpoint (72A Only)

- [x] Source/status inspected on clean `main` at `35fccce`.
- [x] Baseline `npm run build` passed: 94 modules, JS `index-C9Sq5LlG.js`, CSS `index-_vk3ZSMv.css`.
- [x] Owner feedback recorded; future phase scope, owners, state constraints, and acceptance evidence defined.
- [x] Phase 72B fresh screenshots and baseline metrics captured (2026-10-13/14; see report).
- [x] Dungeon prototype implemented and Phase 72B core behavior matrix tested; limitations are listed in the report.
- [ ] Owner accepted the prototype direction.
- [ ] External playtest observations collected.
- [ ] Cross-screen regression and release review completed.

Phase 72A adds documentation only. No new live smoke, responsive, screenshot, animation, or playtest pass is claimed by this checklist.
