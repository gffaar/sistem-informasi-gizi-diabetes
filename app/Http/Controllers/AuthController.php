<?php

namespace App\Http\Controllers;

use App\Models\Pengguna;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function formLogin()
    {
        if (Auth::check()) {
            return redirect()->route('index');
        }

        return Inertia::render('Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => ['required'],
            'password' => ['required'],
        ]);

        $credentials = $request->only('username', 'password');

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            /** @var \App\Models\User|null $user */
            $user = Auth::user();

            if ($user && $user->role === 'admin') {
                return redirect()->route('index');
            }

            return redirect()->route('index');
        }

        return back()->withErrors([
            'username' => 'Username atau password tidak sesuai.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('auth.login.form');
    }

    public function formDaftar()
    {
        if (Auth::check()) {
            return redirect()->route('index');
        }

        return Inertia::render('Daftar');
    }

    public function daftar(Request $request)
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:255', Rule::unique('users', 'username')],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'nama' => ['required', 'string', 'max:255'],
            'foto' => ['nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png,webp'],
            'jenis_kelamin' => ['required', Rule::in(['Laki-laki', 'Perempuan'])],
            'tanggal_lahir' => ['required', 'date'],
            'tinggi_cm' => ['required', 'numeric'],
            'berat_kg' => ['required', 'numeric'],
        ], [
            'username.required' => 'Username wajib diisi.',
            'username.unique' => 'Username sudah digunakan.',
            'password.required' => 'Password wajib diisi.',
            'password.string' => 'Password harus berupa teks.',
            'password.min' => 'Password minimal 6 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak sama.',
            'nama.required' => 'Nama wajib diisi.',
            'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih.',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi.',
            'tanggal_lahir.date' => 'Tanggal lahir tidak valid.',
            'tinggi_cm.required' => 'Tinggi badan wajib diisi.',
            'tinggi_cm.numeric' => 'Tinggi badan harus berupa angka.',
            'berat_kg.required' => 'Berat badan wajib diisi.',
            'berat_kg.numeric' => 'Berat badan harus berupa angka.',
            'foto.image' => 'Foto harus berupa gambar.',
            'foto.max' => 'Ukuran foto maksimal 2 MB.',
        ]);

        $user = User::create([
            'username' => $data['username'],
            'password' => $data['password'],
            'nama' => $data['nama'],
            'foto' => $request->hasFile('foto') ? $request->file('foto')->storeAs('gambar/profil', $request->file('foto')->hashName(), 'public') : null,
            'role' => 'user',
        ]);

        Pengguna::create([
            'user_id' => $user->id,
            'jenis_kelamin' => $data['jenis_kelamin'],
            'tanggal_lahir' => $data['tanggal_lahir'],
            'tinggi_cm' => $data['tinggi_cm'],
            'berat_kg' => $data['berat_kg'],
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('index')->with('success', 'Akun berhasil dibuat');
    }
}
