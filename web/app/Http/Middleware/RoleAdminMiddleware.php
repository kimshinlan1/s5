<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Providers\RouteServiceProvider;

class RoleAdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // if (Auth::check()) {
        //     // if user is not admin take him to his dashboard
        //     if (Auth::user()->isUser()) {
        //         // abort(500, "Not permission");
        //         return $next($request);
        //     } elseif (Auth::user()->isAdmin()) {
        //         // allow admin or super admin to proceed with request
        //         return $next($request);
        //     }
        // }
        // abort(404);  // for other user throw 404 error

        if (Auth::check() && Auth::user()->isAdmin()) {
            // allow admin or super admin to proceed with request
            return $next($request);
        }
        abort(500, "Not permission");  // for other user throw 404 error
    }
}
