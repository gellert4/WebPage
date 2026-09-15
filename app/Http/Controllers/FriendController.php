<?php

namespace App\Http\Controllers;

use App\Models\Block;
use App\Models\FriendRequest;
use App\Models\User;
use App\Notifications\FriendRequestNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FriendController extends Controller
{
    public function send(Request $request, User $user): RedirectResponse
    {
        abort_if($user->id === $request->user()->id || $user->status !== 'approved', 404);
        abort_if(Block::where(fn ($query) => $query->where('blocker_id', $request->user()->id)->where('blocked_id', $user->id)
            ->orWhere(fn ($query) => $query->where('blocker_id', $user->id)->where('blocked_id', $request->user()->id)))->exists(), 403);

        $existing = FriendRequest::where(fn ($query) => $query
            ->where('requester_id', $request->user()->id)->where('recipient_id', $user->id)
            ->orWhere(fn ($query) => $query->where('requester_id', $user->id)->where('recipient_id', $request->user()->id)))->latest()->first();
        if ($existing?->status === 'accepted' || $existing?->status === 'pending') {
            return back()->with('error', 'Ehhez a felhasználóhoz már van aktív kapcsolat.');
        }

        $friendRequest = FriendRequest::create(['requester_id' => $request->user()->id, 'recipient_id' => $user->id, 'status' => 'pending']);
        $user->notify(new FriendRequestNotification($friendRequest->load('requester', 'recipient'), 'requested'));

        return back()->with('status', 'Az ismerősnek jelölés elküldve.');
    }

    public function respond(Request $request, FriendRequest $friendRequest): RedirectResponse
    {
        abort_unless($friendRequest->recipient_id === $request->user()->id && $friendRequest->status === 'pending', 403);
        $decision = $request->validate(['decision' => ['required', 'in:accepted,rejected']])['decision'];
        $friendRequest->update(['status' => $decision]);
        $friendRequest->load('requester', 'recipient');
        $friendRequest->requester->notify(new FriendRequestNotification($friendRequest, $decision));

        return back()->with('status', $decision === 'accepted' ? 'Ismerősnek jelölés elfogadva.' : 'Ismerősnek jelölés elutasítva.');
    }

    public function remove(Request $request, FriendRequest $friendRequest): RedirectResponse
    {
        abort_unless($friendRequest->status === 'accepted' && ($friendRequest->requester_id === $request->user()->id || $friendRequest->recipient_id === $request->user()->id), 403);
        $friendRequest->delete();

        return back()->with('status', 'Az ismerősi kapcsolat megszüntetve.');
    }

    public function block(Request $request, User $user): RedirectResponse
    {
        abort_if($user->id === $request->user()->id, 422);
        Block::firstOrCreate(['blocker_id' => $request->user()->id, 'blocked_id' => $user->id]);
        FriendRequest::where(fn ($query) => $query
            ->where(fn ($q) => $q->where('requester_id', $request->user()->id)->where('recipient_id', $user->id))
            ->orWhere(fn ($q) => $q->where('requester_id', $user->id)->where('recipient_id', $request->user()->id)))->delete();

        return back()->with('status', 'A felhasználót letiltottad.');
    }

    public function unblock(Request $request, User $user): RedirectResponse
    {
        Block::where('blocker_id', $request->user()->id)->where('blocked_id', $user->id)->delete();

        return back()->with('status', 'A tiltást feloldottad.');
    }
}