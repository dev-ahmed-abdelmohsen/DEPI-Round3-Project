<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'discount_percentage',
        'valid_from',
        'valid_until',
        'minimum_purchase_amount',
        'max_discount_amount',
    ];

    public function products(){
        return $this->belongsToMany(Product::class, 'offer_product', 'offer_id', 'product_id');
    }
}
