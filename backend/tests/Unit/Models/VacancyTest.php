<?php

namespace Tests\Unit\Models;

use App\Enums\ExperienceLevel;
use App\Enums\JobType;
use App\Models\Vacancy;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class VacancyTest extends TestCase
{
    public function test_casts_attributes(): void
    {
        $vacancy = new Vacancy([
            'job_type' => 'full_time',
            'min_experience' => '1_to_3',
            'active_until' => '2026-12-31',
            'candidates_needed' => '3',
            'is_remote' => 1,
            'salary_min' => '5000000',
            'salary_max' => '9000000',
            'show_salary' => 0,
        ]);

        $this->assertSame(JobType::FullTime, $vacancy->job_type);
        $this->assertSame(ExperienceLevel::OneToThree, $vacancy->min_experience);
        $this->assertInstanceOf(Carbon::class, $vacancy->active_until);
        $this->assertSame('2026-12-31', $vacancy->active_until->toDateString());
        $this->assertSame(3, $vacancy->candidates_needed);
        $this->assertTrue($vacancy->is_remote);
        $this->assertSame(5_000_000, $vacancy->salary_min);
        $this->assertSame(9_000_000, $vacancy->salary_max);
        $this->assertFalse($vacancy->show_salary);
    }

    public function test_owner_is_not_mass_assignable(): void
    {
        $vacancy = new Vacancy(['title' => 'Engineer', 'user_id' => 1]);

        $this->assertSame('Engineer', $vacancy->title);
        $this->assertNull($vacancy->user_id);
    }
}
