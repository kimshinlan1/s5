<?php

namespace App\Services;

use App\Models\PatternDetail;
use App\Models\Pattern;
use Illuminate\Http\Request;
use App\Http\Requests\PatternDetailRequest;
use App\Common\Utility;

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
}
