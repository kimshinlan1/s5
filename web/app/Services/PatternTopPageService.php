<?php

namespace App\Services;

use App\Models\Area;
use App\Models\Pattern;
use App\Common\Constant;
use App\Models\Department;
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
            "$table.uploaded_evidence_block_number as count_evidence",
        ])
        ->orderBy("$table.id", 'desc');
        if ($teamId) {
            $sql->where('inspection.team_id', $teamId)->whereNotNull('avg_point')->whereNotNull('inspection_date');
        }

        return $sql->take(3)->get()->toArray();
    }

    /**
      * Check if data is linked or not
      *
      * @param \App\Http\Requests $request
      *
      * @return \Illuminate\Http\Response
    */
    public function checkDeptExist(Request $request)
    {
        $compId = $request->get('compId');
        $isDeptExist = Department::where('company_id', $compId)->exists();

        return $isDeptExist;
    }
}
