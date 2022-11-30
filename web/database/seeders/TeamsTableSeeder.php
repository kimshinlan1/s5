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
        $data = [];
        $max = 10;
        $count = 0;
        for ($i = 0; $i < $max; $i++) {
            ++$count;
            $department_id = rand(1, 7);
            $e = [
                'no' => 'kei000' . (string)$count,
                'name' => 'Team-' . (string)$count,
                'department_id' =>  $department_id,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            $data[] = $e;
        }

        DB::table($this->tableName)->insert($data);
    }
}
