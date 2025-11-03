<?php

use App\Http\Controllers\AdminCRUDController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\SubcategoryController;
use App\Http\Controllers\UserCRUDController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\Auth\AdminAccessController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'users'], function () {
    Route::get('/', [UserCRUDController::class, 'index'])->middleware('permission:view users|edit users|delete users');
    Route::get('/{user}', [UserCRUDController::class, 'show'])->middleware('permission:view users|edit users|delete users');
    Route::post('/', [UserCRUDController::class, 'create'])->middleware('permission:create users');
    Route::patch('/{user}', [UserCRUDController::class, 'update'])->middleware('permission:edit users');
    Route::delete('/{user}', [UserCRUDController::class, 'delete'])->middleware('permission:delete users');
});


//todo : grouping the admin routes later

Route::get('/amIAdmin', [AdminAccessController::class, 'amIAdmin']);
Route::get('/adminPermissions', [AdminCRUDController::class, 'adminPermissions']);
//Route::post('/createAdmin', [AdminAccessController::class, 'create']);
Route::post('/logout', [AdminAccessController::class, 'logout']);


// Accessible at GET /api/admin/users
// Route::get('/users', [AdminUserController::class, 'index']);


Route::group(['prefix' => 'products'], function () {

    Route::get('/', [ProductController::class, 'index'])->middleware('permission:view products|edit products|delete products');
    Route::get('/{product}', [ProductController::class, 'show'])->middleware('permission:view products|edit products|delete products');
    Route::post('/', [ProductController::class, 'create'])->middleware('permission:create products');
    Route::patch('/{product}', [ProductController::class, 'update'])->middleware('permission:edit products');
    Route::delete('/{product}', [ProductController::class, 'delete'])->middleware('permission:delete products');

});

Route::group(['prefix' => 'categories'], function () {

    Route::get('/', [CategoryController::class, 'index'])->middleware('permission:view categories|edit categories|delete categories');
    Route::get('/{category}', [CategoryController::class, 'show'])->middleware('permission:view categories|edit categories|delete categories');
    Route::post('/', [CategoryController::class, 'create'])->middleware('permission:create categories');
    Route::patch('/{category}', [CategoryController::class, 'update'])->middleware('permission:edit categories');
    Route::delete('/{category}', [CategoryController::class, 'delete'])->middleware('permission:delete categories');

});

Route::group(['prefix' => 'subcategories'], function () {

    Route::get('/', [SubcategoryController::class, 'index'])->middleware('permission:view subcategories|edit subcategories|delete subcategories');
    Route::get('/{subcategory}', [SubcategoryController::class, 'show'])->middleware('permission:view subcategories|edit subcategories|delete subcategories');
    Route::post('/', [SubcategoryController::class, 'create'])->middleware('permission:create subcategories');
    Route::patch('/{subcategory}', [SubcategoryController::class, 'update'])->middleware('permission:edit subcategories');
    Route::delete('/{subcategory}', [SubcategoryController::class, 'delete'])->middleware('permission:delete subcategories');

});

Route::group(['prefix' => 'roles'], function () {

    Route::get('/', [RolesController::class, 'index'])->middleware('permission:view roles|edit roles|delete roles');
    Route::get('/permissions', [RolesController::class, 'permissionList'])->middleware('permission:view roles|edit roles|delete roles');
    Route::get('/{role}', [RolesController::class, 'show'])->middleware('permission:view roles|edit roles|delete roles');
    Route::post('/', [RolesController::class, 'create'])->middleware('permission:create roles');
    Route::patch('/{role}', [RolesController::class, 'update'])->middleware('permission:edit roles');
    Route::post('/{role}/add', [RolesController::class, 'assignPermissionToRole'])->middleware('permission:edit roles');
    Route::delete('/{role}/remove', [RolesController::class, 'removePermissionFromRole'])->middleware('permission:edit roles');
    Route::delete('/{role}', [RolesController::class, 'delete'])->middleware('permission:delete roles');


});


Route::group(['prefix' => 'admins'] ,function () {
    // Protected routes for admin users
    Route::get('/', [AdminCRUDController::class, 'index'])->middleware('permission:view admins|edit admins|delete admins');
    Route::get('/{admin}', [AdminCRUDController::class, 'show'])->middleware('permission:view admins|edit admins|delete admins');
    Route::post('/', [AdminCRUDController::class, 'create'])->middleware('permission:create admins');
    Route::patch('/{admin}', [AdminCRUDController::class, 'update'])->middleware('permission:edit admins');
    Route::delete('/{admin}', [AdminCRUDController::class, 'delete'])->middleware('permission:delete admins');


});
