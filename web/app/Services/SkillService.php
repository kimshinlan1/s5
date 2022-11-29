<?php

namespace App\Services;

use App\Models\Skill;
use Illuminate\Http\Request;
use App\Http\Requests\SkillRequest;

class SkillService extends BaseService
{
    /** @var Model */
    private $model;

    public function __construct(Skill $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\SkillRequest  $request
     * @return object
     */
    public function store(SkillRequest $request)
    {
        return $this->model::create($request->all());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\SkillRequest  $request
     * @param  int  $id
     * @return object
     */
    public function update(SkillRequest $request, $id)
    {
        $data = $this->model::find($id);
        $data->fill($request->all());
        $data->save();
        return $data;
    }
}
