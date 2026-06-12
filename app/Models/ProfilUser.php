<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $umur
 * @property string|null $tanggal_lahir
 * @property string|null $jenis_kelamin
 * @property float|null $berat_kg
 * @property float|null $tinggi_cm
 * @property float|null $bmi
 * @property float|null $kadar_gula_darah
 * @property string|null $riwayat_diabetes
 * @property string|null $aktivitas_fisik
 * @property-read User|null $user
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfilUser newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfilUser newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfilUser query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfilUser whereAktivitasFisik($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfilUser whereBeratKg($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfilUser whereBmi($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfilUser whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfilUser whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfilUser whereJenisKelamin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfilUser whereKadarGulaDarah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfilUser whereRiwayatDiabetes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfilUser whereTanggalLahir($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfilUser whereTinggiCm($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfilUser whereUmur($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfilUser whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfilUser whereUserId($value)
 * @mixin \Eloquent
 */
class ProfilUser extends Model
{
    use HasFactory;

    protected $table = 'profil_user';

    protected $fillable = [
        'user_id',
        'umur',
        'tanggal_lahir',
        'jenis_kelamin',
        'berat_kg',
        'tinggi_cm',
        'bmi',
        'kadar_gula_darah',
        'riwayat_diabetes',
        'aktivitas_fisik',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
