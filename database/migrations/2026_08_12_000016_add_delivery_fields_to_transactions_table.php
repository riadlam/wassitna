<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->text('delivery_note')->nullable()->after('payment_method');
            $table->timestamp('delivery_sent_at')->nullable()->after('delivery_note');
            $table->timestamp('delivery_received_at')->nullable()->after('delivery_sent_at');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['delivery_note', 'delivery_sent_at', 'delivery_received_at']);
        });
    }
};
