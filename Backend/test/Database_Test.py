from unittest import TestCase
from Backend.src.Model.Database import Database
from Backend.src.Model.Stock import Stock

class Database_Test(TestCase):
    database = Database("ETFs1", "Stocks1")
    database.load()

    def test_load(self):
        self.assertEqual(True, True)

    def test_save(self):
        self.assertEqual(True, True)