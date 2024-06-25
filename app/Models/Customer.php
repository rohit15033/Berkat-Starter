<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = ['phone', 'name','instagram','status'];


    public function appointments(){
        return $this->belongsToMany(Appointment::class, 'customers_appointments');
    }
    public function invoices()
    {
        return $this->belongsToMany(Invoice::class, 'customer_invoices', 'customer_id', 'invoice_id');
    }
}
