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
        $this->expectOutputRegex('/(handleFunction\(test)/');
        $helper->executeJsFunction('test');
    }

    public function testExecuteJsFunctionWithSimpleParam()
    {
        $helper = Helper::getInstance();
        $this->expectOutputRegex('/(handleFunction\(test, "test")/');
        $helper->executeJsFunction('test', 'test');
    }
    public function testExecuteJsFunctionWithSimpleParamWrong()
    {
        $helper = Helper::getInstance();
        $this->expectOutputRegex('/^((?!hallo).)*$/');
        $helper->executeJsFunction('test', 'testString');
    }

    public function testExecuteJsFunctionWithJSONParam()
    {
        $helper = Helper::getInstance();
        $this->expectOutputRegex('/(handleFunction\(test), {"name":"daan","id":5}/');
        $helper->executeJsFunction('test', ["name" => "daan", "id" => 5]);
    }

    public function testExecuteJsFunctionWithJSONParamWrong()
    {
        $helper = Helper::getInstance();
        $this->expectOutputRegex('/^((?!"id":5).)*$/');
        $helper->executeJsFunction('test', ["name" => "daan", "id" => 4]);
    }
}
