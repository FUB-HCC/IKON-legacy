import json
import re
import functools
from nameparser import HumanName
from nameparser.config import Constants
from bs4 import BeautifulSoup
import requests
from itertools import groupby

def parseInformation(subtree, name, mode):
    # just get the text
    if mode == 'text':
        return subtree.find('div', class_=name).get_text()
    # parse text by line breaks and <p> and <li> elements
    for p in subtree.find('div', class_=name).find_all(['p', 'li']):
        for br in p.find_all('br'):
            br.replace_with("/////")
    tempList = [p.text.split("/////") for p in subtree.find('div', class_=name).find_all(['p', 'li'])]
    #flatten list and remove elements without any text and inline css classes, which are sometimes scraped and start with \n
    return [val.strip() for sublist in tempList for val in sublist if any(c.isalpha() for c in val) and val[0] != "\n"]


def normalizeTitel(titel):
        if titel in ["Publikationen(Auswahl)", "Publikationen (Auswahl)", "Publications (Selection)", "Publikationen (Auswahl)", "Publikationen", "Publications", "Publications (selection)" ]:
            return "Publikationen"
        elif titel in ["Aufgabengebiet\n", "Aufgaben", "Tasks", "Aufgabengebiete"]:
            return "Aufgaben"
        elif titel in ["Research", "Forschung", "Forschungsinteressen", "Forschung", "Forschungsschwerpunkt"]:
            return "Forschung"
        elif titel in ["Forschungsprojekte", "Projekte"]:
            return "Forschungsprojekte"
        else:
            return titel

class Staff(object):
    def __init__(self, name, email, telefon, fax, address, photo, skills, url):
        self.name = name
        self.email = email
        self.telefon = telefon
        self.fax = fax
        self.address = address
        self.photo = photo
        self.skills = skills
        self.url = url

    def toJSON(self):
        return json.dumps(self.__dict__, indent=4, sort_keys=True, ensure_ascii=False).encode('utf8')

    def toCSV(self):
        return 

    def populateObjectFromHTML(tree):
        proplist = []
        base_url = "https://www.naturkundemuseum.berlin"
        # scrapes the contact info section
        arguments = ['Name','Email', 'Telefon', 'Fax', 'Adresse']
        for info in arguments:
            try:
                proplist.append(tree.find('div', class_=("views-field views-field-"+info)).find('span', class_="field-content").get_text().replace("\r\n", ","))
            except AttributeError:
                proplist.append(None)

        #scrapes the photo URI
        proplist.append(base_url + tree.find('div', class_="views-field views-field-img-URL").span.img.get('src'))

        #scrapes the accordion
        accordion = {}
        # get all accordion entries
        for element in tree.find_all('div', class_="ui styled accordion"):
            titel = normalizeTitel(re.sub(r"[^\w .()]", "", element.find('div', class_="ac_title_text").get_text()).strip())
            # get all publications and parse them by <br/>'s
            if titel == "Publikationen":
                accordion[titel] = parseInformation(element, "content", 'list')
            # search in the "Forschung" entry for an "Forschungsprojekte" entry to extract it
            elif titel == "Forschung":
                templist = [re.sub(r"[^\w .()-:/]", "",li.text.strip()) for li in element.find('div', class_="content").find_all(['li', 'p'])]
                secondtemplist = [list(group) for k, group in groupby(templist, lambda x: re.match(r"((.{0,15}Forschungsprojekt.*)|(.{0,15}Projekt.*))", x)) if not k]
                if len(secondtemplist) > 1:
                    if 'Forschungsprojekte' in accordion:
                        accordion['Forschungsprojekte'] += secondtemplist.pop(1)
                    else:
                        accordion['Forschungsprojekte'] = secondtemplist.pop(1)
                if len(secondtemplist) > 0:
                    accordion[titel] = [element for sublist in secondtemplist for element in sublist if element is not ""]
            # if nothing matches just get the text of the element
            else:
                if titel in accordion:
                    accordion[titel] += [re.sub(r"[^\w .()-:/]", "",li.text.strip()) for li in element.find('div', class_="content").find_all(['li', 'p'])]
                else:
                    accordion[titel] = [re.sub(r"[^\w .()-:/]", "",li.text.strip()) for li in element.find('div', class_="content").find_all(['li', 'p'])]
        proplist.append(accordion)

        #try to find additional informations
        try:
            for link in tree.find('div', class_="view-display-id-single_person_sidebar_view").findAll('a', href=True):
                print(link.text)
                titel = normalizeTitel(link.text.strip())
                if titel == 'Lebenslauf':
                    print("CV Gefunden")
                    infoTree = BeautifulSoup(requests.get(base_url+link.get('href')).text, 'lxml')
                    proplist[6]['CV'] = parseInformation(infoTree, "faqfield-answer", 'text')
                elif titel == 'Publikationen':
                    print("Publikation Gefunden")
                    infoTree = BeautifulSoup(requests.get(base_url+link.get('href')).text, 'lxml')
                    if titel in proplist[6]:
                        proplist[6][titel] += parseInformation(infoTree, "faqfield-answer", 'list')
                    else:
                        proplist[6][titel] = parseInformation(infoTree, "faqfield-answer", 'list')
                else:
                    print("Etwas anderes Gefunden")
                    infoTree = BeautifulSoup(requests.get(base_url+link.get('href')).text, 'lxml')
                    if titel in proplist[6]:
                        proplist[6][titel] += parseInformation(infoTree, "faqfield-answer", 'text')
                    else:
                        proplist[6][titel] = parseInformation(infoTree, "faqfield-answer", 'text')
        except AttributeError:
            print('No additional information was found')


        # set up the name parser
        constants = Constants()
        constants.titles.add('PD', 'Dipl.', 'des.', 'Professor', 'M.Sc.', 'FH')
        # parse the name and normalize weird writing styles for "Ph.D."
        proplist[0] = HumanName(re.sub(r"Ph\. D\.", "Ph.D." ,proplist[0]), constants=constants).as_dict()
        return proplist



