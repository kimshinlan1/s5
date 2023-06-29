<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request){
        try {
            $user = User::create([
                'name' => $request->input('name'),
                'password' => Hash::make($request->input('password')),
                'identifier' => $request->input('identifier'),
                'role_id' => $request->input('roleID'),
                'company_id' => $request->input('companyID')
                ]);

            $token = $user->createToken('user_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token
            ], 200);
        } catch (\Exception $e){
            return response()->json([
                'error' => $e->getMessage(),
                'message' => 'Something went wrong with Authentication'
            ]);
        }
    }
    
    public function login(Request $request){
        try {
            $user = User::where('identifier', '=', $request->input('identifier'))->firstOrFail();
            if(!Hash::check($request->input('password'), $user->password)){
                $token = $user->createToken('user_token')->plainTextToken;
                return response()->json([
                    'user' => $user,
                    'token' => $token
                ], 200);
            }
            return response()->json([
                'error' => 'Something went wrong'
            ]);
        } catch (\Exception $e){
            return response()->json([
                'error' => $e->getMessage(),
                'message' => 'Something went wrong with Authentication'
            ]);
        }
    }
}
