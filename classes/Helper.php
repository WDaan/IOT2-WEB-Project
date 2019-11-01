<?php


class Helper
{
    private static $instance = null;


    private function __construct()
    {
        $this->logToBrowserConsole('Helper created!');
    }

    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new Helper();
        }

        return self::$instance;
    }

    public function errorToBrowserConsole($msg)
    {
        $msg = str_replace('"', "''", $msg);  # weak attempt to make sure there's not JS breakage
        echo "<script>console.error( \"PHP ERROR: $msg\" );</script>";
    }
    public function warnToBrowserConsole($msg)
    {
        $msg = str_replace('"', "''", $msg);  # weak attempt to make sure there's not JS breakage
        echo "<script>console.warn( \"PHP WARNING: $msg\" );</script>";
    }
    public function logToBrowserConsole($msg)
    {
        $msg = str_replace('"', "''", $msg);  # weak attempt to make sure there's not JS breakage
        echo "<script>console.log( \"PHP LOG: $msg\" );</script>";
    }

    public function executeJsFunction($fun, $params = null)
    {
        if (is_null($params)) {
            echo '<script type="text/javascript">',
                $fun . '();',
                '</script>';
        } else {
            echo '<script type="text/javascript">',
                'let params = ' .  json_encode($params) . ';',
                $fun . '(params);',
                '</script>';
        }
    }
}
