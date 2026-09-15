<?php

namespace App\Http\Controllers;

use App\Models\Block;
use App\Models\FriendRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\View\View;

class UserController extends Controller
{
    public function index(Request $request): View
    {
        $user = $request->user();
        $excludedIds = Block::where('blocker_id', $user->id)->pluck('blocked_id')
            ->merge(Block::where('blocked_id', $user->id)->pluck('blocker_id'))
            ->push($user->id);
        $people = User::query()->where('status', 'approved')->whereNotIn('id', $excludedIds)
            ->when($request->filled('q'), fn ($query) => $query->where(fn ($q) => $q
                ->where('name', 'like', '%'.$request->string('q').'%')
                ->orWhere('email', 'like', '%'.$request->string('q').'%')))
            ->orderBy('name')->paginate(8)->withQueryString();

        $states = FriendRequest::where(function ($query) use ($user) {
            $query->where('requester_id', $user->id)->orWhere('recipient_id', $user->id);
        })->get()->keyBy(fn ($request) => $request->requester_id === $user->id ? $request->recipient_id : $request->requester_id);

        return view('users.index', compact('people', 'states'));
    }
}
