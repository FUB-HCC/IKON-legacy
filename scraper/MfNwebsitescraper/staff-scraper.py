from staff import Staff
from bs4 import BeautifulSoup
import requests
import re
import json
import sys
import csv
from multiprocessing import Pool


def worker(sublist):
    print(sublist)
    #for link in sublist:
    print(base_url + sublist)
    workerHtmlTree = BeautifulSoup(requests.get(base_url + sublist).text, "lxml")
    staff = Staff(*Staff.populateObjectFromHTML(workerHtmlTree), base_url+sublist)
    #print(staff.toJSON().decode('utf8'))
    return staff
    


if __name__ == '__main__':
    base_url = "https://www.naturkundemuseum.berlin"
    requests.encoding = "utf-8"
    # get number of parallel jobs
    if len(sys.argv) > 1 and sys.argv[1].isnumeric():
        workers = sys.argv[1]
    else:
        workers = 100

    htmlTree = BeautifulSoup(requests.get(base_url+"/de/einblicke/mitarbeiter").text, 'lxml')

    # get all the staff and their corresponding profile link
    workerList = htmlTree.find("div" , class_="panel-pane pane-views-panes pane-mitarbeiter-kontakt-panel-pane-3"  ).find_all("a", href=re.compile("/(.*)"))
    # delete "/de" prefixes and clean list from duplicates via conversion to a set
    workerSet = {(link.get("href")[3:] if link.get("href").startswith("/de") else link.get("href")) for link in workerList}
    stafflist = []
    with Pool(workers) as p:
        stafflist = p.map(worker, workerSet)

    # determine the output format and print in the corresponding format to a file
    if len(sys.argv) > 2 and sys.argv[1] == "-csv":
        with open("staff.csv", "w+", newline = "\n") as csvout:
            writer = csv.writer(csvout, delimiter = ';', quotechar='|', quoting=csv.QUOTE_MINIMAL)
            writer.writerow(["Name", "E-Mail", "Telefon", "Fax", "Adresse", "Foto", "URL", "Weitere Informationen"])
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
        outstring.extend("]".encode('utf8'))
        jsonout.write(outstring)

