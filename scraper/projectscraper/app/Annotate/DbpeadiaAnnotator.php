<?php

namespace App\Annotate;

use GuzzleHttp\Client;
use GuzzleHttp\Promise\EachPromise;
use Psr\Http\Message\ResponseInterface;

class DbpeadiaAnnotator extends Annotator
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
     * @var bool
     */
    private $unique;

    /**
     * @var int
     */
    private $support;

    /**
     * @var float
     */
    private $timeout;

    /**
     * @var float
     */
    private $confidence;

    /**
     * @var string
     */
    private $baseUrl = 'http://model.dbpedia-spotlight.org/';

    /**
     * Instantiates a new DbpeadiaAnnotator.
     *
     * Sets options and instantiates a new Guzzle Client.
     *
     * @link http://docs.guzzlephp.org/en/stable/
     *
     * @param array $options
     */
    public function __construct(array $options = [])
    {
        $this->debug = isset($options['debug']) ? $options['debug'] : false;
        $this->unique = isset($options['unique']) ? $options['unique'] : true;
        $this->timeout = isset($options['timeout']) ? $options['timeout'] : 60;
        $this->support = isset($options['support']) ? $options['support'] : 20;
        $this->confidence = isset($options['confidence']) ? $options['confidence'] : 0.5;

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
     * @param string $language Language of the text (ISO 639-1)
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
            'fulfilled' => function ($entity) use (&$entities) {
                $entities[] = $entity;
            },
        ]))->promise()->wait();

        $entities = array_collapse($entities);

        return $entities;
    }

    /**
     * Makes async request to the base url and returns a generator object.
     *
     * @link http://www.php.net/manual/en/class.generator.php
     *
     * @param array $texts Texts to annotate
     * @param string $language Language of the text (ISO 639-1)
     * @return \Generator
     */
    private function getEntities(array $texts, string $language)
    {
        $uri = $language . '/annotate';

        $options = [
            'headers' => [
                'Accept' => 'application/json'
            ],
            'query' => [
                'support' => $this->support,
                'confidence' => $this->confidence
            ]
        ];

        foreach ($texts as $text) {
            $options['query']['text'] = $text;

            yield $this->client->getAsync($uri, $options)
                ->then(function (ResponseInterface $response) {
                    $entities = [];
                    $array = json_decode($response->getBody(), true);

                    if (array_key_exists('Resources', $array)) {
                        foreach ($array['Resources'] as $item) {
                            $entity = [
                                'title' => $item['@surfaceForm'],
                                'href' => $item['@URI']
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
