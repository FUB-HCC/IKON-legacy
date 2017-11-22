#!/usr/bin/env python

import requests, json, sys
import urllib

url = "http://model.dbpedia-spotlight.org/en/annotate"

# sample:
# http://model.dbpedia-spotlight.org/en/annotate?text=First+documented+in+the+13th+century%2C+Berlin+was+the+capital+of+the+Kingdom+of+Prussia+(1701%E2%80%931918)%2C+the+German+Empire+(1871%E2%80%931918)%2C+the+Weimar+Republic+(1919%E2%80%9333)+and+the+Third+Reich+(1933%E2%80%9345).+Berlin+in+the+1920s+was+the+third+largest+municipality+in+the+world.+After+World+War+II%2C+the+city+became+divided+into+East+Berlin+--+the+capital+of+East+Germany+--+and+West+Berlin%2C+a+West+German+exclave+surrounded+by+the+Berlin+Wall+from+1961%E2%80%9389.+Following+German+reunification+in+1990%2C+the+city+regained+its+status+as+the+capital+of+Germany%2C+hosting+147+foreign+embassies.&confidence=0.5&support=0&spotter=Default&disambiguator=Default&policy=whitelist&types=&sparql=

headers = {'Accept': 'application/json'}

confidence = "0.35"

text = "President Obama called Wednesday on Congress to extend a tax break for students included in last year's economic stimulus package, arguing that the policy provides more generous assistance."

req_url = "%s?text=%s&confidence=%s&support=0&spotter=Default&disambiguator=Default&policy=whitelist&types=&sparql=" % (url, urllib.quote_plus(text), confidence)

print req_url

r = requests.post(req_url, headers=headers)

print r
