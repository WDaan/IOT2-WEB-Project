<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

class HelperTest extends TestCase
{

    public function testHelperCanBeCreated()
    {
        $this->assertInstanceOf(Helper::class, Helper::getInstance());
    }

    public function testExecuteJsFunctionNoParams()
    {
        $helper = Helper::getInstance();
        $funId = rand(1,999);
        $this->expectOutputString('<script id="'. $funId .'" type="text/javascript">handleFunction(test, '. $funId .');</script>');
        $helper->executeJsFunction('test',  $funId);
    }

    public function testExecuteJsFunctionWithSimpleParam()
    {
        $helper = Helper::getInstance();
        $funId = rand(1,999);
        $this->expectOutputString('<script id="'. $funId .'" type="text/javascript">handleFunction(test, "test", '.  $funId .');</script>');
        $helper->executeJsFunction('test', $funId, 'test');
    }

    public function testExecuteJsFunctionWithJSONParam()
    {
        $helper = Helper::getInstance();
        $funId = rand(1,999);
        $this->expectOutputString('<script id="'. $funId .'" type="text/javascript">handleFunction(test, {"name":"daan","id":5}, '.  $funId .');</script>');
        $helper->executeJsFunction('test',  $funId, ["name" => "daan", "id" => 5]);
    }
}
