<?php

namespace Tests\Integration\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_returns_token_for_valid_credentials(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'token_type', 'user' => ['id', 'name', 'email']])
            ->assertJsonMissingPath('user.password');

        $this->assertCount(1, $user->tokens);
    }

    public function test_login_rejects_wrong_credentials_without_issuing_token(): void
    {
        $user = User::factory()->create();

        $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])->assertUnprocessable()->assertExactJson(['message' => 'Invalid email or password.']);

        $this->postJson('/api/auth/login', [
            'email' => 'unknown@example.com',
            'password' => 'password',
        ])->assertUnprocessable()->assertExactJson(['message' => 'Invalid email or password.']);

        $this->assertCount(0, $user->tokens);
    }

    public function test_login_rejects_invalid_payload(): void
    {
        $this->postJson('/api/auth/login')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_me_returns_authenticated_user(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('id', $user->id)
            ->assertJsonPath('email', $user->email);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/auth/me')->assertUnauthorized();
    }
}
