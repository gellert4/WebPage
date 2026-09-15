<?php

namespace App\Http\Controllers;

use App\Models\Block;
use App\Models\FriendRequest;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function __invoke(Request $request): View
    {
        $user = $request->user();
        $incoming = FriendRequest::with('requester')
            ->where('recipient_id', $user->id)->where('status', 'pending')->latest()->get();
        $friends = FriendRequest::with(['requester', 'recipient'])
            ->where('status', 'accepted')
            ->where(fn ($query) => $query->where('requester_id', $user->id)->orWhere('recipient_id', $user->id))
            ->latest()->get();
        $blockedUsers = Block::with('blocked')->where('blocker_id', $user->id)->latest()->get();

        return view('dashboard', [
            'incomingRequests' => $incoming,
            'friends' => $friends,
            'notifications' => $user->notifications()->latest()->limit(6)->get(),
            'blockedUsers' => $blockedUsers,
        ]);
    }
}
