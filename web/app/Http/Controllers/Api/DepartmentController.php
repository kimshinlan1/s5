<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\Department as DepartmentResource;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Department::all();
        // echo "<pre>";
        return DepartmentResource::collection($products);

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $department = new Department();
        $department->no = $request->input('no');
        $department->name = $request->input('name');
        $department->company_id = $request->input('companyID');
        if($department->save()) {
            return response() -> json([
                'success' => true,
                'data' => $department
            ], 200);
        }

        return response() -> json([
            'success' => false,
            'message' => 'Department not added'
        ]);

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // return new DepartmentResource($department);
        $departmentById = Department::find($id);
        
        if(!$departmentById) {
            return response()->json([
                'success' => false,
                'message' => 'Department not found'
            ], 400);
        }

        return $departmentById;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Department $department)
    {
        $deptById = Department::find($request->id);
        return response()->json([
            'id' => $request->id,
            'data' => $deptById
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}