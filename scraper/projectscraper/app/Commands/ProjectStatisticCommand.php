<?php

require __DIR__ . '/../../vendor/autoload.php';

use App\Commands\Command;

/**
 * Class AnnotateCommand
 */
class ProjectStatisticCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = "usage: php ProjectStatisticCommand filename\r\n";

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
        if ($argc == 2) {
            $filename = $argv[1];

            $file = file_get_contents($filename);

            if ($file) {
                $projects = json_decode($file, true);
            } else {
                throw new Exception("File not found.");
            }

            $fp = fopen('../../storage/projects.csv', 'w');

            fprintf($fp, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($fp, ['id','title','href','content'], ';');

            foreach ($projects as $project) {
                fputcsv($fp, array_except($project, 'entities'), ';');
            }

            fclose($fp);

            $fp = fopen('../../storage/entities.csv', 'w');

            fprintf($fp, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($fp, ['title', 'href', 'project.href'], ';');

            foreach ($projects as $project) {
                if ($project['entities'] != null) {
                    foreach ($project['entities'] as $entity) {
                        $entity['project.href'] = $project['href'];
                        fputcsv($fp, $entity, ';');
                    }
                }
            }

            fclose($fp);


        } else {
            echo $this->signature;
        }
    }
}

$command = new ProjectStatisticCommand();

$command->handle($argc, $argv);