<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'event_date' => $this->event_date,
            'event_type' => $this->event_type,
            'price' => $this->price,
            'discount' => $this->discount,
            'details' => $this->details,
            'products' => OrderProductResource::collection($this->whenLoaded('products')),
        ];
    }
}
