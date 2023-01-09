<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

class UpdateEmployeeTableSeeder extends Seeder
{
    private $tableName = "employees";

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $listDept = Department::all();
        if ($listDept) {
            foreach ($listDept as $dept) {
                $listEmp = Employee::where("department_id", $dept->id)->get();
                $order = 0;
                if ($listEmp) {
                    foreach ($listEmp as $emp) {
                        DB::table($this->tableName)->where('id', $emp->id)->update(['employee_order' => $order]);
                        $order++;
                    }
                }
            }
        }
    }
}
