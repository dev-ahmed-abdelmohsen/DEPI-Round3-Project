<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdminRegisterRequest;
use App\Models\Admin;
use App\Traits\Response;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class AdminCRUDController extends Controller
{
    use Response;

    public function index()
    {
        $admins = Admin::all()->load('roles'); // Eager load roles if needed

        // Logic to list all admins
        return $this->success($admins);
    }
    public function show(Admin $admin)
    {
        $admin->load('roles'); // Eager load roles if needed
        // Logic to show a specific admin
        return $this->success($admin);
    }

    public function create(AdminRegisterRequest $request)
    {
        $validatedData = $request->validated();

        // Create the new admin - REMOVED Hash::make()
        $admin = Admin::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => $validatedData['password'], // The model's mutator will hash this
        ]);

        return $this->success($admin, 'Admin registered successfully');
//        $token = $admin->createToken('Laravel Personal Access Client')->accessToken;
//        return $this->success(['admin' => $admin, 'token' => $token], 'Admin registered successfully');
    }
    public function update(Admin $admin, Request $request)
    {


//        dd($request->all());


        // Validate the request data
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:admins,email,' . $admin->id, // Ensure the email is unique except for the current admin
            'password' => 'sometimes|required|string|min:8|confirmed', // Ensure password confirmation
            'phone' => 'sometimes|nullable|string|max:15',
            'address' => 'sometimes|nullable|string|max:255',
            'is_active' => 'sometimes|required|boolean',
            // 'profile_picture' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Optional profile picture validation
            'roles' => 'sometimes|required|array',
            'roles.*' => 'exists:roles,id', // Ensure each role exists
        ]);
        // If the password is provided, hash it
        if ($request->has('password')) {
            $request->merge(['password' => bcrypt($request->password)]);
        } else {
            // If password is not provided, remove it from the request
            $request->request->remove('password');
        }




        // at least one super admin is required
        $count = Admin::whereHas('roles', function ($query) {
            $query->where('name', 'superAdmin');
        })->count();

        if ( $count == 1 && $request->has('roles') &&$admin->roles()->where('name', 'superAdmin')->exists()) {
            return $this->error('at least one super admin is required, you can\'t reduce your access', 400);
        }

        if ($request->has('roles')) {
           // Ensure the admin has the role
            $admin->roles()->detach(); // Detach all roles first
            foreach ($request->get('roles') as $roleId) {
                $role = Role::find($roleId);
                if ($role) {
                    $admin->assignRole($role);
                } else {
                    return $this->error('Role not found', 404);
                }
            }
        }


        // Logic to update a specific admin
        $admin->update($request->all());
        $admin->refresh()->load('roles');  // Eager load roles if needed
        return $this->success($admin, 'Admin updated successfully');
    }
    public function delete(Admin $admin)
    {
        // Logic to delete a specific admin
        $admin->delete();
        return $this->success(null, 'Admin deleted successfully');
    }


    public function adminPermissions()
    {
        $permissions = auth()->user()->getAllPermissions();
        return $this->success($permissions, 'Admin permissions retrieved successfully.');

    }

}
