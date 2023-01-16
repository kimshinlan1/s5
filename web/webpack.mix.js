const mix = require('laravel-mix');
const glob = require("glob");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
 mix.js('resources/js/app.js', 'public/js')
    .css('resources/css/app.css','public/css')
    .css('resources/css/skillmap.css','public/css')
    .css('resources/css/users.css','public/css')
    .css('resources/css/employee.css','public/css')
    .css('resources/css/login.css','public/css')
    .css('resources/css/my_page.css','public/css')
    .sass('resources/sass/app.scss', 'public/css')
    .css('resources/css/pattern.css','public/css')
    .css('resources/css/pattern_list_customer.css','public/css')
    .sourceMaps()
    .version();

glob.sync('resources/js/chunk/*.js').map(function(file){
    mix.copy(file, 'public/js');
});
