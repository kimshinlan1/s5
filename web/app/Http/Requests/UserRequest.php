<?php

namespace App\Http\Requests;

use App\Rules\PasswordRule;
use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
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
            'identifier' => [
                'bail',
                'required',
                'email',
                'string',
                'max:255',
            ],
            'name' => ['required','string','max:255'],
            'password' => ['bail','required','string','min:8','max:128', new PasswordRule()]
        ];

        if ($this->method() === 'PUT') {
            $rules['name'] = ['required','string','max:255'];
        }
        return $rules;
    }

    /**
     * Get the validation messages.
     *
     * @return array
     */
    public function messages()
    {
        return [];
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
            'identifier' => trans('validation.attributes.users.identifier'),
            'password' => trans('validation.attributes.users.password'),
        ];
    }
}
