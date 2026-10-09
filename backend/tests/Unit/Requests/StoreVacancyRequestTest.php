<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\Vacancy\StoreVacancyRequest;
use App\Http\Requests\Vacancy\UpdateVacancyRequest;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class StoreVacancyRequestTest extends TestCase
{
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
            'description' => '<p>Description</p>',
            'salary_min' => 8_000_000,
            'salary_max' => 12_000_000,
            'show_salary' => true,
            'min_experience' => '4_to_5',
        ], $overrides);
    }

    /**
     * @return array<string, array<int, string>>
     */
    private function errors(array $data): array
    {
        return Validator::make($data, (new StoreVacancyRequest)->rules())->errors()->toArray();
    }

    public function test_accepts_valid_payload(): void
    {
        $this->assertEmpty($this->errors($this->validPayload()));
        $this->assertEmpty($this->errors($this->validPayload(['salary_max' => null])));
        $this->assertEmpty($this->errors($this->validPayload(['active_until' => now()->toDateString()])));
    }

    public function test_requires_all_fields_except_salary_max(): void
    {
        $this->assertEqualsCanonicalizing([
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
        ], array_keys($this->errors([])));
    }

    /**
     * @return array<string, array{array<string, mixed>, string}>
     */
    public static function invalidPayloadProvider(): array
    {
        return [
            'title too long' => [['title' => str_repeat('a', 256)], 'title'],
            'unknown job type' => [['job_type' => 'freelance'], 'job_type'],
            'zero candidates' => [['candidates_needed' => 0], 'candidates_needed'],
            'too many candidates' => [['candidates_needed' => 101], 'candidates_needed'],
            'past active until' => [['active_until' => '2000-01-01'], 'active_until'],
            'non-date active until' => [['active_until' => 'soon'], 'active_until'],
            'location too long' => [['location' => str_repeat('a', 256)], 'location'],
            'non-boolean is remote' => [['is_remote' => 'maybe'], 'is_remote'],
            'negative salary min' => [['salary_min' => -1], 'salary_min'],
            'salary max below min' => [['salary_min' => 10_000_000, 'salary_max' => 5_000_000], 'salary_max'],
            'non-boolean show salary' => [['show_salary' => 'maybe'], 'show_salary'],
            'unknown experience level' => [['min_experience' => '2_to_3'], 'min_experience'],
        ];
    }

    #[DataProvider('invalidPayloadProvider')]
    public function test_rejects_invalid_field(array $overrides, string $field): void
    {
        $this->assertSame([$field], array_keys($this->errors($this->validPayload($overrides))));
    }

    public function test_update_shares_store_rules(): void
    {
        $this->assertEquals((new StoreVacancyRequest)->rules(), (new UpdateVacancyRequest)->rules());
    }
}
