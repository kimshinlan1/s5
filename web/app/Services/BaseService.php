<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;

class BaseService
{
    /** @var Model */
    private $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * index
     *
     * @return array
     */
    public function getAll()
    {
        return $this->model::orderBy('id')->get();
    }

    /**
     * Get list by conditions
     *
     * @param  \Illuminate\Http\Request  $request
     * @return object
     */
    public function getList(Request $request)
    {
        $limit = $request->input('limit');
        return $this->model::orderBy('id')->paginate($limit);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return object
     */
    public function destroy($id)
    {
        $data = $this->model::find($id);
        $data->delete();
        return $data;
    }
}
