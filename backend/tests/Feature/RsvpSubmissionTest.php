<?php

namespace Tests\Feature;

use App\Models\Rsvp;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RsvpSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_submit_an_attending_rsvp(): void
    {
        $response = $this->postJson('/api/rsvps', [
            'name' => 'Jamie Guest',
            'attending' => true,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('rsvp.name', 'Jamie Guest')
            ->assertJsonPath('rsvp.attending', true);

        $this->assertDatabaseHas('rsvps', [
            'name' => 'Jamie Guest',
            'attending' => true,
        ]);
    }

    public function test_guest_can_decline_and_invalid_rsvps_are_rejected(): void
    {
        $this->postJson('/api/rsvps', [
            'name' => 'Alex Guest',
            'attending' => false,
        ])->assertCreated();

        $this->assertDatabaseHas('rsvps', [
            'name' => 'Alex Guest',
            'attending' => false,
        ]);

        $this->postJson('/api/rsvps', [
            'name' => '',
            'attending' => 'maybe',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'attending']);

        $this->assertSame(1, Rsvp::count());
    }
}
