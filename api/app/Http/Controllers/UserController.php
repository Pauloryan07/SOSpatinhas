<?php
namespace App\Http\Controllers;
use App\Http\Requests\User\UpdateProfileRequest;
use App\Http\Requests\User\UpdatePasswordRequest;
use App\Http\Requests\User\DeleteAccountRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
class UserController extends Controller
{
    public function profile(Request $request): JsonResponse
    {
        return response()->json($request->user()->only('id', 'name', 'email', 'telefone'));
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $request->user()->update($request->validated());
        return response()->json($request->user()->fresh()->only('id', 'name', 'email', 'telefone'));
    }

    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $user = $request->user();
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Senha atual incorreta.'], 422);
        }
        $user->update(['password' => Hash::make($request->password)]);
        return response()->json(['message' => 'Senha atualizada com sucesso.']);
    }

    public function destroy(DeleteAccountRequest $request): JsonResponse
    {
        $user = $request->user();
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Senha incorreta.'], 403);
        }
        $user->tokens()->delete();
        $user->delete();
        return response()->json(['message' => 'Conta excluída com sucesso.']);
    }
}