# Game UI Screen Specification

Date: 2026-10-13
Status: Phase 72A target specification. Phase 72B implements the Dungeon scene/HUD/quiz prototype as of 2026-10-14; owner review is pending. Other screen and later feedback/menu targets remain planned. See [fresh evidence](qa_artifacts/phase72b/REPORT.md).
Delivery order: [GAME_UI_REDESIGN_PLAN.md](GAME_UI_REDESIGN_PLAN.md).
Acceptance: [GAME_UI_QA_PLAN.md](GAME_UI_QA_PLAN.md).

## Experience And Visual Direction

WordQuest should feel like a cozy fantasy Word Mage adventure where choosing vocabulary casts spells. Preserve the canonical young staff-and-spellbook mage and the existing pixel-art identity. The signature is a visible spellcasting exchange in the same scene as the enemy, followed by a clear opportunity to answer again.

Use one coherent scene, a compact HUD, and a readable quiz surface. Remove repeated container borders, heavy panel shadows, all-caps eyebrows, duplicate values, and badges that only repeat headings. Cards remain appropriate for actual vocabulary choices and shop offers; do not frame every status or page section as another card.

Visual roles: blue/gold belongs to the hero and primary selection; red to damage/danger; green to recovery/positive results; neutrals keep learning text legible. Avoid coating the entire UI in one accent family. English and Thai learning text uses a readable system font with adequate Thai line height; pixel-style treatment is optional for short decorative labels only. No new font dependency is required. Exact palette/type/spacing changes are to be tested in 72B, not installed by these docs.

Existing canonical style sources are `src/styles.css`, Tailwind utilities/configuration, and shared `ui.tsx`. `UI_HIERARCHY_GUIDE.md` owns the established hierarchy principles; this document owns the Phase 72 target composition. Older phase-specific layouts are historical evidence, not a requirement to preserve the dashboard arrangement.

## Dungeon Layout

Desktop concept (target 1366x768; also inspect 1440x900):

```text
+-------------------------------------------------------+
| Gold / compact progress                    Pause menu |
|                                                       |
|      WORD MAGE                     ENEMY               |
|      HP + shield                   HP + attack         |
|                  shared battle scene                  |
|                                                       |
| Question / short instruction                   Timer  |
|                                                       |
|         answer cards / matching / letter tiles         |
|                                                       |
|       required confirm OR resolved-result action       |
+-------------------------------------------------------+
```

Mobile concept (390x844; also test 390x667): compact HUD, side-by-side actors, then timer/question/options, then the current action. Aim for the stage to consume roughly one quarter of the usable height, but validate rather than hard-code a percentage. Give Word Match and Word Scramble the space they require. Do not shrink Thai text, clip tiles, or hide scrolling to satisfy a screenshot.

Use stable actor, HP, answer, and result-action geometry. Effects must not move answer controls. Prefer integer sprite scaling where practical and preserve frame isolation. Do not stretch the background into learning surfaces or reuse it globally.

## Information Placement

| Information | Default during answering | Secondary access / rule |
| --- | --- | --- |
| Player HP and shield | Compact numeric values with clear labels near player | Do not require image loading to read |
| Enemy HP and attack | Compact numeric values and HP bar near enemy | Keep existing boss/elite information needed for the next decision |
| Gold | One compact labeled HUD value | No duplicated stat card |
| Floor / encounter / boss progress | One short progress group | Expand for the distinct counters; do not merge different gameplay meanings into a false single value |
| Timer | Digits and compact bar adjacent to question | One timer presentation; keep existing timing semantics |
| Word / prompt / answer controls | Main interactive area | Never obscured by scene, result decoration, or help |
| Card ATK, shield, element, mastery contribution, energy | Compact consistent stat line when relevant to card choice | Preserve decision-relevant information; full explanation on demand |
| Word Match Thai choices | Meaning text only | No stats, art, ordering, or color cues that reveal a matching English card |
| Battle Log / damage breakdown | No persistent expanded panel | Accessible from resolved feedback/details; retain written outcome |
| Full Word Energy summary | No persistent expanded panel | Run details or existing paused context; per-option energy stays visible |
| Learning Info / rules | Short current instruction only | Help through an existing safe context; do not add automatic pause |
| Pause / sound / abandon | Compact contextual entry where supported | Preserve all availability, confirmation, resume, and return paths |

## State And Interaction Contract

| State | Required presentation / actions | Behavior constraint |
| --- | --- | --- |
| Encounter intro | Enemy identity, readable essential stats, player status, one Start Battle | Timer starts only through existing Start Battle handler |
| Answering | Quiz, timer, HP/shield, enemy HP/attack, relevant card stats | No result/target reveal and no auto-submit |
| Paused | Resume, available secondary actions, abandon entry, sound control | Use existing pause/resume and disabled-answer behavior; no timer reset |
| Correct / living enemy | Resolved feedback, existing cast/hit/effect art, one Next Mini-Game | No waiting for animation; no duplicate damage/effects |
| Wrong / timeout | Readable correct answer and existing damage feedback; one continuation when legal | Animation cannot consume additional answer time or alter failure rules |
| Enemy defeated | Existing defeat art and reward text; current legal next action | Preserve shop/boss/event checkpoint routing |
| Run failed / complete | Clear outcome and existing result/restart/return paths | Actions accessible even if playback or image loading fails |
| Event | Existing choices, costs/outcomes, and event status | Do not turn event into combat or apply battle background |
| Missing art / reduced motion | Static identity or existing fallback; readable resolved text | No state writes or additional gameplay callbacks |

Word Choice retains its current answer activation. Word Match keeps deliberate Check Pair; Word Scramble keeps card selection, editable letter tiles, clear, and Check Word. Reduce redundant navigation and reporting controls, not answer choices or necessary confirmations.

Before relocating Pause/Abandon/Sound, map intro, answering, paused, resolved, failed, and event states to current handlers. If Pause is unavailable but Abandon is available, keep a direct entry or equivalent non-pausing menu; do not make Abandon unreachable. Closing a detail view cannot implicitly resume, reset, or extend a timer. Any unavoidable behavior change is a separate proposal.

## Motion And Results

1. Selection uses a small highlight/lift without changing layout, submission, or hints.
2. Existing gameplay resolves and commits values before presentation reacts.
3. Existing cast, hit/attack/defeat, elemental, and shield layers render at actor positions with pointer events disabled.
4. Brief floating values reinforce a persistent written result; HP/shield numbers always show authoritative values.
5. One stable result area provides correction/reward text and the legal continuation action. Detailed log/trigger panels do not also expand automatically.

Use current explicit asset metadata initially. Do not create a blocking cinematic queue or an animation callback that controls damage, saves, rewards, or progression. Effects may overlap actor feedback safely; they never cover answer controls. Cancel stale presentation on next question, encounter change, or unmount. Repeated clicks must not duplicate resolution. Reduced motion uses existing representative frames or silent skip; sound remains optional and off by default.

## Other Screen Targets

| Screen | First-view priority | On-demand content | Preserve |
| --- | --- | --- | --- |
| Home | Continue/Start Adventure; Train; Spellbook; compact selected deck | Deck picker, records, guide, settings, reset | All existing navigation destinations, active-run continuation, unlock feedback |
| Deck Review | Scan words/Thai meanings and compact mastery; inspect one word | Full sentence, effects, mastery bonus, guidance, filters as needed | Every vocabulary card and current selection/filter/sort capability |
| Training | Compact setup, then one clear question and answers | Mode explanations and session details | Untimed practice, correction, Next, existing mastery write rules |
| Shop | Existing offer count, readable prices, current gold | Selected offer/target preview in one modal | Availability, missing-gold text, confirm/cancel, reroll, return, upgrade spark |
| Run Result | Outcome, retained permanent gains versus lost temporary run state, primary next action | Detailed statistics and breakdown | Existing statistics/save/return/restart handlers |

The camp/shop/spellbook feel can come from composition and existing visuals. New scenery, merchants, animations, effects, and decorative-frame expansion are not part of this plan. Shop and Result may leave the top navigation only if an equivalent discoverable entry remains; changing their eligibility is not authorized.

## Accessibility And Responsive Rules

- Keep native buttons, keyboard activation, visible focus, readable English/Thai, and accessible icon names.
- Utility icons need understandable labels/tooltips; touch users cannot depend on hover. Aim for at least 44x44 CSS-pixel hit areas without enlarging decorative icon art.
- Dialogs retain focus containment, Escape/cancel where appropriate, and focus restoration; destructive abandon/reset confirmation stays explicit.
- Effects are decorative, pointer-free, and never the only indication of correctness, HP change, shield, or reward.
- No horizontal overflow at 390px; short screens and 200% zoom may scroll vertically. Sticky UI must not obscure focused controls.
- Enlarging art must not make pixel edges, glow, or backgrounds harder to read. Record polish rather than silently regenerate sources.

## Reference Principles

These are design references, not assets or mechanical features to copy:

- [Slay the Spire official press kit](https://www.megacrit.com/press-kits/slay-the-spire/): scene and card-play composition.
- [Dicey Dungeons official press kit](https://terrycavanaghgames.com/dice/presskit/desktop/index.php): approachable characters and clear interactive space.
- [Balatro official press kit](https://www.playbalatro.com/press-kit): readable card selection and result feedback rhythm.

Prototype decisions still to validate: stage height, actor scale, default detail access, result-area placement, and secondary-menu discoverability. Do not treat these as finished design approval.
