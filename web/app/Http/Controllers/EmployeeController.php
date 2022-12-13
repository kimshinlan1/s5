<?php

namespace App\Http\Controllers;

use App\Common\Constant;
use Illuminate\Http\Request;
use App\Services\EmployeeService;
use App\Http\Requests\EmployeeRequest;

class EmployeeController extends Controller
{
    /* @var department service */
    private $service;

    public function __construct(EmployeeService $service)
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
        $companyList = $this->service->getCompanyList();
        return view('employee.index', ['companyList' => $companyList]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\EmployeeRequest $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(EmployeeRequest $request)
    {
        try {
            $data = $this->service->store($request);
            $status = 200;
            if (!$data['valid']) {
                $status = 500;
                $data['errors'] = __(Constant::MESSAGES['MAX_EMP_ERROR']);
            }
            return response()->json($data, $status);
        } catch (\Exception $e) {
            return response()->json([
            'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\EmployeeRequest  $request
     * @param int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function update(EmployeeRequest $request, $id)
    {
        try {
            $data = $this->service->update($request, $id);
            $status = 200;
            if (!$data['valid']) {
                $status = 500;
                $data['errors'] = __(Constant::MESSAGES['MAX_EMP_ERROR']);
            }
            return response()->json($data, $status);
        } catch (\Exception $e) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])], 500);
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
    public function dataByTeamId(Request $request)
    {
        try {
            return $this->service->getDataByTeamId($request);
        } catch (\Throwable $th) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }

    /**
     * Returns new order of rows
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateOrder(Request $request)
    {
        return $this->service->reorderRow($request);
    }
}
