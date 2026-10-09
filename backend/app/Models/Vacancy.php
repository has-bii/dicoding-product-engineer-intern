<?php

namespace App\Models;

use App\Enums\ExperienceLevel;
use App\Enums\JobType;
use Database\Factories\VacancyFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'title',
    'job_type',
    'candidates_needed',
    'active_until',
    'location',
    'is_remote',
    'description',
    'salary_min',
    'salary_max',
    'show_salary',
    'min_experience',
])]
class Vacancy extends Model
{
    /** @use HasFactory<VacancyFactory> */
    use HasFactory, HasUuids;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'job_type' => JobType::class,
            'min_experience' => ExperienceLevel::class,
            'active_until' => 'date',
            'candidates_needed' => 'integer',
            'is_remote' => 'boolean',
            'salary_min' => 'integer',
            'salary_max' => 'integer',
            'show_salary' => 'boolean',
        ];
    }
}
