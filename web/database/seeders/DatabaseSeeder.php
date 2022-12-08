<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Insert mock data
        $this->call(RolesTableSeeder::class);
        $this->call(CompanyTableSeeder::class);
        $this->call(DepartmentsTableSeeder::class);
        $this->call(UsersTableSeeder::class);
        $this->call(SkillLevelsTableSeeder::class);
        $this->call(EmployeesTableSeeder::class);
        $this->call(TeamsTableSeeder::class);
        $this->call(AreasTableSeeder::class);
        $this->call(InspectionDetailsTableSeeder::class);
    }
}
