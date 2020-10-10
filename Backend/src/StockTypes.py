class StockTypes:
    ETFs = []
    Stocks = []

    def __init__(self, new_Stocks, new_ETFs):
        ETFs = new_Stocks
        Stocks = new_ETFs

    def get(self, type, label):
        return print("Type: " + str(type) + " | Label: " + str(label))