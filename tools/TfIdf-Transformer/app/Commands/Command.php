<?php

namespace App\Commands;

abstract class Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature;

    /**
     * Execute the console command.
     *
     * @param $argc
     * @param $argv
     * @return
     */
    abstract public function handle(int $argc, array $argv);
}