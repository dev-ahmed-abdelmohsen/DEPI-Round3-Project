<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        Permission::create(['name' => 'edit products', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'delete products', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'create products', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'view products', 'guard_name' => 'admin-api']);

        Permission::create(['name' => 'edit categories', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'delete categories', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'create categories', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'view categories', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'edit subcategories', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'delete subcategories', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'create subcategories', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'view subcategories', 'guard_name' => 'admin-api']);

        Permission::create(['name' => 'edit users', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'delete users', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'create users', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'view users', 'guard_name' => 'admin-api']);

        Permission::create(['name' => 'edit admins', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'delete admins', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'create admins', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'view admins', 'guard_name' => 'admin-api']);

        Permission::create(['name' => 'edit roles', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'delete roles', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'create roles', 'guard_name' => 'admin-api']);
        Permission::create(['name' => 'view roles', 'guard_name' => 'admin-api']);


        $superAdminRole = Role::create(['name' => 'superAdmin', 'guard_name' => 'admin-api']);
        $superAdminPermissions = [
            'edit products', 'delete products', 'create products', 'view products',
            'edit categories', 'delete categories', 'create categories', 'view categories',
            'edit subcategories', 'delete subcategories', 'create subcategories', 'view subcategories',
            'edit users', 'delete users', 'create users', 'view users',
            'edit admins', 'delete admins', 'create admins', 'view admins',
            'edit roles', 'delete roles', 'create roles', 'view roles'
        ];
        $superAdminRole->givePermissionTo($superAdminPermissions);


        $productOperatorRole = Role::create(['name' => 'productOperator', 'guard_name' => 'admin-api']);
        $productOperatorPermissions = [
            'edit products', 'delete products', 'create products', 'view products',
            'edit categories', 'delete categories', 'create categories', 'view categories',
            'edit subcategories', 'delete subcategories', 'create subcategories', 'view subcategories'
        ];
        $productOperatorRole->givePermissionTo($productOperatorPermissions);


        $userOperatorRole = Role::create(['name' => 'userOperator', 'guard_name' => 'admin-api']);
        $userOperatorPermissions = [
            'edit users', 'delete users', 'create users', 'view users',
        ];
        $userOperatorRole->givePermissionTo($userOperatorPermissions);


        $adminOperatorRole = Role::create(['name' => 'adminOperator', 'guard_name' => 'admin-api']);
        $adminOperatorPermissions = [
            'view admins', 'edit admins', 'delete admins', 'create admins', 'view admins',
            'edit roles', 'delete roles', 'create roles', 'view roles'
        ];
        $adminOperatorRole->givePermissionTo($adminOperatorPermissions);


    }
}
