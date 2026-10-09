<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\Vacancy\IndexVacancyRequest;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class IndexVacancyRequestTest extends TestCase
{
    /**
     * @return array<string, array{?string, bool}>
     */
    public static function titleProvider(): array
    {
        return [
            'absent' => [null, true],
            'single word' => ['engineer', true],
            'inner whitespace' => ['Product Engineer', true],
            'too short' => ['ab', false],
            'digits' => ['engineer 2', false],
            'wildcard percent' => ['eng%', false],
            'wildcard underscore' => ['eng_neer', false],
            'punctuation' => ['back-end', false],
        ];
    }

    #[DataProvider('titleProvider')]
    public function test_validates_title(?string $title, bool $passes): void
    {
        $validator = Validator::make(['title' => $title], (new IndexVacancyRequest)->rules());

        $this->assertSame($passes, $validator->passes());
    }
}
