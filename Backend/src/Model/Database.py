import sys
sys.path.insert(1, '../')

from Model.Stock import Stock
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
        data_directory = os.path.join(dirname, '../../data') + os.sep

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
    # getLabels returns the first $amount (for example 100) names, label and closing price of assetType
    # assetType is either ETF or Stocks
    # amount is the amount of stock labels, names and closing price we want to return
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
        csv_columns = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'OpenInt']
        asset = (self.Stocks[str(label).lower()]) if("stock" in str(assetType).lower()) else (self.ETFs[str(label).lower()])
        dir = (self.stocks_directory if("stock" in str(assetType).lower()) else self.etfs_directory)

        csv_file = (dir + label + ".us.txt")

        print(csv_file)
        try:
            with open(csv_file, 'w') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
                writer.writeheader()
                for data in asset.data:
                    writer.writerow(data)
        except IOError:
            print("I/O error")

    def getFilenames(self):
        print("Getting File Names")
        #scan stocks directory,
        #Grab all stock tickers
        unformatted_stock_file_names = os.listdir(self.stocks_directory)
        for each in unformatted_stock_file_names:
            if(".DS_Store" not in each):
                self.stock_ticker_list.append(each.replace(".us.txt", ""))

        # sort etf_ticker_list
        self.etf_ticker_list.sort()

        #scan ETFs directory,
        #Grab all ETF tickers
        unformatted_etf_file_names = os.listdir(self.etfs_directory)
        for each in unformatted_etf_file_names:
            if(".DS_Store" not in each):
                self.etf_ticker_list.append(each.replace(".us.txt", ""))

        # sort stock_ticker_list
        self.stock_ticker_list.sort()

    def importStocks(self):
        print("\t\t\t\tImporting Stocks")
        #Use stock tickers to create an object for each ticker:
        total = len(self.stock_ticker_list)
        current = 1
        for each_ticker1 in self.stock_ticker_list:

            with open(self.stocks_directory + str(each_ticker1) + ".us.txt", "r") as f:
                data1 = list(csv.DictReader(f))

            self.Stocks[each_ticker1] = Stock("", each_ticker1, data1)
            self.printCompletion(total, current, 1)
            current += 1

        print("Importing Stocks Complete\n")

    def importETFs(self):
        print("Importing ETFs")

        total = len(self.etf_ticker_list)
        current = 1
        #Use ETF tickers to create an object for each:
        for each_ticker2 in self.etf_ticker_list:

            with open(self.etfs_directory + str(each_ticker2) + ".us.txt", "r") as f:
                data2 = list(csv.DictReader(f))

            self.ETFs[each_ticker2] = Stock("", each_ticker2, data2)
            self.printCompletion(total, current, 0)
            current += 1

        self.loaded = True

        print("Importing ETFs Complete\n\n")


    #-=-=-=- Helper Function -=-=-=-=-=-
    def createDummyLabels(self):

        labels = [{"name": "Tesla", "label": "TSLA", "price":"12", "change": "-1.41"},
                  {"name": "Facebook", "label": "FB", "price":"55", "change": "-0.54"},
                  {"name": "Microsoft", "label": "MSFT", "price":"23", "change": "+2.40"},
                  {"name": "Google", "label": "GOOG", "price":"234", "change": "-0.35"},
                  {"name": "Intel", "label": "INTC", "price":"41", "change": "-1.91"},
                  {"name": "TSMC", "label": "TSM", "price":"41", "change": "-0.62"},
                  {"name": "Amazon", "label": "AMZN", "price":"234", "change": "-0.65"},
                  {"name": "AMD", "label": "AMD", "price":"432", "change": "-0.79"},
                  {"name": "Amgen", "label": "AMGN", "price":"56", "change": "-2.58"},
                  {"name": "Analog Devices Inc", "label": "AMGN", "price":"234", "change": "-0.46"},
                  {"name": "American Airlines", "label": "AAL", "price":"32", "change": "+1.34"},
                  {"name": "Applied Materials Inc", "label": "AMAT", "price":"54", "change": "+0.07"},
                  {"name": "Autodesk", "label": "ADSK", "price":"32", "change": "-1.97"},
                  {"name": "Broadcom", "label": "AVGO", "price":"12", "change": "+0.07"},
                  {"name": "Baidu", "label": "BIDU", "price":"34", "change": "-1.97"},
                  {"name": "Cerner Group", "label": "CERN", "price":"123", "change": "-0.27"},
                  {"name": "Comcast Corp", "label": "CMCSA", "price":"43", "change": "+0.73"},
                  {"name": "CSX Corp", "label": "CSX", "price":"410", "change": "+0.17"},
                  {"name": "J.B. Hunt", "label": "JBHT", "price":"465", "change": "-0.87"},
                  {"name": "lululemon", "label": "LULU", "price":"4451", "change": "-0.57"},
                  {"name": "Mariot International", "label": "MAR", "price":"324", "change": "-0.28"},
                  {"name": "Netflix", "label": "NFLX", "price":"123", "change": "-0.40"},
                  {"name": "Xillinx", "label": "XLNX", "price":"213", "change": "+1.65"},
                  {"name": "Wynn Resorts", "label": "Wynn", "price":"342", "change": "+0.98"},
                  {"name": "Xcel Energy", "label": "XEL", "price":"653", "change": "+3.54"}]

        return(labels)

    def printCompletion(self, total, current, thread = 0):
        space = str("" if thread == 0 else "\t\t\t\t")
        if(int(total / 10) == current):
            print(space + "10% Complete")
        elif(int(total / 10) * 2 == current):
            print(space + "20% Complete")
        elif(int(total / 10) * 3 == current):
            print(space + "30% Complete")
        elif(int(total / 10) * 4 == current):
            print(space + "40% Complete")
        elif(int(total / 2) == current):
            print(space + "50% Complete")
        elif(int(total / 10) * 6 == current):
            print(space + "60% Complete")
        elif(int(total / 10) * 7 == current):
            print(space + "70% Complete")
        elif(int(total / 10) * 8 == current):
            print(space + "80% Complete")
        elif(int(total / 10) * 9 == current):
            print(space + "90% Complete")
        elif(total == current):
            print(space + "100% Complete")
