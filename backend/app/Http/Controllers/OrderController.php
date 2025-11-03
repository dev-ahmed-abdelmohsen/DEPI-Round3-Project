<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Traits\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

// Todo: user model should be injected in the constructor

class OrderController extends Controller
{
    use Response;


    function index()
    {

        $orders = Auth()->user()->orders()->get();

        if ($orders->isEmpty()) {
            return $this->error('No orders found', 404);
        }

        $orders = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'subtotal' => (double) $order->subtotal,
                'total' => (double) $order->total,
                'discount' => (double) $order->discount,
                'status' => $order->status ?? 'pending', // Default to 'pending' if status is null
                'created_at' => $order->created_at,
//                'shipped_at' => $order->shipped_at,
//                'delivered_at' => $order->delivered_at,
//                'shipping_address' => $order->shipping_address,
                'products' => $order->products->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'price' => (double) $product->price,
                        'quantity' => (int) $product->pivot->quantity,
                        'primaryImage' => $product->primaryImage ? $product->primaryImage->getUrl() : null,
                        'images' => $product->images->all(),

                    ];
                }),
            ];
        });


        return $this->success($orders, 'Orders retrieved successfully');

    }

    function show($id)
    {

        $order = Auth()->user()->orders()->find($id);
        if (!$order) {
            return $this->error('Order not found', 404);
        }

        // Additional Check if the order belongs to the authenticated user
        if ($order->user_id != Auth()->user()->id) {
            return $this->error('Unauthorized access to this order', 403);
        }

        $order->load('products'); // Eager load products

        $formattedOrder = [
            'id' => $order->id,
            'subtotal' => (double)$order->subtotal,
            'total' => (double)$order->total,
            'discount' => (double)$order->discount,
            'status' => $order->status ?? 'pending',
            'shipping_address' => $order->shipping_address,
            'created_at' => $order->created_at,
            'shipped_at' => $order->shipped_at,
            'delivered_at' => $order->delivered_at,
            'products' => $order->products->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (double)$product->price,
                    'quantity' => (int)$product->pivot->quantity,
                    'image' => $product->primaryImage ? $product->primaryImage->getUrl() : null,
                ];
            }),
        ];

        return $this->success($formattedOrder, 'Order details retrieved successfully');

    }

    function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'shipping_address' => 'sometimes|required|string|max:255', //sometimes allows for optional shipping address for testing purposes
            'shipping_method' => 'sometimes|string|max:50', // Add shipping method validation
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $user = auth()->user();
        if (!$user) {
            return $this->error('User not authenticated.', 401);
        }

        $cartItems = $user->cartItems()->withPivot('quantity')->get();

        if ($cartItems->isEmpty()) {
            return $this->error('Your cart is empty.', 400);
        }

        try {
            DB::beginTransaction();

            $order = new Order();
            $order->user_id = $user->id;
            $order->shipping_address = $request->shipping_address;
            $order->status = 'pending';

            $subtotal = 0;
            $productsToAttach = [];

            foreach ($cartItems as $item) {
                // Use stock if it's less than the requested quantity
                $quantity = min($item->stock, $item->pivot->quantity);
                if ($quantity > 0) {
                    $price = $item->price;
                    $subtotal += $price * $quantity;
                    $productsToAttach[$item->id] = [
                        'quantity' => $quantity,
//                        'price' => $price
                    ];
                }
            }

            if (empty($productsToAttach)) {
                return $this->error('All items in your cart are out of stock.', 400);
            }

            $order->subtotal = $subtotal;
            $order->discount = 0; // Placeholder for discount logic
            $order->total = $subtotal - $order->discount;
            $order->save(); // Save the order to get an ID

            // Attach products to the order
            $order->products()->attach($productsToAttach);

            // Update the stock for each product
            foreach ($productsToAttach as $productId => $details) {
                $product = Product::find($productId);
                $product->stock -= $details['quantity'];
                $product->save();
            }

//            return $this->success($order, 'Order created successfully');
            // Clear the user's cart
            // Soft delete all cart items by updating the pivot table with deleted_at timestamp
//            $user->cartItems()->newPivotQuery()->update(['deleted_at' => now()]);
            $user->cartItems()->detach(); // Detach all cart items


            DB::commit();

            $order->load('products.primaryImage', 'products.images');

            $formattedOrder = [
                'id' => $order->id,
                'subtotal' => (double)$order->subtotal,
                'total' => (double)$order->total,
                'discount' => (double)$order->discount,
                'status' => $order->status ?? 'pending',
                'created_at' => $order->created_at,
                'products' => $order->products->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'price' => (double)$product->price,
                        'quantity' => (int)$product->pivot->quantity,
                        'primaryImage' => $product->primaryImage ? $product->primaryImage->getUrl() : null,
                        'images' => $product->images->all(),
                    ];
                }),
            ];

            return $this->success($formattedOrder, 'Order created successfully', 201);

        } catch (\Exception $e) {
            DB::rollBack();

            // Log the detailed error message and stack trace
            \Illuminate\Support\Facades\Log::error('Order creation failed: ' . $e->getMessage());
            \Illuminate\Support\Facades\Log::error($e->getTraceAsString());

            // Return a more specific error message for debugging
            return $this->error('Failed to create order: ' . $e->getMessage(), 500);
        }
    }


    function update(Request $request, $id)
    {
        $order = Auth()->user()->orders()->find($id);
        if (!$order) {
            return $this->error('Order not found', 404);
        }

        // Only allow updates if the order is still pending
        if ($order->status !== 'pending') {
            return $this->error('Order cannot be updated as it is already being processed.', 403);
        }

        $validator = Validator::make($request->all(), [
            'shipping_address' => 'sometimes|required|string|max:255',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $order->update($request->only(['shipping_address']));

        return $this->success($order, 'Order updated successfully');
    }


    function cancel($id)
    {
        $order = Auth()->user()->orders()->find($id);
        if (!$order) {
            return $this->error('Order not found', 404);
        }

        // Business logic: an order can only be cancelled if it's 'pending' or 'processing'
        if (!in_array($order->status, ['pending', 'processing'])) {
            return $this->error('This order cannot be cancelled.', 403);
        }

        $order->status = 'cancelled';
        $order->save();

        // Optional: Add logic to restock products

        return $this->success($order, 'Order cancelled successfully');
    }

    function delete($id)
    {
        $order = Auth()->user()->orders()->find($id);
        if (!$order) {
            return $this->error('Order not found', 404);
        }

        // Business logic: only allow deletion for 'cancelled' or 'completed' orders
        if (!in_array($order->status, ['cancelled', 'completed'])) {
            return $this->error('Only completed or cancelled orders can be deleted.', 403);
        }

        $order->delete();

        return $this->success(null, 'Order deleted successfully');
    }

//    function track($id)
//    {
//        // Logic to track an order by ID
//        // This is a placeholder; actual implementation will depend on your application's requirements
//        return $this->success([], 'Order tracking information retrieved successfully');
//
//    }
//
//    function history()
//    {
//        // Logic to retrieve and return the order history for the authenticated user
//        // This is a placeholder; actual implementation will depend on your application's requirements
//        return $this->success([], 'Order history retrieved successfully');
//
//    }
//
//    function returnOrder($id)
//    {
//        // Logic to initiate a return for an order by ID
//        // This is a placeholder; actual implementation will depend on your application's requirements
//        return $this->success([], 'Return initiated successfully');
//
//    }
//
//    function reorder($id)
//    {
//        // Logic to reorder a previous order by ID
//        // This is a placeholder; actual implementation will depend on your application's requirements
//        return $this->success([], 'Order reordered successfully');
//
//    }



}
