<?php

namespace App\Services;

use App\Models\MenuMakanan;
use App\Models\RekamGizi;
use Illuminate\Support\Collection;

class MenuRecommendationService
{
    public function generate(RekamGizi $rekamGizi): array
    {
        if ((float) $rekamGizi->kalori_total <= 0 || ! MenuMakanan::query()->exists()) {
            return [];
        }

        $recommendations = [];
        $mealTimes = [
            'Pagi' => 0.3,
            'Siang' => 0.4,
            'Malam' => 0.3,
        ];

        foreach ($mealTimes as $mealTime => $portion) {
            $targets = [
                'kalori' => (float) $rekamGizi->kalori_total * $portion,
                'karbohidrat' => (float) $rekamGizi->karbohidrat * $portion,
                'protein' => (float) $rekamGizi->protein * $portion,
                'lemak' => (float) $rekamGizi->lemak * $portion,
            ];

            foreach ($this->greedy($targets, $mealTime) as $item) {
                $recommendations[] = [
                    'menu_makanan_id' => $item['menu_makanan_id'],
                    'jumlah' => $item['jumlah'],
                    'waktu_makan' => $mealTime,
                ];
            }
        }

        return $recommendations;
    }

    private function greedy(array $targets, string $mealTime): array
    {
        $selectedItems = [];
        $currentNutrition = [
            'kalori' => 0.0,
            'karbohidrat' => 0.0,
            'protein' => 0.0,
            'lemak' => 0.0,
        ];

        foreach ($this->sortMenuByPriority($this->diabetesFriendlyMenus(), $this->categoryPriority($mealTime), $targets) as $menu) {
            if (! $this->shouldAddMenu($menu, $currentNutrition, $targets)) {
                continue;
            }

            $portion = $this->calculateOptimalPortion($menu, $currentNutrition, $targets);

            if ($portion <= 0) {
                continue;
            }

            $selectedItems[] = [
                'menu_makanan_id' => $menu->id,
                'jumlah' => round($portion, 2),
            ];

            $currentNutrition['kalori'] += $menu->kalori * $portion;
            $currentNutrition['karbohidrat'] += $menu->karbohidrat * $portion;
            $currentNutrition['protein'] += $menu->protein * $portion;
            $currentNutrition['lemak'] += $menu->lemak * $portion;

            if ($this->isTargetReached($currentNutrition, $targets) || count($selectedItems) >= 5) {
                break;
            }
        }

        return $selectedItems;
    }

    private function categoryPriority(string $mealTime): array
    {
        return match ($mealTime) {
            'Pagi' => ['Protein', 'Karbo', 'Sayur', 'Buah', 'Lemak', 'Lain-lain'],
            'Siang' => ['Protein', 'Karbo', 'Sayur', 'Lemak', 'Buah', 'Lain-lain'],
            'Malam' => ['Protein', 'Sayur', 'Karbo', 'Lemak', 'Buah', 'Lain-lain'],
            default => ['Karbo', 'Protein', 'Sayur', 'Lemak', 'Buah', 'Lain-lain'],
        };
    }

    private function diabetesFriendlyMenus(): Collection
    {
        $menus = MenuMakanan::all();
        $filteredMenus = $menus->reject(fn (MenuMakanan $menu) => $this->isHighSugarMenu($menu));

        return $filteredMenus->isNotEmpty() ? $filteredMenus->values() : $menus;
    }

    private function sortMenuByPriority(Collection $menuMakanan, array $priorityCategories, array $targets): Collection
    {
        return $menuMakanan->sortBy(function (MenuMakanan $menu) use ($priorityCategories, $targets) {
            $categoryScore = array_search($menu->kategori, $priorityCategories, true);
            $categoryScore = $categoryScore === false ? 999 : $categoryScore;
            $diabetesScore = $this->diabetesSuitabilityScore($menu);

            if ((float) $menu->kalori <= 0 || (float) $targets['kalori'] <= 0) {
                return $categoryScore + $diabetesScore;
            }

            $efficiencyScore = (
                $this->ratio($menu->karbohidrat, $menu->kalori, $targets['karbohidrat'], $targets['kalori']) +
                $this->ratio($menu->protein, $menu->kalori, $targets['protein'], $targets['kalori']) +
                $this->ratio($menu->lemak, $menu->kalori, $targets['lemak'], $targets['kalori'])
            ) / 3;

            return $categoryScore + $diabetesScore - ($efficiencyScore * 10);
        })->values();
    }

    private function diabetesSuitabilityScore(MenuMakanan $menu): float
    {
        $name = mb_strtolower($menu->nama);
        $score = 0.0;

        foreach (['rebus', 'kukus', 'panggang', 'sayur', 'tahu', 'tempe', 'ikan', 'ayam', 'telur', 'gandum'] as $keyword) {
            if (str_contains($name, $keyword)) {
                $score -= 1.5;
            }
        }

        if (str_contains($name, 'goreng')) {
            $score += 2.0;
        }

        if ((float) $menu->karbohidrat > 25 && $menu->kategori !== 'Sayur') {
            $score += 1.5;
        }

        return $score;
    }

    private function isHighSugarMenu(MenuMakanan $menu): bool
    {
        $name = mb_strtolower($menu->nama);

        foreach ([
            'gula',
            'manis',
            'sirup',
            'soda',
            'donat',
            'kue',
            'permen',
            'cokelat',
            'es krim',
            'biskuit',
            'wafer',
            'nasi putih',
            'pisang',
        ] as $keyword) {
            if (str_contains($name, $keyword)) {
                return true;
            }
        }

        return false;
    }

    private function ratio(float $menuValue, float $menuCalories, float $targetValue, float $targetCalories): float
    {
        if ($menuCalories <= 0 || $targetCalories <= 0) {
            return 0;
        }

        return ($menuValue / $menuCalories) * ($targetValue / $targetCalories);
    }

    private function shouldAddMenu(MenuMakanan $menu, array $currentNutrition, array $targets): bool
    {
        return ($currentNutrition['kalori'] < $targets['kalori'] && $menu->kalori > 0)
            || ($currentNutrition['karbohidrat'] < $targets['karbohidrat'] && $menu->karbohidrat > 0)
            || ($currentNutrition['protein'] < $targets['protein'] && $menu->protein > 0)
            || ($currentNutrition['lemak'] < $targets['lemak'] && $menu->lemak > 0);
    }

    private function calculateOptimalPortion(MenuMakanan $menu, array $currentNutrition, array $targets): float
    {
        $portions = [];

        foreach (['kalori', 'karbohidrat', 'protein', 'lemak'] as $key) {
            if ((float) $menu->{$key} > 0) {
                $portions[] = max(0, $targets[$key] - $currentNutrition[$key]) / $menu->{$key};
            }
        }

        if ($portions === []) {
            return 0;
        }

        return max(0.1, min(min($portions), 3.0));
    }

    private function isTargetReached(array $currentNutrition, array $targets): bool
    {
        $tolerance = 0.9;

        return $currentNutrition['kalori'] >= ($targets['kalori'] * $tolerance)
            && $currentNutrition['karbohidrat'] >= ($targets['karbohidrat'] * $tolerance)
            && $currentNutrition['protein'] >= ($targets['protein'] * $tolerance)
            && $currentNutrition['lemak'] >= ($targets['lemak'] * $tolerance);
    }
}
