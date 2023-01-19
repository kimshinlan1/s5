# System Env Infomation

## DEV Environment

- OS: Window 10 Pro
- IDE: VS Code (lastest version)
- Check style code tool: phpcs + php_codesniffer (install extension in VS Code)
- Laravel framework v9
- Test browser: Chrome (lastest version) and Microsoft Edge (Version 102.0.1245.44 (64-bit))
- Docker / Docker compose (lastest version)
  Docker Config (confirm more detail in docker-compose.yml and Dockerfile):
    - Apache 2
    - PHP 8 + Extension (Common: curl, zip, mysqli, pdo, pdo_mysql, xmlwriter, mbstring, xsl, intl, gd, ...)
    - Mariadb 10 + phpmyadmin


## SETUP ENV
Move to Root Source code folder and run commands:

- Run docker first time:
docker-compose up --build

- Run docker:
docker-compose up

- SSH container:
docker exec -it 5s_web bash

- Init .env
cp .env.example .env

- Init laravel system in first time
sh initialize.sh

- Test
Open browser, type localhost on URL and check login page

Login:
kaizenbaseadmin@domain.com / Kaizenbaseadmin_12345 (Owner)
free_user@domain.com / User_12345 (無償契約)
paid_user@domain.com / User_12345 (有償契約)
or use pass default: Kaizenbaseadmin_12345

Ref: /web/database/seeders/UsersTableSeeder.php

## NOTE
We must SSH container to execute below optional behaviors:
docker exec -it 5s_web bash

- Migrate database (optional, when create/edit migrate in laravel):
php artisan migrate:fresh

- Create seed data (optional, when create/edit migrate in laravel)
php artisan db:seed

- Rebuild Mix (optional, when create/edit JS/CSS)
npm run dev


