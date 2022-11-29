<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Request;

class CompanyRequest extends FormRequest
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
        $id = Request::get('id');
        $rules = [
            'name' => ['required','string','max:255'],
            'no' => ['required','string','regex:/[a-zA-Z][0-9]|[0-9][a-zA-Z]/','max:255'],
        ];

        // store
        if ($this->method() === 'POST') {
            array_push($rules ['name'], 'unique:companies,name');
            array_push($rules ['no'], Rule::unique('companies', 'no')->ignore($id));
        // update
        } elseif ($this->method() === 'PUT') {
            array_push($rules ['name'], Rule::unique('companies', 'name')->ignore($id));
            array_push($rules ['no'], Rule::unique('companies', 'no')->ignore($id));
        }
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
            'name' => trans('validation.attributes.companies.name'),
            'no' => trans('validation.attributes.companies.no'),
        ];
    }
}
