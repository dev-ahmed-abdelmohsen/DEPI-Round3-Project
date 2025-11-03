<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'amount',
        'description',
        'type', // 'percentage' or 'fixed'
        'valid_from',
        'valid_until',
        'usage_limit',
    ];

    protected $casts = [
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
    ];

    protected function setCodeAttribute($value)
    {
        // Ensure the voucher code is always stored in uppercase
        $this->attributes['code'] = strtoupper($value);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_voucher', 'voucher_id', 'user_id')
                    ->withPivot('usage_count', 'redeemed_at');
    }
}
