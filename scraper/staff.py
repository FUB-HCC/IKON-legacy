import json
import re

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
        self.name = name.lstrip()
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
            titel = normalizeTitel(element.find('div', class_="ac_title_text").get_text().strip("\t\n ").replace("\t", "").replace("\r\n", "").lstrip("\t\r\n"))
            # get the content of a list in a accordion
            if "ul" in [elem.name for elem in element.find('div', class_="content").children]:
                print("Liste gefunden")
                accordion[titel] = [li.text.strip() for li in element.find('div', class_="content").find_all('li')]
            # get all publications and parse them by <br/>'s
            elif titel == "Publikationen" :
                print("Publikationen gefunden")
                for p in element.find('div', class_="content").find_all('p'):
                    for br in p.find_all("br"):
                        br.replace_with("/////")
                tempList = [p.text.split("/////") for p in element.find('div', class_="content").find_all('p')]
                accordion[titel] = [val for sublist in tempList for val in sublist if any(c.isalpha() for c in val)]
            # if nothing matches just get the text of the element
            else:
                accordion[titel] = [element.find('div', class_="content").get_text().strip("\t\n ")]
        list.append(accordion)
        return list



