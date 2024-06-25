<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'date', 'due', 'detail', 'marketing',  'discount', 'price', 'status'
    ];

    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'customer_invoices', 'invoice_id', 'customer_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function calculatePrice()
    {
        return $this->orders->sum('price');
    }

    public function payments()
    {
        return $this->belongsToMany(Payment::class, 'invoice_payments', 'invoice_id', 'payment_id');
    }
}
