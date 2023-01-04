<?php

namespace App\Http\Controllers;

use App\Common\Constant;
use Illuminate\Http\Request;
use App\Services\PatternTeamInspectionService;

class PatternTeamInspectionController extends Controller
{
    /* @var team_service */
    private $service;

    public function __construct(PatternTeamInspectionService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $deptId = $request->get('dept_id') ?: 18;
        $teamId = $request->get('team_id') ?: '';


        // Get inspection data (columns)
        $countColumn = 5;

        // Get inspection detail and render structure
        $inspectionDetails = $this->service->getInspectionDetails($teamId);
        dd($inspectionDetails);
        $inspectionDetails = [
            0 => [
                'inspections_id' => 1,
                'inspection_date' => '1/1/2023',
                'area_id' => 1,
                'location_id' => 1,
                '5s' => 's1',
                'point_value' => '1.0',
            ],
            1 => [
                'inspections_id' => 1,
                'inspection_date' => '1/1/2023',
                'area_id' => 1,
                'location_id' => 1,
                '5s' => 's2',
                'point_value' => '2.0',
            ],
            2 => [
                'inspections_id' => 1,
                'inspection_date' => '1/1/2023',
                'area_id' => 1,
                'location_id' => 1,
                '5s' => 's3',
                'point_value' => '3.0',
            ],
            3 => [
                'inspections_id' => 2,
                'inspection_date' => '2/1/2023',
                'area_id' => 1,
                'location_id' => 1,
                '5s' => 's1',
                'point_value' => '0.0',
            ],
            4 => [
                'inspections_id' => 2,
                'inspection_date' => '2/1/2023',
                'area_id' => 1,
                'location_id' => 1,
                '5s' => 's2',
                'point_value' => '1.0',
            ],
            5 => [
                'inspections_id' => 2,
                'inspection_date' => '2/1/2023',
                'area_id' => 1,
                'location_id' => 1,
                '5s' => 's3',
                'point_value' => '4.0',
            ],
        ];

        $inspectionData = [];
        foreach ($inspectionDetails as $inspection) {
            $index = $inspection['area_id'] . "_" . $inspection['location_id'] . "_" . $inspection['5s'];
            $inspectionData[$inspection['inspections_id']]['inspection_date'] = $inspection['inspection_date'];
            $inspectionData[$inspection['inspections_id']][$index] = $inspection['point_value'];
        }

        // Sample Structure
        // $structure = [
        //     'inspections_id' => [ // 1 inspections_id = 1 column
        //         'inspection_date' => '',
        //         'area_id_location_id_5s' => 'point_value'
        //     ]
        // ];


        // dd($inspectionData);


        // Get patterns (rows)
        $data = $this->service->getPatternDataByDept($deptId);
        $data = json_decode(json_encode($data), true);

        $params = [
            'countColumn' => $countColumn,
            'inspectionData' => $inspectionData,
            'data' => $data
        ];
        return view('pattern.pattern_team_inspection', $params);
    }
}
