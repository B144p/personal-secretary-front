# Personal Secretary — Frontend

The web interface for Personal Secretary.

You give it a goal. It breaks the goal into tasks, schedules them on your Google Calendar around your availability, and adjusts the plan every day based on what you actually got done.

This repo is the frontend (Next.js). It talks to the backend (`personal-secretary-back`) which handles AI, scheduling, and Google Calendar.

## Getting started

You need the backend running first. Then:

```bash
cp .env.local.example .env.local
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with Google.

## Environment

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Change the URL if your backend runs on a different port.

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production build |
| `pnpm typecheck` | Type check |
| `pnpm lint` | Lint |
| `pnpm test:e2e` | E2E tests (requires a valid `SESSION_COOKIE` env var) |
| `pnpm test:e2e:ui` | E2E tests with interactive UI |
