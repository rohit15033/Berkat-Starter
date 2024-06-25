<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_date', 'event_type', 'price_before_discount', 'discount', 'price_after_discount', 'details'
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_products', 'order_id', 'product_id')
            ->withPivot('price', 'discount')
            ->withTimestamps();
    }

    public function calculatePrice()
    {
        return $this->products->sum(function ($product) {
            return $product->pivot->price;
        });
    }

}

