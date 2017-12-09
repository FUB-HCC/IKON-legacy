<?php

require __DIR__ . '/../../vendor/autoload.php';

use GuzzleHttp\Client;
use App\Commands\Command;
use GuzzleHttp\Cookie\CookieJar;
use Symfony\Component\DomCrawler\Crawler;

/**
 * Class WebScraperCommand
 */
class ProjectScraperCommand extends Command
{
    /**
     * @var bool
     */
    private $debug;

    /**
     * @var Client
     */
    private $client;

    /**
     * @var float
     */
    private $timeout;

    /**
     * @var CookieJar
     */
    private $cookies;

    /**
     * The base url.
     *
     * @var string
     */
    private $baseUrl = 'https://biowikifarm.net';

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = "usage: php ProjectScraperCommand username password filename\r\n";

    /**
     * WebScraperCommand constructor.
     *
     * @param array $options
     */
    public function __construct(array $options = [])
    {
        $this->debug = isset($options['debug']) ? $options['debug'] : false;
        $this->timeout = isset($options['timeout']) ? $options['timeout'] : 60;
    }

    /**
     * Create a new endpoint.
     *
     * @param string $baseUrl
     */
    private function createClient(string $baseUrl)
    {
        $this->cookies = new CookieJar();

        $options = [
            'cookies' => true,
            'base_uri' => $baseUrl,
            'debug' => $this->debug,
            'allow_redirection' => true,
            'timeout'  => $this->timeout,
        ];

        $this->client = new Client($options);
    }

    /**
     * Authenticate user with given username and password.
     *
     * @param $username
     * @param $password
     */
    private function auth($username, $password)
    {
        $token = $this->requestCsrfToken();

        $uri = '/v-mfn/forschungsprojekte/index.php?title=Spezial:Anmelden&action=submitlogin&type=login';
        $options = [
            'cookies' => $this->cookies,
            'form_params' => [
                'wpName' => $username,
                'wpLoginToken' => $token,
                'wpPassword' => $password
            ],
        ];

        $this->client->post($uri, $options);
    }

    /**
     * Request Session Cookie and Csrf Token
     */
    private function requestCsrfToken()
    {
        $uri = '/v-mfn/forschungsprojekte/index.php?title=Spezial:Anmelden';

        $options = [
            'cookies' => $this->cookies
        ];

        $response = $this->client->get($uri, $options);

        $crawler = new Crawler($response->getBody()->getContents());
        return $crawler->filter('input[name="wpLoginToken"]')->first()->extract(['value'])[0];
    }

    /**
     * Get project list.
     *
     * @return array
     */
    private function getProjectList()
    {
        $uri = '/v-mfn/forschungsprojekte/Forschungsprojekte';
        $options = [
            'cookies' => $this->cookies
        ];

        $response = $this->client->get($uri, $options);

        $crawler = new Crawler($response->getBody()->getContents());
        $projects = $crawler->filter('.smw-columnlist-container')
            ->first()
            ->filter('a')
            ->extract(['title', '_text', 'href']);

        foreach ($projects as &$project) {
            $project = [
                "id" => (int)$project[0],
                "title" => preg_replace("/\s[(\d)*]+\z/", null,  trim($project[1])),
                "href" => $this->baseUrl . $project[2]
            ];
        }

        return $projects;
    }

    /**
     * Get Project information.
     *
     * @param array $projects
     * @return array
     */
    private function getProjectInformation(array $projects)
    {
        foreach ($projects as &$project) {
            $uri = $project['href'];

            $response = $this->client->get($uri, [
                'cookies' => $this->cookies
            ]);

            $html = $response->getBody()->getContents();

            $crawler = new Crawler($html);
            $content = $crawler->filter('#summary p:last-child')->text();

            $project['content'] = strlen($content) > 10 ? trim($content) : null;
        }

        return $projects;
    }

    /**
     * Save content in json format.
     *
     * @param $filename
     * @param $content
     */
    private function save($filename, $content)
    {
        $options = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT;

        file_put_contents($filename, json_encode($content, $options));
    }

    /**
     * Execute the console command.
     *
     * @param int $argc
     * @param array $argv
     */
    public function handle(int $argc, array $argv)
    {
        if ($argc == 4) {
            $username = $argv[1];
            $password = $argv[2];
            $filename = $argv[3];

            $this->createClient($this->baseUrl);

            $this->auth($username, $password);

            $projects = $this->getProjectList();
            $projects = $this->getProjectInformation($projects);

            $this->save($filename, $projects);

        } else {
            echo $this->signature;
        }
    }
}

$command = new ProjectScraperCommand();

$command->handle($argc, $argv);