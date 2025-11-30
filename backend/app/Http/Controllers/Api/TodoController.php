<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    /**
     * Display a listing of the user's todos.
     */
    public function index(Request $request): JsonResponse
    {
        $todos = $request->user()->todos()->orderBy('created_at', 'desc')->get();

        return response()->json($todos);
    }

    /**
     * Store a newly created todo.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $todo = $request->user()->todos()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'completed' => false,
        ]);

        return response()->json($todo, 201);
    }

    /**
     * Display the specified todo.
     */
    public function show(Request $request, Todo $todo): JsonResponse
    {
        // Ensure the todo belongs to the authenticated user
        if ($todo->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($todo);
    }

    /**
     * Update the specified todo.
     */
    public function update(Request $request, Todo $todo): JsonResponse
    {
        // Ensure the todo belongs to the authenticated user
        if ($todo->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'completed' => ['sometimes', 'boolean'],
        ]);

        $todo->update($validated);

        return response()->json($todo);
    }

    /**
     * Remove the specified todo.
     */
    public function destroy(Request $request, Todo $todo): JsonResponse
    {
        // Ensure the todo belongs to the authenticated user
        if ($todo->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $todo->delete();

        return response()->json(['message' => 'Todo deleted successfully']);
    }
}

