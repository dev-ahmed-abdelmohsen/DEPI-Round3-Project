<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthLoginRequest;
use App\Http\Requests\AuthRegisterRequest;
use App\Models\User;
use App\Traits\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    use Response;
    public function register(AuthRegisterRequest $request)
    {
        $validatedData = $request->validated();

        // Create the new user
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        // Create an access token
        $token = $user->createToken('Laravel Personal Access Client')->accessToken;

        // Logic for user registration
        return $this->success(['user' => $user, 'token' => $token], 'User registered successfully', 201);
    }

    public function login(AuthLoginRequest $request)
    {
        // Get the validated credentials
        $credentials = $request->validated();

        // Attempt to authenticate the user
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('Laravel Personal Access Client')->accessToken;
            return $this->success(['user' => $user, 'token' => $token], "User logged in successfully");
        }

        return $this->error('Invalid credentials', 401);

    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return $this->success(null , 'User logged out successfully');
    }

    public function amIUser(Request $request)
    {
        if (Auth::check()) {
            $user = Auth::user();
            return $this->success(['user' => $user], 'User is authenticated');
        }
        return $this->error('User is not authenticated', 401);
    }
}
