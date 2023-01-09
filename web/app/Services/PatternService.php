<?php

namespace App\Services;

use App\Common\Constant;
use App\Models\Department;
use App\Models\Pattern;
use App\Models\DeptPattern;
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
     * @param  $id
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
     * @param  \Illuminate\Http\Request  $request
     *
     * @return array
     */
    public function listPatternbyDept($id)
    {
        $data = [];
        $deptPatternId = Department::where('id', $id)->first()->dept_pattern_id;
        if ($deptPatternId) {
            $data = DB::table('dept_patterns')->where('id', $deptPatternId)->get()->toArray();
        }
        if (count($data) > 0) {
            // isPattern is used for checking if the pattern belongs to customer or kaizenbase
            $data[0]->isPattern = false;
        }
        $patterns = DB::table('patterns')->orderBy('id')->get()->toArray();
        foreach ($patterns as $pattern) {
            $pattern->isPattern = true;
        }
        $data = array_merge($data, $patterns);
        return $data;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return object
     */
    // pageDest mode check page list pattern and page list pattern customer
    // compId mode check company
    public function destroyPatternByMode($id, $compId, $pageDest)
    {
        if ($pageDest == Constant::PAGE_PATTERN_LIST_CUSTOMER) {
            $data = DeptPattern::where('id', $id);
        } else {
            $data = $this->model::find($id);
        }
        return $data->delete();
    }
}
