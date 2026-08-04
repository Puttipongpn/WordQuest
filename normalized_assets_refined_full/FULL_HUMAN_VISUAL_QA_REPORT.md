# Phase 71D.4 Full Human Visual QA Report

Run date: 2026-08-03

Phase 71D.4 is a Human Visual QA decision pass over the complete Phase 71D.3/71D.3.1 candidate set. It does not approve or perform runtime integration.

## Summary

- Normalized candidates inspected: 34
- Enlarged QA previews inspected: 33
- Pass: 18
- Needs review: 14
- Fail: 2
- Event candidates present: 0
- Definite source-regeneration candidate: `ui/ui_vocabulary_card_frame.png`
- Conditional source-regeneration candidate: `bosses/gatekeeper/boss_gatekeeper_attack_sheet.png` if an explicit-region normalization rerun cannot isolate complete frames
- Recommended next phase: Phase 71D.5 Targeted Manual Cleanup / Regeneration List

Most core gameplay assets are usable candidates, but the Gatekeeper attack is a blocking core frame-slicing failure. The vocabulary card frame also fails transparency QA because its checkerboard is baked into an opaque image. Phase 71E Runtime Integration Planning is not recommended yet.

## QA Method

- Inspected every PNG under `normalized_assets_refined_full/`.
- Inspected every enlarged dark/light preview under `normalized_assets_refined_full/qa_previews/`.
- Verified actual dimensions and configured frame counts against Phase 71D.3 expectations.
- Verified transparent pixels for sprites, effects, and basic UI icons.
- Checked all configured frame cells for visible pixels touching cell boundaries; none do.
- Checked frame isolation, cross-frame slicing, scale, grounded/hover placement, static cadence, glow/contrast, visible checkerboard, text/runes/watermarks, and mobile/layout risk.
- The card frame and dungeon background are intentionally source-sized preserved candidates, so they were inspected directly rather than through frame previews.
- Static pose order can identify obvious cadence problems but does not replace later playback timing QA.

## 1. Player

| Path | Expected | Actual | Frames | Human status | Issue type | Notes | Recommended next action |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `player/player_word_mage_idle_sheet.png` | 256x64 | 256x64 | 4 | pass | clean | Transparent, isolated, grounded poses remain consistent on dark and light backgrounds. No checkerboard, text, or visible silhouette break. | keep candidate |
| `player/player_word_mage_walk_sheet.png` | 384x64 | 384x64 | 6 | pass | clean | Six complete poses read as a coherent walk cycle; scale and baseline remain stable. | keep candidate |
| `player/player_word_mage_cast_attack_sheet.png` | 384x64 | 384x64 | 6 | pass | clean | Raise, charge, cast, projectile, and recovery progression is readable. The old boundary-clipping warning is not reproduced; all cells remain inset. | keep candidate |

## 2. Monsters / Slime

| Path | Expected | Actual | Frames | Human status | Issue type | Notes | Recommended next action |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `monsters/slime/monster_slime_idle_sheet.png` | 256x64 | 256x64 | 4 | needs review | edge contamination | Cadence and grounded placement pass, but localized gray/neutral fringe remains visible on upper/right silhouette edges. | localized manual cleanup |
| `monsters/slime/monster_slime_attack_sheet.png` | 256x64 | 256x64 | 4 | needs review | edge contamination | The squash/lunge/recovery order reads correctly; the fast frame retains a few gray hard-edge pixels around the trail/silhouette. | localized manual cleanup |
| `monsters/slime/monster_slime_hit_sheet.png` | 128x64 | 128x64 | 2 | pass | clean | Two distinct hit poses are isolated, readable, and consistently grounded. | keep candidate |
| `monsters/slime/monster_slime_defeat_sheet.png` | 256x64 | 256x64 | 4 | pass | clean | Collapse and dissolve progression is complete, isolated, and readable on both backgrounds. | keep candidate |

## 3. Monsters / Bat

| Path | Expected | Actual | Frames | Human status | Issue type | Notes | Recommended next action |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `monsters/bat/monster_bat_idle_sheet.png` | 256x64 | 256x64 | 4 | pass | clean | Wing cadence and hover line are coherent; no detached source fragments remain. | keep candidate |
| `monsters/bat/monster_bat_attack_sheet.png` | 256x64 | 256x64 | 4 | pass | clean | Wind-up, dive/speed pose, and recovery read correctly. Speed lines stay isolated inside their intended frame. | keep candidate |
| `monsters/bat/monster_bat_hit_sheet.png` | 128x64 | 128x64 | 2 | needs review | edge contamination | Hit reaction is readable, but gray fringe and small neutral flecks around the wings/body remain source-ambiguous. | localized manual cleanup |
| `monsters/bat/monster_bat_defeat_sheet.png` | 256x64 | 256x64 | 4 | pass | clean | Phase 71D.3.1 explicit regions resolved the torn wings. Four complete poses and particles are isolated with internal cell padding. | keep candidate |

## 4. Monsters / Goblin

| Path | Expected | Actual | Frames | Human status | Issue type | Notes | Recommended next action |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `monsters/goblin/monster_goblin_idle_sheet.png` | 256x64 | 256x64 | 4 | needs review | edge contamination, baseline issue | Idle poses are complete, but localized gray under-foot/edge residue remains inconsistent across frames. | localized manual cleanup |
| `monsters/goblin/monster_goblin_attack_sheet.png` | 256x64 | 256x64 | 4 | pass | clean | Club wind-up, swing lines, strike, and recovery are isolated; the old edge warning is not reproduced as cross-frame slicing. | keep candidate |
| `monsters/goblin/monster_goblin_hit_sheet.png` | 128x64 | 128x64 | 2 | needs review | edge contamination | Reaction reads clearly, but gray edge/debris pixels around the silhouette need intent confirmation. | localized manual cleanup |
| `monsters/goblin/monster_goblin_defeat_sheet.png` | 256x64 | 256x64 | 4 | pass | clean | Phase 71D.3.1 explicit regions resolved torn ears/body. Staff, poses, and particles remain with their intended frames. | keep candidate |

## 5. Elite / Crystal Slime

| Path | Expected | Actual | Frames | Human status | Issue type | Notes | Recommended next action |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `elites/crystal-slime/elite_crystal_slime_idle_sheet.png` | 256x64 | 256x64 | 4 | pass | clean | Stable grounded idle with readable crystals and intentional sparkles on both backgrounds. | keep candidate |
| `elites/crystal-slime/elite_crystal_slime_attack_sheet.png` | 256x64 | 256x64 | 4 | needs review | edge contamination | Attack progression is readable, but a detached narrow green segment in the second action cell requires source-intent confirmation. | localized manual cleanup |
| `elites/crystal-slime/elite_crystal_slime_hit_sheet.png` | 128x64 | 128x64 | 2 | needs review | scale mismatch | Hit poses are isolated, but appear softer/smaller than the idle/attack silhouette and need action-to-action scale confirmation. | rerun normalization |
| `elites/crystal-slime/elite_crystal_slime_defeat_sheet.png` | 256x64 | 256x64 | 4 | pass | clean | Collapse/dissolve cadence, grounded baseline, crystals, and sparkles are coherent. | keep candidate |

## 6. Boss / Gatekeeper

| Path | Expected | Actual | Frames | Human status | Issue type | Notes | Recommended next action |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `bosses/gatekeeper/boss_gatekeeper_idle_sheet.png` | 512x128 | 512x128 | 4 | pass | clean | Clean reference quality, stable scale/baseline, readable crystal motion, and complete left-facing silhouette. | keep candidate |
| `bosses/gatekeeper/boss_gatekeeper_attack_sheet.png` | 512x128 | 512x128 | 4 | fail | frame slicing, source regeneration recommended | Frame 3/4 contains isolated vertical body/key slivers inconsistent with particles, indicating source pixels assigned to the wrong equal-width frame. This is a blocking core action defect. | rerun normalization |
| `bosses/gatekeeper/boss_gatekeeper_hit_sheet.png` | 256x128 | 256x128 | 2 | pass | clean | Both hit poses remain consistent with idle scale and baseline; the flinch and impact particles are readable. | keep candidate |
| `bosses/gatekeeper/boss_gatekeeper_defeat_sheet.png` | 512x128 | 512x128 | 4 | needs review | glow issue, contrast issue | Peaceful collapse cadence is complete, but pale dust/deactivation pixels lose presence on the light background. | keep candidate |

## 7. Effects

| Path | Expected | Actual | Frames | Human status | Issue type | Notes | Recommended next action |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `effects/effect_earth_sheet.png` | 256x64 | 256x64 | 4 | pass | clean | Grounded build/impact/release cadence is clear and readable at preview scale. | keep candidate |
| `effects/effect_fire_sheet.png` | 256x64 | 256x64 | 4 | needs review | glow issue | Core fire silhouette is strong, but hard-alpha pale glow/particles become weak on light backgrounds. | localized manual cleanup |
| `effects/effect_shield_block_sheet.png` | 256x64 | 256x64 | 4 | pass | clean | Book/barrier formation and dissolve are readable; teal/gold silhouette survives both backgrounds. | keep candidate |
| `effects/effect_upgrade_spark_sheet.png` | 256x64 | 256x64 | 4 | pass | clean | Expansion and dispersal cadence is readable; primary gold star remains visible on both backgrounds. | keep candidate |
| `effects/effect_water_sheet.png` | 256x64 | 256x64 | 4 | pass | clean | Droplet/wave cycle has strong contrast, complete frames, and no visible contamination. | keep candidate |
| `effects/effect_wind_sheet.png` | 256x64 | 256x64 | 4 | needs review | contrast issue | Swirl cadence is readable on dark, but pale mint lines and particles lose presence on light backgrounds. | localized manual cleanup |

## 8. UI / Card

| Path | Expected | Actual | Frames | Human status | Issue type | Notes | Recommended next action |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `ui/ui_gold_coin.png` | 64x64 | 64x64 | 1 | needs review | edge contamination | Icon is readable at native intent, but localized neutral fringe remains around the outer edge. | localized manual cleanup |
| `ui/ui_heart_hp.png` | 64x64 | 64x64 | 1 | needs review | edge contamination | Strong icon silhouette, but gray pixels are visible at the top, left, and lower point on both preview rows. | localized manual cleanup |
| `ui/ui_shield.png` | 64x64 | 64x64 | 1 | needs review | edge contamination | Shield remains readable, but gray fringe is visible around the top/right/bottom outline. | localized manual cleanup |
| `ui/ui_vocabulary_card_frame.png` | preserve 1058x1487 | 1058x1487 | 1 | fail | transparency issue, source regeneration recommended | The image is fully opaque and visibly contains a baked checkerboard outside the decorative frame. Text-safe interior is generous, but transparency QA fails. | regenerate true-transparent source |

## 9. Backgrounds

| Path | Expected | Actual | Frames | Human status | Issue type | Notes | Recommended next action |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `backgrounds/background_dungeon_battle_01.png` | preserve 1672x941 | 1672x941 | 1 | needs review | responsive/layout issue | Clear battle staging and no text/watermark contamination. Responsive crop, quiz contrast, mobile framing, and painterly-vs-sprite pixel-art consistency require layout-context QA. | defer until runtime layout QA |

## 10. Events

No event PNGs are present under `normalized_assets_refined_full/events/`. No event status was assigned. Event overlay, anti-spoiler, and mobile-layout QA remain deferred until event candidates exist.

## Manual Cleanup Candidates

- `monsters/slime/monster_slime_idle_sheet.png`
- `monsters/slime/monster_slime_attack_sheet.png`
- `monsters/bat/monster_bat_hit_sheet.png`
- `monsters/goblin/monster_goblin_idle_sheet.png`
- `monsters/goblin/monster_goblin_hit_sheet.png`
- `elites/crystal-slime/elite_crystal_slime_attack_sheet.png`
- `effects/effect_fire_sheet.png`
- `effects/effect_wind_sheet.png`
- `ui/ui_gold_coin.png`
- `ui/ui_heart_hp.png`
- `ui/ui_shield.png`

## Regeneration And Rerun Candidates

- `ui/ui_vocabulary_card_frame.png`: regenerate a true-transparent source; current baked checkerboard is a hard failure.
- `bosses/gatekeeper/boss_gatekeeper_attack_sheet.png`: first rerun normalization with explicit nonuniform source regions. Regenerate the true-transparent source only if complete logical frames cannot be isolated safely.
- `elites/crystal-slime/elite_crystal_slime_hit_sheet.png`: rerun normalization or adjust configured action scale after confirming the intended source bounds.

## Decision Gate

Recommend **Phase 71D.5 Targeted Manual Cleanup / Regeneration List**.

Do not begin Phase 71E Runtime Integration Planning yet. Most core gameplay assets pass, but Gatekeeper attack is a blocking core frame-slicing failure and the vocabulary card frame is not transparent. Phase 71D.5 should correct those failures first, then address or explicitly defer the localized needs-review list and repeat focused Human Visual QA.

## Safety

- Phase 71D.3/71D.3.1 files remain normalized candidates, not runtime assets.
- Runtime integration remains prohibited.
- `src/assets/` remains absent/unused.
- No normalized PNG was altered during Phase 71D.4 Human Visual QA.
- No React import, asset manifest, animation playback, gameplay, save, combat, progression, deployment, or runtime asset code changed.
