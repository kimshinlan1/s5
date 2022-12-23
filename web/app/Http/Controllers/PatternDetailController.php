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
        return view('pattern.pattern_detail_2');
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
                    "5s" => Constant::NAME_5S[$method],
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
// dd($data);


        } else {
            // todo: Get database for edit follow by below structure
            //$data = [];

            // Sample structure
            $data = [
                0 => [
                    "area_id" => 1,
                    "area_name" => "area1",
                    "location_id" => 1,
                    "location_name" => "location1",
                    "count_locations" => 1, // count current locations in 1 area
                    "5s" => "s1", // get name from constant
                    "level_1" => "level_1",
                    "level_2" => "level_2",
                    "level_3" => "level_3",
                    "level_4" => "level_4",
                    "level_5" => "level_5",
                ],
                1 => [
                    "area_id" => 1,
                    "area_name" => "area1",
                    "location_id" => 1,
                    "location_name" => "location1",
                    "count_locations" => 1, // count current locations in 1 area
                    "5s" => "s2", // get name from constant
                    "level_1" => "level_11",
                    "level_2" => "level_21",
                    "level_3" => "level_31",
                    "level_4" => "level_41",
                    "level_5" => "level_51",
                ],
                2 => [
                    "area_id" => 2,
                    "area_name" => "area2",
                    "location_id" => 2,
                    "location_name" => "location2",
                    "count_locations" => 1, // count current locations in 1 area
                    "5s" => "s1",
                    "level_1" => "level_12",
                    "level_2" => "level_22",
                    "level_3" => "level_32",
                    "level_4" => "level_42",
                    "level_5" => "level_52",
                ],
                3 => [
                    "area_id" => 2,
                    "area_name" => "area2",
                    "location_id" => 2,
                    "location_name" => "location2",
                    "count_locations" => 1, // count current locations in 1 area
                    "5s" => "s2",
                    "level_1" => "level_122",
                    "level_2" => "level_222",
                    "level_3" => "level_322",
                    "level_4" => "level_422",
                    "level_5" => "level_522",
                ],
            ];
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
        $data = $this->service->save($request);
        return response()->json($data);
    }
}
