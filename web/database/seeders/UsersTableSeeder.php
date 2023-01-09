<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

class UsersTableSeeder extends Seeder
{
    private $tableName = "users";

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'identifier' => "kaizenbaseadmin@domain.com",
                'password' => Crypt::encryptString("Kaizenbaseadmin_12345"),
                'name' => 'kaizenbaseadmin',
                'role_id' => 1,
                'company_id' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'identifier' => "admin@domain.com",
                'password' => Crypt::encryptString("Admin_12345"),
                'name' => 'admin',
                'role_id' => 1,
                'company_id' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'identifier' => "paid_user@domain.com",
                'password' => Crypt::encryptString("User_12345"),
                'name' => 'paid_user',
                'role_id' => 2,
                'company_id' => 2,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'identifier' => "free_user@domain.com",
                'password' => Crypt::encryptString("User_12345"),
                'name' => 'free_user',
                'role_id' => 2,
                'company_id' => 3,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]
        ];
        DB::table($this->tableName)->insert($data);
    }
}
