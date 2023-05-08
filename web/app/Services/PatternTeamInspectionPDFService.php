<?php

namespace App\Services;

use App\Common\Constant;
use App\Models\Inspection;
use Illuminate\Http\Request;
use App\Models\PatternDetail;
use App\Models\Team;
use App\Models\InspectionImage;
use App\Models\InspectionDetail;
use App\Models\InspectionImageBlock;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class PatternTeamInspectionPDFService extends BaseService
{


    public function __construct()
    {
        // todo: update

    }

    /**
     * Get list by conditions
     *
     * @param  $id (id of pattern)
     *
     * @return array
     */
    public function loadContent($request)
    {
        return "";
    }


}
