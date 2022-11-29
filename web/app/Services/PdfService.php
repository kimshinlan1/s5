<?php

namespace App\Services;

use App\Models\Department;
use App\Services\EmployeeService;
use App\Services\DepartmentService;
use App\Services\SkillLevelService;

class PdfService
{
    public function __construct()
    {
        $this->serviceSkillLevel = app(SkillLevelService::class);
        $this->serviceEmployee = app(EmployeeService::class);
        $this->serviceDepartment = app(DepartmentService::class);
    }

    /**
     * Load content to render html
     *
     * @param $request
     * @param $no
     *
     * @return array
     */
    public function loadContent($request, $no = null, $ischart = false)
    {
        $departmentId = $request->input('department_id');
        $currentDept = Department::where('id', $departmentId)->get();
        $deptNo = $currentDept->first()->no;
        $fileName = "{$deptNo}_{$no}";
        // Set content for html
        $content["department"] = $request->input('department');
        $content["deptNo"] = $deptNo;
        $content["lineName"] = $request->input('lineName');
        // Set title file name
        $content["titleFileName"] = $fileName;

        if ($ischart) {
            return $content;
        }


        // create at
        $content["dateFrom"] = $request->input('dateFrom');
        // update at
        $content["dateTo"] = $request->input('dateTo');

        // All employee of department
        $allEmployees = $this->serviceEmployee->getAllName($departmentId);
        foreach ($allEmployees as $emp => $val) {
            $allEmployees[$emp] = str_replace(' ', PHP_EOL, $val);
            $allEmployees[$emp] = str_replace('　', PHP_EOL, $val);
        }
        $allEmployees = count($allEmployees) ? array_column($allEmployees, "name") : ["No data"];
        $content["header_employees"] = $allEmployees;
        $content["header_employees_count"] = count($allEmployees);

        $content["data"] = [];
        $params = $request->all();
        $results = $params['result'];
        $no = 1;
        foreach ($results as $result) {
            foreach ($result['datas'] as $data) {
                $skill = $data['skill'];

                if (empty($skill['workName'])) {
                    continue;
                }

                $row = [];
                $row['category_name'] = $result['categoryName'];
                $row['no'] = $no;
                $row['skill_name'] = $skill['workName'];
                $row['difficult_level'] = $skill['difficultyLevel'];
                $row['experienced_month'] = $skill['trainingPeriod'] == null ? "" : number_format("
                    {$skill['trainingPeriod']}") . "ヶ月";
                $row['required_number'] = $data['requiredPersonnel'];
                $row['trained_number'] = $data['currentPersonnel'];
                $row['progress'] = $data['LevelOfAchievement'] > 100 ? "100%" : $data['LevelOfAchievement'] . "%";
                $row['progress_rate'] = $data['LevelOfAchievement'] > 100 ? 100 : (int)($data['LevelOfAchievement']);

                // Loop employee
                $employees = $data['employees'];
                for ($i = 0; $i < count($employees); $i++) {
                    $arrayInfo = [];
                    $arrayInfo["skill_level"] = $this->skillLevelIcon($employees[$i]['skillLevel']);
                    $arrayInfo["skill_up"] = $employees[$i]['skillUp'] == 0 ? "" : $employees[$i]['skillUp'];

                    $row['employee_skills']['skill_level_id'][$i] = $arrayInfo;
                }

                $content["data"][] = $row;
                $no++;
            }
        }

        $categoryGroup = [];
        foreach ($content["data"] as $data) {
            $data['rowspan'] = empty($data['category_name']) ? 1 : 0;
            $categoryGroup[$data['category_name']][] = $data;

            if (!empty($data['category_name'])) {
                $categoryGroup[$data['category_name']][0]['rowspan'] = count($categoryGroup[$data['category_name']]);
            }
        }

        // Add tmp blank row for category rowspan
        $cnt = 0;
        foreach ($categoryGroup as $data => $value) {
            $cnt = 0;
            $keyName = '';
            foreach ($categoryGroup[$data] as $key => $value) {
                $keyName = $key;
                if ($cnt == 0) {
                    $categoryGroup[$data][$key]['categoryColumn'] = 1;// for first row
                } else {
                    $categoryGroup[$data][$key]['categoryColumn'] = 2;// for next row
                }
                $cnt++;
            }
            $categoryGroup[$data][$keyName]['categoryColumn'] = 3;// for last row
            $categoryGroup[$data][$keyName]['displayName'] = false;
            // with category has 1 skill, so first row equal last row, it will be display category name
            if (count($categoryGroup[$data]) == 1) {
                $categoryGroup[$data][$keyName]['displayName'] = true;
            }
        }

        $content["data"] = $categoryGroup;
        $content["count"] = isset($content["data"][1]) ? count($content["data"][1]) : 0;

        return $content;
    }

    /**
     * Convert skill up id to icon
     *
     * @param $id
     *
     * @return string
     */
    public function skillLevelIcon($id)
    {
        $icon = "";
        if (in_array($id, [1,2,3,4])) {
            $icon = '<img src="assets/img/skill-' . $id . '.png" width="auto" height="25px"/>';
        } else {
            // Set default to prevent the row auto increase height when break page
            $icon = '<img src="" width="1" height="1" style="background-color: white;" />';
        }
        return $icon;
    }
}
