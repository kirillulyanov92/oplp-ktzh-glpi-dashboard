<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use App\Models\Shift;
use App\Models\User;



class ShiftComment extends Model
{
    use HasFactory;
    protected $fillable = ['shift_id', 'user_id', 'comment'];

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

