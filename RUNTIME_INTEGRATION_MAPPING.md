# Runtime Integration Mapping

## Phase 71E Scope

This specification began as the Phase 71E mapping plan. Phase 71F.1 implemented static identities, Phase 71F.2 implemented cast/hit, Phase 71F.3 implemented mapped enemy attack, Phase 71F.4 implemented mapped enemy defeat, Phase 71F.5 implemented Fire/Water/Wind/Earth result presentation, Phase 71F.6 implemented shield gain/absorption feedback, Phase 71F.7 implemented successful Shop upgrade spark feedback, Phase 71F.8 implemented static Gold/HP/Shield icon support, Phase 71F.9 implemented controlled vocabulary-card framing, and Phase 71F.10 implemented the controlled Dungeon battle background. Phase 71G regression QA passed normal/reduced playback, every mapped presentation layer, targeted Elite Crystal Slime/Gatekeeper actions, fallback behavior, mobile layout, and persistence separation without changing the mapping. The walk mapping later in this document remains planning-only.

## Phase 71F.10 Implemented Dungeon Background Mapping

| Dungeon surface | Decorative asset | Runtime rule | Failure behavior |
| --- | --- | --- | --- |
| Encounter intro | `background_dungeon_battle_01` | Centered responsive cover below existing stage content and contrast overlay | Keep existing gradient, border, content, and controls |
| Active non-event battle stage | `background_dungeon_battle_01` | Same decorative layer below status identities and battle lane | Keep existing stage styling and all quiz/result behavior |
| Event encounter | None | Explicitly disabled to preserve the existing event presentation | Existing event stage remains unchanged |

`DecorativeBattleBackground` receives explicit `1672x941` metadata, owns only image load/failure state, and renders no interactive content. Loading, success, failure, or responsive cropping cannot mutate answers, timers, HP, shield, gold, enemy status, combat, rewards, saves, or progression. Training, Deck Review, Shop, Run Result, and global app surfaces are not mapped.

## Phase 71F.9 Implemented Vocabulary Card Frame Mapping

| Existing HTML surface | Decorative asset | Runtime rule | Failure behavior |
| --- | --- | --- | --- |
| Deck Review selected-card detail | `ui_vocabulary_card_frame` | Always opt-in around the selected detail only | Keep original detail panel, text, selection, and scrolling |
| Training active question prompt | `ui_vocabulary_card_frame` | Frame prompt only; never answer choices | Keep original prompt surface and answer interaction |
| Shop target modal selected card | `ui_vocabulary_card_frame` | Enable on exactly the selected target; unselected targets remain plain | Keep original target card, preview, selection, Cancel, and Confirm |

`DecorativeCardFrame` receives explicit targeted metadata and places a 9-slice border/fill behind its children with `pointer-events: none`. Existing HTML remains accessible and authoritative. Component load state cannot mutate card selection, answers, purchases, gold, cards, saves, rewards, or progression.

## Phase 71F.8 Implemented Static UI Icon Mapping

| Existing text/value UI | Decorative asset | Runtime locations | Failure behavior |
| --- | --- | --- | --- |
| Gold/current run value | `ui_gold_coin` | Dungeon active/event status; Shop current Gold | Keep Gold label/value and stable empty icon box |
| Shop offer/modal cost | `ui_gold_coin` | Offer cost badge; modal Gold and Cost badges | Keep Cost/After/affordability/missing-gold text |
| Player HP | `ui_heart_hp` | Dungeon encounter intro, active status, event status | Keep HP label/value and progress bar |
| Player Shield | `ui_shield` | Dungeon active and event status | Keep Shield label/value and shield feedback behavior |

`StaticUiIcon` receives an explicit registry asset, renders a decorative `alt=""` image in a stable box, and locally hides only a failed image. Surrounding text and numbers remain authoritative. The component has no gameplay callbacks and cannot mutate HP, shield, gold, costs, affordability, combat, rewards, saves, or progression.

## Phase 71F.7 Implemented Shop Upgrade Spark Mapping

| Resolved source state | Shop presentation | Completion behavior |
| --- | --- | --- |
| Successful Upgrade Attack callback | `effect_upgrade_spark` over ceremony card icon | Auto-clear; existing `+2 ATK` and gold result are not repeated |
| Successful Add Shield callback | Same icon overlay | Auto-clear; existing `SHD +3` and gold result are not repeated |
| Successful Add Element callback | Same icon overlay | Auto-clear; existing selected element and gold result are not repeated |
| Insufficient gold, canceled modal, or failed callback | No spark | Existing Shop feedback remains authoritative |
| Reroll, Remove Card, or Duplicate Card | No spark | Existing action remains unchanged and independent |
| Spark image load failure | Silently skip and clear | Ceremony and Continue remain available; no gameplay callback |
| Reduced motion | Static configured spark frame 2 | Auto-clear on configured one-shot duration |

`Shop.confirmPurchase()` consumes the existing boolean callback result. Only success for `upgrade-attack`, `add-shield`, or `add-element` creates a local playback ID after the parent transaction has committed. The spark sits in a fixed pointer-free card-icon overlay and has no authority over gold, card attack/shield/element, deck contents, reroll, saves, rewards, unlocks, or progression.

The spark sheet uses `4 x 64x64` frames at `120ms`, zero-based reduced frame 2, target layer `shop-card-icon-overlay`, silent-skip fallback, idle return state, and automatic clear.

## Phase 71F.6 Implemented Shield Effect Mapping

| Resolved source state | Actor presentation | Shield presentation | Completion behavior |
| --- | --- | --- | --- |
| Correct result with positive `shieldGained` | Existing Word Mage cast plus mapped enemy hit/defeat | `effect_shield_block` in player portrait overlay | Auto-clear; existing shield value is not repeated |
| Correct result with no shield gain | Existing correct-result presentation | No shield overlay | Existing result remains authoritative |
| Wrong answer with positive `shieldAbsorbed` | Existing mapped enemy attack/fallback | `effect_shield_block` in player portrait overlay | Auto-clear; existing absorption/HP result is not repeated |
| Real timeout with positive `shieldAbsorbed` | Existing mapped enemy attack/fallback | Same shield overlay | Result action remains immediate |
| Wrong answer/timeout with zero absorption | Existing mapped enemy attack/fallback | No shield overlay | Existing damage result remains authoritative |
| Water result with shield gain | Existing cast/hit plus Water enemy overlay | Shield overlay independently targets player | Both auto-clear without cross-callbacks |
| Shield image load failure | Existing actor/effect presentation continues | Silently skip and clear shield overlay | No crash or gameplay callback |
| Reduced motion | Existing actor representative frame | Static configured shield frame 2 | Auto-clear on configured one-shot duration |

Dungeon uses positive `shieldGained` and `shieldAbsorbed` values already written into completed BattleLog objects after current shield/HP and answer-result operations. The post-commit presentation effect creates a separate pointer-free player overlay and does not inspect result text. Shop Add Shield is not mapped in this phase.

The shield sheet uses `4 x 64x64` frames at `120ms`, zero-based reduced frame 2, target layer `player-portrait-overlay`, silent-skip fallback, idle return state, and automatic clear. Playback has no authority over shield, absorption, damage, HP, gold, mastery, Word Energy, rewards, unlocks, saves, or progression and does not gate result actions.

## Phase 71F.5 Implemented Elemental Effect Mapping

| Resolved source state | Actor presentation | Effect presentation | Completion behavior |
| --- | --- | --- | --- |
| Correct result with Fire | Existing cast plus mapped hit/defeat | `effect_fire` in enemy portrait overlay | Auto-clear; result action remains immediate |
| Correct result with Water | Existing cast plus mapped hit/defeat | `effect_water` in enemy portrait overlay | Auto-clear; existing shield result is not repeated |
| Correct result with Wind | Existing cast plus mapped hit/defeat | `effect_wind` in enemy portrait overlay | Auto-clear; existing gold/result is not repeated |
| Correct result with Earth | Existing cast plus mapped hit/defeat | `effect_earth` in enemy portrait overlay | Auto-clear; existing damage/result is not repeated |
| Correct non-element result | Existing cast plus mapped hit/defeat | No elemental overlay | Existing result remains authoritative |
| Wrong answer or timeout | Existing enemy attack/fallback | No elemental overlay | Existing damage/result remains authoritative |
| Effect image load failure | Existing actor presentation continues | Silently skip and clear overlay | No crash or gameplay callback |
| Reduced motion | Existing actor representative frame | Static configured effect frame 2 | Auto-clear on configured one-shot duration |

The existing successful answer branches write `resolvedElement` into their completed battle logs only after current damage, shield, gold, mastery, Word Energy, reward, statistics, completion, and result-state operations have run. Dungeon consumes that explicit value in the post-commit presentation effect and creates a separate pointer-free overlay local to the current encounter.

Fire, Water, Wind, and Earth each use `4 x 64x64` frames at `120ms`, zero-based reduced frame 2, target layer `enemy-portrait-overlay`, silent-skip load fallback, and automatic clear. The overlay has no authority over damage, HP, shield, gold, mastery, Word Energy, status, rewards, unlocks, saves, or progression and does not gate result actions.

## Phase 71F.4 Implemented Enemy Defeat Mapping

| Resolved source state | Player presentation | Enemy presentation | Completion behavior |
| --- | --- | --- | --- |
| Correct damage; mapped normal/elite HP reaches zero | Word Mage cast one-shot | Mapped defeat one-shot | Hold defeat frame 3; Next Encounter remains immediate |
| Correct damage; mapped boss HP reaches zero | Word Mage cast one-shot | Gatekeeper defeat one-shot | Hold defeat frame 3; Run Complete actions remain immediate |
| Correct damage; unmapped encounter HP reaches zero | Word Mage cast one-shot | Existing idle or emoji/CSS fallback | Existing result and rewards remain authoritative |
| Defeat image load failure | Word Mage cast one-shot | Loaded idle sheet or emoji/CSS fallback | No crash or gameplay callback |
| Reduced motion | Static cast frame 3 | Static defeat frame 3 | No frame cycling; actions remain immediate |

The authoritative HP-zero branches add `enemyDefeatResolved` only to their completed result logs after existing reward, statistics, unlock, and result-state calls. Dungeon consumes the marker after commit, chooses defeat by encounter ID, and suppresses the living-hit mapping for that result. Defeat completion holds the final frame and has no authority over HP, gold, rewards, statistics, unlocks, encounter advancement, saves, or result actions.

Defeat mappings cover `monster-slime`, `monster-bat`, `monster-goblin`, `elite-monster-slime`, and `boss-gatekeeper`. Normal/elite sheets are `4 x 64x64` at `150ms`; Gatekeeper is `4 x 128x128` at `180ms`. Every entry is one-shot, uses zero-based reduced frame 3, declares its fallback identity, and holds its final frame.

## Phase 71F.3 Implemented Enemy Attack Mapping

| Resolved source state | Player presentation | Enemy presentation | Completion behavior |
| --- | --- | --- | --- |
| Wrong answer; run continues | Idle | Mapped attack one-shot | Enemy independently returns idle; Next remains available |
| Real timeout; run continues | Idle | Mapped attack one-shot | Enemy independently returns idle; timer is already stopped by answered state |
| Wrong answer/timeout reaches 0 HP | Idle/Run Failed presentation | Mapped attack may play | Restart/result actions remain immediately authoritative |
| Shield absorbs some/all damage | Idle | Same mapped attack one-shot | Existing shield/HP result is unchanged and cannot repeat |
| Missing mapping or load failure | Existing idle or emoji/CSS fallback | No action playback | Existing damage/result remains authoritative |
| Reduced motion | Idle | Configured static attack frame 2, then idle | No frame cycling and no game callback |

`monsterAttack` adds an explicit `enemyAttackResolved` presentation marker only to the final log it creates after issuing existing shield, HP, statistics, status, and Run Failed updates. The shared post-commit Dungeon effect consumes that marker, clears player action presentation, and selects attack metadata by the current existing encounter ID. It does not infer behavior from filenames or log message text.

Attack mappings cover `monster-slime`, `monster-bat`, `monster-goblin`, `elite-monster-slime`, and `boss-gatekeeper`. Gatekeeper uses the repaired Phase 71D.5 runtime copy. Normal/elite attacks are `4 x 64x64` at `120ms`; Gatekeeper is `4 x 128x128` at `140ms`. Every entry is one-shot, uses zero-based reduced frame 2, declares its fallback identity, and returns to idle.

## Phase 71F.2 Implemented Action Mapping

| Resolved source state | Player presentation | Enemy presentation | Completion behavior |
| --- | --- | --- | --- |
| Positive-damage correct result; enemy HP remains above zero | Word Mage cast one-shot | Mapped encounter hit one-shot | Each independently returns to idle |
| Positive-damage correct result; enemy HP is zero | Word Mage cast one-shot | Phase 71F.4 mapped defeat or existing fallback | Result actions remain immediately available |
| Wrong answer or timeout | Idle | Phase 71F.3 mapped attack or existing fallback | Existing damage/result flow is unchanged |
| Missing mapping, reduced motion, or image failure | Static representative frame, loaded idle, or current fallback | Static representative frame, loaded idle, or current fallback | No gameplay callback |

Dungeon observes a new committed success `battleLog`, positive `damageDealt`, resolved `monsterHp`, battle status, and encounter ID. That post-commit effect creates local presentation state only. `SpritesheetAnimation` completion can clear that state but no game function waits for it or reads it.

The runtime registry explicitly maps Word Mage cast and hit sheets for `monster-slime`, `monster-bat`, `monster-goblin`, `elite-monster-slime`, and `boss-gatekeeper`. Frame cadence is metadata rather than filename inference: cast is `6 x 64x64` at `110ms`; normal/elite hit is `2 x 64x64` at `150ms`; boss hit is `2 x 128x128` at `170ms`. Reduced-motion frame indexes are zero-based.

## Phase 71F.1 Implemented Static Mapping

`src/assets/runtimeAssetRegistry.ts` imports six idle sheets and maps existing encounter IDs without modifying encounter data. `src/components/StaticBattleSprite.tsx` displays the first frame in a stable crop box. `src/screens/Dungeon.tsx` uses the component in encounter-intro and active-battle stage portraits.

| Runtime identity | Runtime file | Frame shown | Existing fallback |
| --- | --- | ---: | --- |
| Word Mage | `sprites/player/word-mage/player_word_mage_idle_sheet.png` | 1 of 4 | `WQ` portrait |
| `monster-slime` | `sprites/monsters/slime/monster_slime_idle_sheet.png` | 1 of 4 | Encounter emoji/CSS portrait |
| `monster-bat` | `sprites/monsters/bat/monster_bat_idle_sheet.png` | 1 of 4 | Encounter emoji/CSS portrait |
| `monster-goblin` | `sprites/monsters/goblin/monster_goblin_idle_sheet.png` | 1 of 4 | Encounter emoji/CSS portrait |
| `elite-monster-slime` | `sprites/elites/crystal-slime/elite_crystal_slime_idle_sheet.png` | 1 of 4 | Encounter emoji/CSS portrait |
| `boss-gatekeeper` | `sprites/bosses/gatekeeper/boss_gatekeeper_idle_sheet.png` | 1 of 4 | Encounter emoji/CSS portrait |

An unmapped encounter receives no sprite asset and therefore keeps its current fallback. An image `onError` swaps to the same fallback without changing portrait dimensions. No timer, correctness, damage, HP, shield, result, reward, or progression state depends on image loading.

At the Phase 71F.2 checkpoint the registry imported cast and hit only. Phase 71F.3 added mapped enemy attack, Phase 71F.4 added mapped enemy defeat, Phase 71F.5 added four elemental effects, Phase 71F.6 added shield feedback, Phase 71F.7 added Shop upgrade spark feedback, Phase 71F.8 added three static UI icons, Phase 71F.9 added the controlled decorative card frame, and Phase 71F.10 adds the Dungeon stage background. The walk file remains dormant.

Recommended next phase after the Phase 71G pass: **Phase 71H Release Candidate And Deployment Verification**. Player walk remains dormant until a separate explicit phase authorizes it.

## Identity Mapping

| Existing game identity | Planned visual family | Coverage | Fallback requirement |
| --- | --- | --- | --- |
| Player / Word Mage | `player_word_mage_*` | idle, walk, cast/attack | Use idle/static placeholder for defend, hurt, victory, load error, or reduced motion. |
| `monster-slime` | `monster_slime_*` | idle, attack, hit, defeat | Existing emoji/CSS portrait remains available. |
| `monster-bat` | `monster_bat_*` | idle, attack, hit, defeat | Existing emoji/CSS portrait remains available. |
| `monster-goblin` | `monster_goblin_*` | idle, attack, hit, defeat | Existing emoji/CSS portrait remains available. |
| `elite-monster-slime` | `elite_crystal_slime_*` | idle, attack, hit, defeat | Fall back to Slime art plus existing Elite label, or current placeholder. |
| Other `elite-*` IDs | No dedicated candidate | none | Keep normal-monster/current placeholder presentation and existing Elite label. |
| `boss-gatekeeper` | `boss_gatekeeper_*` | idle, attack, hit, defeat | Existing emoji/CSS boss portrait remains available. |
| Other current boss IDs | No dedicated candidate | none | Keep current placeholder presentation. |

Crystal Slime is a visual override for Elite Slime only. It does not create a new elite encounter, change elite multipliers, or alter rewards.

## Presentation State Mapping

| Runtime role | Candidate state | Animation behavior | Presentation trigger | Safety rule |
| --- | --- | --- | --- | --- |
| Player default | Word Mage idle | loop | Encounter/battle stage is visible and no one-shot player action is active | Never gates quiz input. |
| Player movement | Word Mage walk | loop while requested | Existing navigation/scene transition presentation only | Must not change encounter progression or timing. |
| Player card action | Word Mage cast/attack | one-shot, return to idle | After a correct answer and triggered card have already been resolved | Must not reveal correctness, target card, or result early. |
| Enemy default | Monster/elite/boss idle | loop | Active encounter is visible and no one-shot enemy action is active | Existing HP/attack state stays authoritative. |
| Enemy attack | Monster/elite/boss attack | one-shot, return to idle | After existing wrong-answer/timeout enemy damage resolution | Animation does not deal damage or extend the timer. |
| Enemy hit | Monster/elite/boss hit | one-shot, return to idle | After confirmed damage greater than zero and encounter remains alive | Animation does not calculate HP. |
| Enemy defeat | Monster/elite/boss defeat | one-shot, hold final frame or hide after existing result UI is ready | After authoritative encounter HP reaches zero | Result actions cannot depend on playback completion. |
| Element result | Fire/Water/Wind/Earth effect | one-shot | After the existing card element effect resolves | No extra damage, shield, gold, or status is implied. |
| Shield feedback | Shield-block effect | one-shot | After existing shield gain/block feedback resolves | Does not create or alter shield. |
| Upgrade feedback | Upgrade-spark effect | one-shot | After a Shop purchase succeeds and state is already committed | Must not play on failed/cancelled purchase. |
| UI status | Gold/HP/Shield icon | static | Alongside existing readable labels and values | Icon is never the sole status indicator. |
| Vocabulary frame | Card frame | static | Optional wrapper for an existing vocabulary card/detail surface | HTML text remains selectable, readable, and authoritative. |
| Battle background | Dungeon background | static | Optional background layer for Dungeon battle stage | Must not reduce quiz/control contrast or cover content. |

## Candidate File Mapping

### Player

- `player_word_mage_idle` -> `player_word_mage_idle_sheet.png`
- `player_word_mage_walk` -> `player_word_mage_walk_sheet.png`
- `player_word_mage_cast_attack` -> `player_word_mage_cast_attack_sheet.png`

### Monsters

- `monster-slime`: `monster_slime_idle`, `monster_slime_attack`, `monster_slime_hit`, `monster_slime_defeat`
- `monster-bat`: `monster_bat_idle`, `monster_bat_attack`, `monster_bat_hit`, `monster_bat_defeat`
- `monster-goblin`: `monster_goblin_idle`, `monster_goblin_attack`, `monster_goblin_hit`, `monster_goblin_defeat`

### Elites

- `elite-monster-slime`: `elite_crystal_slime_idle`, `elite_crystal_slime_attack`, `elite_crystal_slime_hit`, `elite_crystal_slime_defeat`

### Bosses

- `boss-gatekeeper`: `boss_gatekeeper_idle`, `boss_gatekeeper_attack`, `boss_gatekeeper_hit`, `boss_gatekeeper_defeat`
- Gatekeeper attack must use the Phase 71D.5 targeted candidate, not the obsolete full-run file.

### Effects And UI

- Existing `fire` element -> `effect_fire`
- Existing `water` element -> `effect_water`
- Existing `wind` element -> `effect_wind`
- Existing `earth` element -> `effect_earth`
- Existing shield feedback -> `effect_shield_block`
- Existing successful Shop upgrade feedback -> `effect_upgrade_spark`
- Existing gold display -> `ui_gold_coin`
- Existing player HP display -> `ui_heart_hp`
- Existing shield display -> `ui_shield`
- Controlled Deck detail, Training prompt, and selected Shop target presentation -> targeted `ui_vocabulary_card_frame`
- Optional Dungeon battle-stage background -> `background_dungeon_battle_01`

## Animation Metadata Plan

Every future animated catalog entry should declare metadata explicitly. Do not infer it from filename or image width.

| Metadata field | Purpose |
| --- | --- |
| `assetId` | Stable logical ID independent of bundler output filename. |
| `file` | One imported runtime file path. |
| `category` | `player`, `monster`, `elite`, `boss`, `effect`, `ui`, `icon`, or `background`. |
| `identityId` | Existing player/monster/boss identity or presentation namespace. |
| `state` | `idle`, `walk`, `cast`, `attack`, `hit`, `defeat`, `element`, `shield`, or `upgrade`. |
| `frameCount` | Explicit number of horizontal frames. |
| `frameWidth` / `frameHeight` | Exact cell dimensions in pixels. |
| `animationType` | `loop`, `one-shot`, or `static`. |
| `playbackPurpose` | Human-readable presentation purpose and allowed resolved trigger. |
| `returnState` | Stable state after a one-shot, normally `idle`; defeat may hold its final frame. |
| `baseline` | `grounded`, `hover`, `centered`, `lower`, or `none`. |
| `facing` | `right`, `left`, or `none`. |
| `anchorX` / `anchorY` | Optional normalized placement anchor for stage composition. |
| `fallback` | Existing emoji/CSS/static presentation when loading or playback is unavailable. |
| `reducedMotionFrame` | Representative frame shown instead of playback. |
| `readiness` | Clean, targeted, polish backlog, or layout-QA candidate. |

Future metadata will also need a visual frame duration or cadence profile, but Phase 71E does not lock timing values. Animation timing must remain independent from quiz timers, combat resolution, result actions, and encounter progression.

## Metadata Defaults By Asset Type

| Asset type/state | Frames/cell | Animation type | Baseline | Default purpose |
| --- | --- | --- | --- | --- |
| Player idle | 4 at `64x64` | loop | grounded | Stable player presence. |
| Player walk | 6 at `64x64` | loop while requested | grounded | Presentation-only movement. |
| Player cast | 6 at `64x64` | one-shot | grounded | Confirmed card trigger feedback. |
| Small enemy idle/attack/defeat | 4 at `64x64` | idle loops; actions one-shot | grounded or hover for Bat | Encounter presence and resolved battle feedback. |
| Small enemy hit | 2 at `64x64` | one-shot | grounded or hover for Bat | Confirmed damage reaction. |
| Elite idle/attack/defeat | 4 at `64x64` | idle loops; actions one-shot | grounded | Elite Slime presentation. |
| Elite hit | 2 at `64x64` | one-shot | grounded | Confirmed damage reaction. |
| Boss idle/attack/defeat | 4 at `128x128` | idle loops; actions one-shot | grounded | Gatekeeper presentation. |
| Boss hit | 2 at `128x128` | one-shot | grounded | Confirmed damage reaction. |
| Effects | 4 at `64x64` | one-shot | centered; Earth lower | Resolved effect feedback. |
| Icons/card/background | 1 at declared dimensions | static | none | Supplementary presentation. |

## Playback And Fallback Rules

- Gameplay state is authoritative; animation state is derived presentation.
- Correct/wrong/timeout feedback must remain visible in text without animation.
- One-shot completion cannot call combat, save, reward, progression, shop, or answer-resolution logic.
- Rapid state changes may skip or replace a visual animation without dropping game results.
- Asset loading errors must render the current emoji/CSS fallback and keep controls usable.
- Reduced-motion mode should use a representative stable frame and suppress nonessential loops where appropriate.
- Sprite layers must use `pointer-events: none` unless a later explicit interaction requires otherwise.
- Effects and sprites must not cover quiz text, Thai meanings, answer controls, timer, HP, shield, result actions, or modals.
- No art may reveal hidden answers, selected targets, triggered cards, or result information before the player answers.

## Static Layout Planning

### Vocabulary Card Frame

- Use as an optional decorative layer around existing semantic HTML content.
- Keep text and controls outside the bitmap itself.
- Define responsive inner insets from measured transparent/decorative bounds during Phase 71F layout QA.
- Fall back to the existing CSS card if the image is unavailable or too constrained on mobile.

### Dungeon Background

- Render as a decorative background layer with a stable CSS fallback color.
- Use a deliberate `background-position`/crop policy for desktop and mobile.
- Preserve contrast behind the battle lane and quiz panel with existing surfaces/overlays.
- Do not place answer content directly into unreadable areas of the bitmap.

## Coverage Gaps

- Player defend, hurt, and victory sheets are not approved normalized candidates.
- Seven current normal monsters have no dedicated asset family.
- Four current bosses after Gatekeeper have no dedicated asset family.
- Elite art exists only for Elite Slime.
- No event illustration candidates are present.
- No physical attack, mastery, timeout, generic victory, or generic defeat effect is currently approved.

Coverage gaps use existing fallbacks and do not block controlled integration of covered identities.

## Polish Backlog

Carry forward every non-blocking item from `RUNTIME_ASSET_INVENTORY.md`. Phase 71F should verify these issues in real stage/layout context and fix only those that become visible usability defects. Planning readiness does not convert polish candidates into final-art approval.

## Recommendation

Proceed with **Phase 71H Release Candidate And Deployment Verification** only after a new explicit phase request. Keep player walk and missing player defend/hurt/victory actions dormant.
