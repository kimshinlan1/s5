<?php

namespace App\Http\Controllers;

use App\Common\Constant;
use Illuminate\Http\Request;
use App\Services\EmployeeService;
use App\Http\Requests\DepartmentRequest;
use App\Models\User;
use App\Services\PatternDepartmentService;

class PatternDepartmentController extends Controller
{
    /* @var departmentservice */
    private $service;

    /* @var EmployeeService */
    private $serviceEmployee;

    public function __construct(PatternDepartmentService $service)
    {
        $this->service = $service;
        $this->serviceEmployee = app(EmployeeService::class);
        $this->user = app(User::class);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('pattern.pattern_departments');
    }

    /**
     * Returns department list.
     *
     * @param  id
     * @return array
     */
    public function getByCompany($id)
    {
        return $this->service->getDataByCompany($id);
    }

    /**
     * Returns department.
     *
     * @param  id
     * @return object
     */
    public function getDept($id)
    {
        return $this->service->getDeptBtId($id);
    }
}
