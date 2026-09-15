<?php

namespace App\Notifications;

use App\Models\FriendRequest;
use Illuminate\Notifications\Notification;

class FriendRequestNotification extends Notification
{
    public function __construct(
        public FriendRequest $request,
        public string $event,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'event' => $this->event,
            'request_id' => $this->request->id,
            'actor' => $this->request->requester->name,
            'message' => $this->message(),
        ];
    }

    private function message(): string
    {
        return match ($this->event) {
            'requested' => "{$this->request->requester->name} ismerősnek jelölt.",
            'accepted' => "{$this->request->recipient->name} elfogadta az ismerősnek jelölést.",
            default => "{$this->request->recipient->name} elutasította az ismerősnek jelölést.",
        };
    }
}
