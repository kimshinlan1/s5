# Config snappy
echo Setting Snappy

# copy to usr/local/bin for snappy
cp vendor/h4cc/wkhtmltoimage-amd64/bin/wkhtmltoimage-amd64 /usr/local/bin/
cp vendor/h4cc/wkhtmltopdf-amd64/bin/wkhtmltopdf-amd64 /usr/local/bin/
chmod +x /usr/local/bin/wkhtmltoimage-amd64
chmod +x /usr/local/bin/wkhtmltopdf-amd64

# clear cache
php artisan config:clear
php artisan route:clear
php artisan cache:clear
