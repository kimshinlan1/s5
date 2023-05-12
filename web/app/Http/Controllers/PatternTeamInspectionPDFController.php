<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Department;
use App\Models\Team;
use App\Services\PatternDeptSettingService;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Session;
use Barryvdh\DomPDF\Facade\Pdf;

use Illuminate\Http\Request;

class PatternTeamInspectionPDFController extends Controller
{
    public function __construct()
    {

    }

    /**
     * Display a listing of the resource.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function loadPDFContent(Request $request)
    {
        // Get request data
        $teamId = $request->get('teamId');
        $deptId = Team::find($teamId)->department_id;

        // Get data for rendering
        $patternDeptId = Department::find($deptId)->dept_pattern_id;
        $compId = Department::find($deptId)->company_id;
        $data = app(PatternDeptSettingService::class)->getData($patternDeptId);
        $data = json_decode(json_encode($data), true);

        // Create view to render html pdf
        $view = View::make('pattern.partials.data_team_inspection_pdf_dom', [
            "data" => $data,
            "companyName" => Company::find($compId)->name,
            "departmentName" =>Department::find($deptId)->name,
            "teamName" => Team::find($teamId)->name,
        ]);
        $content = $view->render();
        $html = "{$content}";
        Session::put("pdfHtml", $html);

        return response()->json(['data' => true]);
    }
    /**
     * Display a listing of the resource.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function exportPDFContent()
    {
        try {
            // Get view from session
            $html = Session::get("pdfHtml");

            // DomPDF
            $pdf = Pdf::loadHTML($html);
            // setup the paper size and orientation
            $pdf->setPaper("A4", "landscape");
            $pdf->setOption(
                ['defaultFont' => 'yugothib']
            );
            return $pdf->stream();
        } catch (\Throwable $th) {
            return response()->json(
                ['errors' => $th->getMessage()], 500
            );
        }
    }
}
