<?php

namespace Database\Factories;

use App\Enums\ExperienceLevel;
use App\Enums\JobType;
use App\Models\User;
use App\Models\Vacancy;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Vacancy>
 */
class VacancyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $salaryMin = fake()->numberBetween(4, 10) * 1_000_000;

        return [
            'user_id' => User::factory(),
            'title' => fake()->jobTitle(),
            'job_type' => fake()->randomElement(JobType::cases()),
            'candidates_needed' => fake()->numberBetween(1, 5),
            'active_until' => now()->addMonth(),
            'location' => fake()->city(),
            'is_remote' => fake()->boolean(),
            'description' => '<p>'.fake()->paragraph().'</p>',
            'salary_min' => $salaryMin,
            'salary_max' => $salaryMin + 4_000_000,
            'show_salary' => fake()->boolean(),
            'min_experience' => fake()->randomElement(ExperienceLevel::cases()),
        ];
    }
}
