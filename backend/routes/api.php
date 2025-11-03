<?php

use App\Http\Controllers\Auth\AdminAccessController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\ProductController;
use \App\Http\Controllers\AuthController;
use \App\Http\Controllers\CartController;
use \App\Http\Controllers\WishlistController;
use \App\Http\Controllers\OrderController;
use \App\Http\Controllers\CategoryController;


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


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/amIUser', [AuthController::class, 'amIUser']);
});








Route::prefix('products')->group(function () {

    Route::get('/', [ProductController::class, 'index'])
        ->name('product.index');

    Route::get('/search', [ProductController::class, 'search'])
        ->name('product.search');

    Route::get('/{product}', [ProductController::class, 'show'])
        ->where('product', '[0-9]+')
        ->name('product.show');

});

Route::get('/categories', [CategoryController::class, 'index']);


Route::middleware('auth:api')->prefix('cart')->group(function () {

    Route::get('/', [CartController::class, 'index'])
        ->name('cart.index');

    Route::post('/add', [CartController::class, 'add'])
        ->name('cart.add');

    Route::post('/subtract', [CartController::class, 'subtract'])
        ->name('cart.subtract');

    Route::delete('/remove/{id}', [CartController::class, 'remove'])
        ->where('id', '[0-9]+')
        ->name('cart.remove');

    Route::delete('/remove-all', [CartController::class, 'removeAll'])
        ->name('cart.removeAll');
});


Route::middleware('auth:api')->prefix('wishlist')->group(function () {

    Route::get('/', [WishlistController::class, 'index'])
        ->name('wishlist.index');

    Route::post('/add', [WishlistController::class, 'add'])
        ->name('wishlist.add');

    Route::delete('/remove/{id}', [WishlistController::class, 'remove'])
        ->where('id', '[0-9]+')
        ->name('wishlist.remove');

    Route::delete('/remove-all', [WishlistController::class, 'removeAll'])
        ->name('wishlist.removeAll');
});


Route::middleware('auth:api')->prefix('order')->group(function () {

    Route::get('/', [OrderController::class, 'index'])
        ->name('order.index');

    Route::post('/', [OrderController::class, 'create'])
        ->name('order.create');

    Route::get('/{id}', [OrderController::class, 'show'])
        ->where('id', '[0-9]+')
        ->name('order.show');

    Route::put('/update/{id}', [OrderController::class, 'update'])
        ->where('id', '[0-9]+')
        ->name('order.update');

    Route::delete('/cancel/{id}', [OrderController::class, 'cancel'])
        ->where('id', '[0-9]+')
        ->name('order.cancel');
//    Route::delete('/delete/{id}', [OrderController::class, 'delete'])
//        ->where('id', '[0-9]+')
//        ->name('order.delete');
//
//    Route::get('/track/{id}', [OrderController::class, 'track'])
//        ->where('id', '[0-9]+')
//        ->name('order.track');
//
//    Route::get('/status/{id}', [OrderController::class, 'status'])
//        ->where('id', '[0-9]+')
//        ->name('order.status');
//    Route::get('/history', [OrderController::class, 'history'])
//        ->name('order.history');
//
});


Route::post('/adminRegisterFirst', [AdminAccessController::class, 'registerFirst']);
Route::post('/adminLogin', [AdminAccessController::class, 'login']);







//Route::get('/test', function () {
////    return response()->json(['message' => 'Hello, World!']);
//    $products = \App\Models\Category::all();
//
////    dd($products);
//    dd($products);
////    return response()->json($products);
//});
