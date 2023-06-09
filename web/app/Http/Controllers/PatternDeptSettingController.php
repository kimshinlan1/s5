<?php

namespace App\Http\Controllers;

use App\Common\Constant;
use Illuminate\Http\Request;
use App\Services\PatternDeptSettingService;
use App\Services\PatternService;

class PatternDeptSettingController extends Controller
{
    /** @var patterndetailservice */
    private $service;
    private $servicePattern;

    public function __construct(PatternDeptSettingService $service)
    {
        $this->service = $service;
        $this->servicePattern = app(PatternService::class);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = [
            'selected5s' => []
        ];

        return view('pattern.pattern_dept_setting', $data);
    }

    /**
      * Returns edit resource
      *
      * @param \Illuminate\Http\Request $request
      *
      * @return \Illuminate\Http\Response
    */
    public function edit(Request $request, $id = null)
    {
        $selected5s = null;
        $info = null;
        $mode = $request->get('mode');
        if ($id) {
            $info = (app()->get(PatternDeptSettingService::class))->getDataById($id);
        }
        if (!empty($info)) {
            $selected5s = json_decode($info['5s']);
        }

        $data = [
            'mode' => $mode,
            'info' => $info,
            'selected5s' => $selected5s
        ];
        return view('pattern.pattern_dept_setting', $data);
    }

    /**
     * generate area html
     *
     */
    public function generateAreaHtml(Request $request)
    {
        $selected5s = json_decode($request->get('selected_5s'));
        $totalRows = $request->get('total_rows') ? $request->get('total_rows') : 0;
        $newLocationNo = $request->get('new_location_no') ?: 1;
        $newAreaName = $request->get('new_area_name') ?: "";
        $areaIndex = time();

        // Case: Add New
        if ($request->get('new') != '-1') {
            // Loop locations
            $l = 0;
            while ($l < $newLocationNo) {
                $index = time() . $l;

                // Loop rows
                foreach ($selected5s as $method) {
                    $data[] = [
                        "area_id" => "new" . $areaIndex,
                        "area_name" => $newAreaName,
                        "location_id" => "new" . $index,
                        "location_name" => "",
                        "count_locations" => $newLocationNo,
                        "area_rowspan" => count($selected5s) * $newLocationNo,
                        "location_rowspan" => count($selected5s),
                        "5s" => $method,
                        "level_1" => "",
                        "level_2" => "",
                        "level_3" => "",
                        "level_4" => "",
                        "level_5" => "",
                    ];
                }
                $l++;
            }
        } elseif ($request->get('remove')) {
            // Case: Delete rows
            // Get and re generate html after delete rows
            $data = json_decode($request->get('rows'), true);
        } else {
            // Case: Edit
            // Get database for edit follow by below structure
            $id = $request->get('id');
            $data = $this->service->getData($id);
            // Convert StdClass to Array
            $data = json_decode(json_encode($data), true);
        }
        return view('pattern.pattern_row', [
            "data" => $data,
            "count5sChecked" => count($selected5s),
            "currentTotalRows" => $totalRows
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests $request
     *
     * @return \Illuminate\Http\Response
     */
    public function saveDeptPattern(Request $request)
    {
        // Check not exist data
        $requestData = $request->get('data');
        if (!isset($requestData['info']) || !isset($requestData['data'])) {
            return $this->responseException();
        }
        $data = $this->service->save($request);
        if ($data['invalid']) {
            return $this->responseException(Constant::MESSAGES['UNIQUE_PATTERN_NAME'], 422);
        }
        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests $request
     *
     * @return \Illuminate\Http\Response
     */
    public function saveDeptPatternForFree(Request $request)
    {
        // Check not exist data
        $data = $this->service->saveForFree($request);
        if ($data['invalid']) {
            return $this->responseException(Constant::MESSAGES['UNIQUE_PATTERN_NAME'], 422);
        }
        return response()->json($data);
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
            $data = $this->servicePattern->destroyPatternByMode($id);
            return response()->json($data);
        } catch (\Throwable $th) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }

     /**
      * Returns edit resource
      *
      * @param $id department id
      *
      * @return \Illuminate\Http\Response
    */
    public function checkDataUsed($id)
    {
        return $this->service->checkDataUsed($id);
    }

     /**
      * Check if data is linked or not
      *
      * @param \App\Http\Requests $request
      *
      * @return \Illuminate\Http\Response
    */
    public function checkBinding(Request $request)
    {
        $isBinding = $this->service->checkBindingData($request);
        return response()->json(['success' => $isBinding]);
    }
}
