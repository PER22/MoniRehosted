from unittest import TestCase
from JSON_Converter import JSON_Converter
from Stock import Stock

class JSON_Converter_Test(TestCase):

    def test_convert_stock_to_json(self):
        stock = self.createDummyStock()
        correctJSON = "{'name': 'Tesla', 'label': 'TSLA', 'data': [['date', 'Open', 'High', 'Low', 'Close', 'Volume'], ['date', 'Open', 'High', 'Low', 'Close', 'Volume'], ['date', 'Open', 'High', 'Low', 'Close', 'Volume']]}"
        returnedJSON = str(JSON_Converter.convertStockToJSON(stock))

        self.assertTrue(returnedJSON, correctJSON)

    def test_convert_stocks_to_json(self):
        self.fail()


    def createDummyStock(self) -> Stock:
        return(Stock("Tesla", "TSLA", [["date","Open","High","Low","Close", "Volume"],
                                       ["date","Open","High","Low","Close", "Volume"],
                                       ["date","Open","High","Low","Close", "Volume"]]))