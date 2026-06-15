<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Denunciation extends Model
{
    protected $fillable = [
        'type',
        'latitude',
        'longitude',
        'address',
        'description',
        'animal_species',
        'animal_condition',
        'user_id',
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function evidences(): HasMany
    {
        return $this->hasMany(DenunciationEvidence::class);
    }
}