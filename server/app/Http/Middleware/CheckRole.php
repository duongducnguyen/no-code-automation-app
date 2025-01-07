<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  mixed  ...$roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Kiểm tra API authentication
        if (!Auth::guard('api')->check()) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. Please login first.'
            ], 401);
        }

        // Lấy user hiện tại từ token
        $user = Auth::guard('api')->user();
        
        // Kiểm tra role
        if (!in_array($user->role, $roles)) {
            return response()->json([
                'status' => false,
                'message' => 'Permission denied. You do not have the required role.'
            ], 403);
        }

        return $next($request);
    }
}