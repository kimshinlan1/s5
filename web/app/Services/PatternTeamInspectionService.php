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

class PatternTeamInspectionService extends BaseService
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
     * Returns pattern detail list.
     *
     * @param  id
     * @return array
     */
    public function getPatternDataByDept($deptId)
    {
        $table = 'dept_patterns_details';
        $sql = DB::table("$table")
        ->select([
            'areas.id as area_id',
            'areas.name as area_name',
            'locations.id as location_id',
            'locations.name as location_name',
            "$table.point as 5s",
            "$table.level_1 as level_1",
            "$table.level_2 as level_2",
            "$table.level_3 as level_3",
            "$table.level_4 as level_4",
            "$table.level_5 as level_5",

            DB::raw("(SELECT count(locations.id) FROM locations
            WHERE areas.id = locations.area_id) as count_locations"),

            DB::raw("(SELECT count(pd.id) FROM $table pd
            WHERE pd.dept_pattern_id = $table.dept_pattern_id
            and pd.area_id = $table.area_id) as area_rowspan"),

            DB::raw("(SELECT count(pd2.id) FROM $table pd2
            WHERE pd2.dept_pattern_id = $table.dept_pattern_id
            and pd2.location_id = $table.location_id) as location_rowspan")

        ])
        ->leftJoin('locations', 'locations.id', '=', "$table.location_id")
        ->leftJoin('areas', 'areas.id', '=', 'locations.area_id')
        ->orderBy('areas.id');

        if ($deptId) {
            $sql->join('departments', 'departments.dept_pattern_id', '=', "$table.dept_pattern_id")
                ->where('departments.id', $deptId);
        }

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
        $table = 'inspection_details';
        $sql = DB::table("$table")
        ->select([
            "$table.inspection_id as inspection_id",
            'inspection.inspection_date as inspection_date',
            'areas.id as area_id',
            "$table.location_id as location_id",
            "$table.point as 5s",
            "$table.point_value as point_value",

            DB::raw("(SELECT count(inspection_images.id) FROM inspection_images
            WHERE inspection_images.inspection_id = $table.inspection_id
            ) as count_evidence")
        ])
        ->leftJoin('inspection', 'inspection.id', '=', "$table.inspection_id")
        ->leftJoin('locations', 'locations.id', '=', "$table.location_id")
        ->leftJoin('areas', 'areas.id', '=', 'locations.area_id')
        ->orderBy('inspection.inspection_date');

        if ($teamId) {
            $sql->where('inspection.team_id', $teamId);
        }

        return $sql->get()->toArray();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $inspectionId
     * @param int $teamId
     *
     * @return \Illuminate\Http\Response
     */
    public function destroyInspections($inspectionId)
    {
        // Remove inspection
        $data = Inspection::find($inspectionId)->delete();

        // Remove Inspection details
        InspectionDetail::where('inspection_id', $inspectionId)->delete();

        // todo: Remove Inspection images
        // InspectionImage::where('inspection_id', $inspectionId)->delete();

        // todo: Remove all images on disk
        if ($data) {
            // todo: Check exists img in inspectionId (ex: public/uploads/inspections/imgs/{inspectionId}/*)
            // $this->inspectionImagePath;
        }

        return $data;
    }

    /**
     * Save data
     *
     * @param  \Illuminate\Http\Request  $request
     * @return object
     */
    public function saveInspection(Request $request)
    {
        $dataList = $request->get('data');

        // Sample
        // $data = [
        //     0 => [
        //         'info' => [
        //             'team_id' => '',
        //             'inspection_id' => '',
        //             'inspection_date' => '',
        //         ],
        //         'data' => [
        //             '1' => [ // location_id
        //                 's1' => 1,
        //                 's2' => 1,
        //                 's3' => 1
        //             ],
        //             '2' => [ // location_id
        //                 's1' => 1,
        //                 's2' => 1,
        //                 's3' => 1
        //             ],
        //         ]
        //     ]
        // ];


        /**
         * Step: Remove old data
         *
         * Loop data:
         *    Step: Insert new inspection
         *    Step: Insert new inspection_details
         *
         *    Note: array data must be created in valid structure
         *
         */

        foreach ($dataList as $data) {
            $id = is_int($data['info']['inspection_id']) ? $data['info']['inspection_id'] : null;

            // Step: todo: Remove old data
            if ($data['info']['inspection_id']) {
                // Remove inspection_details
                InspectionDetail::where('inspection_id', $data['info']['inspection_id'])->delete();

                // Note: Inspection Images doesn't need to remove
            }

            // Step: todo: Insert new
            // $inspectionDate = strtotime($data['info']['inspection_date']);
            // $inspectionDateTime = date('Y-m-d h:i:s', $inspectionDate);
            foreach ($data['data'] as $locationId => $points) {
                $inspectionId = Inspection::updateOrCreate(
                    [
                        'id' => $id
                    ],
                    [
                        'team_id' => $data['info']['team_id'],
                        'inspection_date' => $data['info']['inspection_date'],
                        'avg_point' => $points['s1']."|".$points['s2']."|".$points['s3']."|".$points['s4']."|".$points['s5'],
                    ]
                );
                $inspectionId = $inspectionId->id;
            }

            foreach ($data['data'] as $locationId => $points) {
                // Loop to insert details rows
                foreach ($points as $key => $val) {
                    InspectionDetail::create([
                        'inspection_id' => $inspectionId,
                        'location_id' => $locationId,
                        'point' => $key,
                        'point_value' => $val,
                    ]);
                }
            }
        }

        return true;
    }
}
