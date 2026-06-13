<?php
namespace App\Http\Controllers;
use App\Models\User;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\RegisterVetRequest;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'telefone' => $request->telefone,
            ]);
            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json([
                'message' => 'Usuário registrado com sucesso.',
                'token'   => $token,
                'user'    => $user->only('id', 'name', 'email'),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Register failed', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Erro ao registrar usuário.'], 500);
        }
    }

    public function registerVet(RegisterVetRequest $request): JsonResponse
    {
        try {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'telefone' => $request->telefone,
                'crmv'     => $request->crmv,
            ]);
            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json([
                'message' => 'Veterinário registrado com sucesso.',
                'token'   => $token,
                'user'    => $user->only('id', 'name', 'email'),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Register vet failed', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Erro ao registrar veterinário.'], 500);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciais inválidas.'], 401);
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'message' => 'Login realizado com sucesso.',
            'token'   => $token,
            'user'    => $user->only('id', 'name', 'email'),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout realizado com sucesso.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user()->only('id', 'name', 'email'));
    }
}