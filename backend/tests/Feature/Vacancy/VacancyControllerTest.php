<?php

namespace Tests\Feature\Vacancy;

use App\Models\User;
use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class VacancyControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_all_vacancies_with_summary_fields(): void
    {
        Vacancy::factory()->count(3)->create();

        $response = $this->getJson('/api/vacancy');

        $response->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [[
                    'id',
                    'title',
                    'job_type',
                    'location',
                    'active_until',
                    'min_experience',
                    'created_at',
                ]],
                'per_page',
                'next_cursor',
                'prev_cursor',
            ])
            ->assertJsonMissingPath('data.0.description')
            ->assertJsonMissingPath('data.0.salary_min')
            ->assertJsonMissingPath('data.0.user_id');
    }

    public function test_index_returns_newest_vacancies_first(): void
    {
        $older = Vacancy::factory()->create(['created_at' => now()->subDay()]);
        $newer = Vacancy::factory()->create();

        $this->getJson('/api/vacancy')
            ->assertOk()
            ->assertJsonPath('data.0.id', $newer->id)
            ->assertJsonPath('data.1.id', $older->id);
    }

    public function test_index_filters_by_title(): void
    {
        $match = Vacancy::factory()->create(['title' => 'Product Engineer']);
        Vacancy::factory()->create(['title' => 'Data Analyst']);

        $this->getJson('/api/vacancy?title=engineer')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $match->id);
    }

    public function test_index_trims_title_filter(): void
    {
        $match = Vacancy::factory()->create(['title' => 'Product Engineer']);
        Vacancy::factory()->create(['title' => 'Data Analyst']);

        $this->getJson('/api/vacancy?title='.urlencode('  product  '))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $match->id);
    }

    public function test_index_rejects_title_filter_shorter_than_three_characters(): void
    {
        $this->getJson('/api/vacancy?title='.urlencode(' ab '))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('title');
    }

    public function test_index_accepts_title_filter_with_inner_whitespace(): void
    {
        $match = Vacancy::factory()->create(['title' => 'Product Engineer']);
        Vacancy::factory()->create(['title' => 'Data Analyst']);

        $this->getJson('/api/vacancy?title='.urlencode('product engineer'))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $match->id);
    }

    /**
     * @return array<string, array{string}>
     */
    public static function nonAlphabeticTitleProvider(): array
    {
        return [
            'digits' => ['engineer 2'],
            'wildcard percent' => ['eng%'],
            'wildcard underscore' => ['eng_neer'],
            'punctuation' => ['back-end'],
        ];
    }

    #[DataProvider('nonAlphabeticTitleProvider')]
    public function test_index_rejects_title_filter_with_non_alphabetic_characters(string $title): void
    {
        $this->getJson('/api/vacancy?title='.urlencode($title))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('title');
    }

    public function test_index_ignores_blank_title_filter(): void
    {
        Vacancy::factory()->count(2)->create();

        $this->getJson('/api/vacancy?title='.urlencode('   '))
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_index_paginates_ten_vacancies_per_page_by_cursor(): void
    {
        $vacancies = collect(range(1, 12))
            ->map(fn (int $i) => Vacancy::factory()->create(['created_at' => now()->subMinutes($i)]));

        $firstPage = $this->getJson('/api/vacancy')
            ->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('per_page', 10)
            ->assertJsonPath('prev_cursor', null)
            ->assertJsonPath('data.0.id', $vacancies[0]->id);

        $nextCursor = $firstPage->json('next_cursor');
        $this->assertNotNull($nextCursor);

        $this->getJson('/api/vacancy?cursor='.$nextCursor)
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.id', $vacancies[10]->id)
            ->assertJsonPath('data.1.id', $vacancies[11]->id)
            ->assertJsonPath('next_cursor', null);
    }

    public function test_index_paginates_vacancies_sharing_the_same_created_at(): void
    {
        $createdAt = now()->subHour();
        Vacancy::factory()->count(15)->create(['created_at' => $createdAt]);

        $firstPage = $this->getJson('/api/vacancy')->assertOk();
        $secondPage = $this->getJson('/api/vacancy?cursor='.$firstPage->json('next_cursor'))->assertOk();

        $ids = collect($firstPage->json('data'))->merge($secondPage->json('data'))->pluck('id');

        $this->assertCount(15, $ids->unique());
    }

    public function test_index_keeps_title_filter_in_next_page_url(): void
    {
        Vacancy::factory()->count(11)->create(['title' => 'Product Engineer']);
        Vacancy::factory()->create(['title' => 'Data Analyst']);

        $response = $this->getJson('/api/vacancy?title=engineer')
            ->assertOk()
            ->assertJsonCount(10, 'data');

        $this->assertStringContainsString('title=engineer', $response->json('next_page_url'));

        $this->getJson($response->json('next_page_url'))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Product Engineer');
    }

    public function test_index_treats_invalid_cursor_as_first_page(): void
    {
        $vacancy = Vacancy::factory()->create();

        $this->getJson('/api/vacancy?cursor=not-a-cursor')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $vacancy->id);
    }

    public function test_show_returns_vacancy_detail(): void
    {
        $vacancy = Vacancy::factory()->create();

        $this->getJson("/api/vacancy/{$vacancy->id}")
            ->assertOk()
            ->assertJsonPath('id', $vacancy->id)
            ->assertJsonPath('description', $vacancy->description)
            ->assertJsonPath('salary_min', $vacancy->salary_min)
            ->assertJsonPath('job_type', $vacancy->job_type->value);
    }

    public function test_show_returns_not_found_for_unknown_vacancy(): void
    {
        $this->getJson('/api/vacancy/'.Str::uuid7())->assertNotFound();
        $this->getJson('/api/vacancy/not-a-uuid')->assertNotFound();
    }

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
        $payload = $this->validPayload();

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

    public function test_store_ignores_user_id_in_payload(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/vacancy', $this->validPayload([
                'user_id' => User::factory()->create()->id,
            ]))
            ->assertCreated();

        $this->assertSame($user->id, Vacancy::findOrFail($response->json('id'))->user_id);
    }

    public function test_store_requires_all_fields(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson('/api/vacancy')
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'title',
                'job_type',
                'candidates_needed',
                'active_until',
                'location',
                'is_remote',
                'description',
                'salary_min',
                'show_salary',
                'min_experience',
            ]);

        $this->assertDatabaseEmpty('vacancies');
    }

    #[DataProvider('invalidPayloadProvider')]
    public function test_store_rejects_invalid_payload(array $overrides, string $field): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson('/api/vacancy', $this->validPayload($overrides))
            ->assertUnprocessable()
            ->assertJsonValidationErrors($field);
    }

    public function test_store_requires_authentication(): void
    {
        $this->postJson('/api/vacancy', $this->validPayload())->assertUnauthorized();

        $this->assertDatabaseEmpty('vacancies');
    }

    public function test_update_replaces_vacancy_fields(): void
    {
        $vacancy = Vacancy::factory()->create();
        $payload = $this->validPayload();

        $this->actingAs(User::factory()->create())
            ->putJson("/api/vacancy/{$vacancy->id}", $payload)
            ->assertOk()
            ->assertJsonPath('id', $vacancy->id)
            ->assertJsonPath('title', $payload['title'])
            ->assertJsonPath('job_type', $payload['job_type']);

        $vacancy->refresh();

        $this->assertSame($payload['title'], $vacancy->title);
        $this->assertSame($payload['salary_max'], $vacancy->salary_max);
        $this->assertSame($payload['active_until'], $vacancy->active_until->toDateString());
    }

    public function test_update_allows_null_salary_max(): void
    {
        $vacancy = Vacancy::factory()->create();

        $this->actingAs(User::factory()->create())
            ->putJson("/api/vacancy/{$vacancy->id}", $this->validPayload(['salary_max' => null]))
            ->assertOk()
            ->assertJsonPath('salary_max', null);
    }

    public function test_update_does_not_change_owner(): void
    {
        $vacancy = Vacancy::factory()->create();
        $originalOwner = $vacancy->user_id;

        $this->actingAs(User::factory()->create())
            ->putJson("/api/vacancy/{$vacancy->id}", $this->validPayload([
                'user_id' => User::factory()->create()->id,
            ]))
            ->assertOk();

        $this->assertSame($originalOwner, $vacancy->refresh()->user_id);
    }

    public function test_update_requires_all_fields(): void
    {
        $vacancy = Vacancy::factory()->create();

        $this->actingAs(User::factory()->create())
            ->putJson("/api/vacancy/{$vacancy->id}")
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'title',
                'job_type',
                'candidates_needed',
                'active_until',
                'location',
                'is_remote',
                'description',
                'salary_min',
                'show_salary',
                'min_experience',
            ]);
    }

    /**
     * @return array<string, array{array<string, mixed>, string}>
     */
    public static function invalidPayloadProvider(): array
    {
        return [
            'unknown job type' => [['job_type' => 'freelance'], 'job_type'],
            'unknown experience level' => [['min_experience' => '2_to_3'], 'min_experience'],
            'zero candidates' => [['candidates_needed' => 0], 'candidates_needed'],
            'past active until' => [['active_until' => '2000-01-01'], 'active_until'],
            'salary max below min' => [['salary_min' => 10_000_000, 'salary_max' => 5_000_000], 'salary_max'],
            'negative salary min' => [['salary_min' => -1], 'salary_min'],
        ];
    }

    #[DataProvider('invalidPayloadProvider')]
    public function test_update_rejects_invalid_payload(array $overrides, string $field): void
    {
        $vacancy = Vacancy::factory()->create();

        $this->actingAs(User::factory()->create())
            ->putJson("/api/vacancy/{$vacancy->id}", $this->validPayload($overrides))
            ->assertUnprocessable()
            ->assertJsonValidationErrors($field);
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
