<?php

namespace App\Http\Controllers;

use App\Models\Denunciation;
use App\Http\Requests\StoreDenunciationRequest;
use App\Http\Requests\UpdateDenunciationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DenunciationController extends Controller
{
    public function index(): JsonResponse
    {
        $denunciations = Denunciation::with('user:id,name')
            ->latest()
            ->paginate(15);
        return response()->json($denunciations);
    }

    public function store(StoreDenunciationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('evidence_photo')) {
            $validated['evidence_photo'] = $request->file('evidence_photo')->store('denunciations', 'public');
        }

        $denunciation = $request->user()->denunciations()->create($validated);

        return response()->json($denunciation, 201);
    }

    public function show(Denunciation $denunciation): JsonResponse
    {
        return response()->json($denunciation->load('user:id,name'));
    }

    public function update(UpdateDenunciationRequest $request, Denunciation $denunciation): JsonResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('evidence_photo')) {
            $validated['evidence_photo'] = $request->file('evidence_photo')->store('denunciations', 'public');
        }

        $denunciation->update($validated);

        return response()->json($denunciation);
    }

    public function destroy(Request $request, Denunciation $denunciation): JsonResponse
    {
        if ($denunciation->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $denunciation->delete();

        return response()->json(['message' => 'Denunciation deleted']);
    }
}
