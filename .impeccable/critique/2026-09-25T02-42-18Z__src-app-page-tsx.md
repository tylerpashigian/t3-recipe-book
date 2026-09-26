---
target: Home page and recipe list
total_score: 37
max_score: 72
na_heuristics: "home:7,10"
p0_count: 0
p1_count: 3
target_identity: "file:/Users/tylerpashigian/Documents/NextJS/t3-recipe-book/t3-recipe-book/src/app/page.tsx"
target_fingerprint: "sha256:707d871db3e5b4535d897b9ecc346d958e84699ad2ed12bc70faf21c956da9a9"
target_path: /Users/tylerpashigian/Documents/NextJS/t3-recipe-book/t3-recipe-book/src/app/page.tsx
timestamp: 2026-09-25T02-42-18Z
slug: src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Home | Recipe list | Key issue |
|---|---|---:|---:|---|
| 1 | Visibility of System Status | 1 | 2 | Home offers no next-step context; list lacks result/filter context. |
| 2 | Match System / Real World | 2 | 2 | Community language conflicts with a personal collection. |
| 3 | User Control and Freedom | 3 | 3 | Core navigation and filters are reversible. |
| 4 | Consistency and Standards | 2 | 3 | Competing primary colors undermine consistency. |
| 5 | Error Prevention | 3 | 2 | List empty state provides no recovery. |
| 6 | Recognition Rather Than Recall | 2 | 3 | Pantry Magic is vague; list controls are recognizable. |
| 7 | Flexibility and Efficiency | n/a | 2 | Persuade surface is n/a; list lacks efficient collection views. |
| 8 | Aesthetic and Minimalist Design | 1 | 2 | Minimal but sterile and visually uniform. |
| 9 | Error Recovery | 2 | 1 | No meaningful recovery on no-result state. |
| 10 | Help and Documentation | n/a | 1 | Persuade surface is n/a; list hides builder guidance. |
| **Total** | | **16/32** | **21/40** | Home needs a visual and messaging reset; list is usable but emotionally flat. |

## Design Specificity Verdict

Both surfaces are category-interchangeable, especially the home page. The documented Calm Pantry system is not yet expressed in the interface: standard SaaS hero structure, generic feature cards, system sans typography, and pale blank surfaces could serve almost any productivity product. The recipe list is appropriately restrained but does not feel like a personal collection or surface the ingredient builder’s differentiator.

The deterministic scan was clean: 0 findings for `src/app/page.tsx` and 0 findings for `src/app/recipes/page.tsx`. Browser evidence could not be collected because fresh localhost tabs failed the browser security auto-review before page load; no overlay was injected.

## Overall Impression

The app has an admirably low control count and a solid browse foundation. Its biggest opportunity is not adding decoration; it is giving the existing minimalism a product-specific visual grammar and a literal, confident story about personal recipe keeping and cooking from what is already on hand.

## What's Working

- Search plus category filtering keeps recipe discovery intentionally simple.
- Recipe cards expose useful decision cues: time, servings, categories, and favorite count.
- The home page already routes to the ingredient builder, the product’s clearest differentiator.

## Priority Issues

1. **[P1] Generic visual world.** The white/warm-white fields, slate/near-black split, generic iconography, system sans, and repeated soft shadows read as starter SaaS rather than Calm Pantry. Replace the token relationship, not just individual hex values: choose a warmer base, one earthy working color, and a rare secondary accent; add a selective owned pantry companion/ingredient illustration; use a more distinctive heading face while preserving a readable UI body face. Suggested command: `$impeccable colorize`, then `$impeccable typeset`.
2. **[P1] Home narrative sells the wrong product.** Community/platform language and generic claims dilute the ad-free personal collection promise. Lead with ownership and a literal ingredient-builder payoff; put tangible product proof after the hero and retire or move the Coming Soon section. Suggested command: `$impeccable clarify`.
3. **[P1] Ingredient builder is treated as a novelty.** Pantry Magic is memorable but vague, and the builder vanishes from the recipe list. Name and explain it as an “I have these ingredients” action; make it an intentional second-primary route and offer it from no-results. Suggested command: `$impeccable clarify` or `$impeccable delight`.
4. **[P2] Recipe browsing lacks orientation and recovery.** There is no result count, active-filter context, reset action, or productive empty state. Add count, removable filters, clear/reset controls, and an empty-state handoff to Build from ingredients. Suggested command: `$impeccable harden`.
5. **[P2] Uniform surface rhythm feels lifeless.** A full-viewport centered hero, equivalent feature cards, and equal-weight recipe card CTAs do not establish a focal hierarchy. Use one intentional asymmetric composition and quieter card actions; remove large hover shadows from ordinary cards. Suggested command: `$impeccable layout`.

## Persona Red Flags

- **Jordan, first-time home cook:** Cannot tell why this beats bookmarking or what Pantry Magic does before clicking. Community framing can imply unwanted public sharing. The no-results state offers no path forward.
- **Alex, frequent recipe keeper:** Has no result count, sort/recent/favorites view, or quick bridge from ingredients on hand to viable meals. Repeated View Recipe buttons slow large-collection scanning.
- **Sam, privacy-minded collector:** Community language and sharing promises undermine the personal, ad-free positioning and make ownership/privacy feel unclear.

## Minor Observations

- `--primary` near-black competes with `--forked-primary` slate.
- A full-viewport hero pushes product proof below the fold.
- The promoted Coming Soon card reads unfinished.
- Owned illustration is a better personality investment than generic food-agnostic icons.
- Remove community wording from recipe-list copy.

## Questions to Consider

1. What if the home page began with what is in the kitchen rather than an abstract organization claim?
2. Could it demonstrate the builder in one compact visual interaction before listing conventional features?
3. What recurring owned visual object would make a photo-free collection recognizably Forked without adding clutter?
