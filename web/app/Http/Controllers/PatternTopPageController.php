<?php

namespace App\Http\Controllers;

use App\Common\Constant;
use App\Models\Department;
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
        $companyId = $request->get('company_id');

        if (empty($companyId)) {
            $companyId = auth()->user()->company()->first()->id;
        }

        // Main data
        $inspectionData = [];

        // Get dept list
        $deptList = app(DepartmentService::class)->getFullDataByCompanyId($companyId);
        $maxColumn = 0;


        foreach ($deptList as $key => $dept) {
            $deptPatternId = Department::find($dept['id'])->dept_pattern_id;
            $locationIds = $this->service->getLocationsByDeptPattern($deptPatternId);
            // Build struture
            $inspectionData[$key] = [
                'dept_id' => $dept['id'],
                'dept_no' => $dept['no'],
                'dept_name' => $dept['name'],
                'dept_avgPoint' => '',
                'teams' => [],
                'locationIds' => $locationIds
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
        }
        $companies = Cache::get('companies');

        if (!$companies) {
            $companies = app()->get(CompanyService::class)->getAll()->toArray();
            Cache::put('companies', $companies, 10);
        }

        $params = [
            'countInspection' => Constant::INSPECTION_DEFAULT_COLUMN_NUMBER,
            'inspectionData' => $inspectionData,
            'companies' => $companies
        ];

        return view('pattern.pattern_top_page_table', $params)->render();
    }

    /**
      * Check if data is linked or not
      *
      * @param \App\Http\Requests $request
      *
      * @return \Illuminate\Http\Response
    */
    public function checkDeptExist(Request $request)
    {
        $isExist = $this->service->checkDeptExist($request);
        return response()->json(['success' => $isExist]);
    }
}
