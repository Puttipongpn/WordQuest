# Phase 71D.5 Targeted Cleanup Report

Run date: 2026-08-03

Phase 71D.5 targets only the two blocking failures from Phase 71D.4. These outputs are normalized source candidates, not runtime assets.

## Summary

- Files targeted: 2
- Files successfully fixed: 2
- Files still failing: 0
- Runtime integration status: prohibited
- Recommended next phase: Phase 71E Runtime Integration Planning only

## Gatekeeper Attack

- Source: `Asset/bosses/gatekeeper/boss_gatekeeper_attack_sheet.png`
- Output: `normalized_assets_refined_targeted/bosses/gatekeeper/boss_gatekeeper_attack_sheet.png`
- QA preview: `normalized_assets_refined_targeted/qa_previews/bosses/gatekeeper/boss_gatekeeper_attack_sheet_qa_preview.png`
- Output dimensions: `512x128`
- Frame count: 4 at `128x128`
- Human result: blocking frame-slicing defect resolved

Measured foreground gaps allowed four complete poses to be isolated without source regeneration. The explicit source regions are:

1. `0-625` (`left: 0`, `width: 626`)
2. `626-1241` (`left: 626`, `width: 616`)
3. `1242-1944` (`left: 1242`, `width: 703`)
4. `1945-2507` (`left: 1945`, `width: 563`)

The enlarged dark/light preview contains four complete poses. Body, key, attack arc, and particle groups remain with their intended frames. No visible alpha bound touches a frame-cell edge. Thin neutral ground/shadow lines in action frames 2 and 3 remain a non-blocking polish item; they do not reproduce the cross-frame slicing failure.

Recommended action: keep the targeted candidate for later planning and retain the ground/shadow line concern in the polish backlog. Source regeneration is not required for frame isolation.

## Vocabulary Card Frame

- Source: `Asset/ui/ui_vocabulary_card_frame.png`
- Output: `normalized_assets_refined_targeted/ui/ui_vocabulary_card_frame.png`
- QA preview: `normalized_assets_refined_targeted/qa_previews/ui/ui_vocabulary_card_frame_qa_preview.png`
- Output dimensions: `1058x1487` preserved
- Human result: blocking opaque-checkerboard defect resolved

No alternate true-alpha source was present under `Asset/ui/`. The targeted cleanup removed only light, low-saturation pixels connected to the outer canvas edge. Its safety gate required at least 95% qualifying edge samples and limited removal to 5-35% of the source canvas.

- Edge candidate ratio: 100%
- Transparent pixels created: 187,660
- Transparent canvas ratio: 11.93%
- Remaining image alpha: hard alpha, with 187,660 transparent and 1,385,586 opaque pixels

The dark/light preview confirms that the exterior checkerboard is gone and the background shows through around the decorative frame. The parchment interior and decorative border remain opaque by design. This is a cleaned source candidate, not an approval for runtime use.

Recommended action: keep the targeted candidate for Phase 71E planning. A future runtime layout QA pass must still validate text-safe insets, responsive scaling, and mobile readability.

## Remaining Needs-Review Backlog

These items were not changed in Phase 71D.5 and remain non-blocking polish work unless runtime planning finds otherwise:

- Slime idle and attack: localized edge cleanup.
- Bat hit: localized edge cleanup.
- Goblin idle and hit: localized edge cleanup and under-foot residue.
- Elite Crystal Slime attack: detached green segment review.
- Elite Crystal Slime hit: scale mismatch and normalization review.
- Gatekeeper attack: thin neutral ground/shadow lines in frames 2 and 3.
- Gatekeeper defeat: pale dust contrast.
- Fire: hard-alpha glow and light-background particles.
- Wind: light-background contrast.
- Dungeon background: responsive crop, layout, and quiz-readability QA.

## Decision Gate

Both Phase 71D.4 blocking failures are resolved. Recommend **Phase 71E Runtime Integration Planning only**, not implementation.

Phase 71E may plan asset ownership, runtime filenames, animation metadata, loading boundaries, fallback behavior, responsive use, and staged integration order. It must not import these candidates, create `assetManifest`, implement animation playback, or move files into `src/assets/` unless a later explicit implementation phase authorizes those actions.

## Safety

- Original files under `Asset/` were not changed.
- Existing normalized output folders were not overwritten.
- Targeted outputs remain candidates only.
- Runtime integration remains prohibited.
- `src/assets/` remains absent/unused.
- No gameplay, save, combat, progression, deployment, or runtime asset code changed.
