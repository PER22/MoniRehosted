import json
from collections import namedtuple
from json import JSONEncoder
from Stock import Stock

class JSON_Converter:

    def __init__(self):
        print("eyy")

    @staticmethod
    def convertStockToJSON(stock):
        if not isinstance(stock, Stock):
            return super(JSON_Converter).default(stock)

        return stock.__dict__

    @staticmethod
    def convertStocksToJSON(stocks):

        for stock in stocks:
            print("EUU")

        return("")

    @staticmethod
    def customtDecoder(dict):
        return namedtuple('X', dict.keys())(*dict.values())