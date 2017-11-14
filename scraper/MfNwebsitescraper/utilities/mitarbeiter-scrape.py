from staff import Staff
from bs4 import BeautifulSoup
import requests
import re
import json
import sys
import csv


# offene Fragen: Wie soll die Liste von Fähigkeiten von https://www.naturkundemuseum.berlin/de/einblicke/mitarbeiter/katrin.vohland bearbeitet werden?

base_url = "https://www.naturkundemuseum.berlin"
requests.encoding = "utf-8"

htmlTree = BeautifulSoup(requests.get(base_url+"/de/einblicke/mitarbeiter").text, 'lxml')

# get all the staff and their corresponding profile link
workerList = htmlTree.find("div" , class_="panel-pane pane-views-panes pane-mitarbeiter-kontakt-panel-pane-3"  ).find_all("a", href=re.compile("/(.*)"))
# delete "/de" prefixes and clean list from duplicates via conversion to a set
workerSet = {(link.get("href")[3:] if link.get("href").startswith("/de") else link.get("href")) for link in workerList}
stafflist = []
for link in workerSet:
    workerHtmlTree = BeautifulSoup(requests.get(base_url + link).text, "lxml") 
    staff = Staff(*Staff.populateObjectFromHTML(workerHtmlTree), base_url+link)
    print(staff.toJSON().decode('utf8'))
    stafflist.append(staff)

# determine the output format and print in the corresponding format to a file
if sys.argv[1   ] == "-csv":
    print("CSV")
    with open("staff.csv", "w+", newline = "\n") as csvout:
        writer = csv.writer(csvout, delimiter = ';', quotechar='|', quoting=csv.QUOTE_MINIMAL)
        writer.writerow(["Name", "E-Mail", "Telefon", "Fax", "Adresse", "Foto", "URL", "Nähere Informationen"])
        for person in stafflist:
             writer.writerow([person.name, person.email, person.telefon, person.fax, person.address, person.photo, person.url, person.skills])
    exit()

with open('staff.json' , 'wb+') as jsonout:
    outstring = bytearray();
    outstring .extend("[".encode('utf8'))
    first = True
    for staff in stafflist:
        if first:
            first = False
        else:
            outstring .extend(",".encode('utf8'))
        outstring.extend(staff.toJSON())
    outstring .extend("]".encode('utf8'))
    jsonout.write(outstring)
    
