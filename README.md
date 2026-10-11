# Dicoding Jobs Platform

A job vacancy platform. Anyone can browse and search vacancies. A signed-in admin can create, edit and delete their own vacancies, and choose whether the salary range is shown publicly.

| Part                           | Stack                                          |
| ------------------------------ | ---------------------------------------------- |
| [`backend/`](backend/README.md)   | Laravel 13 JSON API, Sanctum tokens, MySQL     |
| [`frontend/`](frontend/README.md) | Next.js 16 web app, TanStack Query, Tailwind  |
| `docker/database/`             | MySQL 9 via Docker Compose, `dev` and `test` databases |
| `docker-compose.yaml`          | Production stack: MySQL, backend and frontend in containers |
| `open-api/`                    | API request collection ([Bruno](https://www.usebruno.com/) / OpenCollection format) |

## Screenshots

**Vacancy list**

![Vacancy list](docs/screenshots/vacancy-list.png)

**Vacancy detail**

![Vacancy detail](docs/screenshots/vacancy-detail.png)

**Dashboard login**

![Dashboard login](docs/screenshots/login-dialog.png)

**Dashboard: my vacancies**

![Dashboard](docs/screenshots/dashboard.png)

**Create vacancy**

![Create vacancy](docs/screenshots/create-vacancy.png)

## Prerequisites

- Docker with Docker Compose
- PHP 8.4 or newer with `pdo_mysql`, and [Composer](https://getcomposer.org/)
- Node.js 20.9 or newer and pnpm 12 (`corepack enable`)

## Quick start

Run each step from the repository root.

1. **Start MySQL.** This creates the `dev` and `test` databases on first start, with user `app` and password `app` on port `3306`:

   ```bash
   docker compose -f docker/database/docker-compose.yaml up -d
   ```

2. **Set up and run the backend** at <http://localhost:8000/api>:

   ```bash
   cd backend
   composer setup        # install, create .env, generate key, migrate
   php artisan db:seed   # admin user and a sample vacancy
   composer dev
   ```

3. **Set up and run the frontend** at <http://localhost:3000>, in a second terminal:

   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```

4. Open <http://localhost:3000>. To reach the dashboard, sign in with:

   | Email                | Password      |
   | -------------------- | ------------- |
   | `admin@dicoding.com` | `dicoding123` |

The [backend README](backend/README.md) covers database options, the API endpoints and validation rules. The [frontend README](frontend/README.md) covers configuration, pages and project layout.

## Running with Docker (production)

`docker-compose.yaml` at the repository root builds and runs the whole stack: MySQL, the backend on [FrankenPHP](https://frankenphp.dev/) and the frontend as a standalone Next.js server. It needs only Docker, not PHP or Node.js. It is separate from the `docker/database/` setup used for development and uses its own MySQL volume.

1. **Create `.env`** in the repository root from the example and fill in the secrets:

   ```bash
   cp .env.docker.example .env
   echo "base64:$(openssl rand -base64 32)"   # paste the output into APP_KEY
   ```

   | Variable              | Default                 | Description                                                    |
   | --------------------- | ----------------------- | -------------------------------------------------------------- |
   | `APP_KEY`             | (required)              | Laravel encryption key                                         |
   | `MYSQL_ROOT_PASSWORD` | (required)              | MySQL root password                                            |
   | `DB_PASSWORD`         | (required)              | Password for the app's database user                           |
   | `DB_DATABASE`         | `vacancy`               | Database name                                                  |
   | `DB_USERNAME`         | `app`                   | Database user                                                  |
   | `API_URL`             | `http://localhost:8000` | Public URL of the backend, without `/api`                      |
   | `BACKEND_PORT`        | `8000`                  | Host port for the backend                                      |
   | `FRONTEND_PORT`       | `3000`                  | Host port for the frontend                                     |
   | `LOG_LEVEL`           | `warning`               | Backend log level. Logs go to `docker compose logs backend`    |
   | `DB_SEED`             | `true`                  | Seed the admin user and sample vacancy on every backend start  |

2. **Build and start** the stack:

   ```bash
   docker compose up -d --build
   ```

   Keep `--build` after pulling or changing code. Without it, Compose reuses the old images, including the old backend startup script.

   Every time the backend starts, it runs pending migrations and then the seeders. The seeders create or update the admin user and the sample "Product Engineer" vacancy, so a restart resets the admin password and that vacancy's fields to the seeded values. Set `DB_SEED=false` to turn this off.

Open <http://localhost:3000>. The API is at <http://localhost:8000/api>.

The browser calls the API directly, so `API_URL` must be an address users can reach, not a Docker service name. It is built into the frontend bundle, so rebuild the frontend after changing it:

```bash
docker compose up -d --build frontend
```

Both apps serve plain HTTP. For a public deployment, put a reverse proxy in front of them to terminate TLS. MySQL is not published to the host. Its data lives in the `mysql-data` volume, which `docker compose down -v` deletes.

## Running all tests

Both suites need MySQL running.

**Backend** (PHPUnit, unit and integration). Uses the separate `test` database, so your `dev` data is untouched:

```bash
cd backend
composer test
```

**Frontend** (Playwright end-to-end). Needs the backend running and seeded on port 8000. Playwright starts the frontend dev server itself if it is not already running. The tests create and delete a vacancy in the `dev` database.

```bash
cd frontend
pnpm exec playwright install chromium   # first time only
pnpm test:e2e
```

See each app's README for running a single suite or test.
