<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\RekamGizi;
use App\Services\NutritionCalculator;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RekamGiziController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
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

        $rekamGizi = RekamGizi::where('pengguna_id', $pengguna->id)
            ->latest('tanggal')
            ->latest('id')
            ->get(['id', 'pengguna_id', 'tanggal', 'imt', 'status_gizi']);

        return Inertia::render('User/RekamGizi/Index', [
            'rekamGizi' => $rekamGizi,
            'pengguna' => $pengguna,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
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

        return Inertia::render('User/RekamGizi/Create', [
            'pengguna' => $pengguna->load('user'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, NutritionCalculator $calculator)
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

        $usia = $this->calculateAge($pengguna->tanggal_lahir);
        $jenisKelamin = $pengguna->jenis_kelamin;

        if (! $usia || ! $jenisKelamin) {
            return back()
                ->withErrors([
                    'usia' => 'Tanggal lahir pada profil belum valid.',
                    'jenis_kelamin' => 'Jenis kelamin pada profil belum tersedia.',
                ])
                ->withInput();
        }

        $data = $request->validate([
            'riwayat_diabetes' => ['required', Rule::in(['Ya', 'Tidak'])],
            'berat_kg' => ['required', 'numeric', 'min:1'],
            'tinggi_cm' => ['required', 'numeric', 'min:1'],
            'aktivitas' => ['required', Rule::in(['Sangat Ringan', 'Ringan', 'Sedang', 'Berat'])],
            'kadar_gula_darah' => ['nullable', 'numeric', 'min:0'],
        ]);

        $data['nama'] = $user->nama ?: $user->username;
        $data['usia'] = $usia;
        $data['jenis_kelamin'] = $jenisKelamin;

        $nutrition = $calculator->calculate($data);

        // Simpan ke database
        $rekamGizi = RekamGizi::create([
            'pengguna_id' => $pengguna->id,
            'nama' => $data['nama'],
            'usia' => $data['usia'],
            'jenis_kelamin' => $data['jenis_kelamin'],
            'tinggi_badan' => $data['tinggi_cm'],
            'berat_badan' => $data['berat_kg'],
            'riwayat_diabetes' => $data['riwayat_diabetes'],
            'imt' => $nutrition['imt'],
            'status_gizi' => $nutrition['status_gizi'],
            'bmr' => $nutrition['bmr'],
            'tee' => $nutrition['tee'],
            'kalori_total' => $nutrition['kalori_total'],
            'karbohidrat' => $nutrition['karbohidrat'],
            'protein' => $nutrition['protein'],
            'lemak' => $nutrition['lemak'],
            'kadar_gula_darah' => ($data['kadar_gula_darah'] ?? null) !== null ? round((float) $data['kadar_gula_darah'], 2) : null,
            'tanggal' => now(),
        ]);

        $pengguna->update([
            'berat_kg' => $data['berat_kg'],
            'tinggi_cm' => $data['tinggi_cm'],
        ]);

        return redirect()->route('user.rekam-gizi.show', [$rekamGizi->id])->with('success', 'Data berhasil disimpan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(RekamGizi $rekamGizi)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        $pengguna = $user?->pengguna;

        abort_unless($pengguna && $rekamGizi->pengguna_id === $pengguna->id, 404);

        return Inertia::render('User/RekamGizi/Show', [
            'rekamGizi' => $rekamGizi,
            'pengguna' => $pengguna,
        ]);
    }

    public function saveResult(RekamGizi $rekamGizi)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        $pengguna = $user?->pengguna;

        abort_unless($pengguna && $rekamGizi->pengguna_id === $pengguna->id, 404);

        $energi = round((float) $rekamGizi->kalori_total, 2);
        $serat = round(($energi / 1000) * 14, 2);
        $cairan = round((float) $rekamGizi->berat_badan * 30, 2);

        $rekamGizi->update([
            'energi' => $energi,
            'serat' => $serat,
            'cairan' => $cairan,
            'hasil_disimpan_at' => now(),
        ]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RekamGizi $rekamGizi)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        $pengguna = $user?->pengguna;

        abort_unless($pengguna && $rekamGizi->pengguna_id === $pengguna->id, 404);

        $rekamGizi->delete();

        return redirect()->route('user.rekam-gizi.index')->with('success', 'Data berhasil dihapus.');
    }

    private function calculateAge($tanggalLahir): ?int
    {
        if (! $tanggalLahir) {
            return null;
        }

        $usia = Carbon::parse($tanggalLahir)->age;

        return $usia > 0 ? $usia : null;
    }
}
