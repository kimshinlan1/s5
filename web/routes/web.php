<?php

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MyPageController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\PatternController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\SkillMapController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PatternListController;
use App\Http\Controllers\PatternDetailController;
use App\Http\Controllers\PatternTopPageController;
use App\Http\Controllers\PatternDeptSettingController;
use App\Http\Controllers\PatternTeamInspectionController;
use App\Http\Controllers\TopPageController;

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

        //Pattern detail
        Route::get('/pattern_detail', [PatternDetailController::class, 'index']);
        Route::get('/pattern_detail/{id}', [PatternDetailController::class, 'edit']);
        Route::post('/pattern_save', [PatternDetailController::class, 'savePattern']);

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
        Route::get('/company/get_companies', [CompanyController::class, 'getAll']);

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
        Route::get('departments/list/{id}', [DepartmentController::class, 'getByCompany']);
        Route::get('/departments/getDepartment/{id}', [DepartmentController::class, 'getDept']);
        Route::get('departments/emp_list', [DepartmentController::class, 'employeeList']);
        Route::get('/departments/comp_list', [DepartmentController::class, 'getDepartmentListByID']);
        Route::post('/departments/unbind_deptpattern', [DepartmentController::class, 'unbindDeptPattern']);
        Route::post('/departments/bind_deptpattern', [DepartmentController::class, 'bindDeptPattern']);

        // print pdf
        Route::post('/skillmap_pdf/html/', [PdfController::class, 'getHtmlPDF'])->name('skillmap_html');
        Route::get('/skillmap_pdf', [PdfController::class, 'exportPDF'])->name('skillmap_pdf');

        // Employee
        Route::resource('/employee', EmployeeController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::get('employee/depart_list', [EmployeeController::class, 'dataByDepartmentId']);
        Route::get('employee/team_id', [EmployeeController::class, 'getDataByTeamId']);
        Route::post('/employee/update_order', [EmployeeController::class, 'updateOrder']);

        // Team
        Route::resource('/teams', TeamController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::get('/teams/comp_list', [TeamController::class, 'getListCompanyId']);
        Route::get('/teams/dept_list', [TeamController::class, 'getTeamByDepartmentId']);
        Route::get('/teams/dept_id', [TeamController::class, 'getTeamsByDepartmentId']);
        Route::get('teams/list', [TeamController::class, 'list']);

        // Pattern_list
        Route::resource('/pattern_list', PatternController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::get('pattern_list/data', [PatternController::class, 'list']);

        // Pattern_List_Customer
        Route::get('/pattern_list_customer', [PatternController::class, 'indexCustomer']);
        Route::get('/pattern_list/patern_list_by_company', [PatternController::class, 'getPatternByCompanyId']);
        Route::get('/pattern_list/getlist_by_department/{id}', [PatternController::class, 'listPattern']);
        Route::get('/pattern_list/check_pattern_exist/{id}', [PatternController::class, 'checkDeptPatternExist']);

        // Dept pattern setting
        Route::resource('/pattern_dept_setting', PatternDeptSettingController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::get('/pattern_dept_setting/{id}', [PatternDeptSettingController::class, 'edit']);
        Route::post('/pattern_dept_setting/save', [PatternDeptSettingController::class, 'saveDeptPattern']);
        Route::post('/pattern_dept_setting/freeUserSave', [PatternDeptSettingController::class, 'saveDeptPatternForFree']);
        Route::get('/pattern_dept_setting_generate_area', [PatternDeptSettingController::class, 'generateAreaHtml']);

        // Pattern detail (all users)
        Route::get('/pattern_detail_generate_area', [PatternDetailController::class, 'generateAreaHtml']);
        Route::post('/pattern_detail_remove', [PatternDetailController::class, 'removeLocation']);

        // Pattern preview
        Route::get('/pattern_preview/{id}', [PatternController::class, 'preview']);
        Route::get('/pattern_preview_generate_area', [PatternController::class, 'generateAreaHtml']);

        // Team inspection by pattern
        Route::get('/pattern_team_inspection', [PatternTeamInspectionController::class, 'index']);
        Route::get('/pattern_team_inspection/data', [PatternTeamInspectionController::class, 'generateDataHtml']);
        Route::get('/pattern_team_inspection/evidence', [PatternTeamInspectionController::class, 'getEvidence']);
        Route::get('/pattern_team_inspection/{id}', [PatternTeamInspectionController::class, 'edit']);
        Route::post('/pattern_team_inspection/save', [PatternTeamInspectionController::class, 'saveInspection']);
        Route::delete('/pattern_team_inspection/destroy/{id}', [PatternTeamInspectionController::class, 'destroy']);
        Route::get('/pattern_team_inspection/evidence/addblock', [PatternTeamInspectionController::class, 'addBlock']);

        // Pattern top page
        Route::get('/pattern_top_page', [PatternTopPageController::class, 'index']);

        Route::get('/pattern_top_page/load', [PatternTopPageController::class, 'generateDataHtml']);

        // Top page
        Route::get('/top_page', [TopPageController::class, 'index']);

        // Show log
        Route::get('/show_log', [Controller::class, 'showLog']);
    });
});
