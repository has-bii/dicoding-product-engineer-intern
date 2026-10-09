<?php

namespace App\Http\Controllers;

use App\Http\Requests\Vacancy\IndexVacancyRequest;
use App\Models\Vacancy;
use Illuminate\Http\JsonResponse;

class VacancyController extends Controller
{
    /**
     * List vacancies with summary fields, newest first, optionally filtered by title.
     */
    public function index(IndexVacancyRequest $request): JsonResponse
    {
        $title = $request->validated('title');

        $vacancies = Vacancy::query()
            ->select([
                'id',
                'title',
                'job_type',
                'location',
                'active_until',
                'min_experience',
                'created_at',
            ])
            ->when($title, fn ($query) => $query->whereLike('title', "%{$title}%"))
            ->latest('created_at')
            ->get();

        return response()->json($vacancies);
    }

    /**
     * Return the full detail of a vacancy.
     */
    public function show(Vacancy $vacancy): JsonResponse
    {
        return response()->json($vacancy);
    }
}
