<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    public static $wrap = false;

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'date' => $this->date,
            'due' => $this->due,
            'detail' => $this->detail,
            'marketing' => $this->marketing,
            'status' => $this->status,
            'discount' => $this->discount,
            'price' => $this->price,
            'orders' => OrderResource::collection($this->whenLoaded('orders')),
            'customers' => CustomerResource::collection($this->whenLoaded('customers')),
        ];
    }
}
