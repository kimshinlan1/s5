<?php

namespace App\Services;

use App\Models\Department;
use Illuminate\Http\Request;

class PatternDepartmentService extends BaseService
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
}
