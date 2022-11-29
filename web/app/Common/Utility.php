<?php

namespace App\Common;

use Illuminate\Database\Eloquent\Model;

class Utility
{
    /**
     * Generate unique id
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param string $field
     * @param string|null $prefix
     * @param boolean $isDigtal
     * @param integer $len
     * @return void
     */
    public static function generateUniqueId(Model $model, string $field, ?string $prefix = null, int $len = 3)
    {
        if ($len < 3 || $len > 10) {
            $len = 3;
        }

        $max = $model::max($field);
        if ($max) {
            $number = substr($max, -5);
            $generateUniqueId = str_pad(($number + 1), $len, '0', STR_PAD_LEFT);
        } else {
            $generateUniqueId = str_pad(1, $len, '0', STR_PAD_LEFT);
        }
        return $prefix . $generateUniqueId;
    }
}
