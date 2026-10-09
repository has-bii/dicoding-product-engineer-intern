<?php

namespace Database\Seeders;

use App\Enums\ExperienceLevel;
use App\Enums\JobType;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VacancySeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the Product Engineer vacancy owned by the admin user.
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@dicoding.com')->firstOrFail();

        $admin->vacancies()->updateOrCreate(
            ['title' => 'Product Engineer'],
            [
                'position' => 'Product Engineer',
                'job_type' => JobType::FullTime,
                'candidates_needed' => 1,
                'active_until' => now()->addMonth(),
                'location' => 'Bandung',
                'is_remote' => false,
                'description' => $this->description(),
                'salary_min' => 8_000_000,
                'salary_max' => 12_000_000,
                'show_salary' => false,
                'min_experience' => ExperienceLevel::OneToThree,
            ],
        );
    }

    private function description(): string
    {
        return <<<'HTML'
        <h2>Job Description</h2>
        <p>As a Product Engineer, you will be joining the Product &amp; Engineering team in building impactful products for Dicoding users. With your programming skills, you will be responsible for creating great experiences for our users.</p>
        <p>We are looking for an engineer, who not only knows how to program with good functionality, but also solves user problems. When building <a href="https://www.dicoding.com">dicoding.com</a>, we always try to:</p>
        <ul>
            <li>Give maximum impact from the solutions we built.</li>
            <li>Live a balanced life (it is important for engineers to sleep well).</li>
        </ul>
        <h2>Responsibilities</h2>
        <ul>
            <li>Collaborate with designers and other stakeholders in analyzing problems and solutions to be built.</li>
            <li>Develop and manage the <a href="https://www.dicoding.com">dicoding.com</a> platform.</li>
            <li>Ensure all systems and components on <a href="https://www.dicoding.com">dicoding.com</a> run properly.</li>
            <li>Write well-designed, easy-to-test, efficient, and clean code on both the front-end and back-end.</li>
        </ul>
        <h2>Requirements</h2>
        <p>When it comes to requirements, at Dicoding, we have no limitations on specific tools or technologies. We are open to any technology and tools that can meet the business needs and provide the best solutions for our users. With that in mind, here are the general requirements for a Product Engineer at Dicoding:</p>
        <ul>
            <li>Proficiency in Git and Unix-based systems.</li>
            <li>Good knowledge of web technologies.</li>
            <li>Want to follow and learn the development culture in Dicoding: Test Driven Development.</li>
            <li>Able to understand the requirements of a solution that will be built properly.</li>
            <li>Having a growth mindset and high curiosity.</li>
        </ul>
        HTML;
    }
}
