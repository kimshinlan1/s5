<?php

namespace App\Services;

use App\Common\Constant;
use App\Models\Area;
use App\Models\Department;
use App\Models\DeptPattern;
use App\Models\DeptPatternDetail;
use App\Models\Location;
use App\Common\Utility;
use App\Models\Inspection;
use App\Models\InspectionDetail;
use App\Models\Pattern;
use App\Models\Team;
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
    public function deleteDetailsByPatternId($patternId)
    {
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
        $data = $request->get('data');
        $changeDeptCase = $data['changeDeptCase'];
        $initDeptId = $data['initDeptId'];
        $companyId = $request->data['company'];
        $patternName = $data['info']['pattern_name'];
        $patternId = $data['info']['pattern_id'];

        // Check if free account has dept pattern or not. Delete old dept pattern if existed
        if ($request->data['isSelectedFree'] == 'free') {
            $this->deleteOldDeptPattern($companyId);
        }
        // Check dept pattern name is unique within its department
        $isUnique = $this->checkUniqueName($data['company'], $patternName, $patternId);
        if (!$isUnique) {
            return [
                'invalid' => true,
            ];
        }

        // Step: Create data for new pattern
        $patternData = [
            'company_id' => $request->data['company'],
            'name' => $patternName,
            'note' => $data['info']['pattern_note'],
            '5s' => $data['info']['pattern_5s_selected'],
            'created_at' => $data['info']['pattern_created_at'],
            'updated_at' => $data['info']['pattern_updated_at'],
        ];

        // Step: Remove old data by pattern_id
        if ($patternId) {
            // Remove Pattern Detail
            $this->deleteDetailsByPatternId($patternId);
            $no = 'CKL' . str_pad($patternId, 5, '0', STR_PAD_LEFT);
            $patternData['no'] = $no;
        } else {
            parent::removeRedundantDataById($data['department']);
            $no = Utility::generateUniqueId(new DeptPattern(), "no", "CKL", 5);
            $patternData['no'] = $no;
        }

        // Step: Insert data to the pattern
        $deptPattern = $this->model::updateOrCreate(
            ['id' => $patternId],
            $patternData
        );
        $deptPatternId = $deptPattern->id;

        // Update dept pattern in departments table
        if (isset($data['department'])) {
            $dept = Department::find($data['department']);
            $dept->dept_pattern_id = $deptPatternId;
            $dept->save();
        }

        // Note: default $changeDeptCase equals 0 -> do nothing
        if ($changeDeptCase == 1) {
            // changeDeptCase equals 1 -> Unbind department from the dept pattern
            (app()->get(DepartmentService::class))->unbindDeptFromDeptPattern($initDeptId);
        } elseif ($changeDeptCase == 2) {
            // changeDeptCase equals 2 -> replace the link between the department, pattern with another department.
            (app()->get(DepartmentService::class))
            ->changeDeptFromDeptPattern($data['department'], $initDeptId, $patternId);
        }

        // Loop to insert Areas
        $this->insertAreaData($data['data'], $patternId, $deptPatternId);

        /*
        * DELETE REDUNDANT DATA
        * Steps:
        *  Check if any area is removed, remove its redundant data
        *  Then comes to remaining areas, check if any location in each is removed, remove its redundant data
        *  Then comes to remaining locations, check if any 5s points in each is removed, remove its redundant data
        */
        if (array_key_exists('initAreaArray', $request->get('data'))) {
            $afterData = $request->get('data')['data'];
            $initData = $request->get('data')['initAreaArray'];
            $removeRedundantData = $this->removeRedundantData($afterData, $initData);
            /*
            * Precondition: Check if the link between department and dept pattern still remains
            * and the proccess of redundant data removal completed
            * Action: recalculate the average point in inspections table
            */
            if ($changeDeptCase == '0' && $initDeptId && $removeRedundantData) {
                $this->calculateAvgPoint($initDeptId);
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
    public function checkUniqueName($compId, $deptPatternName, $currentPatternId = null)
    {
        if (!$compId) {
            $compId = auth()->user()->company()->first()->id;
        }

        $deptPattern = DeptPattern::where('company_id', $compId)
        ->where('name', $deptPatternName)->where('id', '!=', $currentPatternId)->exists();

        return $deptPattern ? false: true;
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
        $deptPatternNote = $request->get('note');
        $deptPatternId = $request->get('deptPatternId');
        $deptId = $request->get('department_id');
        $createdDate = $request->get('pattern_created_at');
        $updatedDate = $request->get('pattern_updated_at');
        $selected5s = $request->get('pattern_5s_selected');

        $isUnique = $this->checkUniqueName($deptId, $deptPatternName, $deptPatternId);
        if (!$isUnique) {
            return [
                'invalid' => true,
            ];
        }

        $isPattern = $request->get('ispattern');
        if ($isPattern != '-1') {
            $pattern  = Pattern::find($patternId)->toArray();
            $data = (app()->get(PatternDetailService::class))->getData((int)$patternId);
            parent::removeRedundantDataById($deptId);
        } else {
            $pattern  = DeptPattern::find($patternId)->toArray();
            $data = $this->getData((int)$patternId);
            parent::removeRedundantDataById($deptId);
        }

        // Check if free account has dept pattern or not. Delete old dept pattern if existed
        $this->deleteOldDeptPattern($companyId);

        $pattern['id'] = null;
        $pattern['name'] = $deptPatternName;
        $pattern['note'] = $deptPatternNote;
        $pattern['company_id'] = $companyId;
        $pattern['no'] = Utility::generateUniqueId(new DeptPattern(), "no", "CKL", 5);
        $pattern['5s'] = $selected5s;
        $pattern['created_at'] = $createdDate;
        $pattern['updated_at'] = $updatedDate;
        $deptPattern = $this->model::create($pattern);

        // Replace old dept pattern to new dept pattern in department
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
                app()->get(PatternService::class)
                ->destroyPatternByMode($depPatternId, Constant::PAGE_PATTERN_LIST_CUSTOMER);
            }
        }
    }

    /**
     * Check the data used for evaluation
     *
     * @param  $id departmentId
     *
     * @return void
     */
    public function checkDataUsed($id)
    {
        $checkDataUsed = Department::where('department_id', $id)
        ->join('teams', 'teams.department_id', '=', 'departments.id')
        ->join('inspection', 'inspection.team_id', '=', 'teams.id')
        ->get();
        return [
            'isCheckData' => $checkDataUsed,
        ];
    }

    /**
      * Check if data is linked or not
      *
      * @param \App\Http\Requests $request
      *
      * @return \Illuminate\Http\Response
    */
    public function checkBindingData(Request $request)
    {
        $deptId = $request->get('deptId');
        $patternId = $request->get('patternId');
        $isLinkedDept = Department::where('id', $deptId)->whereNotNull('dept_pattern_id')->count();
        $isLinkedPatttern = Department::where('dept_pattern_id', $patternId)->exists();

        return $isLinkedDept > 0 || $isLinkedPatttern;
    }

    /**
     * Calculate avg point
     *
     * @param  $id departmentId
     *
     * @return void
     */
    public function calculateAvgPoint($deptId)
    {
        $teamIds = Team::where('department_id', $deptId)->distinct()->pluck('id')->toArray();
        $inspectionIds = Inspection::whereIn("team_id", $teamIds)->pluck('id')->toArray();
        foreach ($inspectionIds as $inspectionId) {
            $avgPoint = [];
            for ($i=1; $i <=5; $i++) {
                $avg = InspectionDetail::where('inspection_id', $inspectionId)
                ->where('point', 's'.$i)->avg('point_value');
                if ($avg) {
                    $avgPoint[] = round($avg, 1);
                } else {
                    $avgPoint[] = 0;
                }
            }
            $avgStr = implode('|', $avgPoint);
            $inspection = Inspection::find($inspectionId);
            $inspection->avg_point = $avgStr;
            $inspection->save();
        }
    }

    /**
     * Remove redundant data when delete area
     *
     * @param  $id departmentId
     *
     * @return void
     */
    private function removeRedundantData($afterData, $initData)
    {
        $afterAreaIds = array_column($afterData, 'area_id');
        $initAreaIds = array_column($initData, 'area_id');

        // Check if any area is removed and get its id
        $deleledAreaIds = array_diff($initAreaIds, $afterAreaIds);

        // In case that there is any area is deleted

        foreach ($deleledAreaIds as $deleledAreaId) {
            // Remove redundant data in dept pattern detail
            $this->modelDetail->where('dept_pattern_id', $deleledAreaId)->delete();
            // Get location ids
            $locationIds = DB::table('locations')
            ->where('area_id', intval($deleledAreaId))
            ->pluck('id')->toArray();
            if (count(array_diff($initAreaIds, $deleledAreaIds)) == 0) {
                $inspectionIdArr = InspectionDetail::whereIn('location_id', $locationIds)->distinct()
                ->pluck('inspection_id')->toArray();
                Inspection::whereIn('id', $inspectionIdArr)->delete();
            }
            // Remove redundant data in inspection detail
            InspectionDetail::whereIn('location_id', $locationIds)->delete();
            // Remove data in locations
            (app()->get(LocationService::class))->deleteByAreaId($deleledAreaId);
            // Remove data in areas
            (app()->get(AreaService::class))->destroy($deleledAreaId);
        }

        // Get area id array that is not removed
        $remainAreaIds = array_intersect($initAreaIds, $afterAreaIds);

        // For area id array that is not removed, Check if there is any locations being removed
        if ($remainAreaIds) {
            foreach ($remainAreaIds as $remainAreaId) {
                $afterLocations = array_shift($afterData)['locations'];
                $afterLocationIds =  array_column($afterLocations, 'location_id');

                $selectedLocations = array_filter($initData, function ($val) use ($remainAreaId) {
                    return $val['area_id'] == $remainAreaId;
                });
                $selectedLocations = array_shift($selectedLocations)['locations'];
                $selectedLocationIds = array_column($selectedLocations, 'location_id');

                // Check if any location is removed and get its id
                $deleledLocationsIds = array_diff($selectedLocationIds, $afterLocationIds);

                if ($deleledLocationsIds) {
                    // Remove redundant location_id and point data in inspection detail
                    InspectionDetail::whereIn('location_id', $deleledLocationsIds)->delete();
                    // Remove data in locations
                    (app()->get(LocationService::class))->deleteByLocationIdArr($deleledLocationsIds);
                }
                // Get location id array that is not removed
                $remainLocations = array_intersect($selectedLocationIds, $afterLocationIds);

                foreach ($remainLocations as $remainLocation) {
                    $targetLocation = array_filter($selectedLocations, function ($val) use ($remainLocation) {
                        return $val['location_id'] == $remainLocation;
                    });
                    $targetAfterLocation = array_filter($afterLocations, function ($val) use ($remainLocation) {
                        return $val['location_id'] == $remainLocation;
                    });
                    $initRows = array_shift($targetLocation)['rows'];
                    $initRows = array_keys($initRows);
                    $afterRows = array_shift($targetAfterLocation)['rows'];
                    $afterRows = array_keys($afterRows);

                    // Check if any 5s point is removed and get its value
                    $deletedRows = array_diff($initRows, $afterRows);

                    // Remove redundant point data in inspection detail
                    if (count($deletedRows) > 0) {
                        InspectionDetail::where('location_id', $remainLocation)
                        ->whereIn('point', $deletedRows)->delete();
                    }
                }
            }
        }

        return true;
    }

    /**
     * Insert area data to dept pattern
     *
     * @param  $id departmentId
     *
     * @return void
     */
    private function insertAreaData($areaIds, $patternId, $deptPatternId)
    {
        foreach ($areaIds as $area) {
            // Step: Insert new Area
            $areaId = null;
            if (($patternId) && (isset($area['area_id']) && is_numeric($area['area_id']))) {
                $areaId = $area['area_id'];
                Area::updateOrCreate(
                    [
                        'id' => $areaId,
                    ],
                    [
                        'name' => $area['area_name'],
                        'dept_pattern_id' => $deptPatternId
                    ]
                );
            } else {
                $newArea = Area::create([
                    'name' => $area['area_name'],
                    'dept_pattern_id' => $deptPatternId
                ]);
                $areaId = $newArea->id;
            }

            // Loop to insert Locations
            foreach ($area['locations'] as $location) {
                // Step: Insert new location
                $locationId = null;
                if (($patternId) && (isset($location['location_id'])
                && is_numeric($location['location_id']))) {
                    $locationId = $location['location_id'];
                    Location::updateOrCreate(
                        [
                            'id' => $locationId,
                        ],
                        [
                            'name' => $location['location_name'],
                            'area_id' => $areaId
                        ]
                    );
                } else {
                    $newLocation = Location::create([
                        'name' => $location['location_name'],
                        'area_id' => $areaId
                    ]);
                    $locationId = $newLocation->id;
                }

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
    }
}
