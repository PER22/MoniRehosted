from unittest import TestCase
from JSON_Converter import JSON_Converter
from Stock import Stock

class JSON_Converter_Test(TestCase):

    def test_convert_stock_to_json(self):
        stock = self.createDummyStock()

        returnedJSON = str(JSON_Converter.convertStockToJSON(stock))
        correctJSON = "{'name': 'Tesla', 'label': 'TSLA', 'data': [['date', 'Open', 'High', 'Low', 'Close', 'Volume'], ['date', 'Open', 'High', 'Low', 'Close', 'Volume'], ['date', 'Open', 'High', 'Low', 'Close', 'Volume']]}"

        self.assertTrue(returnedJSON, correctJSON)

    def test_convert_stocks_to_json(self):

        stocks = []
        for i in range(3):
            stocks.append(self.createDummyStock())

        returnedJSON = str(JSON_Converter.convertStocksToJSON(stocks))
        correctJSON = "{'name': 'Tesla', 'label': 'TSLA', 'data': [['date', 'Open', 'High', 'Low', 'Close', 'Volume'], ['date', 'Open', 'High', 'Low', 'Close', 'Volume'], ['date', 'Open', 'High', 'Low', 'Close', 'Volume']]}, {'name': 'Tesla', 'label': 'TSLA', 'data': [['date', 'Open', 'High', 'Low', 'Close', 'Volume'], ['date', 'Open', 'High', 'Low', 'Close', 'Volume'], ['date', 'Open', 'High', 'Low', 'Close', 'Volume']]}, {'name': 'Tesla', 'label': 'TSLA', 'data': [['date', 'Open', 'High', 'Low', 'Close', 'Volume'], ['date', 'Open', 'High', 'Low', 'Close', 'Volume'], ['date', 'Open', 'High', 'Low', 'Close', 'Volume']]}"
        print(returnedJSON)

        self.assertTrue(returnedJSON, correctJSON)



    #-=-=-=- Helper Function -=-=-=-=-=-
    def createDummyStock(self) -> Stock:
        return(Stock("Tesla", "TSLA", [["date","Open","High","Low","Close", "Volume"],
                                       ["date","Open","High","Low","Close", "Volume"],
                                       ["date","Open","High","Low","Close", "Volume"]]))