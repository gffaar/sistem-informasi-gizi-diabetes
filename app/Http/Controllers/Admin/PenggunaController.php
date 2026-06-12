<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pengguna;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PenggunaController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $penggunas = Pengguna::with('user.profilUser')
            ->when($search, function ($query, $search) {
                $query->whereHas('user', function ($queryUser) use ($search) {
                    $queryUser
                        ->where('nama', 'like', '%'.$search.'%')
                        ->orWhere('username', 'like', '%'.$search.'%');
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Pengguna/Index', [
            'pasiens' => $penggunas,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Pengguna $pengguna)
    {
        return Inertia::render('Admin/Pengguna/Show', [
            'pengguna' => $pengguna->load('user'),
        ]);
    }

    public function destroy(Pengguna $pengguna)
    {
        $user = $pengguna->user;
        $user->delete();
        $pengguna->delete();

        return redirect()->route('admin.pengguna.index')->with('success', 'Pengguna berhasil dihapus');

    }
}
