<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDenunciationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type'                   => ['required', Rule::in(['abandonment', 'mistreatment', 'negligence', 'injured'])],
            'location'               => ['required', 'string', 'max:255'],
            'description'            => ['required', 'string'],
            'evidence_photo'         => ['nullable', 'image', 'max:5120'],
            'animal_characteristics' => ['nullable', 'string'],
        ];
    }
}
