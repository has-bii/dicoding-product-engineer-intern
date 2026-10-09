<?php

namespace App\Http\Requests\Vacancy;

use App\Enums\ExperienceLevel;
use App\Enums\JobType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVacancyRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'job_type' => ['required', Rule::enum(JobType::class)],
            'candidates_needed' => ['required', 'integer', 'min:1', 'max:100'],
            'active_until' => ['required', 'date', 'after_or_equal:today'],
            'location' => ['required', 'string', 'max:255'],
            'is_remote' => ['required', 'boolean'],
            'description' => ['required', 'string'],
            'salary_min' => ['required', 'integer', 'min:0'],
            'salary_max' => ['nullable', 'integer', 'gte:salary_min'],
            'show_salary' => ['required', 'boolean'],
            'min_experience' => ['required', Rule::enum(ExperienceLevel::class)],
        ];
    }
}
