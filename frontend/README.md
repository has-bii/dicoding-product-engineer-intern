# Dicoding Jobs Platform Web

The web app for the Dicoding Jobs Platform. Visitors browse and search job vacancies. A signed-in admin manages their own vacancies from the dashboard.

It is a Next.js 16 app (App Router) that talks to the Laravel API in [`../backend`](../backend/README.md). The UI is in Indonesian.

## Tech stack

| Concern         | Choice                                               |
| --------------- | ---------------------------------------------------- |
| Framework       | Next.js 16, React 19, React Compiler                 |
| Language        | TypeScript                                           |
| Styling         | Tailwind CSS 4, shadcn/ui on Base UI                 |
| Data fetching   | TanStack Query, axios                                |
| Forms           | TanStack Form, Zod                                   |
| Rich text       | Tiptap                                               |
| Lint and format | Biome                                                |
| E2E testing     | Playwright                                           |
| Package manager | pnpm                                                 |

## Pages

| Route                          | Description                                                  |
| ------------------------------ | ------------------------------------------------------------ |
| `/`                            | Latest vacancies with title search and a "load more" button |
| `/vacancy/[id]`                | Vacancy detail                                               |
| `/dashboard`                   | 🔒 The admin's own vacancies, with edit and delete           |
| `/dashboard/vacancy/create`    | 🔒 Create a vacancy                                          |
| `/dashboard/vacancy/[id]/edit` | 🔒 Edit a vacancy                                            |

Routes marked 🔒 show a login dialog until you sign in. The bearer token from the API is kept in `localStorage`.

## Project structure

```
src/
├── app/
│   ├── (main)/            Public pages: vacancy list and detail
│   └── (dashboard)/       Dashboard pages behind the auth guard
├── components/            Shared layout pieces (header, footer, sidebar, editor)
│   └── ui/                shadcn/ui components, not linted by Biome
├── features/
│   ├── auth/              Login, logout, current user, auth guard
│   └── vacancy/           API queries and mutations, schemas, list/detail/form components
├── hooks/
├── lib/                   axios instance, token storage, helpers
└── types/
e2e/                       Playwright tests
```

## Prerequisites

- Node.js 20.9 or newer
- pnpm 12 (`corepack enable` picks the version from `package.json`)
- The backend API running and seeded. See the [backend README](../backend/README.md)

## Setup

All commands below run from the `frontend/` directory.

```bash
pnpm install
```

The app calls `http://localhost:8000/api` by default. To point it somewhere else, copy `.env.example` to `.env.local` and edit `NEXT_PUBLIC_API_URL`:

```bash
cp .env.example .env.local
```

## Running the frontend

```bash
pnpm dev
```

Open <http://localhost:3000>. To use the dashboard, sign in with the seeded admin:

| Email                | Password      |
| -------------------- | ------------- |
| `admin@dicoding.com` | `dicoding123` |

For a production build:

```bash
pnpm build
pnpm start
```

`next.config.ts` sets `output: "standalone"`, so the build also produces a self-contained server in `.next/standalone/`. The `Dockerfile` uses it to build a small production image that runs `node server.js` as a non-root user on port `3000`. Pass the API URL as a build argument, because `NEXT_PUBLIC_*` values are built into the browser bundle:

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.example.com/api -t vacancy-frontend .
```

To run it together with MySQL and the backend, use the compose file at the repository root. See [Running with Docker](../README.md#running-with-docker-production).

## Lint and format

```bash
pnpm lint      # check only
pnpm check     # check and apply safe fixes
pnpm format    # format only
```

## Running the tests

The end-to-end tests drive a real browser against the running app and API. They create, edit and delete a vacancy, so run them against the `dev` database, not production data.

1. Make sure MySQL and the backend are running and seeded (`php artisan migrate:fresh --seed` in `backend/` gives a clean start). The public test expects the seeded "Product Engineer" vacancy.
2. Install the Playwright browser once:

   ```bash
   pnpm exec playwright install chromium
   ```

3. Run the tests:

   ```bash
   pnpm test:e2e
   ```

Playwright starts `pnpm dev` for you, or reuses a dev server already running on port 3000. A `setup` project signs in once as the admin and saves the session to `e2e/.auth/user.json`, which the other tests reuse.

Useful variants:

```bash
pnpm test:e2e --ui                       # interactive UI mode
pnpm test:e2e --headed                   # watch the browser
pnpm exec playwright show-report         # open the last HTML report
```

| File                 | Covers                                                                 |
| -------------------- | ---------------------------------------------------------------------- |
| `e2e/auth.setup.ts`  | Signs in with the seeded admin and stores the session                  |
| `e2e/vacancy.spec.ts`| Guest list and detail, login prompt on the dashboard, create/edit/delete flow |
