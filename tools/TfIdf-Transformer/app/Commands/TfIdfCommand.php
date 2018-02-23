<?php

ini_set('memory_limit', '512M');

require __DIR__ . '/../../vendor/autoload.php';

use App\Commands\Command;
use Phpml\Tokenization\WordTokenizer;
use Phpml\FeatureExtraction\TfIdfTransformer;
use Phpml\FeatureExtraction\TokenCountVectorizer;

class TfIdfCommand extends Command
{
	/**
     * The name and signature of the console command.
     *
     * @var string
     */
	protected $signature = "usage: php TfIdfCommand filename\r\n";

	/**
     * TfIdfCommand constructor.
     */
    public function __construct()
    {
    	//
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
        if ($argc == 2) {

            $filename = $argv[1];

            $file = file_get_contents($filename);

            if ($file) {
                $dataset = json_decode($file, true);
            } else {
                throw new Exception("File not found.");
            }

            $vectorizer = new TokenCountVectorizer(new WordTokenizer());

            $transformer = new TfIdfTransformer();

            $samples = [];

            foreach ($dataset['projects'] as $sample) {
                if ($sample['description'] != null) {
                    $samples[] =  $sample['description'];
                }
            }

            $vectorizer->fit($samples);
            $vectorizer->transform($samples);

            $transformer->fit($samples);
            $transformer->transform($samples);

            $vocabulary = $vectorizer->getVocabulary();

            for($i = 0; $i < sizeof($samples); $i++) {
                for($j = 0; $j < sizeof($samples[$i]); $j++) {
                    $samples[$i][$j] = [$vocabulary[$j] => $samples[$i][$j]];
                }
            }

            var_dump($samples);

        } else {
            echo $this->signature;
        }
    }
}

$command = new TfIdfCommand();

$command->handle($argc, $argv);