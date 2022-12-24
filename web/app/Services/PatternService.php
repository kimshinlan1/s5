<?php

namespace App\Services;

use App\Common\Constant;
use App\Models\Department;
use App\Models\Pattern;
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
     *
     * @return object
     */
    public function getPatternsByCompanyId(Request $request)
    {
        $compId = $request->input('company_id');
        $limit = $request->input('limit');

        if ($compId == Constant::KAIZEN_BASE_COMPANY_ID) {
            return $this->model::orderBy('id')->paginate($limit);
        } else {
            $ids = Department::select('dept_pattern_id')->where('company_id', $compId)->get()->toArray();
            return DB::table('dept_patterns')->whereIn('id', $ids)->orderBy('id')->paginate($limit);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return object
     */
    public function destroyPatternByMode($id, $compId)
    {
        if ($compId && $compId == Constant::KAIZEN_BASE_COMPANY_ID) {
            $data = $this->model::find($id);
        } else {
            $data = DB::table('dept_patterns')->where('id', $id);
        }
        return $data->delete();
    }
}
