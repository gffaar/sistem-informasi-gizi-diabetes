<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $pengguna_id
 * @property int $menu_makanan_id
 * @property float $jumlah
 * @property string $waktu_makan
 * @property-read Pengguna|null $pengguna
 * @property-read MenuMakanan|null $menuMakanan
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuRekomendasi newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuRekomendasi newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuRekomendasi onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuRekomendasi query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuRekomendasi whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuRekomendasi whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuRekomendasi whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuRekomendasi whereJumlah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuRekomendasi whereMenuMakananId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuRekomendasi wherePenggunaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuRekomendasi whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuRekomendasi whereWaktuMakan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuRekomendasi withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuRekomendasi withoutTrashed()
 * @mixin \Eloquent
 */
class MenuRekomendasi extends Model
{
    use SoftDeletes;

    protected $table = 'menu_rekomendasi';

    protected $fillable = [
        'pengguna_id',
        'menu_makanan_id',
        'jumlah',
        'waktu_makan',
    ];

    public function pengguna(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class);
    }

    public function menuMakanan(): BelongsTo
    {
        return $this->belongsTo(MenuMakanan::class);
    }
}
