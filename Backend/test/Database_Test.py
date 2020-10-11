from unittest import TestCase
from Database import Database
from Stock import Stock

class Database_Test(TestCase):
    database = Database([], [])

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
