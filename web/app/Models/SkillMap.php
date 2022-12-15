<?php

namespace App\Models;

use App\Common\Constant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class SkillMap extends Model
{
    use HasFactory;

    protected $table = 'skillmaps';
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [];

    /**
     * Get the product type associated with the product.
     */
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }
}
