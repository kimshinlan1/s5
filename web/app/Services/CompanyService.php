<?php

namespace App\Services;

use App\Models\Company;
use App\Http\Requests\CompanyRequest;

class CompanyService extends BaseService
{
    /** @var Model */
    private $model;

    public function __construct(Company $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\CompanyRequest  $request
     * @return object
     */
    public function store(CompanyRequest $request)
    {
        return $this->model::create($request->all());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\CompanyRequest  $request
     * @param  int  $id
     * @return object
     */
    public function update(CompanyRequest $request, $id)
    {
        $data = $this->model::find($id);
        $data->fill($request->all());
        $data->save();
        return $data;
    }
}
