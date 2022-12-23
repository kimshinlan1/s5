<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Support\Facades\File;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * Response Data
     *
     * @param object|array|null $data
     * @param int $code
     * @param string|null $message
     *
     * @return \Illuminate\Http\Response
     */
    public function sendResponse($data, int $code = 200, string $message = '')
    {
        $response = [
            'success' => true,
            'code' => $code,
            'message' => __($message),
            'total' => $this->service->getCount(),
            'data' => []
        ];

        if (!in_array($code, [200, 201, 202])) {
            if (is_array($data)) {
                $response['total'] = count($data);
                $response['data'] = $data;
            } elseif (is_object($data)) {
                $response['total'] = $data->total();
                $response['data'] = $data->getCollection();
            }
        } else {
            $response['data'] = $data;
        }


        return response()->json($response, $code);
    }

    /**
     * Response Exception
     *
     * @param string|null $message
     * @param int $code
     *
     * @return \Illuminate\Http\Response
     */
    public function responseException(string $message = '', int $code = 500)
    {
        if (empty($message)) {
            $message = __("Common_Error_System");
        }

        $response = [
            'success' => false,
            'message' => __($message),
            'errors' => __($message),
            'code' => $code
        ];
        return response()->json($response, $code);
    }

    /**
     * Return Error page
     *
     * @param integer $code
     * @param string $message
     */
    public function responseErrorPage($code = 404, $message = "")
    {
        if ($code == 404) {
            return abort(Response::HTTP_NOT_FOUND, $message);
        } elseif ($code == 500) {
            return abort(Response::HTTP_INTERNAL_SERVER_ERROR, $message);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $data = $this->service->destroy($id);
            return response()->json($data);
        } catch (QueryException $e) {
            return response()->json([
                'errors' => __("Common_Error_SQL_Exception")
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                'errors' => __("Common_Error_System")
            ], 500);
        }
    }

    /**
     * Display log
     *
     */
    public function showLog()
    {
        $file = collect(File::allFiles(storage_path()))
            ->filter(function ($file) {
                return in_array($file->getExtension(), ['log']);
            })
            ->map(function ($file) {
                return $file->getBaseName();
            });

        if ($file) {
            $log = $file->last();

            $numberLastLine = 100;
            $file = escapeshellarg(storage_path("logs/$log"));
            $line = `tail -n $numberLastLine $file`;
            dd($line);
        }
        dd("NO LOG");
    }
}
