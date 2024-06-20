<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // Adjust authorization logic as needed
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        $rules = [
            'type' => 'required|string|in:kebaya,beskap,gaun',
            'img' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
        ];

        switch ($this->type) {
            case 'kebaya':
                $rules['colour'] = 'required|string|max:255';
                $rules['length'] = 'required|string|max:255';
                break;
            case 'beskap':
                $rules['adat'] = 'required|string|max:255';
                $rules['colour'] = 'required|string|max:255';
                break;
            case 'gaun':
                $rules['colour'] = 'required|string|max:255';
                $rules['length'] = 'required|string|max:255';
                break;
        }

        return $rules;
    }
}
