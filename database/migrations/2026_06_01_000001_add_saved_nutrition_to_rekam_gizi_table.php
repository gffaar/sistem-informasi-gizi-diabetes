<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rekam_gizi', function (Blueprint $table) {
            if (! Schema::hasColumn('rekam_gizi', 'energi')) {
                $table->float('energi')->nullable();
            }

            if (! Schema::hasColumn('rekam_gizi', 'serat')) {
                $table->float('serat')->nullable();
            }

            if (! Schema::hasColumn('rekam_gizi', 'cairan')) {
                $table->float('cairan')->nullable();
            }

            if (! Schema::hasColumn('rekam_gizi', 'hasil_disimpan_at')) {
                $table->timestamp('hasil_disimpan_at')->nullable();
            }
        });
    }

    public function down(): void
    {
        $columns = array_values(array_filter(
            ['energi', 'serat', 'cairan', 'hasil_disimpan_at'],
            fn (string $column) => Schema::hasColumn('rekam_gizi', $column)
        ));

        if ($columns !== []) {
            Schema::table('rekam_gizi', function (Blueprint $table) use ($columns) {
                $table->dropColumn($columns);
            });
        }
    }
};
