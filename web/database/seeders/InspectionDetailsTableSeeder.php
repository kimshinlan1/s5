<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InspectionDetailsTableSeeder extends Seeder
{
    private $tableName = "inspection_details";

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'inspection_id' => 1,
                'location_id' => 1,
                'point' => 's1',
                'point_value' => 2,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'inspection_id' => 1,
                'location_id' => 1,
                'point' => 's2',
                'point_value' => 3,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]
        ];
        DB::table($this->tableName)->insert($data);
    }
}
