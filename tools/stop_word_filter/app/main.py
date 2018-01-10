import sys
import json
import codecs
from nltk import word_tokenize
from nltk.corpus import stopwords


def main(argc: int, argv: list) -> None:
    filename = './../storage/projects.json'
    data = read(filename)
    for i, entry in enumerate(data):
        if data[i]['content'] is not None:
            data[i]['content'] = filter_stopwords(data[i]['content'])
    write(data, filename)


def filter_stopwords(string: str) -> str:
    stop = set((stopwords.words('german')))
    filtered_list = [i for i in word_tokenize(string.lower()) if i not in stop and i.isalpha()]
    return ' '.join(filtered_list)


def read(filename: str):
    with codecs.open(filename, 'r', 'utf-8') as file:
        data = json.load(file)
    return data


def write(data, filename: str):
    with codecs.open(filename, 'w', 'utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    main(len(sys.argv), sys.argv)
