<?php
include_once('php/Helper.php');
require('vendor/autoload.php');

$dotenv = Dotenv\Dotenv::create(__DIR__, '../.env');
$dotenv->load();

class DatabaseHandler
{
    private static $instance = null;
    private $conn;
    private $helper;

    // The db connection is established in the private constructor.
    private function __construct()
    {
        //helper
        $this->helper = Helper::getInstance();
        //db connection
        $this->conn = new mysqli($_ENV['HOST'], $_ENV['USERNAME'], $_ENV['PASS'], $_ENV['DATABASE']);
        if ($this->conn->connect_errno) {
            $this->helper->errorToBrowserConsole("Failed to connect to MySQL: " . $this->conn->connect_error);
        } else {
            $this->helper->logToBrowserConsole("connection success!!");
        }
    }

    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new DatabaseHandler();
        }

        return self::$instance;
    }

    public function getConnection()
    {
        return $this->conn;
    }

    public function getAll()
    {
        $query = "SELECT * FROM `data`";
        if ($result = $this->conn->query($query)) {
            /* fetch associative array */
            $data = [];
            while ($row = $result->fetch_assoc()) {
                // echo $row["NAME"] . " " . $row["VALUE"] . " " . $row["id"] . "<br />";
                $data[] =  ['id' =>  $row['ID'], 'time' => $row["TIME"], 'temp' => $row['TEMP'], 'speed' => $row['SPEED']];
            }
            /* free result set */
            $result->free();

            return $data;
        }
    }
}
