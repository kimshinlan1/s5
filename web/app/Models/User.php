<?php

namespace App\Models;

use App\Common\Constant;
use App\Models\Department;
use App\Models\Company;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Crypt;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * Always encrypt the password when it is updated.
     *
     * @param string $value
     * @return void
     */
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Crypt::encryptString($value);
    }

    /**
     * Check if account is admin
     */
    public function isAdmin()
    {
        return $this->getModeUser() == Constant::MODE["OWNER_COMPANY"] ? true : false;
    }

    /**
     * Check if account is user
     */
    public function isUser()
    {
        return $this->getModeUser() != 0 ? true : false;
    }

    /**
     * Check mode free of current account
     */
    public function isModeFree()
    {
        return auth()->user()->company()->first()->mode == Constant::MODE["FREE"] ? true : false;
    }

    /**
     * Get the mode of current account
     */
    public function getModeUser()
    {
        return auth()->user()->company()->first()->mode;
    }

    /**
     * Get the User associated with the department.
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
    /**
     * Get the User associated with the company.
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
