<?php

namespace App\Services;

use App\Models\Area;
use App\Models\Pattern;
use App\Models\Location;
use Illuminate\Http\Request;
use App\Models\PatternDetail;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\PatternDetailRequest;

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
     * Get department list by area id
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return object
     */
    public function getPatternDetailListByID(Request $request)
    {
        $limit = $request->input('limit');
        $patternDetailId = $request->input('pattern_detail_id');
        if ($patternDetailId == null) {
            return $this->model::with('pattern_detail:id,name')->paginate($limit);
        } else {
            return $this->model::where('pattern_detail_id', $patternDetailId)->with('pattern_detail:id,name')->paginate($limit);
        }
    }

    /**
     * Get pattern detail list by pattern id
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return object
     */
    public function getPatternByID(Request $request)
    {
        $limit = $request->input('limit');
        return Pattern::where('pattern_id', $patternId)->orderBy('id')->paginate($limit);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\PatternDetailRequest  $request
     * @return object
     */
    public function store(PatternDetailRequest $request)
    {
        return $this->model::create($request->all());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\PatternDetailRequest  $request
     * @param  int  $id
     * @return object
     */
    public function update(PatternDetailRequest $request, $id)
    {
        $result = null;
        $isCurrent = $this->checkCurrentData($request, $id);
        if (($this->checkExist($request) && $isCurrent) || (!$this->checkExist($request))) {
            $result = $this->model::find($id);
            $result->fill($request->all());
            $result->save();
            $result['valid'] = true;
        } else {
            $result['valid'] = false;
            $result['errors'] = trans('validation.pattern_unique');
        }
        return $result;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $patternDetailId
     * @return object
     */
    public function destroyByPatternDetail($patternDetailId)
    {
        $data = $this->model::where("pattern_detail_id", $patternDetailId);
        $data->delete();
        return $data;
    }

    /**
     * Returns pattern detail list.
     *
     * @param  id
     * @return array
     */
    public function getDataByPattern($id)
    {
        return $this->model->where('pattern_id', $id)->orderBy('id')->get()->toArray();
    }

    /**
     * Returns pattern detail list.
     *
     * @param  id
     * @return array
     */
    public function getData($id)
    {
        $sql = DB::table('areas')
        ->select([
            'areas.id as area_id',
            'areas.name as area_name',
            'locations.id as location_id',
            'locations.name as location_name',
            'pattern_details.point as 5S',
            'pattern_details.level_1 as level_1',
            'pattern_details.level_2 as level_2',
            'pattern_details.level_3 as level_3',
            'pattern_details.level_4 as level_4',
            'pattern_details.level_5 as level_5',
            DB::raw('(SELECT count(locations.id) FROM locations
            WHERE areas.id = locations.area_id) as count_locations')
        ])
        ->leftJoin('locations', 'areas.id', '=', 'locations.area_id')
        ->leftJoin('pattern_details', 'locations.id', '=', 'pattern_details.location_id');

        if ($id) {
            $sql->where('areas.pattern_id', $id);
        }

        return $sql->get()->toArray();
    }

    /**
     * Save pattern full info
     *
     * @param  \App\Http\Requests  $request
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
         */

        // todo: Check exist data
        if (!isset($data['info']) || !isset($data['data'])) {
            return;
        }

        // todo: Step: Remove old data by pattern_id



        // sample
        // $data = [
        //     'info' => [
        //         "pattern_id" => null,
        //         "pattern_name" => null,
        //         "pattern_note" => null,
        //         "pattern_5s_selected" => null,
        //         "pattern_created_at" => null,
        //         "pattern_updated_at" => null
        //     ],
        //     'data' => [
        //         0 => [
        //             'area_name' => '',
        //             'locations' => [
        //                 0 => [
        //                     'location_name' => '',
        //                     'rows' => [
        //                         's1' => [
        //                             'level_1' => '',
        //                             'level_2' => '',
        //                             'level_3' => '',
        //                             'level_4' => '',
        //                             'level_5' => ''
        //                         ],
        //                         's2' => [
        //                             'level_1' => '',
        //                             'level_2' => '',
        //                             'level_3' => '',
        //                             'level_4' => '',
        //                             'level_5' => ''
        //                         ],
        //                     ]
        //                 ]
        //             ]
        //         ]
        //     ]
        // ];


        // return $data;



        // Step: Insert new pattern
        $patternId = Pattern::create([
            'name' => $data['info']['pattern_name'],
            'note' => $data['info']['pattern_note'],
            '5s' => $data['info']['pattern_5s_selected'],
        ]);
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
