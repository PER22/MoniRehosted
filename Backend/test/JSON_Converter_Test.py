from unittest import TestCase
from JSON_Converter import JSON_Converter
from Stock import Stock

class JSON_Converter_Test(TestCase):

    def test_convert_stock_to_json(self):
        stock = self.createDummyStock()

        returnedJSON = str(JSON_Converter.convertStockToJSON(stock))
        correctJSON = "{\"name\": \"Tesla\", \"label\": \"TSLA\", \"data\": [[\"date\", \"Open\", \"High\", \"Low\", \"Close\", \"Volume\"], [\"date\", \"Open\", \"High\", \"Low\", \"Close\", \"Volume\"], [\"date\", \"Open\", \"High\", \"Low\", \"Close\", \"Volume\"]]}"

        self.assertEqual(correctJSON, returnedJSON)

    def test_convert_stocks_to_json(self):

        stocks = []
        for i in range(3):
            stocks.append(self.createDummyStock())

        returnedJSON = str(JSON_Converter.convertStocksToJSON(stocks))
        correctJSON = "{\"name\": \"Tesla\", \"label\": \"TSLA\", \"data\": [[\"date\", \"Open\", \"High\", \"Low\", \"Close\", \"Volume\"], [\"date\", \"Open\", \"High\", \"Low\", \"Close\", \"Volume\"], [\"date\", \"Open\", \"High\", \"Low\", \"Close\", \"Volume\"]]}, {\"name\": \"Tesla\", \"label\": \"TSLA\", \"data\": [[\"date\", \"Open\", \"High\", \"Low\", \"Close\", \"Volume\"], [\"date\", \"Open\", \"High\", \"Low\", \"Close\", \"Volume\"], [\"date\", \"Open\", \"High\", \"Low\", \"Close\", \"Volume\"]]}, {\"name\": \"Tesla\", \"label\": \"TSLA\", \"data\": [[\"date\", \"Open\", \"High\", \"Low\", \"Close\", \"Volume\"], [\"date\", \"Open\", \"High\", \"Low\", \"Close\", \"Volume\"], [\"date\", \"Open\", \"High\", \"Low\", \"Close\", \"Volume\"]]}"
        print(returnedJSON)

        self.assertEqual(correctJSON, returnedJSON)

    def test_buildJSON(self):

        stock = self.createDummyStock()

        returnedJSON = str(JSON_Converter.buildJSON("Server", "ReturnStockData", "stock", "Tesla", JSON_Converter.convertStockToJSON(stock)))
        correctJSON = "{\"requester\": \"Server\", \"operation\": \"ReturnStockData\", \"stock\": \"Tesla\", \"data\": {\"name\": \"Tesla\", \"label\": \"TSLA\", \"data\": [[\"date\", \"Open\", \"High\", \"Low\", \"Close\", \"Volume\"], [\"date\", \"Open\", \"High\", \"Low\", \"Close\", \"Volume\"], [\"date\", \"Open\", \"High\", \"Low\", \"Close\", \"Volume\"]]}}"
        print(returnedJSON)
        self.assertEqual(correctJSON, returnedJSON)

    def test_convert_list_to_json(self):

        correctJSON = "[[\"Tesla\", \"TSLA\", \"41\"], [\"Tesla\", \"TSLA\", \"41\"], [\"Tesla\", \"TSLA\", \"41\"], [\"Tesla\", \"TSLA\", \"41\"]]"
        returnedJSON = str(JSON_Converter.convertListToJSON(list(self.createDummyLabels())))
        self.assertEqual(correctJSON, returnedJSON)


    #-=-=-=- Helper Function -=-=-=-=-=-
    def createDummyLabels(self):

        labels = [["Tesla", "TSLA", "41"],
                  ["Tesla", "TSLA", "41"],
                  ["Tesla", "TSLA", "41"],
                  ["Tesla", "TSLA", "41"]]

        return(labels)


    def createDummyStock(self) -> Stock:
        return(Stock("Tesla", "TSLA", [["date","Open","High","Low","Close", "Volume"],
                                       ["date","Open","High","Low","Close", "Volume"],
                                       ["date","Open","High","Low","Close", "Volume"]]))
