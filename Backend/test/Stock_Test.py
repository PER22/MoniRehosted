from unittest import TestCase
from Backend.src.Model.Stock import Stock

class Stock_TestS(TestCase):
    name = "Tesla"
    label = "TSLA"
    dataShort = [{"Date": "2010-07-27", "Open": "24.477", "High": "24.517", "Low": "24.431", "Close": "24.517", "Volume": "8456", "OpenInt": "0"}]
    dataLong = [{"Date": "2010-07-27", "Open": "24.477", "High": "24.517", "Low": "24.431", "Close": "24.517", "Volume": "8456", "OpenInt": "0"},
            {"Date": "2010-07-28", "Open": "24.477", "High": "24.517", "Low": "24.431", "Close": "24.517", "Volume": "8456", "OpenInt": "0"}]

    correctJSONEmpty = {'data': [{'Close': '24.517', 'Date': '2010-07-27', 'High': '24.517', 'Low': '24.431', 'Open': '24.477',
                                'OpenInt': '0',
                                'Volume': '8456'},
                                {'Close': '24.517',
                                'Date': '2010-07-28',
                                'High': '24.517',
                                'Low': '24.431',
                                'Open': '24.477',
                                'OpenInt': '0',
                                'Volume': '8456'}],
                                'name': 'TSLA'}

    correctStringEmpty = "Name:  | Label:  | Data: []"
    correctStringShort = "Name: Tesla | Label: TSLA | Data: [{'Date': '2010-07-27', 'Open': '24.477', 'High': '24.517', 'Low': '24.431', 'Close': '24.517', 'Volume': '8456', 'OpenInt': '0'}]"
    correctStringLong = "Name: Tesla | Label: TSLA | Data: [{'Date': '2010-07-27', 'Open': '24.477', 'High': '24.517', 'Low': '24.431', 'Close': '24.517', 'Volume': '8456', 'OpenInt': '0'}, {'Date': '2010-07-28', 'Open': '24.477', 'High': '24.517', 'Low': '24.431', 'Close': '24.517', 'Volume': '8456', 'OpenInt': '0'}]"


    def test_constructor(self):
        stock = Stock(self.name, self.label, self.dataShort)

        self.assertEqual(stock.toString(), self.correctStringShort)

    def test_empty_constructor(self):
        stock = Stock()

        self.assertEqual(stock.toString(), self.correctStringEmpty)

    def test_set(self):
        stock = Stock()
        stock.name = self.name
        stock.label = self.label
        stock.data = self.dataShort

        self.assertEqual(stock.toString(), self.correctStringShort)

    def test_get(self):
        stock = Stock(self.name, self.label, self.dataShort)

        self.assertEqual(stock.name, self.name)
        self.assertEqual(stock.label, self.label)
        self.assertEqual(stock.data, self.dataShort)

    def test_to_string(self):
        stock = Stock(self.name, self.label, self.dataLong)

        self.assertEqual(stock.toString(), self.correctStringLong)

    def test_to_json(self):
        stock = Stock(self.name, self.label, self.dataLong)
        self.assertEqual(stock.toJSON(), self.correctJSONEmpty)
