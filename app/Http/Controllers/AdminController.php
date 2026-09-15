<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AdminController extends Controller
{
    public function index(): View
    {
        return view('admin.index', ['pendingUsers' => User::where('status', 'pending')->oldest()->paginate(12)]);
    }

    public function decide(Request $request, User $user): RedirectResponse
    {
        $status = $request->validate(['status' => ['required', 'in:approved,rejected']])['status'];
        $user->update(['status' => $status]);

        return back()->with('status', $status === 'approved' ? 'A regisztráció jóváhagyva.' : 'A regisztráció elutasítva.');
    }
}
