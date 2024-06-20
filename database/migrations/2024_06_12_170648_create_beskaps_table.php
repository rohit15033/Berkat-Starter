<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBeskapsTable extends Migration
{
    public function up()
    {
        Schema::create('beskaps', function (Blueprint $table) {
            $table->id();
            $table->string('product_id');
            $table->string('adat');
            $table->string('colour');
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('beskaps');
    }
}
