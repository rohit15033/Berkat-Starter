<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
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
            'date' => 'required|date',
            'due' => 'required|numeric',
            'detail' => 'nullable|string',
            'marketing' => 'required|string',
            'status' => 'required|string',
            'discount' => 'nullable|numeric',
            'orders' => 'required|array',
            'orders.*.event_date' => 'required|date',
            'orders.*.event_type' => 'required|string',
            'orders.*.price' => 'nullable|numeric',
            'orders.*.discount' => 'nullable|numeric',
            'orders.*.details' => 'nullable|string',
            'orders.*.products' => 'sometimes|array',
            'orders.*.products.*.product_id' => 'required_with:orders.*.products|exists:products,id',
            'orders.*.products.*.price' => 'required_with:orders.*.products|numeric',
            'orders.*.products.*.discount' => 'nullable|numeric',
        ];
    }
}
