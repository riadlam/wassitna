<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name_en');
            $table->string('name_fr');
            $table->string('name_ar');
            $table->unsignedSmallInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'position']);
        });

        $now = now();

        DB::table('categories')->insert([
            [
                'slug' => 'physical-goods',
                'name_en' => 'Physical Goods',
                'name_fr' => 'Biens physiques',
                'name_ar' => 'سلع مادية',
                'position' => 1,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'slug' => 'electronics',
                'name_en' => 'Electronics',
                'name_fr' => 'Électronique',
                'name_ar' => 'إلكترونيات',
                'position' => 2,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'slug' => 'digital-products',
                'name_en' => 'Digital Products',
                'name_fr' => 'Produits numériques',
                'name_ar' => 'منتجات رقمية',
                'position' => 3,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'slug' => 'services-freelance',
                'name_en' => 'Services / Freelance',
                'name_fr' => 'Services / Freelance',
                'name_ar' => 'خدمات / عمل حر',
                'position' => 4,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'slug' => 'accounts',
                'name_en' => 'Accounts (Gaming, Facebook, TikTok, etc.)',
                'name_fr' => 'Comptes (jeux, Facebook, TikTok, etc.)',
                'name_ar' => 'حسابات (ألعاب، فيسبوك، تيك توك، إلخ)',
                'position' => 5,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'slug' => 'other',
                'name_en' => 'Other',
                'name_fr' => 'Autre',
                'name_ar' => 'أخرى',
                'position' => 6,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
