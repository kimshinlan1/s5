# 初期構築用スクリプト

cp .env.example .env

#log permission
mkdir -p -m=775 storage/logs

# laravel folders
mkdir -p -m=777 storage/framework/cache/data
mkdir -p -m=777 storage/framework/sessions
mkdir -p -m=777 storage/framework/views
mkdir -p -m=777 storage/fonts
mkdir -p -m=777 bootstrap/cache

# Permission
chown -R 33:33 ./

# composer
composer install
composer dump-autoload

# copy to usr/local/bin for snappy
cp vendor/h4cc/wkhtmltoimage-amd64/bin/wkhtmltoimage-amd64 /usr/local/bin/
cp vendor/h4cc/wkhtmltopdf-amd64/bin/wkhtmltopdf-amd64 /usr/local/bin/
chmod +x /usr/local/bin/wkhtmltoimage-amd64
chmod +x /usr/local/bin/wkhtmltopdf-amd64

# npm
# in case of npm ERR!, need execute "npm install -g npm"
# npm install -g npm
npm install
npm run dev

# generate key (best practise: generate before migrate)
php artisan key:generate

# migrate and seed
php artisan migrate:fresh --seed

# clear cache
php artisan config:clear
php artisan route:clear
php artisan cache:clear
