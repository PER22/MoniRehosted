from unittest import TestCase
from StockTypes import StockTypes
from Stock import Stock

class StockTypes_Test(TestCase):
    database = StockTypes([], [])

    def test_get(self):
        self.fail()

    def test_get_stock_labels(self):
        self.fail()

    #-=-=-=- Helper Function -=-=-=-=-=-
    def createDummyStock(self) -> Stock:
        return(Stock("Tesla", "TSLA", [["date","Open","High","Low","Close", "Volume"],
                                       ["date","Open","High","Low","Close", "Volume"],
                                       ["date","Open","High","Low","Close", "Volume"]]))



    #-=-=-=- Helper Function -=-=-=-=-=-
    def createDummyLabels(self):

        labels = [["Tesla", "TSLA", "41"],
                  ["Tesla", "TSLA", "41"],
                  ["Tesla", "TSLA", "41"],
                  ["Tesla", "TSLA", "41"]]

        return(labels)
