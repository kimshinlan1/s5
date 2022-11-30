<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\DB;

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
            DB::beginTransaction();

            $response = $next($request);
            if ($response->exception) {
                DB::rollBack();

                // Log error here

            } else {
                DB::commit();
            }
            return $response;
        }
        return $next($request);
    }
}
