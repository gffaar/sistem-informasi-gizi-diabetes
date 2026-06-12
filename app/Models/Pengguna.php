<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $user_id
 * @property string|null $jenis_kelamin
 * @property string|null $tanggal_lahir
 * @property float|null $tinggi_cm
 * @property float|null $berat_kg
 * @property-read User|null $user
 * @property-read RekamGizi|null $rekamGiziTerbaru
 * @property-read \Illuminate\Database\Eloquent\Collection<int, RekamGizi> $rekamGizi
 * @property-read \Illuminate\Database\Eloquent\Collection<int, MenuRekomendasi> $menuRekomendasi
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read int|null $menu_rekomendasi_count
 * @property-read int|null $rekam_gizi_count
 * @method static \Database\Factories\PenggunaFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengguna newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengguna newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengguna onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengguna query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengguna whereBeratKg($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengguna whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengguna whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengguna whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengguna whereJenisKelamin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengguna whereTanggalLahir($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengguna whereTinggiCm($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengguna whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengguna whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengguna withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengguna withoutTrashed()
 * @mixin \Eloquent
 */
class Pengguna extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pengguna';

    protected $fillable = [
        'user_id',
        'jenis_kelamin',
        'tanggal_lahir',
        'tinggi_cm',
        'berat_kg',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function rekamGizi(): HasMany
    {
        return $this->hasMany(RekamGizi::class)->orderBy('tanggal', 'desc');
    }

    public function rekamGiziTerbaru(): HasOne
    {
        return $this->hasOne(RekamGizi::class)->orderBy('tanggal', 'desc');
    }

    public function menuRekomendasi(): HasMany
    {
        return $this->hasMany(MenuRekomendasi::class);
    }
}
