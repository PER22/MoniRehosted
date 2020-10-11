from Stock import Stock

class StockTypes:
    ETFs = []
    Stocks = []

    def __init__(self, new_Stocks, new_ETFs):
        ETFs = new_Stocks
        Stocks = new_ETFs

    def get(self, type, label):
        print("Type: " + str(type) + " | Label: " + str(label))
        return(self.createDummyStock())

    def getLabels(self, type, amount):
        print("Type: " + str(type) + " | Amount: " + str(amount))
        return(self.createDummyLabels())


    #-=-=-=- Helper Function -=-=-=-=-=-
    def createDummyStock(self):
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



