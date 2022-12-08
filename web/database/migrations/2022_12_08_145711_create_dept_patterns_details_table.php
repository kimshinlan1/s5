<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private $tableName = "dept_patterns_details";

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
            $table->integer('location_id');
            $table->string('point', 3);
            $table->string('level_1', 255);
            $table->string('level_2', 255);
            $table->string('level_3', 255);
            $table->string('level_4', 255);
            $table->string('level_5', 255);
            $table->timestamps();
            $table->unique(['id', 'pattern_id', 'location_id']);
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
