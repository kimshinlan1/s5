<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Common\Constant;
use Illuminate\Http\Request;
use App\Services\PatternService;
use App\Services\PatternDetailService;
use App\Http\Requests\PatternDetailRequest;

class PatternDetailController extends Controller
{
    /** @var patterndetailservice */
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
        $data = [
            'selected5s' => []
        ];

        return view('pattern.pattern_detail_2', $data);
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
        return view('pattern.pattern_detail_2', $data);
    }

    /**
     * generate area html
     *
     */
    public function generateAreaHtml(Request $request)
    {

        $selected5s = json_decode($request->get('selected_5s'));
        $totalRows = $request->get('total_rows') ? $request->get('total_rows') : 0;
        $index = time();

        // Add New
        if ($request->get('new')) {
            foreach ($selected5s as $key => $method) {
                $data[] = [
                    "area_id" => "new" . $index,
                    "area_name" => "",
                    "location_id" => "new" . $index,
                    "location_name" => "",
                    "count_locations" => 1,
                    "5s" => $method,
                    "level_1" => "",
                    "level_2" => "",
                    "level_3" => "",
                    "level_4" => "",
                    "level_5" => "",
                ];
            }

        } elseif ($request->get('remove')) {
            // Get and re generate html after delete rows
            $data = json_decode($request->get('rows'), true);

        } else {
            // Get database for edit follow by below structure
            $id = $request->get('id');
            $data = $this->service->getData($id);

            // Convert StdClass to Array
            $data = json_decode(json_encode($data), true);
        }

        // dd($data);

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
        $data = $this->service->save($request);
        return response()->json($data);
    }
}
