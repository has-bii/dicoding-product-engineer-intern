<?php

namespace Tests\Integration\Vacancy;

use App\Models\User;
use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ShowVacancyTest extends TestCase
{
    use RefreshDatabase;

    public function test_show_returns_vacancy_detail(): void
    {
        $vacancy = Vacancy::factory()->create(['show_salary' => true]);

        $this->getJson("/api/vacancy/{$vacancy->id}")
            ->assertOk()
            ->assertJsonPath('id', $vacancy->id)
            ->assertJsonPath('description', $vacancy->description)
            ->assertJsonPath('salary_min', $vacancy->salary_min)
            ->assertJsonPath('job_type', $vacancy->job_type->value);
    }

    public function test_show_hides_salary_range_when_show_salary_is_off(): void
    {
        $vacancy = Vacancy::factory()->create(['show_salary' => false]);

        $this->getJson("/api/vacancy/{$vacancy->id}")
            ->assertOk()
            ->assertJsonPath('show_salary', false)
            ->assertJsonMissingPath('salary_min')
            ->assertJsonMissingPath('salary_max');

        $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson("/api/vacancy/{$vacancy->id}")
            ->assertOk()
            ->assertJsonMissingPath('salary_min')
            ->assertJsonMissingPath('salary_max');
    }

    public function test_show_returns_hidden_salary_range_to_owner(): void
    {
        $vacancy = Vacancy::factory()->create(['show_salary' => false]);

        $this->actingAs($vacancy->user, 'sanctum')
            ->getJson("/api/vacancy/{$vacancy->id}")
            ->assertOk()
            ->assertJsonPath('salary_min', $vacancy->salary_min)
            ->assertJsonPath('salary_max', $vacancy->salary_max);
    }

    public function test_show_returns_not_found_for_unknown_vacancy(): void
    {
        $this->getJson('/api/vacancy/'.Str::uuid7())->assertNotFound();
        $this->getJson('/api/vacancy/not-a-uuid')->assertNotFound();
    }
}
