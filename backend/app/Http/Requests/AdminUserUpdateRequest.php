<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminUserUpdateRequest extends FormRequest
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
            'user_id' => 'required|exists:users,id',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:users,email,' . $this->user_id,
//            'phone' => 'nullable|string|max:15',
//            'address' => 'nullable|string|max:255',
//            'is_active' => 'nullable|boolean',
//            'role' => 'nullable|string|in:admin,user,guest', // Assuming roles
            'password' => 'nullable|string|min:8|confirmed',
        ];
    }
}
