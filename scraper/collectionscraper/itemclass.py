import json
import re
from bs4 import BeautifulSoup
import requests
import os

def download(url, folder, file_name):
    # open in binary mode
    basepath = '/media/tim/Seagate Expansion Drive/IKON/'+folder+'/'
    os.makedirs(os.path.dirname(basepath+file_name), exist_ok=True)
    with open(basepath+file_name, "wb") as file:
        # get request
        response = requests.get(url)
        # write to file
        file.write(response.content)


class Item(object):
    def __init__(self, metadata, pictures, url, objId):
        self.metadata = metadata
        self.pictures = pictures
        self.objId = objId
        self.url = url

    def toJSON(self):
        return json.dumps(self.__dict__, indent=4, sort_keys=True, ensure_ascii=False).encode('utf8')

    def toCSV(self):
        return 

    def populateObjectFromHTML(tree, url):
        param = {}
        param['pictures'] = []
        param['url'] = url
        print(url[::-1][4:])
        param['objId'] = url[::-1][5:url[::-1].find('/',0)-1][::-1].replace('/', '')


        # try to find a metadata box
        try:
            text = tree.find(id='metadataBox').get_text()
            print(text)
            metadata = {}
            if len(text.strip('\n').replace(" ", "").split('\n\n')) > 1:
                for data in [elem for elem in text.strip('\n').replace(" ", "").split('\n\n')[1].split(';') if elem]:
                    metadata[data.split(':')[0].strip()] = data.split(':', 1)[1].strip()
                param['metadata'] = metadata
            else:
                param['metadata'] = ''
        except AttributeError:
            print('No metadata box was found!')
            param['metadata'] = None

        #try to find the main image url
        try:
            url = tree.find(id='mainImage').find('a')['href']
            print(url)
            param['pictures'].append(url)
        except AttributeError:
            print('No main picture was found!')

        # try to find the additional image url
        try:
            for pic in tree.find(id='additionalImagesBox').find_all('a'):
                print(pic['href'])
                param['pictures'].append(pic['href'])
        except AttributeError:
                print('No additional picture was found!')

        for pic in param['pictures']:
            download(pic, param['objId'], pic[::-1][:url[::-1].find('/',0)-1][::-1])


        print(param)
        return param