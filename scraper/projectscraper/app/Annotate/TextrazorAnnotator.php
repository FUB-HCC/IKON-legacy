<?php

namespace App\Annotate;

use GuzzleHttp\Client;
use GuzzleHttp\Promise\EachPromise;
use Psr\Http\Message\ResponseInterface;

class TextrazorAnnotator extends Annotator
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
     * @var float
     */
    private $timeout;

    /**
     * @var string
     */
    private $baseUrl = 'https://api.textrazor.com/';

    /**
     * Instantiates a new TextrazorAnnotator.
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

        $this->debug = isset($options['debug']) ? $options['debug'] : true;
        $this->unique = isset($options['unique']) ? $options['unique'] : false;
        $this->timeout = isset($options['timeout']) ? $options['timeout'] : 60;

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
     * @param string $language Language of the text (ISO 639-2)
     * @return array Array of entities
     */
    public function entities($text, string $language = 'ger')
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
     * @param string $language Language of the text (ISO 639-2)
     * @return \Generator
     */
    private function getEntities(array $text, string $language)
    {
        $options = ['headers' => [
            'x-textrazor-key' => $this->token
        ]];

        foreach ($text as $str) {
            $options['form_params'] = [
                'extractors' => 'entities',
                'languageOverride' => $language,
                'text' => $str
            ];

            yield $this->client->postAsync(null, $options)
                ->then(function (ResponseInterface $response) {
                    $entities = [];
                    $array = json_decode($response->getBody(), true);

                    if (array_key_exists('entities', $array['response'])) {
                        foreach ($array['response']['entities'] as $item) {
                            if($item['wikiLink']){
                                $entity = [
                                    'title' => $item['entityId'],
                                    'href' => $item['wikiLink']
                                ];

                                $entities[] = $entity;
                            }
                        }

                        return $entities;
                    }

                    return null;
                });
        }
    }
}
