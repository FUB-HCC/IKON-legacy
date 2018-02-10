import json
import requests
import os


def download(url, folder, file_name):
    # open in binary mode
    basepath = '/media/tim/Seagate Expansion Drive/IKON/' + folder + '/'
    os.makedirs(os.path.dirname(basepath + file_name), exist_ok=True)
    with open(basepath + file_name, "wb") as file:
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
        param['objId'] = url[::-1][5:url[::-1].find('/', 0) - 1][::-1].replace('/', '')

        # try to find a metadata box
        try:
            text = tree.find(id='metadataBox').get_text()
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

        # try to find the main image url
        try:
            url = tree.find(id='mainImage').find('a')['href']
            param['pictures'].append(url)
        except AttributeError:
            print('No main picture was found!')

        # try to find the additional image url
        try:
            for pic in tree.find(id='additionalImagesBox').find_all('a'):
                param['pictures'].append(pic['href'])
        except AttributeError:
            print('No additional picture was found!')

        # deduplicate list and prefer tiff to every other picture format
        tiffList = {pic for pic in param['pictures'] if pic[-3:] in ['tif', 'TIF']}
        otherList = {pic for pic in param['pictures'] if pic[-3:] in ['jpg', 'JPG', 'dng', 'DNG']}
        rest = set(param['pictures']) - tiffList - otherList
        if rest:
            print('These images are not used because they are malformed:')
            print(rest)
        restList = []
        for pic in otherList:
            if not (pic[:len(pic) - 4] + '.tif' in tiffList or pic[:len(pic) - 4] + '.TIF' in tiffList):
                tiffList.add(pic)
            else:
                restList.append(pic)
        print(restList)
        param['pictures'] = {'usable': list(tiffList), 'rest': restList}


        for pic in param['pictures']:
            # download(pic, param['objId'], pic[::-1][:url[::-1].find('/',0)-1][::-1])
            pass

        return param
