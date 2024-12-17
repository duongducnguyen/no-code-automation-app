<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Exception;

class AuthController extends Controller
{
    // Đăng ký
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6|confirmed',
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            return response()->json(['message' => 'User registered successfully'], 201);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Registration failed',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    // Lấy thông tin người dùng từ Token
    public function getUserFromToken(Request $request)
    {
        try {
            // Lấy thông tin người dùng đã được xác thực
            $user = Auth::user();
    
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }
    
            return response()->json(['user' => $user], 200);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Failed to get user from token',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    // Đăng nhập
    public function login(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');

            if (!$token = Auth::attempt($credentials)) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            return $this->respondWithToken($token);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Login failed',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    // Refresh token
    public function refresh()
    {
        try {
            $newToken = JWTAuth::refresh();
            return $this->respondWithToken($newToken);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Token refresh failed',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    // Đăng xuất
    public function logout()
    {
        try {
            Auth::logout();
            return response()->json(['message' => 'Successfully logged out']);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Logout failed',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    // Trả về token
    protected function respondWithToken($token)
    {
        try {
            return response()->json([
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60, // Thời gian hết hạn (giây)
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Token response failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}