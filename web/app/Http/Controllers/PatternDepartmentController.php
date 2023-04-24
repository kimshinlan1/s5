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
     * Returns resource as a list.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function list(Request $request)
    {
        if ($this->user->isAdmin()) {
            $data = $this->service->getList($request);
        } else {
            $data = $this->service->getDepartmentByID($request);
        }
        $arrDepartment = $this->getFinalList($data->getCollection());
        return response()->json([
            'total' => $data->total(),
            'rows' => $arrDepartment,
            'currentCompany' => auth()->user()->company()->first()
        ]);
    }

    /**
     * Returns resource as a  department list.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function getDepartmentListByID(Request $request)
    {
        $data = $this->service->getDepartmentListByID($request);
        $arrDepartment = $this->getFinalList($data->getCollection());
        return response()->json([
            'total' => $data->total(),
            'rows' => $arrDepartment
        ]);
    }

    /**
     * Returns final list.
     *
     * @param  obj  $arr
     * @return Array
     */
    public function getFinalList($arr)
    {
        foreach ($arr as $key => $item) {
            $cntEmployees = $this->serviceEmployee->getNumberEmployee($item['id']);
            $arr[$key]['employee_cnt'] = $cntEmployees;
        }
        return $arr;
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
