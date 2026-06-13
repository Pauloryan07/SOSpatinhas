<?php
namespace App\Http\Requests\User;
use Illuminate\Foundation\Http\FormRequest;
class UpdatePasswordRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'current_password' => ['required', 'string'],
            'password'         => ['required', 'string', 'min:8', 'confirmed', 'regex:/^(?=.*[a-zA-Z])(?=.*[0-9]).+$/'],
        ];
    }
    public function messages(): array
    {
        return [
            'password.regex' => 'A senha deve conter letras e números.',
        ];
    }
}
