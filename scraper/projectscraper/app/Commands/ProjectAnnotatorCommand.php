<?php

require __DIR__ . '/../../vendor/autoload.php';

use App\Commands\Command;
use App\Annotate\Annotator;
use App\Annotate\DbpeadiaAnnotator;
use App\Annotate\DandelionAnnotator;


class ProjectAnnotatorCommand extends Command
{
    /**
     * @var Annotator
     */
    private $annotator;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = "usage: php ProjectAnnotatorCommand filename\r\n";

    /**
     * WebScraperCommand constructor.
     */
    public function __construct()
    {

        $this->annotator = new DbpeadiaAnnotator();
        //$this->annotator = new DandelionAnnotator("token");
    }

    /**
     * Execute the console command.
     *
     * @param int $argc
     * @param array $argv
     *
     * @throws Exception
     */
    public function handle(int $argc, array $argv)
    {
        $options = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT;

        if ($argc == 2) {
            $filename = $argv[1];

            $file = file_get_contents($filename);

            if ($file) {
                $projects = json_decode($file, true);
            } else {
                throw new Exception("File not found.");
            }

            foreach ($projects as &$project) {
                if ($project['content'] != null) {
                    $project['entities'] = $this->annotator->entities($project['content']);
                } else {
                    $project['entities'] = null;
                }
            }

            file_put_contents($filename, json_encode($projects, $options));

        } else {
            echo $this->signature;
        }
    }
}

$command = new ProjectAnnotatorCommand();

$command->handle($argc, $argv);