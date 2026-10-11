<?php

namespace App\Http\Controllers\Vacancy;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vacancy\IndexVacancyRequest;
use App\Http\Requests\Vacancy\StoreVacancyRequest;
use App\Http\Requests\Vacancy\UpdateVacancyRequest;
use App\Models\Vacancy;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class VacancyController extends Controller
{
    /**
     * List vacancies with summary fields, newest first, optionally filtered by title.
     * Cursor paginated, 10 per page.
     */
    public function index(IndexVacancyRequest $request): JsonResponse
    {
        return response()->json($this->listSummaries(Vacancy::query(), $request->validated('title')));
    }

    /**
     * List the authenticated user's vacancies, same shape, order, filter and pagination as index.
     */
    public function mine(IndexVacancyRequest $request): JsonResponse
    {
        return response()->json($this->listSummaries($request->user()->vacancies()->getQuery(), $request->validated('title')));
    }

    /**
     * @param  Builder<Vacancy>  $query
     * @return CursorPaginator<int, Vacancy>
     */
    private function listSummaries(Builder $query, ?string $title): CursorPaginator
    {
        return $query
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
     * The salary range is hidden when show_salary is off, unless the viewer owns the vacancy.
     */
    public function show(Request $request, Vacancy $vacancy): JsonResponse
    {
        // The route is public, so resolve the optional bearer token explicitly
        if (! $vacancy->show_salary && $request->user('sanctum')?->id !== $vacancy->user_id) {
            $vacancy->makeHidden(['salary_min', 'salary_max']);
        }

        return response()->json($vacancy);
    }

    /**
     * Replace the editable fields of a vacancy owned by the authenticated user.
     */
    public function update(UpdateVacancyRequest $request, Vacancy $vacancy): JsonResponse
    {
        $vacancy->update($request->validated());

        return response()->json($vacancy);
    }

    /**
     * Delete a vacancy owned by the authenticated user.
     */
    public function destroy(Vacancy $vacancy): Response
    {
        $vacancy->delete();

        return response()->noContent();
    }
}
