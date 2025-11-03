<?php
namespace App\Models; // Or your preferred namespace

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

class SoftDeletingPivot extends Pivot
{
    use SoftDeletes;
}
