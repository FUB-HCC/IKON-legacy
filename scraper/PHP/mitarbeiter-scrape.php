<?php

/*
 * USAGE: php mitarbeiter-scrape.php mitarbeiter.json
 *
 */


define('URLPREFIX', 'https://www.naturkundemuseum.berlin');


require "vendor/autoload.php";

use Goutte\Client;

$client = new Client();



if (count($argv) !== 2) {
    print "USAGE: " . $argv[0] . " mitarbeiterliste.json" . PHP_EOL;
    exit;
}

$json = json_decode(file_get_contents($argv[1]), true);
// var_dump($json);



foreach ($json as $key => $obj) {
    print "Fetching " . $obj['name'] . "...\n";

    $crawler = $client->request('GET', $obj['href']);

    $info = [
        'name'      => '.views-field-Name h1',
        'email'     => '.views-field-Email .field-content',
        'phone'     => '.views-field-Telefon .field-content a',
        'fax'       => 'div.views-field-Fax .field-content',
        'address'   => '.views-field-Adresse .field-content',
    ];

    foreach ($info as $varname => $selector) {

        try {
            $$varname = trim( $crawler->filter($selector)->text() );
        } catch (InvalidArgumentException $e) {
            print ' x ' . $varname . ': ' . strval($e);
            continue; // skip
        }

        print " - " . $$varname . "\n";

        $obj[$varname] = !empty($$varname) ? $$varname : '';

    }

    // image
    try {
        $image = trim( $crawler->filter('.views-field-img-URL .field-content img')->attr('src') );
        $obj['image'] = !empty($image) ? URLPREFIX . $image : '';
        print " - " . $obj['image'] . PHP_EOL;
    } catch (InvalidArgumentException $e) {
        print strval($e);
        continue; // skip
    }


    // go through the accordions

    $accordionEntries = $crawler->filter('.ui.styled.accordion')
        // ->reduce(function (Symfony\Component\DomCrawler\Crawler $node, $i) {
        //     return strlen($node->text()) > 2;
        // })
        ->each(function (Symfony\Component\DomCrawler\Crawler $node, $i) {

            $key = trim($node->filter('.ac_title_text')->text());
            $key = str_replace(array("\n", "\r", "  "), ' ', $key);

            $values = [];
            $valueSelection = $node->filter('.content');
            foreach ($valueSelection as $domElement) {
                if ($key === 'Publikationen (Auswahl)') {
                    // needs more filtering
                    // var_dump($domElement->childNodes);
                    // $publicationNodes = $domElement->filter('p.bodytext');
                    foreach ($domElement->childNodes as $p) {
                        $p = trim($p->nodeValue);
                        if ($p) {
                            array_push($values, $p);
                        }
                    }
                } else {
                    // just store text

                    // TODO: better collapse child nodes
                    // e.g. on https://www.naturkundemuseum.berlin/en/einblicke/mitarbeiter/oliver.coleman
                    // CuratorCrustacea and Protozoa

                    $v = trim($domElement->nodeValue);
                    // var_dump($domElement->nodeValue);
                    if ($v) {
                        array_push($values, $v);
                    }
                }
            }

            $ret = [
                'key' => $key,
                'values' => $values,
            ];

            return $ret;
        });

    foreach ($accordionEntries as $arr) {
        $obj[$arr['key']] = $arr['values'];
    }


    // save back to the json Mitarbeiterliste
    $json[$key] = $obj;


    //
    //break; // DEVELOPMENT: end at first person
    //

}



// TODO: memory
$outputfile = fopen("mitarbeiter-data.json", "w");
fwrite($outputfile, json_encode($json));
fclose($outputfile);

