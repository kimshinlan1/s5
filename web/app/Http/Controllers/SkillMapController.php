<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Department;
use App\Common\Constant;
use Illuminate\Http\Request;
use App\Services\EmployeeService;
use App\Services\SkillMapService;
use App\Services\DepartmentService;
use App\Services\SkillLevelService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

class SkillMapController extends Controller
{
    /** @var SkillMapService */
    private $serviceSkillMap;

    /** @var DepartmentService */
    private $serviceDepartment;

    /** @var SkillLevelService */
    private $serviceSkillLevel;

    /** @var EmployeeService */
    private $serviceEmployee;

    public function __construct(SkillMapService $serviceSkillMap)
    {
        $this->serviceSkillMap = $serviceSkillMap;
        $this->serviceSkillLevel = app(SkillLevelService::class);
        $this->serviceEmployee = app(EmployeeService::class);
        $this->serviceDepartment = app(DepartmentService::class);
        $this->user = app(User::class);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($isEdit = false)
    {
        if (!$isEdit) {
            // Check mode and count exist data
            /** @var User */
            $user = Auth::user();
            if ($user->isModeFree()) {
                // Check count
                $countExisted = $this->serviceSkillMap->countByUser($user->id);
                if ($countExisted) {
                    // Redirect to list, not allow to add new
                    return redirect()->route("skillmap_list");
                }
            }
        }

        // Normal case
        $data = [
            'employee' => $this->serviceEmployee->getAll(),
            'skillLevel' => $this->serviceSkillLevel->getAll(),
            'department' => $this->serviceDepartment->getAll(),
        ];

        return view('skillmaps.index', $data);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function indexSkillMap()
    {
        $data = [
            'skillmap' => $this->serviceSkillMap->getAll(),
            'skillLevel' => $this->serviceSkillLevel->getAll(),
            'department' => $this->serviceDepartment->getAll(),
        ];
        return view('skillmaps.skillmaps_list', $data);
    }

    /**
     * Returns resource as a list.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function listSkillMap(Request $request)
    {
        $data = $this->serviceSkillMap->getListMap($request);
        $isAdmin = $this->user->isAdmin();
        $isModeFree = $this->user->isModeFree();
        return response()->json([
            'total' => $data->total(),
            'rows' => $data->getCollection(),
            'isAdmin' => $isAdmin,
            'isModeFree' => $isModeFree
        ]);
    }

     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function editSkillMap()
    {
        return $this->index(true);
    }

     /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroySkillMap($id)
    {
        try {
            $data = $this->serviceSkillMap->destroyListMap($id);
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
    public function list($id)
    {
        $isModeFree = $this->user->isModeFree();
        $data = $this->serviceSkillMap->getList($id);
        return response()->json([
            'rows' => $data,
            'isModeFree' => $isModeFree
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $data = $this->serviceSkillMap->store($request);
            // delete all file old pdf when change data
            $deletePdf = $request->get('deletePdf');
            if ($deletePdf === 'true') {
                $no = $request->get('no');
                $no = (int)$no < 10 ? '0' . $no : $no;
                $departmentId = $request->get('departmentId');
                $currentDept = Department::where('id', $departmentId)->get();
                $deptNo = $currentDept->first()->no;
                $fileName = "{$deptNo}_{$no}";
                $fileNameSkillMapA3 = $fileName . '_A3.pdf';
                $fileNameSkillMapA4 = $fileName . '_A4.pdf';
                $fileNameChartA3 = $fileName . '_Person_A3.pdf';
                $fileNameChartA4 = $fileName . '_Person_A4.pdf';
                $user = auth()->user()->id;
                $pathFile = Constant::PDF_PATH_FILE. '/' .  $user . '/' . $departmentId  . '/' . $no;
                if (is_dir($pathFile)) {
                    if (file_exists($pathFile . '/'. $fileNameSkillMapA3)) {
                        unlink($pathFile . '/'. $fileNameSkillMapA3);
                    }
                    if (file_exists($pathFile . '/'. $fileNameSkillMapA4)) {
                        unlink($pathFile . '/'. $fileNameSkillMapA4);
                    }
                    if (file_exists($pathFile . '/'. $fileNameChartA3)) {
                        unlink($pathFile . '/'. $fileNameChartA3);
                    }
                    if (file_exists($pathFile . '/'. $fileNameChartA4)) {
                        unlink($pathFile . '/'. $fileNameChartA4);
                    }
                }
            }
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
            $data = $this->serviceSkillMap->destroy($id);

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'errors' => __(Constant::MESSAGES['SYSTEM_ERROR'])
            ], 500);
        }
    }

      /**
     * Copy the specified resource from storage.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function copySkillMap(Request $request)
    {
        try {
            $data = $this->serviceSkillMap->copySkillMap($request);
            return response()->json($data);
        } catch (\Exception $e) {
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
    public function skillLevelList(Request $request)
    {
        $data = $this->serviceSkillLevel->getAll($request);
        return response()->json([
            'total' => $data->count(),
            'rows' => $data->toArray()
        ]);
    }

    /**
     * Returns resource bu id
     *
     * @param  int id
     * @return \Illuminate\Http\Response
     */
    public function getDataSkillMap($id)
    {
        $data = $this->serviceSkillMap->getDataSkillMap($id);
        return response()->json([
            'rows' => $data,
        ]);
    }
}
