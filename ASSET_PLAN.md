# ASSET_PLAN.md

This document defines the future asset direction for WordQuest. Phase 61 is planning and structure only: no final art assets, generated image files, runtime asset imports, new dependencies, or gameplay changes are added.

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
- Idle: 4 frames
- Attack: 4 frames
- Hit: 2 frames
- Defeat: 3 to 4 frames
- Effects: 4 to 6 frames

Phase 61 does not implement animation playback. These specs are for later asset generation and integration.

## Naming Convention

Use lowercase snake_case for future asset ids and filenames.

General pattern:

- `{category}_{name}_{state}.png`
- `{category}_{name}_{state}_sheet.png` for spritesheets
- `{category}_{name}.png` for single-frame UI icons or effects

Examples:

- `player_word_hero_idle.png`
- `player_word_hero_attack.png`
- `player_word_hero_hit.png`
- `player_word_hero_defeat.png`
- `monster_slime_idle.png`
- `monster_slime_attack.png`
- `monster_slime_hit.png`
- `monster_slime_defeat.png`
- `elite_slime_idle.png`
- `boss_gatekeeper_idle.png`
- `boss_gatekeeper_special.png`
- `effect_shield_block.png`
- `ui_gold_coin.png`

Asset ids should match filenames without the extension when possible, such as `monster_slime_idle`.

## Future Folder Structure

Do not create empty folders until real assets are added. The intended future structure is:

```text
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

If folders are added before they contain real files, use `.gitkeep` only if there is a concrete need. The project already uses `.gitkeep` in a few source folders, but Phase 61 stays document-only.

## Future Asset Manifest

This manifest lists assets needed by current game systems. It is document-only for now and is not wired into runtime.

### Player

Word Hero:

- `player_word_hero_idle.png`
- `player_word_hero_attack.png`
- `player_word_hero_hit.png`
- `player_word_hero_shield.png`
- `player_word_hero_defeat.png`
- Optional later: `player_word_hero_victory.png`

### Monsters

Each current monster should eventually have idle, attack, hit, and defeat states.

Slime:

- `monster_slime_idle.png`
- `monster_slime_attack.png`
- `monster_slime_hit.png`
- `monster_slime_defeat.png`

Goblin:

- `monster_goblin_idle.png`
- `monster_goblin_attack.png`
- `monster_goblin_hit.png`
- `monster_goblin_defeat.png`

Bat:

- `monster_bat_idle.png`
- `monster_bat_attack.png`
- `monster_bat_hit.png`
- `monster_bat_defeat.png`

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

- Word Hero: `player_word_hero_idle.png`

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

Use these prompt templates when generating assets later. Do not generate images during Phase 61.

Base sprite prompt:

```text
Create a cozy fantasy pixel art sprite sheet for [asset name]. Style: simple readable 64x64 pixel art, transparent background, side-view, warm color palette, suitable for a friendly vocabulary dungeon game. Include [frame list]. Keep silhouette clear at mobile size. No text, no watermark.
```

Player prompt:

```text
Create a cozy fantasy pixel art sprite sheet for the Word Hero player character. The character is a friendly vocabulary adventurer with book-and-shield energy, side-view facing right, simple readable 64x64 frames, transparent background, warm camp palette. Include 4 idle frames, 4 attack frames, 2 hit frames, 4 shield frames, and 4 defeat frames. No text, no watermark.
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
- Dungeon battle: Word Hero placeholder, monster/elite/boss emoji placeholders, event discovery cards, battle lane
- Shop: merchant-style CSS/placeholder presentation
- Run Complete / Run Failed: summary presentation and boss placeholder
- Effects: CSS motion, text badges, emoji, and generated Web Audio sounds

Replacement should happen in small passes. Keep fallback placeholders visible until each asset category is verified in production builds.

## Known Limitations

- No final art assets exist yet.
- No image files are added in Phase 61.
- No runtime asset manifest exists yet.
- No animation playback system exists yet.
- No sprite loading/error fallback component exists yet.
- Exact sprite sizes may need adjustment after mobile visual tests.
- Asset generation prompts may need iteration for consistent style.

## Phase 61 Verification

Phase 61 should be considered complete when:

- `ASSET_PLAN.md` exists.
- Future style, sprite specs, naming, folder structure, manifest, mapping, prompts, and integration rules are documented.
- No real image assets are added.
- No runtime code depends on missing assets.
- `npm run build` passes.
