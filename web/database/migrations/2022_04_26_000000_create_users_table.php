<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private $tableName = "users";

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create($this->tableName, function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 255);
            $table->string('identifier', 255)->comment('LoginId');
            $table->text('password'); // use long text for encrypt
            $table->foreignId('role_id')->constrained("roles")
                ->onUpdate('cascade')
                ->onDelete('restrict');
            $table->integer('company_id');
            $table->timestamps();
            $table->unique(['id', 'identifier']);
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
