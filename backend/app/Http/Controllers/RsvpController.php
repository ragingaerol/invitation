<?php

namespace App\Http\Controllers;

use App\Models\Rsvp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RsvpController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'attending' => ['required', 'boolean'],
        ]);

        $rsvp = Rsvp::create($validated);

        return response()->json([
            'message' => 'RSVP received.',
            'rsvp' => $rsvp,
        ], 201);
    }
}
