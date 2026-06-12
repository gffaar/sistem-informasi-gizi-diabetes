<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $judul
 * @property string $deskripsi
 * @property string|null $gambar
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Informasi newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Informasi newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Informasi query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Informasi whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Informasi whereDeskripsi($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Informasi whereGambar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Informasi whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Informasi whereJudul($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Informasi whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Informasi extends Model
{
    use HasFactory;

    protected $table = 'informasis';

    protected $fillable = [
        'judul',
        'deskripsi',
        'gambar',
    ];
}
