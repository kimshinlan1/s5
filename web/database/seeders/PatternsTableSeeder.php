<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PatternsTableSeeder extends Seeder
{
    private $tableName = "patterns";

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
                'name' => 'パターンA',
                'note' => '製造現場でよく検証する項目がある。',
                '5s' => 's1:1 | s2:0 | s3: 1 | s4:0 | s5:0',
                'is_dept_customized' => 0,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]
        ];
        DB::table($this->tableName)->insert($data);
    }
}
