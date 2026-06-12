<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuMakanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
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

        return Inertia::render('Admin/Makanan/Index', [
            'makanans' => $menuMakanan,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Makanan/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => [
                'required',
                'string',
                'max:255',
            ],
            'kategori' => [
                'required',
                'string',
                Rule::in([
                    'Karbo',
                    'Protein',
                    'Lemak',
                    'Sayur',
                    'Buah',
                    'Lain-lain',
                ]),
            ],
            'kalori' => [
                'required',
                'numeric',
                'min:0',
            ],
            'karbohidrat' => [
                'required',
                'numeric',
                'min:0',
            ],
            'protein' => [
                'required',
                'numeric',
                'min:0',
            ],
            'lemak' => [
                'required',
                'numeric',
                'min:0',
            ],
            'satuan' => [
                'required',
                'string',
            ],
            'gambar' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif,svg',
                'max:2048',
            ],
        ]);

        $menuMakanan = new MenuMakanan;
        $menuMakanan->nama = $request->input('nama');
        $menuMakanan->kategori = $request->input('kategori');
        $menuMakanan->kalori = $request->input('kalori');
        $menuMakanan->karbohidrat = $request->input('karbohidrat');
        $menuMakanan->protein = $request->input('protein');
        $menuMakanan->lemak = $request->input('lemak');
        $menuMakanan->satuan = $request->input('satuan');
        if ($request->hasFile('gambar')) {
            $gambar = $request->file('gambar');
            $gambarPath = $gambar->storeAs('gambar', $gambar->hashName(), 'public');
            $menuMakanan->gambar = $gambarPath;
        }

        $menuMakanan->save();

        return redirect()->route('admin.menu-makanan.index')->with('success', 'Menu makanan berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(MenuMakanan $menuMakanan)
    {
        return Inertia::render('Admin/Makanan/Show', [
            'makanan' => $menuMakanan,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MenuMakanan $menuMakanan)
    {
        return Inertia::render('Admin/Makanan/Edit', [
            'makanan' => $menuMakanan,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MenuMakanan $menuMakanan)
    {
        $request->validate([
            'nama' => [
                'required',
                'string',
                'max:255',
            ],
            'kategori' => [
                'required',
                'string',
                Rule::in([
                    'Karbo',
                    'Protein',
                    'Lemak',
                    'Sayur',
                    'Buah',
                    'Lain-lain',
                ]),
            ],
            'kalori' => [
                'required',
                'numeric',
                'min:0',
            ],
            'karbohidrat' => [
                'required',
                'numeric',
                'min:0',
            ],
            'protein' => [
                'required',
                'numeric',
                'min:0',
            ],
            'lemak' => [
                'required',
                'numeric',
                'min:0',
            ],
            'satuan' => [
                'required',
                'string',
            ],
            'gambar' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif,svg',
                'max:2048',
            ],
        ]);

        $menuMakanan->nama = $request->input('nama');
        $menuMakanan->kategori = $request->input('kategori');
        $menuMakanan->kalori = $request->input('kalori');
        $menuMakanan->karbohidrat = $request->input('karbohidrat');
        $menuMakanan->protein = $request->input('protein');
        $menuMakanan->lemak = $request->input('lemak');
        $menuMakanan->satuan = $request->input('satuan');

        if ($request->hasFile('gambar')) {
            $gambar = $request->file('gambar');
            if ($menuMakanan->gambar) {
                Storage::disk('public')->delete($menuMakanan->gambar);
            }
            $gambarPath = $gambar->storeAs('gambar', $gambar->hashName(), 'public');
            $menuMakanan->gambar = $gambarPath;
        }

        $menuMakanan->save();

        return redirect()->route('admin.menu-makanan.index')->with('success', 'Menu makanan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MenuMakanan $menuMakanan)
    {
        if ($menuMakanan->gambar) {
            Storage::disk('public')->delete($menuMakanan->gambar);
        }
        $menuMakanan->delete();

        return redirect()->route('admin.menu-makanan.index')->with('success', 'Menu makanan berhasil dihapus.');
    }
}
