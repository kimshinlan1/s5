<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private $tableName = "pattern_details";

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create($this->tableName, function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('pattern_id');
            $table->integer('area_id');
            $table->integer('location_id');
            $table->string('point', 3);
            $table->text('level_1')->nullable();
            $table->text('level_2')->nullable();
            $table->text('level_3')->nullable();
            $table->text('level_4')->nullable();
            $table->text('level_5')->nullable();
            $table->timestamps();
            $table->unique(['pattern_id', 'location_id', 'point']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists($this->tableName);
    }
};
