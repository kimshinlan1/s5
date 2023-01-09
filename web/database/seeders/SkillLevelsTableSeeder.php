<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SkillLevelsTableSeeder extends Seeder
{
    private $tableName = "skill_levels";

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'id' => 99,
                'name' => 'ヌル',
                'icon_path' => '',
                'point' => null,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 1,
                'name' => '指導が出来る',
                'icon_path' => '',
                'point' => 1.0,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 2,
                'name' => '標準的な時間・品質で作業が出来る',
                'icon_path' => '',
                'point' => 1.0,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 3,
                'name' => '標準的な時間には未達だが作業はできる',
                'icon_path' => '',
                'point' => 0.5,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 4,
                'name' => '座学・机上教育のみ',
                'icon_path' => '',
                'point' => 0.0,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]
        ];
        DB::table($this->tableName)->insert($data);
    }
}
