<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = ['id', 'type', 'status'];

    public function kebaya()
    {
        return $this->hasOne(Kebaya::class, 'product_id', 'id');
    }

    public function beskap()
    {
        return $this->hasOne(Beskap::class, 'product_id', 'id');
    }

    public function gaun()
    {
        return $this->hasOne(Gaun::class, 'product_id', 'id');
    }
    public function productImages()
    {
        return $this->hasMany(ProductImage::class, 'product_id', 'id');
    }
    public function invoices()
    {
        return $this->belongsToMany(Invoice::class, 'invoice_products', 'product_id', 'invoice_id')->withPivot('price', 'discount');;
    }
}
