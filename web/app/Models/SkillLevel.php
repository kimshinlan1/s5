<?php

namespace App\Models;

use App\Common\Constant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class SkillLevel extends Model
{
    use HasFactory;

    protected $table = 'skill_levels';
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [];

    /**
     * Get the user's full name.
     *
     * @return string
     */
    public function getPointFormatAttribute()
    {
        if ($this->point == null) {
            return "- 点";
        } else {
            return number_format("{$this->point}", 1)."点";
        }
    }

}
