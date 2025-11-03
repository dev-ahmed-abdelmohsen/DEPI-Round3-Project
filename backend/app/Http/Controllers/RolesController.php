<?php

namespace App\Http\Controllers;

use App\Traits\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesController extends Controller
{
    use Response;

    public function index()
    {
        $roles = Role::with('permissions')->orderBy('id')->get();
        return $this->success($roles, 'Roles retrieved successfully.');
    }

    public function show(Role $role)
    {
        $role->load('permissions');
        return $this->success($role, 'Role retrieved successfully.');
    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);


        if ($validator->fails()) {
            return $this->error($validator->errors()->all(), 422);
        }

        $role = Role::create(['name' => $request->name, 'guard_name' => 'admin-api']);

        if ($request->has('permissions')) {
            $permissions = $request->permissions;
            $role->syncPermissions($permissions);
        }
        $role->load('permissions');

        return $this->success($role, 'Role created successfully.', 201);
    }

    public function update(Request $request, Role $role)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|unique:roles,name,' . $role->id,
            'permissions' => 'sometimes|required|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->all(), 422);
        }

        if ($role->name === 'superAdmin') {
            return $this->error('Cannot update the superAdmin role.', 403);
        }


        $role->update(['name' => $request->name]);
        if ($request->has('permissions')) {
            $permissions = $request->permissions;
            $role->syncPermissions($permissions);
        }
        $role->load('permissions');

        return $this->success($role, 'Role updated successfully.');
    }

    public function delete(Role $role)
    {
        $role->delete();
        return $this->success(null, 'Role deleted successfully.');
    }

    public function assignPermissionToRole(Request $request, Role $role)
    {
        $validator = Validator::make($request->all(), [
            'permissions' => 'required|array|min:1',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->all(), 422);
        }

        $role->givePermissionTo($request->permissions);

        return $this->success($role->load('permissions'), 'Permissions assigned to role successfully.');
        }

        public function removePermissionFromRole(Request $request, Role $role)
    {
        $validator = Validator::make($request->all(), [
            'permissions' => 'required|array|min:1',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->all(), 422);
    }

        foreach ($request->permissions as $permissionName) {
            $role->revokePermissionTo($permissionName);
        }

        return $this->success($role->load('permissions'), 'Permissions removed from role successfully.');
    }


    public function permissionList()
    {
        $permissions = Permission::all();
        return $this->success($permissions, 'Permissions retrieved successfully.');
    }


}
