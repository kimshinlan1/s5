<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Rules\PasswordRule;
use App\Rules\MatchOldPassword;

class ChangePasswordRequest extends FormRequest
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
        return [
            'old_password' => ['bail','required','string','min:8','max:128', new PasswordRule(), new MatchOldPassword()],
            'new_password' =>  ['bail','required','string','min:8','max:128', new PasswordRule()],
            'new_confirm_password' => ['bail','required','same:new_password']
        ];
    }

    /**
     * Get the validation messages.
     *
     * @return array
     */
    public function messages () {
        return [
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array
     */
    public function attributes ()
    {
        return [
            'old_password' => trans('validation.attributes.passwords.old_password'),
            'new_password' => trans('validation.attributes.passwords.new_password'),
            'new_confirm_password' => trans('validation.attributes.passwords.new_confirm_password')
        ];
    }
}
