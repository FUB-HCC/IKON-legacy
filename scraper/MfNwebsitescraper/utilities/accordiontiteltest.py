from staff import Staff
from bs4 import BeautifulSoup
import requests
import re
import json
import codecs

base_url = "https://www.naturkundemuseum.berlin"
requests.encoding = "utf-8"

htmlTree = BeautifulSoup(requests.get(base_url+"/de/einblicke/mitarbeiter").text, 'lxml')

# get all the staff and their corresponding profile link
workerList = htmlTree.find("div" , class_="panel-pane pane-views-panes pane-mitarbeiter-kontakt-panel-pane-3"  ).find_all("a", href=re.compile("/(.*)"))
# delete "/de" prefixes and clean list from duplicates via conversion to set
#TODO: make prefix deletion better, so that names are not affected
workerSet = {(link.get("href")[3:] if link.get("href").startswith("/de") else link.get("href")) for link in workerList}
titelSet = set()
stafflist = []
for link in workerSet:
    print(base_url+link)
    workerHtmlTree = BeautifulSoup(requests.get(base_url + link).text, "lxml") 
    for elem in workerHtmlTree.find_all('div', class_="ui styled accordion"):
        titelSet.add(elem.find('div', class_="ac_title_text").get_text().strip("\t\n ").replace("\t", "").replace("\r\n", ""))
    

{print(elem) for elem in titelSet}