<?php

namespace App\Http\Controllers;

use App\Common\Constant;
use Illuminate\Http\Request;
use App\Services\CompanyService;
use App\Http\Requests\CompanyRequest;
use App\Services\DepartmentService;
use App\Services\UserService;

class CompanyController extends Controller
{
    /* @var company_service */
    private $service;

    public function __construct(CompanyService $service)
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
        return view('company.index');
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
        $companyCollection = $data->toArray()['data'];

        for ($i = 0; $i < count($companyCollection); $i++) {
            $deptList = app()->get(DepartmentService::class)->getDataByCompany($companyCollection[$i]['id']);
            $companyCollection[$i]['departments'] = $deptList;
        }

        return response()->json([
            'total' => $data->total(),
            'rows' => $companyCollection,
            'currentCompany' => auth()->user()->company()->first()
        ]);
    }

    /**
      * Returns resource as a list.
      *
      * @param \Illuminate\Http\Request $request
      *
      * @return \Illuminate\Http\Response
    */
    public function getAll(Request $request)
    {
        return $this->service->getAll($request);
    }

    /**
      * Store a newly created resource in storage.
      *
      * @param \App\Http\Requests\CompanyRequest $request
      *
      * @return \Illuminate\Http\Response
    */
    public function store(CompanyRequest $request)
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
      * @param \App\Http\Requests\CompanyRequest  $request
      * @param int $id
      *
      * @return \Illuminate\Http\Response
    */
    public function update(CompanyRequest $request, $id)
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
            // Delete Users related
            $userService = app(UserService::class);
            $userService->destroyByCompany($id);

            // Delete Deparments related
            $deptService = app(DepartmentService::class);
            $deptService->destroyByCompany($id);

            // Delete company
            $data = $this->service->destroy($id);
            return response()->json($data);
        } catch (\Throwable $th) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }
}
