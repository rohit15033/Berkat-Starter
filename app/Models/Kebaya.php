<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kebaya extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'colour', 'length'];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
