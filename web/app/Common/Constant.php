<?php

namespace App\Common;

class Constant
{
    public const PAGING = 10;

    public const MAX_EMP = 35;

    public const MESSAGES = [
        "SYSTEM_ERROR" => "SYSTEM ERROR",
        "SQL_ERROR" => "Query error, Please check again",
        "404" => "NOT FOUND",
        "MAX_EMP_ERROR" => "Deparment_Count_Employee"
    ];

    public const ROLE = [
        'ADMIN'             => 1,
        'USER'              => 2
    ];

    public const MODE_NAME = [
        '0'       => '管理者',
        '1'       => '有償契約',
        '2'       => '無償契約'
    ];

    public const MODE = [
        'OWNER_COMPANY'  => '0',
        'IS_CHARGE'      => '1',
        'FREE'           => '2'
    ];

    public const PREFIX = [
        'comp'       => 'COMP',
        'dept'       => 'DEPT',
        'empl'       => 'EMPL'
    ];

    public const PASSWORD_RULE = [
        'LETTERS' => '/[a-zA-Z]/',
        'DIGITS'  => '/[0-9]/',
        'SPECIAL_CHARACTERS'  => "/[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?~`]/"
    ];

    public const PDF_PATH_FILE = 'storage/app/export';

    public const NAME_5S = [
        's1'  => '整理',
        's2'  => '整頓',
        's3'  => '清掃',
        's4'  => '清潔',
        's5'  => '躾'
    ];
}
