<?php

namespace App\Http\Controllers;

use App\Services\PdfService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Session;
use Barryvdh\DomPDF\Facade\Pdf;
use Barryvdh\Snappy\Facades\SnappyPdf;
use Illuminate\Support\Facades\File;
use App\Common\Constant;

class PdfController extends Controller
{
    public function __construct()
    {
        $this->servicePdf = app(PdfService::class);
    }

    /**
     * Generate html
     *
     * @param Request $request
     */
    public function getHtmlPDF(Request $request)
    {
        try {
            // Get parameter request
            $size = $request->get('size');
            $no = $request->get('no');
            $chart = filter_var($request->get('chart'), FILTER_VALIDATE_BOOLEAN);
            $render = filter_var($request->get('render'), FILTER_VALIDATE_BOOLEAN);
            $departmentId = $request->get('department_id');
            if (empty($no) || $no == "null") {
                $no = 0;
            }
            $url = 'http://';
            if (isset($_SERVER['HTTP']) && $_SERVER['HTTPS'] === 'on') {
                $url = 'https://';
            }
            $url .= $_SERVER['SERVER_NAME'];

            $no = (int)$no < 10 ? '0' . $no : $no;
            $content = $this->servicePdf->loadContent($request, $no, $chart);
            // get title file name
            $fileName = $content["titleFileName"];
            Session::put("render", $render);
            if ($chart) {
                $view = View::make('skillmaps.chart', $content); // display chart
            } else {
                $view = View::make('skillmaps.pdf', $content); // display skill map list
            }
            $content = $view->render();
            $content = str_replace('http://localhost', $url, $content);
            if ($chart) {
                $content .= json_decode($request->get('html'));
            }
            $html = "{$content}";

            // put to session
            Session::put("pdfHtml", $html);
            Session::put("chart", $chart);
            Session::put("fileName", $fileName);
            Session::put("fileNameTmp", $fileName);
            Session::put("size", $size);
            Session::put("departmentId", $departmentId);
            Session::put("no", $no);
            return response()->json(['data' => true]);
        } catch (\Throwable $th) {
            return response()->json(
                ['errors' => $th->getMessage()], 500
            );
        }
    }

    /**
     * Export to PDF
     */
    public function exportPDF()
    {
        try {
            // get information data form request parameter
            $size = Session::get("size");
            $fileName = Session::get("fileName");
            $fileNameTmp = Session::get("fileNameTmp");
            $departmentId = Session::get("departmentId");
            $render = Session::get("render");
            $html = Session::get("pdfHtml");
            $chart = Session::get("chart");
            $no = Session::get("no");
            if ($chart) {
                $tmpA3 = $fileName . '_A3.pdf';
                $tmpA4 = $fileName . '_A4.pdf';
                $fileName = $fileName . '_Person_' . $size . '.pdf';
                $fileNameTmp = $fileNameTmp . '_Person_' . ($size == 'A3' ? 'A4' : 'A3' ). '.pdf';
            } else {
                $tmpA3 = $fileName . '_Person_A3.pdf';
                $tmpA4 = $fileName . '_Person_A4.pdf';
                $fileName = $fileName . '_' . $size . '.pdf';
                $fileNameTmp = $fileNameTmp . '_' . ($size == 'A3' ? 'A4' : 'A3' ). '.pdf';

            }
            $user = auth()->user()->id;

            $pathFile = Constant::PDF_PATH_FILE;
            // domPDF
            if ($chart) {
                // get current operation system run
                $userAgent = getenv("HTTP_USER_AGENT");
                if (strpos($userAgent, "Mac")) {
                    // if operation is MAC, it will set max_execution_time
                    set_time_limit(300);
                }
            } else {
                // domPDF
                $pdf = Pdf::loadHTML($html);
                // setup the paper size and orientation
                $pdf->setPaper($size, "landscape");
                $pdf->setOption(
                    ['defaultFont' => 'yugothib']
                );
            }
            // create a dest path by user and department
            // example: /username/department/No./Filename_Ax.pdf
            $pathFile .= '/' .  $user . '/' . $departmentId  . '/' . $no;
            if (!is_dir($pathFile)) {
                // create absolute path if not exist
                // mkdir($pathFile);
                File::makeDirectory($pathFile, 0777, true, true);
            }
            // if data change, it will be render from data request
            if ($render) {
                // delete all file pdf with old data (A3, A4) in folder
                if (file_exists($pathFile . '/'. $fileName)) {
                    unlink($pathFile . '/'. $fileName);
                }
                if (file_exists($pathFile . '/'. $fileNameTmp)) {
                    unlink($pathFile . '/'. $fileNameTmp);
                }
                if (file_exists($pathFile . '/'. $tmpA3)) {
                    unlink($pathFile . '/'. $tmpA3);
                }
                if (file_exists($pathFile . '/'. $tmpA4)) {
                    unlink($pathFile . '/'. $tmpA4);
                }
                if ($chart) {
                    // Snappy
                    $snappy = SnappyPdf::loadHTML($html)
                        ->setPaper($size)
                        ->setOrientation('landscape')
                        ->setOption('margin-bottom', 0)
                        ->inline($fileName);
                    file_put_contents($pathFile . '/'. $fileName, $snappy);
                    unset($html);
                    unset($snappy);
                    $result = public_path($pathFile . '/'. $fileName);
                } else {
                    $fileNameTmp = $fileNameTmp . '_' . ($size == 'A3' ? 'A4' : 'A3' ). '.pdf';
                    $result = $this->renderAndSavePdf($pdf, $pathFile . '/'. $fileName, $html);
                }
            } else { // if data is not change
                if (file_exists($pathFile . '/'. $fileName)) {
                    // free memory
                    unset($html);
                    unset($pdf);
                    // read file pdf in folder above to browser
                    $result = public_path($pathFile . '/'. $fileName);
                } else { // if not exist file pdf
                    if ($chart) {
                        // Snappy
                        $snappy = SnappyPdf::loadHTML($html)
                            ->setPaper($size)
                            ->setOrientation('landscape')
                            ->setOption('margin-bottom', 0)
                            ->inline($fileName);
                        file_put_contents($pathFile . '/'. $fileName, $snappy);
                        unset($html);
                        unset($snappy);
                        $result = public_path($pathFile . '/'. $fileName);
                    } else {
                        $result = $this->renderAndSavePdf($pdf, $pathFile . '/'. $fileName, $html);
                    }
                }
            }
            // display file pdf on browser
            header('Content-Type: application/pdf');
            header('Content-Disposition: inline; filename="' . $fileName . '"');
            header('Content-Transfer-Encoding: binary');
            header('Accept-Ranges: bytes');
            @readfile($result);
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
