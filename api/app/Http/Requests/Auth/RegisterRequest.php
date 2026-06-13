<?php
namespace App\Http\Requests\Auth;
use Illuminate\Foundation\Http\FormRequest;
class RegisterRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'min:2', 'max:255'],
            'email'    => ['required', 'string', 'email:rfc', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{8,}$/'],
            'telefone' => ['required', 'string', 'max:20'],
        ];
    }
    public function messages(): array
    {
        return [
            'name.required'     => 'O nome é obrigatório.',
            'name.min'          => 'O nome deve ter pelo menos 2 caracteres.',
            'email.required'    => 'O email é obrigatório.',
            'email.email'       => 'Informe um email válido.',
            'email.unique'      => 'Este email já está cadastrado.',
            'password.required' => 'A senha é obrigatória.',
            'password.regex'    => 'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números. Espaços não são permitidos.',
            'password.confirmed'=> 'As senhas não conferem.',
            'telefone.required' => 'O telefone é obrigatório.',
        ];
    }
    protected function prepareForValidation(): void
    {
        $this->merge(['email' => strtolower($this->email)]);
    }
}