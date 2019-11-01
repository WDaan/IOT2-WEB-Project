<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

class DatabaseHandlerTest extends TestCase
{

    public function testDatabaseHandlerCanBeCreated()
    {
        $this->assertInstanceOf(DatabaseHandler::class, DatabaseHandler::getInstance());
    }

    public function testGetDataFromDatabase()
    {
        $mysqli = DatabaseHandler::getInstance();
        $data = $mysqli->getFirst(3);
        $this->assertCount(3, $data);
    }
}
