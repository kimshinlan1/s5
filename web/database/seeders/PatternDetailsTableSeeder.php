<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PatternDetailsTableSeeder extends Seeder
{
    private $tableName = "pattern_details";

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
                'pattern_id' => 1,
                'location_id' => 1,
                'point' => 's1',
                'level_1' => 'note',
                'level_2' => 'note',
                'level_3' => 'note',
                'level_4' => 'note',
                'level_5' => 'note',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 2,
                'pattern_id' => 1,
                'location_id' => 1,
                'point' => 's2',
                'level_1' => 'note',
                'level_2' => 'note',
                'level_3' => 'note',
                'level_4' => 'note',
                'level_5' => 'note',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 3,
                'pattern_id' => 2,
                'location_id' => 2,
                'point' => 's1',
                'level_1' => 'note',
                'level_2' => 'note',
                'level_3' => 'note',
                'level_4' => 'note',
                'level_5' => 'note',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 4,
                'pattern_id' => 2,
                'location_id' => 2,
                'point' => 's2',
                'level_1' => 'note',
                'level_2' => 'note',
                'level_3' => 'note',
                'level_4' => 'note',
                'level_5' => 'note',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]
        ];
        DB::table($this->tableName)->insert($data);
    }
}
