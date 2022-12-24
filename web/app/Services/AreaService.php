<?php

namespace App\Services;

use App\Models\Area;

class AreaService extends BaseService
{
    /** @var Model */
    private $model;

    public function __construct(Area $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $patternId
     * @return object
     */
    public function deleteByPatternId($patternId)
    {
        $data = $this->model::where("pattern_id", $patternId);
        $data->delete();
        return $data;
    }
}
