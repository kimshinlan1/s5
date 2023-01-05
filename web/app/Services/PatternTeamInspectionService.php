<?php

namespace App\Services;

use App\Models\Area;
use App\Models\Pattern;
use App\Models\Location;
use Illuminate\Http\Request;
use App\Models\PatternDetail;
use App\Services\LocationService;
use Illuminate\Support\Facades\DB;

class PatternTeamInspectionService extends BaseService
{
    /* @var Model */
    private $model;

    public function __construct(PatternDetail $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }

    /**
     * Returns pattern detail list.
     *
     * @param  id
     * @return array
     */
    public function getPatternDataByDept($deptId)
    {
        // todo: Mockup pattern => Ok thì chuyển sang dept_pattern


        $sql = DB::table('pattern_details')
        ->select([
            'areas.id as area_id',
            'areas.name as area_name',
            'locations.id as location_id',
            'locations.name as location_name',
            'pattern_details.point as 5s',
            'pattern_details.level_1 as level_1',
            'pattern_details.level_2 as level_2',
            'pattern_details.level_3 as level_3',
            'pattern_details.level_4 as level_4',
            'pattern_details.level_5 as level_5',

            DB::raw('(SELECT count(locations.id) FROM locations
            WHERE areas.id = locations.area_id) as count_locations'),

            DB::raw('(SELECT count(pd.id) FROM pattern_details pd
            WHERE pd.pattern_id = pattern_details.pattern_id
            and pd.area_id = pattern_details.area_id) as area_rowspan'),

            DB::raw('(SELECT count(pd2.id) FROM pattern_details pd2
            WHERE pd2.pattern_id = pattern_details.pattern_id
            and pd2.location_id = pattern_details.location_id) as location_rowspan')

        ])
        ->leftJoin('locations', 'locations.id', '=', 'pattern_details.location_id')
        ->leftJoin('areas', 'areas.id', '=', 'locations.area_id')
        ->orderBy('areas.id');

        // if ($deptId) {
        //     $sql->innerJoin('departments', 'departments.dept_pattern_id', '=', 'areas.pattern_id')
        //         ->where('departments.id', $deptId);
        // }

        // Mockup
        $sql->where('pattern_details.pattern_id', $deptId);

        return $sql->get()->toArray();
    }

    /**
     * Returns inspection detail list.
     *
     * @param  teamId
     * @return array
     */
    public function getInspectionDetailsByTeam($teamId)
    {

        $sql = DB::table('inspection_details')
        ->select([
            'inspection_details.inspection_id as inspection_id',
            'inspection.inspection_date as inspection_date',
            'areas.id as area_id',
            'inspection_details.id as location_id',
            'inspection_details.point as 5s',
            'inspection_details.point_value as point_value',

            DB::raw('(SELECT count(inspection_images.id) FROM inspection_images
            WHERE inspection_images.inspections_id = inspection_details.inspections_id
            ) as count_evidence')
        ])
        ->leftJoin('inspection', 'inspection.id', '=', 'inspection_details.inspection_id')
        ->leftJoin('locations', 'locations.id', '=', 'inspection_details.location_id')
        ->leftJoin('areas', 'areas.id', '=', 'locations.area_id')
        ->orderBy('areas.id');

        if ($teamId) {
            $sql->where('inspection.teams_id', $teamId);
        }

        // Mockup
        // $sql->where('pattern_details.pattern_id', $deptId);

        return $sql->get()->toArray();
    }
}
