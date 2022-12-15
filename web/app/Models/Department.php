<?php

namespace App\Models;

use App\Common\Constant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Department extends Model
{
    use HasFactory;

    protected $table = 'departments';
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [];

     /**
     * Get the department associated with the company.
     */
    public function company()
    {
        return $this->hasOne(Company::class, 'id', 'company_id');
    }
}
