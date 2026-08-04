# Runtime Asset Inventory

## Phase 71E Scope

This inventory began as the Phase 71E planning artifact. Phase 71F.1 has now copied every listed candidate into `src/assets/`; the implementation status below supersedes the original planning-only copy state.

The inventory contains 34 logical candidates:

- 18 clean candidates that passed Phase 71D.4 Human Visual QA.
- 14 usable candidates with non-blocking polish or layout backlog items.
- 2 targeted candidates that resolved the Phase 71D.4 blocking failures in Phase 71D.5.
- 0 event illustration candidates.

Readiness labels:

- **Ready candidate**: clean Human QA result and suitable for later controlled integration.
- **Ready candidate, polish backlog**: usable for integration planning; the recorded visual issue remains non-blocking.
- **Targeted ready candidate**: a Phase 71D.5 replacement that resolved a blocking defect.
- **Layout-QA candidate**: usable source candidate, but final use depends on responsive runtime composition.

These labels describe visual-source readiness. A runtime copy is still not production-final art, and only the six idle identities listed below are currently wired into presentation.

## Phase 71F.1 Runtime Copy Status

All 34 logical candidates were copied to the proposed runtime tree. A SHA-256 audit produced 34 matching source/destination pairs and no mismatches.

| Category | Files copied | Runtime destination |
| --- | ---: | --- |
| Player | 3 | `src/assets/sprites/player/word-mage/` |
| Normal monsters | 12 | `src/assets/sprites/monsters/{slime,bat,goblin}/` |
| Elite | 4 | `src/assets/sprites/elites/crystal-slime/` |
| Boss | 4 | `src/assets/sprites/bosses/gatekeeper/` |
| Effects | 6 | `src/assets/effects/{elemental,defense,feedback}/` |
| UI frame | 1 | `src/assets/ui/frames/` |
| UI icons | 3 | `src/assets/ui/icons/` |
| Background | 1 | `src/assets/backgrounds/battle/` |
| Events | 0 | `src/assets/events/` reserved for future coverage |

Authoritative copy sources:

- Gatekeeper attack: `normalized_assets_refined_targeted/bosses/gatekeeper/boss_gatekeeper_attack_sheet.png`.
- Vocabulary card frame: `normalized_assets_refined_targeted/ui/ui_vocabulary_card_frame.png`.
- Other 32 files: their corresponding paths under `normalized_assets_refined_full/`.
- Raw `Asset/` files: never used as runtime import sources.

Phase 71F.1 runtime wiring is limited to the following six static first-frame identities:

| Identity | Imported runtime file | Runtime status |
| --- | --- | --- |
| Word Mage | `src/assets/sprites/player/word-mage/player_word_mage_idle_sheet.png` | Static first frame rendered |
| `monster-slime` | `src/assets/sprites/monsters/slime/monster_slime_idle_sheet.png` | Static first frame rendered |
| `monster-bat` | `src/assets/sprites/monsters/bat/monster_bat_idle_sheet.png` | Static first frame rendered |
| `monster-goblin` | `src/assets/sprites/monsters/goblin/monster_goblin_idle_sheet.png` | Static first frame rendered |
| `elite-monster-slime` | `src/assets/sprites/elites/crystal-slime/elite_crystal_slime_idle_sheet.png` | Static first frame rendered |
| `boss-gatekeeper` | `src/assets/sprites/bosses/gatekeeper/boss_gatekeeper_idle_sheet.png` | Static first frame rendered |

Every other copied file remains dormant: it has a stable runtime path but no import, renderer mapping, playback, or gameplay effect in Phase 71F.1.

## Player

| File name | Current source path | Intended runtime usage | Frames | Expected frame size | Readiness | Notes |
| --- | --- | --- | ---: | --- | --- | --- |
| `player_word_mage_idle_sheet.png` | `normalized_assets_refined_full/player/player_word_mage_idle_sheet.png` | Default Word Mage battle/encounter idle | 4 | `64x64` | Ready candidate | Grounded, faces right, looping presentation. |
| `player_word_mage_walk_sheet.png` | `normalized_assets_refined_full/player/player_word_mage_walk_sheet.png` | Non-combat movement or encounter transition presentation | 6 | `64x64` | Ready candidate | Grounded walk cycle; no movement mechanic is implied. |
| `player_word_mage_cast_attack_sheet.png` | `normalized_assets_refined_full/player/player_word_mage_cast_attack_sheet.png` | One-shot cast after an existing correct-answer/card-trigger resolution | 6 | `64x64` | Ready candidate | Must never play before answer resolution or reveal the triggered card. |

Coverage gap: no approved normalized defend, hurt, or victory player sheets currently exist. Later integration must retain a static/idle fallback for those states.

## Monsters

### Slime

| File name | Current source path | Intended runtime usage | Frames | Expected frame size | Readiness | Notes |
| --- | --- | --- | ---: | --- | --- | --- |
| `monster_slime_idle_sheet.png` | `normalized_assets_refined_full/monsters/slime/monster_slime_idle_sheet.png` | `monster-slime` default idle | 4 | `64x64` | Ready candidate, polish backlog | Localized neutral edge fringe. |
| `monster_slime_attack_sheet.png` | `normalized_assets_refined_full/monsters/slime/monster_slime_attack_sheet.png` | One-shot attack after existing enemy damage resolution | 4 | `64x64` | Ready candidate, polish backlog | Localized hard-edge/trail fringe. |
| `monster_slime_hit_sheet.png` | `normalized_assets_refined_full/monsters/slime/monster_slime_hit_sheet.png` | One-shot reaction after confirmed card damage | 2 | `64x64` | Ready candidate | Grounded hit reaction. |
| `monster_slime_defeat_sheet.png` | `normalized_assets_refined_full/monsters/slime/monster_slime_defeat_sheet.png` | One-shot defeat after HP reaches zero | 4 | `64x64` | Ready candidate | Complete collapse/dissolve order. |

### Bat

| File name | Current source path | Intended runtime usage | Frames | Expected frame size | Readiness | Notes |
| --- | --- | --- | ---: | --- | --- | --- |
| `monster_bat_idle_sheet.png` | `normalized_assets_refined_full/monsters/bat/monster_bat_idle_sheet.png` | `monster-bat` default idle | 4 | `64x64` | Ready candidate | Uses a hover baseline and faces left. |
| `monster_bat_attack_sheet.png` | `normalized_assets_refined_full/monsters/bat/monster_bat_attack_sheet.png` | One-shot attack after existing enemy damage resolution | 4 | `64x64` | Ready candidate | Speed lines stay in their intended frame. |
| `monster_bat_hit_sheet.png` | `normalized_assets_refined_full/monsters/bat/monster_bat_hit_sheet.png` | One-shot reaction after confirmed card damage | 2 | `64x64` | Ready candidate, polish backlog | Localized gray fringe/flecks. |
| `monster_bat_defeat_sheet.png` | `normalized_assets_refined_full/monsters/bat/monster_bat_defeat_sheet.png` | One-shot defeat after HP reaches zero | 4 | `64x64` | Ready candidate | Phase 71D.3.1 nonuniform regions preserve complete wings. |

### Goblin

| File name | Current source path | Intended runtime usage | Frames | Expected frame size | Readiness | Notes |
| --- | --- | --- | ---: | --- | --- | --- |
| `monster_goblin_idle_sheet.png` | `normalized_assets_refined_full/monsters/goblin/monster_goblin_idle_sheet.png` | `monster-goblin` default idle | 4 | `64x64` | Ready candidate, polish backlog | Localized edge and under-foot residue. |
| `monster_goblin_attack_sheet.png` | `normalized_assets_refined_full/monsters/goblin/monster_goblin_attack_sheet.png` | One-shot attack after existing enemy damage resolution | 4 | `64x64` | Ready candidate | Club swing/action pixels remain frame-isolated. |
| `monster_goblin_hit_sheet.png` | `normalized_assets_refined_full/monsters/goblin/monster_goblin_hit_sheet.png` | One-shot reaction after confirmed card damage | 2 | `64x64` | Ready candidate, polish backlog | Localized gray edge/debris pixels. |
| `monster_goblin_defeat_sheet.png` | `normalized_assets_refined_full/monsters/goblin/monster_goblin_defeat_sheet.png` | One-shot defeat after HP reaches zero | 4 | `64x64` | Ready candidate | Phase 71D.3.1 regions preserve ears, body, staff, and particles. |

Coverage gap: current monsters `monster-wolf`, `monster-mushroom`, `monster-wisp`, `monster-skeleton`, `monster-imp`, `monster-stone-bug`, and `monster-dark-crow` have no normalized art candidate and must keep the existing placeholder fallback.

## Elites

| File name | Current source path | Intended runtime usage | Frames | Expected frame size | Readiness | Notes |
| --- | --- | --- | ---: | --- | --- | --- |
| `elite_crystal_slime_idle_sheet.png` | `normalized_assets_refined_full/elites/crystal-slime/elite_crystal_slime_idle_sheet.png` | Default presentation for `elite-monster-slime` | 4 | `64x64` | Ready candidate | Grounded crystal idle with intentional sparkles. |
| `elite_crystal_slime_attack_sheet.png` | `normalized_assets_refined_full/elites/crystal-slime/elite_crystal_slime_attack_sheet.png` | One-shot elite attack after existing enemy damage resolution | 4 | `64x64` | Ready candidate, polish backlog | Detached narrow green segment needs intent review. |
| `elite_crystal_slime_hit_sheet.png` | `normalized_assets_refined_full/elites/crystal-slime/elite_crystal_slime_hit_sheet.png` | One-shot reaction after confirmed card damage | 2 | `64x64` | Ready candidate, polish backlog | Action-to-action scale mismatch review. |
| `elite_crystal_slime_defeat_sheet.png` | `normalized_assets_refined_full/elites/crystal-slime/elite_crystal_slime_defeat_sheet.png` | One-shot elite defeat after HP reaches zero | 4 | `64x64` | Ready candidate | Complete collapse/dissolve order. |

Crystal Slime is a presentation mapping for Elite Slime only. Other generated elite IDs must keep their existing normal-monster/placeholder presentation unless a later asset phase provides matching art.

## Bosses

| File name | Current source path | Intended runtime usage | Frames | Expected frame size | Readiness | Notes |
| --- | --- | --- | ---: | --- | --- | --- |
| `boss_gatekeeper_idle_sheet.png` | `normalized_assets_refined_full/bosses/gatekeeper/boss_gatekeeper_idle_sheet.png` | `boss-gatekeeper` default idle | 4 | `128x128` | Ready candidate | Grounded, stable scale, faces left. |
| `boss_gatekeeper_attack_sheet.png` | `normalized_assets_refined_targeted/bosses/gatekeeper/boss_gatekeeper_attack_sheet.png` | One-shot Gatekeeper attack after existing boss damage resolution | 4 | `128x128` | Targeted ready candidate | Nonuniform source regions fixed slicing; thin frame 2-3 ground/shadow traces remain polish. |
| `boss_gatekeeper_hit_sheet.png` | `normalized_assets_refined_full/bosses/gatekeeper/boss_gatekeeper_hit_sheet.png` | One-shot reaction after confirmed card damage | 2 | `128x128` | Ready candidate | Scale and baseline passed Phase 71D.4 Human QA. |
| `boss_gatekeeper_defeat_sheet.png` | `normalized_assets_refined_full/bosses/gatekeeper/boss_gatekeeper_defeat_sheet.png` | One-shot deactivation after boss HP reaches zero | 4 | `128x128` | Ready candidate, polish backlog | Pale dust has weak light-background contrast. |

Coverage gap: `boss-word-warden`, `boss-grammar-golem`, `boss-shadow-reader`, and `boss-memory-dragon` have no normalized art candidates and must retain existing placeholder fallbacks. Gatekeeper attack art does not add or represent a new boss mechanic.

## Effects

| File name | Current source path | Intended runtime usage | Frames | Expected frame size | Readiness | Notes |
| --- | --- | --- | ---: | --- | --- | --- |
| `effect_earth_sheet.png` | `normalized_assets_refined_full/effects/effect_earth_sheet.png` | Existing Earth element result feedback | 4 | `64x64` | Ready candidate | Lower/grounded placement. |
| `effect_fire_sheet.png` | `normalized_assets_refined_full/effects/effect_fire_sheet.png` | Existing Fire element result feedback | 4 | `64x64` | Ready candidate, polish backlog | Hard-alpha glow and pale particles need polish. |
| `effect_shield_block_sheet.png` | `normalized_assets_refined_full/effects/effect_shield_block_sheet.png` | Existing shield gain/block result feedback | 4 | `64x64` | Ready candidate | Teal/gold barrier remains readable. |
| `effect_upgrade_spark_sheet.png` | `normalized_assets_refined_full/effects/effect_upgrade_spark_sheet.png` | Successful existing Shop upgrade feedback | 4 | `64x64` | Ready candidate | Play only after purchase succeeds. |
| `effect_water_sheet.png` | `normalized_assets_refined_full/effects/effect_water_sheet.png` | Existing Water element result feedback | 4 | `64x64` | Ready candidate | Strong contrast on dark/light backgrounds. |
| `effect_wind_sheet.png` | `normalized_assets_refined_full/effects/effect_wind_sheet.png` | Existing Wind element result feedback | 4 | `64x64` | Ready candidate, polish backlog | Pale mint detail loses presence on light backgrounds. |

Effects are result feedback only. They must not run before answer checking, imply extra damage/status, or obscure quiz controls.

## UI

| File name | Current source path | Intended runtime usage | Frames | Expected dimensions | Readiness | Notes |
| --- | --- | --- | ---: | --- | --- | --- |
| `ui_vocabulary_card_frame.png` | `normalized_assets_refined_targeted/ui/ui_vocabulary_card_frame.png` | Optional vocabulary-card presentation frame | 1 | `1058x1487` preserved | Targeted ready candidate | Exterior alpha fixed; runtime text-safe inset, scaling, and mobile readability remain layout QA. |

The card frame is optional presentation. Existing card content must remain usable without it.

## Icons

| File name | Current source path | Intended runtime usage | Frames | Expected dimensions | Readiness | Notes |
| --- | --- | --- | ---: | --- | --- | --- |
| `ui_gold_coin.png` | `normalized_assets_refined_full/ui/ui_gold_coin.png` | Gold/reward/shop icon | 1 | `64x64` | Ready candidate, polish backlog | Localized neutral outer fringe. |
| `ui_heart_hp.png` | `normalized_assets_refined_full/ui/ui_heart_hp.png` | Player HP icon | 1 | `64x64` | Ready candidate, polish backlog | Gray pixels remain at several outer edges. |
| `ui_shield.png` | `normalized_assets_refined_full/ui/ui_shield.png` | Shield value icon | 1 | `64x64` | Ready candidate, polish backlog | Localized gray outer fringe. |

Icons must remain supplementary to readable text/values and cannot become the only accessible status indicator.

## Backgrounds

| File name | Current source path | Intended runtime usage | Frames | Expected dimensions | Readiness | Notes |
| --- | --- | --- | ---: | --- | --- | --- |
| `background_dungeon_battle_01.png` | `normalized_assets_refined_full/backgrounds/background_dungeon_battle_01.png` | Optional Dungeon battle-stage background | 1 | `1672x941` preserved | Layout-QA candidate | Responsive crop, quiz contrast, mobile framing, and pixel-art consistency remain deferred. |

The background must be introduced behind existing readable battle/quiz surfaces with a CSS fallback color and must never hide controls or answer content.

## Event Illustrations

No event PNG candidates are present. Treasure Chest, Healing Shrine, and Strange Altar must retain their current presentation until a later asset batch and Human QA pass provide approved candidates.

## Source Precedence

Later integration planning must resolve each logical asset from one authoritative candidate path:

1. Use `normalized_assets_refined_targeted/` for Gatekeeper attack and the vocabulary card frame.
2. Use `normalized_assets_refined_full/` for every other asset in this inventory.
3. Never import from `Asset/`, `normalized_assets/`, `normalized_assets_fixed/`, or `normalized_assets_refined/`.
4. Never combine the obsolete full-run Gatekeeper attack/card-frame candidates with their targeted replacements.

## Non-Blocking Polish Backlog

- Slime idle/attack edge fringe.
- Bat hit edge fringe/flecks.
- Goblin idle/hit edge and under-foot residue.
- Elite Crystal Slime attack detached green segment.
- Elite Crystal Slime hit scale consistency.
- Gatekeeper attack frame 2-3 neutral ground/shadow traces.
- Gatekeeper defeat pale dust contrast.
- Fire hard-alpha glow and pale particles.
- Wind light-background contrast.
- Gold, HP, and Shield icon edge fringe.
- Vocabulary card-frame text-safe inset, scaling, and mobile readability.
- Dungeon background responsive crop, contrast, mobile composition, and style consistency.

These items do not block Phase 71F planning readiness. They must remain visible in implementation QA and can be promoted to blockers if real layout/playback testing exposes a usability problem.
