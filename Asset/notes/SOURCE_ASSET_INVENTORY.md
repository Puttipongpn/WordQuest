# Source Asset Inventory

## Phase

Phase 71B.1 - Organize Source Asset Folder

Date: 2026-07-29

## Source-Only Reminder

`Asset/` contains generated production source/reference candidates only. These files remain unnormalized and are not runtime-ready.

`src/assets/` remains reserved for future normalized runtime-ready exports during a later explicit integration phase. Do not import files directly from `Asset/`.

No image content was edited, normalized, resized, cropped, or recompressed during Phase 71B.1.

## Folder Structure

```text
Asset/
  player/
  monsters/
    slime/
    bat/
    goblin/
  elites/
    crystal-slime/
  bosses/
    gatekeeper/
  effects/
  ui/
  backgrounds/
  events/
  incoming/
  rejected/
  notes/
```

## Moved Files

### Player

- `player/player_word_mage_cast_attack_sheet.png`
- `player/player_word_mage_idle_sheet.png`
- `player/player_word_mage_walk_sheet.png`

### Normal Monster - Slime

- `monsters/slime/monster_slime_attack_sheet.png`
- `monsters/slime/monster_slime_defeat_sheet.png`
- `monsters/slime/monster_slime_hit_sheet.png`
- `monsters/slime/monster_slime_idle_sheet.png`

### Normal Monster - Bat

- `monsters/bat/monster_bat_attack_sheet.png`
- `monsters/bat/monster_bat_defeat_sheet.png`
- `monsters/bat/monster_bat_hit_sheet.png`
- `monsters/bat/monster_bat_idle_sheet.png`

### Normal Monster - Goblin

- `monsters/goblin/monster_goblin_attack_sheet.png`
- `monsters/goblin/monster_goblin_defeat_sheet.png`
- `monsters/goblin/monster_goblin_hit_sheet.png`
- `monsters/goblin/monster_goblin_idle_sheet.png`

### Elite - Crystal Slime

- `elites/crystal-slime/elite_crystal_slime_attack_sheet.png`
- `elites/crystal-slime/elite_crystal_slime_defeat_sheet.png`
- `elites/crystal-slime/elite_crystal_slime_hit_sheet.png`
- `elites/crystal-slime/elite_crystal_slime_idle_sheet.png`

### Boss - Gatekeeper

- `bosses/gatekeeper/boss_gatekeeper_attack_sheet.png`
- `bosses/gatekeeper/boss_gatekeeper_defeat_sheet.png`
- `bosses/gatekeeper/boss_gatekeeper_hit_sheet.png`
- `bosses/gatekeeper/boss_gatekeeper_idle_sheet.png`

### Effects

- `effects/effect_earth_sheet.png`
- `effects/effect_fire_sheet.png`
- `effects/effect_shield_block_sheet.png`
- `effects/effect_upgrade_spark_sheet.png`
- `effects/effect_water_sheet.png`
- `effects/effect_wind_sheet.png`

### UI

- `ui/ui_gold_coin.png`
- `ui/ui_heart_hp.png`
- `ui/ui_shield.png`
- `ui/ui_vocabulary_card_frame.png`

### Backgrounds

- `backgrounds/background_dungeon_battle_01.png`

### Events

- No `event_*` source files were present in the root staging folder during Phase 71B.1.

## Renamed Files

- None. No generated duplicate suffix such as `(3)` or `(4)` was present in the discovered canonical-pattern filenames.

## Incoming And Ambiguous Files

The following files visibly contain player/Word Mage candidates, but their intended animation state and acceptance status are not clear from their generated filenames. Canonical player filenames already exist, so these files were not renamed or overwritten.

- `incoming/ChatGPT Image 23 มิ.ย. 2569 22_24_06.png`
- `incoming/ChatGPT Image 23 มิ.ย. 2569 22_41_38.png`
- `incoming/ChatGPT Image 23 มิ.ย. 2569 22_58_39.png`

## Rejected Files

- None identified with sufficient confidence. The documented first wrong-facing Goblin idle candidate was not identifiable by filename, so no file was moved to `rejected/`.

## Next Recommended Step

Phase 71C - Implement a normalization script or perform an explicitly authorized manual normalization pass, still with no runtime integration.
