<?php

namespace App\Rules;

use App\Common\Constant;
use Illuminate\Contracts\Validation\Rule;

class PasswordRule implements Rule
{
    private $message;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $booleanResult = false;
        $containsLetter = preg_match(Constant::PASSWORD_RULE['LETTERS'], $value);
        $containDigit =  preg_match(Constant::PASSWORD_RULE['DIGITS'], $value);
        $containsSpecial = preg_match(Constant::PASSWORD_RULE['SPECIAL_CHARACTERS'], $value);

        if ($containsLetter && $containDigit && $containsSpecial) {
            $booleanResult = true;
        } elseif (!$containsLetter && !$containDigit && !$containsSpecial) {
            $this->message = trans('validation.password_half_width');
            $booleanResult = false;
        } elseif (!$containsLetter || !$containDigit) {
            $this->message = trans('validation.password_alpha_num');
            $booleanResult = false;
        } elseif (!$containsSpecial) {
            $this->message = trans('validation.password_special_character');
            $booleanResult = false;
        }
        return $booleanResult;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return $this->message;
    }
}
