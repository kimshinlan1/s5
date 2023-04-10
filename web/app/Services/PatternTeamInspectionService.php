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

class PatternTeamInspectionService extends BaseService
{
    /* @var Model */
    private $model;
    private $imageModel;
    private $imageBlockModel;

    private $inspectionImagePath = '';

    public function __construct(PatternDetail $model, InspectionImage $imageModel, InspectionImageBlock $imageBlockModel)
    {
        // todo: update
        $this->model = $model;
        $this->imageModel = $imageModel;
        $this->imageBlockModel = $imageBlockModel;
        parent::__construct($model);
        $this->inspectionImagePath = public_path(Constant::INSPECTION_IMAGE_PATH);
    }

    /**
     * Get list by conditions
     *
     * @param  $id (id of pattern)
     *
     * @return array
     */
    public function getDataTeamById($id)
    {
        return Team::where('id', $id)->get()->toArray();
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
            'inspection.uploaded_evidence_block_number as count_evidence',
            'areas.id as area_id',
            "$table.location_id as location_id",
            "$table.point as 5s",
            "$table.point_value as point_value",
        ])
        ->leftJoin('inspection', 'inspection.id', '=', "$table.inspection_id")
        ->leftJoin('locations', 'locations.id', '=', "$table.location_id")
        ->leftJoin('areas', 'areas.id', '=', 'locations.area_id')
        ->orderBy('inspection.id', 'desc');

        if ($teamId) {
            $sql->where('inspection.team_id', $teamId);
        }

        return $sql->get()->toArray();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $inspectionId
     *
     * @return \Illuminate\Http\Response
     */
    public function destroyInspections($inspectionId)
    {
        $data = Inspection::find($inspectionId);
        $blockIds = InspectionImageBlock::where("inspection_id", $inspectionId)->pluck('id')->toArray();

        if ($data) {
            // Remove redundant data
            InspectionImage::where("inspection_id", $inspectionId)->delete();
            InspectionImageBlock::whereIn("id", $blockIds)->delete();
            InspectionDetail::where("inspection_id", $inspectionId)->delete();
            // Remove redundant directories
            $path = Constant::INSPECTION_IMAGE_PATH . '/inspection' . $inspectionId;
            if (File::exists($path)) {
                File::deleteDirectory($path);
            }
            $data = $data->delete();
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
        // Get the inspection data from the request
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

        // Loop through each set of inspection data and save it
        foreach ($dataList as $data) {
            // Check if this is an update to an existing inspection
            $id = is_numeric($data['info']['inspection_id']) ? $data['info']['inspection_id'] : null;

            // Step: todo: Remove old data
            // Remove any old inspection_details associated with this inspection (if it exists)
            if ($data['info']['inspection_id']) {
                // Remove inspection_details
                InspectionDetail::where('inspection_id', $data['info']['inspection_id'])->delete();
                // Note: Inspection Images doesn't need to remove
            }

            // Step: todo: Insert new
            // $inspectionDate = strtotime($data['info']['inspection_date']);
            // $inspectionDateTime = date('Y-m-d h:i:s', $inspectionDate);
            // Save a new inspection for each location and get its ID
            foreach ($data['data']['pointAvg'] as $locationId => $points) {
                $inspectionId = Inspection::updateOrCreate(
                    [
                        'id' => $id
                    ],
                    [
                        'team_id' => $data['info']['team_id'],
                        'inspection_date' => $data['info']['inspection_date'],
                        'avg_point' => $points,
                        'uploaded_evidence_block_number' => $data['info']['count_evidence'],
                    ]
                );
                $inspectionId = $inspectionId->id;
            }

            // Save inspection_details for each location
            foreach ($data['data']['details'] as $locationId => $points) {
                // Loop through each point and save its details
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

        // Return a success status
        return true;
    }
}
