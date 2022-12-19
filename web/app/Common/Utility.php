<?php

namespace App\Common;

use Illuminate\Support\Facades\DB;
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

        // Get max value
        if ($prefix) {
            $sql = DB::raw(" Max(Convert(REPLACE($field, '$prefix', ''), INT)) as max");
            $max = $model::select($sql)->value('max');
        } else {
            $sql = DB::raw(" Max(Convert($field, INT)) as max");
            $max = $model::select($sql)->value('max');
        }

        // Init new
        if ($max) {
            $generateUniqueId = str_pad(($max + 1), $len, '0', STR_PAD_LEFT);
        } else {
            $generateUniqueId = str_pad(1, $len, '0', STR_PAD_LEFT);
        }
        return $prefix . $generateUniqueId;
    }
}
