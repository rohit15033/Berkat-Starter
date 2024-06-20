<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'type'];

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
}
