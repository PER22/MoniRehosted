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

        return json.dumps(stock)#return stock.__dict__

    @staticmethod
    def convertListToJSON(stock):

        return json.dumps(stock)

    @staticmethod
    def convertStocksToJSON(stocks):

        json = ""
        for stock in stocks:
            json = json + JSON_Converter.convertStockToJSON(stock) + ", "


        return(json[:-2])





    @staticmethod
    def buildJSON(requester, operation, thirdField, thirdFieldData, data):
        json = {'requester': str(requester),
                'operation': str(operation) ,
                str(thirdField): str(thirdFieldData),
                'data': str(data)}

        return(json)


    @staticmethod
    def customtDecoder(dict):
        return namedtuple('X', dict.keys())(*dict.values())