# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Runtime and tooling
- Node.js app using ESM (`"type": "module"` in `package.json`).
- Express 5 API with Drizzle ORM and Neon (`@neondatabase/serverless`).
- Security layer uses Arcjet (`@arcjet/node`) via global middleware.

## Core commands
- Install deps: `npm ci`
- Run app locally (watch mode): `npm run dev`
- Run app once (no watch): `npm run start`
- Lint: `npm run lint`
- Lint (auto-fix): `npm run lint:fix`
- Prettier check: `npm run format:check`
- Generate migrations: `npm run db:generate`
- Apply migrations: `npm run db:migrate`
- Open Drizzle Studio: `npm run db:studio`
- Start Docker dev stack (Neon Local + app): `npm run dev:docker`
- Start Docker prod stack (app only): `npm run prod:docker`

## Tests
- There is currently no test script and no test files in the repository.
- When adding tests, prefer adding an npm script first (for consistent CI/local usage).
- Single-test execution is not currently standardized in this repo.

## High-level architecture
- Entry path: `src/index.js` loads env (`dotenv/config`) and imports `src/server.js`.
- `src/server.js` only starts the HTTP listener; app composition happens in `src/app.js`.
- `src/app.js` wires global middleware in this order: Helmet, CORS, cookie parser, JSON/urlencoded parsers, Morgan→Winston logging, then Arcjet security middleware (`src/middleware/security.middleware.js`), then routes.
- Routing is split by feature:
  - `src/routes/auth.routes.js` → `src/controllers/auth.controller.js`
  - `src/routes/users.routes.js` → `src/controllers/users.controller.js`
- Controllers handle request validation and HTTP response shaping; business/data logic is delegated to services (`src/services/*`).
- Services use Drizzle through `db` from `src/config/database.js`, with table schema in `src/models/user.model.js`.
- Request validation uses Zod schemas in `src/validations/*`.
- Utility helpers for auth/session formatting are in `src/utils/*` (JWT, cookies, validation formatting).

## Database and environment model
- `DATABASE_URL` is mandatory (`src/config/database.js` throws if missing).
- Local/dev path supports Neon Local behavior (host-based detection + optional `NEON_LOCAL_HTTP_ENDPOINT` override).
- Drizzle config is in `drizzle.config.js`, writing SQL migrations to `drizzle/`.
- Dev container flow (`docker-compose.dev.yml`): app + `neon-local` service, with source mounted for live reload.
- Prod container flow (`docker-compose.prod.yml`): app only, expecting direct Neon Cloud `DATABASE_URL`.

## Repository-specific gotchas
- Path aliases are defined in `package.json#imports`; services alias key is intentionally spelled `#servies/*` and code imports follow that spelling.
- `scripts/dev.sh` and `scripts/prod.sh` run migrations as part of startup flow; account for this when debugging boot issues.
