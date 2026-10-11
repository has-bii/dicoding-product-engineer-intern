#!/bin/sh
set -e

# Cache config, routes and events from the runtime environment (no views in this API-only app),
# then bring the schema up to date and seed it
php artisan config:cache
php artisan route:cache
php artisan event:cache
php artisan migrate --force

# The seeders use updateOrCreate, so running them on every start is safe
if [ "${DB_SEED:-true}" = "true" ]; then
	php artisan db:seed --force
fi

exec "$@"
