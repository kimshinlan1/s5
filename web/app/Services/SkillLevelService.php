<?php

namespace App\Services;

use App\Models\SkillLevel;
use Illuminate\Http\Request;
use App\Http\Requests\SkillLevelRequest;

class SkillLevelService extends BaseService
{
    /** @var Model */
    private $model;

    public function __construct(SkillLevel $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\SkillLevelRequest  $request
     * @return object
     */
    public function store(SkillLevelRequest $request)
    {
        return $this->model::create($request->all());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\SkillLevelRequest  $request
     * @param  int  $id
     * @return object
     */
    public function update(SkillLevelRequest $request, $id)
    {
        $data = $this->model::find($id);
        $data->fill($request->all());
        $data->save();
        return $data;
    }
}
