<?php

namespace App\Annotate;

abstract class Annotator
{
    /**
     * Returns an array of entities.
     *
     * @param string|array $text Text to annotate
     * @param string $language Language of the text
     * @return array Array of entities
     */
    public abstract function entities($text, string $language);
}
