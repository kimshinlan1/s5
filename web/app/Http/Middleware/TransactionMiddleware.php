<?php

namespace App\Http\Middleware;

use Closure;
use App\Common\LogUtil;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;
use Illuminate\Database\QueryException;

class TransactionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (in_array($request->getMethod(), ["GET", "POST", "PUT", "DELETE"])) {

            $class = (new \ReflectionClass(Route::getCurrentRoute()->getControllerClass()))->getShortName();
            $function = Route::getCurrentRoute()->getActionMethod();
            LogUtil::setClassName($class);
            LogUtil::logInfo($function);

            // Use transaction without GET
            if (!in_array($request->getMethod(), ["GET"])) {
                DB::beginTransaction();
            }

            try {
                $response = $next($request);
            } catch (QueryException $e) {
                if (!in_array($request->getMethod(), ["GET"])) {
                    DB::rollBack();
                }
                LogUtil::setClassName($class);
                LogUtil::logError($function, $e->getMessage());
                return (new Controller())->responseException(__('Common_Error_SQL_Exception'));
            } catch (\Exception $e) {
                if (!in_array($request->getMethod(), ["GET"])) {
                    DB::rollBack();
                }
                LogUtil::setClassName($class);
                LogUtil::logError($function, $e->getMessage());
                return (new Controller())->responseException();
            }

            if (!in_array($request->getMethod(), ["GET"])) {
                DB::commit();
            }

            return $response;
        }
        return $next($request);
    }
}
