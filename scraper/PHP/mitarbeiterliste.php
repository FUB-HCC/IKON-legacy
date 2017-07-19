<?php

/*
 * USAGE: php mitarbeiter.php > mitarbeiter-liste.json
 *
 */


define('URLPREFIX', 'https://www.naturkundemuseum.berlin');

define('MITARBEITERLISTE', URLPREFIX . "/einblicke/mitarbeiter");


require "vendor/autoload.php";

use Goutte\Client;


$mitarbeiter = [];

$client = new Client();

$crawler = $client->request('GET', MITARBEITERLISTE);

$crawler->filter('.view-content .ui.grid a')
        ->reduce(function (Symfony\Component\DomCrawler\Crawler $node, $i) {
            // only return non-empty nodes
            return strlen($node->text()) > 2;
        })
        ->each(function ($node) {
            // var_dump($node->text());

            global $mitarbeiter;

            $json = [
                'name' => $node->text(),
                'href' => URLPREFIX . $node->attr('href'),
            ];

            array_push($mitarbeiter, $json);
        });


// var_dump($mitarbeiter);

// print json_encode($mitarbeiter);

foreach ($mitarbeiter as $emp) {
	print $emp['name'] . ', ' . $emp['href'] . PHP_EOL;
}

