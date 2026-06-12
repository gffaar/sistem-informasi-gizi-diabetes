<?php

namespace App\Services;

class NutritionCalculator
{
    public function calculate(array $data): array
    {
        $weight = (float) $data['berat_kg'];
        $height = (float) $data['tinggi_cm'];
        $age = (float) $data['usia'];
        $heightMeter = $height / 100;
        $imt = $weight / ($heightMeter * $heightMeter);
        $statusGizi = $this->statusGizi($imt);
        $bmr = $this->bmr($weight, $height, $age, $data['jenis_kelamin']);
        $tee = $bmr * $this->activityFactor($data['aktivitas']);
        $kalori = $this->adjustCalories($tee, $statusGizi);

        return [
            'imt' => round($imt, 2),
            'status_gizi' => $statusGizi,
            'bmr' => round($bmr, 2),
            'tee' => round($tee, 2),
            'kalori_total' => round($kalori, 2),
            'karbohidrat' => round((0.55 * $kalori) / 4, 2),
            'protein' => round((0.15 * $kalori) / 4, 2),
            'lemak' => round((0.30 * $kalori) / 9, 2),
        ];
    }

    private function statusGizi(float $imt): string
    {
        if ($imt < 18.5) {
            return 'Kurus';
        }

        if ($imt < 23) {
            return 'Normal';
        }

        if ($imt < 25) {
            return 'Overweight';
        }

        if ($imt < 30) {
            return 'Obesitas I';
        }

        return 'Obesitas II';
    }

    private function bmr(float $weight, float $height, float $age, string $gender): float
    {
        if ($gender === 'Laki-laki') {
            return 66.5 + (13.75 * $weight) + (5.003 * $height) - (6.775 * $age);
        }

        return 655.1 + (9.563 * $weight) + (1.850 * $height) - (4.676 * $age);
    }

    private function activityFactor(string $activity): float
    {
        return [
            'Sangat Ringan' => 1.2,
            'Ringan' => 1.4,
            'Sedang' => 1.7,
            'Berat' => 2.0,
        ][$activity];
    }

    private function adjustCalories(float $tee, string $statusGizi): float
    {
        return match ($statusGizi) {
            'Kurus' => $tee + 300,
            'Obesitas I', 'Obesitas II' => $tee - 500,
            default => $tee,
        };
    }
}
