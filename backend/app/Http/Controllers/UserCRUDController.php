<?php

//Todo Test Apis

namespace App\Http\Controllers;

use App\Http\Requests\AdminUserUpdateRequest;
use App\Http\Requests\AuthRegisterRequest;
use App\Http\Requests\IndexRequest;
use App\Http\Requests\UserSearchRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserCRUDController extends Controller
{
    use \App\Traits\Response; // Assuming you have a Response trait for consistent API responses


    //user self update can be defined here
    //todo: user self update
    public function userSelfUpdate()
    {
        // Logic to update the authenticated user's information
        // This could include updating name, email, password, etc.
        // Ensure to validate the request data before processing

    }



    //user self delete can be defined here

    public function userSelfDelete()
    {

        // Logic to delete the authenticated user's account
        // This should be handled with care, ensuring that the user confirms their action
        // and that all related data is handled appropriately (e.g., orders, carts, etc.)

        if(Auth::user()->delete())
            {
            return $this->success(null, 'User account deleted successfully');
        }
        return $this->error('Failed to delete user account', 500);
    }







    //user crud from admin panel can be defined here

    public function index(IndexRequest $request)
    {
        // Logic to retrieve a list of users
        // This could include pagination, sorting, and filtering options
        // Ensure to handle permissions and only allow access to authorized users
        $validatedData = $request->validated();

        $users = User::orderBy('id', 'asc')->paginate(
            $validatedData['per_page'] ?? 15 // Default to 15 per page if not specified
        );
        return $this->success($users, 'Users retrieved successfully');
    }

    public function show($id)
    {
        // Logic to retrieve a specific user by ID
        $user = User::find($id);
        if (!$user) {
            return $this->error('User not found', 404);
        }
        // Logic to show a specific user
        return $this->success($user, 'User retrieved successfully');

    }

    public function create(AuthRegisterRequest $request)
    {
        $validatedData = $request->validated();

        // Create the new user
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'phone' => $validatedData['phone'] ?? null,
            'address' => $validatedData['address'] ?? null,
        ]);

        // Create an access token
        $token = $user->createToken('Laravel Personal Access Client')->accessToken;

        // Logic for user registration
        return $this->success(['user' => $user, 'token' => $token], 'User registered successfully');
    }

    public function update(AdminUserUpdateRequest $request, User $user)
    {
        // Logic to update a specific user

        $validatedData = $request->validated();
        // Ensure the user exists before attempting to update

        if (!$user) {
            return $this->error('User not found', 404);
        }
        // Update the user with the validated data
        $user->name = $validatedData['name'] ?? $user->name;
        $user->email = $validatedData['email'] ?? $user->email;
        if (!empty($validatedData['password'])) {
            $user->password = Hash::make($validatedData['password']);
        }
        // Save the updated user
        if ($user->save()) {
            return $this->success($user, 'User updated successfully');
        }
        return $this->error('Failed to update user', 500);


    }

    public function delete($id)
    {
        // Logic to delete a specific user
//        $user = User::where('id', $id)->whereNull('deleted_at')->first();
        $user = User::where('id', $id)->first();
         // Ensure the user exists before attempting to delete
         // If the user does not exist, return an error response
        if (!$user) {
            return $this->error('User not found', 404);
        }
        if ($user->delete()) {
            return $this->success(null, 'User deleted successfully');
        }
        return $this->error('Failed to delete user', 500);
    }

    function search(UserSearchRequest $request)
    {
        $validatedData = $request->validated();
        $query = User::query();

        if (!empty($validatedData['query'])) {
            $query->where('name', 'like', '%' . $validatedData['query'] . '%');
        }

        if (!empty($validatedData['role'])) {
            $query->where('role', $validatedData['role']);
        }

        if (!empty($validatedData['email'])) {
            $query->where('email', 'like', '%' . $validatedData['email'] . '%');
        }






        if (!empty($validatedData['sort_by'])) {
            $sortBy = $validatedData['sort_by'];
            $sortDirection = $validatedData['sort_direction'] ?? 'asc';
            if (in_array($sortBy, ['name', 'email', 'created_at', 'updated_at'])) {
                $query->orderBy($sortBy, $sortDirection);
            } else {
                return $this->error('Invalid sort field', 400);
            }
        }



        $users = $query->paginate($validatedData['per_page'] ?? 10);

        return $this->success($users, 'User search');
    }


}
