import json
import requests
import urllib
import html


with open('staff.json' , 'r') as jsonin:
    file = json.load(jsonin)
    newfile = []
    xmlfile = '<biblList>'
    for person in file:
        newperson = {}
        newperson['Name'] = person['name']
        if 'skills' in person and 'Publikationen' in person['skills']:
            newperson['Publikationen'] = person['skills']['Publikationen'] 
            for citation in newperson['Publikationen']:
                r = requests.post('http://localhost:8080/processCitation', data=urllib.parse.urlencode({'citations':citation}), headers={'Content-Type':'application/x-www-form-urlencoded'})
                r.encoding = 'utf-8'
                xmlfile += r.text
                print(r.text)
        newfile.append(newperson)
    with open('person.json', 'wb+') as out:
        out.write(bytearray(json.dumps(html.unescape(newfile)).encode('utf-8')))
    with open('bibl.xml', 'wb+') as xmlout:
        xmlout.write(bytearray(html.unescape(xmlfile).encode('utf-8') + '</biblList>'.encode('utf-8')))

