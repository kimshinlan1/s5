<?php

namespace App\Http\Controllers;

use App\Common\Constant;
use Illuminate\Http\Request;
use App\Services\PatternDetailService;
use App\Http\Requests\PatternDetailRequest;
use App\Models\User;

class PatternDetailController extends Controller
{
    /* @var patterndetailservice */
    private $service;

    public function __construct(PatternDetailService $service)
    {
        $this->service = $service;
        $this->user = app(User::class);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('pattern.pattern_detail');
    }

    /**
     * Returns resource as a list.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function list(Request $request)
    {
        if ($this->user->isAdmin()) {
            $data = $this->service->getList($request);
        } else {
            $data = $this->service->getDepartmentByID($request);
        }
        $arrPatternDetail = $this->$data->getCollection();
        return response()->json([
            'total' => $data->total(),
            'rows' => $arrPatternDetail,
            'currentCompany' => auth()->user()->company()->first()
        ]);
    }

    /**
     * Returns resource as a  department list.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function getPatternDetailListByID(Request $request)
    {
        $data = $this->service->getPatternDetailListByID($request);
        $arrPatternDetail = $this->getCollection();
        return response()->json([
            'total' => $data->total(),
            'rows' => $arrPatternDetail
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\PatternDetailRequest $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(PatternDetailRequest $request)
    {
        try {
            $data = $this->service->store($request);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\PatternDetailRequest  $request
     * @param int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function update(PatternDetailRequest $request, $id)
    {
        try {
            $data = $this->service->update($request, $id);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $data = $this->service->destroy($id);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }

    /**
     * Returns department list.
     *
     * @param  id
     * @return array
     */
    public function getByCompany($id)
    {
        return $this->service->getDataByCompany($id);
    }
}
