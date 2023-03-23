<?php

namespace App\Services;

use App\Models\Team;
use Illuminate\Http\Request;
use App\Http\Requests\TeamRequest;
use App\Common\Utility;
use App\Models\Department;
use App\Models\Employee;

class TeamService extends BaseService
{
    /* @var Model */
    private $model;
    private $modelDepartment;

    public function __construct(Team $model, Department $modelDepartment)
    {
        $this->model = $model;
        $this->modelDepartment = $modelDepartment;
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
        ->orderBy('id')->get()->toArray();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\TeamRequest  $request
     *
     * @return object
     */
    public function store(TeamRequest $request)
    {
        $result = null;
        $team = new Team($request->all());
        $team->no = Utility::generateUniqueId(new Team(), "no", "TEAM", 5);
        $result['valid'] = true;
        $team->save();
        return $result;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\TeamRequest  $request
     * @param  int  $id
     * @return object
     */
    public function update(TeamRequest $request, $id)
    {
        $data = $this->model::find($id);
        $data->fill($request->all());
        $data->save();
        return $data;
    }

    /**
     * Get list by conditions
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return object
     */
    public function getListCompanyId(Request $request)
    {
        $companyId = (int)$request->input('company_id');
        if ($companyId == -1) {
            return $this->modelDepartment::orderBy('id')->get()->toArray();
        } else {
            return $this->modelDepartment::where('company_id', $companyId)
            ->orderBy('id')->get()->toArray();
        }
    }

    /**
     * Get list by conditions
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return object
     */
    public function getTeamByDepartmentId(Request $request)
    {
        $departmentId = $request->input('department_id');
        $limit = $request->input('limit');
        if ($departmentId == -1) {
            //get from company id
            $arrDeptIds = $request->input('department_ids');
            return $this->model::whereIn('department_id', $arrDeptIds)
            ->with('department:id,name')->orderBy('id')->paginate($limit);
        } else {
            return $this->model::where('department_id', $departmentId)->with('department:id,name')
            ->orderBy('id')->paginate($limit);
        }
    }

    /**
     * Get list by conditions
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return array
     */
    public function getTeamArrayByDepartmentId(Request $request)
    {
        $departmentId = $request->input('department_id');
        return $this->model::where('department_id', $departmentId)->with('department:id,name')
        ->orderBy('id')->get()->toArray();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  $id teamid
     * @return object
     */
    public function destroyTeam($id)
    {
        $employeeIds = Employee::where('team_id', $id)->pluck('id')->toArray();
        parent::removeRedundantDataById(null, $id);
        Employee::whereIn('id', $employeeIds)->delete();
        $data = $this->model::find($id);
        $data->delete();
        return $data;
    }
}
