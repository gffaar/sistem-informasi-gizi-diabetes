<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pengguna;
use App\Models\RekamGizi;
use App\Services\NutritionCalculator;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RekamGiziController extends Controller
{
    public function all(Request $request)
    {
        $search = $request->query('search');
        $rekamGizi = RekamGizi::with('pengguna.user')
            ->when($search, function ($query, $search) {
                $query->whereHas('pengguna.user', function ($userQuery) use ($search) {
                    $userQuery
                        ->where('nama', 'like', '%'.$search.'%')
                        ->orWhere('username', 'like', '%'.$search.'%');
                });
            })
            ->latest('tanggal')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/RekamGizi/Index', [
            'rekamGizi' => $rekamGizi,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Pengguna $pengguna)
    {
        $pengguna->load('user');
        $rekamGizi = RekamGizi::where('pengguna_id', $pengguna->id)->orderBy('tanggal', 'desc')->get();

        return Inertia::render('Admin/Pengguna/RekamGizi/Index', [
            'pengguna' => $pengguna,
            'rekamGizi' => $rekamGizi,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Pengguna $pengguna)
    {
        $pengguna->load('user');

        return Inertia::render('Admin/Pengguna/RekamGizi/Create', [
            'pengguna' => $pengguna,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Pengguna $pengguna, NutritionCalculator $calculator)
    {
        $data = $request->validate([
            'nama' => ['required', 'string'],
            'riwayat_diabetes' => ['required', Rule::in(['Ya', 'Tidak'])],
            'berat_kg' => ['required', 'numeric', 'min:1'],
            'tinggi_cm' => ['required', 'numeric', 'min:1'],
            'usia' => ['required', 'numeric', 'min:1'],
            'jenis_kelamin' => ['required', Rule::in(['Laki-laki', 'Perempuan'])],
            'aktivitas' => ['required', Rule::in(['Sangat Ringan', 'Ringan', 'Sedang', 'Berat'])],
            'kadar_gula_darah' => ['nullable', 'numeric', 'min:0'],
        ]);

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

        return redirect()->route('admin.pengguna.rekam-gizi.show', [$pengguna, $rekamGizi])->with('success', 'Data berhasil disimpan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Pengguna $pengguna, RekamGizi $rekamGizi)
    {
        abort_unless($rekamGizi->pengguna_id === $pengguna->id, 404);

        return Inertia::render('Admin/Pengguna/RekamGizi/Show', [
            'pengguna' => $pengguna->load('user'),
            'rekamGizi' => $rekamGizi,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pengguna $pengguna, RekamGizi $rekamGizi)
    {
        abort_unless($rekamGizi->pengguna_id === $pengguna->id, 404);

        $rekamGizi->delete();

        return redirect()->route('admin.pengguna.rekam-gizi.index', $pengguna)->with('success', 'Data berhasil dihapus.');
    }
}
