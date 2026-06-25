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
        $denunciations = Denunciation::with(['user:id,name', 'evidences'])
            ->latest()
            ->paginate(15);
        return response()->json($denunciations);
    }

    public function myDenunciations(Request $request): JsonResponse
    {
        $denunciations = $request->user()->denunciations()->with(['user:id,name', 'evidences'])
            ->latest()
            ->paginate(15);
        return response()->json($denunciations);
    }

    public function store(StoreDenunciationRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $denunciation = $request->user()->denunciations()->create($validated);
        
        if ($request->hasFile('evidence_photos')) {
            foreach ($request->file('evidence_photos') as $photo) {
                $path = $photo->store('denunciations', 'public');
                $denunciation->evidences()->create(['photo_path' => $path]);
            }
        }
        
        return response()->json($denunciation->load('evidences'), 201);
    }

    public function show(Denunciation $denunciation): JsonResponse
    {
        return response()->json($denunciation->load(['user:id,name', 'evidences']));
    }

    public function update(UpdateDenunciationRequest $request, Denunciation $denunciation): JsonResponse
    {
        $validated = $request->validated();
        $denunciation->update($validated);
        
        if ($request->hasFile('evidence_photos')) {
            foreach ($request->file('evidence_photos') as $photo) {
                $path = $photo->store('denunciations', 'public');
                $denunciation->evidences()->create(['photo_path' => $path]);
            }
        }
        
        return response()->json($denunciation->load('evidences'));
    }

    public function destroy(Request $request, Denunciation $denunciation): JsonResponse
    {
        if ($denunciation->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $denunciation->delete();
        return response()->json(['message' => 'Denúncia excluída com sucesso.']);
    }
}
