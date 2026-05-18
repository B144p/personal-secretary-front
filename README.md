# Personal Secretary — Frontend

Next.js 15 App Router frontend for Personal Secretary, an AI-powered personal planning assistant.

## Prerequisites

- Node.js 20 LTS or later
- pnpm (`npm install -g pnpm`)
- The backend (`personal-secretary-back`) running on `http://localhost:8000`

## Setup

```bash
cp .env.local.example .env.local
# Edit .env.local if your backend runs on a different port
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The root page redirects to `/signin` if you're not authenticated, or to `/plans` if you are.

## Environment

See `.env.local.example`. The only client-side variable is:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm test:e2e` | Playwright e2e tests (requires backend + `SESSION_COOKIE` env var) |
| `pnpm test:e2e:ui` | Playwright interactive UI |

## E2E tests

The e2e tests in `e2e/` require a real backend session. Set the `SESSION_COOKIE` environment variable to a valid session cookie value extracted from a real sign-in (or a test fixture endpoint on the backend):

```bash
SESSION_COOKIE=<cookie-value> pnpm test:e2e
```

Without `SESSION_COOKIE` the authenticated test cases are skipped; the unauthenticated redirect test still runs.

## Architecture

See `CLAUDE.md` for full architecture notes and `requirements/2026-05-16.md` (local-only, gitignored) for the authoritative spec.
