<?php

namespace App\Http\Middleware;

use Closure;
use App\Common\LogUtil;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Database\QueryException;

class AccessMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle($request, Closure $next)
    {
        $class = (new \ReflectionClass(Route::getCurrentRoute()->getControllerClass()))->getShortName();
        $function = Route::getCurrentRoute()->getActionMethod();
        LogUtil::setClassName($class);
        LogUtil::logInfo($function);

        // Check all actions with method
        if (in_array($request->getMethod(), ["GET", "POST", "PUT", "DELETE"])) {
            try {
                $response = $next($request);
            } catch (QueryException $e) {
                LogUtil::setClassName($class);
                LogUtil::logError($function, $e->getMessage());
                $response = (new Controller())->responseException(__('Error_SQL_Not_valid'));
            } catch (\Exception $e) {
                LogUtil::setClassName($class);
                LogUtil::logError($function, $e->getMessage());
                $response = (new Controller())->responseException();
            }
            return $response;
        }
        return $next($request);
    }
}
