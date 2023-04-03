<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Department;
use Illuminate\Http\Request;
use App\Http\Requests\DepartmentRequest;
use App\Common\Utility;
use App\Models\Team;

class DepartmentService extends BaseService
{
    /* @var Model */
    private $model;

    public function __construct(Department $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }

    /**
     * Get department list by company id
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return object
     */
    public function getDepartmentListByID(Request $request)
    {
        $limit = $request->input('limit');
        $companyId = $request->input('company_id');
        if ($companyId == null) {
            return $this->model::with('company:id,name')->orderBy('company_id')->paginate($limit);
        } else {
            return $this->model::where('company_id', $companyId)->with('company:id,name')->paginate($limit);
        }
    }

    /**
     * Get department list by company id
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return object
     */
    public function getDepartmentByID(Request $request)
    {
        $companyId = auth()->user()->company()->first()->id;
        $limit = $request->input('limit');
        return Department::where('company_id', $companyId)->orderBy('id')->paginate($limit);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\DepartmentRequest  $request
     * @return object
     */
    public function store(DepartmentRequest $request)
    {
        $result = null;
        if (!$this->checkExist($request)) {
            $newNo = Utility::generateUniqueId(new Department(), "no", "DEPT", 5);
            $request['no'] = $newNo;
            $result = $this->model::create($request->all());
            $result['valid'] = true;
        } else {
            $result['valid'] = false;
            $result['errors'] = trans('validation.department_unique');
        }
        return $result;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\DepartmentRequest  $request
     * @param  int  $id
     * @return object
     */
    public function update(DepartmentRequest $request, $id)
    {
        $result = null;
        $isCurrent = $this->checkCurrentData($request, $id);
        if (($this->checkExist($request) && $isCurrent) || (!$this->checkExist($request))) {
            $result = $this->model::find($id);
            $result->fill($request->all());
            $result->save();
            $result['valid'] = true;
        } else {
            $result['valid'] = false;
            $result['errors'] = trans('validation.department_unique');
        }
        return $result;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $companyId
     * @return object
     */
    public function destroyByCompany($companyId)
    {
        $deptIds = Team::where('company_id', $companyId)->pluck('id')->toArray();
        foreach ($deptIds as $deptId) {
            $this->destroyDepartmentAndRelatedData($deptId);
        }
        $data = $this->model::where("company_id", $companyId);
        $data->delete();
        return $data;
    }

    /**
     * Get list by conditions
     *
     * @param  \Illuminate\Http\Request  $request
     * @return object
     */
    public function getEmployeeList(Request $request)
    {
        $departmentId = $request->input('department_id');
        return Employee::where('department_id', $departmentId)->orderBy('employee_order')->get();
    }

    /**
     * Check Exist data
     *
     * @param Request $request
     * @return object
     */
    public function checkExist(Request $request)
    {
        $name = $request->get('name');
        $companyId = $request->get('company_id');
        return Department::where('company_id', $companyId)->where('name', $name)->exists();
    }

    /**
     * Check current data
     *
     * @param Request $request
     * @return object
     */
    public function checkCurrentData(Request $request, $id)
    {
        $data = $this->model::find($id);
        $name = ($data && isset($data['name'])) ? $data['name'] : "";
        if ($name == $request->get('name')) {
            return true;
        }
        return false;
    }

    /**
     * Returns department list.
     *
     * @param  id
     * @return array
     */
    public function getDataByCompany($id)
    {
        return $this->model->where('company_id', $id)->orderBy('id')->get()->toArray();
    }

    /**
     * Returns department object.
     *
     * @param  id
     * @return object
     */
    public function getDeptBtId($id)
    {
        return $this->model->where('id', $id)->get();
    }

    /**
     * Unbind deptpattern from department
     *
     * @param  id
     * @return object
     */
    public function unbindDeptPatternFromDept(Request $request)
    {
        $id = $request->get('id');
        parent::removeRedundantDataById($id);
        $data = $this->model::find($id);
        $data->dept_pattern_id = null;
        return $data->save();
    }

    /**
     * Unbind department from deptpattern
     *
     * @param  id
     * @return object
     */
    public function unbindDeptFromDeptPattern($deptId)
    {
        $data = $this->model::find($deptId);
        parent::removeRedundantDataById($deptId);
        $data->dept_pattern_id = null;
        return $data->save();
    }

    /**
     * Bind deptpattern from department
     *
     * @param  id
     * @return object
     */
    public function bindDeptPatternFromDept(Request $request)
    {
        $id = $request->get('id');
        $patternId = $request->get('pattern_id');

        $unbindOldData = $this->unbindDeptPatternFromDept($request);
        if (empty($unbindOldData)) {
            return [
                'invalid' => true,
            ];
        }

        $data = $this->model::find($id);
        if ($data) {
            $data->dept_pattern_id =  $patternId;
        } else {
            return [
                'invalid' => true,
            ];
        }

        return $data->save();
    }

    /**
     * Bind deptpattern from department
     *
     * @param  id
     * @return object
     */
    public function changeDeptFromDeptPattern($deptId, $oldDeptId, $deptPatternId)
    {
        if ($oldDeptId) {
            $unbindOldDeptData = $this->unbindDeptFromDeptPattern($oldDeptId);
        }
        $unbindOldData = $this->unbindDeptFromDeptPattern($deptId);

        $data = $this->model::find($deptId);
        if ($data) {
            $data->dept_pattern_id =  $deptPatternId;
        } else {
            return [
                'invalid' => true,
            ];
        }

        return $data->save();
    }

    /**
     * Returns department list with full information.
     *
     * @param int companyId
     * @return array
     */
    public function getFullDataByCompanyId($companyId)
    {
        return $this->model->where('company_id', $companyId)
        ->with('company:id,name')
        ->with('teams:department_id,id,no,name')
        ->orderBy('id')->get()->toArray();
    }

     /**
     * Get list by conditions
     *
     * @param  \Illuminate\Http\Request  $request
     * @return object
     */
    public function checkDataDeptPattern(Request $request)
    {
        $departmentId = $request->input('department_id');
        return $this->model->where('id', $departmentId)->orderBy('dept_pattern_id')->first();
    }

     /**
     * Remove the specified resource from storage.
     *
     * @param $id department id
     * @return object
     */
    public function destroyDepartmentAndRelatedData($id)
    {
        $teamIds = Team::where('department_id', $id)->pluck('id')->toArray();

        foreach ($teamIds as $teamId) {
            (app()->get(TeamService::class))->destroyTeamAndRelatedData($teamId);
        }
        $data = $this->model::find($id);
        $data->delete();
        return $data;
    }
}
