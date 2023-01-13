<?php

namespace App\Services;

use App\Common\Constant;
use App\Models\Area;
use App\Models\Department;
use App\Models\Pattern;
use App\Models\DeptPattern;
use App\Models\DeptPatternDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatternService extends BaseService
{
    /* @var Model */
    private $model;

    public function __construct(Pattern $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }

    /**
     * Get list by conditions
     *
     * @param  $id (id of pattern)
     *
     * @return array
     */
    public function getDataById($id)
    {
        return $this->model::where('id', $id)->get()->first()?->toArray();
    }

    /**
     * Get list by conditions
     *
     * @param  \Illuminate\Http\Request  $request
     * @return object
     */
    public function getList(Request $request)
    {
        $limit = $request->input('limit');
        return $this->model::orderBy('id')->paginate($limit);
    }

    /**
     * Get list by conditions
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return object
     */
    public function getPatternsByCompanyId(Request $request)
    {
        $compId = $request->input('company_id');
        $limit = $request->input('limit');

        $ids = Department::select('dept_pattern_id')->where('company_id', $compId)->get()->toArray();
        if (empty($ids)) {
            return [];
        }
        return DeptPattern::join('departments', 'departments.dept_pattern_id', '=', 'dept_patterns.id')
            ->select('dept_patterns.*', 'departments.id as deptId', 'departments.name as deptName')
            ->whereIn('dept_patterns.id', $ids)->orderBy('dept_patterns.id')->paginate($limit);
    }

    /**
     * Get list
     *
     * @param  $id (id of dept_patter_setting)
     *
     * @return array
     */
    public function listPatternbyComp($id)
    {
        $data = [];

        $deptPatterns = DB::table('dept_patterns')->where('company_id', $id)->get()->toArray();
        if (!empty($deptPatterns)) {
            foreach ($deptPatterns as $deptPattern) {
                $deptPattern->isPattern = false;
            }
        }
        $patterns = DB::table('patterns')->orderBy('id')->get()->toArray();
        foreach ($patterns as $pattern) {
            $pattern->isPattern = true;
        }
        $data = array_merge($deptPatterns, $patterns);
        return $data;
    }

    /**
     * Get list
     *
     * @param  $id (id of dept_patter_setting)
     *
     * @return array
     */
    public function checkDeptPatternExist($id)
    {
        $ids = Department::select('dept_pattern_id')->where('company_id', $id)
        ->whereNotNull('dept_pattern_id')->get()->toArray();
        $checkDeptPatternExist = DeptPattern::whereIn('id', $ids)->exists();
        $data = [
            'isExisted' => $checkDeptPatternExist,
        ];
        return $data;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  $id (id of dept_patter_setting)
     * @param  $compId (compId mode check company)
     * @param  $pageDest (pageDest mode check page list pattern and page list pattern customer)
     *
     * @return object
     */
    public function destroyPatternByMode($id, $compId, $pageDest)
    {
        if ($pageDest == Constant::PAGE_PATTERN_LIST_CUSTOMER) {
            $data = DeptPattern::where('id', $id);
            if ($data->delete()) {
                Area::where('dept_pattern_id', $id)->update(['dept_pattern_id' => null]);
                Department::where('dept_pattern_id', $id)->update(['dept_pattern_id' => null]);
                $deptDetails = DeptPatternDetail::where('dept_pattern_id', $id)->pluck('dept_pattern_id')->toArray();
                DeptPatternDetail::whereIn('dept_pattern_id', $deptDetails)->delete();
            }
        } else {
            $data = $this->model::find($id);
        }
        return $data->delete();
    }

    /**
     * Get list by conditions
     *
     * @param  $id (id of dept_pattern)
     *
     * @return array
     */
    public function getDataDeptPatternById($id)
    {
        return DeptPattern::where('id', $id)->get()->first()?->toArray();
    }

}
