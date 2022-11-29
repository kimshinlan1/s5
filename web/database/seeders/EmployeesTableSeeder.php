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
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            $data[] = $e;
        }

        $max = 5;
        for ($i = 0; $i < $max; $i++) {
            ++$count;
            $e = [
                'no' => 'EMPL000' . (string)$count,
                'name' => $faker->name(),
                'email' => $faker->safeEmail,
                'employee_order' => $i,
                'department_id' => 2,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            $data[] = $e;
        }

        $max = 10;
        for ($i = 0; $i < $max; $i++) {
            ++$count;
            $e = [
                'no' => 'EMPL000' . (string)$count,
                'name' => $faker->name(),
                'email' => $faker->safeEmail,
                'employee_order' => $i,
                'department_id' => 3,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            $data[] = $e;
        }

        $max = 20;
        for ($i = 0; $i < $max; $i++) {
            ++$count;
            $e = [
                'no' => 'EMPL000' . (string)$count,
                'name' => $faker->name(),
                'email' => $faker->safeEmail,
                'employee_order' => $i,
                'department_id' => 4,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            $data[] = $e;
        }

        $max = 25;
        for ($i = 0; $i < $max; $i++) {
            ++$count;
            $e = [
                'no' => 'EMPL000' . (string)$count,
                'name' => $faker->name(),
                'email' => $faker->safeEmail,
                'employee_order' => $i,
                'department_id' => 5,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            $data[] = $e;
        }

        $max = 30;
        for ($i = 0; $i < $max; $i++) {
            ++$count;
            $e = [
                'no' => 'EMPL000' . (string)$count,
                'name' => $faker->name(),
                'email' => $faker->safeEmail,
                'employee_order' => $i,
                'department_id' => 6,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            $data[] = $e;
        }

        $max = 35;
        for ($i = 0; $i < $max; $i++) {
            ++$count;
            $e = [
                'no' => 'EMPL000' . (string)$count,
                'name' => $faker->name(),
                'email' => $faker->safeEmail,
                'employee_order' => $i,
                'department_id' => 7,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            $data[] = $e;
        }

        DB::table($this->tableName)->insert($data);
    }
}

