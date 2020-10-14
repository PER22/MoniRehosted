from unittest import TestCase
from Model.Database import Database
from Model.Stock import Stock

class Database_Test(TestCase):
    database = Database()
    database.load()

    def test_load(self):
        self.assertEqual(True, True)

    def test_save(self):
        self.assertEqual(True, True)