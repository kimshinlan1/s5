<?php

namespace App\Exceptions;

use Exception;
use Throwable;
use App\Common\LogUtil;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Exception $e) {
            if (Route::getCurrentRoute()) {
                $class = (new \ReflectionClass(Route::getCurrentRoute()->getControllerClass()))->getShortName();
                $function = Route::getCurrentRoute()->getActionMethod();
                LogUtil::setClassName($class);
                LogUtil::logError($function, $e->getMessage());
            }
            abort(500, $e->getMessage());
        });
    }
}
