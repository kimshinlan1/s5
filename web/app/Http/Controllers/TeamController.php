<?php

namespace App\Http\Controllers;

use App\Common\Constant;
use Illuminate\Http\Request;
use App\Services\TeamService;
use App\Http\Requests\TeamRequest;
use App\Services\EmployeeService;

class TeamController extends Controller
{
    /* @var team_service */
    private $service;

    /* @var EmployeeService */
    private $serviceEmployee;

    public function __construct(TeamService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('teams.index');
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
        $data = $this->service->getList($request);
        $arrTeam = $this->getFinalList($data->getCollection());
        return response()->json([
            'total' => $data->total(),
            'rows' => $arrTeam,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\TeamRequest $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(TeamRequest $request)
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
     * @param \App\Http\Requests\TeamRequest  $request
     * @param int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function update(TeamRequest $request, $id)
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
        } catch (\Throwable $th) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }

    /**
     * Returns resource as a list.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getListCompanyId(Request $request)
    {
        try {
            return $this->service->getListCompanyId($request);
        } catch (\Throwable $th) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }

    /**
     * Returns resource as a list.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getTeamByDepartmentId(Request $request)
    {
        try {
            $data = $this->service->getTeamByDepartmentId($request);
            return response()->json([
                'total' => $data->total(),
                'rows' => $data->getCollection(),
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }

    /**
     * Returns resource as a list.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function getTeamsByDepartmentId(Request $request)
    {
        try {
            return $this->service->getTeamArrayByDepartmentId($request);
        } catch (\Throwable $th) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }

    /**
     * Returns final list.
     *
     * @param  obj  $arr
     * @return Array
     */
    public function getFinalList($arr)
    {
        foreach ($arr as $key => $item) {
            $cntEmployees = $this->serviceEmployee->getNumberEmployeeByTeam($item['id']);
            $arr[$key]['employee_cnt'] = $cntEmployees;
        }
        return $arr;
    }
}
