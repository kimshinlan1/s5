<?php

namespace App\Common;

class DateUtil
{
    /**
     * Convert datetime to JP Y年m⽉d⽇ + time
     *
     * @param string $datetime
     * @return string
     */
    public static function convertToJP(string $datetime, string $timeformat = "H:i:s"): string
    {
        return date("Y年m⽉d⽇ {$timeformat}", strtotime($datetime));
    }
}
