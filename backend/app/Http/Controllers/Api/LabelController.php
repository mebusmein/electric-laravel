<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Label;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LabelController extends Controller
{
    /**
     * Display a listing of the user's labels.
     */
    public function index(Request $request): JsonResponse
    {
        $labels = $request->user()->labels()->orderBy('name', 'asc')->get();

        return response()->json($labels);
    }

    /**
     * Store a newly created label.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'color' => ['required', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        DB::beginTransaction();
        $label = $request->user()->labels()->create([
            'name' => $validated['name'],
            'color' => $validated['color'],
        ]);
        $tx = DB::selectOne('SELECT txid_current() AS txid');
        DB::commit();

        return response()->json([
            'label' => $label,
            'txid' => $tx->txid,
        ], 201);
    }

    /**
     * Display the specified label.
     */
    public function show(Request $request, Label $label): JsonResponse
    {
        // Ensure the label belongs to the authenticated user
        if ($label->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($label);
    }

    /**
     * Update the specified label.
     */
    public function update(Request $request, Label $label): JsonResponse
    {
        // Ensure the label belongs to the authenticated user
        if ($label->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'color' => ['sometimes', 'required', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        DB::beginTransaction();
        $label->update($validated);
        $tx = DB::selectOne('SELECT txid_current() AS txid');
        DB::commit();

        return response()->json([
            'label' => $label,
            'txid' => $tx->txid,
        ]);
    }

    /**
     * Remove the specified label.
     */
    public function destroy(Request $request, Label $label): JsonResponse
    {
        // Ensure the label belongs to the authenticated user
        if ($label->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found'], 404);
        }

        DB::beginTransaction();
        $label->delete();
        $tx = DB::selectOne('SELECT txid_current() AS txid');
        DB::commit();

        return response()->json([
            'txid' => $tx->txid,
        ]);
    }
}

