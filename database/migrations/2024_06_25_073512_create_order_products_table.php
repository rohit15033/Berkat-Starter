<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('order_products', function (Blueprint $table) {
            $table->timestamps();
            $table->unsignedBigInteger('order_id');
            $table->string('product_id');
            $table->decimal('price', 11, 2);
            $table->decimal('discount', 11, 2)->nullable();

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });

        Schema::table('order_products', function (Blueprint $table) {
            $table->primary(['order_id', 'product_id']);
        });
    }

    public function down()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS = 0;');

        // Drop the invoices table
        Schema::dropIfExists('order_products');

        // Enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS = 1;');
    }
};

