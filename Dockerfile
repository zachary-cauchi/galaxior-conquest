FROM php:apache-buster

# Copy the website to the apache hosting dir.
COPY website/ /var/www/html/

# Copy the php configs to their destination.
RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"
COPY php.ini "$PHP_INI_DIR/conf.d"

EXPOSE 80
