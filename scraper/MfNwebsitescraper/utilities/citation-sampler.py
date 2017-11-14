import json
import random

with open('staff.json') as json_data:
    d = json.load(json_data)

#print(d[0]["photo"])

firstlist = [element.get('skills').get('Publikationen') for element in d if element.get('skills').get('Publikationen') is not None]
#print(firstlist)
secondlist = [item for sublist in firstlist for item in sublist]
sample = random.sample(secondlist, 30)
for element in sample:
    print(element + '\n')

