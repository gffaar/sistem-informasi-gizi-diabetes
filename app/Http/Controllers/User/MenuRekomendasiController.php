<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\MenuMakanan;
use App\Models\MenuRekomendasi;
use App\Models\Pengguna;
use App\Models\RekamGizi;
use App\Services\MenuRecommendationService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MenuRekomendasiController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('auth.login.form');
        }

        $pengguna = $user->pengguna;

        if (! $pengguna) {
            return redirect()
                ->route('informasi-data-pribadi-user.index')
                ->with('error', 'Lengkapi data pribadi terlebih dahulu.');
        }

        $rekamGizi = $this->todaySavedRekamGizi($pengguna->id);

        if (! $rekamGizi) {
            return $this->dailyCalculationRequiredResponse($pengguna);
        }

        $search = $request->query('search');
        $dailyRecommendationQuery = MenuRekomendasi::with('menuMakanan')
            ->where('pengguna_id', $pengguna->id)
            ->whereDate('created_at', today());
        $hasDailyRecommendation = (clone $dailyRecommendationQuery)->exists();
        $menuRekomendasi = (clone $dailyRecommendationQuery)
            ->when($search, fn ($query) => $query->where('waktu_makan', $search))
            ->latest()
            ->get();

        if (
            ! $request->boolean('auto')
            && ! $hasDailyRecommendation
            && MenuMakanan::query()->exists()
        ) {
            return redirect()->route('user.menu-rekomendasi.otomatis-pilih', [
                'rekamGizi' => $rekamGizi->id,
            ]);
        }

        return Inertia::render('User/Rekomendasi/Index', [
            'pengguna' => $pengguna,
            'rekamGizi' => $rekamGizi,
            'menuRekomendasi' => $menuRekomendasi,
            'filters' => $request->only(['search']),
            'hasMenuMakanan' => MenuMakanan::query()->exists(),
            'total' => $this->totals($menuRekomendasi),
        ]);
    }

    public function create()
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('auth.login.form');
        }

        $pengguna = $user->pengguna;

        if (! $pengguna) {
            return redirect()
                ->route('informasi-data-pribadi-user.index')
                ->with('error', 'Lengkapi data pribadi terlebih dahulu.');
        }

        $rekamGizi = $this->todaySavedRekamGizi($pengguna->id);

        if (! $rekamGizi) {
            return redirect()->route('user.menu-rekomendasi.index');
        }

        return Inertia::render('User/Rekomendasi/Create', [
            'pengguna' => $pengguna,
            'rekamGizi' => $rekamGizi,
            'menuMakanan' => MenuMakanan::orderBy('nama')->get(),
        ]);
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('auth.login.form');
        }

        $pengguna = $user->pengguna;

        if (! $pengguna) {
            return redirect()
                ->route('informasi-data-pribadi-user.index')
                ->with('error', 'Lengkapi data pribadi terlebih dahulu.');
        }

        if (! $this->todaySavedRekamGizi($pengguna->id)) {
            return redirect()
                ->route('user.menu-rekomendasi.index')
                ->with('error', 'Silakan hitung kebutuhan gizi harian terlebih dahulu untuk melihat rekomendasi makanan.');
        }

        $data = $request->validate([
            'menu_makanan_id' => ['required', Rule::exists('menu_makanan', 'id')],
            'jumlah' => ['required', 'numeric', 'min:0.1'],
            'waktu_makan' => ['required', Rule::in(['Pagi', 'Siang', 'Malam'])],
        ]);

        MenuRekomendasi::create($data + ['pengguna_id' => $pengguna->id]);

        return redirect()
            ->route('user.menu-rekomendasi.index')
            ->with('success', 'Menu rekomendasi berhasil ditambahkan.');
    }

    public function destroy(MenuRekomendasi $menuRekomendasi)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        $pengguna = $user?->pengguna;

        abort_unless($pengguna && $menuRekomendasi->pengguna_id === $pengguna->id, 404);

        $menuRekomendasi->delete();

        return redirect()
            ->route('user.menu-rekomendasi.index')
            ->with('success', 'Menu rekomendasi berhasil dihapus.');
    }

    public function otomatisPilih(RekamGizi $rekamGizi, MenuRecommendationService $service)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        $pengguna = $user?->pengguna;

        abort_unless($pengguna && $rekamGizi->pengguna_id === $pengguna->id, 404);

        if (
            ! $rekamGizi->tanggal
            || ! Carbon::parse($rekamGizi->tanggal)->isToday()
            || ! $rekamGizi->hasil_disimpan_at
        ) {
            return redirect()->route('user.menu-rekomendasi.index');
        }

        $recommendations = $service->generate($rekamGizi);

        if ($recommendations === []) {
            return redirect()
                ->route('user.menu-rekomendasi.index', ['auto' => 1])
                ->with('error', 'Belum ada menu makanan yang bisa dipakai untuk membuat rekomendasi.');
        }

        DB::transaction(function () use ($pengguna, $recommendations) {
            MenuRekomendasi::where('pengguna_id', $pengguna->id)
                ->whereDate('created_at', today())
                ->delete();

            foreach ($recommendations as $recommendation) {
                MenuRekomendasi::create($recommendation + ['pengguna_id' => $pengguna->id]);
            }
        });

        return redirect()
            ->route('user.menu-rekomendasi.index')
            ->with('success', 'Rekomendasi menu berhasil dibuat.');
    }

    private function todaySavedRekamGizi(int $penggunaId): ?RekamGizi
    {
        return RekamGizi::where('pengguna_id', $penggunaId)
            ->whereDate('tanggal', today())
            ->whereNotNull('hasil_disimpan_at')
            ->latest('tanggal')
            ->latest('id')
            ->first();
    }

    private function dailyCalculationRequiredResponse(Pengguna $pengguna)
    {
        return Inertia::render('User/Rekomendasi/Index', [
            'pengguna' => $pengguna,
            'rekamGizi' => null,
            'menuRekomendasi' => [],
            'filters' => [],
            'hasMenuMakanan' => MenuMakanan::query()->exists(),
            'needsDailyCalculation' => true,
            'total' => [
                'kalori' => 0,
                'karbohidrat' => 0,
                'protein' => 0,
                'lemak' => 0,
            ],
        ]);
    }

    private function totals($menuRekomendasi): array
    {
        return $menuRekomendasi->reduce(function (array $total, MenuRekomendasi $menu) {
            if (! $menu->menuMakanan) {
                return $total;
            }

            $total['kalori'] += $menu->menuMakanan->kalori * $menu->jumlah;
            $total['karbohidrat'] += $menu->menuMakanan->karbohidrat * $menu->jumlah;
            $total['protein'] += $menu->menuMakanan->protein * $menu->jumlah;
            $total['lemak'] += $menu->menuMakanan->lemak * $menu->jumlah;

            return $total;
        }, [
            'kalori' => 0,
            'karbohidrat' => 0,
            'protein' => 0,
            'lemak' => 0,
        ]);
    }
}
