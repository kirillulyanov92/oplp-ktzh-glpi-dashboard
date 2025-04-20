<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shift;
use App\Models\ShiftComment;


class ShiftCommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }


    public function store(Request $request)
    {
        $shift = Shift::where('user_id', auth()->id())
            ->where('date', now()->toDateString())
            ->first();

        if (!$shift) {
            return response()->json(['error' => 'У вас нет смены сегодня!'], 403);
        }

        $validated = $request->validate([
            'comment' => 'required|string|max:500',
        ]);

        $comment = $shift->comments()->create([
            'user_id' => auth()->id(),
            'comment' => $validated['comment'],
        ]);

        return response()->json($comment, 201);
    }
    

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
