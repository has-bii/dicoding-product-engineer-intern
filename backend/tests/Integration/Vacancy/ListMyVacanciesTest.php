<?php

namespace Tests\Integration\Vacancy;

use App\Models\User;
use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListMyVacanciesTest extends TestCase
{
    use RefreshDatabase;

    public function test_mine_requires_authentication(): void
    {
        $this->getJson('/api/vacancy/mine')->assertUnauthorized();
    }

    public function test_mine_lists_only_vacancies_owned_by_the_current_user(): void
    {
        $user = User::factory()->create();
        $older = Vacancy::factory()->for($user)->create(['created_at' => now()->subDay()]);
        $newer = Vacancy::factory()->for($user)->create();
        Vacancy::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/vacancy/mine')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.id', $newer->id)
            ->assertJsonPath('data.1.id', $older->id)
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
            ->assertJsonMissingPath('data.0.user_id');
    }

    public function test_mine_filters_by_title(): void
    {
        $user = User::factory()->create();
        $match = Vacancy::factory()->for($user)->create(['title' => 'Product Engineer']);
        Vacancy::factory()->for($user)->create(['title' => 'Data Analyst']);
        Vacancy::factory()->create(['title' => 'Product Engineer']);

        $this->actingAs($user)
            ->getJson('/api/vacancy/mine?title=engineer')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $match->id);
    }

    public function test_mine_validates_title(): void
    {
        $this->actingAs(User::factory()->create())
            ->getJson('/api/vacancy/mine?title=ab')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('title');
    }

    public function test_mine_paginates_ten_vacancies_per_page_by_cursor(): void
    {
        $user = User::factory()->create();
        Vacancy::factory()->for($user)->count(12)->create();

        $firstPage = $this->actingAs($user)
            ->getJson('/api/vacancy/mine')
            ->assertOk()
            ->assertJsonCount(10, 'data');

        $this->getJson('/api/vacancy/mine?cursor='.$firstPage->json('next_cursor'))
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('next_cursor', null);
    }
}
