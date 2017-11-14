from itemclass import Item
from bs4 import BeautifulSoup
import requests
import re
import json
import sys
import csv
from multiprocessing import Pool


def worker(element):
    print(element)
    workerHtmlTree = BeautifulSoup(requests.get(element).text, "lxml")
    return Item(**Item.populateObjectFromHTML(workerHtmlTree, element))


def getLinks(collection):
    print('Worker started to scrape ' + collection )
    linktree = BeautifulSoup(requests.get(collection).text, 'lxml')
    print('Worker finished to scrape ' + collection )
    return [link['href'] for link in linktree('a')]


def getAllLinks():
    links = []
    with open('collections.txt', 'r') as collectionset:
        numlines = sum(1 for line in collectionset if line.strip())
        collectionset.seek(0,0)
        with Pool(numlines) as p:
            links = p.map(getLinks, collectionset)
    return {links for sublist in links for links in sublist}


if __name__ == '__main__':
    requests.encoding = "utf-8"
    itemlist = []
    with Pool(100) as p:
	# must add .html ending, otherwise you get redirected to the .rdf file of the resource which is normally uncomplete and doesn't have links to pictures
        itemlist = p.map(worker, {elem + '.html' for elem in getAllLinks()})

    
    # determine the output format and print in the corresponding format to a file
    with open('item.json' , 'wb+') as jsonout:
        outstring = bytearray();
        outstring .extend("[".encode('utf8'))
        first = True
        for item in itemlist:
            if first:
                first = False
            else:
                outstring .extend(",".encode('utf8'))
            outstring.extend(item.toJSON())
        outstring.extend("]".encode('utf8'))
        jsonout.write(outstring)
