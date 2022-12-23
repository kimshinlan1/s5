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
}
