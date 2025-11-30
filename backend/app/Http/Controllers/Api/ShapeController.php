<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ShapeController extends Controller
{
    /**
     * Electric SQL protocol query parameters that should be passed through.
     */
    private const ELECTRIC_PROTOCOL_QUERY_PARAMS = [
        'offset',
        'handle',
        'live',
        'cursor',
        'where',
        'columns',
    ];

    /**
     * Proxy shape requests to ElectricSQL with user filtering.
     */
    public function todos(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Build the upstream ElectricSQL URL
        $electricUrl = env('ELECTRIC_URL', 'http://localhost:3000');
        $upstreamUrl = $electricUrl . '/v1/shape';

        // Build query parameters
        $queryParams = [];

        // Pass through Electric protocol parameters
        foreach (self::ELECTRIC_PROTOCOL_QUERY_PARAMS as $param) {
            if ($request->has($param)) {
                $queryParams[$param] = $request->query($param);
            }
        }

        // Set the table server-side
        $queryParams['table'] = 'todos';

        // Filter by user_id - users can only see their own todos
        $queryParams['where'] = "user_id = {$user->id}";

        // Make the request to ElectricSQL
        $response = Http::withOptions([
            'stream' => true,
        ])->get($upstreamUrl, $queryParams);

        // Get response headers, removing content-encoding and content-length
        // as fetch decompresses the body but doesn't update these headers
        $headers = collect($response->headers())
            ->except(['content-encoding', 'Content-Encoding', 'content-length', 'Content-Length', 'transfer-encoding', 'Transfer-Encoding'])
            ->toArray();

        return response($response->body(), $response->status())
            ->withHeaders($headers);
    }
}

