# Repository Guidelines

## Project Structure & Module Organization
Nx manages multiple apps in this workspace. `apps/be/src` hosts the NestJS API, `apps/bo/src` the Vite-powered back office, and `apps/client` the Next.js customer portal. Shared TypeScript utilities and DTOs live in `common/src`, while cross-cutting type definitions stay under `types/`. Environment templates and runtime manifests sit in `config/`, deployments data in `deployments/`, and Flyway helpers plus SQL migrations reside in `db_migration/`. Keep feature-specific assets close to their owning app to preserve module boundaries.

## Build, Test, and Development Commands
Install once with `npm install` (Node 20.18.x). Run an individual service via `nx serve be|bo|client`, or bring up everything with `nx run-many --targets serve`. Produce optimized bundles using `nx build <app> --configuration=production`. Launch the Postgres stack with `docker-compose -f docker-compose.yml up -d`, then apply migrations through `npm run migrate` (other Flyway actions: `npm run clean`, `npm run info`).

## Coding Style & Naming Conventions
Follow the enforced ESLint + Prettier setup; format with `npx prettier --write .` before committing. The `.editorconfig` defines 2-space indentation and UTF-8 across the repo. Favor PascalCase for React components, camelCase for functions and variables, and snake_case only for SQL columns. Type-only modules belong in `types/` and reusable Nest providers in `common/`. Update barrel exports cautiously to avoid circular imports.

## Testing Guidelines
Unit tests run with Jest through Nx: `nx test <app>` (add `--coverage` for reports; CI enables coverage by default). Place specs alongside source files using the `.spec.ts[x]` suffix. Prefer deterministic data builders over fixtures, and mock external services such as AWS S3 or mail transport. Run `nx lint <app>` before submitting to catch style regressions.

## Commit & Pull Request Guidelines
Match the Conventional Commit style already used (`feat:`, `fix:`, `chore:`) and keep commit scopes small. Reference scripts, migrations, or config files touched in the body for traceability. PRs should describe the change, list impacted apps, and note any manual migration steps. Attach screenshots or terminal output when UI shifts or CLI flows change. Confirm lint, test, and migration commands were executed before requesting review.

## Environment & Deployment Tips
Copy `.env.dev-local` to `.env` prior to running services; document any new keys in `.env.template`. Generated bundles land in `dist/`, so keep transient artifacts out of version control. When adding HTTP endpoints, register contract updates in `common/` to keep clients in sync, and update nginx templates under `config/` if routing changes.
