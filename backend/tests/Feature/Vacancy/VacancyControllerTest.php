<?php

namespace Tests\Feature\Vacancy;

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
            ->assertJsonCount(3)
            ->assertJsonStructure([[
                'id',
                'title',
                'job_type',
                'location',
                'active_until',
                'min_experience',
                'created_at',
            ]])
            ->assertJsonMissingPath('0.description')
            ->assertJsonMissingPath('0.salary_min')
            ->assertJsonMissingPath('0.user_id');
    }

    public function test_index_returns_newest_vacancies_first(): void
    {
        $older = Vacancy::factory()->create(['created_at' => now()->subDay()]);
        $newer = Vacancy::factory()->create();

        $this->getJson('/api/vacancy')
            ->assertOk()
            ->assertJsonPath('0.id', $newer->id)
            ->assertJsonPath('1.id', $older->id);
    }

    public function test_index_filters_by_title(): void
    {
        $match = Vacancy::factory()->create(['title' => 'Product Engineer']);
        Vacancy::factory()->create(['title' => 'Data Analyst']);

        $this->getJson('/api/vacancy?title=engineer')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $match->id);
    }

    public function test_index_trims_title_filter(): void
    {
        $match = Vacancy::factory()->create(['title' => 'Product Engineer']);
        Vacancy::factory()->create(['title' => 'Data Analyst']);

        $this->getJson('/api/vacancy?title='.urlencode('  product  '))
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $match->id);
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
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $match->id);
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
            ->assertJsonCount(2);
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
}
