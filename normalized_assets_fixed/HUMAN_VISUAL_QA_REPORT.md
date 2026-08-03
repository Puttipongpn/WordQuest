# Phase 71D.2 Human Visual QA Report

Date: 2026-08-03

Scope: Human visual QA of the 10 corrected candidate PNGs under `normalized_assets_fixed/`.

Runtime integration remains prohibited. The normalized candidates were not edited during this phase.

## Result

- Files inspected: 10
- Pass: 1
- Needs review: 3
- Fail: 6
- Phase 71D.3 readiness: blocked
- Recommended next phase: Phase 71D.1.1 source cleanup refinement

The player edge-cleanup concern is confirmed. Both Word Mage sheets retain visible opaque white/light-gray contamination around the silhouette. The issue is especially obvious on the dark QA background and remains visible as blocky light regions on the light background.

## QA Method

- Generated 10 enlarged nearest-neighbor previews under `normalized_assets_fixed/qa_previews/`.
- Each preview separates configured frames with a gap to expose slicing or edge fragments.
- The upper row uses dark `#16181c`; the lower row uses light `#f4f3ee`.
- Player, small-enemy, effect, and UI cells were inspected at 8x; Gatekeeper cells were inspected at 4x.
- Checked edge cleanliness, transparency quality, frame isolation/slicing, static frame-to-frame cadence, baseline stability, and effect/glow readability.
- Verified all 10 candidates use exact configured dimensions and contain transparent pixels.
- Alpha inspection found only fully transparent or fully opaque pixels; none of the candidates retains partial alpha. Hard alpha is acceptable for solid pixel sprites but limits natural glow falloff for effects.

Static cadence review checks ordered pose progression and spacing only. It does not approve runtime animation timing or playback.

## Per-File Findings

| Candidate | Status | Edge and transparency | Frame slicing | Cadence / readability | Action |
| --- | --- | --- | --- | --- | --- |
| `player/player_word_mage_idle_sheet.png` | fail | Large opaque white/light-gray remnants remain behind the head, book/arm, staff, and cape, with detached edge flecks across the sheet. Transparency exists outside the silhouette, but cleanup is visibly incomplete. | Four cells are isolated; no wrong-count slicing. | Idle pose and grounded baseline are broadly stable, but contamination blocks approval. | Refine cleanup in Phase 71D.1.1 or regenerate a true transparent source. |
| `player/player_word_mage_walk_sheet.png` | fail | Opaque white regions remain behind the head, book/arm, and staff in all six frames. Detached brown, blue, white, and gray pixels remain near cell edges. | Six cells are isolated; the detached fragments are source/cleanup residue rather than a three-frame inference error. | Walk progression is readable, but pose-width/cadence review must be repeated after clean silhouettes exist. | Refine cleanup in Phase 71D.1.1 or regenerate a true transparent source. |
| `monsters/slime/monster_slime_idle_sheet.png` | fail | Repeated white/gray edge pixels and small blocky remnants are visible around the top, sides, and baseline on dark and light backgrounds. | Four frames are correctly isolated. | Idle squash/stretch progression and baseline are readable. | Refine edge cleanup; do not approve the current output. |
| `monsters/slime/monster_slime_attack_sheet.png` | fail | White/gray flecks remain around the outer silhouette and motion-tail area. | Four frames are correctly isolated; the long third-frame attack remains inside its cell. | Attack progression reads clearly from rise to lunge to recovery. | Refine edge cleanup while preserving the green motion silhouette. |
| `monsters/bat/monster_bat_idle_sheet.png` | fail | Gray/white fringe pixels remain around ears, wings, and body; detached vertical fragments are visible between poses. | Four frames are isolated, but residue near cell edges creates a slicing-like artifact. | Hover variation is readable and no whole pose is cut, but dirty edges block approval. | Refine cleanup and remove detached source fragments. |
| `monsters/goblin/monster_goblin_idle_sheet.png` | fail | White/gray perimeter contamination remains, with conspicuous pale horizontal ground residue under frames 2 and 3. | Four frames are correctly isolated. | Pose progression and grounded placement are stable. | Refine cleanup and decide whether any ground shadow is intentional before export. |
| `effects/effect_fire_sheet.png` | needs review | No checkerboard block remains. Pale opaque pixels around flame edges may mix intended hot glow with cleanup residue; the lack of partial alpha produces a hard halo. | Four frames are correctly isolated. | Growth and dispersal cadence reads well. Main flame is strong on both backgrounds, but small pale particles lose contrast on the light background. | Review against source intent; preserve colored glow while removing neutral residue or regenerate with true transparency. |
| `elites/crystal-slime/elite_crystal_slime_idle_sheet.png` | needs review | Gold/teal particles are intentional, but pale gray residue remains ambiguous around portions of the body edge and baseline. | Four frames are correctly isolated. | Squash/stretch progression, crystal identity, and baseline remain readable. | Perform source-aware edge review before approval; do not use broad color removal. |
| `bosses/gatekeeper/boss_gatekeeper_idle_sheet.png` | pass | Silhouette is clean on both backgrounds. Detached teal crystal-glow pixels read as intentional colored effects rather than neutral checkerboard residue. | Four frames are correctly isolated with no cross-cell clipping. | Guardian stance, scale, and grounded baseline are stable. | Keep as a corrected candidate; runtime integration is still prohibited. |
| `ui/ui_gold_coin.png` | needs review | The coin is readable, but a localized gray/light fringe remains at the lower-left edge and is visible on both backgrounds. | Not applicable; single image. | Readability is strong at enlarged size; final 64x64 UI contrast still requires later runtime-context QA. | Apply localized manual cleanup or refine the conservative mask. |

## Priority Findings

### Word Mage

- `player_word_mage_idle_sheet.png` and `player_word_mage_walk_sheet.png` fail edge cleanliness.
- The remaining white regions are opaque pixels, not transparent antialiasing.
- The contamination follows areas where the source checkerboard/light preview background met pale costume, book, staff, glow, or cape details.
- A global brighter threshold is unsafe because it could remove cream clothing, eye highlights, crystal glow, spellbook pages, and staff highlights.
- Phase 71D.1.1 should use source-aware masks, per-frame review, or regenerated true-alpha sources rather than broader automatic light-pixel deletion.

### Fire Effect

- The four-frame action and core orange/yellow silhouette are readable.
- Small pale particles become weak on the light background.
- All surviving effect pixels are fully opaque, so the glow has hard block edges rather than translucent falloff.
- Cleanup refinement must distinguish intended warm/colored glow from neutral preview residue.

## Decision Gate

The fixed subset is not visually clean. Phase 71D.3 is not recommended.

Proceed next with Phase 71D.1.1 to refine source cleanup on the failed and needs-review files, beginning with Word Mage idle/walk. Keep Gatekeeper as the clean comparison reference. After corrected candidates are regenerated, repeat the enlarged dark/light QA before expanding normalization to the full asset set.

Do not import any candidate into React, create an asset manifest, implement runtime animation playback, or create/use `src/assets/`.
