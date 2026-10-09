<?php

namespace Tests\Integration\Vacancy;

use App\Models\User;
use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ManageVacancyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, mixed>
     */
    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Senior Product Engineer',
            'job_type' => 'contract',
            'candidates_needed' => 2,
            'active_until' => now()->addWeeks(2)->toDateString(),
            'location' => 'Bandung',
            'is_remote' => true,
            'description' => '<p>Updated description</p>',
            'salary_min' => 8_000_000,
            'salary_max' => 12_000_000,
            'show_salary' => true,
            'min_experience' => '4_to_5',
        ], $overrides);
    }

    public function test_store_creates_vacancy_owned_by_authenticated_user(): void
    {
        $user = User::factory()->create();
        $payload = $this->validPayload(['user_id' => User::factory()->create()->id]);

        $response = $this->actingAs($user)
            ->postJson('/api/vacancy', $payload)
            ->assertCreated()
            ->assertJsonPath('title', $payload['title'])
            ->assertJsonPath('user_id', $user->id);

        $vacancy = Vacancy::findOrFail($response->json('id'));

        $this->assertSame($user->id, $vacancy->user_id);
        $this->assertSame($payload['salary_min'], $vacancy->salary_min);
        $this->assertSame($payload['active_until'], $vacancy->active_until->toDateString());
    }

    public function test_store_rejects_invalid_payload_without_saving(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson('/api/vacancy', $this->validPayload(['title' => null]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('title');

        $this->assertDatabaseEmpty('vacancies');
    }

    public function test_store_requires_authentication(): void
    {
        $this->postJson('/api/vacancy', $this->validPayload())->assertUnauthorized();

        $this->assertDatabaseEmpty('vacancies');
    }

    public function test_update_replaces_vacancy_fields_but_keeps_owner(): void
    {
        $vacancy = Vacancy::factory()->create();
        $originalOwner = $vacancy->user_id;
        $payload = $this->validPayload([
            'salary_max' => null,
            'user_id' => User::factory()->create()->id,
        ]);

        $this->actingAs(User::factory()->create())
            ->putJson("/api/vacancy/{$vacancy->id}", $payload)
            ->assertOk()
            ->assertJsonPath('id', $vacancy->id)
            ->assertJsonPath('title', $payload['title'])
            ->assertJsonPath('job_type', $payload['job_type'])
            ->assertJsonPath('salary_max', null);

        $vacancy->refresh();

        $this->assertSame($payload['title'], $vacancy->title);
        $this->assertNull($vacancy->salary_max);
        $this->assertSame($payload['active_until'], $vacancy->active_until->toDateString());
        $this->assertSame($originalOwner, $vacancy->user_id);
    }

    public function test_update_rejects_invalid_payload_without_saving(): void
    {
        $vacancy = Vacancy::factory()->create();

        $this->actingAs(User::factory()->create())
            ->putJson("/api/vacancy/{$vacancy->id}", $this->validPayload(['title' => null]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('title');

        $this->assertSame($vacancy->title, $vacancy->refresh()->title);
    }

    public function test_update_requires_authentication(): void
    {
        $vacancy = Vacancy::factory()->create();

        $this->putJson("/api/vacancy/{$vacancy->id}", $this->validPayload())
            ->assertUnauthorized();
    }

    public function test_update_returns_not_found_for_unknown_vacancy(): void
    {
        $this->actingAs(User::factory()->create())
            ->putJson('/api/vacancy/'.Str::uuid7(), $this->validPayload())
            ->assertNotFound();
    }

    public function test_destroy_deletes_vacancy(): void
    {
        $vacancy = Vacancy::factory()->create();

        $this->actingAs(User::factory()->create())
            ->deleteJson("/api/vacancy/{$vacancy->id}")
            ->assertNoContent();

        $this->assertModelMissing($vacancy);
    }

    public function test_destroy_requires_authentication(): void
    {
        $vacancy = Vacancy::factory()->create();

        $this->deleteJson("/api/vacancy/{$vacancy->id}")->assertUnauthorized();

        $this->assertModelExists($vacancy);
    }

    public function test_destroy_returns_not_found_for_unknown_vacancy(): void
    {
        $this->actingAs(User::factory()->create())
            ->deleteJson('/api/vacancy/'.Str::uuid7())
            ->assertNotFound();
    }
}
