<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductCreateRequest;
use App\Http\Requests\IndexRequest;
use App\Http\Requests\ProductSearchRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Models\Product;
use App\Models\Subcategory;
use App\Traits\Response;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    use Response;
    // Define your limits as constants for clean code

    private function transformProduct($product)
    {
        $images = collect();
        if ($product->primaryImage) {
            $images->push($product->primaryImage->getUrl());
        }
        $otherImages = $product->images->where('id', '!=', $product->primaryImage?->id);
        foreach ($otherImages as $image) {
            $images->push($image->getUrl());
        }

        $category = null;
        if ($product->subcategories && $product->subcategories->categories) {
            $category = [
                'id' => $product->subcategories->categories->id,
                'name' => $product->subcategories->categories->name,
                'creationAt' => $product->subcategories->categories->created_at,
                'updatedAt' => $product->subcategories->categories->updated_at,
                'description' => $product->subcategories->categories->description,
            ];
        }

        return [
            'id' => $product->id,
            'name' => $product->name,
            'title' => $product->name,
            'slug' => $product->slug,
            'price' => (float) $product->price,
            'description' => $product->description,
            'category' => $category,
            'images' => $images->all(),
            'primaryImage' => $product->primaryImage ? $product->primaryImage->getUrl() : null,
            'creationAt' => $product->created_at,
            'updatedAt' => $product->updated_at,
            'stock' => $product->stock,
            'subcategory' => $product->subcategories ? [
                'id' => $product->subcategories->id,
                'name' => $product->subcategories->name,
            ] : null,
            'sku' => $product->sku,
            'specifications' => $product->specifications,
        ];
    }


    function index(IndexRequest $request)
    {
        $validatedData = $request->validated();
        // Fetch products from the database or any other source
        $products = Product::with(['primaryImage', 'images', 'subcategories.categories'])->paginate(
            $validatedData['per_page'] ?? 10 // Default to 10 if not provided
        );

        $products->getCollection()->transform(function ($product) {
            return $this->transformProduct($product);
        });

        return $this->success($products, 'Product index');
    }

    function show(Product $product)
    {

        return $this->success($this->transformProduct($product), 'Product show');
    }

    function search(ProductSearchRequest $request)
    {
        $validatedData = $request->validated();
        $query = Product::query();

        if (!empty($validatedData['query'])) {
            $query->where('name', 'like', '%' . $validatedData['query'] . '%');
        }

        if (!empty($validatedData['category_id'])) {
            $query->whereHas('subcategories', function ($q) use ($validatedData) {
                $q->where('category_id', $validatedData['category_id']);
            });
        }

        if (!empty($validatedData['category'])) {
            $query->whereHas('subcategories.categories', function ($q) use ($validatedData) {
                $q->where('name', 'like', '%' . $validatedData['category'] . '%');
            });
        } if (!empty($validatedData['category'])) {
            $query->whereHas('subcategories.categories', function ($q) use ($validatedData) {
                $q->where('name', 'like', '%' . $validatedData['category'] . '%');
            });
        }

        if (!empty($validatedData['subcategory_id'])) {
            $query->where('subcategory_id', $validatedData['subcategory_id']);
        }

        if (!empty($validatedData['sort_by'])) {
            $sortBy = $validatedData['sort_by'];
            $sortDirection = $validatedData['sort_direction'] ?? 'asc';

            if (in_array($sortBy, ['name', 'price', 'created_at', 'updated_at'])) {
                $query->orderBy($sortBy, $sortDirection);
            } else {
                return $this->error('Invalid sort field', 400);
            }
        }
        if (isset($validatedData['min_price'])) {
            $query->where('price', '>=', $validatedData['min_price']);
        }
        if (isset($validatedData['max_price'])) {
            $query->where('price', '<=', $validatedData['max_price']);
        }


        $products = $query->with(['primaryImage', 'images', 'subcategories.categories'])->paginate($validatedData['per_page'] ?? 10);

//        dd($validatedData['query']);

        $products->getCollection()->transform(function ($product) {
            return $this->transformProduct($product);
        });



        return $this->success($products, 'Product search');
    }


    function create(ProductCreateRequest $request)
    {
        $validatedData = $request->validated();

        $subcategory = Subcategory::find($validatedData['subcategory_id']);
        if (!$subcategory) {
            return $this->error('Subcategory not found', 404);
        }

        try {
            $product = DB::transaction(function () use ($validatedData, $subcategory, $request) {
                // Create product without images first
            $product = $subcategory->products()->create($validatedData);

                // Handle primary image upload
                if ($request->hasFile('primary_image')) {
                    $path = $request->file('primary_image')->store('products', 'public');
                    $image = $product->images()->create(['image_path' => $path]);
                    $product->primary_image_id = $image->id;
                    $product->save();
                }

                // Handle other images upload
                if ($request->hasFile('images')) {
                    $firstImage = true;
                    foreach ($request->file('images') as $file) {
                        $path = $file->store('products', 'public');
                        $image = $product->images()->create(['path' => $path]);
                        if ($firstImage && !$product->primary_image_id) {
                            $product->primary_image_id = $image->id;
                            $product->save();
                            $firstImage = false;
                        }
                    }
                }

                return $product;
            });

            // Eager load relations for the response
            $product->load(['primaryImage', 'images', 'subcategories.categories']);

        return $this->success($this->transformProduct($product), 'Product created successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to create product: ' . $e->getMessage(), 500);
        }
    }

    function update(ProductUpdateRequest $request, Product $product)
    {
        $validatedData = $request->validated();

        try{
            DB::transaction(function () use ($product, $validatedData, $request) {
                // Update product's main attributes
            $product->update($validatedData);

                // Handle primary image update
                if ($request->hasFile('primary_image')) {
                    // Optionally delete the old primary image file from storage
                    // if ($product->primaryImage) {
                    //     Storage::disk('public')->delete($product->primaryImage->image_path);
                    //     $product->primaryImage->delete();
                    // }
                    $path = $request->file('primary_image')->store('products', 'public');
                    $image = $product->images()->create(['image_path' => $path]);
                    $product->primary_image_id = $image->id;
                    $product->save();
                }

                // Handle other images upload
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $file) {
                        $path = $file->store('products', 'public');
                        $product->images()->create(['image_path' => $path]);
                    }
                }
            });

            // Eager load relations for the response
            $product->load(['primaryImage', 'images', 'subcategories.categories']);

        return $this->success($this->transformProduct($product), 'Product updated successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to update product: ' . $e->getMessage(), 500);
        }
    }

    function delete(Product $product)
    {
        // assuming finding the product by ID is done in the route, erros will be handled by the framework
        // Delete the product
        $product->delete();

        try{
            // Return a success response
            return $this->success([], 'Product deleted successfully');
        }
        catch (\Exception $e) {
            // Handle the exception, e.g., log it or return an error response
            return $this->error('Failed to delete product: ' . $e->getMessage(), 500);
        }

    }
}
