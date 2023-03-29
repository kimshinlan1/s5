<?php

namespace App\Common;

class Constant
{
    /**
     * Common
     */
    public const PAGING = 10;

    public const MAX_EMP = 35;

    public const MESSAGES = [
        "SYSTEM_ERROR" => "SYSTEM ERROR",
        "SQL_ERROR" => "Query error, Please check again",
        "404" => "NOT FOUND",
        "MAX_EMP_ERROR" => "Deparment_Count_Employee",
        "UNIQUE_PATTERN_NAME" => "パターン名は社内で一意である必要があります",
        "DUPLICATED_PATTERN" => "このパターンはすでに使用されています",
        "INVALID_EXTENSION_ERROR" => "無効な画像拡張子です。有効な画像を選択してください ",
        "EXCEED_SIZE_ERROR" => "画像サイズが %sMB を超えています。有効な画像を選択してください ",
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

    public const KAIZEN_BASE_COMPANY_ID = 1;

    /**
     * ５S管理
     */
    public const NAME_5S = [
        's1'  => '整理',
        's2'  => '整頓',
        's3'  => '清掃',
        's4'  => '清潔',
        's5'  => '躾'
    ];
    public const POINT_VALUE_5S = [1,2,3,4,5];
    public const INSPECTION_DEFAULT_COLUMN_NUMBER = 3;
    public const PAGE_PATTERN_LIST_CUSTOMER = 1;
    public const MODE_5S = [
        '1'       => '有償契約',
        '2'       => '無償契約'
    ];

    public const INSPECTION_IMAGE_PATH = 'uploads/inspections/imgs';
    public const NO_IMAGE_PATH = '/assets/img/no_image.jpg';
    public const IMAGE_LIMIT_SIZE_BYTE = 10485760;
    public const IMAGE_LIMIT_SIZE = 10;
    public const VALID_IMAGE_EXTENSION = ['jpg', 'jpeg', 'jfif', 'pjpeg', 'png', 'bmp'];
    public const THE_FIRST_TIME = '回目';
}
