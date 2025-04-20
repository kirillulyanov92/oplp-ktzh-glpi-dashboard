<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shift;
use App\Models\ShiftComment;
use Illuminate\Support\Facades\Auth;

class ShiftController extends Controller
{
    public function index()
    {
        return inertia('Dashboard', [
            'shifts' => Shift::with(['user', 'comments.user'])->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:day,night',
            'comment' => 'nullable|string',
        ]);

        // Создаем смену
        $shift = Shift::create([
            'user_id' => Auth::id(),
            'type' => $request->type,
            'date' => now()->toDateString(),
        ]);

        // Добавляем комментарий, если он есть
        if ($request->filled('comment')) {
            ShiftComment::create([
                'shift_id' => $shift->id,
                'user_id' => Auth::id(),
                'comment' => $request->comment,
            ]);
        }

        return redirect()->route('dashboard');
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
