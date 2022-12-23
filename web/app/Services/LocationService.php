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
}
