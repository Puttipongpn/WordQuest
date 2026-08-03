# Phase 71D Visual QA Report

Date: 2026-07-30

Scope: Visual QA of Phase 71C outputs under `normalized_assets/` only.

Runtime integration remains prohibited. These files are normalization candidates, not approved runtime assets.

## Overall Result

- Files inspected: 34
- Pass: 0
- Needs review: 1
- Fail: 33
- Event outputs inspected: 0
- Phase 71E readiness: blocked

All 34 PNG files were readable. Target canvas dimensions were checked against the Phase 71D rules. Contact-sheet inspection was used to review every sprite/effect/UI output at enlarged nearest-neighbor scale, and the background was inspected directly.

The dominant blocking issue is baked checkerboard/opaque preview background inside sprite, effect, UI icon, and card-frame outputs. Although most normalized PNGs have an alpha channel, the checkerboard pixels remain visible and are not transparent.

No obvious readable text, letters, numbers, runes, labels, or watermarks were observed in the inspected art. This does not override the background, frame-splitting, crop, scale, or alignment failures below.

## Player Normalized QA Summary

- Batch result: fail.
- All three outputs have visible baked checkerboard/preview backgrounds.
- Idle and walk remain useful visual anchors at the source-art level, but their normalized outputs are not integration-ready.
- Cast/attack frame 5 reaches or clips the right frame edge and still needs source/action polish.
- `player_word_mage_defend_sheet.png` has no normalized output and remains pending review.

| Path | Detected | Expected | Status | Notes | Recommended action |
| --- | ---: | ---: | --- | --- | --- |
| `normalized_assets/player/player_word_mage_cast_attack_sheet.png` | 384x64 | 384x64 (6x64) | fail | Dimensions/frame count match the inferred six-frame source. Baked checkerboard remains. The spell effect in frame 5 reaches/clips the right edge. Ground baseline is broadly stable. | polish source later; rerun normalization |
| `normalized_assets/player/player_word_mage_idle_sheet.png` | 256x64 | 256x64 (4x64) | fail | Dimensions and four-frame count match. Scale/baseline are reasonable, but the checkerboard is baked into every frame. | polish source later; rerun normalization |
| `normalized_assets/player/player_word_mage_walk_sheet.png` | 384x64 | 384x64 (6x64) | fail | Dimensions and six-frame count match. Baseline is broadly stable, but the baked checkerboard remains. | polish source later; rerun normalization |

## Monster Normalized QA Summary

- Batch result: fail.
- All opaque-source outputs retain baked checkerboard/preview backgrounds.
- Slime idle/attack and Bat idle were incorrectly treated as three equal-square frames; visible sprites cross or are cut by frame boundaries.
- Bat and Goblin defeat sheets show severe frame-boundary slicing from the source layout.
- Bat attack/hit retain a reasonable hover read, but transparency still fails.
- Hit sheets need scale/spacing review after source cleanup.

| Path | Detected | Expected | Status | Notes | Recommended action |
| --- | ---: | ---: | --- | --- | --- |
| `normalized_assets/monsters/slime/monster_slime_attack_sheet.png` | 192x64 | 256x64 (4x64) | fail | Wrong inferred three-frame layout. Slime art is visibly split across frame boundaries; checkerboard remains. | rerun normalization |
| `normalized_assets/monsters/slime/monster_slime_defeat_sheet.png` | 256x64 | 256x64 (4x64) | fail | Dimensions/count match and grounded progression reads, but checkerboard remains. | polish source later; rerun normalization |
| `normalized_assets/monsters/slime/monster_slime_hit_sheet.png` | 128x64 | 128x64 (2x64) | fail | Dimensions/count match. Scale is broadly usable, but checkerboard remains and spacing needs recheck after cleanup. | polish source later; rerun normalization |
| `normalized_assets/monsters/slime/monster_slime_idle_sheet.png` | 192x64 | 256x64 (4x64) | fail | Wrong inferred three-frame layout with visible cross-frame slices; checkerboard remains. | rerun normalization |
| `normalized_assets/monsters/bat/monster_bat_attack_sheet.png` | 256x64 | 256x64 (4x64) | fail | Dimensions/count match and hover placement is readable, but checkerboard remains. | polish source later; rerun normalization |
| `normalized_assets/monsters/bat/monster_bat_defeat_sheet.png` | 256x64 | 256x64 (4x64) | fail | Severe frame-boundary slicing and stray fragments. Dark/glow background cleanup is still needed. | rerun normalization |
| `normalized_assets/monsters/bat/monster_bat_hit_sheet.png` | 128x64 | 128x64 (2x64) | fail | Dimensions/count match and hover feel remains, but checkerboard remains; scale/spacing needs recheck after cleanup. | polish source later; rerun normalization |
| `normalized_assets/monsters/bat/monster_bat_idle_sheet.png` | 192x64 | 256x64 (4x64) | fail | Wrong inferred three-frame layout with bats cut at boundaries; checkerboard remains. | rerun normalization |
| `normalized_assets/monsters/goblin/monster_goblin_attack_sheet.png` | 256x64 | 256x64 (4x64) | fail | Dimensions/count match, but weapon/action pixels cross or clip at frame edges; checkerboard remains. | rerun normalization |
| `normalized_assets/monsters/goblin/monster_goblin_defeat_sheet.png` | 256x64 | 256x64 (4x64) | fail | Severe frame-boundary slicing and inconsistent visible fragments. | rerun normalization |
| `normalized_assets/monsters/goblin/monster_goblin_hit_sheet.png` | 128x64 | 128x64 (2x64) | fail | Dimensions/count match, but sprite reads small relative to other Goblin actions and checkerboard remains. | polish source later; rerun normalization |
| `normalized_assets/monsters/goblin/monster_goblin_idle_sheet.png` | 256x64 | 256x64 (4x64) | fail | Dimensions/count and grounded scale are reasonable, but checkerboard remains. | polish source later; rerun normalization |

## Effects Normalized QA Summary

- Batch result: fail.
- All effects are compact and four-frame dimensions match.
- Earth remains low/grounded and readable.
- Shield Block retains its book-like barrier identity.
- Wind remains visually lighter/weaker than the other effects.
- Every effect output still contains a visible checkerboard/preview background.

| Path | Detected | Expected | Status | Notes | Recommended action |
| --- | ---: | ---: | --- | --- | --- |
| `normalized_assets/effects/effect_earth_sheet.png` | 256x64 | 256x64 (4x64) | fail | Correct size/count and grounded placement. Scale is slightly heavy but contained. Checkerboard remains. | polish source later; rerun normalization |
| `normalized_assets/effects/effect_fire_sheet.png` | 256x64 | 256x64 (4x64) | fail | Correct size/count; compact and readable. Checkerboard remains. | polish source later; rerun normalization |
| `normalized_assets/effects/effect_shield_block_sheet.png` | 256x64 | 256x64 (4x64) | fail | Correct size/count; book-like barrier remains readable. Checkerboard remains. | polish source later; rerun normalization |
| `normalized_assets/effects/effect_upgrade_spark_sheet.png` | 256x64 | 256x64 (4x64) | fail | Correct size/count and compact effect bounds. Checkerboard remains. | polish source later; rerun normalization |
| `normalized_assets/effects/effect_water_sheet.png` | 256x64 | 256x64 (4x64) | fail | Correct size/count and readable water motion. Checkerboard remains. | polish source later; rerun normalization |
| `normalized_assets/effects/effect_wind_sheet.png` | 256x64 | 256x64 (4x64) | fail | Correct size/count, but contrast/presence remains weak and checkerboard remains. | polish source later; rerun normalization |

## UI, Card, And Background Normalized QA Summary

- UI icon dimensions match 64x64, but all three contain visible baked background pixels.
- The card frame preserved its source dimensions but visibly contains checkerboard around the frame and still needs UI text-readability testing.
- The dungeon background is readable and keeps a useful open center, but differs from the provisional 1536x864 expectation and requires responsive crop and pixel-art consistency review.

| Path | Detected | Expected | Status | Notes | Recommended action |
| --- | ---: | ---: | --- | --- | --- |
| `normalized_assets/ui/ui_gold_coin.png` | 64x64 | 64x64 | fail | Icon is readable and centered, but the square background is opaque rather than transparent. | polish source later; rerun normalization |
| `normalized_assets/ui/ui_heart_hp.png` | 64x64 | 64x64 | fail | Icon is readable and centered, but checkerboard pixels remain. | polish source later; rerun normalization |
| `normalized_assets/ui/ui_shield.png` | 64x64 | 64x64 | fail | Icon is readable and centered, but checkerboard pixels remain. | polish source later; rerun normalization |
| `normalized_assets/ui/ui_vocabulary_card_frame.png` | 1058x1487 | preserve source dimensions | fail | Source dimensions were preserved, but checkerboard remains around the frame. UI text readability is untested. | polish source later; rerun normalization |
| `normalized_assets/backgrounds/background_dungeon_battle_01.png` | 1672x941 | preserve source; provisional 1536x864 | needs review | Readable wide dungeon with useful central UI space. Requires responsive/mobile crop tests and pixel-art consistency review; dimensions differ from the provisional target. | manual QA needed |

## Boss Normalized QA Summary

- Batch result: fail.
- All canvas dimensions and frame counts match expected targets.
- Scale is broadly consistent, though Hit reads smaller than Idle/Attack.
- Attack frame 3 reaches/crosses the right frame edge.
- Every boss output retains a visible baked checkerboard/preview background.

| Path | Detected | Expected | Status | Notes | Recommended action |
| --- | ---: | ---: | --- | --- | --- |
| `normalized_assets/bosses/gatekeeper/boss_gatekeeper_attack_sheet.png` | 512x128 | 512x128 (4x128) | fail | Correct dimensions/count. Frame 3 attack/effect reaches the cell edge and appears clipped/cross-boundary; checkerboard remains. | rerun normalization |
| `normalized_assets/bosses/gatekeeper/boss_gatekeeper_defeat_sheet.png` | 512x128 | 512x128 (4x128) | fail | Correct dimensions/count and grounded defeat progression, but checkerboard remains. | polish source later; rerun normalization |
| `normalized_assets/bosses/gatekeeper/boss_gatekeeper_hit_sheet.png` | 256x128 | 256x128 (2x128) | fail | Correct dimensions/count. Hit scale is smaller than other boss actions and checkerboard remains. | polish source later; rerun normalization |
| `normalized_assets/bosses/gatekeeper/boss_gatekeeper_idle_sheet.png` | 512x128 | 512x128 (4x128) | fail | Correct dimensions/count and stable grounded baseline, but checkerboard remains. | polish source later; rerun normalization |

## Event Normalized QA Summary

- No PNG files exist under `normalized_assets/events/`.
- `event_healing_shrine_01.png`, `event_strange_altar_01.png`, and `event_treasure_chest_01.png` were not available for normalized-output QA.
- Healing Shrine differentiation remains a future source-polish concern.

## Elite Normalized QA Summary

- Batch result: fail.
- All dimensions/frame counts match.
- Grounded scale is broadly consistent and Hit spacing is usable enough for later recheck.
- Some attack pixels approach the frame boundary.
- Every output retains visible baked checkerboard/preview background pixels.

| Path | Detected | Expected | Status | Notes | Recommended action |
| --- | ---: | ---: | --- | --- | --- |
| `normalized_assets/elites/crystal-slime/elite_crystal_slime_attack_sheet.png` | 256x64 | 256x64 (4x64) | fail | Correct dimensions/count and grounded action read. Some motion pixels approach the cell boundary; checkerboard remains. | polish source later; rerun normalization |
| `normalized_assets/elites/crystal-slime/elite_crystal_slime_defeat_sheet.png` | 256x64 | 256x64 (4x64) | fail | Correct dimensions/count and readable gentle defeat progression, but checkerboard remains. | polish source later; rerun normalization |
| `normalized_assets/elites/crystal-slime/elite_crystal_slime_hit_sheet.png` | 128x64 | 128x64 (2x64) | fail | Correct dimensions/count; scale/spacing are broadly consistent but checkerboard remains. | polish source later; rerun normalization |
| `normalized_assets/elites/crystal-slime/elite_crystal_slime_idle_sheet.png` | 256x64 | 256x64 (4x64) | fail | Correct dimensions/count and stable grounded scale, but checkerboard remains. | polish source later; rerun normalization |

## Blocking Findings

1. Remove or replace baked checkerboard/preview backgrounds at the source level without damaging outlines, glows, particles, or semi-transparent pixels.
2. Replace aspect-ratio-only frame inference with explicit per-file frame-count/layout metadata before rerunning normalization.
3. Rework or manually split Slime idle/attack, Bat idle/defeat, Goblin defeat, and any attack frames whose art crosses cell boundaries.
4. Recheck hit-sheet scale against idle/attack anchors after cleanup.
5. Test the card frame with real English/Thai content and the background with responsive event/battle UI before approval.

## Phase 71E Gate

Phase 71E must not proceed as runtime integration. A cleanup and normalization-correction phase is required first. After corrected outputs are generated, repeat Phase 71D visual QA and require explicit human approval before any asset enters `src/assets/`.
