<?php

namespace Tests\Feature;

use App\Models\Block;
use App\Models\FriendRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SocialFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_waits_for_admin_approval(): void
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Teszt Elek', 'email' => 'elek@example.com',
            'password' => 'password123', 'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseHas('users', ['email' => 'elek@example.com', 'status' => 'pending']);
        $this->post(route('login.store'), ['email' => 'elek@example.com', 'password' => 'password123'])
            ->assertSessionHasErrors('email');
    }

    public function test_admin_can_approve_a_registration_and_user_can_log_in(): void
    {
        $admin = User::factory()->create(['status' => 'approved', 'is_admin' => true]);
        $applicant = User::factory()->create(['status' => 'pending']);

        $this->actingAs($admin)->patch(route('admin.decide', $applicant), ['status' => 'approved'])
            ->assertSessionHas('status');
        $this->assertDatabaseHas('users', ['id' => $applicant->id, 'status' => 'approved']);
        $this->post(route('login.store'), ['email' => $applicant->email, 'password' => 'password'])
            ->assertRedirect(route('dashboard'));
    }

    public function test_friend_request_and_decision_create_database_notifications(): void
    {
        [$sender, $recipient] = $this->approvedUsers();

        $this->actingAs($sender)->post(route('friends.send', $recipient))->assertSessionHas('status');
        $request = FriendRequest::firstOrFail();
        $this->assertDatabaseHas('notifications', ['notifiable_id' => $recipient->id]);

        $this->actingAs($recipient)->post(route('friends.respond', $request), ['decision' => 'accepted'])
            ->assertSessionHas('status');
        $this->assertDatabaseHas('friend_requests', ['id' => $request->id, 'status' => 'accepted']);
        $this->assertSame(1, $sender->notifications()->count());
    }

    public function test_blocked_users_cannot_send_requests_or_appear_in_directory(): void
    {
        [$blocker, $blocked] = $this->approvedUsers();
        Block::create(['blocker_id' => $blocker->id, 'blocked_id' => $blocked->id]);

        $this->actingAs($blocked)->post(route('friends.send', $blocker))->assertForbidden();
        $this->actingAs($blocker)->get(route('users.index'))->assertDontSee($blocked->email);
        $this->actingAs($blocker)->delete(route('blocks.destroy', $blocked))->assertSessionHas('status');
        $this->assertDatabaseMissing('blocks', ['blocker_id' => $blocker->id, 'blocked_id' => $blocked->id]);
    }

    public function test_directory_can_search_by_name_or_email(): void
    {
        $viewer = User::factory()->create(['status' => 'approved']);
        $match = User::factory()->create(['name' => 'Kék Alma', 'email' => 'alma@example.com', 'status' => 'approved']);
        User::factory()->create(['name' => 'Másik Ember', 'status' => 'approved']);

        $this->actingAs($viewer)->get(route('users.index', ['q' => 'alma']))
            ->assertOk()->assertSee($match->name)->assertDontSee('Másik Ember');
    }

    private function approvedUsers(): array
    {
        return [
            User::factory()->create(['status' => 'approved']),
            User::factory()->create(['status' => 'approved']),
        ];
    }
}
