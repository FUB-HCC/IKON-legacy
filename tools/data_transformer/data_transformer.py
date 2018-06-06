import csv
import json

def getCSVData(filename):
    with open(filename, newline='') as csvfile:
        return [{k: v for k, v in x.items() if k} for x in csv.DictReader(csvfile)]

def loadDatabase(filename):
    with open(filename, newline='') as csvfile:
        reader = csv.DictReader(csvfile, dialect='excel', delimiter=';')
        database = [{
            'Fach ID':row['Fach ID'],
            'Fach':row['Fach'],
            'Fachkollegium ID':row['Fachkollegium'].split(' ', 1)[0],
            'Fachkollegium': row['Fachkollegium'].split(' ', 1)[1],
            'Fachgebiet ID': row['Fachgebiet'].split(' ', 1)[0],
            'Fachgebiet': row['Fachgebiet'].split(' ', 1)[1],
            'Wissenschaftsbereich ID': row['Wissenschaftsbereich'].split(' ', 1)[0],
            'Wissenschaftsbereich': row['Wissenschaftsbereich'].split(' ', 1)[1]
        } for row in reader]
        return database

def findInDatabase(database, name):
    for row in database:
        if name in row.values():
            return (row['Wissenschaftsbereich'], row['Fachgebiet'])
    return ('','')


def convertToJson(database, index=None, project_id=None, institution_id=None, relation_type=None, title=None, project_abstract=None, dfg_verfahren=None, funding_start_year=None, funding_end_year=None, parent_project_id=None, participating_subject_areas_full_string=None, description=None, subject_area=None, international_connections=None):
    return {
        'antragsteller': 'Anonym',
        'end': funding_end_year,
        'forschungsbereich': findInDatabase(database, subject_area)[0],
        'geldgeber': 'DFG',
        'hauptthema': findInDatabase(database, subject_area)[1],
        'id': project_id,
        'kooperationspartner': '',
        'nebenthemen': [elem.strip() for elem in participating_subject_areas_full_string.split(',') if elem.strip()],
        'projektleiter': 'Anonym',
        'start': funding_start_year,
        'titel': title,
        'beschreibung': project_abstract,
        'href': '',
        'forschungsregion': [elem.strip() for elem in international_connections.split(';') if elem.strip()],
        'synergie': '1'
    }

def saveJson(filename, list):
    with open(filename, 'w+') as outfile:
        outfile.write(json.JSONEncoder().encode(list))


database = loadDatabase('database.csv')
saveJson('projects.json', {x['project_id'] : convertToJson(database, **x) for x in getCSVData('MfN_project_detail_04.06.csv')})