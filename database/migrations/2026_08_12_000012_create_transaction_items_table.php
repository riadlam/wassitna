<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaction_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained('transactions')->cascadeOnDelete();
            $table->string('category');
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 14, 2);
            $table->unsignedInteger('quantity')->default(1);
            $table->unsignedSmallInteger('position')->default(0);
            $table->timestamps();

            $table->index(['transaction_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaction_items');
    }
};
