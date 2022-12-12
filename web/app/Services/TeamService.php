<?php

namespace App\Services;

use App\Models\Team;
use Illuminate\Http\Request;
use App\Http\Requests\TeamRequest;
use App\Common\Utility;
use App\Models\Department;

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
        $team->no = Utility::generateUniqueId(new Team(), "no", "TE", 5);
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
    public function getDepartmentByCompanyId(Request $request)
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
    public function getDataTableTeamById(Request $request)
    {
        $departmentId = $request->input('department_id');
        if ($departmentId == -1) {
            return $this->model::with('department:id,name')->orderBy('id')->get()->toArray();
        } else {
            return $this->model::where('department_id', $departmentId)->with('department:id,name')
            ->orderBy('id')->get()->toArray();
        }
    }
}
