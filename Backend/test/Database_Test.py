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
        etf =  self.database.getChunked("etf", "aadr")
        print(etf[0].toJSON())

        self.assertEqual(len(etf), 20)

    def test_get_Stock_A(self):
        stock = self.database.getChunked("stock", "a")

        self.assertEqual(len(stock), 44)

    def test_get_Stock_ABIO(self):
        stock = self.database.getChunked("stock", "abio")

        self.assertEqual(len(stock), 33)

    def test_get_Stock_name(self):
        stock = self.database.getChunked("stock", "a")

        self.assertEqual(str(stock[0].name), "Agilent Technologies, Inc.")

    def test_get_Etf_labels_length(self):
        feedback =self.database.getLabels('etf','a')
        print(len(feedback))
        print(len(feedback[0]))
        print(feedback)
        self.assertEqual(len(self.database.getLabels("etf", "a")), 1)

    def test_get_Etf_labels_index_length(self):
        self.assertEqual(len(self.database.getLabels("etf", "a")), 1)

    def test_getStockName(self):
        stock = str(self.database.get_symbol("TSLA"))
        self.assertEqual(stock, "Tesla, Inc.")

    def test_getStockName(self):
        stock = str(self.database.get_symbol("TSLA"))
        self.assertEqual(stock, "Tesla, Inc.")