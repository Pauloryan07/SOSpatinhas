<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class StoreDenunciationRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'type'             => ['required', Rule::in(['abandonment', 'mistreatment', 'negligence', 'injured', 'exploitation', 'other'])],
            'latitude'         => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'        => ['nullable', 'numeric', 'between:-180,180'],
            'address'          => ['nullable', 'string', 'max:255'],
            'description'      => ['required', 'string'],
            'animal_species'   => ['nullable', Rule::in(['dog', 'cat', 'bird', 'other', 'unknown'])],
            'animal_condition' => ['nullable', Rule::in(['unknown', 'injured', 'dead', 'alive'])],
            'evidence_photos'  => ['nullable', 'array', 'max:6'],
            'evidence_photos.*' => ['image', 'max:5120'],
        ];
    }
    public function messages(): array
    {
        return [
            'type.required'          => 'O tipo de denúncia é obrigatório.',
            'type.in'                => 'Tipo de denúncia inválido.',
            'latitude.between'       => 'Latitude inválida.',
            'longitude.between'      => 'Longitude inválida.',
            'description.required'   => 'A descrição é obrigatória.',
            'animal_species.in'      => 'Espécie inválida.',
            'animal_condition.in'    => 'Condição do animal inválida.',
            'evidence_photos.array'  => 'As evidências devem ser um array de fotos.',
            'evidence_photos.max'    => 'Você pode enviar no máximo 6 fotos.',
            'evidence_photos.*.image' => 'Cada arquivo deve ser uma imagem.',
            'evidence_photos.*.max'   => 'Cada imagem não pode exceder 5MB.',
        ];
    }
}