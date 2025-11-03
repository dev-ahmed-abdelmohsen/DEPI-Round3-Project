<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


//Todo add slug for better SEO

class Product extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'name',
        'description',
        'price',
        'specifications',
        'sku',
        'stock',
        'subcategory_id',
    ];

    public function primaryImage()
    {
        return $this->belongsTo(Image::class, 'primary_image_id', 'id');
    }
    public function images()
    {
        return $this->hasMany(Image::class, 'product_id', 'id');
    }

    public function subcategories()
    {
        return $this->belongsTo(Subcategory::class, 'subcategory_id', 'id');
    }

    public function users(){
        return $this->belongsToMany(User::class, 'carts', 'product_id', 'user_id')
                    ->withPivot('quantity');
    }

    public function wishlists(){
        return $this->belongsToMany(User::class, 'wishlists', 'product_id', 'user_id')
                    ->withTimestamps()
                    ->withPivot('updated_at');
    }

    public function carts(){
        return $this->belongsToMany(User::class, 'carts', 'product_id', 'user_id')
                    ->withTimestamps();
    }

    public function offers()
    {
        return $this->belongsToMany(Offer::class, 'offer_product', 'product_id', 'offer_id')
                    ->withTimestamps();
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_product', 'product_id', 'order_id')
            ->withPivot('quantity')
            ->withTimestamps();
    }
}
