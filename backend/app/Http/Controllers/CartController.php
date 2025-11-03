<?php

namespace App\Http\Controllers;

use App\Http\Requests\CartAddProductRequest;
use App\Http\Requests\CartSubtractProductRequest;
use App\Models\User;
use App\Traits\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

//todo: use auth middleware to get the authenticated user
// todo: refactor the code to use functions rather than repeating the same code

class CartController extends Controller
{
    use Response;
    public function index(Request $request)
    {
        $user = auth()->user(); // Replace with auth()->user() in production
        $cartItems = $user->cartItems()->wherePivotNull('deleted_at')->with('carts')->get();
        if ($cartItems->isEmpty()) {
            return $this->error('Cart is empty', 404);
        }
        $cartItems = $cartItems->map(function ($cartItem) {
            return [
                'id' => $cartItem->id,
                'product_id' => $cartItem->pivot->product_id, // is this needed?
                'quantity' => $cartItem->pivot->quantity,
                'product' => [
                    'id' => $cartItem->id,
                    'name' => $cartItem->name,
                    'price' => $cartItem->price,
                    'image' => $cartItem->primaryImage->image_path ?? null,
                ],
            ];
        });
        return $this->success($cartItems, 'Cart items retrieved successfully');
//        return $this->success('', 'Cart index');
    }

    public function add(CartAddProductRequest $request)
    {
        $validatedData = $request->validated();

        $user = auth()->user();
        $cartItem = $user->cartItems()->wherePivotNull('deleted_at')->where('product_id', $validatedData['product_id'])->first();

        if ($cartItem) {
            $newQuantity = $cartItem->pivot->quantity + $validatedData['quantity'];
            $user->cartItems()->wherePivotNull('deleted_at')->updateExistingPivot($validatedData['product_id'], ['quantity' => $newQuantity]);
        } else {
            $user->cartItems()->attach($validatedData['product_id'], ['quantity' => $validatedData['quantity']]);
        }

        return $this->success($user->cartItems()->wherePivotNull('deleted_at')->where('product_id', $validatedData['product_id'])->first(), 'Cart item added');
    }

    public function subtract(CartSubtractProductRequest $request)
    {
        $validatedData = $request->validated();

        $user = auth()->user();
        $cartItem = $user->cartItems()->wherePivotNull('deleted_at')->where('product_id', $validatedData['product_id'])->first();
        if (!$cartItem) {
            return $this->error('Cart item not found', 404);
        }
        if ($cartItem->pivot->quantity > $validatedData['quantity']) {
            $newQuantity = $cartItem->pivot->quantity - $validatedData['quantity'];
            $user->cartItems()->wherePivotNull('deleted_at')->updateExistingPivot($validatedData['product_id'], ['quantity' => $newQuantity]);
            return $this->success($user->cartItems()->wherePivotNull('deleted_at')->where('product_id', $validatedData['product_id'])->first(), 'Cart item quantity decremented');
        } else {
            $user->cartItems()->detach($validatedData['product_id']);
            return $this->success(null, 'Cart item removed');
        }

    }
    public function remove($id)
    {
        // Logic to remove an item from the cart
        $user = auth()->user();
        $cartItem = $user->cartItems()->wherePivotNull('deleted_at')->where('product_id', $id)->first();
        if (!$cartItem) {
            return $this->error('Cart item not found', 404);
        }
        $user->cartItems()->detach($id);
        return $this->success(null, 'Cart item removed');
    }

    public function removeAll(){
        // Logic to remove all items from the wishlist
        $user = auth()->user(); // Replace with auth()->user() in production
        $detachedCount = $user->cartItems()->detach();

        if ($detachedCount === 0) {
            return $this->error('No cart item can be found', 404);
        }

        return $this->success(null, 'All cart items removed');
    }

}
