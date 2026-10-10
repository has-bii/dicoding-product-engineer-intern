# Dicoding Jobs Platform API

The JSON API behind the Dicoding Jobs Platform. Anyone can browse job vacancies. An authenticated admin can create, update and delete them.

It is a Laravel 13 app. Authentication uses Sanctum bearer tokens and data is stored in MySQL.

## Tech stack

| Concern        | Choice                                           |
| -------------- | ------------------------------------------------ |
| Language       | PHP 8.3+                                         |
| Framework      | Laravel 13                                       |
| Authentication | Laravel Sanctum (personal access tokens)         |
| Database       | MySQL 9 (in Docker), separate `test` database    |
| Testing        | PHPUnit 12                                       |

## Project structure

```
app/
├── Enums/                 JobType, ExperienceLevel (string-backed, with labels)
├── Http/
│   ├── Controllers/
│   │   ├── Auth/          AuthController: login, me
│   │   └── Vacancy/       VacancyController: CRUD + locations
│   └── Requests/          Form request validation per endpoint
└── Models/                User, Vacancy (UUID primary keys)
database/
├── factories/             UserFactory, VacancyFactory
├── migrations/
└── seeders/               Admin user + a sample "Product Engineer" vacancy
routes/api.php             All API routes, served under /api
tests/
├── Unit/                  Enums, model casts, form request rules
└── Integration/           HTTP tests against the API endpoints
```

## Prerequisites

- PHP 8.3 or newer, with the `pdo_mysql` extension
- [Composer](https://getcomposer.org/)
- Docker with Docker Compose, for the MySQL database

## Setup

All commands below run from the `backend/` directory unless stated otherwise.

1. **Start MySQL.** The compose file lives in `docker/database` at the repository root:

   ```bash
   docker compose -f ../docker/database/docker-compose.yaml up -d
   ```

   This starts MySQL on port `3306` with user `app` and password `app`. On first start, `docker/database/init/init.sql` creates two databases: `dev` for development and `test` for the test suite. These match the defaults in `.env.example` and `phpunit.xml`. The data is persisted in `docker/database/data/`. To use a different password or port, set `MYSQL_PASSWORD` or `MYSQL_PORT` before running the command, and update `.env` to match. The user name is fixed to `app` because `init.sql` grants access to it by name.

   MySQL only runs the init script when the data directory is empty. If you have a `data/` directory from before the `dev` and `test` databases existed, wipe it (this deletes all local data) and start again:

   ```bash
   docker compose -f ../docker/database/docker-compose.yaml down
   rm -rf ../docker/database/data
   docker compose -f ../docker/database/docker-compose.yaml up -d
   ```

2. **Install dependencies, create `.env`, generate the app key and run the migrations:**

   ```bash
   composer setup
   ```

   This is shorthand for:

   ```bash
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate --force
   ```

3. **Seed the database** with the admin user and a sample vacancy:

   ```bash
   php artisan db:seed
   ```

   | Email                | Password      |
   | -------------------- | ------------- |
   | `admin@dicoding.com` | `dicoding123` |

   To start over from an empty database, run `php artisan migrate:fresh --seed`.

## Running the backend

```bash
composer dev
```

This starts the HTTP server, a queue worker and a log tail (`php artisan pail`) together. Run `php artisan dev:list` to see each process. The API is served at <http://localhost:8000/api>.

To run only the HTTP server:

```bash
php artisan serve
```

Check that the app is up with `GET http://localhost:8000/up`.

## API overview

Every route is prefixed with `/api`. Routes marked 🔒 need an `Authorization: Bearer <token>` header. Get a token from the login endpoint.

| Method   | Path                       | Description                                                       |
| -------- | -------------------------- | ----------------------------------------------------------------- |
| `POST`   | `/api/auth/login`          | Exchange `email` and `password` for a bearer token (6 requests/min) |
| `GET`    | `/api/auth/me`             | 🔒 The authenticated user                                         |
| `GET`    | `/api/vacancy`             | List vacancies, newest first. Cursor paginated, 10 per page. Optional `title` filter |
| `GET`    | `/api/vacancy/locations`   | Distinct vacancy locations, sorted alphabetically                 |
| `GET`    | `/api/vacancy/{id}`        | Full detail of one vacancy                                        |
| `POST`   | `/api/vacancy`             | 🔒 Create a vacancy owned by the current user                     |
| `PUT`    | `/api/vacancy/{id}`        | 🔒 Replace every editable field of a vacancy                      |
| `DELETE` | `/api/vacancy/{id}`        | 🔒 Delete a vacancy                                               |

Example login:

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dicoding.com","password":"dicoding123"}'
```

### Vacancy fields

`POST` and `PUT` take the same body:

| Field               | Rules                                                                   |
| ------------------- | ----------------------------------------------------------------------- |
| `title`             | required, string, max 255                                               |
| `job_type`          | required, one of `full_time`, `part_time`, `contract`, `internship`     |
| `candidates_needed` | required, integer, 1 to 100                                             |
| `active_until`      | required, date, today or later                                          |
| `location`          | required, string, max 255                                               |
| `is_remote`         | required, boolean                                                       |
| `description`       | required, string (HTML)                                                 |
| `salary_min`        | required, integer, at least 0                                           |
| `salary_max`        | optional, integer, greater than or equal to `salary_min`                |
| `show_salary`       | required, boolean                                                       |
| `min_experience`    | required, one of `less_than_1`, `1_to_3`, `4_to_5`, `6_to_10`, `more_than_10` |

The `title` filter on `GET /api/vacancy` is optional. When given, it must be at least 3 characters and contain only letters and spaces.

A validation failure returns `422` with Laravel's standard `message` and `errors` body. Any error under `/api` is rendered as JSON.

## Running the tests

Tests run against the `test` MySQL database, so MySQL must be running (see Setup). `phpunit.xml` forces `DB_CONNECTION=mysql` and `DB_DATABASE=test`, while host, port and credentials come from `.env`. The integration tests use `RefreshDatabase`, which drops and recreates every table in `test`, so the `dev` database is never touched.

```bash
composer test
```

This clears the cached config, then runs `php artisan test`. Clearing the config first matters: if the config is cached, the tests could pick up your `.env` database settings.

Run a single suite:

```bash
php artisan test --testsuite=Unit
php artisan test --testsuite=Integration
```

Filter by test class or method name:

```bash
php artisan test --filter=ManageVacancyTest
```

| Suite         | Covers                                                                   |
| ------------- | ------------------------------------------------------------------------ |
| `Unit`        | Enum labels, model casts, form request validation rules                  |
| `Integration` | Auth endpoints and vacancy list, detail and management endpoints over HTTP |
