<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductSearchRequest extends FormRequest
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
    public function rules()
    {
        return [
            'query' => 'nullable|string|min:3|max:255',
            'per_page' => 'nullable|integer|min:5|max:50',
            'sort_by' => 'nullable|string|in:name,price,created_at,updated_at',
            'sort_direction' => 'nullable|string|in:asc,desc',
            'category_id' => 'nullable|integer|exists:categories,id',
            'subcategory_id' => 'nullable|integer|exists:subcategories,id',
            'category' => 'nullable|string|exists:categories,name',
            'subcategory' => 'nullable|string|exists:subcategories,name',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',
        ];
    }
}
