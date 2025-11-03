<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminRegisterRequest;
use App\Http\Requests\AuthLoginRequest;
use App\Http\Requests\AuthRegisterRequest;
use App\Models\Admin;
use App\Traits\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAccessController extends Controller
{
    use Response;


    public function login(AuthLoginRequest $request)
    {
        $credentials = $request->validated();

        // Manually find the admin and check credentials
        $admin = Admin::where('email', $credentials['email'])->first();

        if ($admin && Hash::check($credentials['password'], $admin->password)) {
            // If credentials are correct, create and return a token
            $token = $admin->createToken('Laravel Personal Access Client')->accessToken;
            return $this->success(['admin' => $admin, 'token' => $token], "Admin logged in successfully");
        }

        return $this->error('Invalid credentials', 401);
    }

    public function amIAdmin()
    {
        // This method checks if the user is authenticated as an admin
        $admin = auth()->user();

        if ($admin && $admin instanceof Admin) {
            return $this->success(['is_admin' => true, 'admin' => $admin], 'User is an admin');
        }

        return $this->error('User is not an admin', 403);

    }

    public function logout(Request $request)
    {
        // This is correct. The auth:admin-api middleware makes the user available on the request.
        $request->user()->token()->revoke();
        return $this->success(null, 'Admin logged out successfully');
    }

    public function registerFirst(AuthRegisterRequest $request)
    {
        if (Admin::count() > 0) {
            return $this->error('An admin account already exists.', 403);
        }

        $validatedData = $request->validated();

        // Create the new admin - REMOVED Hash::make()
        $admin = Admin::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => $validatedData['password'], // The model's mutator will hash this
            'is_super_admin' => true,
        ]);

        $admin->assignRole('superAdmin');

        $token = $admin->createToken('Laravel Personal Access Client')->accessToken;
        return $this->success(['admin' => $admin, 'token' => $token], 'Admin registered successfully');
    }


}
