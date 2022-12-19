<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeamsTableSeeder extends Seeder
{
    private $tableName = "teams";

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'no' => 'TEAM00001',
                'name' => 'Kaizen_係1',
                'department_id' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'no' => 'TEAM00002',
                'name' => 'Kaizen_係2',
                'department_id' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'no' => 'TEAM00003',
                'name' => 'Kaizen_係3',
                'department_id' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'no' => 'TEAM00004',
                'name' => '会社A_係1',
                'department_id' => 2,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'no' => 'TEAM00005',
                'name' => '会社B_係1',
                'department_id' => 4,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
        ];
        DB::table($this->tableName)->insert($data);
    }
}
