<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vacancy;

class VacancyPolicy
{
    /**
     * Only the owner can update a vacancy.
     */
    public function update(User $user, Vacancy $vacancy): bool
    {
        return $user->id === $vacancy->user_id;
    }

    /**
     * Only the owner can delete a vacancy.
     */
    public function delete(User $user, Vacancy $vacancy): bool
    {
        return $user->id === $vacancy->user_id;
    }
}
