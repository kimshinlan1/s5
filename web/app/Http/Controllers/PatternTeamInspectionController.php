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
        $data = [
            'deptId' => '',
            'teamId' => ''
        ];
        return view('pattern.pattern_team_inspection', $data);
    }

    /**
     * Returns edit resource
     *
     * @param int $teamId
     *
     * @return \Illuminate\Http\Response
     */
    public function edit($teamId)
    {
        $info = $this->service->getDataTeamById($teamId);
        if (empty($info)) {
            return abort(500, __('Message_No_Data'));
        }
        $data = [
            'teamId' => $teamId,
            'teamName' => $info[0]['name'],
            'deptId' => $info[0]['department_id']
        ];
        return view('pattern.pattern_team_inspection', $data);
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
        $totalColumn = $request->get('new_total_column') ?: Constant::INSPECTION_DEFAULT_COLUMN_NUMBER;

        if (empty($deptId)) {
            // todo:
        }

        if (empty($teamId)) {
            // todo:
            $inspectionDetails = [];
        } else {
            // Get Columns: Inspection detail and render structure todo:
            $inspectionDetails = $this->service->getInspectionDetailsByTeam($teamId);
        }
        $inspectionDetails = json_decode(json_encode($inspectionDetails), true);


        // Get Rows: patterns
        // $data = $this->service->getPatternDataByDept($deptId);
        // $data = json_decode(json_encode($data), true);


        $data = [];
        // Pending cache
        // $key = "pattern_data_{$deptId}_{$teamId}";
        // if (!Cache::get($key)) {
            $data = $this->service->getPatternDataByDept($deptId);
            $data = json_decode(json_encode($data), true);
        //     Cache::put($key, $data);
        // } else {
        //     $data = Cache::get($key);
        // }



        // todo: Check empty
        // if (empty($inspectionDetails) || empty($data)) {
        //     // todo:
        //     return;
        // }

        // Rebuild structure to render
        $inspectionData = [];
        foreach ($inspectionDetails as $inspection) {
            $index = $inspection['area_id'] . "_" . $inspection['location_id'] . "_" . $inspection['5s'];
            $inspectionData[$inspection['inspection_id']]['inspection_date'] = $inspection['inspection_date'];
            $inspectionData[$inspection['inspection_id']]['count_evidence'] = $inspection['count_evidence'] ?: 0;
            $inspectionData[$inspection['inspection_id']][$index] = $inspection['point_value'];
        }

        // Sample Structure
        // $structure = [
        //     'inspection_id' => [ // 1 inspection_id = 1 column
        //         'inspection_date' => '',
        //         'count_evidence' => '',
        //         'area_id_location_id_5s' => 'point_value'
        //     ]
        // ];

        // Get ids to render columns
        $inspectionIds = array_keys($inspectionData);
        $i = 0;
        while (count($inspectionIds) < $totalColumn) {
            $inspectionIds[] = "new_" . time() . $i;
            $i++;
        }

        $params = [
            'new' => empty($inspectionData),
            'countInspection' => count($inspectionIds),
            'inspectionIds' => $inspectionIds,
            'inspectionData' => $inspectionData,
            'data' => $data,
        ];
        return view('pattern.partials.data_team_inspection', $params);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $inspectionId
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($inspectionId)
    {
        $data = $this->service->destroyInspections($inspectionId);
        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function saveInspection(Request $request)
    {
        if (!$request->get('data') || !count($request->get('data'))) {
            return $this->responseException();
        }
        $data = $this->service->saveInspection($request);
        return response()->json($data);
    }

    /**
     * getEvidence
     *
     */
    public function getEvidence(Request $request)
    {
        // todo:
        $inspectionId = $request->get('inspection_id');


        if (empty($inspectionId)) {
            // todo:
        }

        // Get data and format structure
        $evidences = $this->service->getEvidenceByInspectionId($inspectionId);
        $evidences = json_decode(json_encode($evidences), true);

        $params = [
            'evidences' => $evidences,
        ];
        return view('pattern.partials.evidence_block', $params);
    }

    /**
     * Add block
     *
     */
    public function addBlock(Request $request)
    {
        return view('pattern.partials.evidence_new_block');
    }

    /**
     * Save upload Image
     *
     */
    public function saveImage(Request $request)
    {
        $data = $this->service->saveUploadedImage($request);
        if (isset($data['invalid'])) {
            return $this->responseException("Constant::MESSAGES['SYSTEM_ERROR']", 500);
        }
        return $data;
    }

    /**
     * Delete Image
     *
     */
    public function removeImage($id)
    {
        return $this->service->removeExistingImage($id);
    }

    /**
     * Remove Block
     *
     */
    public function removeBlock($id)
    {
        return $this->service->removeExistingBlock($id);
    }

    /**
     * Remove album
     *
     */
    public function removeAlbum(Request $request)
    {
        return $this->service->removeExistingAlbum($request);
    }
}
