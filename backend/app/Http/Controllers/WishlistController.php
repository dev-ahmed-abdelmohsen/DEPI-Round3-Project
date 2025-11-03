<?php

namespace App\Http\Controllers;
use App\Http\Requests\WishlistModifyRequest;
use App\Models\User;
use App\Traits\Response;
use Illuminate\Http\Request;

//todo: use auth middleware to get the authenticated user
// todo: refactor the code to use functions rather than repeating the same code

class WishlistController extends Controller
{
    use Response;
    public function index(Request $request)
    {
        $user = User::findOrFail(3); // Replace with auth()->user() in production
        $wishlists = $user->wishlists()->with('wishlists')->get();
        if ($wishlists->isEmpty()) {
            return $this->error('Wishlist is empty', 404);
        }
        $wishlistItems = $wishlists->map(function ($wishlistItem) {
            return [
                'id' => $wishlistItem->id,
                'product_id' => $wishlistItem->pivot->product_id,
                'product' => [
                    'id' => $wishlistItem->id,
                    'name' => $wishlistItem->name,
                    'price' => $wishlistItem->price,
                    'image' => $wishlistItem->primaryImage->image_path ?? null,
                ],
            ];
        });
        return $this->success($wishlistItems, 'Wishlist items retrieved successfully');
    }

    public function add(WishlistModifyRequest $request)
    {
        $validatedData = $request->validated();
        $user = User::findOrFail(3); // Replace with auth()->user() in production
        $productId = $validatedData['product_id'];

        $syncResult = $user->wishlists()->syncWithoutDetaching([$productId]);

        if (empty($syncResult['attached'])) {
            return $this->error('Product already in wishlist');
        }

        $wishlistItem = $user->wishlists()->where('product_id', $productId)->first();

        return $this->success($wishlistItem, 'Wishlist item added');
    }
    public function remove($id)
    {
        // Logic to remove an item from the cart
        $user =User::findOrFail(3);
        $detachedCount = $user->wishlists()->detach($id);

        if ($detachedCount === 0) {
            return $this->error('Wishlist item not found', 404);
        }

        return $this->success(null, 'Wishlist item removed');
    }


    public function removeAll(){
        // Logic to remove all items from the wishlist
        $user = User::findOrFail(3); // Replace with auth()->user() in production
        $detachedCount = $user->wishlists()->detach();

        if ($detachedCount === 0) {
            return $this->error('No wishlist item can be found', 404);
        }

        return $this->success(null, 'All wishlist items removed');
    }
}
