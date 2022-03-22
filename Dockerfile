FROM php:apache-buster

RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

# Copy the website to the apache hosting dir.
COPY website/ /var/www/html/

# Copy the php configs to their destination.
RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"
COPY configs/ "$PHP_INI_DIR/conf.d"

EXPOSE 80
EXPOSE 9003
