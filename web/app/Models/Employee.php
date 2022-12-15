<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $table = 'employees';
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

    /**
     * Get the product type associated with the product.
     */
    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id');
    }
}
