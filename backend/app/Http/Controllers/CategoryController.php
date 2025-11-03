<?php

namespace App\Http\Controllers;

use App\Http\Requests\IndexRequest;
use App\Models\Category;
use App\Traits\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    use Response;

    function index(IndexRequest $request)
    {
        $validatedData = $request->validated();

        // Fetch categories with their subcategories and count products for each subcategory
        $categories = Category::with(['subcategories' => function ($query) {
            $query->withCount('products');
        }])->get();

        if ($categories->isEmpty()) {
            return $this->error('No categories found', 404);
        }

        // Calculate total products for each category and sort subcategories by product count
        $categories->each(function ($category) {
            $category->products_count = $category->subcategories->sum('products_count');
            // Optionally sort subcategories as well
//            $category->subcategories = $category->subcategories->sortByDesc('products_count');
        });

        // Sort categories by the total number of products in descending order
        $sortedCategories = $categories->sortByDesc('products_count');

        // Format the categories for the response
        $formattedCategories = $sortedCategories->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'products_count' => $category->products_count,
                'subcategories' => $category->subcategories->values()->map(function ($subcategory) {
                    return [
                        'id' => $subcategory->id,
                        'name' => $subcategory->name,
//                        'products_count' => $subcategory->products_count,
                    ];
                }),
            ];
        });


        return $this->success($formattedCategories->values(), 'Categories retrieved successfully');

    }

    function show(Category $category)
    {
        // Fetch a single category with its subcategories and product counts
        $category->load(['subcategories' => function ($query) {
            $query->withCount('products');
        }]);

        if (!$category) {
            return $this->error('Category not found', 404);
        }

        // Format the category for the response
        $formattedCategory = [
            'id' => $category->id,
            'name' => $category->name,
//            'products_count' => $category->subcategories->sum('products_count'),
            'subcategories' => $category->subcategories->map(function ($subcategory) {
                return [
                    'id' => $subcategory->id,
                    'name' => $subcategory->name,
//                    'products_count' => $subcategory->products_count,
                ];
            }),
        ];
        return $this->success($formattedCategory, 'Category retrieved successfully');
    }


    function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->first(), 422);
        }

        $category = Category::create($request->all());

        return $this->success($category, 'Category created successfully', 201);
    }
    function update(Request $request, Category $category)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->first(), 422);
        }

        $category->update($request->all());

        return $this->success($category, 'Category updated successfully');
    }

    function delete(Category $category)
    {
        $category->delete();
        return $this->success(null, 'Category deleted successfully');
    }

    function search(Request $request)
    {
        $query = Category::query();

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        $categories = $query->withCount('subcategories')->get();

        if ($categories->isEmpty()) {
            return $this->error('No categories found', 404);
        }

        $formattedCategories = $categories->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'subcategories_count' => $category->subcategories_count,
            ];
        });

        return $this->success($formattedCategories, 'Categories found successfully');
    }
}
