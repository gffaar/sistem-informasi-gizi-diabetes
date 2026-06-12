<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $nama
 * @property string $kategori
 * @property float $kalori
 * @property float $karbohidrat
 * @property float $protein
 * @property float $lemak
 * @property string|null $satuan
 * @property string|null $gambar
 * @property-read \Illuminate\Database\Eloquent\Collection<int, MenuRekomendasi> $menuRekomendasi
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read int|null $menu_rekomendasi_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan whereGambar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan whereKalori($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan whereKarbohidrat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan whereKategori($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan whereLemak($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan whereNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan whereProtein($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan whereSatuan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MenuMakanan withoutTrashed()
 * @mixin \Eloquent
 */
class MenuMakanan extends Model
{
    use SoftDeletes;

    protected $table = 'menu_makanan';

    protected $fillable = [
        'nama',
        'kategori',
        'kalori',
        'karbohidrat',
        'protein',
        'lemak',
        'satuan',
        'gambar',
    ];

    public function menuRekomendasi(): HasMany
    {
        return $this->hasMany(MenuRekomendasi::class);
    }
}
