<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class LoginRequestTest extends TestCase
{
    /**
     * @return array<string, array{array<string, mixed>, array<int, string>}>
     */
    public static function credentialsProvider(): array
    {
        return [
            'valid' => [['email' => 'user@example.com', 'password' => 'secret'], []],
            'missing both' => [[], ['email', 'password']],
            'invalid email' => [['email' => 'not-an-email', 'password' => 'secret'], ['email']],
            'short password' => [['email' => 'user@example.com', 'password' => '12345'], ['password']],
        ];
    }

    /**
     * @param  array<int, string>  $invalidFields
     */
    #[DataProvider('credentialsProvider')]
    public function test_validates_credentials(array $data, array $invalidFields): void
    {
        $errors = Validator::make($data, (new LoginRequest)->rules())->errors()->toArray();

        $this->assertSame($invalidFields, array_keys($errors));
    }
}
