<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DenunciationEvidence extends Model
{
    protected $table = 'denunciation_evidences';

    protected $fillable = [
        'denunciation_id',
        'photo_path',
    ];

    public function denunciation(): BelongsTo
    {
        return $this->belongsTo(Denunciation::class);
    }
}
