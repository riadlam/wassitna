<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('payout_method', 32)->nullable()->after('status');
            $table->string('ccp_number', 32)->nullable()->after('payout_method');
            $table->string('cle', 8)->nullable()->after('ccp_number');
            $table->string('account_holder_name', 120)->nullable()->after('cle');
            $table->string('rip_baridimob', 32)->nullable()->after('account_holder_name');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'payout_method',
                'ccp_number',
                'cle',
                'account_holder_name',
                'rip_baridimob',
            ]);
        });
    }
};
