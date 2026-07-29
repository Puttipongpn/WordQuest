# ASSET_PROMPTS.md

This document is the Phase 70A prompt pack and style bible for WordQuest pixel art generation.

Player Batch 1A, Monster Batch 1B, Effects Batch 1C, UI/Card/Background Batch 1D, Boss Batch 1E, Event Illustration Batch 1F, and Elite Enemy Batch 1G have been generated as production source/reference candidates. They are not normalized runtime assets and must not be imported into the app yet.

Phase 71A is normalization planning only. It does not create normalized exports, folders, scripts, manifests, imports, or animation playback.

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

## Current Effects Asset Production Status

Status date: 2026-07-19

Effects Batch 1C generated:

- `effect_shield_block_sheet.png`
- `effect_fire_sheet.png`
- `effect_water_sheet.png`
- `effect_wind_sheet.png`
- `effect_earth_sheet.png`
- `effect_upgrade_spark_sheet.png`

Effects Batch 1C is complete as a source/reference candidate set. These effect sheets are sufficient to proceed to the next asset-planning step, but they are not normalized runtime-ready assets and must not be imported into runtime yet.

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

Effect safety rules:

- Effects are presentation-only visual feedback.
- Effects must never imply gameplay rule changes.
- Effects must not reveal hidden answers, target cards, correct answers, triggered cards, or result information before the player answers.
- Effects must not contain readable text, letters, numbers, stat labels, answer-like symbols, or readable runes.
- Effects must remain compact enough to avoid hiding quiz text, Thai text, answer choices, controls, HP/shield UI, or battle feedback.
- Effects should remain readable on mobile and not visually noisy.

## Current UI/Card/Background Asset Production Status

Status date: 2026-07-19

UI/Card/Background Batch 1D has been generated and reviewed as production source/reference candidates. These files are not normalized runtime-ready assets and must not be imported into runtime yet.

Generated Batch 1D files:

- `background_dungeon_battle_01.png`
- `ui_vocabulary_card_frame.png`
- `ui_gold_coin.png`
- `ui_heart_hp.png`
- `ui_shield.png`

Known polish note:

- `background_dungeon_battle_01.png` may need a polish pass if it becomes a runtime background candidate.

## Current Boss Asset Production Status

Status date: 2026-07-19

Boss Batch 1E generated:

- `boss_gatekeeper_idle_sheet.png`
- `boss_gatekeeper_attack_sheet.png`
- `boss_gatekeeper_hit_sheet.png`
- `boss_gatekeeper_defeat_sheet.png`

Boss Batch 1E is complete as a source/reference candidate set. These boss sheets are sufficient to proceed to the next asset-planning step, but they are not normalized runtime-ready assets and must not be imported into runtime yet.

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

Reusable Gatekeeper identity phrase:

```text
Gatekeeper, a friendly but imposing dungeon word guardian boss, stone-and-wood magical guardian with a key motif, warm stone body, wooden door/gate body, moss accents, gold trim, soft teal crystal glow, cozy fantasy pixel art, beginner-friendly, not horror, not violent, not dark demon-like
```

Review decisions:

- `boss_gatekeeper_idle_sheet.png`: approved candidate / usable v1; source filename may need rename from `boss_gatekeeper_idle_sheet(4).png` if the generated duplicate filename is present.
- `boss_gatekeeper_attack_sheet.png`: approved candidate / usable v1.
- `boss_gatekeeper_hit_sheet.png`: usable candidate; scale should be normalized later.
- `boss_gatekeeper_defeat_sheet.png`: approved candidate / usable v1.

Boss orientation and action notes:

- Boss sprites face left.
- Gatekeeper attack action moves or acts toward the left.
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

## Current Event Illustration Batch 1F Status

Generated and reviewed on 2026-07-21:

- `event_treasure_chest_01.png`: approved candidate / usable v1; keep the reward discovery readable without showing exact rewards or outcomes.
- `event_strange_altar_01.png`: approved candidate / usable v1; keep it mysterious and friendly, never cursed, demonic, horror-like, or ritualistic.
- `event_healing_shrine_01.png`: usable candidate / polish later recommended because its teal crystal language overlaps with Strange Altar.

Healing Shrine polish direction: softer recovery mood, gentler halo, water basin or soft pool glow, mist or droplets, less mystery-crystal-centerpiece emphasis, and a calm restorative shrine read.

Event prompts and accepted images must remain presentation-only, contain no characters/monsters or readable text/runes/labels, avoid outcome/reward/cost/value spoilers, and leave quiet composition space for event UI overlays and mobile crops.

## Current Elite Enemy Batch 1G Status

Generated and reviewed on 2026-07-21:

- `elite_crystal_slime_idle_sheet.png`: approved candidate / usable v1; later rename a duplicate `elite_crystal_slime_idle_sheet(4).png` source if present.
- `elite_crystal_slime_attack_sheet.png`: approved candidate / usable v1.
- `elite_crystal_slime_hit_sheet.png`: usable candidate; normalize scale/spacing later.
- `elite_crystal_slime_defeat_sheet.png`: approved candidate / usable v1.

Reusable Elite Crystal Slime identity phrase:

```text
Elite Crystal Slime, a stronger-looking version of the friendly green dungeon slime, rounded green slime body, teal crystal growths on the back and head, tiny gold sparkles and crystal shine, cute simple face, magical and special but beginner-friendly, facing left, not scary, not gross, not violent, cozy fantasy pixel art
```

Elite action direction: idle is a magical crystal slime wobble; attack is a leftward crystal-powered bounce/lunge with compact teal-gold sparkle; hit is a simple squish/flinch; defeat is a gentle flattening/puddle/sparkle fade. These visuals do not imply new mechanics.

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
- For boss spritesheets, specify 128x128 per frame where boss readability needs the larger size.
- Specify no large preview canvas and no upscale.
- Specify no checkerboard background.
- Specify no frame borders, labels, UI, text, watermark, letters, numbers, or readable runes.
- Keep effect bounds compact inside each 64x64 frame.
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

Batch 1A through Batch 1G are generated source/reference candidates.

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

### Batch 1C - Effects - Generated

- `effect_shield_block_sheet.png`
- `effect_fire_sheet.png`
- `effect_water_sheet.png`
- `effect_wind_sheet.png`
- `effect_earth_sheet.png`
- `effect_upgrade_spark_sheet.png`

### Batch 1D - Background/Card - Generated

- `background_dungeon_battle_01.png`
- `ui_vocabulary_card_frame.png`
- `ui_gold_coin.png`
- `ui_heart_hp.png`
- `ui_shield.png`

### Batch 1E - Boss Gatekeeper - Generated

- `boss_gatekeeper_idle_sheet.png`
- `boss_gatekeeper_attack_sheet.png`
- `boss_gatekeeper_hit_sheet.png`
- `boss_gatekeeper_defeat_sheet.png`

### Batch 1F - Event Illustrations - Generated

- `event_treasure_chest_01.png`
- `event_healing_shrine_01.png`
- `event_strange_altar_01.png`

### Batch 1G - Elite Crystal Slime - Generated

- `elite_crystal_slime_idle_sheet.png`
- `elite_crystal_slime_attack_sheet.png`
- `elite_crystal_slime_hit_sheet.png`
- `elite_crystal_slime_defeat_sheet.png`

## Intended Future Paths

Keep generated source/reference files separate from normalized runtime-ready assets.

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

Use `asset_sources/` or a documentation/reference location for original generated high-resolution files. Reserve `src/assets/` for normalized runtime-ready assets during a future explicit integration phase. Use lowercase snake_case filenames.

Phase 71A runtime targets are 64x64 cells for player, small-monster, and effect sheets; 128x128 cells for boss sheets; and 64x64 for single UI icons. This produces 256x64 four-frame sheets, 128x64 two-frame sheets, 384x64 six-frame sheets, 512x128 four-frame boss sheets, and 256x128 two-frame boss sheets. Keep the vocabulary card frame provisional until UI testing, and keep the 1536x864 dungeon background provisional until style, crop, and responsive-use planning is complete.

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
- Future path: `src/assets/player/player_word_mage_idle_sheet.png`.
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
- Future path: `src/assets/monsters/monster_slime_idle_sheet.png`.

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
- Future path: `src/assets/monsters/`.

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
- Future path: `src/assets/monsters/`.

## Boss Prompt Templates

Bosses should feel important but not frightening. Use 128x128 per frame only if 64x64 is not readable. Bosses face left.

Gatekeeper is the locked first boss visual identity. Preserve the stone-and-wood magical guardian, key motif, warm stone body, wooden door/gate body, moss accents, gold trim, soft teal crystal glow, cozy fantasy pixel art, beginner-friendly tone, and left-facing orientation.

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
- Future path: `src/assets/bosses/boss_gatekeeper_idle_sheet.png`.
- Boss art must not change boss logic or stats.

### Boss State Template

Use this for Gatekeeper and later bosses:

```text
Create a cozy fantasy pixel art horizontal spritesheet for [boss name] [state] animation. [64x64 or 128x128] pixels per frame, [frame count] evenly spaced frames, transparent background. Side-view facing left. [Boss identity description]. Friendly but climactic, readable silhouette, warm dungeon palette, simple outline, upper-left lighting, mobile-readable. No text, no watermark.
```

Recommended boss filenames:

- `boss_gatekeeper_idle_sheet.png`
- `boss_gatekeeper_attack_sheet.png`
- `boss_gatekeeper_hit_sheet.png`
- `boss_gatekeeper_defeat_sheet.png`
- `boss_gatekeeper_special_sheet.png` only if a later phase explicitly needs a distinct special presentation
- `boss_word_warden_idle_sheet.png`
- `boss_grammar_golem_idle_sheet.png`
- `boss_shadow_reader_idle_sheet.png`
- `boss_memory_dragon_idle_sheet.png`

QA:
- Boss is readable at intended display size.
- No text, letters, runes that look like answer hints, or watermark.
- Transparent background.
- Boss faces left.
- Boss art does not imply new mechanics or changed stats.
- Boss does not hide quiz UI or controls.

Integration notes:
- Add boss assets gradually after player/monster test batch validates style.
- Boss Batch 1E is source/reference only and must be normalized before runtime integration.
- Normalize accepted boss sheets by verifying alpha, splitting frames, cropping sprite bounds, resizing into consistent 128x128 boss frame cells where appropriate, centering the sprite, aligning ground baseline, normalizing scale across idle/attack/hit/defeat, and preserving original source files separately.

## Effect Prompt Templates

Effects should support feedback without hiding the quiz.

Shared effect spec:
64x64 per frame, 4 to 6 frames, horizontal spritesheet, transparent background.

Runtime-targeted effect prompt rules:

- Explicitly request a final runtime-targeted spritesheet.
- Specify total canvas size, such as 256x64 for 4 frames.
- Specify each frame must be exactly 64x64.
- Specify transparent background only.
- Specify no large preview canvas.
- Specify no checkerboard background.
- Specify no frame borders, labels, UI, text, watermark, letters, numbers, or readable runes.
- Specify compact effect bounds inside each 64x64 frame.
- Still expect a normalization safety pass because image generators may not obey exact pixel dimensions reliably.

Before any runtime integration, every accepted effect should be normalized by verifying alpha, splitting frames, cropping effect bounds, resizing into consistent 64x64 cells where appropriate, centering the effect, preserving appropriate vertical placement such as earth effects staying lower/grounded, exporting runtime-ready spritesheets, and preserving original source files separately.

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

### Phase 71B Normalization Handoff

Phase 71B plans future script/manual normalization only. The input inventory is Player 1A, Monster 1B, Effects 1C, UI/Card/Background 1D, Boss 1E, Event 1F, and Elite 1G. Raw generated files currently staged in root `Asset/` remain source/reference candidates and must not be imported or treated as runtime assets.

Future script/manual processing should confirm source/final names, frame count, target dimensions, alpha, per-frame bounds, approved-reference scale, ground/hover/effect alignment, final sheet dimensions, mobile readability, prohibited text/runes, and unchanged gameplay meaning. Preserve originals and export normalized files only to `src/assets/` during a later explicit integration phase.

The optional later Phase 71B.1 may organize `Asset/` into player, monster species, elites/Crystal Slime, bosses/Gatekeeper, effects, UI, backgrounds, events, incoming, rejected, and notes folders. Phase 71B does not create or move these folders/files.

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
- Effects do not reveal hidden answers, target cards, correct answers, triggered cards, or result information before the player answers.
- Effects do not contain readable text, letters, numbers, stat labels, answer-like symbols, or readable runes.
- Effects remain compact enough to avoid hiding quiz text, Thai text, answer choices, controls, HP/shield UI, or battle feedback.
- Effects remain readable on mobile and do not become visually noisy.
- Bosses face left.
- Boss art does not imply new mechanics, changed stats, or hidden result information.
- Boss art does not contain readable text, letters, numbers, stat labels, answer-like symbols, or readable runes.
- Boss sheets use consistent 128x128 frame cells where appropriate after normalization.
- Boss ground baseline and scale are consistent across idle, attack, hit, and defeat.
- Generated duplicate filenames are renamed during normalization if necessary.
- Missing asset fallback remains possible.
- File size is reasonable for a static Vite/Vercel demo.
- Source file and normalized runtime export are kept separately.
- Every accepted source has been checked for extra transparent space and preview scaling.
- Runtime export uses consistent 64x64 frame cells where appropriate.
- Ground or hover baselines are aligned across frames.
- Elite sheets use consistent 64x64 cells where appropriate, face left, and maintain a stable grounded baseline and action scale.
- Event illustrations have verified target display dimensions, no outcome spoilers, no characters/monsters, and composition that works beneath event-panel overlays and mobile crops.

Before runtime integration, normalize every accepted source:

1. Collect and preserve the original generated source files.
2. Verify alpha and transparent backgrounds; remove checkerboard or preview backgrounds if present.
3. Split sheets and crop bounds per frame.
4. Determine shared maximum bounds for the sheet.
5. Resize without distorting aspect ratio into 64x64 cells, or 128x128 boss cells, where appropriate.
6. Center horizontally and align the correct ground, hover, or effect-specific baseline.
7. Recombine frames and export with a stable filename.
8. Visually QA the output while preserving the original source separately.

Baseline rules: keep the Word Mage, Slime, Goblin, and Gatekeeper grounded; keep Bat on a stable hover baseline; center effects except for lower/grounded earth effects; prioritize quiz/UI readability when preparing backgrounds.

## Future Codex Integration Notes

Do not implement these until an explicit runtime integration phase. Generated source/reference files are not sufficient on their own.

Recommended future integration steps:

1. Approve the Phase 71A normalization plan.
2. Complete visual batch QA for Player Batch 1A, Monster Batch 1B, Effects Batch 1C, UI/Card/Background Batch 1D, Boss Batch 1E, Event Illustration Batch 1F, and Elite Enemy Batch 1G.
3. Use the completed Phase 71B script/manual-checklist specification.
4. Run a separately authorized Phase 71C script implementation or manual normalization pass without runtime integration.
5. Add only normalized image files under `src/assets`.
6. Create `src/data/assetManifest.ts` only when that explicit integration phase authorizes it.
7. Map player, monster, boss, effect, background, and UI asset ids to imported files.
8. Add optional asset ids to data objects only when useful.
9. Map monster and boss ids to asset ids.
10. Keep emoji/text/CSS fallback placeholders and make asset-load failures non-crashing.
11. Add simple animation only when explicitly authorized, with reduced-motion and readability considered.
12. Preserve mobile readability and quiz-first hierarchy.
13. Confirm the production build still works without backend services.

Integration safety rules:

- Missing assets must never crash the app.
- Assets must never be required to play Version 1.
- Assets must not change combat math, timers, answer checking, HP, shield, gold, mastery, Word Energy, shop/event/boss/elite effects, deck unlocks, save behavior, or encounter progression.
- Assets must not reveal hidden answers, target cards, correct answers, triggered cards, event outcomes, reward amounts, or result information before the player answers or chooses.
- Assets must not contain readable text, letters, numbers, stat labels, answer-like symbols, or readable runes.
- Assets must not hide quiz UI, Thai text, controls, HP/shield UI, event choices, or battle feedback.
- Use generated art as presentation only.
