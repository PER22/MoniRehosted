from Model.Stock import Stock
import csv
import numpy as np
import os
import math


class Database:
    def __init__(self):
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
        self.stocks_directory = data_directory + "Stocks" + os.sep
        #ETFs directory
        self.etfs_directory = data_directory + "ETFs" + os.sep

        #self.load()






    #assetType is either ETF or Stocks
    #label is 4 char shortcut of asset name
    def get(self, assetType, label):
        print("Type: " + str(assetType) + " | Label: " + str(label))
        asset = (self.Stocks[str(label).lower()]) if(str(assetType).lower() == "stock") else (self.ETFs[str(label).lower()])

        name = asset.name
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


    #getLabels returns the first $amount (for example 100) names, label and closing price of assetType
    #assetType is either ETF or Stocks
    #amount is the amount of stock labels, names and closing price we want to return
    def getLabels(self, assetType, letter):
        print("Type: " + str(assetType) + " | Letter: " + str(letter))
        temp = []
        stockList = []

        # temporary list contains all stock/element that start with "letter"
        if str(assetType).lower() == 'stock':
            temp = [element for element in self.stock_ticker_list if element[0].lower() == str(letter).lower()]

            for i in range(len(temp)):
                stockData = self.Stocks[temp[i]].data

                if(len(stockData) != 0):
                    stockList.append(dict(name='Tesla', label=temp[i], price=stockData[-1]['Open']))
        else:
            temp = [element for element in self.etf_ticker_list if element[0].lower() == str(letter).lower()]

            for i in range(len(temp)):
                etfData = self.ETFs[temp[i]].data

                if(len(etfData) != 0):
                    stockList.append(dict(name='Tesla', label=temp[i], price=etfData[-1]['Open']))

        # "name": "Tesla", "label": "TSLA", "price": "12"
        return (stockList)








    def load(self):
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

        print("Importing Stocks")
        #Use stock tickers to create an object for each ticker:
        total = len(self.stock_ticker_list)
        current = 1
        for each_ticker1 in self.stock_ticker_list:

            with open(self.stocks_directory + str(each_ticker1) + ".us.txt", "r") as f:
                data1 = list(csv.DictReader(f))

            self.Stocks[each_ticker1] = Stock("", each_ticker1, data1)
            self.printCompletion(total, current)
            current += 1

        print("Importing Stocks Complete\n\nImporting ETFs")

        total = len(self.etf_ticker_list)
        current = 1
        #Use ETF tickers to create an object for each:
        for each_ticker2 in self.etf_ticker_list:

            with open(self.etfs_directory + str(each_ticker2) + ".us.txt", "r") as f:
                data2 = list(csv.DictReader(f))

            self.ETFs[each_ticker2] = Stock("", each_ticker2, data2)
            self.printCompletion(total, current)
            current += 1

        self.loaded = True

        print("Importing ETFs Complete\n\n")

        return (self.stock_ticker_list, self.Stocks, self.etf_ticker_list, self.ETFs)












    #I can't see a reason to save them all to file again, but here it is.
    def save_all_assets(self):
        if self.loaded == False:
            print("FileIO.save_all() can not be called before calling FileIO.load()")
            return
        #save Stocks
        for each_ticker in self.Stocks:
            file_object = open(self.stocks_directory + each_ticker + ".us.txt",'w')
            file_to_build = "Date,Open,High,Low,Close,Volume,OpenInt\n"
            for each_entry in self.Stocks[each_ticker].data:
                line_to_build = ""
                for i in range(6):
                    line_to_build = line_to_build + str(self.Stocks[each_ticker].data[each_entry][i]) + ", "
                line_to_build = line_to_build + str(self.Stocks[each_ticker].data[each_entry][6]) + "\n"
                file_to_build += line_to_build
            file_object.write(file_to_build)
            file_object.close()
        #save all ETFs
        for each_ticker in self.ETFs:
            file_object = open(self.etfs_directory + each_ticker + ".us.txt",'w')
            #build file for individual ETF
            file_to_build = "Date,Open,High,Low,Close,Volume,OpenInt\n"
            for each_entry in self.ETFs[each_ticker].data:
                #Build 1 days worth of data
                line_to_build = ""
                for i in range(6):
                    line_to_build = line_to_build + str(self.ETFs[each_ticker].data[each_entry][i]) + ", "
                line_to_build = line_to_build + str(self.ETFs[each_ticker].data[each_entry][6]) + "\n"
                #append line to file
                file_to_build += line_to_build
            file_object.write(file_to_build)
            file_object.close()












    #-=-=-=- Helper Function -=-=-=-=-=-
    def createDummyLabels(self):

        labels = [{"name": "Tesla", "label": "TSLA", "price":"12"},
                  {"name": "Facebook", "label": "FB", "price":"55"},
                  {"name": "Microsoft", "label": "MSFT", "price":"23"},
                  {"name": "Google", "label": "GOOG", "price":"234"},
                  {"name": "Intel", "label": "INTC", "price":"41"},
                  {"name": "TSMC", "label": "TSM", "price":"41"},
                  {"name": "Amazon", "label": "AMZ", "price":"234"},
                  {"name": "AMD", "label": "AMD", "price":"432"},
                  {"name": "Amgen", "label": "AMGN", "price":"56"},
                  {"name": "Analog Devices Inc", "label": "AMGN", "price":"234"},
                  {"name": "American Airlines", "label": "AAL", "price":"32"},
                  {"name": "Applied Materials Inc", "label": "AMAT", "price":"54"},
                  {"name": "Autodesk", "label": "ADSK", "price":"32"},
                  {"name": "Broadcom", "label": "AVGO", "price":"12"},
                  {"name": "Baidu", "label": "BIDU", "price":"34"},
                  {"name": "Cerner Group", "label": "CERN", "price":"123"},
                  {"name": "Comcast Corp", "label": "CMCSA", "price":"43"},
                  {"name": "CSX Corp", "label": "CSX", "price":"410"},
                  {"name": "J.B. Hunt", "label": "JBHT", "price":"465"},
                  {"name": "lululemon", "label": "LULU", "price":"4451"},
                  {"name": "Mariot International", "label": "MAR", "price":"324"},
                  {"name": "Netflix", "label": "NFLX", "price":"123"},
                  {"name": "Xillinx", "label": "XLNX", "price":"213"},
                  {"name": "Wynn Resorts", "label": "Wynn", "price":"342"},
                  {"name": "Xcel Energy", "label": "XEL", "price":"653"}]

        return(labels)

    def printCompletion(self, total, current):
        if(int(total / 10) == current):
            print("10% Complete")
        elif(int(total / 10) * 2 == current):
            print("20% Complete")
        elif(int(total / 10) * 3 == current):
            print("30% Complete")
        elif(int(total / 10) * 4 == current):
            print("40% Complete")
        elif(int(total / 2) == current):
            print("50% Complete")
        elif(int(total / 10) * 6 == current):
            print("60% Complete")
        elif(int(total / 10) * 7 == current):
            print("70% Complete")
        elif(int(total / 10) * 8 == current):
            print("80% Complete")
        elif(int(total / 10) * 9 == current):
            print("90% Complete")
        elif(total == current):
            print("100% Complete")
