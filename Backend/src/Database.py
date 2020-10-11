from Stock import Stock

class Database:
    ETFs = []
    Stocks = []

    def __init__(self, new_Stocks, new_ETFs):
        ETFs = new_Stocks
        Stocks = new_ETFs

    #assetType is either ETF or Stocks
    #label is 4 char shortcut of asset name
    def get(self, assetType, label):
        print("Type: " + str(assetType) + " | Label: " + str(label))
        return(self.createDummyStock())

    #getLabels returns the first $amount (for example 100) names, label and closing price of assetType
    #assetType is either ETF or Stocks
    #amount is the amount of stock labels, names and closing price we want to return
    def getLabels(self, assetType, amount):
        print("Type: " + str(assetType) + " | Amount: " + str(amount))
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



