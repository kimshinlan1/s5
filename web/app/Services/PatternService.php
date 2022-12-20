<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\Skill;
use App\Models\Category;
use App\Models\Pattern;
use Illuminate\Http\Request;
use App\Models\SkillEmployee;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\QueryException;

class PatternService extends BaseService
{
    /** @var Model */
    private $model;

    private $keyUserId = 'skillmaps.user_id';

    public function __construct(Pattern $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }

    /**
     * Get list by conditions
     *
     * @param  \Illuminate\Http\Request  $request
     * @return object
     */
    public function list(Request $request)
    {
        $userId = Auth::user()->id;
        $limit = $request->input('limit');
        return $this->model::select("patterns.*")->orderBy('patterns.id')
        ->paginate($limit);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return object
     */
    public function destroy($id)
    {
        $data = $this->model::find($id);
        $result = null;
        if ($data) {
            $patternId = $data['id'];
            $result = $this->destroy($patternId);
        }
        if ($result) {
            $data->delete();
        }

        return $data;
    }

    /**
     * Get list by conditions
     *
     * @param  int  $id
     * @return object
     */
    public function getList($id)
    {
        $arrConditions = array();
        $arrConditions['pattern_id'] = $id;

        $results = $this->searchDataByConditions(10, $arrConditions, true);

        $array = json_decode(json_encode($results), true);
        $resultData = array();
        $dataMaps = array();
        $dataRecord = array();
        $patternDetail = array();
        $employees = array();

        $location_id = 0;
        $skill_id = 0;
        $countResult = 0;
        foreach ($array as $result) {
            if ($result['category_id'] != $category_id && $countResult != 0) {
                $data = array();
                $data['skill'] = $skill;
                $data['employees'] = $employees;
                array_push($dataRecord, $data);

                $dataMaps = array();
                $dataMaps['categoryName'] = $array[$countResult - 1]['category_name'];
                $dataMaps['datas'] = $dataRecord;
                array_push($resultData, $dataMaps);

                $skill = array();
                $employees = array();
                $dataRecord = array();
            }

            if ($result['skill_id'] != $skill_id) {
                if (!empty($skill)) {
                    $data = array();
                    $data['skill'] = $skill;
                    $data['employees'] = $employees;
                    array_push($dataRecord, $data);
                }

                $skill = array();
                $skill['skill_id'] = $result['skill_id'];
                $skill['difficultyLevel'] = $result['difficult_level'];
                $skill['trainingPeriod'] = empty($result['experienced_month']) ? "" : $result['experienced_month'];
                $skill['workName'] = $result['skill_name'];
                $skill['required_number'] = empty($result['required_number']) ? "" : $result['required_number'];
                $employees = array();
            }

            $employee = array();
            $employee['employee_id'] = $result['employee_id'];
            $employee['skillLevel'] = $result['skill_levels_id'];
            $employee['skillUp'] = $result['skill_up'];
            array_push($employees, $employee);

            $countResult = $countResult + 1;

            if ($countResult == count($array)) {
                $data = array();
                $data['skill'] = $skill;
                $data['employees'] = $employees;
                array_push($dataRecord, $data);

                $dataMaps = array();
                $dataMaps['categoryName'] = $result['category_name'];
                $dataMaps['datas'] = $dataRecord;
                array_push($resultData, $dataMaps);
            }

            $skill_id = $result['skill_id'];
            $category_id = $result['category_id'];
        }

        return $resultData;
    }

     /**
     * Search data by conditions.
     *
     * @param  int  $limit
     * @param  array  $arrConditions
     * @param  bool  $getAll
     * @return object
     */
    public function searchDataByConditions($limit, $arrConditions, $getAll = false)
    {
        $query = DB::table('employees')
            ->leftJoin('skill_employees', 'employees.id', '=', 'skill_employees.employee_id')
            ->join('skills', 'skill_employees.skill_id', '=', 'skills.id')
            ->join('skill_levels', 'skill_employees.skill_level_id', '=', 'skill_levels.id')
            ->join('categories', 'skills.category_id', '=', 'categories.id');

        if (!empty($arrConditions)) {
            foreach ($arrConditions as $key => $value) {
                // remove from conditions array if value is empty
                if ($value === '' || $value === null) {
                    unset($arrConditions[$key]);
                }
            }

            $query->where($arrConditions);
        }

        $query->selectRaw('employees.id as employee_id,
                employees.name as employee_name,
                employees.employee_order as employee_order,
                skills.id as skill_id,
                skills.name as skill_name,
                skills.required_number,
                skills.difficult_level,
                skills.experienced_month,
                categories.id as category_id,
                categories.name as category_name,
                skill_levels.id as skill_levels_id,
                skill_employees.skill_up as skill_up,
                skill_levels.name as skill_level_name')
            ->orderByRaw('categories.id, skills.id, employees.employee_order, employees.id');

        if ($getAll) {
            return $query->get()->toArray();
        }

        return $query->paginate($limit)->get()->toArray();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  App\Http\Requests\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $userId = Auth::user()->id;
            DB::beginTransaction();
            $params = $request->all();
            $data = $params['data'];
            $results = $data['result'];
            $listData = null;

            //Add Skill Map
            $skillMapId = $data['skillMapId'];
            if ($skillMapId != -1) {
                // Update
                $created_at = Carbon::parse($data['createdAt'])->toDateTimeString();
                $updated_at = Carbon::parse($data['updatedAt'])->toDateTimeString();
                SkillMap::where('id', $skillMapId)->update([
                    'name' => $data['lineName'],
                    'department_id' => $data['departmentId'],
                    'created_at' => $created_at,
                    'updated_at' => $updated_at
                ]);
            } else {
                // Add new
                $dataSkillMap = array();
                $dataSkillMap['name'] = $data['lineName'];
                $dataSkillMap['department_id'] = $data['departmentId'];
                if (isset($data['createdAt'])) {
                    $dataSkillMap['created_at'] = Carbon::parse($data['createdAt'])->toDateTimeString();
                }
                if (isset($data['updatedAt'])) {
                    $dataSkillMap['updated_at'] = Carbon::parse($data['updatedAt'])->toDateTimeString();
                }

                $dataSkillMap['user_id'] = $userId;
                $modelSkillMap = new SkillMap($dataSkillMap);
                $modelSkillMap->save();
                $skillMapId = $modelSkillMap->id;
                $listData['id'] = $skillMapId;
                $listSkillMap = $this->model::select("skillmaps.*")->orderBy('skillmaps.id')
                    ->join('departments', 'departments.id', '=', 'skillmaps.department_id')
                    ->with('department:id,name')->where($this->keyUserId, $userId)
                    ->get()
                    ->toArray();
                $listData['no'] = count($listSkillMap);
            }

            foreach ($results as $result) {
                $dataCategory = array();
                $dataCategory['name'] = $result['categoryName'];

                $modelCategory = new Category($dataCategory);
                $modelCategory->save();

                if (!empty($result['datas'])) {
                    foreach ($result['datas'] as $data) {
                        $skill = $data['skill'];
                        // Insert data
                        $dataSkill = array();
                        if (empty($skill['workName'])) {
                            continue;
                        }
                        $dataSkill['name'] = $skill['workName'];
                        $dataSkill['category_id'] = $modelCategory->id;
                        $dataSkill['skillmap_id'] = $skillMapId;
                        $dataSkill['difficult_level'] = $skill['difficultyLevel'];
                        $dataSkill['experienced_month'] = $skill['trainingPeriod'];
                        $dataSkill['required_number'] = $data['requiredPersonnel'];

                        $modelSkill = new Skill($dataSkill);
                        $modelSkill->save();

                        $employees = $data['employees'];
                        foreach ($employees as $employee) {
                            $dataEmployee = array();
                            $dataEmployee['skill_id'] = $modelSkill->id;
                            $dataEmployee['employee_id'] = $employee['id'];
                            $dataEmployee['skill_level_id'] = $employee['skillLevel'];
                            $dataEmployee['skill_up'] = $employee['skillUp'];

                            $modelEmployeeSkill = new SkillEmployee($dataEmployee);
                            $modelEmployeeSkill->save();
                        }
                    }
                }
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'errors' => [[__($this->internalServerError)]],
            ], 500);
        }
        return $listData;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return object
     */
    public function destroy($id)
    {
        $result = null;
        DB::beginTransaction();
        try {
            $skills = Skill::where('skillmap_id', $id)->get()->toArray();
            $skillIds = [];
            $categoryIds = [];
            foreach ($skills as $item) {
                array_push($skillIds, $item['id']);
                array_push($categoryIds, $item['category_id']);
            }
            if (count($skillIds) > 0) {
                $skillEmployees = SkillEmployee::whereIn('skill_id', $skillIds);
                $skillEmployees->delete();
            }
            $skills = Skill::where('skillmap_id', $id);
            $skills->delete();
            if (count($categoryIds) > 0) {
                $categories = Category::whereIn('id', $categoryIds);
                $categories->delete();
            }
            DB::commit();
            $result['valid'] = true;
        } catch (QueryException $ex) {
            $result['valid'] = false;
            $result['errors'] = __($this->messageDeleteFail);
            DB::rollback();
        }

        return $result;
    }

     /**
     * Copy the specified resource from storage.
     *
     * @param  App\Http\Requests\Request  $request
     * @return object
     */
    public function copySkillMap($request)
    {
        $id = $request->input('id');
        $newId = null;
        $result = null;
        DB::beginTransaction();
        try {
            // insert new record by old record
            $data = $this->model::find($id);
            if ($data) {
                $obj = new SkillMap();
                $obj['name'] = $data['name'];
                $obj['department_id'] = $data['department_id'];
                $obj['user_id'] = $data['user_id'];
                $obj['created_at'] = Carbon::now();
                $obj['updated_at'] = Carbon::now();
                $obj->save();
                $newId = $obj['id'];
            }
            $newCategoryId = null;
            $categoryIds = [];
            $skills = Skill::where('skillmap_id', $id)->get()->toArray();
            foreach ($skills as $item) {
                // get old data by skill id
                $skillEmployees = SkillEmployee::where('skill_id', $item['id'])->get()->toArray();
                if ($skillEmployees) {
                    $categories = Category::where('id', $item['category_id'])->get()->toArray();
                    if ($categories) {
                        if (empty($categoryIds) || (!in_array($item['category_id'], $categoryIds))) {
                            // insert new category
                            $obj = new Category();
                            $obj['name'] = $categories[0]['name'];
                            $obj['created_at'] = Carbon::now();
                            $obj['updated_at'] = Carbon::now();
                            $obj->save();
                            $newCategoryId =  $obj['id'];
                            array_push($categoryIds, $item['category_id']);
                        }
                        // insert new skill
                        $obj = new Skill();
                        $obj['name'] = $item['name'];
                        $obj['category_id'] = $newCategoryId;
                        $obj['skillmap_id'] = $newId;
                        $obj['difficult_level'] = $item['difficult_level'];
                        $obj['experienced_month'] = $item['experienced_month'];
                        $obj['required_number'] = $item['required_number'];
                        $obj['created_at'] = Carbon::now();
                        $obj['updated_at'] = Carbon::now();
                        $obj->save();
                        $newSkillId =  $obj['id'];

                        // insert new skill employees
                        foreach ($skillEmployees as $item) {
                            $obj = new SkillEmployee();
                            $obj['skill_id'] = $newSkillId;
                            $obj['employee_id'] = $item['employee_id'];
                            $obj['skill_level_id'] = $item['skill_level_id'];
                            $obj['skill_up'] = $item['skill_up'];
                            $obj['created_at'] = Carbon::now();
                            $obj['updated_at'] = Carbon::now();
                            $obj->save();
                        }
                    }
                }
            }
            DB::commit();
            $result['valid'] = true;
        } catch (QueryException $ex) {
            $result['valid'] = false;
            $result['errors'] = __($this->messageDeleteFail);
            DB::rollback();
        }

        return $result;
    }

    /**
     * Count by conditions.
     *
     * @param  int $userId
     * @return int
     */
    public function countByUser($userId)
    {
        return $this->model::where($this->keyUserId, $userId)->count();
    }

    /**
     * Get data skill map list by conditions.
     *
     * @param  int $id
     * @return array
     */
    public function getDataSkillMap($id)
    {
        $userId = Auth::user()->id;
        return $this->model::select("skillmaps.*")->where('skillmaps.id', $id)
        ->join('departments', 'departments.id', '=', 'skillmaps.department_id')
        ->with('department:id,name')->where($this->keyUserId, $userId)->get()->toArray();
    }
}
