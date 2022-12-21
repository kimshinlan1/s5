<?php

namespace App\Http\Controllers;

use App\Services\PatternListService;
use Illuminate\Http\Request;

class PatternListController extends Controller
{
    /* @var patternservice */
    private $service;

    public function __construct(PatternListService $service)
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
        return view('pattern_list.index');
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
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
