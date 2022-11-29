<?php

namespace App\Services;

use App\Models\User;
use App\Common\Constant;
use Illuminate\Http\Request;
use App\Http\Requests\MyPageRequest;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\ChangePasswordRequest;

class MyPageService
{
    /* @var Model */
    private $model;

    public function __construct(User $model)
    {
        $this->model = $model;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user_login = Auth::user();
        $user = User::find($id);
        if ($user && $user_login->identifier === $user->identifier) {
            return $user;
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(MyPageRequest $request, $id)
    {
        try {
            $user = User::find($id);
            $user_login = Auth::user();
            if ($user && $user_login->identifier === $user->identifier) {
                $user->fill($request->all());
                $user->save();
                unset($user->password);
                return response()->json($user);
            }
            return response()->json([
                'errors' => [[__($this->notFoundError)]]
            ], 404);
        } catch (\Throwable $th) {
            return response()->json([
                'errors' => [[__($this->internalServerError)]]
            ], 500);
        }
    }

      /**
     * Update the password of a user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updatePassword(ChangePasswordRequest $request)
    {
        try {
                $user_login = Auth::user();
                $user = User::find($user_login->id);
                $user->forceFill(["password" => $request->new_password])->save();
                $request->session()->flash('success', ['success' => __('Your password has been updated successfully')]);
                return response(200);
        } catch (\Throwable $th) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }
}
