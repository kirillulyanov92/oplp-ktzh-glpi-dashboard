<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\ShiftCommentController;
use App\Models\Shift;
use App\Http\Controllers\NagiosController;
use App\Http\Controllers\TicketController;


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/shifts', [ShiftController::class, 'index'])->name('shifts');
    Route::post('/shifts', [ShiftController::class, 'store']); // Добавление смены
    Route::post('/shifts/{shift}/comments', [ShiftCommentController::class, 'store']); // Добавление комментария
});

Route::get('/', function () {
    return redirect('/login');
});

Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    $shifts = Shift::with('user', 'comments.user')->latest()->get();
    return Inertia::render('Dashboard123', [
        'shifts' => $shifts
    ]);
})->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/tickets', [\App\Http\Controllers\TicketController::class, 'index'])->name('tickets.index');
});

Route::middleware(['auth'])->group(function() {
    Route::get('/nagios', [NagiosController::class, 'index']);
    Route::get('/nagios/hostlist', [NagiosController::class, 'getHostList']);
});

require __DIR__.'/auth.php';
