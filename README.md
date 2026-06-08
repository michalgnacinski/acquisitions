# Acquisitions Docker Setup (Neon Local for Dev, Neon Cloud for Prod)

This project uses two different database connection modes:

- **Development**: Neon Local proxy in Docker, with ephemeral branches.
- **Production**: direct Neon Cloud URL via `DATABASE_URL`.

## Files

- `Dockerfile` - multi-stage image (`development` and `production` targets)
- `docker-compose.dev.yml` - app + Neon Local for local development
- `docker-compose.prod.yml` - app only (connects to Neon Cloud via env vars)
- `.env.development` - local development variables (Neon Local + app)
- `.env.production` - production variables (Neon Cloud URL)

## 1) Development (Neon Local + ephemeral branches)

1. Fill required values in `.env.development`:
   - `NEON_API_KEY`
   - `NEON_PROJECT_ID`
   - `PARENT_BRANCH_ID` (ephemeral branches are created from this branch)
2. Start development stack:

   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

3. App will connect through Neon Local using:

   ```bash
   DATABASE_URL=postgres://neon:npg@neon-local:5432/neondb
   ```

Because `PARENT_BRANCH_ID` is set, Neon Local creates an ephemeral branch on startup and deletes it on shutdown (`DELETE_BRANCH=true`).

## 2) Production (Neon Cloud)

1. Set real production credentials in `.env.production` (or inject from your deployment platform secrets):
   - `DATABASE_URL=postgres://...neon.tech...`
2. Start production stack:

   ```bash
   docker compose -f docker-compose.prod.yml up --build -d
   ```

In production, **no Neon Local proxy is used**. The app uses the Neon serverless driver with the direct Neon Cloud connection string from environment variables.

## Environment switching

- Development command uses `.env.development` + `docker-compose.dev.yml`.
- Production command uses `.env.production` + `docker-compose.prod.yml`.
- The app reads `DATABASE_URL` at runtime, so no database URL is hardcoded in source.
