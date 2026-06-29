# ASSET_PLAN.md

This document defines the future asset direction for WordQuest. Phase 61 is planning and structure only: no final art assets, generated image files, runtime asset imports, new dependencies, or gameplay changes are added.

Phase 70A adds `ASSET_PROMPTS.md` as the practical pixel-art style bible and prompt pack for future image-generation work. It is still documentation-only: no final art assets, generated image files, runtime asset imports, new dependencies, or gameplay changes are added.

The Phase 70 Player Batch 1A and Monster Batch 1B source/reference candidates have now been generated and reviewed. They are production sources, not normalized runtime assets, and remain outside runtime integration.

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

Phase 61 does not implement animation playback. These specs are for later asset generation and integration.

Generated images may be high resolution, contain extra transparent space, use preview scaling, or miss exact runtime frame dimensions. Accepted source images must pass a normalization step before runtime integration:

- Verify transparent background and alpha.
- Split and inspect every frame.
- Crop sprite bounds.
- Resize into consistent 64x64 frame cells where appropriate.
- Center each sprite.
- Align character ground baselines or flying enemy hover baselines.
- Export final runtime-ready spritesheets.
- Preserve original generated source files separately from normalized runtime assets.

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
  characters/
    player/
    monsters/

src/assets/
  characters/
    player/
    monsters/
    elites/
    bosses/
  effects/
  ui/
  backgrounds/
```

`asset_sources/` or a documentation/reference location is for original generated high-resolution source images. `src/assets/` is reserved for normalized runtime-ready files during a future explicit integration phase. Do not create or move folders as part of this documentation update.

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

- `boss_gatekeeper_idle.png`
- `boss_gatekeeper_attack.png`
- `boss_gatekeeper_special.png`
- `boss_gatekeeper_hit.png`
- `boss_gatekeeper_defeat.png`

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

- `effect_physical_slash.png`
- `effect_shield_block.png`
- `effect_fire.png`
- `effect_water.png`
- `effect_wind.png`
- `effect_earth.png`
- `effect_mastery_glow.png`
- `effect_victory.png`
- `effect_defeat.png`
- `effect_timeout.png`

### UI

- `ui_gold_coin.png`
- `ui_hp_heart.png`
- `ui_shield.png`
- `ui_timer.png`
- `ui_mastery_star.png`
- `ui_word_energy.png`
- `ui_shop_reroll.png`

### Backgrounds

- `background_home_camp.png`
- `background_deck_spellbook.png`
- `background_training_room.png`
- `background_dungeon_battle.png`
- `background_shop.png`
- `background_run_result.png`

## Current Data Mapping

Current data should map to future assets by stable, readable asset ids. Do not require these assets at runtime until they exist.

Player:

- Word Mage: `player_word_mage_idle_sheet.png`

Monsters:

- Slime: `monster_slime_idle.png`
- Goblin: `monster_goblin_idle.png`
- Bat: `monster_bat_idle.png`
- Wolf: `monster_wolf_idle.png`
- Mushroom: `monster_mushroom_idle.png`
- Wisp: `monster_wisp_idle.png`
- Skeleton: `monster_skeleton_idle.png`
- Imp: `monster_imp_idle.png`
- Stone Bug: `monster_stone_bug_idle.png`
- Dark Crow: `monster_dark_crow_idle.png`

Bosses:

- Gatekeeper: `boss_gatekeeper_idle.png`
- Word Warden: `boss_word_warden_idle.png`
- Grammar Golem: `boss_grammar_golem_idle.png`
- Shadow Reader: `boss_shadow_reader_idle.png`
- Memory Dragon: `boss_memory_dragon_idle.png`

Effects:

- Physical attack: `effect_physical_slash.png`
- Shield: `effect_shield_block.png`
- Fire element: `effect_fire.png`
- Water element: `effect_water.png`
- Wind element: `effect_wind.png`
- Earth element: `effect_earth.png`
- Mastery bonus: `effect_mastery_glow.png`
- Victory: `effect_victory.png`
- Defeat: `effect_defeat.png`

## Integration Rules

Future real assets should be integrated gradually.

Rules:

- Missing assets must fall back to current emoji/text/CSS placeholders.
- Asset loading failure must not crash the app.
- Assets must not change combat behavior, answer checking, timers, HP, shield, gold, mastery, Word Energy, deck unlocks, save behavior, or encounter progression.
- Assets must not reveal hidden answers, target cards, correct answers, or post-answer result information before the player answers.
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
- Request no large preview canvas and no upscale.
- Require transparent background only.
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

- Player Batch 1A and Monster Batch 1B generated source/reference candidates exist.
- No normalized runtime-ready art assets exist yet.
- No runtime asset manifest exists yet.
- No animation playback system exists yet.
- No sprite loading/error fallback component exists yet.
- Exact sprite sizes may need adjustment after mobile visual tests.
- Accepted generated sources still need visual batch QA and normalization before any future runtime integration.
- Player character concept exploration is complete; the Word Mage identity is locked.
- Effects Batch 1C and additional monsters remain optional future production after documentation and batch QA are current.

## Phase 61 Verification

Phase 61 should be considered complete when:

- `ASSET_PLAN.md` exists.
- Future style, sprite specs, naming, folder structure, manifest, mapping, prompts, and integration rules are documented.
- No real image assets are added.
- No runtime code depends on missing assets.
- `npm run build` passes.
