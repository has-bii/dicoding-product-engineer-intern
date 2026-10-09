<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the admin user.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@dicoding.com'],
            [
                'name' => 'Admin',
                'password' => 'dicoding123',
                'email_verified_at' => now(),
            ],
        );
    }
}
