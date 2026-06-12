<?php

use Illuminate\Support\Facades\Route;

Route::get('/login', [\App\Http\Controllers\AuthController::class, 'formLogin'])->name('auth.login.form');
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login'])->name('auth.login');
Route::get('/logout', [\App\Http\Controllers\AuthController::class, 'logout'])->name('auth.logout');
Route::get('/daftar', [\App\Http\Controllers\AuthController::class, 'formDaftar'])->name('auth.daftar.form');
Route::post('/daftar', [\App\Http\Controllers\AuthController::class, 'daftar'])->name('auth.daftar');

Route::group(['middleware' => [\App\Http\Middleware\AuthMiddleware::class]], function () {
    Route::get('/', \App\Http\Controllers\DashboardController::class)->name('index');

    Route::get('/account', [\App\Http\Controllers\AccountController::class, 'index'])->name('account.index');
    Route::get('/account/profil-user', [\App\Http\Controllers\AccountController::class, 'profileUser'])->name('account.profile-user');
    Route::get('/informasi-data-pribadi-user', [\App\Http\Controllers\InformasiDataPribadiUserController::class, 'index'])->name('informasi-data-pribadi-user.index');
    Route::post('/informasi-data-pribadi-user/update', [\App\Http\Controllers\InformasiDataPribadiUserController::class, 'update'])->name('informasi-data-pribadi-user.update');
    Route::get('/account/data', fn () => redirect()->route('informasi-data-pribadi-user.index'))->name('account.data');
    Route::post('/account/update', [\App\Http\Controllers\AccountController::class, 'update'])->name('account.update');
    Route::get('/account/edit', [\App\Http\Controllers\AccountController::class, 'edit'])->name('account.edit');
    Route::post('/account/edit', [\App\Http\Controllers\AccountController::class, 'update'])->name('account.update.legacy');
    Route::get('/user/edit-profil', [\App\Http\Controllers\AccountController::class, 'edit'])->name('user.profil.edit');
    Route::post('/user/edit-profil', [\App\Http\Controllers\AccountController::class, 'update'])->name('user.profil.update');
    Route::get('/account/password', [\App\Http\Controllers\AccountController::class, 'password'])->name('account.password.edit');
    Route::put('/account/password', [\App\Http\Controllers\AccountController::class, 'updatePassword'])->name('account.password.update');
});

Route::group(['middleware' => [\App\Http\Middleware\AuthMiddleware::class, \App\Http\Middleware\EnsureUserRole::class.':admin'], 'prefix' => 'admin', 'as' => 'admin.'], function () {
    // Pengguna (Pasien)
    Route::resource('pengguna', \App\Http\Controllers\Admin\PenggunaController::class)->only(['index', 'show', 'destroy']);

    // Rekam Gizi
    Route::get('rekam-gizi', [\App\Http\Controllers\Admin\RekamGiziController::class, 'all'])->name('rekam-gizi.index');
    Route::resource('pengguna.rekam-gizi', \App\Http\Controllers\Admin\RekamGiziController::class)
        ->parameter('rekam-gizi', 'rekamGizi')
        ->except(['edit', 'update']);

    // Menu Rekomendasi
    Route::resource('pengguna.menu-rekomendasi', \App\Http\Controllers\Admin\MenuRekomendasiController::class)
        ->parameter('menu-rekomendasi', 'menuRekomendasi')
        ->only(['index', 'create', 'store', 'destroy']);
    Route::post('pengguna/{pengguna}/menu-rekomendasi/otomatis-pilih/{rekamGizi}', [App\Http\Controllers\Admin\MenuRekomendasiController::class, 'otomatisPilih'])->name('menu-rekomendasi.otomatis-pilih');

    // Menu Makanan
    Route::resource('menu-makanan', \App\Http\Controllers\Admin\MenuMakananController::class)->parameter('menu-makanan', 'menuMakanan');
    // Sistem Informasi
    Route::resource('informasi', \App\Http\Controllers\Admin\InformasiController::class);
});

Route::group(['middleware' => [\App\Http\Middleware\AuthMiddleware::class, \App\Http\Middleware\EnsureUserRole::class.':user'], 'prefix' => 'user', 'as' => 'user.'], function () {
    // Pengguna (Pasien)
    // Route::resource('pengguna', \App\Http\Controllers\Admin\PenggunaController::class)->except(['create','store']);

    // Rekam Gizi
    Route::post('rekam-gizi/{rekamGizi}/simpan-hasil', [\App\Http\Controllers\User\RekamGiziController::class, 'saveResult'])->name('rekam-gizi.save-result');
    Route::resource('rekam-gizi', \App\Http\Controllers\User\RekamGiziController::class)
        ->parameter('rekam-gizi', 'rekamGizi')
        ->except(['edit', 'update']);

    // Menu Rekomendasi
    Route::resource('menu-rekomendasi', \App\Http\Controllers\User\MenuRekomendasiController::class)
        ->parameter('menu-rekomendasi', 'menuRekomendasi')
        ->only(['index', 'create', 'store', 'destroy']);
    Route::get('menu-rekomendasi/otomatis-pilih/{rekamGizi}', [App\Http\Controllers\User\MenuRekomendasiController::class, 'otomatisPilih'])->name('menu-rekomendasi.otomatis-pilih');

    // Menu Makanan
    Route::resource('menu-makanan', \App\Http\Controllers\User\MenuMakananController::class)
        ->parameter('menu-makanan', 'menuMakanan')
        ->only(['index', 'show']);
    // Sistem Informasi
    Route::resource('informasi', \App\Http\Controllers\User\InformasiController::class)
        ->only(['index', 'show']);
});
