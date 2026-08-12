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
            $table->decimal('wallet', 14, 2)->default(0)->after('rip_baridimob');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->timestamp('wallet_credited_at')->nullable()->after('delivery_received_at');
        });

        Schema::create('withdrawals', function (Blueprint $table) {
            $table->id();
            $table->ulid('ulid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('transaction_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('amount', 14, 2);
            $table->char('currency', 3)->default('DZD');
            $table->string('method', 32);
            $table->string('ccp_number', 32)->nullable();
            $table->string('cle', 8)->nullable();
            $table->string('account_holder_name', 120)->nullable();
            $table->string('rip_baridimob', 32)->nullable();
            $table->string('status', 32)->default('pending');
            $table->timestamps();
            $table->softDeletes();

            $table->unique('transaction_id');
            $table->index(['user_id', 'status', 'created_at']);
        });

        $now = now();
        $completed = DB::table('transactions')
            ->where('status', 'completed')
            ->whereNull('wallet_credited_at')
            ->orderBy('id')
            ->get();

        foreach ($completed as $transaction) {
            $party = DB::table('transaction_parties')
                ->where('transaction_id', $transaction->id)
                ->where('role', 'seller')
                ->first();

            if (! $party) {
                continue;
            }

            $userId = $party->user_id;
            if (! $userId && $party->email) {
                $userId = DB::table('users')
                    ->whereRaw('LOWER(email) = ?', [strtolower((string) $party->email)])
                    ->value('id');
            }

            if (! $userId) {
                continue;
            }

            DB::table('users')->where('id', $userId)->increment('wallet', $transaction->seller_proceeds);
            DB::table('transactions')->where('id', $transaction->id)->update([
                'wallet_credited_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('withdrawals');

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('wallet_credited_at');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('wallet');
        });
    }
};
