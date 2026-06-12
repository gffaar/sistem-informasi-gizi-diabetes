<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $pengguna_id
 * @property string $nama
 * @property int $usia
 * @property string $jenis_kelamin
 * @property float $tinggi_badan
 * @property float $berat_badan
 * @property string $riwayat_diabetes
 * @property float $imt
 * @property string $status_gizi
 * @property float $bmr
 * @property float $tee
 * @property float $kalori_total
 * @property float|null $energi
 * @property float $karbohidrat
 * @property float $protein
 * @property float $lemak
 * @property float|null $serat
 * @property float|null $cairan
 * @property float|null $kadar_gula_darah
 * @property-read Pengguna|null $pengguna
 * @property string $tanggal
 * @property \Illuminate\Support\Carbon|null $hasil_disimpan_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereBeratBadan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereBmr($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereImt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereJenisKelamin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereKadarGulaDarah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereKaloriTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereKarbohidrat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereLemak($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi wherePenggunaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereProtein($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereRiwayatDiabetes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereStatusGizi($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereTee($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereTinggiBadan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi whereUsia($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RekamGizi withoutTrashed()
 *
 * @mixin \Eloquent
 */
class RekamGizi extends Model
{
    use SoftDeletes;

    protected $table = 'rekam_gizi';

    protected $fillable = [
        'pengguna_id',
        'nama',
        'usia',
        'tinggi_badan',
        'berat_badan',
        'jenis_kelamin',
        'riwayat_diabetes',
        'imt',
        'status_gizi',
        'bmr',
        'tee',
        'kalori_total',
        'energi',
        'karbohidrat',
        'protein',
        'lemak',
        'serat',
        'cairan',
        'kadar_gula_darah',
        'hasil_disimpan_at',
        'tanggal',
    ];

    protected $casts = [
        'hasil_disimpan_at' => 'datetime',
    ];

    public function pengguna(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class);
    }
}
