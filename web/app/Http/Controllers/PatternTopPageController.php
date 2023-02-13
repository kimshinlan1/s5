<?php

namespace App\Http\Controllers;

use App\Common\Constant;
use App\Services\CompanyService;
use Illuminate\Http\Request;
use App\Services\DepartmentService;
use Illuminate\Support\Facades\Cache;
use App\Services\PatternTopPageService;

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
        $companies = app()->get(CompanyService::class)->getAll()->toArray();
        $params = [
            'companies' => $companies
        ];
        return view('pattern.pattern_top_page', $params)->render();
    }

    /**
     * Generate area html
     *
     */
    public function generateDataHtml(Request $request)
    {
        // todo:
        $companyId = $request->get('company_id');
        $totalDeptPointArr = [0, 0, 0, 0, 0];
        $avgDeptPointArr = null;
        // $totalColumn = $request->get('new_total_column') ?: Constant::INSPECTION_DEFAULT_COLUMN_NUMBER;

        if (empty($companyId)) {
            // todo:
        }

        // Main data
        $inspectionData = [];

        // Get dept list
        $deptList = app(DepartmentService::class)->getFullDataByCompanyId($companyId);
        $maxColumn = 0;


        foreach ($deptList as $key => $dept) {
            $overallPoint = array();
            $count = 0;
            $totalDeptPointArr = [0, 0, 0, 0, 0];
            $avgDeptPointArr = null;
            // Build struture
            $inspectionData[$key] = [
                'dept_id' => $dept['id'],
                'dept_no' => $dept['no'],
                'dept_name' => $dept['name'],
                'dept_avgPoint' => '',
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

                foreach ($inspectionDetails as $index => $inspectionDetail) {
                    $count = $index;
                    $tempArr = explode('|', $inspectionDetail['avg_point']);
                    $tempStr = 'inspection' . strval($index);
                    if (!array_key_exists($tempStr, $overallPoint)) {
                        $overallPoint[$tempStr] = [0, 0, 0, 0, 0];
                    }
                    $overallPoint[$tempStr] = array_map(function () {
                        return array_sum(func_get_args());
                    }, $overallPoint[$tempStr], $tempArr);
                }

                if (count($inspectionDetails) > $maxColumn) {
                    $maxColumn = count($inspectionDetails);
                }
            }
            if ($count != 0) {
                $avgDeptPointArr = array_map(function ($val) use ($count) {
                    return round($val / $count, 2);
                }, $totalDeptPointArr);
            }

            if ($avgDeptPointArr) {
                $avgDeptPointArr = implode('|', $avgDeptPointArr);
            }
            // $inspectionData[$key]['dept_avgPoint'] = $overallPoint;
            // $i = 0;
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

        $companies = app()->get(CompanyService::class)->getAll()->toArray();
        Cache::put('companies', $companies, 10);
        $params = [
            'countInspection' => $maxColumn > Constant::INSPECTION_DEFAULT_COLUMN_NUMBER ? $maxColumn : Constant::INSPECTION_DEFAULT_COLUMN_NUMBER,
            // 'inspectionIds' => $inspectionIds,
            'inspectionData' => $inspectionData,
            'companies' => Cache::get('companies')
        ];

        // dd($params);
        return view('pattern.pattern_top_page_table', $params)->render();
    }
}
