<?php

namespace App\Services;

use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;

class UserService extends BaseService
{
    /* @var Model */
    private $model;

    public function __construct(User $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }

    /**
     * Get available company
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return object
     */
    public function getAvailableCompany()
    {
        $unavailableCompanyID = User::select('company_id')->distinct()->get()->toArray();
        return Company::whereNotIn('id', $unavailableCompanyID)->get();
    }

    /**
     * Get list by conditions
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return object
     */
    public function getList(Request $request)
    {
        $limit = $request->input('limit');
        return $this->model::select("users.*")->orderBy('users.id')
            ->join('companies', 'companies.id', '=', 'users.company_id')
            ->with('company:id,name')
            ->paginate($limit);
    }

    /**
     * Get by login conditions
     *
     * @param $loginId
     * @param $password
     *
     * @return object
     */
    public function getByLogin($loginId, $password)
    {
        $user = $this->model::where('identifier', $loginId)->first()->toArray();
        $decryptPwd = Crypt::decryptString($user['password']);
        if ($user && ($password == $decryptPwd)) {
            return $user;
        }
        return null;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\UserRequest $request
     *
     * @return object
     */
    public function store(UserRequest $request)
    {
        return $this->model::create($request->all());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UserRequest $request
     * @param  int $id
     *
     * @return object
     */
    public function update(UserRequest $request, $id)
    {
        $user = $this->model::find($id);

        // Check password
        if ($request->input('password')) {
            $user->fill($request->all());
            $user->save();
        } else {
            $user->fill($request->except(['password']));
            $user->save();
        }
        return $user;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $companyId
     *
     * @return object
     */
    public function destroyByCompany($companyId)
    {
        $user = $this->model::where("company_id", $companyId);
        $user->delete();
        return $user;
    }

    /**
     * Count
     *
     * @param int $companyId
     *
     * @return int
     */
    public function countUserByCompanyId($companyId)
    {
        return $this->model::where('company_id', $companyId)->count();
    }
}
