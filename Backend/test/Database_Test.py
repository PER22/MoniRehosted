from unittest import TestCase
from Backend.src.Model.Database import Database
from Backend.src.Model.Stock import Stock

class Database_Test(TestCase):
    def setUp(self):
        self.database = Database("ETFs1", "Stocks1")
        self.database.load()

    def test_load(self):
        self.database.load()
        self.assertEqual(True, True)

    def test_get_ETF(self):
        etf =  self.database.get("etf", "aadr")
        print(etf[0].toJSON())

        self.assertEqual(len(etf), 20)

    def test_get_Stock(self):
        stock = self.database.get("stock", "a")

        self.assertEqual(len(stock), 44)

    def test_get_Stock_name(self):
        stock = self.database.get("stock", "a")

        self.assertEqual(str(stock[0].name), "Agilent Technologies, Inc.")

    def test_get_Stock_labels(self):
        self.assertEqual(self.database.getLabels("etf", "a"), self.database.createDummyLabels())

    def test_getStockName(self):
        stock = str(self.database.get_symbol("TSLA"))
        self.assertEqual(stock, "Tesla, Inc.")