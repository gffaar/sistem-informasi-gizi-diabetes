<?php

namespace App\Http\Controllers;

use App\Models\ProfilUser;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('auth.login.form');
        }

        $user->load(['pengguna', 'profilUser']);

        return Inertia::render('Account/Index', [
            'user' => $user,
            'supportsEmail' => Schema::hasColumn('users', 'email'),
        ]);
    }

    public function profileUser()
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('auth.login.form');
        }

        if ($user->role === 'admin') {
            return redirect()->route('index');
        }

        $user->load(['pengguna', 'profilUser']);

        return Inertia::render('Account/ProfileUser', [
            'user' => $user,
            'profil' => $user->pengguna,
            'profilUser' => $user->profilUser,
        ]);
    }

    public function edit()
    {
        return redirect()->route('account.data');
    }

    public function update(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('auth.login.form');
        }

        if ($user->role === 'admin') {
            $supportsEmail = Schema::hasColumn('users', 'email');
            $rules = [
                'nama' => ['required', 'string', 'max:255'],
                'username' => ['required', 'string', 'max:255', Rule::unique('users', 'username')->ignore($user->id)],
                'foto' => ['nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png,webp'],
            ];

            if ($supportsEmail) {
                $rules['email'] = ['nullable', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)];
            }

            $validated = $request->validate($rules, [
                'nama.required' => 'Nama wajib diisi.',
                'nama.max' => 'Nama maksimal 255 karakter.',
                'username.required' => 'Username wajib diisi.',
                'username.unique' => 'Username sudah digunakan.',
                'email.email' => 'Email tidak valid.',
                'email.unique' => 'Email sudah digunakan.',
                'foto.image' => 'Foto profil harus berupa gambar.',
                'foto.max' => 'Ukuran foto profil maksimal 2 MB.',
                'foto.mimes' => 'Foto profil harus berformat jpg, jpeg, png, atau webp.',
            ]);

            $user->fill([
                'nama' => $validated['nama'],
                'username' => $validated['username'],
            ]);

            if ($supportsEmail) {
                $user->email = $validated['email'] ?? null;
            }

            if ($request->hasFile('foto')) {
                $foto = $request->file('foto');
                if ($user->foto) {
                    Storage::disk('public')->delete($user->foto);
                }
                $user->foto = $foto->storeAs('gambar/profil', $foto->hashName(), 'public');
            }

            $user->save();

            return back()->with('success', 'Profil admin berhasil diperbarui.');
        }

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'tanggal_lahir' => ['nullable', 'date', 'before_or_equal:today'],
            'foto' => ['nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png,webp'],
        ], [
            'nama.required' => 'Nama wajib diisi.',
            'nama.max' => 'Nama maksimal 255 karakter.',
            'tanggal_lahir.date' => 'Tanggal lahir tidak valid.',
            'tanggal_lahir.before_or_equal' => 'Tanggal lahir tidak boleh melebihi hari ini.',
            'foto.image' => 'Foto profil harus berupa gambar.',
            'foto.max' => 'Ukuran foto profil maksimal 2 MB.',
            'foto.mimes' => 'Foto profil harus berformat jpg, jpeg, png, atau webp.',
        ]);

        $user->fill([
            'nama' => $validated['nama'],
        ]);

        if ($request->hasFile('foto')) {
            $foto = $request->file('foto');
            if ($user->foto) {
                Storage::disk('public')->delete($user->foto);
            }
            $user->foto = $foto->storeAs('gambar/profil', $foto->hashName(), 'public');
        }

        $user->save();

        if ($user->role === 'user') {
            $tanggalLahir = $validated['tanggal_lahir'] ?? null;

            ProfilUser::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'tanggal_lahir' => $tanggalLahir,
                    'umur' => $this->calculateAge($tanggalLahir),
                ]
            );

            if ($user->pengguna) {
                if ($tanggalLahir) {
                    $user->pengguna->update([
                        'tanggal_lahir' => $tanggalLahir,
                    ]);
                }
            }
        }

        return back()->with('success', 'Pengaturan profil berhasil diperbarui.');
    }

    private function calculateAge($tanggalLahir): ?int
    {
        if (! $tanggalLahir) {
            return null;
        }

        return max(0, (int) Carbon::parse($tanggalLahir)->age);
    }

    public function password()
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('auth.login.form');
        }

        $user->load(['pengguna', 'profilUser']);

        return Inertia::render('Account/Password', [
            'user' => $user,
            'profil' => $user->pengguna,
            'profilUser' => $user->profilUser,
        ]);
    }

    public function updatePassword(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('auth.login.form');
        }

        $request->validate([
            'old_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ], [
            'old_password.required' => 'Password lama wajib diisi.',
            'password.required' => 'Password baru wajib diisi.',
            'password.string' => 'Password baru harus berupa teks.',
            'password.min' => 'Password baru minimal 6 karakter.',
            'password.confirmed' => 'Konfirmasi password baru tidak sama.',
        ]);

        if (! Hash::check($request->old_password, (string) $user->password)) {
            return redirect()->route('account.password.edit')->with('error', 'Password lama tidak sesuai.');
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return back()->with('success', 'Password berhasil diperbarui.');
    }
}
