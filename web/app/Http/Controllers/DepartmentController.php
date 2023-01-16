<?php

namespace App\Http\Controllers;

use App\Common\Constant;
use Illuminate\Http\Request;
use App\Services\DepartmentService;
use App\Services\EmployeeService;
use App\Http\Requests\DepartmentRequest;
use App\Models\User;

class DepartmentController extends Controller
{
    /* @var departmentservice */
    private $service;

    /* @var EmployeeService */
    private $serviceEmployee;

    public function __construct(DepartmentService $service)
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
        return view('departments.index');
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
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\DepartmentRequest $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(DepartmentRequest $request)
    {
        try {
            $data = $this->service->store($request);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\DepartmentRequest  $request
     * @param int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function update(DepartmentRequest $request, $id)
    {
        try {
            $data = $this->service->update($request, $id);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $data = $this->service->destroy($id);
            return response()->json($data);
        } catch (\Throwable $th) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }

    /**
     * Returns resource as a list.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function employeeList(Request $request)
    {
        $data = $this->service->getEmployeeList($request);
        return response()->json([
            'total' => $data->count(),
            'rows' => $data->toArray()
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

    /**
     * Unbind deptpattern from department
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function unbindDeptPattern(Request $request)
    {
        $data = $this->service->unbindDeptPatternFromDept($request);
        return response()->json($data);
    }

    /**
     * Bind deptpattern from department
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function bindDeptPattern(Request $request)
    {
        $data = $this->service->bindDeptPatternFromDept($request);
        if (!$data) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['DUPLICATED_PATTERN'])
            ], 500);
        }
        return response()->json($data);
    }
}
