<?php

namespace App\Http\Controllers;

use Exception;
use App\Common\Constant;
use Illuminate\Http\Request;
use App\Services\UserService;
use App\Http\Requests\UserRequest;
use App\Services\DepartmentService;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Crypt;

class UserController extends Controller
{
    /* @var UserService */
    private $service;

    public function __construct(UserService $service)
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
        return view('users.index');
    }
    /**
     * Display a listing of available com[].
     *
     * @return \Illuminate\Http\Response
     */
    public function listAvailableCompany()
    {
        return $this->service->getAvailableCompany();
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
        $userCollection = $data->toArray()['data'];

        for ($x = 0; $x < count($userCollection); $x++) {
            $deptList = app()->get(DepartmentService::class)->getDataByCompany($userCollection[$x]['company_id']);
            $pwd = $userCollection[$x]['password'];
            $descript = Crypt::decryptString($pwd);
            $userCollection[$x]['password'] = $descript;
            $userCollection[$x]['company']['departments'] = $deptList;
        }

        return response()->json([
            'total' => $data->total(),
            'rows' => $userCollection
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\UserRequest $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(UserRequest $request)
    {
        try {
            $data = $this->service->store($request);
            return response()->json($data);
        } catch (QueryException $e) {
            return response()->json([
                'errors' => $e->getMessage()
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UserRequest  $request
     * @param int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function update(UserRequest $request, $id)
    {
        try {
            $data = $this->service->update($request, $id);
            return response()->json($data);
        } catch (QueryException $e) {
            return response()->json([
                'errors' => $e->getMessage()
            ], 500);
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
}
