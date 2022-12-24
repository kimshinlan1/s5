<?php

namespace App\Services;

use App\Models\Location;

class LocationService extends BaseService
{
    /** @var Model */
    private $model;

    public function __construct(Location $model)
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
    public function deleteByAreaId($areaId)
    {
        $data = $this->model::where("area_id", $areaId);
        $data->delete();
        return $data;
    }
}
