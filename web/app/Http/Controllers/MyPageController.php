<?php

namespace App\Http\Controllers;

use Exception;
use App\Common\Constant;
use App\Services\MyPageService;
use App\Http\Controllers\Controller;
use App\Http\Requests\MyPageRequest;
use Illuminate\Database\QueryException;
use App\Http\Requests\ChangePasswordRequest;

class MyPageController extends Controller
{
    /* @var department service */
    private $service;

    public function __construct(MyPageService $service)
    {
        $this->service = $service;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = [
            'user' => $this->service->show($id),
        ];
        return view('my_pages.index', $user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\MyPageRequest  $request
     * @param int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function update(MyPageRequest $request, $id)
    {
        try {
            $data = $this->service->update($request, $id);
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
     * @param \App\Http\Requests\ChangePasswordRequest  $request
     * @param int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function updatePassword(ChangePasswordRequest $request, $id)
    {
        try {
            $data = $this->service->updatePassword($request, $id);
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
}
