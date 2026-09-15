<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect()->route('login');
});

Route::middleware('guest')->group(function () {
    Route::get('/belepes', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/belepes', [AuthController::class, 'login'])->name('login.store');
    Route::get('/regisztracio', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/regisztracio', [AuthController::class, 'register'])->name('register.store');
});

Route::middleware('auth')->group(function () {
    Route::post('/kijelentkezes', [AuthController::class, 'logout'])->name('logout');
    Route::get('/kezdooldal', DashboardController::class)->name('dashboard');
    Route::get('/felhasznalok', [UserController::class, 'index'])->name('users.index');
    Route::post('/felhasznalok/{user}/ismeros', [FriendController::class, 'send'])->name('friends.send');
    Route::post('/ismeros-keresek/{friendRequest}', [FriendController::class, 'respond'])->name('friends.respond');
    Route::delete('/ismerosok/{friendRequest}', [FriendController::class, 'remove'])->name('friends.remove');
    Route::post('/felhasznalok/{user}/tiltas', [FriendController::class, 'block'])->name('blocks.store');
    Route::delete('/felhasznalok/{user}/tiltas', [FriendController::class, 'unblock'])->name('blocks.destroy');
    Route::get('/ertesitesek', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('/ertesitesek/{notification}/olvasott', [NotificationController::class, 'read'])->name('notifications.read');

    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/regisztraciok', [AdminController::class, 'index'])->name('index');
        Route::patch('/regisztraciok/{user}', [AdminController::class, 'decide'])->name('decide');
    });
});
