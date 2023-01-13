<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Common\Constant;
use App\Services\PatternService;
use App\Services\PatternDetailService;
use App\Services\PatternDeptSettingService;
use Illuminate\Support\Facades\Auth;

class PatternController extends Controller
{
    /* @var patternservice */
    private $service;

    public function __construct(PatternService $service)
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
        return view('pattern.index');
    }

    /**
     * Returns resource as a list.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function list(Request $request)
    {
        $data = $this->service->getList($request);
        return response()->json([
            'total' => $data->total(),
            'rows' => $data->getCollection(),
        ]);
    }

     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function indexCustomer()
    {
        /** @var User */
        $user = Auth::user();
        if (!$user->is5SModeFree()) {
            return view('pattern.pattern_list_customer');
        }
    }

    /**
     * Get pattern list by company id
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Illuminate\Http\Response
     */
    public function getPatternByCompanyId(Request $request)
    {
        $data = $this->service->getPatternsByCompanyId($request);
        return response()->json([
            'total' => $data->total(),
            'rows' => $data->getCollection(),
        ]);
    }

    /**
     * Get pattern list
     *
     * @param $id
     *
     * @return \Illuminate\Http\Response
     */
    public function listPattern($id)
    {
        return $this->service->listPatternbyComp($id);
    }

    /**
     * Check if free company has a dept pattern
     *
     * @param $id company id
     *
     * @return \Illuminate\Http\Response
     */
    public function checkDeptPatternExist($id)
    {
        return $this->service->checkDeptPatternExist($id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $compId = request()->get('companyId');
        // pageDest mode check page list pattern and page list pattern customer
        $pageDest = request()->get('pageDest');
        $data = $this->service->destroyPatternByMode($id, $compId, $pageDest);
        return response()->json($data);
    }

    /**
     * Display a listing of the resource.
     *
     * @param int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function preview($id, Request $request)
    {
        $pageDest = $request->get('pageDest');
        $info = app(PatternService::class)->getDataDeptPatternById($id);
        if (empty($info)) {
            return $this->responseException();
        }

        $data = [
            'info' => $info,
            'pageDest' => $pageDest
        ];
        return view('pattern.pattern_preview', $data);
    }

    /**
     * Generate area html
     *
     */
    public function generateAreaHtml(Request $request)
    {
        // Get database for edit follow by below structure
        $id = $request->get('id');
        $pageDest = $request->get('pageDest');

        if ($pageDest == Constant::PAGE_PATTERN_LIST_CUSTOMER) {
            $data = app(PatternDeptSettingService::class)->getData($id);
        } else {
            $data = app(PatternDetailService::class)->getData($id);
        }
        $data = json_decode(json_encode($data), true);
        return view('pattern.partials.data_pattern_preview', [
            "data" => $data,
        ]);
    }
}
