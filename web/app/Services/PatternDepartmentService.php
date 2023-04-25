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
