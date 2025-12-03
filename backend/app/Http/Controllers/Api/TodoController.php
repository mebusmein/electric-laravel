<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            'label_ids' => ['nullable', 'array'],
            'label_ids.*' => ['integer', 'exists:labels,id'],
        ]);

        DB::beginTransaction();
        $todo = $request->user()->todos()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'completed' => false,
        ]);

        // Sync labels if provided
        if (!empty($validated['label_ids'])) {
            // Verify labels belong to user
            $userLabelIds = $request->user()->labels()->whereIn('id', $validated['label_ids'])->pluck('id');
            $todo->labels()->sync($userLabelIds);
        }

        $tx = DB::selectOne('SELECT txid_current() AS txid');
        DB::commit();

        return response()->json([
            'todo' => $todo,
            'txid' => $tx->txid,
        ], 201);
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
            'label_ids' => ['nullable', 'array'],
            'label_ids.*' => ['integer', 'exists:labels,id'],
        ]);

        DB::beginTransaction();

        // Extract label_ids before updating
        $labelIds = $validated['label_ids'] ?? null;
        unset($validated['label_ids']);

        $todo->update($validated);

        // Sync labels if provided
        if ($labelIds !== null) {
            // Verify labels belong to user
            $userLabelIds = $request->user()->labels()->whereIn('id', $labelIds)->pluck('id');
            $todo->labels()->sync($userLabelIds);
        }

        $tx = DB::selectOne('SELECT txid_current() AS txid');
        DB::commit();

        return response()->json([
            'todo' => $todo,
            'txid' => $tx->txid,
        ]);
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

        DB::beginTransaction();
        $todo->delete();
        $tx = DB::selectOne('SELECT txid_current() AS txid');
        DB::commit();

        return response()->json([
            'txid' => $tx->txid,
        ]);
    }

    /**
     * Sync labels for the specified todo.
     */
    public function syncLabels(Request $request, Todo $todo): JsonResponse
    {
        // Ensure the todo belongs to the authenticated user
        if ($todo->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $validated = $request->validate([
            'label_ids' => ['required', 'array'],
            'label_ids.*' => ['integer', 'exists:labels,id'],
        ]);

        DB::beginTransaction();

        // Verify labels belong to user
        $userLabelIds = $request->user()->labels()->whereIn('id', $validated['label_ids'])->pluck('id');
        $todo->labels()->sync($userLabelIds);

        $tx = DB::selectOne('SELECT txid_current() AS txid');
        DB::commit();

        return response()->json([
            'txid' => $tx->txid,
        ]);
    }
}

