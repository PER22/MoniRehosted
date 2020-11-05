import sys
from Backend.src.Model.Stock import Stock
from Backend.src.Model.FileIO import FileIO
import yfinance as yf
import requests
from threading import Thread
import csv
import numpy as np
import os
import math
from datetime import date


class Database:

    #-=-=-=- Startup -=-=-=-=-=-
    def __init__(self, etfFolderName = "ETFs", stocksFolderName = "Stocks"):
        #create empty lists for tickers and pricelists
        self.stock_ticker_list = []
        self.etf_ticker_list = []
        self.loaded = False

        #empty dictionary for all stocks/ETFs
        self.ETFs = {}
        self.Stocks = {}

        #go to correct file location to see the different companies.
        dirname = (os.path.dirname(__file__))[:-9]
        data_directory = os.path.join(dirname, 'data') + os.sep

        print(data_directory)
        #Stocks directory
        self.stocks_directory = data_directory + stocksFolderName + os.sep
        #ETFs directory
        self.etfs_directory = data_directory + etfFolderName + os.sep

        #self.load()

    def load(self):
        self.getFilenames()

        thread1 = Thread(target = self.importStocks)
        thread2 = Thread(target = self.importETFs)

        thread1.start()
        thread2.start()

        thread1.join()
        thread2.join()

        self.loaded = True

        print("Importing ETFs Complete\n\n")

        return (self.stock_ticker_list, self.Stocks, self.etf_ticker_list, self.ETFs)


    #-=-=-=- Access Data -=-=-=-=-=-
    def get(self, assetType, label):
        print("Type: " + str(assetType) + " | Label: " + str(label))
        if((str(label).lower() in self.Stocks) or (str(label).lower() in self.ETFs)):
            asset = (self.Stocks[str(label).lower()]) if("stock" in str(assetType).lower()) else (self.ETFs[str(label).lower()])

            #get starting and ending date
            startingDate = str(asset.data[-1]['Date'])
            endningDate = str(date.today())

            #Don't update anything if there is nothing to update

            if(startingDate != endningDate):
                print("Updating data")
                self.updateData(assetType, label)
                self.updateCSV(assetType, label)
            else:
                print("Nothing to update")

            return(asset)
        else:
            return(Stock("Error", "Error", None))

    def getChunked(self, assetType, label):
        print("Type: " + str(assetType) + " | Label: " + str(label))
        if((str(label).lower() in self.Stocks) or (str(label).lower() in self.ETFs)):
            asset = (self.Stocks[str(label).lower()]) if("stock" in str(assetType).lower()) else (self.ETFs[str(label).lower()])

            #get starting and ending date
            startingDate = str(asset.data[-1]['Date'])
            endningDate = str(date.today())

            #Don't update anything if there is nothing to update

            if(startingDate != endningDate):
                print("Updating data")
                self.updateData(assetType, label)
                self.updateCSV(assetType, label)
            else:
                print("Nothing to update")


            name = asset.name if (asset.name != "") else self.storeLabel(asset.label, ("stock" if("stock" in str(assetType).lower()) else "etf"))
            print("\n\n\n\t\t\t" + str(name) + "\n\n\n")
            label = asset.label
            data = asset.data

            refferenceVal = 120 #3494
            rowsLeftover = len(data)
            total = len(data)
            numChunks = int(math.ceil(rowsLeftover / refferenceVal))

            chunkList = []

            for i in range(numChunks):
                if(refferenceVal <= rowsLeftover):
                    chunkList.append(Stock(name, label, data[total-rowsLeftover: refferenceVal * (i + 1)]))
                    rowsLeftover -= refferenceVal
                else:
                    chunkList.append(Stock(name, label, data[total-rowsLeftover: total -1]))

            print("Returning Data")
            return(chunkList)
        else:
            return([Stock("Error", "Error", None)])

    def delete(self, assetType, label):
        print("Type: " + str(assetType) + " | Label: " + str(label))
        if((str(label).lower() in self.Stocks) or (str(label).lower() in self.ETFs)):
            if("stock" in str(assetType).lower()):
                del self.Stocks[str(label).lower()]
                #del self.stock_ticker_list[str(label).lower()]
            else:
                del self.ETFs[str(label).lower()]
                #del self.etf_ticker_list[str(label).lower()]
            return(True)
        else:
            return(False)

    def getLabels(self, assetType, letter):
        print("Type: " + str(assetType) + " | Letter: " + str(letter))
        temp = []
        stockList = []

        # temporary list contains all stock/element that start with "letter"
        if str(assetType).lower() == 'stock':
            temp = [element for element in self.stock_ticker_list if element[0].lower() == str(letter).lower()]

            for i in range(len(temp)):
                stockData = self.Stocks[temp[i]].data
                name = self.get_symbol(temp[i].upper())

                if name == None:
                    self.Stocks[temp[i]].name =temp[i].upper()
                    name =temp[i].upper()
                else:
                    self.Stocks[temp[i]].name =name

                if (len(stockData) != 0):
                    tempChange =str(round(float(stockData[-1]['Close']) - float(stockData[-2]['Close']),2))

                    stockList.append(dict(name=name, label=temp[i], price=stockData[-1]['Open'], change=tempChange))
        else:
            temp = [element for element in self.etf_ticker_list if element[0].lower() == str(letter).lower()]

            for i in range(len(temp)):
                etfData = self.ETFs[temp[i]].data
                name = self.get_symbol(temp[i].upper())

                if name == None:
                    self.ETFs[temp[i]].name = temp[i].upper()
                    name =temp[i].upper()
                else:
                    self.ETFs[temp[i]].name = name

                if (len(etfData) != 0):
                    tempChange =str(round(float(etfData[-1]['Close']) - float(etfData[-2]['Close']),2))
                    stockList.append(dict(name=name, label=temp[i], price=etfData[-1]['Open'], change=tempChange))

        refferenceVal = 120  # 3494
        rowsLeftover = len(stockList)
        total = len(stockList)
        numChunks = int(math.ceil(rowsLeftover / refferenceVal))

        chunkList = []

        for i in range(numChunks):
            if (refferenceVal <= rowsLeftover):
                chunkList.append(stockList[total - rowsLeftover: refferenceVal * (i + 1)])
                rowsLeftover -= refferenceVal
            else:
                chunkList.append(stockList[total - rowsLeftover: total - 1])

        return chunkList

        #"name": "Tesla", "label": "TSLA", "price": "12"
        #return (stockList)
        #return(self.createDummyLabels())

    #-=-=-=- Update/Get Data from the internet -=-=-=-=-=-
    def storeLabel(self, label, type):
        nameOfCompany = self.get_symbol(label.upper())

        if type == "stock":
            self.Stocks[label].name = nameOfCompany
        else:
            self.ETFs[label].name = nameOfCompany

        return(nameOfCompany)

    def get_symbol(self, symbol):
        url = "http://d.yimg.com/autoc.finance.yahoo.com/autoc?query={}&region=1&lang=en".format(symbol)

        result = requests.get(url).json()

        for x in result['ResultSet']['Result']:
            if x['symbol'] == symbol:
                return x['name']

    def updateData(self, assetType, label):
        asset = (self.Stocks[str(label).lower()]) if("stock" in str(assetType).lower()) else (self.ETFs[str(label).lower()])

        #get starting and ending date
        startingDate = asset.data[-1]['Date']
        endningDate = date.today()

        #get data on this ticker
        tickerData = yf.Ticker(label.upper())

        #get the historical prices for this ticker
        tickerDf = tickerData.history(period='1d', start=startingDate, end=endningDate)

        print("Length of Stock data before update: " + str(len(asset.data)))

        #incase it is monday and the exchange is not closed yet
        if((len(tickerDf) != 0) and str(tickerDf.iloc[-1].name).split()[0] != str(asset.data[-1]['Date'])):

            for j in range(len(tickerDf)):
                if(str(asset.data[-1]['Date']) != str(tickerDf.iloc[j].name).split()[0]):
                    asset.data.append({'Date': str(tickerDf.iloc[j].name).split()[0],
                                       'Open': str(round(tickerDf.iloc[j]['Open'], 2)),
                                       'High': str(round(tickerDf.iloc[j]['High'], 2)),
                                       'Low': str(round(tickerDf.iloc[j]['Low'], 2)),
                                       'Close': str(round(tickerDf.iloc[j]['Close'], 2)),
                                       'Volume': str(round(tickerDf.iloc[j]['Volume'], 2)),
                                       'OpenInt': '0'})

        print("Length of Stock data after update: " + str(len(asset.data)))


    #-=-=-=- File I/O -=-=-=-=-=-
    def updateCSV(self, assetType, label):
        asset = (self.Stocks[str(label).lower()]) if("stock" in str(assetType).lower()) else (self.ETFs[str(label).lower()])
        csv_file = ((self.stocks_directory if("stock" in str(assetType).lower()) else self.etfs_directory) + label + ".us.txt")

        FileIO.updateCSV(asset, csv_file)

    def getFilenames(self):
        print("Getting File Names")
        self.etf_ticker_list = FileIO.getCSVNames(self.etfs_directory)
        self.stock_ticker_list = FileIO.getCSVNames(self.stocks_directory)

    def importStocks(self):
        print("\t\t\t\tImporting Stocks")
        self.Stocks = FileIO.loadCSV(self.stock_ticker_list, self.stocks_directory, 1)
        print("Importing Stocks Complete\n")

    def importETFs(self):
        print("Importing ETFs")
        self.ETFs = FileIO.loadCSV(self.etf_ticker_list, self.etfs_directory, 0)
        print("Importing ETFs Complete\n\n")


