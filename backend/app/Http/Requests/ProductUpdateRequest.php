<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */

    //Todo separate rules for update and create for better validation, several specialized rules for update
    public function rules()
    {
        return [
            'name' => 'nullable|string|max:255',
//            'slug' => 'nullable|string|max:255|unique:products,slug,' . $this->route('id'),
            'price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
            'sku' => 'nullable|string|max:255',
            'specifications' => 'nullable|string',
            'subcategory_id' => 'nullable|exists:subcategories,id',
            'images' => 'array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validate each image in the array
            'primary_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validate primary image
        ];
    }
}
