<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

class UpdateUsersTableSeeder extends Seeder
{
    private $tableName = "users";

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $list = User::all();
        $newPass = Crypt::encryptString("Kaizenbaseadmin_12345");
        if ($list) {
            foreach ($list as $user) {
                DB::table($this->tableName)->where('id', $user->id)->update(['password' => $newPass]);
            }
        }
    }
}
