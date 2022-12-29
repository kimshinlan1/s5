<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Services\PatternService;
use App\Services\DeptPatternDetailService;

class PatternDeptSettingController extends Controller
{
    /** @var patterndetailservice */
    private $service;

    public function __construct(DeptPatternDetailService $service)
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
    public function edit($id)
    {
        $info = (app()->get(PatternService::class))->getDataById($id);
        if (empty($info)) {
            // todo:
            dd("No data");
            return;
        }

        $selected5s = json_decode($info['5s']);
        $data = [
            'mode' => 'edit',
            'info' => $info,
            'selected5s' => $selected5s
        ];
        return view('pattern.pattern_detail', $data);
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
        if ($request->get('new')) {
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
    public function savePattern(Request $request)
    {
        // todo: Check not exist data
        $data = $request->get('data');
        if (!isset($data['info']) || !isset($data['data'])) {
            return;
        }
        $data = $this->service->save($request);
        return response()->json($data);
    }
}
