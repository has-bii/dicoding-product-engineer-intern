<?php

namespace Tests\Integration\Vacancy;

use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ShowVacancyTest extends TestCase
{
    use RefreshDatabase;

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
