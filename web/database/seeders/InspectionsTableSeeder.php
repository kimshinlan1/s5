<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InspectionsTableSeeder extends Seeder
{
    private $tableName = "inspection";

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'id' => 1,
                'team_id' => 1,
                'inspection_date' => date('2022-1-11'),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 2,
                'team_id' => 1,
                'inspection_date' => date('2023-10-1'),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 3,
                'team_id' => 1,
                'inspection_date' => date('2023-3-30'),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 4,
                'team_id' => 1,
                'inspection_date' => date('2023-5-10'),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]
        ];
        DB::table($this->tableName)->insert($data);
    }
}
