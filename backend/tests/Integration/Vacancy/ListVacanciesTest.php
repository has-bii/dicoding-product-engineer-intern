<?php

namespace Tests\Integration\Vacancy;

use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListVacanciesTest extends TestCase
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

        $this->getJson('/api/vacancy?title='.urlencode('product engineer'))
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

    public function test_index_validates_title_after_trimming(): void
    {
        $this->getJson('/api/vacancy?title='.urlencode(' ab '))
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

    public function test_locations_lists_distinct_locations_alphabetically(): void
    {
        Vacancy::factory()->create(['location' => 'Jakarta']);
        Vacancy::factory()->create(['location' => 'Bandung']);
        Vacancy::factory()->create(['location' => 'Jakarta']);

        $this->getJson('/api/vacancy/locations')
            ->assertOk()
            ->assertExactJson(['Bandung', 'Jakarta']);
    }

    public function test_locations_returns_empty_list_without_vacancies(): void
    {
        $this->getJson('/api/vacancy/locations')
            ->assertOk()
            ->assertExactJson([]);
    }
}
