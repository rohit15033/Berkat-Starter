<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInvoiceRequest extends FormRequest
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
            'date' => 'sometimes|date',
            'due' => 'sometimes|numeric',
            'detail' => 'nullable|string',
            'marketing' => 'sometimes|string',
            'status' => 'sometimes|string',
            'discount' => 'nullable|numeric',
        ];
    }
}