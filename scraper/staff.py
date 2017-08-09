import json
import re
import functools
from nameparser import HumanName
from nameparser.config import Constants

def convertUmlauteToASCII(name):
    chars = {"ä":"ae", "ö":"oe", "ü":"ue", "ß":"ss"}
    return functools.reduce(lambda a, kv: a.replace(*kv), chars.items(), name)

def normalizeTitel(titel):
        if titel in ["Publikationen(Auswahl)", "Publications (Selection)", "Publikationen (Auswahl)", "Publikationen", "Publications", "Publications (selection)" ]:
            return "Publikationen"
        elif titel in ["Aufgabengebiet\n", "Aufgaben", "Tasks", "Aufgabengebiete"]:
            return "Aufgaben"
        elif titel in ["Forschungsprojekte", "Research", "Projekte", "Forschung", "Forschungsinteressen", "Forschung", "Forschungsschwerpunkt"]:
            return "Forschung"
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
        list = []
        # scrapes the contact info section
        arguments = ['Name','Email', 'Telefon', 'Fax', 'Adresse']
        for info in arguments:
            try:
                list.append(tree.find('div', class_=("views-field views-field-"+info)).find('span', class_="field-content").get_text().replace("\r\n", ","))
            except AttributeError:
                list.append(None)

        #scrapes the photo URI
        list.append("https://www.naturkundemuseum.berlin" + tree.find('div', class_="views-field views-field-img-URL").span.img.get('src'))

        #scrapes the accordion
        accordion = {}
        # get all accordion entries
        for element in tree.find_all('div', class_="ui styled accordion"):
            titel = normalizeTitel(re.sub(r"[^\w .()]", "", element.find('div', class_="ac_title_text").get_text()).strip())
            # get the content of a list in a accordion
            if "ul" in [elem.name for elem in element.find('div', class_="content").descendants]:
                #print("Liste gefunden")
                accordion[titel] = [re.sub(r"[^\w .()]", "",li.text.strip()) for li in element.find('div', class_="content").find_all('li')]
            # get all publications and parse them by <br/>'s
            elif titel == "Publikationen" :
                #print("Publikationen gefunden")
                for p in element.find('div', class_="content").find_all('p'):
                    for br in p.find_all("br"):
                        br.replace_with("/////")
                tempList = [p.text.split("/////") for p in element.find('div', class_="content").find_all('p')]
                #flatten list and remove elements without any text and inline css classes, which are sometimes scraped and start with \n
                accordion[titel] = [val.strip() for sublist in tempList for val in sublist if any(c.isalpha() for c in val) and val[0] != "\n"]
            # if nothing matches just get the text of the element
            else:
                accordion[titel] = [re.sub(r"[^\w .()]", "", element.find('div', class_="content").get_text().strip())]
        list.append(accordion)
        # extract the titel from the name and the url
        #print(convertUmlauteToASCII(list[0]).split(" "))
        #print(re.findall(r"(.+?)\.(.+?)@", list[1]))

        # set up the name parser
        constants = Constants()
        constants.titles.add('PD', 'Dipl.', 'des.', 'Professor', 'M.Sc.')
        # parse the name and normalize weird writing styles for "Ph.D."
        list[0] = HumanName(re.sub(r"Ph\. D\.", "Ph.D." ,list[0]), constants=constants).as_dict()
        return list



