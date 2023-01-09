<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanyTableSeeder extends Seeder
{
    private $tableName = "companies";
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'no' => 'COMP00001',
                'name' => 'カイゼンベース', // owner
                'mode' => 0,
                'mode_5s' => 0,
                'address' => 'Tokyou',
                'note' => 'Note A',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'no' => 'COMP00002',
                'name' => '会社A - 有償契約', // paid mode
                'mode' => 1,
                'mode_5s' => 1,
                'address' => '',
                'note' => '',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'no' => 'COMP00003',
                'name' => '会社B - 無償契約', // free mode
                'mode' => 2,
                'mode_5s' => 2,
                'address' => '',
                'note' => '',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]
        ];
        DB::table($this->tableName)->insert($data);
    }
}
