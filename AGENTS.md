# Repository Guidelines

## Project Structure & Module Organization

This is a T3-stack Next.js app using the App Router.

- `src/app`: routes, server actions, API route handlers (`api/*`), and page-level UI.
- `src/components`: reusable UI and feature components (`UI/*`, `recipe/*`).
- `src/server`: tRPC and auth server logic.
- `src/models` and `src/service`: domain models and service-layer helpers.
- `src/hooks`, `src/lib`, `src/utils`: shared client utilities.
- `prisma`: `schema.prisma` and migrations.
- `public`: static assets.

## Build, Test, and Development Commands

Use `pnpm` (lockfile and CI are configured for it).

- `pnpm dev`: run local dev server with `.env.dev`.
- `pnpm lint`: run Next.js + TypeScript ESLint rules.
- `pnpm build`: create production build.
- `pnpm start`: start built app (also loads `.env.dev`).
- `pnpm scan`: run app plus React Scan profiler (`localhost:3000`).
- `pnpm prisma migrate dev`: create/apply local Prisma migration.
- `pnpm prisma generate`: regenerate Prisma client/types.

## Coding Style & Naming Conventions

- Language: TypeScript (`.ts`/`.tsx`), 2-space indentation.
- Components: kebab-case or lowercase filenames (for example, `recipe-card.tsx` pattern is preferred for new files).
- Utilities/hooks: kebab-case or lowercase names matching existing patterns (for example, `recipe-service.ts`, `recipes.ts`).
- Linting: `next/core-web-vitals` + `@typescript-eslint` type-aware rules in `.eslintrc.cjs`.
- Formatting: Prettier with `prettier-plugin-tailwindcss` for class sorting.

## Testing Guidelines

There is currently no dedicated automated test script or framework configured in `package.json`. Minimum expectation before PR:

- run `pnpm lint`
- run `pnpm build`
- manually validate changed flows in `pnpm dev`

When adding tests, colocate near feature code and use clear names like `feature-name.test.ts`.

## Commit & Pull Request Guidelines

Recent history favors short, imperative, sentence-case commit messages (for example, `Adding recipe scaling to the recipe detail page`).

- Keep commits focused to one concern.
- Reference related issue/ticket IDs in the PR description.
- PRs should include: summary, impacted routes/files, migration notes (if `prisma/` changed), and screenshots/GIFs for UI changes.
- If schema or migrations change, ensure migration files are committed; production deploy uses `.github/workflows/prisma-prod-migration.yml`.

## Security & Configuration Tips

- Never commit secrets; use `.env`/`.env.dev` and keep `.env.example` updated.
- Review auth and API changes carefully in `src/app/api`, `src/server/auth`, and `src/server/api`.

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.
