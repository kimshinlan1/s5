<?php

namespace App\Services;

use App\Common\Constant;
use App\Models\Area;
use App\Models\Department;
use App\Models\DeptPattern;
use App\Models\DeptPatternDetail;
use App\Models\Location;
use App\Common\Utility;
use App\Models\Company;
use App\Models\Pattern;
use Illuminate\Http\Request;
use App\Services\LocationService;
use Illuminate\Support\Facades\DB;

class PatternDeptSettingService extends BaseService
{
    /* @var Model */
    private $model;
    private $modelDetail;

    public function __construct(DeptPatternDetail $modelDetail, DeptPattern $model)
    {
        $this->model = $model;
        $this->modelDetail = $modelDetail;
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
        // todo: Update => Call from DeptPatternService, use common. If diffence, update here
        $data = $this->modelDetail::where("dept_pattern_id", $patternId);
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
        // todo: Update => Call from DeptPatternService, use common. If diffence, update here
        $sql = DB::table('dept_patterns_details')
        ->select([
            'areas.id as area_id',
            'areas.name as area_name',
            'locations.id as location_id',
            'locations.name as location_name',
            'dept_patterns_details.point as 5s',
            'dept_patterns_details.level_1 as level_1',
            'dept_patterns_details.level_2 as level_2',
            'dept_patterns_details.level_3 as level_3',
            'dept_patterns_details.level_4 as level_4',
            'dept_patterns_details.level_5 as level_5',

            DB::raw('(SELECT count(locations.id) FROM locations
            WHERE areas.id = locations.area_id) as count_locations'),

            DB::raw('(SELECT count(pd.id) FROM dept_patterns_details pd
            WHERE pd.dept_pattern_id = dept_patterns_details.dept_pattern_id
            and pd.area_id = dept_patterns_details.area_id) as area_rowspan'),

            DB::raw('(SELECT count(pd2.id) FROM dept_patterns_details pd2
            WHERE pd2.dept_pattern_id = dept_patterns_details.dept_pattern_id
            and pd2.location_id = dept_patterns_details.location_id) as location_rowspan')

        ])
        ->leftJoin('locations', 'locations.id', '=', 'dept_patterns_details.location_id')
        ->leftJoin('areas', 'areas.id', '=', 'locations.area_id')
        ->orderBy('areas.id');

        if ($id) {
            $sql->where('dept_patterns_details.dept_pattern_id', $id);
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
        // todo: Update => Call from DeptPatternService, use common. If diffence, update here
        // use:  dept_patterns, dept_patterns_details
        $data = $request->get('data');
        $companyId = $request->data['company'];
        $isUnique = $this->checkUniqueName($data['department'], $data['info']['pattern_name'], $data['info']['pattern_id']);
        if (!$isUnique) {
            return [
                'invalid' => true,
            ];
        }
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
        }

        //     // Remove Location
        //     (app()->get(LocationService::class))->deleteByAreaId($data['old_areas']);

        //     // Remove Area
        //     (app()->get(AreaService::class))->deleteByPatternId($data['info']['pattern_id']);
        // }

        if ($request->data['isSelectedFree'] == 'free') {
            $this->deleteOldDeptPattern($companyId);
        }

        // Step: Insert new pattern
        $deptPattern = $this->model::updateOrCreate(
            [
                'id' => $data['info']['pattern_id']
            ],
            [
                'company_id' => $request->data['company'],
                'name' => $data['info']['pattern_name'],
                'note' => $data['info']['pattern_note'],
                '5s' => $data['info']['pattern_5s_selected'],
                'created_at' => $data['info']['pattern_created_at'],
                'updated_at' => $data['info']['pattern_updated_at'],
            ]
        );
        if (!$data['info']['pattern_id']) {
            $no = Utility::generateUniqueId(new DeptPattern(), "no", "CKL", 5);
            $deptPattern->no = $no;
            $deptPattern->save();
        }
        $deptPatternId = $deptPattern->id;
        $dept = Department::find($request->data['department']);
        $dept->dept_pattern_id = $deptPatternId;
        $dept->save();

        // Loop to insert Areas
        foreach ($data['data'] as $area) {
            // Step: Insert new Area
            $areaId = Area::create([
                'name' => $area['area_name'],
                'dept_pattern_id' => $deptPatternId
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
                    DeptPatternDetail::create([
                        'area_id' => $areaId,
                        'dept_pattern_id' => $deptPatternId,
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

        return $deptPattern;
    }

    /**
     * Check if pattern name is unique
     *
     * @param $deptId
     * @param $patternName
     * @return boolean
     */
    public function checkUniqueName($deptId, $deptPatternName, $currentPatternId = null) {
        $compId = Department::find($deptId)->company_id;
        $dept_pattern = null;
        $deptPatternIds = Department::where('company_id', $compId)->whereNotNull('dept_pattern_id')->pluck('dept_pattern_id')->toArray();
        if (!empty($deptPatternIds)) {
            $dept_pattern = DeptPattern::whereIn('id', $deptPatternIds)->where('name', $deptPatternName)->where('id', '!=', $currentPatternId)->exists();
        }
        return $dept_pattern ? false: true;
    }

    /**
     * Save pattern full info for free User
     *
     * @param  \App\Http\Requests  $request
     * @return object
     */
    public function saveForFree(Request $request)
    {
        $patternId = $request->get('pattern_id');
        $companyId = $request->get('company_id');
        $deptPatternName = $request->get('name');
        $deptPatternId = $request->get('deptPatternId');
        $deptId = $request->get('department_id');

        $isUnique = $this->checkUniqueName($deptId, $deptPatternId);
        if (!$isUnique) {
            return [
                'invalid' => true,
            ];
        }

        $isPattern = $request->get('ispattern');
        if ($isPattern != '-1') {
            $pattern  = Pattern::find($patternId)->toArray();
            $data = (app()->get(PatternDetailService::class))->getData((int)$patternId);
        } else {
            $pattern  = DeptPattern::find($patternId)->toArray();
            $data = $this->getData((int)$patternId);
        }

        // Check if free account has dept pattern or not. Delete old dept pattern if existed
        $this->deleteOldDeptPattern($companyId);


        $pattern['id'] = null;
        $pattern['name'] = $deptPatternName;
        $pattern['company_id'] = $companyId;
        $pattern['no'] = Utility::generateUniqueId(new DeptPattern(), "no", "CKL", 5);
        $deptPattern = $this->model::create($pattern);

        $deptPatternId = $deptPattern->id;
        $dept = Department::find((int)$deptId);
        $dept->dept_pattern_id = $deptPatternId;
        $dept->save();

        // Loop to insert Areas
        $trackLocationId = -1;
        $trackAreaId = -1;
        $locationId = -1;
        foreach ($data as $area) {

            $area = json_decode(json_encode($area, true), true);
            // Step: Insert new Area
            if ($area['area_id'] != $trackAreaId) {
                $areaId = Area::create([
                    'name' => $area['area_name'],
                    'dept_pattern_id' => $deptPatternId
                ]);
                $areaId = $areaId->id;
                $trackAreaId = $area['area_id'];

            }

            // Loop to insert Locations
            if ($area['location_id'] != $trackLocationId) {
                $locationId = Location::create([
                    'name' => $area['location_name'],
                    'area_id' => $areaId
                ]);
                $trackLocationId = $area['location_id'];
                $locationId = $locationId->id;
            }
            DeptPatternDetail::create([
                'area_id' => $areaId,
                'dept_pattern_id' => $deptPatternId,
                'location_id' => $locationId,
                'point' => $area['5s'],
                'level_1' => $area['level_1'],
                'level_2' => $area['level_2'],
                'level_3' => $area['level_3'],
                'level_4' => $area['level_4'],
                'level_5' => $area['level_5'],
            ]);
        }

        return $deptPattern;
    }

    /**
     * Get list by conditions
     *
     * @param  $id
     *
     * @return array
     */
    public function getDataById($id)
    {
        return $this->model::where('id', $id)->get()->first()?->toArray();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return object
     */
    public function destroyPatternByMode($id)
    {
        $data = $this->model::find($id);
        return $data->delete();
    }

    /**
     * Remove old dept-pattern
     *
     * @param  $companyId
     *
     * @return void
     */
    public function deleteOldDeptPattern($companyId)
    {
        $depPatternIds = Department::where('company_id', $companyId)
        ->whereNotNull('dept_pattern_id')->pluck('dept_pattern_id')->toArray();
        if (count($depPatternIds)) {
            foreach ($depPatternIds as $depPatternId) {
                app()->get(PatternService::class)->destroyPatternByMode($depPatternId, null, Constant::PAGE_PATTERN_LIST_CUSTOMER);
            }
        }
    }
}
