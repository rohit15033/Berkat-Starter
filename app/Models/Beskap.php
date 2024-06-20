<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Beskap extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'adat', 'colour'];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
