<?php

namespace App\Annotate;

use GuzzleHttp\Client;
use GuzzleHttp\Promise\EachPromise;
use Psr\Http\Message\ResponseInterface;

class DandelionAnnotator extends Annotator
{
    /**
     * @var bool
     */
    private $debug;

    /**
     * @var string
     */
    private $token;

    /**
     * @var bool
     */
    private $unique;

    /**
     * @var Client
     */
    private $client;

    /**
     * @var string
     */
    private $version;

    /**
     * @var float
     */
    private $timeout;

    /**
     * @var float
     */
    private $confidence;

    /**
     * @var int
     */
    private $concurrency;

    /**
     * @var string
     */
    private $baseUrl = 'https://api.dandelion.eu/datatxt/nex/';

    /**
     * Instantiates a new DandelionAnnotator.
     *
     * Sets options and instantiates a new Guzzle Client.
     *
     * @link http://docs.guzzlephp.org/en/stable/
     *
     * @param string $token Dandelion api token
     * @param array $options
     */
    public function __construct($token, array $options = [])
    {
        $this->token = $token;

        $this->debug = isset($options['debug']) ? $options['debug'] : false;
        $this->unique = isset($options['unique']) ? $options['unique'] : true;
        $this->timeout = isset($options['timeout']) ? $options['timeout'] : 60;
        $this->version = isset($options['version']) ? $options['version'] : 'v1';
        $this->confidence = isset($options['confidence']) ? $options['confidence'] : 0.6;
        $this->concurrency = isset($options['concurrency']) ? $options['concurrency'] : 5;

        $options = [
            'debug' => $this->debug,
            'allow_redirects' => false,
            'timeout' => $this->timeout,
            'base_uri' => $this->baseUrl
        ];

        $this->client = new Client($options);
    }

    /**
     * Returns an array of entities.
     *
     * @param string|array $text Text to annotate
     * @param string $language Language of the text
     * @return array Array of entities
     */
    public function entities($text, string $language = 'de')
    {
        $entities = [];

        if (is_array($text)) {
            $promises = $this->getEntities($text, $language);
        } else {
            $promises = $this->getEntities([$text], $language);
        }

        (new EachPromise($promises, [
            'concurrency' => $this->concurrency,
            'fulfilled' => function ($entity) use (&$entities) {
                $entities[] = $entity;
            },
        ]))->promise()->wait();

        $entities = array_collapse($entities);

        if($this->unique) {
            $entities = array_unique($entities,SORT_REGULAR);
        }

        return $entities;
    }

    /**
     * Makes async request to the base url and returns a generator object.
     *
     * @link http://www.php.net/manual/en/class.generator.php
     *
     * @param array $text Text to annotate
     * @param string $language Language of the text
     * @return \Generator
     */
    private function getEntities(array $text, string $language)
     {
        $uri = $this->version;

        $options = ['query' => [
            'lang' => $language,
            'token' => $this->token,
            'min_confidence' => $this->confidence
        ]];

        foreach ($text as $str) {
            $options['query']['text'] = $str;

            yield $this->client->getAsync($uri, $options)
                ->then(function (ResponseInterface $response) {
                    $entities = [];
                    $array = json_decode($response->getBody(), true);

                    if (array_key_exists('annotations', $array)) {
                        foreach ($array['annotations'] as $item) {
                            $entity = [
                                'title' => $item['title'],
                                'href' => $item['uri']
                            ];

                            $entities[] = $entity;
                        }

                        return $entities;
                    }

                    return null;
                });
        }
    }
}
