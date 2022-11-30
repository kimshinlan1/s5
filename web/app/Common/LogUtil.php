<?php

namespace App\Common;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

trait LogUtil
{
    private static $className = "";

    public static function setClassName($className)
    {
        self::$className = $className;
    }

    private static function getClassName()
    {
        if (!empty(self::$className)) {
            $className = self::$className;
            self::$className = "";
        } else {
            $className = (new \ReflectionClass(get_called_class()))->getShortName();
        }
        return $className;
    }

    /**
     * log info
     *
     * @param string $functionName
     * @param object $data Optional
     * @return
     */
    public static function logInfo($functionName, $data = '')
    {
        $className = self::getClassName();
        $context = $data == '' ? " [ENTRY] " : " [SUCCESS] :: " . json_encode($data, JSON_UNESCAPED_UNICODE);
        Log::info('[userid: ' . Auth::id() . '] ' . '[' . $className . '] ' . $functionName . $context);
    }

    /**
     * function log error
     *
     * @param string $functionName
     * @param string Or object $message
     * @param string $id Optional
     * @return
     */
    public static function logError($functionName, $message, $id = '')
    {
        $className = self::getClassName();
        Log::error('[' . $className . '] ' . $functionName .
                    ' :: ' . json_encode($message, JSON_UNESCAPED_UNICODE) . ' Id:' . $id);
    }

    /**
     * function log warning
     *
     * @param string $action
     * @param string Or object $message
     * @return
     */
    public static function logWarning($functionName, $message)
    {
        $className = self::getClassName();
        Log::warning('[' . $className . '] ' . $functionName .
                    ' :: ' . json_encode($message, JSON_UNESCAPED_UNICODE));
    }

    /**
     * function log debug
     *
     * @param string $action
     * @param object $data Optional
     * @return
     */
    public static function logDebug($functionName, $data = '')
    {
        $className = self::getClassName();
        Log::debug('[' . Auth::id() . '] ' . '[' . $className . '] ' . $functionName .
                    ' :: ' . json_encode($data, JSON_UNESCAPED_UNICODE));
    }
}
