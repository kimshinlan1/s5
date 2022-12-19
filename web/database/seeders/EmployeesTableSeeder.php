<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeesTableSeeder extends Seeder
{
    private $tableName = "employees";

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = \Faker\Factory::create();

        $data = [];

        // Kaizenbase
        $max = 1;
        $count = 0;
        for ($i = 0; $i < $max; $i++) {
            ++$count;
            $e = [
                'no' => 'EMPL000' . (string)$count,
                'name' => $faker->name(),
                'email' => $faker->safeEmail,
                'employee_order' => $i,
                'department_id' => 1,
                'team_id' => 1,
                'employee_order' => $count,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            $data[] = $e;
        }

        // 会社A
        $max = 5;
        for ($i = 0; $i < $max; $i++) {
            ++$count;
            $e = [
                'no' => 'EMPL000' . (string)$count,
                'name' => $faker->name(),
                'email' => $faker->safeEmail,
                'employee_order' => $i,
                'department_id' => 2,
                'team_id' => 4,
                'employee_order' => $count,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            $data[] = $e;
        }

        // 会社B
        $max = 20;
        for ($i = 0; $i < $max; $i++) {
            ++$count;
            $e = [
                'no' => 'EMPL000' . (string)$count,
                'name' => $faker->name(),
                'email' => $faker->safeEmail,
                'employee_order' => $i,
                'department_id' => 4,
                'team_id' => 5,
                'employee_order' => $count,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            $data[] = $e;
        }

        DB::table($this->tableName)->insert($data);
    }
}
