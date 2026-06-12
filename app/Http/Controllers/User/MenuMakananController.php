<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\MenuMakanan;
use App\Models\MenuRekomendasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MenuMakananController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $menuMakanan = MenuMakanan::query()->when(
            $search,
            fn ($query) => $query->where('nama', 'like', '%'.$search.'%')
        )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('User/Makanan/Index', [
            'makanans' => $menuMakanan,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Request $request, MenuMakanan $menuMakanan)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        $pengguna = $user?->pengguna;
        $menuRekomendasi = null;

        if ($request->filled('rekomendasi') && $pengguna) {
            $menuRekomendasi = MenuRekomendasi::query()
                ->whereKey($request->integer('rekomendasi'))
                ->where('pengguna_id', $pengguna->id)
                ->where('menu_makanan_id', $menuMakanan->id)
                ->first();

            abort_unless($menuRekomendasi, 404);
        }

        return Inertia::render('User/Makanan/Show', [
            'makanan' => $menuMakanan,
            'menuRekomendasi' => $menuRekomendasi,
        ]);
    }
}
