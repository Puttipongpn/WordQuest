# Runtime Integration Mapping

## Phase 71E Scope

This specification began as the Phase 71E mapping plan. Phase 71F.1 implemented static identities, Phase 71F.2 implemented cast/hit, and Phase 71F.3 now implements only mapped enemy attack presentation. Defeat, effects, walk, UI, card-frame, and background mappings later in this document remain planning-only.

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
| Positive-damage correct result; enemy HP is zero | Word Mage cast one-shot | Idle; defeat playback is not wired | Result actions remain immediately available |
| Wrong answer or timeout | Idle | Idle; enemy attack is not wired | Existing damage/result flow is unchanged |
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

At the Phase 71F.2 checkpoint the registry imported cast and hit only. Phase 71F.3 adds mapped enemy attack only. Walk, defeat, effect, UI, icon, card-frame, and background files remain dormant.

Recommended next phase: **Phase 71F.4 Controlled Enemy Defeat Animation Slice**. It should derive presentation only after authoritative encounter HP reaches zero, retain immediate result actions, and preserve every fallback/non-blocking ownership rule.

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
- Optional vocabulary-card presentation -> targeted `ui_vocabulary_card_frame`
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

Proceed to **Phase 71F Controlled Runtime Integration**, starting with static battle identities and explicit fallbacks. Do not start implementation without a new explicit phase request.
