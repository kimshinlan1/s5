<?php

namespace App\Services;

use App\Models\Area;
use App\Models\Pattern;
use App\Common\Utility;
use App\Models\Location;
use Illuminate\Http\Request;
use App\Models\PatternDetail;
use App\Services\LocationService;
use Illuminate\Support\Facades\DB;

class PatternDetailService extends BaseService
{
    /* @var Model */
    private $model;

    public function __construct(PatternDetail $model)
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

    /**
     * Returns pattern detail list.
     *
     * @param  id
     * @return array
     */
    public function getData($id)
    {
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

        if ($id) {
            $sql->where('pattern_details.pattern_id', $id);
        }

        return $sql->get()->toArray();
    }

    /**
     * Save pattern full info
     *
     * @param  \Illuminate\Http\Request  $request
     * @return object
     */
    public function save(Request $request)
    {
        $data = $request->get('data');
        /**
         * Step: Remove old data
         *
         * Loop data:
         *    Step: Insert new pattern
         *    Step: Insert new Area
         *    Step: Inert new Location
         *    Step: Insert new pattern_detail
         *
         *    Note: array data must be created in valid structure
         *
         */

        // Step: Remove old data by pattern_id
        if ($data['info']['pattern_id']) {
            // Remove Pattern Detail
            $this->deleteByPatternId($data['info']['pattern_id']);

            // Remove Location
            (app()->get(LocationService::class))->deleteByAreaId($data['old_areas']);

            // Remove Area
            (app()->get(AreaService::class))->deleteByPatternId($data['info']['pattern_id']);
        }

        // Step: Insert new pattern
        $patternData = [
            'name' => $data['info']['pattern_name'],
            'note' => $data['info']['pattern_note'],
            '5s' => $data['info']['pattern_5s_selected'],
            'created_at' => $data['info']['pattern_created_at'],
            'updated_at' => $data['info']['pattern_updated_at'],
        ];

        if (!$data['info']['pattern_id']) {
            $no = Utility::generateUniqueId(new Pattern(), "no", "CKL", 5);
            $patternData['no'] = $no;
        }

        $patternId = Pattern::updateOrCreate(
            ['id' => $data['info']['pattern_id']],
            $patternData
        );
        $patternId = $patternId->id;

        // Loop to insert Areas
        foreach ($data['data'] as $area) {
            // Step: Insert new Area
            $areaId = Area::create([
                'name' => $area['area_name'],
                'pattern_id' => $patternId
            ]);
            $areaId = $areaId->id;

            // Loop to insert Locations
            foreach ($area['locations'] as $location) {
                // Step: Insert new location
                $locationId = Location::create([
                    'name' => $location['location_name'],
                    'area_id' => $areaId
                ]);
                $locationId = $locationId->id;

                // Loop to insert detail rows
                foreach ($location['rows'] as $key => $row) {
                    // Step: Insert new content of method
                    PatternDetail::create([
                        'area_id' => $areaId,
                        'pattern_id' => $patternId,
                        'location_id' => $locationId,
                        'point' => $key,
                        'level_1' => $row['level_1'],
                        'level_2' => $row['level_2'],
                        'level_3' => $row['level_3'],
                        'level_4' => $row['level_4'],
                        'level_5' => $row['level_5'],
                    ]);
                }
            }
        }

        return $patternId;
    }
}
