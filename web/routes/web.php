<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SkillMapController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\MyPageController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\TeamController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Login Routes
Route::get('/', [AuthController::class, 'show'])->name('login');
Route::get('/login', [AuthController::class, 'show'])->name('login');
Route::post('/login', [AuthController::class, 'authenticate'])->name('login.perform');

// For test
// Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

Route::group(['middleware' => ['auth']], function () {
    // Logout Routes
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // my_pages
    Route::get('/my_page/{id}', [MyPageController::class, 'show'])->name('my_pages.show');
    Route::put('/user/{id}', [MyPageController::class, 'update'])->name('my_pages.update');
    Route::put('/change_user_password/{id}', [MyPageController::class, 'updatePassword'])->name('change_password.update');

    // Route with middleware admin
    Route::group(['middleware' => ['role.admin', 'transaction']], function () {
        // User
        Route::resource('users', UserController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::get('users/list', [UserController::class, 'list']);
        Route::get('users/available_company_list', [UserController::class, 'listAvailableCompany']);


    });

    // Route with middleware all user
    Route::group(['middleware' => ['transaction']], function () {
        //Multiskill map detail
        Route::resource('skillmaps_detail', SkillMapController::class)->only(['index', 'update', 'destroy']);
        Route::post('/skillmaps_detail', [SkillMapController::class, 'store'])->name('skillmaps-add');
        Route::get('/skillmaps_detail/list/{id}', [SkillMapController::class, 'list']);
        Route::get('/skillmaps_detail/skill_level_list', [SkillMapController::class, 'skillLevelList']);

        // Company
        Route::resource('/company', CompanyController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::get('/company/list', [CompanyController::class, 'list']);

        //Multiskill map list
        Route::get('/skillmaps_list', [SkillMapController::class, 'indexSkillMap'])->name('skillmap_list');
        Route::get('/skillmaps_list/list', [SkillMapController::class, 'listSkillMap']);
        Route::get('/skillmaps_list/{id}', [SkillMapController::class, 'editSkillMap']);
        Route::delete('/skillmaps_list/{id}', [SkillMapController::class, 'destroySkillMap']);
        Route::get('/skillmaps_list/data/{id}', [SkillMapController::class, 'getDataSkillMap']);
        Route::post('/skillmaps_list/copy', [SkillMapController::class, 'copySkillMap']);

        // Department
        Route::resource('departments', DepartmentController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::get('departments/list', [DepartmentController::class, 'list']);
        Route::get('departments/emp_list', [DepartmentController::class, 'employeeList']);
        Route::get('/departments/comp_list', [DepartmentController::class, 'getDepartmentListByID']);

        // print pdf
        Route::post('/skillmap_pdf/html/', [PdfController::class, 'getHtmlPDF'])->name('skillmap_html');
        Route::get('/skillmap_pdf', [PdfController::class, 'exportPDF'])->name('skillmap_pdf');

        // Employee
        Route::resource('/employee', EmployeeController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::get('employee/depart_list', [EmployeeController::class, 'dataByDepartmentId']);
        Route::post('/employee/update_order', [EmployeeController::class, 'updateOrder']);

        // Team
        Route::resource('/teams', TeamController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::get('/teams/dept_list', [TeamController::class, 'dataByDepartmentId']);
    });
});
