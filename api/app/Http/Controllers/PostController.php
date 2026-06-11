<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Listar todos os posts do feed (mais recentes primeiro).
     */
    public function index()
    {
        $posts = Post::with('user:id,name,email')
            ->orderBy('publish_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($posts);
    }

    /**
     * Criar um novo post no feed.
     */
    public function store(Request $request)
    {
        $request->validate([
            'text'  => 'required|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $data = [
            'text'         => $request->text,
            'publish_date' => now()->toDateString(),
            'user_id'      => $request->user()->id,
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('posts', 'supabase');
            $data['image_path'] = $path;
        }

        $post = Post::create($data);
        $post->load('user:id,name,email');

        return response()->json($post, 201);
    }

    /**
     * Exibir um post específico.
     */
    public function show(string $id)
    {
        $post = Post::with('user:id,name,email')->findOrFail($id);

        return response()->json($post);
    }

    /**
     * Atualizar um post existente.
     */
    public function update(Request $request, string $id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $request->validate([
            'text'  => 'sometimes|required|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($request->has('text')) {
            $post->text = $request->text;
        }

        if ($request->hasFile('image')) {
            
            if ($post->image_path) {
                Storage::disk('supabase')->delete($post->image_path);
            }

            $path = $request->file('image')->store('posts', 'supabase');
            $post->image_path = $path;
        }

        $post->save();
        $post->load('user:id,name,email');

        return response()->json($post);
    }

    /**
     * Deletar um post.
     */
    public function destroy(Request $request, string $id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }
        if ($post->image) {
            Storage::disk('supabase')->delete($post->image);
        }

        $post->delete();

        return response()->json(['message' => 'Post deletado com sucesso.']);
    }
}
