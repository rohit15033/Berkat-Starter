
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount', 'method', 'path'
    ];

    public function invoices()
    {
        return $this->belongsToMany(Invoice::class, 'invoice_payments', 'payment_id', 'invoice_id');
    }
}

