<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone_normalized')->nullable()->after('phone');
            $table->string('status', 32)->default('active')->after('phone_normalized');
        });

        DB::table('users')
            ->whereNotNull('phone')
            ->orderBy('id')
            ->chunkById(100, function ($users): void {
                foreach ($users as $user) {
                    $normalized = preg_replace('/\s+/', '', (string) $user->phone) ?? $user->phone;
                    DB::table('users')->where('id', $user->id)->update([
                        'phone_normalized' => $normalized,
                    ]);
                }
            });

        Schema::table('users', function (Blueprint $table) {
            $table->unique('phone_normalized');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['phone_normalized']);
            $table->dropIndex(['status']);
            $table->dropColumn(['phone_normalized', 'status']);
        });
    }
};
