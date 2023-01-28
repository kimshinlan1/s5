<?php

namespace App\Http\Controllers;

use App\Common\Constant;
use Illuminate\Http\Request;
use App\Services\PatternService;
use App\Services\DepartmentService;
use Illuminate\Support\Facades\Cache;
use App\Services\PatternTopPageService;
use App\Services\PatternTeamInspectionService;

class PatternTopPageController extends Controller
{
    /* @var team_service */
    private $service;

    public function __construct(PatternTopPageService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return $this->generateDataHtml($request);
    }

    /**
     * Generate area html
     *
     */
    public function generateDataHtml(Request $request)
    {
        // todo:
        $companyId = 1;//$request->get('company_id');
        $totalColumn = $request->get('new_total_column') ?: Constant::INSPECTION_DEFAULT_COLUMN_NUMBER;

        if (empty($companyId)) {
            // todo:
        }

        // Main data
        $inspectionData = [];

        // Get dept list
        $deptList = app(DepartmentService::class)->getFullDataByCompanyId($companyId);
        $maxColumn = 0;
        foreach ($deptList as $key => $dept) {

            // Build struture
            $inspectionData[$key] = [
                'dept_id' => $dept['id'],
                'dept_no' => $dept['no'],
                'dept_name' => $dept['name'],
                'teams' => []
            ];

            // Get inspection from team
            foreach ($dept['teams'] as $team) {
                $inspectionDetails = app(PatternTopPageService::class)->getInspectionsByTeam($team['id']);
                $inspectionDetails = json_decode(json_encode($inspectionDetails), true);

                // Build struture
                $inspectionData[$key]['teams'][] = [
                    'team_id' => $team['id'],
                    'team_no' => $team['no'],
                    'team_name' => $team['name'],
                    'inspections' => $inspectionDetails
                ];

                if (count($inspectionDetails) > $maxColumn) {
                    $maxColumn = count($inspectionDetails);
                }
            }

            // dd($inspectionData);
        }

        // dd($deptList);



        // Get ids to render columns
        // $inspectionIds = array_keys($inspectionData);
        // $i = 0;
        // while (count($inspectionIds) < $totalColumn) {
        //     $inspectionIds[] = "new_" . time() . $i;
        //     $i++;
        // }

        $params = [
            'countInspection' => $maxColumn,
            // 'inspectionIds' => $inspectionIds,
            'inspectionData' => $inspectionData,
        ];

        // dd($params);

        return view('pattern.pattern_top_page', $params);
    }
}
