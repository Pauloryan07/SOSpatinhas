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
            'type'             => ['sometimes', Rule::in(['abandonment', 'mistreatment', 'negligence', 'injured', 'exploitation', 'other'])],
            'latitude'         => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'longitude'        => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
            'address'          => ['sometimes', 'nullable', 'string', 'max:255'],
            'description'      => ['sometimes', 'string'],
            'animal_species'   => ['sometimes', 'nullable', Rule::in(['dog', 'cat', 'bird', 'other', 'unknown'])],
            'animal_condition' => ['sometimes', 'nullable', Rule::in(['unknown', 'injured', 'dead', 'alive'])],
            'evidence_photos'  => ['sometimes', 'nullable', 'array', 'max:6'],
            'evidence_photos.*' => ['image', 'max:5120'],
        ];
    }
    public function messages(): array
    {
        return [
            'type.in'                => 'Tipo de denúncia inválido.',
            'latitude.between'       => 'Latitude inválida.',
            'longitude.between'      => 'Longitude inválida.',
            'animal_species.in'      => 'Espécie inválida.',
            'animal_condition.in'    => 'Condição do animal inválida.',
            'evidence_photos.array'  => 'As evidências devem ser um array de fotos.',
            'evidence_photos.max'    => 'Você pode enviar no máximo 6 fotos.',
            'evidence_photos.*.image' => 'Cada arquivo deve ser uma imagem.',
            'evidence_photos.*.max'   => 'Cada imagem não pode exceder 5MB.',
        ];
    }
}
