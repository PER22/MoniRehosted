from Stock import Stock
import csv
import numpy as np
import os
import json


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
        dirname = (os.path.dirname(__file__))[:-3]
        filename = os.path.join(dirname, 'data/ETFs/adrd.us.txt')

        with open(filename, 'r') as f:
            reader = csv.reader(f, delimiter=',')
            headers = next(reader)
            data = np.array(list(reader))

        #data[:,1:6] = np.round(np.array(data[:,1:6].astype(float)*100), 3)
        data[:,0:6] = np.array(data[:,0:6].astype(str))
        data = data[:,0:6]

        chunks = 0
        chunk_size = 0

        for i in range(1, 100):
            if(len(data) % i == 0):
                chunks = int(len(data) / i)
                chunk_size = i

        print(chunks)
        chunked_data = np.split(data, chunks)

        tempStock = []

        for i in range(chunks):
            tempStock.append(Stock("Tesla", "TSLA", chunked_data[i].tolist()))

        return(tempStock)



    #-=-=-=- Helper Function -=-=-=-=-=-
    def createDummyLabels(self):

        labels = [["Tesla", "TSLA", "41"],
                  ["Tesla", "TSLA", "41"],
                  ["Tesla", "TSLA", "41"],
                  ["Tesla", "TSLA", "41"]]

        return(labels)



