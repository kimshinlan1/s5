<?php

namespace App\Services;

use App\Models\Area;
use App\Models\Pattern;
use App\Common\Constant;
use App\Models\Location;
use App\Models\Inspection;
use Illuminate\Http\Request;
use App\Models\PatternDetail;
use App\Models\InspectionImage;
use App\Models\InspectionDetail;
use App\Services\LocationService;
use Illuminate\Support\Facades\DB;

class PatternTopPageService extends BaseService
{
    /* @var Model */
    private $model;

    private $inspectionImagePath = '';

    public function __construct(PatternDetail $model)
    {
        // todo: update
        $this->model = $model;
        parent::__construct($model);
        $this->inspectionImagePath = public_path(Constant::INSPECTION_IMAGE_PATH);
    }

    /**
     * Returns inspection detail list.
     *
     * @param  teamId
     * @return array
     */
    public function getInspectionsByTeam($teamId)
    {
        $table = 'inspection';
        $sql = DB::table("$table")
        ->select([
            "$table.id as inspection_id",
            "$table.inspection_date as inspection_date",
            "$table.avg_point as avg_point",

            DB::raw("(SELECT count(inspection_images.id) FROM inspection_images
            WHERE inspection_images.inspection_id = $table.id
            ) as count_evidence")
        ])
        ->orderBy("$table.id");
        if ($teamId) {
            $sql->where('inspection.team_id', $teamId)->whereNotNull('avg_point');
        }

        return $sql->get()->toArray();
    }
}
