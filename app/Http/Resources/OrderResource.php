<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public static $wrap = false;

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'event_date' => $this->event_date,
            'event_type' => $this->event_type,
            'price' => $this->price,
            'discount' => $this->discount,
            'details' => $this->details,
            'products' => ProductResource::collection($this->whenLoaded('products')),
        ];
    }
}
