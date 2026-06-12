<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('auth.login.form');
        }

        // Admin
        if ($user->role === 'admin') {
            $banyakPasien = \App\Models\Pengguna::count();
            $banyakRekamGizi = \App\Models\RekamGizi::count();
            $banyakMenuRekomendasi = \App\Models\MenuRekomendasi::count();
            $banyakMenuMakanan = \App\Models\MenuMakanan::count();
            $banyakInformasi = \Illuminate\Support\Facades\Schema::hasTable('informasis')
                ? \App\Models\Informasi::count()
                : 0;
            $latestRekamGizi = \App\Models\RekamGizi::with('pengguna.user')
                ->latest('tanggal')
                ->limit(6)
                ->get();
            $activityByDate = \App\Models\RekamGizi::query()
                ->selectRaw('DATE(tanggal) as date, COUNT(*) as total')
                ->where('tanggal', '>=', now()->subDays(6)->startOfDay())
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->keyBy('date');
            $activity = collect(range(6, 0))->map(function ($days) use ($activityByDate) {
                $date = now()->subDays($days);
                $dateKey = $date->toDateString();

                return [
                    'label' => $date->format('d M'),
                    'total' => (int) ($activityByDate->get($dateKey)?->total ?? 0),
                ];
            })->values();

            return Inertia::render('Admin/Dashboard', [
                'data' => [
                    'banyakPasien' => $banyakPasien,
                    'banyakRekamGizi' => $banyakRekamGizi,
                    'banyakMenuRekomendasi' => $banyakMenuRekomendasi,
                    'banyakMenuMakanan' => $banyakMenuMakanan,
                    'banyakInformasi' => $banyakInformasi,
                    'latestRekamGizi' => $latestRekamGizi,
                    'activity' => $activity,
                ],
            ]);
        } else {
            $user->load(['pengguna.user', 'profilUser']);
            $pengguna = $user->pengguna;
            $profilUser = $user->profilUser;
            $rekamGiziTerbaru = $pengguna
                ? \App\Models\RekamGizi::where('pengguna_id', '=', $pengguna->id)->latest()->first()
                : null;
            $riwayatGulaDarah = $pengguna
                ? \App\Models\RekamGizi::where('pengguna_id', $pengguna->id)
                    ->whereNotNull('kadar_gula_darah')
                    ->limit(5)
                    ->latest('tanggal')
                    ->get(['tanggal', 'kadar_gula_darah'])
                    ->reverse()
                    ->values()
                : collect();
            $informasiEdukasi = \Illuminate\Support\Facades\Schema::hasTable('informasis')
                ? \App\Models\Informasi::latest()
                    ->limit(8)
                    ->get(['id', 'judul', 'deskripsi', 'gambar', 'created_at'])
                : collect();

            return Inertia::render('User/Dashboard', [
                'user' => $user,
                'pengguna' => $pengguna ? $pengguna->load('user') : null,
                'profilUser' => $profilUser,
                'rekamGiziTerbaru' => $rekamGiziTerbaru,
                'riwayatGulaDarah' => $riwayatGulaDarah,
                'informasiEdukasi' => $informasiEdukasi,
            ]);
        }
    }
}
