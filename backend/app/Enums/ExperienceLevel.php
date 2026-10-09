<?php

namespace App\Enums;

enum ExperienceLevel: string
{
    case LessThanOne = 'less_than_1';
    case OneToThree = '1_to_3';
    case FourToFive = '4_to_5';
    case SixToTen = '6_to_10';
    case MoreThanTen = 'more_than_10';

    public function label(): string
    {
        return match ($this) {
            self::LessThanOne => 'Kurang dari 1 tahun',
            self::OneToThree => '1-3 tahun',
            self::FourToFive => '4-5 tahun',
            self::SixToTen => '6-10 tahun',
            self::MoreThanTen => 'Lebih dari 10 tahun',
        };
    }
}
