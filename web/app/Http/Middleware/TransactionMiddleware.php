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
        if (in_array($request->getMethod(), ["POST", "PUT", "DELETE"])) {

            $class = (new \ReflectionClass(Route::getCurrentRoute()->getControllerClass()))->getShortName();
            $function = Route::getCurrentRoute()->getActionMethod();
            LogUtil::setClassName($class);
            LogUtil::logInfo($function);

            DB::beginTransaction();

            try {
                $response = $next($request);
            } catch (QueryException $e) {
                DB::rollBack();
                LogUtil::setClassName($class);
                LogUtil::logError($function, $e->getMessage());
                return (new Controller())->responseException(__('Error_SQL_Not_valid'));
            } catch (\Exception $e) {
                DB::rollBack();
                LogUtil::setClassName($class);
                LogUtil::logError($function, $e->getMessage());
                return (new Controller())->responseException();
            }
            DB::commit();
            return $response;
        }
        return $next($request);
    }
}
