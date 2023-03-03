<?php

namespace App\Common;

class StringUtil
{
    /**
     * Static method
     *
     * @return mixed
     */
    public static function method()
    {
        return true;
    }

    /**
     * Replace a specific character in string
     *
     * @return string
     */
    public static function replaceString($originalValue, $replaceValue, $key = '%s')
    {
        return str_replace($key, $replaceValue, $originalValue);
    }
}
