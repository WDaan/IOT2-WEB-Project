<?php


use RandomLib\Factory;

class Helper
{
    private static $instance = null;
    private $generator;
    private $factory;


    private function __construct()
    {
        $this->factory =  new Factory();
        $this->generator = $this->factory->getMediumStrengthGenerator();

        $this->logToBrowserConsole('Helper created!');
    }

    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new Helper();
        }

        return self::$instance;
    }

    public function generateId($len = 20){
        return $this->generator->generateString($len);
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
        $funId = $this->generateId();
        if (is_null($params)) {
            echo '<script id="' . $funId . '" type="text/javascript">',
                'handleFunction(' . $fun . ', "' . $funId . '");',
                '</script>';
        } else {
            echo '<script id="' . $funId . '" type="text/javascript">',
                'handleFunction(' . $fun . ', ' . json_encode($params) . ', "' . $funId . '");',
                '</script>';
        }  
    }

    
}
