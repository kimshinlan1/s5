<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Department;
use App\Models\Team;
use App\Services\PatternDeptSettingService;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Session;
use App\Services\PatternTeamInspectionPDFService;
use Barryvdh\Snappy\Facades\SnappyPdf;
use Illuminate\Support\Facades\File;

use Illuminate\Http\Request;

class PatternTeamInspectionPDFController extends Controller
{
    /* @var team_service */
    private $service;

    public function __construct(PatternTeamInspectionPDFService $service)
    {
        $this->service = $service;
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
        $teamId = $request->get('teamId');
        $deptId = $request->get('deptId');
        $patternDeptId = Department::find($deptId)->dept_pattern_id;
        $compId = Department::find($deptId)->company_id;
        $data = app(PatternDeptSettingService::class)->getData($patternDeptId);

        $data = json_decode(json_encode($data), true);
        $view = View::make('pattern.partials.data_team_inspection_pdf', [
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
            $html = Session::get("pdfHtml");

            $snappy = SnappyPdf::loadHTML($html)
                        ->setPaper('A4')
                        ->setOptions([
                            'margin-bottom' => 0,
                        ])
                        ->setOrientation('landscape');
                        // display file pdf on browser
            header('Content-Type: application/pdf');
            header('Content-Disposition: inline; filename="' . 'table.pdf' . '"');
            header('Content-Transfer-Encoding: binary');
            header('Accept-Ranges: bytes');
            return  $snappy->inline('table.pdf');
        } catch (\Throwable $th) {
            return response()->json(
                ['errors' => $th->getMessage()], 500
            );
        }
    }

    /**
     * Render and save PDF
     */
    public function renderAndSavePdf($pdf, $path, $html)
    {
        $pdf->render();
        // save file pdf to folder
        file_put_contents($path, $pdf->output());
        // free memory
        unset($html);
        unset($pdf);
        // read file pdf in folder above to browser
        return public_path($path);
    }

}
