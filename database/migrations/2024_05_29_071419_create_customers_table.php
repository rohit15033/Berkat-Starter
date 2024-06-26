<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
            $table->string('phone', 20);
            $table->string('instagram')->nullable();
            $table->string('status')->nullable()->default('chat');
        });
    }

    public function down()
    {
        Schema::dropIfExists('customers');
    }
};
