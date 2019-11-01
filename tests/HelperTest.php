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
        $this->expectOutputString('<script type="text/javascript">test();</script>');
        $helper->executeJsFunction('test');
    }

    public function testExecuteJsFunctionWithSimpleParam()
    {
        $helper = Helper::getInstance();
        $this->expectOutputString('<script type="text/javascript">let params = "test";test(params);</script>');
        $helper->executeJsFunction('test', 'test');
    }

    public function testExecuteJsFunctionWithJSONParam()
    {
        $helper = Helper::getInstance();
        $this->expectOutputString('<script type="text/javascript">let params = {"name":"daan","id":5};test(params);</script>');
        $helper->executeJsFunction('test', ["name" => "daan", "id" => 5]);
    }
}
