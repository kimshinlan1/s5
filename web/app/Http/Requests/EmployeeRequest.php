<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [
            'name' => ['required','string','max:255'],
            'department_id' => ['required'],
            'team_id' => ['nullable'],
            'email' => ['nullable','email','string','max:255'],
        ];
        return $rules;
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'name' => trans('validation.attributes.common.name'),
            'email' => trans('validation.attributes.employee.email'),
            'department_id' => trans('validation.attributes.employee.department_id'),
            'team_id' => trans('validation.attributes.employee.team_id'),
        ];
    }
}
