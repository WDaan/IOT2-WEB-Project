<?php
declare(strict_types=1);

$dotenv = Dotenv\Dotenv::create(__DIR__, '../.env');
$dotenv->load();

final class DatabaseHandler
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
            $this->helper->logToBrowserConsole("mysqli connection success!");
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
        return $this->executeQuery($query);
    }

    public function getFirst($num = 5)
    {
        $query = "SELECT * FROM `data` LIMIT " . $num;
        return $this->executeQuery($query);
    }
    public function getLast($num = 5, $oldest_first = true)
    {
        if($oldest_first) $query = "SELECT * FROM (SELECT * FROM `data` ORDER BY id DESC LIMIT " . $num . " )Var1 ORDER BY id ASC";   
        else $query = "SELECT * FROM `data` ORDER BY id DESC LIMIT " . $num;
        return $this->executeQuery($query);
    }

    private function executeQuery($query)
    {
        if ($result = $this->conn->query($query)) {
            /* fetch associative array */
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] =  ['id' =>  $row['ID'], 'time' => $row["TIME"], 'temp' => $row['TEMP'], 'speed' => $row['SPEED']];
            }
            /* free result set */
            $result->free();

            return $data;
        }
    }
}
