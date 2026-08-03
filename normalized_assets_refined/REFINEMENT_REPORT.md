# Phase 71D.1.1 Refinement Report

Run: 2026-08-03T16:07:42.780Z

Phase 71D.1.1 applies source-aware cleanup settings to the corrected subset. Runtime integration remains prohibited.

## Summary

- Files processed: 10
- Post-preview status estimate: 1 pass, 9 needs review, 0 fail
- Output root: `normalized_assets_refined/`
- Source, failed, and fixed histories remain unchanged.
- Pixel-removal percentages use visible input pixels as the denominator.

## Processed Files

| Source | Refined output | Actual | Expected | Frames | Strategy | Pixels removed | Residual neutral-edge estimate | Status estimate | Notes | Next action |
| --- | --- | ---: | ---: | ---: | --- | ---: | ---: | --- | --- | --- |
| `Asset/player/player_word_mage_idle_sheet.png` | `normalized_assets_refined/player/player_word_mage_idle_sheet.png` | 256x64 | 256x64 | 4 | seeded neutral pockets, detached residue, and protected neutral boundary cleanup | 237 (3.483%) | 6 (0.091%) | needs review | Protect staff/crystal highlights while removing enclosed neutral pockets behind the arm and staff. Large white pockets are gone and intended bright details remain; a few isolated neutral fringe pixels still need localized review. | Perform localized per-pixel cleanup or regenerate true-alpha source before pass approval. |
| `Asset/player/player_word_mage_walk_sheet.png` | `normalized_assets_refined/player/player_word_mage_walk_sheet.png` | 384x64 | 384x64 | 6 | per-frame seeded neutral pockets, detached fragment removal, and protected neutral boundary cleanup | 442 (6.438%) | 11 (0.171%) | needs review | Protect staff/crystal highlights; remove repeated enclosed white pockets and confirmed right-edge fragments. Repeated white pockets and right-edge fragments are gone; minor neutral fringe remains and cadence should be rechecked after final cleanup. | Perform localized per-pixel cleanup, then repeat cadence and dark/light QA. |
| `Asset/monsters/slime/monster_slime_idle_sheet.png` | `normalized_assets_refined/monsters/slime/monster_slime_idle_sheet.png` | 256x64 | 256x64 | 4 | per-frame neutral boundary cleanup | 31 (0.454%) | 0 (0.000%) | needs review | Preserve saturated green/yellow highlights while removing neutral fringe pixels. Neutral-edge heuristic reaches zero and the silhouette is preserved; a final human edge check is still required. | Repeat focused Human QA before pass approval. |
| `Asset/monsters/slime/monster_slime_attack_sheet.png` | `normalized_assets_refined/monsters/slime/monster_slime_attack_sheet.png` | 256x64 | 256x64 | 4 | per-frame neutral boundary cleanup | 20 (0.582%) | 0 (0.000%) | needs review | Preserve the green attack trail and remove only neutral fringe pixels. Attack trail and frame isolation remain intact; the refined hard edge still needs final approval. | Repeat focused Human QA before pass approval. |
| `Asset/monsters/bat/monster_bat_idle_sheet.png` | `normalized_assets_refined/monsters/bat/monster_bat_idle_sheet.png` | 256x64 | 256x64 | 4 | detached fragment removal and per-frame neutral boundary cleanup | 56 (1.800%) | 0 (0.000%) | needs review | Remove confirmed detached side fragments while preserving the saturated purple silhouette. Detached side fragments are gone and the hover silhouette is preserved; gray-purple edge pixels remain visually ambiguous. | Repeat focused Human QA before pass approval. |
| `Asset/monsters/goblin/monster_goblin_idle_sheet.png` | `normalized_assets_refined/monsters/goblin/monster_goblin_idle_sheet.png` | 256x64 | 256x64 | 4 | inconsistent ground-residue removal and per-frame neutral boundary cleanup | 93 (1.568%) | 0 (0.000%) | needs review | Treat the frame-2 ground strip as residue because it is neutral, detached, and inconsistent across the idle cycle. The detached ground strip is removed, but a short under-foot gray edge remains and requires intent confirmation. | Confirm shadow intent or remove the remaining localized under-foot residue. |
| `Asset/effects/effect_fire_sheet.png` | `normalized_assets_refined/effects/effect_fire_sheet.png` | 256x64 | 256x64 | 4 | source-aware detect only | 0 (0.000%) | 16 (0.614%) | needs review | Do not remove pale pixels automatically; they overlap the intentional hot flame core and particles. Recheck hard-alpha glow on both backgrounds. Warm flame and particles are preserved unchanged; pale particles remain weak on light backgrounds and glow still uses hard alpha. | Regenerate or manually author true-alpha glow if softer falloff is required. |
| `Asset/elites/crystal-slime/elite_crystal_slime_idle_sheet.png` | `normalized_assets_refined/elites/crystal-slime/elite_crystal_slime_idle_sheet.png` | 256x64 | 256x64 | 4 | source-aware detect only | 0 (0.000%) | 9 (0.150%) | needs review | Do not remove pale pixels automatically because neutral-looking highlights overlap intended sparkles and crystal lighting. Intentional sparkles and crystal highlights are preserved unchanged; pale edge pixels remain source-ambiguous. | Use source-aware manual review before removing any pale sparkle or highlight. |
| `Asset/bosses/gatekeeper/boss_gatekeeper_idle_sheet.png` | `normalized_assets_refined/bosses/gatekeeper/boss_gatekeeper_idle_sheet.png` | 512x128 | 512x128 | 4 | clean reference copy | 0 (0.000%) | 0 (0.000%) | pass | Keep unchanged as the Phase 71D.2 clean comparison reference. Copied unchanged and remains clean on both backgrounds. | Keep as comparison reference; runtime integration remains prohibited. |
| `Asset/ui/ui_gold_coin.png` | `normalized_assets_refined/ui/ui_gold_coin.png` | 64x64 | 64x64 | 1 | localized seeded neutral fringe removal | 5 (0.201%) | 0 (0.000%) | needs review | Remove only the localized neutral left-edge fringe; preserve white and yellow highlights elsewhere. Five localized fringe pixels are removed and highlights remain; final 64px edge/readability review is still required. | Inspect at native 64px and clean only confirmed remaining fringe pixels. |

## Safety

- Broad global bright-pixel deletion was not used.
- Word Mage crystal/staff highlight zones are protected from boundary cleanup.
- Fire and Elite Crystal Slime use detect-only handling because intended bright pixels overlap neutral residue colors.
- Gatekeeper idle is copied unchanged as the clean comparison reference.
- No file under `Asset/`, `normalized_assets/`, or `normalized_assets_fixed/` was overwritten.
- No file was written to `src/assets/` and no runtime code was changed.
