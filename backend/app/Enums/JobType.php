<?php

namespace App\Enums;

enum JobType: string
{
    case FullTime = 'full_time';
    case PartTime = 'part_time';
    case Contract = 'contract';
    case Internship = 'internship';

    public function label(): string
    {
        return match ($this) {
            self::FullTime => 'Full-Time',
            self::PartTime => 'Part-Time',
            self::Contract => 'Kontrak',
            self::Internship => 'Intern',
        };
    }
}
