FROM php:8.1-apache

# proxy
#RUN pear config-set http_proxy http://proxy0.screen.co.jp:8080

COPY ./php/php.ini /usr/local/etc/php/
COPY ./apache/*.conf /etc/apache2/sites-enabled/

# Enable JIT on PHP 8 (increase php performance)
COPY ./php/opcache.ini /usr/local/etc/php/conf.d

# other pachage
RUN apt-get update &&\
    apt-get install -y \
        vim git \
        libonig-dev \
        zip unzip libzip-dev \
        libpq-dev \
        libicu-dev libcurl4-gnutls-dev \
        zlib1g-dev libjpeg62-turbo-dev \
        libpng-dev libxml2-dev libxslt-dev \
        curl

# cron
RUN apt-get install -y cron
COPY cron/cron.conf /tmp/
RUN crontab /tmp/cron.conf
RUN rm -f /tmp/cron.conf

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - &&\
    apt-get install -y nodejs

# PHP extension
RUN docker-php-ext-install \
        mbstring \
        zip \
        pdo_pgsql \
        intl \
        pcntl \
        soap

RUN docker-php-ext-install \
    curl zip mysqli pdo pdo_mysql xmlwriter mbstring xsl

RUN docker-php-ext-configure intl \
    && docker-php-ext-install intl

RUN docker-php-ext-configure gd --with-jpeg=/usr/include/ \
    && docker-php-ext-install gd exif

RUN a2enmod rewrite

# Snappy library on linux
RUN apt-get install libxrender1
RUN apt-get install libfontconfig -y

COPY --from=composer:2.0 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER 1
ENV COMPOSER_HOME /composer
ENV PATH $PATH:/composer/vendor/bin

WORKDIR /var/www/html

# CMD ["/usr/bin/supervisord"]
