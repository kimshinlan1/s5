<?php

namespace App\Http\Controllers;

use App\Common\Constant;
use App\Services\PatternService;
use Illuminate\Http\Request;

class PatternController extends Controller
{
    /* @var patternservice */
    private $service;

    public function __construct(PatternService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('pattern.index');
    }

    /**
     * Returns resource as a list.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function list(Request $request)
    {
        $data = $this->service->getList($request);
        return response()->json([
            'total' => $data->total(),
            'rows' => $data->getCollection(),
        ]);
    }

     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function indexCustomer()
    {
        return view('pattern.pattern_list_customer');
    }

    /**
     * Get pattern list by company id
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Illuminate\Http\Response
     */
    public function getPatternByCompanyId(Request $request)
    {
        try {
            $data = $this->service->getPatternsByCompanyId($request);
            return response()->json([
                'total' => $data->total(),
                'rows' => $data->getCollection(),
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }

    /**
     * Get pattern list
     *
     * @param $id
     *
     * @return \Illuminate\Http\Response
     */
    public function listPattern($id)
    {
        return $this->service->listPatternbyDept($id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $data = $this->service->destroyPatternByMode($id);
            return response()->json($data);
        } catch (\Throwable $th) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }
}
