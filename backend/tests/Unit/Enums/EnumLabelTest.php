<?php

namespace Tests\Unit\Enums;

use App\Enums\ExperienceLevel;
use App\Enums\JobType;
use PHPUnit\Framework\TestCase;

class EnumLabelTest extends TestCase
{
    public function test_job_type_labels(): void
    {
        $this->assertSame(
            ['Full-Time', 'Part-Time', 'Kontrak', 'Intern'],
            array_map(fn (JobType $type) => $type->label(), JobType::cases()),
        );
    }

    public function test_experience_level_labels(): void
    {
        $this->assertSame(
            ['Kurang dari 1 tahun', '1-3 tahun', '4-5 tahun', '6-10 tahun', 'Lebih dari 10 tahun'],
            array_map(fn (ExperienceLevel $level) => $level->label(), ExperienceLevel::cases()),
        );
    }
}
