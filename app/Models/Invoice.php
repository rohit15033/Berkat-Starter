<?php

    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

    class Invoice extends Model
    {
        use HasFactory;

        protected $primaryKey = 'id';

        protected $keyType = 'string';

        public $incrementing = false;

        protected $fillable = ['id', 'date','detail','marketing', 'type', 'status'];


        public function products()
        {
            return $this->belongsToMany(Product::class, 'invoice_products', 'invoice_id', 'product_id')->withPivot('price', 'discount');;
        }

        public function customers()
        {
            return $this->belongsToMany(Customer::class, 'customer_invoices', 'customer_id', 'invoice_id');
        }
    }
