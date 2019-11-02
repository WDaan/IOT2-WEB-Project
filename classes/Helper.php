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
        $this->executeJsFunction('console.error', 'PHP ERROR: ' . $msg);
    }
    public function warnToBrowserConsole($msg)
    {
        $msg = str_replace('"', "''", $msg);  # weak attempt to make sure there's not JS breakage
        $this->executeJsFunction('console.warn', 'PHP WARNING: ' . $msg);
    }
    public function logToBrowserConsole($msg)
    {
        $msg = str_replace('"', "''", $msg);  # weak attempt to make sure there's not JS breakage
        $this->executeJsFunction('console.log', 'PHP LOG: ' . $msg);
    }


    public function executeJsFunction($fun, $params = null)
    {
        $funId = rand(1, 999);
        if (is_null($params)) {
            echo '<script id="' . $funId . '" type="text/javascript">',
                'handleFunction(' . $fun . ', ' . $funId . ');',
                '</script>';
        } else {
            echo '<script id="' . $funId . '" type="text/javascript">',
                'handleFunction(' . $fun . ', ' . json_encode($params) . ', ' . $funId . ');',
                '</script>';
        }
    }
}
