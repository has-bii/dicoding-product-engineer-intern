# Install Composer dependencies without dev packages or scripts (artisan needs the app code)
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-progress --no-scripts --no-autoloader --prefer-dist --ignore-platform-reqs

FROM dunglas/frankenphp:1-php8.4

RUN install-php-extensions pdo_mysql opcache intl \
	&& mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Plain HTTP on port 8000; put a TLS-terminating proxy in front for a public deployment
ENV SERVER_NAME=:8000

WORKDIR /app

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY --from=vendor /app/vendor ./vendor
COPY . .
RUN composer dump-autoload --no-dev --optimize --classmap-authoritative \
	&& rm /usr/bin/composer

ARG USER=app
RUN useradd --create-home ${USER} \
	&& chown -R ${USER}:${USER} storage bootstrap/cache /config/caddy /data/caddy

COPY --chmod=755 docker/entrypoint.sh /usr/local/bin/entrypoint.sh

USER ${USER}
EXPOSE 8000

ENTRYPOINT ["entrypoint.sh"]
CMD ["frankenphp", "run", "--config", "/etc/frankenphp/Caddyfile", "--adapter", "caddyfile"]
