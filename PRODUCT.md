# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who create and maintain recipes with any frequency, especially home cooks who want a focused personal collection without the advertising and editorial clutter common on recipe websites.

## Product Purpose

Forked Recipe Book is a personal recipe-management app for creating, organizing, and revisiting recipes. It exists to make recipe use feel direct and calm; success is a cook quickly finding, maintaining, or making a recipe without ads or superfluous content getting in the way.

## Positioning

An intentionally minimal, ad-free recipe collection with a recipe builder that matches a cook's available ingredients to recipes they can make on the site.

## Operating Context

Users create and edit recipes; organize them with ingredients and categories; save favorites; review quantities, nutrition, prep/cook times, and structured instruction sections; and use the recipe builder at `/recipe/build` to discover recipes from ingredients already on hand.

## Capabilities and Constraints

- Account-based web app built with Next.js, React, Prisma, tRPC, and PostgreSQL.
- Recipes support ingredients, categories, favorites, servings, prep and cook times, nutrition fields, and ordered instruction sections and steps.
- The recipe builder accepts ingredients a user has and finds viable recipes from the site's collection.
- User-uploaded images are intentionally out of scope: their quality and consistency would undermine the product's focused experience.

## Brand Commitments

- Preserve a minimal, uncluttered experience that avoids cookie-cutter execution.
- The product remains ad-free and avoids unnecessary content or interface chrome.
- Owned illustrations may be used selectively for categories or a hero; Notion-style characters are a useful reference for that illustration approach.

## Evidence on Hand

- Working product routes and components for browsing, creating, editing, viewing, and building recipes in `src/app` and `src/components`.
- A `public/forked-logo.png` asset exists.
- No user-uploaded image system is planned. Do not fabricate testimonials, customer claims, or other proof.

## Product Principles

1. Make recipes the focus, not the platform around them.
2. Remove advertising and incidental clutter from the cooking workflow.
3. Help people act on the ingredients they already have.
4. Keep personal collections easy to create, organize, and return to.
5. Use visual personality with restraint so it supports clarity.
