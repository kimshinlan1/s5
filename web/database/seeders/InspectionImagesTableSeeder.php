<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InspectionImagesTableSeeder extends Seeder
{
    private $tableName = "inspection_images";

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
                'inspections_id' => 1,
                'block' => 1,
                'img_before_path' => '/img/path',
                'img_after_path' => '/img/path',
                'problem_before' => 'note',
                'problem_after' => 'note',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 2,
                'inspections_id' => 1,
                'block' => 2,
                'img_before_path' => '/img/path',
                'img_after_path' => '/img/path',
                'problem_before' => 'note',
                'problem_after' => 'note',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]
        ];
        DB::table($this->tableName)->insert($data);
    }
}
