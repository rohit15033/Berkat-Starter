<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $attributes = [
            'id' => $this->id,
            'type' => $this->type,
        ];

        // Conditional loading of attributes based on product type
        if ($this->type === 'kebaya' && $this->kebaya) {
            $attributes['attributes'] = [
                'colour' => $this->kebaya->colour,
                'length' => $this->kebaya->length,
            ];
        } elseif ($this->type === 'beskap' && $this->beskap) {
            $attributes['attributes'] = [
                'adat' => $this->beskap->adat,
                'colour' => $this->beskap->colour,
            ];
        } elseif ($this->type === 'gaun' && $this->gaun) {
            $attributes['attributes'] = [
                'colour' => $this->gaun->colour,
                'length' => $this->gaun->length,
            ];
        }

        // Load product images if available
        $attributes['images'] = $this->productImages()->pluck('path');

        return $attributes;
    }
}
