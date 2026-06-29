# ASSET_PROMPTS.md

This document is the Phase 70A prompt pack and style bible for WordQuest pixel art generation.

Player Batch 1A and Monster Batch 1B have been generated as production source/reference candidates. They are not normalized runtime assets and must not be imported into the app yet.

Use this document with `ASSET_PLAN.md` when generating real assets in a later workflow.

## Pixel Art Style Bible

WordQuest art direction:

- Cozy fantasy pixel art.
- Friendly dungeon learning adventure.
- Beginner-friendly, playful, readable, and never too scary.
- Warm camp and dungeon palette with amber, moss green, soft teal, muted violet, warm stone, and parchment accents.
- Clean medium-resolution pixel art with readable silhouettes.
- Side-view battle framing.
- Player sprites face right.
- Enemy and boss sprites face left.
- Transparent background for sprites, effects, and UI icons.
- Background art should be low-detail behind UI and should not compete with text or quiz choices.
- No text inside generated images.
- No watermark.
- No realistic rendering.
- No painterly gradients or anti-aliasing when requesting strict pixel art.
- Consistent lighting direction from upper-left.
- Consistent outline thickness, usually 1 to 2 pixel dark outline with selective inner highlights.
- Readable on mobile.
- Visuals must not reduce quiz readability, hide controls, obscure Thai text, or make answer choices harder to scan.

## Canonical Main Hero Identity

The player character concept is locked. Future image-generation sessions should reuse this identity consistently and should not reinterpret the protagonist as a different class.

Canonical protagonist:

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

Reusable identity phrase:

```text
canonical WordQuest Word Mage: young male chibi mage adventurer, fluffy short brown hair, bright blue eyes, blue cape with gold trim, cream-and-brown fantasy adventurer mage outfit, magical staff with blue crystal, blue-and-gold spellbook/tome, friendly beginner-hero vibe, vocabulary-learning elemental mage theme
```

Use staff-and-spellbook spellcasting as the default action language. Avoid sword, dagger, bow, shield-warrior, knight armor, rogue hood, or generic adventurer language in player prompts.

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

These idle and walk sheets are approved references for the canonical WordQuest Word Mage. Treat them as the visual anchor for face, body design, hair, eyes, outfit, cape, staff, spellbook, proportions, palette, lighting, and cozy fantasy pixel art treatment.

Current cast/attack candidate:

- `player_word_mage_cast_attack_sheet.png`

Status:

- Provisional approved candidate / polish pass recommended.
- The candidate succeeds in identity consistency.
- The candidate has readable action flow.
- The candidate is not fully final yet.

Next cast/attack refinement should keep:

- Same approved face and body design.
- Fluffy brown hair.
- Bright blue eyes.
- Blue cape with gold trim.
- Cream-and-brown outfit.
- Magical staff with blue crystal.
- Blue-and-gold spellbook.
- Cozy fantasy pixel art.
- Upper-left lighting.

Next cast/attack refinement should emphasize:

- Spellbook-to-staff magic flow.
- Compact blue-gold magic bolt.
- No readable letters or runes.
- No oversized effect.
- No weapon swing, slash, spear thrust, weapon-forward pose, or gun-like attack read.

Remaining review decisions:

- `player_word_mage_defend_sheet.png`: generated candidate / pending final batch review unless explicitly approved later.
- `player_word_mage_hurt_sheet.png`: approved candidate / usable v1.
- `player_word_mage_victory_sheet.png`: approved candidate / usable v1.

Future player prompts should preserve the approved idle/walk face, body design, outfit, equipment, palette, proportions, and right-facing orientation.

Integration status:

- Do not integrate image files into runtime yet.
- Keep all fallback, safety, and gameplay-neutral asset integration rules unchanged.

## Current Monster Asset Production Status

Status date: 2026-06-29

All idle, attack, hit, and defeat sheets for Slime, Bat, and Goblin in Monster Batch 1B have been generated.

Slime:

- `monster_slime_idle_sheet.png`: approved candidate / usable v1.
- `monster_slime_attack_sheet.png`: approved candidate / usable v1.
- `monster_slime_hit_sheet.png`: usable candidate; normalize scale and spacing later.
- `monster_slime_defeat_sheet.png`: approved candidate / usable v1.

Bat:

- `monster_bat_idle_sheet.png`: approved candidate / usable v1.
- `monster_bat_attack_sheet.png`: approved candidate / usable v1.
- `monster_bat_hit_sheet.png`: usable candidate; normalize scale and spacing later.
- `monster_bat_defeat_sheet.png`: usable candidate; check transparency and background cleanup later.

Goblin:

- `monster_goblin_idle_sheet.png`: approved candidate / usable v1.
- `monster_goblin_attack_sheet.png`: approved candidate / usable v1.
- `monster_goblin_hit_sheet.png`: usable candidate; normalize scale and spacing later.
- `monster_goblin_defeat_sheet.png`: usable candidate; three visible stages are acceptable within the planned three-to-four-frame defeat range.

The first goblin idle candidate was rejected because it faced the wrong direction. The regenerated goblin set correctly faces left and is usable.

## Shared Prompt Rules

Use these rules in every prompt unless a specific asset says otherwise:

- Request clean pixel art, not illustration, not vector, not 3D, not realism.
- Specify the exact canvas or frame size.
- Specify sprite direction: player faces right, enemies face left.
- Specify transparent background for sprites, effects, and icons.
- Specify no text and no watermark.
- Keep detail simple enough for mobile readability.
- Preserve a friendly vocabulary-learning tone.
- Keep effects readable but not visually noisy.
- Use consistent outline thickness and upper-left lighting.
- Ask for a horizontal spritesheet when animation is needed.
- Ask for evenly spaced frames with consistent frame dimensions.
- Explicitly request a final runtime-targeted spritesheet.
- Specify total canvas size, such as 256x64 for four frames or 128x64 for two frames.
- Require every frame cell to be exactly 64x64.
- Specify no large preview canvas and no upscale.
- Specify the intended sprite body size within each 64x64 frame.
- Plan a normalization safety pass even when exact dimensions are requested.

## Negative Prompt Rules

Use this negative prompt baseline:

```text
no text, no letters, no numbers, no watermark, no logo, no signature, no realistic rendering, no 3D render, no painterly brushwork, no smooth vector art, no heavy anti-aliasing, no blurry pixels, no horror, no gore, no blood, no scary realism, no excessive detail, no busy background, no cropped character, no inconsistent frame sizes
```

For strict pixel art, add:

```text
no gradients, no soft airbrush shading, no high-resolution painting, no semi-realistic lighting
```

## First Asset Batch Plan

Batch 1A and Batch 1B are generated source/reference candidates. Batch 1C and Batch 1D remain future production.

### Batch 1A - Player Test - Generated

- `player_word_mage_idle_sheet.png`
- `player_word_mage_walk_sheet.png`
- `player_word_mage_cast_attack_sheet.png`
- `player_word_mage_defend_sheet.png`
- `player_word_mage_hurt_sheet.png`
- `player_word_mage_victory_sheet.png`

### Batch 1B - Monster Test - Generated

- `monster_slime_idle_sheet.png`
- `monster_slime_attack_sheet.png`
- `monster_slime_hit_sheet.png`
- `monster_slime_defeat_sheet.png`
- `monster_bat_idle_sheet.png`
- `monster_bat_attack_sheet.png`
- `monster_bat_hit_sheet.png`
- `monster_bat_defeat_sheet.png`
- `monster_goblin_idle_sheet.png`
- `monster_goblin_attack_sheet.png`
- `monster_goblin_hit_sheet.png`
- `monster_goblin_defeat_sheet.png`

### Batch 1C - Effects

- `effect_slash_sheet.png`
- `effect_shield_block_sheet.png`
- `effect_fire_sheet.png`
- `effect_water_sheet.png`
- `effect_wind_sheet.png`
- `effect_earth_sheet.png`
- `effect_upgrade_spark_sheet.png`

### Batch 1D - Background/Card

- `background_dungeon_battle_01.png`
- `ui_vocabulary_card_frame.png`
- `ui_gold_coin.png`
- `ui_heart_hp.png`
- `ui_shield.png`

## Intended Future Paths

Keep generated source/reference files separate from normalized runtime-ready assets.

```text
asset_sources/
  characters/player/
  characters/monsters/

src/assets/characters/player/
src/assets/characters/monsters/
src/assets/characters/bosses/
src/assets/effects/
src/assets/ui/
src/assets/backgrounds/
```

Use `asset_sources/` or a documentation/reference location for original generated high-resolution files. Reserve `src/assets/` for normalized runtime-ready assets during a future explicit integration phase. Use lowercase snake_case filenames.

## Prompt Template Format

Use this structure for each generated asset:

```text
Purpose:
[What this asset is for.]

Filename:
[lowercase_snake_case.png]

Spec:
[Canvas size, frame size, number of frames, spritesheet direction, background.]

Prompt:
[Full image-generation prompt.]

Negative prompt:
[What to avoid.]

QA:
- [Check 1]
- [Check 2]
- [Check 3]

Integration notes:
- [Where the asset should later live.]
- [Fallback behavior.]
- [Any UI/gameplay safety notes.]
```

## Player Character Prompt Templates

The player is the locked canonical WordQuest Word Mage. Keep the character friendly, readable, magical, and vocabulary-themed. The character should use a magical staff with a blue crystal and a blue-and-gold spellbook/tome. Side-view, facing right. Do not turn the character into a swordsman, knight, rogue, archer, armored warrior, or generic adventurer.

### player_word_mage_idle_sheet.png

Purpose:
Player idle animation for battle.

Filename:
`player_word_mage_idle_sheet.png`

Spec:
64x64 per frame, 4 frames, horizontal spritesheet, transparent background.

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for the canonical WordQuest Word Mage idle animation. 64x64 pixels per frame, 4 evenly spaced frames, transparent background. Young male chibi mage adventurer with fluffy short brown hair, bright blue eyes, blue cape with gold trim, cream-and-brown fantasy adventurer mage outfit, magical staff with blue crystal, and blue-and-gold spellbook/tome. Side-view facing right. Warm camp colors, readable silhouette, simple 1 to 2 pixel outline, upper-left lighting, subtle breathing idle pose, friendly beginner-hero vibe, vocabulary-learning elemental mage theme. No swords, no knight armor, no rogue outfit, no text, no watermark.
```

Negative prompt:
```text
no text, no letters, no numbers, no watermark, no logo, no signature, no realistic rendering, no 3D render, no painterly brushwork, no smooth vector art, no heavy anti-aliasing, no gore, no horror, no oversized weapon, no busy background, no cropped character, no inconsistent frame sizes
```

QA:
- 4 frames.
- Each frame is 64x64.
- Transparent background.
- Player faces right.
- Readable at small size.
- No text or watermark.

Integration notes:
- Future path: `src/assets/characters/player/player_word_mage_idle_sheet.png`.
- Keep emoji player fallback if the asset is missing.

### player_word_mage_cast_attack_sheet.png

Purpose:
Player attack animation after a correct Dungeon answer triggers a card.

Filename:
`player_word_mage_cast_attack_sheet.png`

Spec:
64x64 per frame, 4 frames, horizontal spritesheet, transparent background.

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for the canonical WordQuest Word Mage cast/attack animation. 64x64 pixels per frame, 4 evenly spaced frames, transparent background. Young male chibi mage adventurer with fluffy short brown hair, bright blue eyes, blue cape with gold trim, cream-and-brown fantasy adventurer mage outfit, magical staff with blue crystal, and blue-and-gold spellbook/tome. Side-view facing right. Preserve the approved idle and walk reference identity exactly. The mage opens the blue-and-gold spellbook, magic flows from the spellbook into the staff crystal, then a compact blue-gold magic bolt releases forward. The action should read as staff-and-spellbook spellcasting, not a weapon thrust. Magical, friendly, vocabulary-themed, not violent. Warm colors, readable silhouette, simple outline, upper-left lighting, mobile-readable. No swords, no weapon swing, no spear thrust, no gun-like pose, no readable letters or runes, no oversized effect, no text, no watermark.
```

Negative prompt:
Use the shared negative prompt. Add: `no blood, no realistic weapon, no sword, no dagger, no bow, no knight armor, no rogue hood, no aggressive gore, no spear thrust, no weapon-forward pose, no gun pose, no slash arc, no readable runes, no readable letters, no oversized spell effect`.

QA:
- 4 frames.
- Player faces right.
- Attack motion reads clearly.
- Action reads as spellbook-to-staff casting.
- Blue-gold magic bolt is compact.
- Character identity matches approved idle/walk references.
- No text or answer-like symbols.

Integration notes:
- Future trigger: correct answer card activation.
- Must not reveal whether an answer is correct before result resolution.
- Status as of 2026-06-24: provisional approved candidate / polish pass recommended.

### player_word_mage_hurt_sheet.png

Purpose:
Player hit feedback when wrong answer, timeout, or enemy attack damages HP/shield.

Filename:
`player_word_mage_hurt_sheet.png`

Spec:
64x64 per frame, 2 frames, horizontal spritesheet, transparent background.

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for the canonical WordQuest Word Mage hurt reaction. 64x64 pixels per frame, 2 evenly spaced frames, transparent background. Young male chibi mage adventurer with fluffy short brown hair, bright blue eyes, blue cape with gold trim, cream-and-brown fantasy mage adventurer outfit, magical staff with blue crystal, and blue-and-gold spellbook/tome. Side-view facing right, flinching slightly with a small dust puff or soft impact star. Not scary, no injury detail, no blood. Warm palette, readable silhouette, simple outline, upper-left lighting. No swords, no text, no watermark.
```

Negative prompt:
Use the shared negative prompt. Add: `no blood, no wounds, no horror`.

QA:
- 2 frames.
- Player faces right.
- Hit reaction is readable but not scary.

Integration notes:
- Can pair with existing damage/shield UI feedback later.

### player_word_mage_defend_sheet.png

Purpose:
Player guard or shield animation when shield is gained or absorbs damage.

Filename:
`player_word_mage_defend_sheet.png`

Spec:
64x64 per frame, 4 frames, horizontal spritesheet, transparent background.

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for the canonical WordQuest Word Mage defend animation. 64x64 pixels per frame, 4 evenly spaced frames, transparent background. Young male chibi mage adventurer with fluffy short brown hair, bright blue eyes, blue cape with gold trim, cream-and-brown fantasy mage adventurer outfit, magical staff with blue crystal, and blue-and-gold spellbook/tome. Side-view facing right. The mage raises the spellbook and staff to create a soft teal and warm gold vocabulary barrier. Readable at mobile size, simple outline, upper-left lighting. No shield-warrior pose, no sword, no text, no watermark.
```

Negative prompt:
Use the shared negative prompt. Add: `no readable letters on the book, no words, no noisy glow`.

QA:
- 4 frames.
- Shield reads clearly.
- No letters or words appear on book/shield.

Integration notes:
- Future trigger: shield gained or shield block.

### player_word_mage_victory_sheet.png

Purpose:
Player victory animation after a boss or encounter win.

Filename:
`player_word_mage_victory_sheet.png`

Spec:
64x64 per frame, 4 frames, horizontal spritesheet, transparent background.

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for the canonical WordQuest Word Mage victory animation. 64x64 pixels per frame, 4 evenly spaced frames, transparent background. Young male chibi mage adventurer with fluffy short brown hair, bright blue eyes, blue cape with gold trim, cream-and-brown fantasy mage adventurer outfit, magical staff with blue crystal, and blue-and-gold spellbook/tome. Side-view facing right. The mage smiles, lifts the blue crystal staff, and the spellbook glows with a small friendly blue-gold sparkle. Vocabulary-learning elemental mage theme, cheerful beginner-hero vibe. No sword, no knight armor, no text, no watermark.
```

Negative prompt:
Use the shared negative prompt. Add: `no weapon victory pose, no sword, no readable letters, no text`.

QA:
- 4 frames.
- Player faces right.
- Victory reads clearly without text.
- Character identity matches the canonical Word Mage.

Integration notes:
- Future trigger: encounter victory or run completion.
- Should remain celebratory but not visually noisy.

### player_word_mage_walk_sheet.png

Purpose:
Player walk animation for future map, transition, or camp movement.

Filename:
`player_word_mage_walk_sheet.png`

Spec:
64x64 per frame, 4 to 6 frames, horizontal spritesheet, transparent background.

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for the canonical WordQuest Word Mage walk animation. 64x64 pixels per frame, 4 to 6 evenly spaced frames, transparent background. Young male chibi mage adventurer with fluffy short brown hair, bright blue eyes, blue cape with gold trim, cream-and-brown fantasy mage adventurer outfit, magical staff with blue crystal, and blue-and-gold spellbook/tome. Side-view facing right. Gentle walking loop, cape bounce, staff held safely, spellbook tucked close or floating lightly. Friendly beginner-hero vibe, readable silhouette, upper-left lighting. No sword, no knight armor, no rogue outfit, no text, no watermark.
```

Negative prompt:
Use the shared negative prompt. Add: `no sword, no heavy armor, no rogue hood, no aggressive run`.

QA:
- 4 to 6 frames.
- Player faces right.
- Walk loop keeps cape, staff, and spellbook consistent.
- Character identity matches the canonical Word Mage.

Integration notes:
- Future trigger: map movement or transition animation.
- Not required for current runtime until movement presentation exists.

### player_word_mage_defeat_sheet.png

Purpose:
Player defeat animation for Run Failed.

Filename:
`player_word_mage_defeat_sheet.png`

Spec:
64x64 per frame, 4 frames, horizontal spritesheet, transparent background.

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for the canonical WordQuest Word Mage defeat animation. 64x64 pixels per frame, 4 evenly spaced frames, transparent background. Young male chibi mage adventurer with fluffy short brown hair, bright blue eyes, blue cape with gold trim, cream-and-brown fantasy mage adventurer outfit, magical staff with blue crystal, and blue-and-gold spellbook/tome. Side-view facing right, kneels or sits down tired with staff lowered and spellbook dim, gentle and non-scary. Warm muted colors, readable silhouette, no injury detail, no blood, simple outline, upper-left lighting. No sword, no knight armor, no text, no watermark.
```

Negative prompt:
Use the shared negative prompt. Add: `no death realism, no blood, no gore, no horror`.

QA:
- 4 frames.
- Defeat reads as tired/failure, not violent.
- Transparent background.
- Character identity matches the canonical Word Mage.

Integration notes:
- Future trigger: Run Failed presentation.

## Monster Prompt Templates

All normal monsters are friendly fantasy enemies. They should be readable, simple, and not scary. Enemy sprites face left.

### Slime Templates

#### monster_slime_idle_sheet.png

Purpose:
Slime idle animation.

Filename:
`monster_slime_idle_sheet.png`

Spec:
64x64 per frame, 4 frames, horizontal spritesheet, transparent background.

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for a friendly green dungeon slime idle animation. 64x64 pixels per frame, 4 evenly spaced frames, transparent background. Side-view facing left. Rounded bouncy silhouette, small shine, soft green body, playful not scary, warm dungeon palette, simple outline, upper-left lighting, readable on mobile. No text, no watermark.
```

Negative prompt:
Use the shared negative prompt. Add: `no horror slime, no teeth, no gore`.

QA:
- Faces left.
- 4 frames.
- Silhouette is readable and friendly.

Integration notes:
- Future path: `src/assets/characters/monsters/monster_slime_idle_sheet.png`.

#### monster_slime_attack_sheet.png

Purpose:
Slime attack animation.

Filename:
`monster_slime_attack_sheet.png`

Spec:
64x64 per frame, 4 frames, horizontal spritesheet, transparent background.

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for a friendly green dungeon slime attack animation. 64x64 pixels per frame, 4 evenly spaced frames, transparent background. Side-view facing left. The slime squashes and stretches forward with a soft bounce attack, playful not scary. Warm dungeon palette, simple outline, upper-left lighting, mobile-readable. No text, no watermark.
```

Negative prompt:
Use the shared negative prompt.

QA:
- Attack direction faces left.
- Motion reads as bounce/ram.
- No scary details.

Integration notes:
- Future trigger: enemy attack after wrong answer or timeout.

#### monster_slime_hit_sheet.png

Purpose:
Slime hit reaction.

Filename:
`monster_slime_hit_sheet.png`

Spec:
64x64 per frame, 2 frames, horizontal spritesheet, transparent background.

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for a friendly green dungeon slime hit reaction. 64x64 pixels per frame, 2 evenly spaced frames, transparent background. Side-view facing left. The slime squishes back with a small sparkle impact, playful and non-scary. Simple outline, warm palette, upper-left lighting. No text, no watermark.
```

Negative prompt:
Use the shared negative prompt.

QA:
- 2 frames.
- Hit reaction is clear without gore.

Integration notes:
- Future trigger: card damage dealt.

#### monster_slime_defeat_sheet.png

Purpose:
Slime defeat animation.

Filename:
`monster_slime_defeat_sheet.png`

Spec:
64x64 per frame, 4 frames, horizontal spritesheet, transparent background.

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for a friendly green dungeon slime defeat animation. 64x64 pixels per frame, 4 evenly spaced frames, transparent background. Side-view facing left. The slime gently flattens into a small puddle or sparkle puff, playful not scary. Warm dungeon palette, simple outline, upper-left lighting. No text, no watermark.
```

Negative prompt:
Use the shared negative prompt. Add: `no gore, no horror, no realistic slime`.

QA:
- 4 frames.
- Defeat is readable and friendly.

Integration notes:
- Future trigger: Monster Defeated result.

### Bat Templates

Use the Slime structure for all Bat states with this base description:

```text
friendly small purple dungeon bat, side-view facing left, rounded wings, cute eyes, not scary, warm dungeon palette, readable silhouette, simple outline, upper-left lighting
```

Filenames and state prompts:

- `monster_bat_idle_sheet.png`: 64x64 per frame, 4 frames, gentle wing flap idle.
- `monster_bat_attack_sheet.png`: 64x64 per frame, 4 frames, small swoop toward the left.
- `monster_bat_hit_sheet.png`: 64x64 per frame, 2 frames, soft flinch with tiny star impact.
- `monster_bat_defeat_sheet.png`: 64x64 per frame, 4 frames, tired flutter down or soft puff.

Negative prompt:
Use the shared negative prompt. Add: `no horror bat, no fangs focus, no blood`.

QA:
- Enemy faces left.
- Wings stay inside 64x64 frame.
- Reads as bat at small size.

Integration notes:
- Future path: `src/assets/characters/monsters/`.

### Goblin Templates

Use the Slime structure for all Goblin states with this base description:

```text
friendly small green goblin vocabulary dungeon enemy, side-view facing left, simple tunic, tiny wooden spoon club or practice stick, mischievous but not scary, warm dungeon palette, readable silhouette, simple outline, upper-left lighting
```

Filenames and state prompts:

- `monster_goblin_idle_sheet.png`: 64x64 per frame, 4 frames, small idle bounce.
- `monster_goblin_attack_sheet.png`: 64x64 per frame, 4 frames, light practice-stick swing facing left.
- `monster_goblin_hit_sheet.png`: 64x64 per frame, 2 frames, surprised flinch.
- `monster_goblin_defeat_sheet.png`: 64x64 per frame, 4 frames, drops practice stick and sits down tired.

Negative prompt:
Use the shared negative prompt. Add: `no scary goblin, no sharp gore, no realistic weapon`.

QA:
- Enemy faces left.
- Weapon is toy-like or practice-like.
- Goblin remains beginner-friendly.

Integration notes:
- Future path: `src/assets/characters/monsters/`.

## Boss Prompt Templates

Bosses should feel important but not frightening. Use 128x128 per frame only if 64x64 is not readable. Bosses face left.

### boss_gatekeeper_idle_sheet.png

Purpose:
Gatekeeper boss idle animation.

Filename:
`boss_gatekeeper_idle_sheet.png`

Spec:
128x128 per frame, 4 frames, horizontal spritesheet, transparent background.

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for Gatekeeper, a friendly but imposing dungeon word guardian boss. 128x128 pixels per frame, 4 evenly spaced frames, transparent background. Side-view facing left. The boss is a stone-and-wood guardian with a key motif, warm mossy dungeon colors, readable silhouette, not scary or realistic, simple strong outline, upper-left lighting, mobile-readable. No text, no watermark.
```

Negative prompt:
Use the shared negative prompt. Add: `no horror, no skull focus, no unreadable runes, no letters`.

QA:
- Boss faces left.
- 4 frames.
- Key/guardian theme reads without text.

Integration notes:
- Future path: `src/assets/characters/bosses/boss_gatekeeper_idle_sheet.png`.
- Boss art must not change boss logic or stats.

### Boss State Template

Use this for Gatekeeper and later bosses:

```text
Create a cozy fantasy pixel art horizontal spritesheet for [boss name] [state] animation. [64x64 or 128x128] pixels per frame, [frame count] evenly spaced frames, transparent background. Side-view facing left. [Boss identity description]. Friendly but climactic, readable silhouette, warm dungeon palette, simple outline, upper-left lighting, mobile-readable. No text, no watermark.
```

Recommended boss filenames:

- `boss_gatekeeper_idle_sheet.png`
- `boss_gatekeeper_attack_sheet.png`
- `boss_gatekeeper_special_sheet.png`
- `boss_gatekeeper_hit_sheet.png`
- `boss_gatekeeper_defeat_sheet.png`
- `boss_word_warden_idle_sheet.png`
- `boss_grammar_golem_idle_sheet.png`
- `boss_shadow_reader_idle_sheet.png`
- `boss_memory_dragon_idle_sheet.png`

QA:
- Boss is readable at intended display size.
- No text, letters, runes that look like answer hints, or watermark.
- Transparent background.

Integration notes:
- Add boss assets gradually after player/monster test batch validates style.

## Effect Prompt Templates

Effects should support feedback without hiding the quiz.

Shared effect spec:
64x64 per frame, 4 to 6 frames, horizontal spritesheet, transparent background.

### effect_slash_sheet.png

Purpose:
Physical/card attack slash effect.

Filename:
`effect_slash_sheet.png`

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for a small magical slash effect. 64x64 pixels per frame, 4 frames, transparent background. Warm gold and soft white arc, readable at small size, simple pixels, no text, no watermark, not violent, no blood.
```

Negative prompt:
Use shared negative prompt. Add: `no blood, no gore, no realistic weapon`.

QA:
- Effect does not cover too much screen.
- Transparent background.

Integration notes:
- Future trigger: card attack damage.

### effect_shield_block_sheet.png

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for a shield block effect. 64x64 pixels per frame, 4 frames, transparent background. Soft teal and gold book-shaped barrier, small spark impact, readable at mobile size, no text, no watermark.
```

QA:
- Shield effect is distinct from Water.
- No letters on book/barrier.

### effect_fire_sheet.png

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for a small friendly fire element burst. 64x64 pixels per frame, 4 to 6 frames, transparent background. Warm orange and gold flame, readable, not realistic, not too bright, no text, no watermark.
```

QA:
- Fire reads clearly.
- Does not overpower card/answer text.

### effect_water_sheet.png

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for a water shield sparkle effect. 64x64 pixels per frame, 4 to 6 frames, transparent background. Soft blue and teal droplets forming a protective curl, readable at small size, no text, no watermark.
```

QA:
- Water reads as shield/support, not attack-only.

### effect_wind_sheet.png

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for a wind reward swirl effect. 64x64 pixels per frame, 4 to 6 frames, transparent background. Soft mint and pale gold swirl, light motion, readable at small size, no text, no watermark.
```

QA:
- Wind is distinct from Water.
- Keep lines simple.

### effect_earth_sheet.png

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for an earth guard effect. 64x64 pixels per frame, 4 to 6 frames, transparent background. Small warm stone tiles and mossy spark, protective feel, readable at small size, no text, no watermark.
```

QA:
- Earth reads as defensive/grounded.
- Not too dark.

### effect_upgrade_spark_sheet.png

Prompt:
```text
Create a cozy fantasy pixel art horizontal spritesheet for a card upgrade sparkle effect. 64x64 pixels per frame, 4 frames, transparent background. Warm gold sparkles and small magical pop, friendly reward feel, readable on mobile, no text, no watermark.
```

QA:
- Reward feel is clear.
- Does not imply a specific stat with text.

## Background Prompt Templates

Backgrounds should not compete with UI or quiz text. Avoid high detail behind where cards, quiz prompts, Thai text, and buttons appear.

### background_dungeon_battle_01.png

Purpose:
First real Dungeon battle backdrop.

Filename:
`background_dungeon_battle_01.png`

Spec:
1920x1080 PNG or 1536x864 PNG, static background, no characters, no text.

Prompt:
```text
Create a cozy fantasy pixel art dungeon battle background for a vocabulary learning game. Wide 16:9 composition, no characters, no text, no watermark. Side-view battle stage with open space on the left for the player and on the right for the monster. Warm mossy stone dungeon, soft torchlight, friendly and readable, low detail in the center and lower UI areas so quiz panels and Thai text remain readable. Not scary, not dark, not cluttered.
```

Negative prompt:
Use shared negative prompt. Add: `no characters, no signs, no readable symbols, no busy center, no high contrast behind UI`.

QA:
- No characters.
- No text or runes that look like text.
- Center and lower areas support UI overlays.
- Works with mobile cropping.

Integration notes:
- Future path: `src/assets/backgrounds/background_dungeon_battle_01.png`.
- Keep CSS gradient fallback.

### Other Background Templates

Use the same structure for:

- `background_home_camp.png`: cozy camp hub, warm firelight, no characters, no text, space for menu panels.
- `background_shop.png`: friendly fantasy merchant stall, no shopkeeper required yet, no text, low-detail UI-safe center.
- `background_training_room.png`: cozy practice room with books, soft light, no text, no readable letters, space for question panels.

## Vocabulary Card Prompt Templates

Generated card art should never contain embedded text. React renders all text.

### ui_vocabulary_card_frame.png

Purpose:
Reusable vocabulary card frame.

Filename:
`ui_vocabulary_card_frame.png`

Spec:
Transparent or parchment-safe PNG, 256x360 or 512x720, no text.

Prompt:
```text
Create a cozy fantasy pixel art reusable vocabulary card frame. Parchment center, warm gold and moss trim, subtle magical corners, no text, no icons that look like letters, no watermark. The frame must leave a large clean center area for React-rendered English word, Thai meaning, ATK, SHD, mastery, and element badges. Pixel art, simple outline, readable on mobile.
```

Negative prompt:
Use shared negative prompt. Add: `no text, no letters, no numbers, no filled content in center`.

QA:
- No embedded text.
- Clean center area.
- Works behind English and Thai text.

Integration notes:
- Future path: `src/assets/ui/ui_vocabulary_card_frame.png`.
- Keep CSS card fallback.

### Card Effect Templates

- `ui_card_upgrade_glow.png`: transparent overlay, warm gold border sparkle, no text.
- `ui_element_badge_fire.png`: small icon badge, no text.
- `ui_element_badge_water.png`: small icon badge, no text.
- `ui_element_badge_wind.png`: small icon badge, no text.
- `ui_element_badge_earth.png`: small icon badge, no text.

QA:
- Icons read without labels.
- No text in image.
- Badges do not replace accessible React text.

## UI Icon Prompt Templates

### ui_gold_coin.png

Prompt:
```text
Create a cozy fantasy pixel art UI icon of a gold coin. 32x32 or 64x64, transparent background, warm gold, simple outline, readable on mobile, no text, no watermark.
```

### ui_heart_hp.png

Prompt:
```text
Create a cozy fantasy pixel art UI icon of a red heart for HP. 32x32 or 64x64, transparent background, simple silhouette, readable on mobile, no text, no watermark.
```

### ui_shield.png

Prompt:
```text
Create a cozy fantasy pixel art UI icon of a small teal shield. 32x32 or 64x64, transparent background, simple silhouette, readable on mobile, no text, no watermark.
```

Additional useful icons:

- `ui_timer.png`: small hourglass or clock, no text.
- `ui_mastery_star.png`: warm star, no text.
- `ui_word_energy.png`: small lightning leaf or spark, no text.
- `ui_shop_reroll.png`: circular arrows as icon shape only, no text.

QA:
- Transparent background.
- Readable at 16px to 24px UI size.
- No text/watermark.

## Asset QA Checklist

Use this before accepting generated assets:

- Filename matches lowercase snake_case naming.
- Asset matches intended folder/category.
- Sprite frame size is consistent.
- Spritesheet frames are evenly spaced.
- Transparent background for sprites/effects/icons.
- Backgrounds contain no characters unless explicitly requested.
- No text, letters, numbers, signatures, or watermark.
- Player faces right.
- Enemies and bosses face left.
- Silhouette is readable at mobile size.
- Style matches cozy fantasy pixel art.
- Image is beginner-friendly and not scary.
- Visual detail does not reduce quiz readability.
- Asset does not reveal hidden answers, target cards, correct answers, or result data.
- Missing asset fallback remains possible.
- File size is reasonable for a static Vite/Vercel demo.
- Source file and normalized runtime export are kept separately.
- Every accepted source has been checked for extra transparent space and preview scaling.
- Runtime export uses consistent 64x64 frame cells where appropriate.
- Ground or hover baselines are aligned across frames.

Before runtime integration, normalize every accepted source:

1. Verify transparent background and alpha.
2. Split and inspect frames.
3. Crop sprite bounds.
4. Resize into consistent 64x64 frame cells where appropriate.
5. Center the sprite and align its ground or hover baseline.
6. Export the final runtime-ready spritesheet.
7. Preserve the original source separately.

## Future Codex Integration Notes

Do not implement these until an explicit runtime integration phase. Generated source/reference files are not sufficient on their own.

Recommended future integration steps:

1. Complete visual batch QA for Player Batch 1A and Monster Batch 1B.
2. Decide whether the accepted sources should enter normalization.
3. Normalize selected assets and export runtime-ready spritesheets.
4. Add only normalized image files under `src/assets`.
5. Create `src/data/assetManifest.ts`.
6. Map player, monster, boss, effect, background, and UI asset ids to imported files.
7. Add optional asset ids to data objects only when useful.
8. Map monster ids to asset ids.
9. Map boss ids to asset ids.
10. Keep emoji/text/CSS fallback placeholders.
11. Add a small safe asset component that falls back when an asset is missing.
12. Add simple CSS spritesheet animation using `background-position` or image transforms.
13. Preserve mobile readability and quiz-first hierarchy.
14. Confirm production build still works without backend services.

Integration safety rules:

- Missing assets must never crash the app.
- Assets must never be required to play Version 1.
- Assets must not change combat math, timers, answer checking, HP, shield, gold, mastery, Word Energy, shop/event/boss effects, deck unlocks, save behavior, or encounter progression.
- Assets must not reveal hidden answer information.
- Use generated art as presentation only.
