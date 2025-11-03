<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use \Laravel\Passport\HasApiTokens;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function vouchers()
    {
        return $this->belongsToMany(Voucher::class, 'user_voucher', 'user_id', 'voucher_id')
                    ->withPivot('usage_count', 'redeemed_at')
                    ->withTimestamps();
    }
    public function wishlists()
    {
        return $this->belongsToMany(Product::class, 'wishlists', 'user_id', 'product_id')
                    ->withTimestamps()
                    ->withPivot('updated_at');
    }


    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id', 'id');
    }

    public function cartItems()
    {
        return $this->belongsToMany(Product::class, 'carts', 'user_id', 'product_id')
                    ->using(SoftDeletingPivot::class)
                    ->withPivot('quantity')
                    ->withTimestamps();
    }

//    public function permissions(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
//    {
//        return $this->belongsToMany(Permission::class);
//    }

}
