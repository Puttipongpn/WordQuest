# ASSET_PLAN.md

This document defines the future asset direction for WordQuest. Phase 61 is planning and structure only: no final art assets, generated image files, runtime asset imports, new dependencies, or gameplay changes are added.

Phase 70A adds `ASSET_PROMPTS.md` as the practical pixel-art style bible and prompt pack for future image-generation work. It is still documentation-only: no final art assets, generated image files, runtime asset imports, new dependencies, or gameplay changes are added.

The Phase 70 Player Batch 1A, Monster Batch 1B, Effects Batch 1C, UI/Card/Background Batch 1D, Boss Batch 1E, Event Illustration Batch 1F, and Elite Enemy Batch 1G source/reference candidates have now been generated and reviewed. They are production sources, not normalized runtime assets, and remain outside runtime integration.

## Phase 71A Asset Normalization Planning Summary

Phase 71A is documentation and planning only. It defines a future-safe workflow for converting accepted generated source/reference assets into normalized runtime-ready assets later. Phase 71A does not perform conversion, create or move image files, add scripts, create an asset manifest, import assets, or implement animation playback.

Runtime integration remains prohibited until a later explicit phase.

## Asset Direction

WordQuest should use cozy fantasy pixel art when real assets are added later.

Target feel:

- Friendly vocabulary dungeon adventure
- Warm camp and dungeon palette
- Beginner-friendly, playful, and readable
- Not too dark, scary, violent, or visually noisy
- Simple silhouettes that remain clear on mobile
- Side-view battle framing with player on the left and enemies on the right

The art should support learning first. Visual detail should never reduce quiz readability, hide controls, or distract from vocabulary choices.

## Locked Canonical Player Character

The main playable protagonist identity is now locked for asset production. This is no longer exploratory concept art.

Canonical player-character fantasy:

- Young male `Word Mage` / mage adventurer
- Fluffy short brown hair
- Bright blue eyes
- Blue cape with gold trim
- Cream-and-brown fantasy adventurer mage outfit
- Magical staff with blue crystal
- Blue-and-gold spellbook / tome
- Cozy fantasy pixel art
- Chibi proportions
- Friendly beginner-hero vibe
- Vocabulary-learning elemental mage theme
- Not a swordsman, knight, rogue, archer, armored warrior, or generic adventurer

Future player sprites, animation sheets, battle-scene assets, card art, UI portraits, and prompt variants should preserve this identity consistently. The hero's combat identity is spellcasting through vocabulary knowledge, elemental card triggers, staff magic, and the blue-and-gold spellbook.

Canonical player naming for future production should use `player_word_mage_*` where practical. Older `player_word_hero_*` references are legacy planning aliases and should be treated as referring to this same locked Word Mage identity unless a future migration renames them.

Player Batch 1A was produced in this order:

1. `player_word_mage_idle_sheet.png`
2. `player_word_mage_walk_sheet.png`
3. `player_word_mage_cast_attack_sheet.png`
4. `player_word_mage_defend_sheet.png`
5. `player_word_mage_hurt_sheet.png`
6. `player_word_mage_victory_sheet.png`

## Current Player Asset Production Status

Status date: 2026-06-29

Player Batch 1A generated:

- `player_word_mage_idle_sheet.png`
- `player_word_mage_walk_sheet.png`
- `player_word_mage_cast_attack_sheet.png`
- `player_word_mage_defend_sheet.png`
- `player_word_mage_hurt_sheet.png`
- `player_word_mage_victory_sheet.png`

Approved visual reference assets:

- `player_word_mage_idle_sheet.png`
- `player_word_mage_walk_sheet.png`

These idle and walk sheets are approved visual references for the canonical WordQuest Word Mage. Future player sprites should preserve their face, body design, fluffy brown hair, bright blue eyes, blue cape with gold trim, cream-and-brown outfit, magical staff with blue crystal, blue-and-gold spellbook, cozy fantasy pixel art style, and upper-left lighting.

Current cast/attack candidate:

- `player_word_mage_cast_attack_sheet.png`

Cast/attack status:

- Provisional approved candidate / polish pass recommended.
- The current candidate succeeds in identity consistency.
- The current candidate has a readable action flow.
- It is not fully final yet.

Recommended cast/attack polish direction:

- Make the action read more clearly as staff-and-spellbook casting.
- Emphasize spellbook-to-staff magic flow.
- Use a compact blue-gold magic bolt or spark.
- Keep the effect small enough that it does not overpower the character.
- Avoid readable letters, readable runes, or answer-like symbols.
- Avoid oversized effects.
- Avoid weapon swing, slash, spear thrust, weapon-forward pose, or gun-like attack read.

Remaining player review decisions:

- `player_word_mage_defend_sheet.png`: generated candidate / pending final batch review unless explicitly approved later.
- `player_word_mage_hurt_sheet.png`: approved candidate / usable v1.
- `player_word_mage_victory_sheet.png`: approved candidate / usable v1.

The approved idle and walk sheets remain the visual identity anchor for all future player prompts and refinements.

Integration status:

- All six Player Batch 1A files are generated production source/reference candidates.
- These production sources are not normalized or integrated into runtime yet.
- No runtime asset imports or asset manifest code should be added until a future explicit integration phase.
- All existing asset safety rules remain unchanged.

## Current Monster Asset Production Status

Status date: 2026-06-29

Monster Batch 1B generated:

- Slime: idle, attack, hit, and defeat sheets.
- Bat: idle, attack, hit, and defeat sheets.
- Goblin: idle, attack, hit, and defeat sheets.

Slime review:

- `monster_slime_idle_sheet.png`: approved candidate / usable v1.
- `monster_slime_attack_sheet.png`: approved candidate / usable v1.
- `monster_slime_hit_sheet.png`: usable candidate; normalize scale and spacing later.
- `monster_slime_defeat_sheet.png`: approved candidate / usable v1.

Bat review:

- `monster_bat_idle_sheet.png`: approved candidate / usable v1.
- `monster_bat_attack_sheet.png`: approved candidate / usable v1.
- `monster_bat_hit_sheet.png`: usable candidate; normalize scale and spacing later.
- `monster_bat_defeat_sheet.png`: usable candidate; check transparency and background cleanup later.

Goblin review:

- `monster_goblin_idle_sheet.png`: approved candidate / usable v1.
- `monster_goblin_attack_sheet.png`: approved candidate / usable v1.
- `monster_goblin_hit_sheet.png`: usable candidate; normalize scale and spacing later.
- `monster_goblin_defeat_sheet.png`: usable candidate; three visible defeat stages are acceptable within the planned three-to-four-frame defeat range.

Direction review:

- Player sprites face right.
- Enemy sprites face left.
- The first goblin idle candidate was rejected because it faced the wrong direction.
- The regenerated goblin set faces left and is usable.

## Current Effects Asset Production Status

Status date: 2026-07-19

Effects Batch 1C generated:

- `effect_shield_block_sheet.png`
- `effect_fire_sheet.png`
- `effect_water_sheet.png`
- `effect_wind_sheet.png`
- `effect_earth_sheet.png`
- `effect_upgrade_spark_sheet.png`

Effects Batch 1C is complete as a source/reference candidate set and is sufficient to proceed to the next asset-planning step. These files are not normalized runtime-ready assets and must not be imported into the app until a future explicit integration phase.

Review decisions:

- `effect_water_sheet.png`: approved candidate / usable v1.
- `effect_fire_sheet.png`: approved candidate / usable v1.
- `effect_shield_block_sheet.png`: usable candidate; readable magical protection effect with a strong book-like barrier identity; optional polish later.
- `effect_upgrade_spark_sheet.png`: approved candidate / usable v1.
- `effect_earth_sheet.png`: usable candidate; strong earth read, slightly heavy scale, normalize later.
- `effect_wind_sheet.png`: usable candidate; readable but lighter/weaker than other effects, polish later if needed.

Future effect polish priority:

1. `effect_wind_sheet.png`: improve contrast and visual presence if needed.
2. `effect_earth_sheet.png`: check scale and heaviness during normalization.
3. `effect_shield_block_sheet.png`: optional polish if the book-like barrier needs to read more like a shield block.

Effect design rules:

- Effects are presentation-only visual feedback.
- Effects must never imply gameplay rule changes.
- Effects must not change combat math, timers, answer checking, HP, shield, gold, mastery, Word Energy, shop/event/boss effects, deck unlocks, save behavior, or encounter progression.
- Effects must not reveal hidden answers, target cards, correct answers, triggered cards, or result information before the player answers.
- Effects must not contain readable text, letters, numbers, stat labels, answer-like symbols, or readable runes.
- Effects must remain compact enough to avoid hiding quiz text, Thai text, answer choices, controls, HP/shield UI, or battle feedback.
- Effects should remain readable on mobile and not visually noisy.

## Current UI/Card/Background Asset Production Status

Status date: 2026-07-19

UI/Card/Background Batch 1D has been generated and reviewed as production source/reference candidates. These files are not normalized runtime-ready assets and must not be imported into the app until a future explicit integration phase.

Generated Batch 1D files:

- `background_dungeon_battle_01.png`
- `ui_vocabulary_card_frame.png`
- `ui_gold_coin.png`
- `ui_heart_hp.png`
- `ui_shield.png`

Known polish note:

- `background_dungeon_battle_01.png` is a weaker candidate than the approved core sprite batches and may need a polish pass if it becomes a runtime background candidate.

## Current Boss Asset Production Status

Status date: 2026-07-19

Boss Batch 1E generated:

- `boss_gatekeeper_idle_sheet.png`
- `boss_gatekeeper_attack_sheet.png`
- `boss_gatekeeper_hit_sheet.png`
- `boss_gatekeeper_defeat_sheet.png`

Boss Batch 1E is complete as a source/reference candidate set. These files are not normalized runtime-ready assets and must not be imported into the app until a future explicit integration phase.

Gatekeeper identity:

- Friendly but imposing dungeon word guardian boss
- Stone-and-wood magical guardian
- Key motif
- Warm stone body
- Wooden door/gate body
- Moss accents
- Gold trim
- Soft teal crystal glow
- Cozy fantasy pixel art
- Beginner-friendly
- Not horror, not violent, not dark demon-like

Review decisions:

- `boss_gatekeeper_idle_sheet.png`: approved candidate / usable v1; source filename may need rename from `boss_gatekeeper_idle_sheet(4).png` if the generated duplicate filename is present.
- `boss_gatekeeper_attack_sheet.png`: approved candidate / usable v1.
- `boss_gatekeeper_hit_sheet.png`: usable candidate; scale should be normalized later.
- `boss_gatekeeper_defeat_sheet.png`: approved candidate / usable v1.

Boss orientation:

- Boss sprites face left.
- Gatekeeper attack action moves or acts toward the left.
- This matches enemy/boss battle framing.

Boss action notes:

- Idle reads as a stable guardian stance.
- Attack reads as a compact teal-gold guardian pulse / stone-hand strike without implying a new mechanic.
- Hit reads as a simple flinch reaction, but requires scale normalization.
- Defeat reads as peaceful guardian deactivation / stone-gate settling, not violent death.

Boss safety rules:

- Boss assets are presentation-only.
- Boss art must not imply new boss mechanics or new gameplay rules.
- Boss art must not change combat math, timers, answer checking, HP, shield, gold, mastery, Word Energy, shop/event/boss effects, deck unlocks, save behavior, or encounter progression.
- Boss art must not reveal hidden answers, target cards, correct answers, triggered cards, or result information before the player answers.
- Boss art must not contain readable text, letters, numbers, stat labels, answer-like symbols, or readable runes.
- Boss art must remain readable on mobile and should not hide quiz UI or controls.

## Current Event Illustration Asset Production Status

Status date: 2026-07-21

Event Illustration Batch 1F generated:

- `event_treasure_chest_01.png`
- `event_healing_shrine_01.png`
- `event_strange_altar_01.png`

Review decisions:

- `event_treasure_chest_01.png`: approved candidate / usable v1.
- `event_strange_altar_01.png`: approved candidate / usable v1.
- `event_healing_shrine_01.png`: usable candidate; a later polish pass is recommended.

Event reads and polish notes:

- Treasure Chest clearly reads as reward discovery, but must not reveal exact gold, items, reward amounts, or outcomes.
- Strange Altar clearly reads as a mysterious but friendly risk-reward event; it must not look cursed, demonic, horror-like, or ritualistic.
- Healing Shrine overlaps visually with Strange Altar because both use teal crystal shrine/altar language.
- A later Healing Shrine polish should use a softer recovery mood, gentler light halo, water basin or soft pool glow, mist or droplets, less mystery-crystal emphasis, and a calmer restorative-shrine read.

Event illustration safety:

- Event illustrations are presentation-only and must not reveal outcomes, exact rewards/costs, exact healing/shield values, choices, hidden/correct answers, or result information.
- Event art must not include readable text, letters, numbers, labels, signs, labeled stat icons, answer-like symbols, or readable runes.
- Event discovery illustrations should not contain characters or monsters.
- Event art must remain cozy, beginner-friendly, readable, and quiet enough for event UI overlays.

## Current Elite Enemy Asset Production Status

Status date: 2026-07-21

Elite Enemy Batch 1G generated:

- `elite_crystal_slime_idle_sheet.png`
- `elite_crystal_slime_attack_sheet.png`
- `elite_crystal_slime_hit_sheet.png`
- `elite_crystal_slime_defeat_sheet.png`

Elite Crystal Slime is the first locked elite visual identity: a stronger-looking version of the friendly green dungeon slime, with a rounded green body, teal crystal growths on its back/head, tiny gold sparkles or crystal shine, a cute simple face, and a special but beginner-friendly read. It is not scary, gross, or violent.

Review decisions:

- `elite_crystal_slime_idle_sheet.png`: approved candidate / usable v1; rename from `elite_crystal_slime_idle_sheet(4).png` during later normalization if that duplicate filename is present.
- `elite_crystal_slime_attack_sheet.png`: approved candidate / usable v1.
- `elite_crystal_slime_hit_sheet.png`: usable candidate; normalize scale and spacing later.
- `elite_crystal_slime_defeat_sheet.png`: approved candidate / usable v1.

Elite orientation and action notes:

- Elite enemies face left; Crystal Slime attacks or acts toward the left.
- Idle reads as a magical elite slime wobble with crystal identity.
- Attack reads as a crystal-powered bounce/lunge with compact teal-gold sparkle.
- Hit reads as a simple squish/flinch and needs scale/spacing normalization.
- Defeat reads as a gentle flattening/puddle/sparkle fade, not violent death.

## Encounter Visual Hierarchy

- Normal monsters: Slime, Bat, Goblin.
- Elite enemy: Crystal Slime.
- Boss: Gatekeeper.
- Events: Treasure Chest, Healing Shrine, Strange Altar.

This hierarchy is visual presentation only and does not change encounter behavior or progression.

## Sprite Specs

Recommended first-pass specs:

- Character and monster sprites: 64x64 PNG
- Larger boss or presentation sprites: 128x128 PNG only if 64x64 is not readable
- UI icons and effects: 32x32 or 64x64 PNG
- Backgrounds: static PNG, sized for responsive cropping and compression
- Background: transparent for sprites, icons, and effects
- Orientation: side-view
- Player direction: faces right
- Enemy direction: faces left

Animation prep:

- Prefer spritesheets over many separate frame files.
- Keep frame size consistent within a spritesheet.
- Player idle: 4 frames
- Player walk: 4 to 6 frames
- Player cast / attack: 4 to 6 frames
- Player defend: 4 frames
- Player hurt: 2 frames
- Player victory: 4 frames
- Monster idle: 4 frames
- Monster attack: 4 frames
- Monster hit: 2 frames
- Monster defeat: 3 to 4 frames
- Effects: 4 to 6 frames
- Boss idle: 4 frames
- Boss attack: 4 frames
- Boss hit: 2 frames
- Boss defeat: 4 frames

Phase 61 does not implement animation playback. These specs are for later asset generation and integration.

### Source vs Runtime Asset Model

- Source/reference assets are original generated images. They may be high resolution, have inconsistent dimensions, include extra transparent space or checkerboard/preview backgrounds, use preview scaling, or retain duplicate generated filenames.
- Runtime assets are normalized exports with exact dimensions, consistent frame cells, clean alpha, stable lowercase snake_case filenames, and completed visual QA. They are suitable for future explicit integration.

### Runtime Size Targets

- Player sprite sheets: 64x64 per frame.
- Small monster sprite sheets: 64x64 per frame.
- Effect sprite sheets: 64x64 per frame.
- Boss sprite sheets: 128x128 per frame.
- UI icons: 64x64 single icon.
- Vocabulary card frame: keep as a source candidate; test it in the UI before locking runtime dimensions.
- Dungeon battle background: keep the 1536x864 image as a source candidate; plan style polish, crop behavior, and responsive use before runtime integration.

Expected complete sheet sizes:

- Four 64px frames: 256x64.
- Two 64px frames: 128x64.
- Six 64px frames: 384x64.
- Four 128px boss frames: 512x128.
- Two 128px boss frames: 256x128.

### Future Normalization Workflow

1. Collect the original generated source files.
2. Verify alpha and transparent backgrounds.
3. Detect and remove checkerboard or preview backgrounds if present.
4. Split each sheet into individual frames.
5. Crop sprite or effect bounds per frame.
6. Determine shared maximum bounds for the complete sheet.
7. Resize each frame to its target cell without distorting aspect ratio.
8. Center frames horizontally.
9. Align grounded characters to a shared ground baseline.
10. Align flying enemies to a shared hover baseline.
11. Align effects to the center or their effect-specific placement.
12. Recombine frames into the final runtime spritesheet.
13. Export with a stable lowercase snake_case filename.
14. Preserve the original source separately.
15. Visually QA the normalized output.

### Baseline Rules

- Player: use one stable grounded baseline across idle, walk, cast/attack, defend, hurt, and victory.
- Slime and Goblin: use a grounded baseline.
- Bat: use a hover baseline, not a ground baseline.
- Effects: center by default; keep earth effects lower and grounded.
- Boss: use a grounded boss baseline and consistent visual scale across idle, attack, hit, and defeat.
- Background: has no sprite baseline; quiz and UI readability are the priority.

## Naming Convention

Use lowercase snake_case for future asset ids and filenames.

General pattern:

- `{category}_{name}_{state}.png`
- `{category}_{name}_{state}_sheet.png` for spritesheets
- `{category}_{name}.png` for single-frame UI icons or effects

Examples:

- `player_word_mage_idle_sheet.png`
- `player_word_mage_walk_sheet.png`
- `player_word_mage_cast_attack_sheet.png`
- `player_word_mage_defend_sheet.png`
- `player_word_mage_hurt_sheet.png`
- `player_word_mage_victory_sheet.png`
- `monster_slime_idle_sheet.png`
- `monster_slime_attack_sheet.png`
- `monster_slime_hit_sheet.png`
- `monster_slime_defeat_sheet.png`
- `elite_slime_idle.png`
- `boss_gatekeeper_idle.png`
- `boss_gatekeeper_special.png`
- `effect_shield_block.png`
- `ui_gold_coin.png`

Asset ids should match filenames without the extension when possible, such as `monster_slime_idle`.

## Future Folder Structure

Keep generated source/reference images separate from normalized runtime-ready assets. Recommended future distinction:

```text
asset_sources/
  player/
  monsters/
  elites/
  effects/
  ui/
  backgrounds/
  bosses/
  events/

src/assets/
  player/
  monsters/
  elites/
  effects/
  ui/
  backgrounds/
  bosses/
  events/
```

`asset_sources/` or a documentation/reference location is for original generated high-resolution source images. `src/assets/` must receive only normalized runtime-ready files during a future explicit integration phase. Do not create or move these folders in Phase 71A.

## Future Asset Manifest

This manifest lists assets needed by current game systems. It is document-only for now and is not wired into runtime.

### Player

Word Mage:

- `player_word_mage_idle_sheet.png`
- `player_word_mage_walk_sheet.png`
- `player_word_mage_cast_attack_sheet.png`
- `player_word_mage_defend_sheet.png`
- `player_word_mage_hurt_sheet.png`
- `player_word_mage_victory_sheet.png`

### Monsters

Each current monster should eventually have idle, attack, hit, and defeat states.

Slime:

- `monster_slime_idle_sheet.png`
- `monster_slime_attack_sheet.png`
- `monster_slime_hit_sheet.png`
- `monster_slime_defeat_sheet.png`

Goblin:

- `monster_goblin_idle_sheet.png`
- `monster_goblin_attack_sheet.png`
- `monster_goblin_hit_sheet.png`
- `monster_goblin_defeat_sheet.png`

Bat:

- `monster_bat_idle_sheet.png`
- `monster_bat_attack_sheet.png`
- `monster_bat_hit_sheet.png`
- `monster_bat_defeat_sheet.png`

Wolf:

- `monster_wolf_idle.png`
- `monster_wolf_attack.png`
- `monster_wolf_hit.png`
- `monster_wolf_defeat.png`

Mushroom:

- `monster_mushroom_idle.png`
- `monster_mushroom_attack.png`
- `monster_mushroom_hit.png`
- `monster_mushroom_defeat.png`

Wisp:

- `monster_wisp_idle.png`
- `monster_wisp_attack.png`
- `monster_wisp_hit.png`
- `monster_wisp_defeat.png`

Skeleton:

- `monster_skeleton_idle.png`
- `monster_skeleton_attack.png`
- `monster_skeleton_hit.png`
- `monster_skeleton_defeat.png`

Imp:

- `monster_imp_idle.png`
- `monster_imp_attack.png`
- `monster_imp_hit.png`
- `monster_imp_defeat.png`

Stone Bug:

- `monster_stone_bug_idle.png`
- `monster_stone_bug_attack.png`
- `monster_stone_bug_hit.png`
- `monster_stone_bug_defeat.png`

Dark Crow:

- `monster_dark_crow_idle.png`
- `monster_dark_crow_attack.png`
- `monster_dark_crow_hit.png`
- `monster_dark_crow_defeat.png`

### Elites

Version 1 can reuse normal monster sprites with an elite frame, tint, badge, or glow. Separate elite sprites are optional later.

Optional elite naming:

- `elite_slime_idle.png`
- `elite_slime_attack.png`
- `elite_slime_hit.png`
- `elite_slime_defeat.png`

Use the same pattern for all current monsters if separate elite art is generated later.

### Bosses

Each current boss should eventually have idle, attack, special, hit, and defeat states.

Gatekeeper:

- `boss_gatekeeper_idle_sheet.png`
- `boss_gatekeeper_attack_sheet.png`
- `boss_gatekeeper_hit_sheet.png`
- `boss_gatekeeper_defeat_sheet.png`

Gatekeeper special:

- `boss_gatekeeper_special_sheet.png` is optional future production if a later phase explicitly needs a distinct special presentation.

Word Warden:

- `boss_word_warden_idle.png`
- `boss_word_warden_attack.png`
- `boss_word_warden_special.png`
- `boss_word_warden_hit.png`
- `boss_word_warden_defeat.png`

Grammar Golem:

- `boss_grammar_golem_idle.png`
- `boss_grammar_golem_attack.png`
- `boss_grammar_golem_special.png`
- `boss_grammar_golem_hit.png`
- `boss_grammar_golem_defeat.png`

Shadow Reader:

- `boss_shadow_reader_idle.png`
- `boss_shadow_reader_attack.png`
- `boss_shadow_reader_special.png`
- `boss_shadow_reader_hit.png`
- `boss_shadow_reader_defeat.png`

Memory Dragon:

- `boss_memory_dragon_idle.png`
- `boss_memory_dragon_attack.png`
- `boss_memory_dragon_special.png`
- `boss_memory_dragon_hit.png`
- `boss_memory_dragon_defeat.png`

### Effects

Generated Batch 1C source/reference candidates:

- `effect_shield_block_sheet.png`
- `effect_fire_sheet.png`
- `effect_water_sheet.png`
- `effect_wind_sheet.png`
- `effect_earth_sheet.png`
- `effect_upgrade_spark_sheet.png`

Additional future effects:

- `effect_physical_slash_sheet.png`
- `effect_mastery_glow_sheet.png`
- `effect_victory_sheet.png`
- `effect_defeat_sheet.png`
- `effect_timeout_sheet.png`

### UI

Generated Batch 1D source/reference candidates:

- `ui_gold_coin.png`
- `ui_heart_hp.png`
- `ui_shield.png`

Additional future UI:

- `ui_timer.png`
- `ui_mastery_star.png`
- `ui_word_energy.png`
- `ui_shop_reroll.png`

### Backgrounds

Generated Batch 1D source/reference candidates:

- `background_dungeon_battle_01.png`

Additional future backgrounds:

- `background_home_camp.png`
- `background_deck_spellbook.png`
- `background_training_room.png`
- `background_shop.png`
- `background_run_result.png`

## Current Data Mapping

Current data should map to future assets by stable, readable asset ids. Do not require these assets at runtime until they exist.

Player:

- Word Mage: `player_word_mage_idle_sheet.png`

Monsters:

- Slime: `monster_slime_idle_sheet.png`
- Goblin: `monster_goblin_idle_sheet.png`
- Bat: `monster_bat_idle_sheet.png`
- Wolf: `monster_wolf_idle.png`
- Mushroom: `monster_mushroom_idle.png`
- Wisp: `monster_wisp_idle.png`
- Skeleton: `monster_skeleton_idle.png`
- Imp: `monster_imp_idle.png`
- Stone Bug: `monster_stone_bug_idle.png`
- Dark Crow: `monster_dark_crow_idle.png`

Bosses:

- Gatekeeper: `boss_gatekeeper_idle_sheet.png`
- Word Warden: `boss_word_warden_idle.png`
- Grammar Golem: `boss_grammar_golem_idle.png`
- Shadow Reader: `boss_shadow_reader_idle.png`
- Memory Dragon: `boss_memory_dragon_idle.png`

Effects:

- Physical attack: `effect_physical_slash_sheet.png`
- Shield: `effect_shield_block_sheet.png`
- Fire element: `effect_fire_sheet.png`
- Water element: `effect_water_sheet.png`
- Wind element: `effect_wind_sheet.png`
- Earth element: `effect_earth_sheet.png`
- Upgrade feedback: `effect_upgrade_spark_sheet.png`
- Mastery bonus: `effect_mastery_glow_sheet.png`
- Victory: `effect_victory_sheet.png`
- Defeat: `effect_defeat_sheet.png`

## Integration Rules

Future real assets should be integrated gradually.

Rules:

- Missing assets must fall back to current emoji/text/CSS placeholders.
- Asset loading failure must not crash the app.
- Assets must not change combat behavior, answer checking, timers, HP, shield, gold, mastery, Word Energy, deck unlocks, save behavior, or encounter progression.
- Assets must not reveal hidden answers, target cards, correct answers, or post-answer result information before the player answers.
- Effects are presentation-only and must not imply changed rules, altered stats, or hidden result information.
- Effects must stay compact enough to avoid hiding quiz text, Thai text, answer choices, controls, HP/shield UI, or battle feedback.
- Boss art is presentation-only and must not imply new boss mechanics, new attacks, changed stats, or hidden result information.
- Boss art must stay readable on mobile and must not hide quiz UI or controls.
- Asset ids should be optional if added to TypeScript data later.
- Do not make real art required for Version 1 gameplay.
- Mobile readability is more important than visual detail.
- Prefer small, optimized PNG files.
- Keep public demo deployment static and Vercel-compatible.

## Future Prompt Guidelines

Use `ASSET_PROMPTS.md` as the primary prompt pack when generating assets later. The templates below are the older Phase 61 starter prompts and remain useful as a compact reference.

Future generation prompts should be runtime-targeted:

- Explicitly request a final runtime-targeted spritesheet.
- Specify total canvas size, such as 256x64 for four frames or 128x64 for two frames.
- Require every frame cell to be exactly 64x64.
- For boss spritesheets, specify 128x128 per frame where boss readability needs the larger size.
- Request no large preview canvas and no upscale.
- Require transparent background only.
- Specify no checkerboard background.
- Specify no frame borders, labels, UI, text, watermark, letters, numbers, or readable runes.
- Keep effect bounds compact inside each 64x64 frame.
- Specify the intended sprite body size within each 64x64 cell.
- Still require a normalization safety pass because image generators may not follow exact dimensions reliably.

Base sprite prompt:

```text
Create a cozy fantasy pixel art sprite sheet for [asset name]. Style: simple readable 64x64 pixel art, transparent background, side-view, warm color palette, suitable for a friendly vocabulary dungeon game. Include [frame list]. Keep silhouette clear at mobile size. No text, no watermark.
```

Player prompt:

```text
Create a cozy fantasy pixel art sprite sheet for the canonical WordQuest Word Mage player character. Young male chibi mage adventurer with fluffy short brown hair, bright blue eyes, blue cape with gold trim, cream-and-brown fantasy adventurer mage outfit, magical staff with blue crystal, and blue-and-gold spellbook/tome. Side-view facing right, simple readable 64x64 frames, transparent background, warm camp palette. Vocabulary-learning elemental mage theme, friendly beginner-hero vibe. Include the requested animation frames. No swords, no knight armor, no rogue outfit, no text, no watermark.
```

Normal monster prompt:

```text
Create a cozy fantasy pixel art sprite sheet for [monster name], a friendly dungeon enemy for a vocabulary learning game. Side-view facing left, simple readable 64x64 frames, transparent background, warm dungeon palette, not too scary. Include 4 idle frames, 4 attack frames, 2 hit frames, and 4 defeat frames. No text, no watermark.
```

Elite monster prompt:

```text
Create a cozy fantasy pixel art sprite sheet for Elite [monster name], a stronger version of the normal monster for a vocabulary learning dungeon. Side-view facing left, simple readable 64x64 frames, transparent background, slightly more dramatic colors, crown or glow accent, still beginner-friendly. Include 4 idle frames, 4 attack frames, 2 hit frames, and 4 defeat frames. No text, no watermark.
```

Boss prompt:

```text
Create a cozy fantasy pixel art sprite sheet for [boss name], a climactic but friendly boss for a vocabulary learning dungeon. Side-view facing left, readable at mobile size, transparent background, 128x128 or clear 64x64 frames, warm dungeon palette, not horror. Include 4 idle frames, 4 attack frames, 4 special move frames, 2 hit frames, and 4 defeat frames. No text, no watermark.
```

Element effect prompt:

```text
Create a cozy fantasy pixel art effect sprite sheet for [fire/water/wind/earth/shield/mastery]. Transparent background, 32x32 or 64x64 frames, warm readable colors, suitable for a vocabulary card battle. Include 4 to 6 frames. No text, no watermark.
```

UI icon prompt:

```text
Create a cozy fantasy pixel art UI icon for [gold coin / heart HP / shield / timer / mastery star]. Transparent background, 32x32 or 64x64, simple silhouette, high readability on mobile, warm palette. No text, no watermark.
```

Background prompt:

```text
Create a cozy fantasy pixel art background for [home camp / training room / dungeon battle / shop]. Warm, friendly, readable, not too dark, no characters, no text, no watermark. It should support UI overlays and remain clear on mobile.
```

## Current Placeholder Integration Notes

Current placeholder visuals remain active after Phase 61.

Areas to replace later:

- Home hub: current CSS/emoji camp-style presentation
- Deck Review: card emoji placeholders and spellbook styling
- Training: training-room CSS/placeholder presentation
- Dungeon battle: canonical Word Mage placeholder, monster/elite/boss emoji placeholders, event discovery cards, battle lane
- Shop: merchant-style CSS/placeholder presentation
- Run Complete / Run Failed: summary presentation and boss placeholder
- Effects: CSS motion, text badges, emoji, and generated Web Audio sounds

Replacement should happen in small passes. Keep fallback placeholders visible until each asset category is verified in production builds.

## Known Limitations

- Player Batch 1A, Monster Batch 1B, and Effects Batch 1C generated source/reference candidates exist.
- UI/Card/Background Batch 1D generated source/reference candidates exist.
- Boss Batch 1E generated source/reference candidates exist.
- No normalized runtime-ready art assets exist yet.
- No runtime asset manifest exists yet.
- No animation playback system exists yet.
- No sprite loading/error fallback component exists yet.
- Exact sprite sizes may need adjustment after mobile visual tests.
- Accepted generated sources still need visual batch QA and normalization before any future runtime integration.
- Player character concept exploration is complete; the Word Mage identity is locked.
- Effects Batch 1C source/reference production and review are complete.
- Boss Batch 1E source/reference production and review are complete.
- Phase 71A defines normalization policy only; no source-to-runtime conversion has been performed.

## Phase 71A Known Candidate Notes

Player:

- Idle and walk are approved visual references.
- Cast/attack is a provisional approved candidate; a polish pass is recommended.
- Defend remains pending final batch review unless approved later.
- Hurt and victory are approved candidates / usable v1.

Monsters:

- Slime hit, Bat hit, and Goblin hit need scale and spacing normalization.
- Bat defeat needs an alpha, transparency, and background-cleanup check.
- Goblin defeat has three visible stages and remains acceptable within the planned three-to-four-frame range.

Effects:

- Wind is readable but lighter/weaker; polish contrast and presence if needed.
- Earth has a strong read but slightly heavy scale; check it during normalization.
- Shield block is usable with a strong book-like barrier identity; optional polish may follow later.

UI, card, and background:

- Gold coin, heart, shield, and vocabulary card frame are usable candidates.
- `background_dungeon_battle_01.png` is usable/provisional but may need pixel-art consistency polish before runtime use.

Events:

- Treasure Chest and Strange Altar are approved candidates / usable v1.
- Healing Shrine is usable but should be differentiated from Strange Altar with a softer restorative visual language.
- Event normalization must establish target display dimensions, anti-spoiler/text checks, event-panel overlay composition, and mobile crop/readability.

Boss:

- Gatekeeper idle, attack, and defeat are approved candidates / usable v1.
- The idle source may need a stable rename from a duplicate generated filename such as `boss_gatekeeper_idle_sheet(4).png`.
- Gatekeeper hit is usable but needs scale normalization.

Elite:

- Crystal Slime idle, attack, and defeat are approved candidates / usable v1.
- Crystal Slime hit needs scale and spacing normalization.
- Elite sheets use 64x64 target frame cells, horizontal centering, a grounded baseline, consistent action scale, preserved originals, and stable filename cleanup where necessary.

## Runtime Integration Gate

Runtime integration may begin only in a later explicit phase after the normalization plan is approved, normalized files exist, visual QA passes, fallback behavior is defined, asset-load failure cannot crash the app, reduced-motion and readability concerns are considered, and all gameplay safety rules remain preserved.

Asset safety rules:

- Assets are presentation-only and cannot change combat math, timers, answer checking, HP, shield, gold, mastery, Word Energy, shop/event/boss/elite effects, deck unlocks, save behavior, or encounter progression.
- Assets cannot reveal hidden answers, target cards, correct answers, triggered cards, event outcomes, reward amounts, or result information before the player answers or chooses.
- Assets cannot contain readable text, letters, numbers, stat labels, answer-like symbols, or readable runes.
- Assets cannot reduce quiz readability, hide controls, obscure Thai text, or make answer choices harder to scan.
- Missing assets must fall back safely to placeholders.

## Recommended Step After Phase 71A

- Phase 71B planning is now complete; use the detailed Phase 71B specification below for later implementation.
- Alternatively, polish `effect_wind_sheet.png`, `background_dungeon_battle_01.png`, `event_healing_shrine_01.png`, and hit sheets that need scale normalization.
- Generate additional elite variants only if more encounter variety is needed.
- Plan runtime integration only after normalized runtime-ready exports exist and fallback behavior is defined.

## Phase 71B Normalization Script And Manual Checklist Planning

Phase 71B is documentation-only planning for a future normalization script and a repeatable manual workflow. It defines enough behavior and QA detail for a later implementation phase to process assets without guessing. Phase 71B does not convert assets, create scripts, create or move folders/files, rename images, create an asset manifest, import runtime assets, or implement animation playback.

### Normalization Input Inventory

The future normalization workflow must support all accepted source/reference groups:

- Player Batch 1A.
- Monster Batch 1B.
- Effects Batch 1C.
- UI/Card/Background Batch 1D.
- Boss Batch 1E.
- Event Illustration Batch 1F.
- Elite Enemy Batch 1G.

### Recommended Source Folder Structure

The future conceptual source/reference structure is:

```text
asset_sources/
  player/
  monsters/
  elites/
  bosses/
  effects/
  ui/
  backgrounds/
  events/
```

These categories contain original generated production source/reference files only. They may include high-resolution, preview-scale, duplicated, padded, or otherwise unnormalized images.

### Recommended Runtime Folder Structure

```text
src/assets/
  player/
  monsters/
  elites/
  bosses/
  effects/
  ui/
  backgrounds/
  events/
```

`src/assets/` must remain empty or unused until a later explicit runtime integration phase. It must receive only normalized runtime-ready exports, never raw generated sources.

### Current Asset Staging Folder Plan

The existing root-level `Asset/` folder is the current temporary source/reference staging location. Phase 71B.1 organized its discovered files into category/species subfolders. Files in `Asset/` remain unnormalized, are not runtime-ready, and must not be imported by the app.

Current organization under the existing staging folder:

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

Staging rules:

- `Asset/` is for generated production source/reference candidates only.
- It may contain high-resolution images, duplicate generated filenames, preview-scale images, extra transparent space, and unnormalized files.
- Files in `Asset/` are not runtime-ready.
- Normalized runtime-ready exports eventually belong in `src/assets/`, not `Asset/`.
- Phase 71B planning did not move, create, or rename files or folders; Phase 71B.1 later performed source organization only.
- No file under `Asset/` may be imported into React before a separately authorized normalization and runtime-integration workflow.

### Target Runtime Dimensions

- Player: 64x64 per frame; 256x64 for four frames; 384x64 for six frames; 128x64 for two frames when needed.
- Small monsters: 64x64 per frame; 256x64 for four frames; 128x64 for two-frame hit sheets.
- Elite enemies: 64x64 per frame; 256x64 for four frames; 128x64 for two-frame hit sheets.
- Bosses: 128x128 per frame; 512x128 for four frames; 256x128 for two-frame hit sheets.
- Effects: 64x64 per frame; 256x64 for four frames.
- UI icons: 64x64 single icon.
- Event illustrations: retain the original 768x432 source candidate until later UI testing defines another exact runtime size.
- Backgrounds: retain the original 1536x864 source candidate until responsive layout testing defines another exact runtime size.
- Vocabulary card frame: retain the current source candidate until UI text-readability testing defines its final runtime treatment.

### Future Normalization Script Concept

Do not create this script in Phase 71B. A later authorized implementation should be able to:

1. Read a source PNG without altering the original.
2. Optionally split a horizontal spritesheet into a declared number of frames.
3. Detect non-transparent bounds per frame.
4. Crop useful bounds and calculate shared bounds across all frames.
5. Resize while preserving aspect ratio.
6. Place each result in a fixed target frame.
7. Align a grounded baseline for the Word Mage, Slime, Goblin, Crystal Slime, and Gatekeeper.
8. Align a hover baseline for Bat.
9. Center effects unless an effect-specific placement rule applies.
10. Place the earth effect lower in its frame.
11. Recombine frames into one horizontal spritesheet.
12. Export a stable PNG with clean alpha.
13. Preserve every original source file separately.

### Manual Normalization Checklist

- [ ] Confirm the source filename.
- [ ] Confirm the intended final filename.
- [ ] Confirm the frame count.
- [ ] Confirm the target frame size.
- [ ] Confirm a transparent background and valid alpha.
- [ ] Split and inspect every frame.
- [ ] Crop sprite or effect bounds.
- [ ] Compare scale against the approved visual reference.
- [ ] Align the grounded baseline, hover line, or effect placement.
- [ ] Recombine the horizontal sheet.
- [ ] Check the final canvas dimensions.
- [ ] Check for prohibited text, letters, numbers, labels, or readable runes.
- [ ] Check visual readability and crop behavior on mobile.
- [ ] Confirm presentation has not introduced or implied gameplay meaning.
- [ ] Preserve the original source separately from the normalized export.

### Phase 71B Candidate-Specific Notes

- Player: idle/walk remain visual anchors; cast/attack is provisional and may need polish before final normalization; defend remains pending final review unless explicitly approved later.
- Monsters: Slime hit, Bat hit, and Goblin hit need scale/spacing normalization; Bat defeat needs transparency/background cleanup review.
- Effects: Wind may need stronger contrast/presence; Earth needs a scale/heaviness check; Shield Block is usable but has a strong book-like barrier identity.
- UI/card/background: `background_dungeon_battle_01.png` is usable/provisional and may need pixel-art consistency polish; the card frame needs text-readability testing; UI icons are usable candidates.
- Boss: Gatekeeper hit needs scale normalization; generated duplicate filenames may need later cleanup.
- Events: Healing Shrine may need polish to separate it from Strange Altar; Treasure Chest and Strange Altar are usable v1 candidates.
- Elite: Crystal Slime idle may need a duplicate generated filename cleaned up later; Crystal Slime hit needs scale/spacing normalization.

### Phase 71B Runtime Integration Gate

Runtime integration remains blocked until normalized runtime-ready files exist, visual QA passes, safe placeholder fallbacks are defined, loading failure cannot crash the app, reduced-motion behavior is considered, mobile readability is checked, and no gameplay rule changes are introduced.

Safety rules remain unchanged:

- Assets are presentation-only.
- Assets cannot change combat math, timers, answer checking, HP, shield, gold, mastery, Word Energy, shop/event/boss/elite effects, deck unlocks, save behavior, or encounter progression.
- Assets cannot reveal hidden answers, target cards, correct answers, triggered cards, event outcomes, reward amounts, or result information before the player answers or chooses.
- Assets cannot contain readable text, letters, numbers, stat labels, answer-like symbols, or readable runes.
- Assets cannot reduce quiz readability, hide controls, obscure Thai text, or make answer choices harder to scan.
- Missing assets must fall back safely to placeholders.

### Phase 71B.1 - Organize Source Asset Folder

Phase 71B.1 was completed on 2026-07-29 as source-file organization only.

Completed:

- Created the recommended category/species subfolders under the existing root `Asset/` staging folder.
- Moved 34 canonical-pattern source files into player, monster, elite, boss, effect, UI, and background folders.
- Moved three ambiguously named player-like candidates into `Asset/incoming/` without renaming or overwriting them.
- Created `Asset/notes/SOURCE_ASSET_INVENTORY.md`.
- Found no generated `(3)` or `(4)` suffix in the discovered canonical-pattern filenames, so no files were renamed.
- Identified no rejected candidate with sufficient filename confidence, so `Asset/rejected/` remains empty.
- Found no `event_*` source file in the root staging folder, so `Asset/events/` remains empty.

Phase 71B.1 did not edit image content, normalize/resize/crop images, import assets into React, create an asset manifest, create animation playback, modify gameplay, move files into `src/assets/`, or treat source images as normalized runtime files.

### Recommended Step After Phase 71B

- Phase 71C: implement a normalization script while still prohibiting runtime integration.
- Run a polish pass for weaker candidates before normalization.
- Plan runtime integration only after normalized assets exist and the integration gate is satisfied.

## Phase 71C Asset Normalization Script

Phase 71C was implemented on 2026-07-29. It creates normalization candidates under `normalized_assets/` without integrating them into the app.

Implementation:

- Script: `scripts/normalize-assets.mjs`.
- Dependency: `sharp` as a development-only PNG processing dependency.
- Dry run: `npm run normalize-assets:dry-run`.
- Normal run: `npm run normalize-assets`.
- Report: `normalized_assets/NORMALIZATION_REPORT.md`.
- Source: organized production references under `Asset/`.
- Output: normalization candidates under `normalized_assets/`.
- Runtime destination `src/assets/` remains absent and unused.

The script:

- Traverses only configured PNG source groups.
- Infers hit sheets as two frames and uses source aspect ratio for equal-width 3, 4, or 6-frame sheets.
- Splits horizontal sheets, detects alpha bounds, computes shared bounds, resizes proportionally, and recombines exact target sheets.
- Uses grounded alignment for player, Slime, Goblin, Crystal Slime, and Gatekeeper; hover alignment for Bat; centered effects; and lower placement for Earth.
- Normalizes the three allowed UI icons to 64x64.
- Preserves the card frame and background dimensions by copying them to the output.
- Preserves events at source dimensions when event PNG files become available.
- Skips `Asset/incoming/` and `Asset/rejected/`.
- Never deletes files or writes to `Asset/` or `src/assets/`.
- May deterministically overwrite matching files only under `normalized_assets/`.

First completed run:

- 34 files processed.
- 3 ambiguous files under `Asset/incoming/` skipped.
- No event files were available.
- 30 sprite/effect/icon sources were conservatively flagged for no usable transparency and possible baked preview/checkerboard/background.
- Player cast/attack and walk were inferred as six-frame sheets.
- Slime idle/attack and Bat idle were inferred as three-frame sheets.
- Bat and Goblin defeat sheets defaulted to four frames and require manual aspect/layout QA.
- The card frame was preserved at 1058x1487.
- The provisional dungeon background was preserved at 1672x941 rather than resized to 1536x864.

All normalized outputs remain candidates. The presence of target dimensions or an alpha channel does not mean baked backgrounds were removed or that visual QA passed.

Phase 71C does not import assets, create an asset manifest, add animation playback, alter gameplay, or authorize runtime integration.

## Phase 71D Visual QA

Phase 71D inspected all 34 normalized PNG outputs and recorded results in `normalized_assets/VISUAL_QA_REPORT.md`.

Result:

- Pass: 0.
- Needs review: 1.
- Fail: 33.
- Event outputs: 0.
- Runtime integration remains prohibited.

Blocking findings:

- Baked checkerboard/opaque preview backgrounds remain visible in sprite, effect, UI icon, and card-frame outputs.
- Aspect-ratio-only frame inference incorrectly split Slime idle/attack and Bat idle as three frames.
- Bat/Goblin defeat and several attack actions contain cross-frame clipping or fragments.
- The background is the only needs-review output; it remains provisional at 1672x941 and requires responsive crop/style QA.

Phase 71E cannot proceed as runtime integration. Source cleanup and explicit per-file frame/layout metadata are required before rerunning normalization and repeating visual QA.

## Phase 71D.1 Source Cleanup And Normalization Fix Pass

Phase 71D.1 is complete for the required 10-file representative subset. It is a correction pass after the failed Phase 71D normalized visual QA, not runtime integration.

Implementation:

- Config: `scripts/asset-normalization.config.mjs`.
- Companion script: `scripts/fix-normalized-assets.mjs`.
- Dry run: `npm run normalize-assets:fix:dry-run`.
- Corrected subset run: `npm run normalize-assets:fix`.
- Candidate output: `normalized_assets_fixed/`.
- Report: `normalized_assets_fixed/FIX_PASS_REPORT.md`.
- Failed Phase 71C history remains unchanged under `normalized_assets/`.

The config records explicit source/output paths, asset type, horizontal-strip or single-image layout, frame count, target frame dimensions, baseline mode, expected output dimensions, notes, and cleanup mode. Required overrides now include four frames for Slime idle/attack and Bat idle, two frames for every configured hit sheet, six frames for player walk/cast, four frames for standard non-hit actions, 64x64 cells for player/small enemies/effects, and 128x128 cells for Gatekeeper.

The companion script processes only the 10-file fix subset. It detects probable opaque light checkerboard/preview backgrounds and removes only low-saturation light pixels connected to the outer image edges when an automated safety gate passes. It does not use broad chroma-key removal. If detection or cleanup confidence is insufficient, the file is warned and should use manual cleanup or regenerated transparent source instead.

Fix subset result:

- Attempted/output: 10/10.
- Automated failures/warnings: 0/0.
- All output dimensions match configured expectations.
- Preliminary static visual estimate: 8 pass, 2 needs review, 0 fail.
- Player walk needs playback review for cadence and the narrower final pose.
- Fire needs glow and pale-particle review on both light and dark battle backgrounds.
- Slime idle/attack and Bat idle now use four isolated frames without the Phase 71D cross-frame split.

All files under `normalized_assets_fixed/` remain corrected candidates only. Do not import them into React, create an asset manifest, implement animation playback, or create/use `src/assets/`. Review the small subset before authorizing a full corrected rerun. Phase 71E remains blocked until corrected outputs pass repeat visual QA and receive explicit human approval.

## Phase 71D.2 Human Visual QA

Phase 71D.2 inspected all 10 Phase 71D.1 corrected candidates with enlarged nearest-neighbor previews on dark and light backgrounds.

Artifacts:

- Preview generator: `scripts/generate-fixed-asset-qa-previews.mjs`.
- Preview evidence: `normalized_assets_fixed/qa_previews/`.
- Report: `normalized_assets_fixed/HUMAN_VISUAL_QA_REPORT.md`.
- Normalized candidates under `normalized_assets_fixed/` were not altered.

Human QA result:

- Pass: 1.
- Needs review: 3.
- Fail: 6.
- Phase 71D.3 readiness at this Phase 71D.2 checkpoint: blocked.

The single pass is Gatekeeper idle, which provides the clean comparison reference. Fire, Elite Crystal Slime idle, and Gold Coin need review. Word Mage idle/walk, Slime idle/attack, Bat idle, and Goblin idle fail because opaque light/gray edge residue, detached fragments, or pale ground remnants remain visible.

The Word Mage cleanup concern is confirmed. Broad automatic threshold expansion is unsafe because pale costume, book, staff, eye, crystal, and glow pixels overlap the contaminated color range. Phase 71D.1.1 should prefer source-aware per-frame masks, localized manual cleanup, or regenerated true-alpha sources. Fire cleanup must preserve warm colored glow while distinguishing neutral residue; its pale particles also need light-background readability review.

At this Phase 71D.2 checkpoint, do not recommend Phase 71D.3 or a full corrected rerun yet. The later Human acceptance of Phase 71D.1.1 superseded this gate for normalization only. Runtime integration, React imports, asset manifests, animation playback, and `src/assets/` remain prohibited.

## Phase 71D.1.1 Source-Aware Cleanup Refinement

Phase 71D.1.1 refines cleanup after the failed Phase 71D.2 Human Visual QA. It writes a separate candidate history under `normalized_assets_refined/` and does not overwrite source, Phase 71C, or Phase 71D.1 outputs.

Implementation:

- Config: `scripts/asset-normalization.config.mjs`.
- Script: `scripts/refine-normalized-assets.mjs`.
- Command: `npm run normalize-assets:refine`.
- Preview command: `npm run asset-qa-previews:refined`.
- Report: `normalized_assets_refined/REFINEMENT_REPORT.md`.
- Preview evidence: `normalized_assets_refined/qa_previews/`.

Source-aware rules include seeded neutral-pocket removal, per-frame detached-component seeds with maximum-size safety limits, bounded neutral-boundary passes, protected Word Mage crystal/staff zones, and detect-only handling when neutral-looking pixels overlap intentional art.

Result:

- Files processed: 10, including unchanged Gatekeeper reference copy.
- Post-preview estimate: 1 pass, 9 needs review, 0 fail.
- Word Mage idle: 237 visible pixels removed; major white pockets are gone.
- Word Mage walk: 442 visible pixels removed; repeated white pockets and right-edge fragments are gone.
- Slime/Bat/Goblin silhouettes and frame isolation remain intact after cleanup.
- Fire and Elite Crystal Slime remain pixel-identical detect-only candidates.
- Gatekeeper remains pixel-identical and is the clean pass reference.
- Gold Coin had five localized fringe pixels removed without changing its main highlights.

Broad bright-pixel deletion remains unsafe for Word Mage because cream clothing, book pages, staff highlights, eye highlights, and blue crystal glow overlap the contaminated brightness range. Fire and Elite Crystal Slime similarly require source-aware decisions around glow and sparkles.

Phase 71D.3 was previously blocked by this automated estimate. Human review subsequently accepted the refined subset as good enough to proceed with the full refined run; that acceptance does not make the subset or full-set outputs runtime-ready.

## Phase 71D.3 Full Refined Normalization

Phase 71D.3 runs the refined source-aware normalization pipeline across every organized production source/reference candidate currently present under the authorized `Asset/` categories.

Outputs and tooling:

- Command: `npm run normalize-assets:refined-full`.
- Output root: `normalized_assets_refined_full/`.
- Report: `normalized_assets_refined_full/FULL_REFINED_NORMALIZATION_REPORT.md`.
- Preview command: `npm run asset-qa-previews:refined-full`.
- Preview root: `normalized_assets_refined_full/qa_previews/`.

Run result:

- 34 files attempted, 34 successfully output, 0 skipped.
- 32 explicitly configured sprite/effect/icon files were normalized; card frame and dungeon background were preserved at source dimensions.
- 33 QA previews were generated: every configured spritesheet/effect/icon plus one background preview.
- No event PNGs were present, so no event output or preview exists for this run.
- All target dimensions and configured frame counts passed automated verification.
- All 10 accepted Phase 71D.1.1 subset outputs are byte-for-byte identical in the full output.

Cleanup policy:

- Use exact accepted per-file masks, seeds, protected regions, and detect-only behavior for the refined subset.
- Use conservative neutral-boundary cleanup for other small-monster sheets.
- Use detect-only final handling for player, effect, elite, boss, and UI files where neutral-looking pixels may be intentional glow, highlights, cream clothing, book pages, staff/crystal detail, particles, or sparkles.
- Never apply broad global bright-pixel deletion.
- Preserve backgrounds, event illustrations, and the vocabulary card frame unless a later safe and explicit action is approved.

Human QA remains mandatory. Priority concerns are Word Mage cast cadence/frame edges, Bat and Goblin defeat cross-frame slicing, Goblin attack frame edges, Fire hard-alpha glow, Wind contrast, Gatekeeper hit scale, hit-sheet spacing, card-frame transparency, and responsive background readability. Bat and Goblin defeat remain source-regeneration/manual-layout watchlist items.

Every Phase 71D.3 file is a normalized candidate only. Runtime integration, React imports, manifests, animation playback, and `src/assets/` remain prohibited until a later explicit phase after full Human Visual QA approval.

## Phase 71D.3.1 Defeat Frame-Region Correction

Bat and Goblin defeat source sheets do not use four equal-width logical cells even though both canvases are `1536x1024`. Equal division at `384/768/1152` crosses visible poses and creates torn normalized frames.

Per-file source regions are now part of the normalization configuration:

- Bat defeat: `0-459`, `460-849`, `850-1304`, `1305-1535`.
- Goblin defeat: `0-499`, `500-929`, `930-1299`, `1300-1535`.

The pipeline validates region count, integer coordinates, positive widths, source bounds, and non-overlap before extraction. Files without an override continue to use equal-width regions.

Corrected result:

- Both normalized sheets remain four `64x64` cells (`256x64`).
- Bat wings/particles and Goblin ears/body/staff/particles stay with their intended poses.
- Every corrected alpha bound has internal cell padding and does not touch a cell edge.
- Original source files remain unchanged and source regeneration is no longer required for this specific slicing defect.

The correction did not grant runtime approval. At the Phase 71D.3.1 checkpoint, both sheets remained normalized candidates pending cadence, particle ownership, scale, baseline, edge, and dark/light Human Visual QA. Phase 71D.4 below records that completed review.

## Phase 71D.4 Full-Set Human Visual QA

Phase 71D.4 reviewed all 34 normalized candidates and all 33 available QA previews from the full refined run. The preserved vocabulary card frame and dungeon background were also inspected directly at source dimensions.

Human decision totals:

- Pass: 18.
- Needs review: 14.
- Fail: 2.
- Human QA report: `normalized_assets_refined_full/FULL_HUMAN_VISUAL_QA_REPORT.md`.

Blocking assets:

- Gatekeeper attack: visible isolated body/key slivers indicate incorrect source-frame isolation. Try explicit nonuniform source regions first; regenerate the true-transparent source only if a clean extraction cannot be established.
- Vocabulary card frame: opaque baked checkerboard outside the frame requires a new true-transparent source.

Targeted follow-up scope includes localized edge cleanup for selected Slime, Bat, Goblin, Elite, and UI candidates; Fire glow and Wind contrast refinement; Elite Crystal Slime hit scale normalization; and later responsive layout QA for the dungeon background. Corrected Bat and Goblin defeat sheets now pass.

The Phase 71D.3 outputs remain normalized candidates, not runtime assets. Proceed to Phase 71D.5 Targeted Manual Cleanup / Regeneration List before considering Phase 71E planning. Runtime integration, React imports, manifests, animation playback, and `src/assets/` remain prohibited.

## Phase 71D.5 Targeted Cleanup / Regeneration

Phase 71D.5 targets only the two blocking failures identified by Phase 71D.4. Outputs are isolated under `normalized_assets_refined_targeted/`; no source or previous normalized folder is overwritten.

Targeted result:

- Files targeted: 2.
- Files fixed: 2.
- Files still failing: 0.
- Report: `normalized_assets_refined_targeted/TARGETED_CLEANUP_REPORT.md`.
- QA previews: `normalized_assets_refined_targeted/qa_previews/`.

Gatekeeper attack uses explicit nonuniform source regions `0-625`, `626-1241`, `1242-1944`, and `1945-2507`. This keeps all four complete poses, keys, attack arc, and particles in the correct `128x128` output cells. Source regeneration is not required for the slicing defect. Thin neutral ground/shadow lines remain a non-blocking polish item.

The vocabulary card frame had no alternate transparent source under `Asset/ui/`. A dedicated safety-gated cleanup removed only light low-saturation pixels connected to the outer canvas edge. The output preserves `1058x1487`, creates 187,660 transparent exterior pixels, removes the visible checkerboard, and preserves the opaque parchment and decorative frame.

Both blockers are resolved, so Phase 71E Runtime Integration Planning may proceed. This approval covers planning only. Targeted files remain candidates; runtime integration, React imports, `assetManifest`, playback, and `src/assets/` remain prohibited. Phase 71D.4 needs-review assets remain in the polish backlog unless later layout/integration planning identifies a blocker.

## Phase 71E Runtime Integration Planning

Phase 71E defines the handoff from normalized candidates to a later controlled integration phase without performing that integration.

Planning documents:

- `RUNTIME_ASSET_INVENTORY.md` is the authoritative 34-candidate planning inventory.
- `RUNTIME_ASSET_STRUCTURE_PROPOSAL.md` defines the proposed runtime tree, naming conventions, source precedence, ownership boundaries, fallbacks, and staged copy/integration order.
- `RUNTIME_INTEGRATION_MAPPING.md` maps candidates to current game identities and resolved presentation states and defines future animation metadata requirements.

Inventory summary:

- 18 Phase 71D.4 clean pass candidates.
- 14 usable candidates with non-blocking polish or layout backlog.
- 2 Phase 71D.5 targeted ready candidates replacing the obsolete Gatekeeper attack and vocabulary card-frame failures.
- 0 event illustration candidates.

Authoritative candidate precedence:

1. Gatekeeper attack and vocabulary card frame use `normalized_assets_refined_targeted/`.
2. Every other inventory asset uses `normalized_assets_refined_full/`.
3. `Asset/` and earlier normalization-history folders must never be imported at runtime.

The proposed future runtime structure groups player, monsters, elites, and bosses under `src/assets/sprites/`; effects by elemental/defense/feedback purpose; UI into frames/icons; backgrounds by scene; and event illustrations separately. Phase 71E does not create any of these folders.

Future metadata must explicitly declare asset ID, source file, category, identity, state, frame count, frame dimensions, loop/one-shot/static behavior, playback purpose, return state, baseline, facing, optional anchor, fallback, reduced-motion frame, and readiness. Cadence values remain intentionally unlocked and cannot affect quiz timers or game resolution.

Safety and fallback rules:

- Runtime visual state is derived from already-resolved gameplay state.
- Animation completion cannot apply combat, saves, rewards, progression, purchases, or answer results.
- Missing/load-failed assets keep existing emoji/CSS/static fallbacks.
- Reduced motion uses representative stable frames and preserves textual feedback.
- Effects never reveal correctness or triggered cards before answer resolution and never obscure quiz/control UI.
- Crystal Slime maps only to `elite-monster-slime`; missing elite/monster/boss identities keep fallbacks.

The non-blocking polish backlog remains separate from planning readiness and includes localized sprite/icon fringe, Elite hit scale, Gatekeeper shadow/dust contrast, Fire/Wind readability, card-frame responsive insets, and battle-background layout QA.

Recommended next phase: **Phase 71F Controlled Runtime Integration**, starting with static battle identities and fallbacks. A new explicit implementation request is required before adding files to `src/assets/`, imports, metadata catalogs, renderers, or animation playback.

## Phase 61 Verification

Phase 61 should be considered complete when:

- `ASSET_PLAN.md` exists.
- Future style, sprite specs, naming, folder structure, manifest, mapping, prompts, and integration rules are documented.
- No real image assets are added.
- No runtime code depends on missing assets.
- `npm run build` passes.
