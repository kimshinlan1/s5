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
        return view('pattern.pattern_team_inspection');
    }

    /**
     * Generate area html
     *
     */
    public function generateDataHtml(Request $request)
    {
        // todo:
        $deptId = $request->get('dept_id');
        $teamId = $request->get('team_id');


        if (empty($deptId)) {
            // todo:
        }

        if (empty($teamId)) {
            // todo:
        }


        // Get inspection detail and render structure (Columns)
        // $inspectionDetails = $this->service->getInspectionDetailsByTeam($teamId);

        // Get patterns (rows)
        $data = $this->service->getPatternDataByDept($deptId);
        $data = json_decode(json_encode($data), true);

        // todo: Check existed
        // if (empty($inspectionDetails) || empty($data)) {
        //     // todo:
        //     return;
        // }

        // dd($inspectionDetails);

        // Test
        $inspectionDetails = [
            0 => [
                'inspections_id' => 1,
                'inspection_date' => '1/1/2023',
                'area_id' => 1,
                'location_id' => 1,
                '5s' => 's1',
                'point_value' => '1',
                'count_evidence' => '10',
            ],
            1 => [
                'inspections_id' => 1,
                'inspection_date' => '1/1/2023',
                'area_id' => 1,
                'location_id' => 1,
                '5s' => 's2',
                'point_value' => '2',
                'count_evidence' => '10',
            ],
            2 => [
                'inspections_id' => 1,
                'inspection_date' => '1/1/2023',
                'area_id' => 1,
                'location_id' => 1,
                '5s' => 's3',
                'point_value' => '3',
                'count_evidence' => '10',
            ],
            3 => [
                'inspections_id' => 2,
                'inspection_date' => '2/1/2023',
                'area_id' => 1,
                'location_id' => 1,
                '5s' => 's1',
                'point_value' => '0',
                'count_evidence' => '10',
            ],
            4 => [
                'inspections_id' => 2,
                'inspection_date' => '2/1/2023',
                'area_id' => 1,
                'location_id' => 1,
                '5s' => 's2',
                'point_value' => '1',
                'count_evidence' => '10',
            ],
            5 => [
                'inspections_id' => 2,
                'inspection_date' => '2/1/2023',
                'area_id' => 1,
                'location_id' => 1,
                '5s' => 's3',
                'point_value' => '4',
                'count_evidence' => '10',
            ],
        ];

        $inspectionData = [];
        foreach ($inspectionDetails as $inspection) {
            $index = $inspection['area_id'] . "_" . $inspection['location_id'] . "_" . $inspection['5s'];
            $inspectionData[$inspection['inspections_id']]['inspection_date'] = $inspection['inspection_date'];
            $inspectionData[$inspection['inspections_id']]['count_evidence'] = $inspection['count_evidence'] ?: 0;
            $inspectionData[$inspection['inspections_id']][$index] = $inspection['point_value'];
        }

        // Sample Structure
        // $structure = [
        //     'inspections_id' => [ // 1 inspections_id = 1 column
        //         'inspection_date' => '',
        //         'count_evidence' => '',
        //         'area_id_location_id_5s' => 'point_value'
        //     ]
        // ];

        // Get ids to render columns
        $inspectionIds = array_keys($inspectionData);
        while (count($inspectionIds) < Constant::INSPECTION_DEFAULT_COLUMN_NUMBER) {
            $inspectionIds[] = "new_" . time();
        }


        // dd($inspectionIds);
        // $inspectionData = [];


        $params = [
            'new' => empty($inspectionData),
            'countInspection' => count($inspectionIds),
            'inspectionIds' => $inspectionIds,
            'inspectionData' => $inspectionData,
            'data' => $data,
        ];
        return view('pattern.partials.data_team_inspection', $params);
    }
}
