<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDenunciationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->route('denunciation')->user_id === $this->user()->id;
    }

    public function rules(): array
    {
        return [
            'type'                   => ['sometimes', Rule::in(['abandonment', 'mistreatment', 'negligence', 'injured'])],
            'location'               => ['sometimes', 'string', 'max:255'],
            'description'            => ['sometimes', 'string'],
            'evidence_photo'         => ['nullable', 'image', 'max:5120'],
            'animal_characteristics' => ['nullable', 'string'],
        ];
    }
}
