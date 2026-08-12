<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->ulid('ulid')->unique();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->char('currency', 3)->default('DZD');
            $table->unsignedSmallInteger('inspection_period_days')->default(1);
            $table->string('creator_role', 16);
            $table->string('status', 32)->default('pending_acceptance');
            $table->string('fee_payer', 16);
            $table->decimal('subtotal', 14, 2);
            $table->decimal('fee_amount', 14, 2);
            $table->decimal('fee_rate', 8, 4)->default(0);
            $table->decimal('buyer_total', 14, 2);
            $table->decimal('seller_proceeds', 14, 2);
            $table->timestamp('terms_accepted_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['created_by', 'status', 'created_at']);
            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
