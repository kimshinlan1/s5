<?php

namespace App\Services;

use App\Common\Constant;
use App\Models\Employee;
use Illuminate\Http\Request;
use App\Http\Requests\EmployeeRequest;
use App\Common\Utility;
use App\Models\Company;
use App\Models\Department;

class EmployeeService extends BaseService
{
    /* @var Model */
    private $model;

    public function __construct(Employee $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }

    /**
     * Get all name
     *
     * @return array
     */
    public function getAllName($departmentId)
    {
        return $this->model::select("name")->where('department_id', $departmentId)
        ->orderBy('employee_order')->get()->toArray();
    }

    /**
     * Get number of record employee by department id.
     *
     * @return int
     */
    public function getNumberEmployee($departmentId)
    {
        return $this->model::where('department_id', $departmentId)->count();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\EmployeeRequest  $request
     *
     * @return object
     */
    public function store(EmployeeRequest $request)
    {
        $result = null;
        $employee = new Employee($request->all());
        $employee->no = Utility::generateUniqueId(new Employee(), "no", "EMPL", 5);
        $departmentId = (int)$request->get('department_id');
        $cntEmployee = $this->getNumberEmployee($departmentId);
        if ($cntEmployee >= Constant::MAX_EMP) {
            $result['valid'] = false;
        } else {
            $result['valid'] = true;
            $employee->employee_order = $this->generateNewOrder($departmentId);
            $employee->save();
        }
        return $result;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\EmployeeRequest  $request
     * @param  int  $id
     *
     * @return object
     */
    public function update(EmployeeRequest $request, $id)
    {
        $result = null;
        $data = $this->model::find($id);
        $departmentId = (int)$request->get('department_id');
        $cntEmployee = $this->getNumberEmployee($departmentId);
        if (($data['department_id'] != $departmentId) && ($cntEmployee >= Constant::MAX_EMP)) {
            $result['valid'] = false;
        } else {
            $result['valid'] = true;
            if ($data['department_id'] != $departmentId) {
                $data->employee_order = $this->generateNewOrder($departmentId);
            }
            $data->fill($request->all());
            $data->save();
        }
        return $result;
    }

    /**
     * Get list by conditions
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return object
     */
    public function getDataByTeamId(Request $request)
    {
        $teamId = $request->input('team_id');
        $deptId = $request->input('department_id');
        $compId = $request->input('company_id');
        $sql = $this->model::orderBy('employee_order');
        if ($deptId === null) {
            $deptIds = Department::select('id')->where('company_id', $compId)->orderBy('id')->get()->toArray();
            $sql = $this->model::whereIn('department_id', $deptIds)->with('team:id,name')
                ->with('department:id,name');
        } else {
            $sql = $this->model::where('department_id', $deptId)->with('department:id,name')->with('team:id,name');
            if ($teamId) {
                $sql = $sql->where('team_id', $teamId);
            }
        }
        return $sql->get()->toArray();
    }

    /**
     * Reorder rows
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return object
     */
    public function reorderRow(Request $request)
    {
        $ids = [];
        $size = count($request->all());
        $isValid = false;
        if (isset($request[0]) && isset($request[0]['department_id'])) {
            $departmentId = $request[0]['department_id'];
            for ($i = 0; $i < $size; $i++) {
                array_push($ids, $request[$i]['id']);
            }
            for ($i = 0; $i < count($ids); $i++) {
                $emp = $this->model::find($ids[$i]);
                $emp->employee_order =  $request[$i]['employee_order'];
                $emp->save();
            }
            $isValid = true;
        }

        if ($isValid) {
            return $this->model->where('department_id', $departmentId)->orderBy('employee_order')->get()->toArray();
        }
        return null;
    }

    /**
     * Get new order
     *
     * @param int $departmentId
     * @return int
     */
    protected function generateNewOrder($departmentId)
    {
        $max = $this->model::where('department_id', $departmentId)->max('employee_order');
        return $max ? $max + 1 : 0;
    }

    /**
     * Get company list for dropdown list
     *
     * @param null
     * @return array
     */
    public function getCompanyList()
    {
        return Company::orderBy('id')->get()->toArray();
    }
}
