<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGaunsTable extends Migration
{
    public function up()
    {
        Schema::create('gauns', function (Blueprint $table) {
            $table->id();
            $table->string('product_id');
            $table->string('colour');
            $table->string('length');
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('gauns');
    }
}
