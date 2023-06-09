<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private $tableName = "inspection_block_images";

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Remove exist table
        if (Schema::hasTable($this->tableName)) {
            Schema::dropIfExists($this->tableName);
        }

        // Create
        Schema::create($this->tableName, function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('inspection_id');
            $table->string('problem_before', 255)->nullable();
            $table->string('problem_after', 255)->nullable();
            $table->timestamp('date_before')->nullable();
            $table->timestamp('date_after')->nullable();
            $table->string('location_before', 255)->nullable();
            $table->string('location_after', 255)->nullable();
            $table->timestamps();
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
