<?php

namespace App\Http\Controllers;

use App\Http\Requests\Vacancy\IndexVacancyRequest;
use App\Http\Requests\Vacancy\StoreVacancyRequest;
use App\Http\Requests\Vacancy\UpdateVacancyRequest;
use App\Models\Vacancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class VacancyController extends Controller
{
    /**
     * List vacancies with summary fields, newest first, optionally filtered by title.
     * Cursor paginated, 10 per page.
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
            ->latest('id')
            ->cursorPaginate(10)
            ->withQueryString();

        return response()->json($vacancies);
    }

    /**
     * List the distinct locations used by vacancies, sorted alphabetically.
     */
    public function locations(): JsonResponse
    {
        $locations = Vacancy::query()
            ->distinct()
            ->orderBy('location')
            ->pluck('location');

        return response()->json($locations);
    }

    /**
     * Create a vacancy owned by the authenticated user.
     */
    public function store(StoreVacancyRequest $request): JsonResponse
    {
        $vacancy = $request->user()->vacancies()->create($request->validated());

        return response()->json($vacancy, 201);
    }

    /**
     * Return the full detail of a vacancy.
     */
    public function show(Vacancy $vacancy): JsonResponse
    {
        return response()->json($vacancy);
    }

    /**
     * Replace the editable fields of a vacancy.
     */
    public function update(UpdateVacancyRequest $request, Vacancy $vacancy): JsonResponse
    {
        $vacancy->update($request->validated());

        return response()->json($vacancy);
    }

    /**
     * Delete a vacancy.
     */
    public function destroy(Vacancy $vacancy): Response
    {
        $vacancy->delete();

        return response()->noContent();
    }
}
