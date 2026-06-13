<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Denunciation extends Model
{
    protected $fillable = [
        'type',
        'location',
        'description',
        'evidence_photo',
        'animal_characteristics',
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
