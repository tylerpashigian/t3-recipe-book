---
target: recipe cards in /recipes and /recipe/build
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:/Users/tylerpashigian/Documents/NextJS/t3-recipe-book/t3-recipe-book/src/components/recipe/recipe-card.tsx"
target_fingerprint: "sha256:510c6e7d901ed642dc8b2a97472caf62f9b9c40266fccd668430ce4a89e4ac96"
target_path: /Users/tylerpashigian/Documents/NextJS/t3-recipe-book/t3-recipe-book/src/components/recipe/recipe-card.tsx
timestamp: 2026-09-25T03-39-12Z
slug: src-components-recipe-recipe-card-tsx
---
## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 2 | No result/ingredient-match summary connects results to the current task. |
| 2 | Match System / Real World | 3 | Familiar recipe cues, but ingredient compatibility is absent. |
| 3 | User Control and Freedom | 2 | Builder has no visible clear-all or context-aware reset path. |
| 4 | Consistency and Standards | 3 | Consistent card language, but it erases the difference between browsing and building. |
| 5 | Error Prevention | 2 | Ingredient-filtered no-results inherit search/category recovery copy. |
| 6 | Recognition Rather Than Recall | 3 | Cards omit which selected ingredients created a match. |
| 7 | Flexibility and Efficiency | 2 | No fit ranking, sort, or fast reset for repeat cooks. |
| 8 | Aesthetic and Minimalist Design | 2 | Quiet but generic; every datum has similar visual weight. |
| 9 | Error Recovery | 1 | Builder cannot clear selections from the shared empty state. |
| 10 | Help and Documentation | 1 | Matching behavior is not explained. |
| **Total** | | **21/40** | **Usable foundation; differentiated workflow under-expressed** |

## Design Specificity Verdict

The card is calm and competent but category-interchangeable. It is a reasonable browse card, but reusing it unchanged in the ingredient builder hides Forked’s defining value. The no-photo strategy is correct; the missing visual signal is meaningful ingredient fit, not food photography.

Deterministic scans were clean for `recipe-card.tsx`, `/recipes`, and `/recipe/build` (0 findings each). Browser visualization was unavailable, so no overlay was injected.

## Overall Impression

The browse list is minimal in the good sense, but the builder needs a purpose-built answer card. The largest opportunity is to make the selected pantry the visual reason each recipe appears.

## What's Working

1. Recipe name, description, category, time, and servings provide useful photo-free scan cues.
2. The title link and quiet text action are less distracting than a full-width CTA.
3. Searchable multi-select is a solid baseline for entering real pantry ingredients.

## Priority Issues

1. **[P1] Builder results do not show ingredient fit.** Add a builder-only variant that states fit (for example, “Uses 4 of your 5 ingredients”), shows 2–3 matching ingredients, and, where relevant, a restrained “You’ll also need…” line. Rank by fit. This requires match metadata in the query result. Suggested command: `$impeccable shape`.
2. **[P1] Builder empty-state recovery is incorrect.** Pass active ingredient state and a clear callback to the shared results component. Replace search/category recovery copy with builder-specific recovery: “Nothing in your collection uses those ingredients together yet,” plus Clear ingredients, Try fewer ingredients, and optionally Create a recipe. Suggested command: `$impeccable harden`.
3. **[P1] The builder promise is underspecified.** Rename toward the outcome (“What can I make?”), explain the matching rule in one sentence, and show a compact live relationship such as “3 ingredients selected · 8 matching recipes.” Suggested command: `$impeccable clarify`.
4. **[P2] Card density does not reflect decision priority.** In browse, reduce the emphasis of low-value metadata; in the builder, make match fit the lead datum. Do not solve this with imagery or extra decorative badges. Suggested command: `$impeccable layout`.
5. **[P2] Pantry input is tedious at scale.** Provide Clear all alongside the label, a selected count, and a mobile-friendly summary before the growing chip field. Suggested command: `$impeccable adapt`.

## Persona Red Flags

- **Alex, frequent recipe keeper:** cannot clear pantry selections at once or compare/rank results by fit, time, or favorites.
- **Jordan, first-time cook:** cannot infer whether “Possible Recipes” uses all selected ingredients, any ingredient, or a threshold; no-match recovery refers to controls absent from the page.
- **Maya, mobile cook:** small per-chip removal affordances and generic cards make comparison laborious while the selected pantry moves offscreen.

## Minor Observations

- The favorite heart looks interactive although it appears to be status-only.
- The component owns a redundant `key` prop.
- Focus rings on title links need clearer separation from nearby card content.
- The broad warm card surface offers little context distinction from its page background.

## Questions to Consider

1. Should “possible” mean using every selected ingredient, any selected ingredient, or a defined threshold?
2. In a builder result, is the primary decision cue ingredient fit, speed, or favorite status?
3. Would you prefer browse recipes to stay as quiet cards while the builder adopts a distinct “match result” treatment?
