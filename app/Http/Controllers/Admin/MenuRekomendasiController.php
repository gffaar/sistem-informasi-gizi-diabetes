<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuMakanan;
use App\Models\MenuRekomendasi;
use App\Models\Pengguna;
use App\Models\RekamGizi;
use App\Services\MenuRecommendationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MenuRekomendasiController extends Controller
{
    public function index(Request $request, Pengguna $pengguna)
    {
        $pengguna->load('user');
        $search = $request->query('search');
        $rekamGizi = $pengguna->rekamGiziTerbaru;
        $menuRekomendasi = MenuRekomendasi::with('menuMakanan')
            ->where('pengguna_id', $pengguna->id)
            ->when($search, fn ($query) => $query->where('waktu_makan', $search))
            ->latest()
            ->get();

        return Inertia::render('Admin/Pengguna/Rekomendasi/Index', [
            'pengguna' => $pengguna,
            'rekamGizi' => $rekamGizi,
            'menuRekomendasi' => $menuRekomendasi,
            'filters' => $request->only(['search']),
            'hasMenuMakanan' => MenuMakanan::query()->exists(),
            'total' => $this->totals($menuRekomendasi),
        ]);
    }

    public function create(Pengguna $pengguna)
    {
        return Inertia::render('Admin/Pengguna/Rekomendasi/Create', [
            'pengguna' => $pengguna->load('user'),
            'rekamGizi' => $pengguna->rekamGiziTerbaru,
            'menuMakanan' => MenuMakanan::orderBy('nama')->get(),
        ]);
    }

    public function store(Request $request, Pengguna $pengguna)
    {
        $data = $request->validate([
            'menu_makanan_id' => ['required', Rule::exists('menu_makanan', 'id')],
            'jumlah' => ['required', 'numeric', 'min:0.1'],
            'waktu_makan' => ['required', Rule::in(['Pagi', 'Siang', 'Malam'])],
        ]);

        MenuRekomendasi::create($data + ['pengguna_id' => $pengguna->id]);

        return redirect()
            ->route('admin.pengguna.menu-rekomendasi.index', $pengguna)
            ->with('success', 'Menu rekomendasi berhasil ditambahkan.');
    }

    public function destroy(Pengguna $pengguna, MenuRekomendasi $menuRekomendasi)
    {
        abort_unless($menuRekomendasi->pengguna_id === $pengguna->id, 404);

        $menuRekomendasi->delete();

        return redirect()
            ->route('admin.pengguna.menu-rekomendasi.index', $pengguna)
            ->with('success', 'Menu rekomendasi berhasil dihapus.');
    }

    public function otomatisPilih(
        Pengguna $pengguna,
        RekamGizi $rekamGizi,
        MenuRecommendationService $service
    ) {
        abort_unless($rekamGizi->pengguna_id === $pengguna->id, 404);

        $recommendations = $service->generate($rekamGizi);

        if ($recommendations === []) {
            return redirect()
                ->route('admin.pengguna.menu-rekomendasi.index', $pengguna)
                ->with('error', 'Belum ada menu makanan yang bisa dipakai untuk membuat rekomendasi.');
        }

        DB::transaction(function () use ($pengguna, $recommendations) {
            MenuRekomendasi::where('pengguna_id', $pengguna->id)->delete();

            foreach ($recommendations as $recommendation) {
                MenuRekomendasi::create($recommendation + ['pengguna_id' => $pengguna->id]);
            }
        });

        return redirect()
            ->route('admin.pengguna.menu-rekomendasi.index', $pengguna)
            ->with('success', 'Rekomendasi menu berhasil dibuat.');
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
