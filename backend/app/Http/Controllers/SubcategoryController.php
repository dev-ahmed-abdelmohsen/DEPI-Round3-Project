<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Subcategory;
use App\Traits\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubcategoryController extends Controller
{
    use Response;

    function index()
    {
        $subcategories = Subcategory::withCount('products')->get();

        if ($subcategories->isEmpty()) {
            return $this->error('No subcategories found', 404);
        }

        $formattedSubcategories = $subcategories->map(function ($subcategory) {
            return [
                'id' => $subcategory->id,
                'name' => $subcategory->name,
                'products_count' => $subcategory->products_count,
            ];
        });

        return $this->success($formattedSubcategories, 'Subcategories retrieved successfully');
    }

    function show(Subcategory $subcategory)
    {
        $subcategory->loadCount('products');

        if (!$subcategory) {
            return $this->error('Subcategory not found', 404);
        }

        $formattedSubcategory = [
            'id' => $subcategory->id,
            'name' => $subcategory->name,
            'products_count' => $subcategory->products_count,
        ];
        return $this->success($formattedSubcategory, 'Subcategory retrieved successfully');
    }


    function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string|max:1000',
        ]);


        if ($validator->fails()) {
            return $this->error($validator->errors()->all(), 422);
        }
//        dd($request->all());

        $request['category_id'] = (int)$request['category_id'];

        $category = Category::find($request['category_id']);
        if (!$category) {
            return $this->error('Category not found', 404);
        }


        $subcategory = $category->subcategories()->create($request->all());

        return $this->success($subcategory, 'Subcategory created successfully', 201);
    }
    function update(Request $request, Subcategory $subcategory)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'category_id' => 'sometimes|required|exists:categories,id',
            'description' => 'sometimes|nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->all(), 422);
        }

        if (!$subcategory) {
            return $this->error('Subcategory not found', 404);
        }

        if ($request->has('category_id')) {
            $category = Category::find($request->input('category_id'));
            if (!$category) {
                return $this->error('Category not found', 404);
            }
            $subcategory->categories()->associate($category);
        }

        $subcategory->update($request->all());

        return $this->success($subcategory, 'Subcategory updated successfully');
    }

    function delete(Subcategory $subcategory)
    {
        $deleted = $subcategory->delete();
        if (!$deleted) {
            return $this->error('Failed to delete subcategory', 500);
        }

        return $this->success(null, 'Subcategory deleted successfully');
    }
    function search(Request $request)
    {
        $query = Subcategory::query();

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        $subcategories = $query->withCount('products')->get();

        if ($subcategories->isEmpty()) {
            return $this->error('No subcategories found', 404);
        }

        $formattedSubcategories = $subcategories->map(function ($subcategory) {
            return [
                'id' => $subcategory->id,
                'name' => $subcategory->name,
                'products_count' => $subcategory->products_count,
            ];
        });

        return $this->success($formattedSubcategories, 'Subcategories found successfully');
    }

}
