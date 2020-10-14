from Model.Stock import Stock
import csv
import numpy as np
import os
import json


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

        self.load()






    #assetType is either ETF or Stocks
    #label is 4 char shortcut of asset name
    def get(self, assetType, label):
        print("Type: " + str(assetType) + " | Label: " + str(label))

        return((self.Stock[label.tolower()] if(assetType == "Stock") else (self.ETFs[label.tolower()])).toJSON())

    #getLabels returns the first $amount (for example 100) names, label and closing price of assetType
    #assetType is either ETF or Stocks
    #amount is the amount of stock labels, names and closing price we want to return
    def getLabels(self, assetType, amount):
        print("Type: " + str(assetType) + " | Amount: " + str(amount))
        return(self.createDummyLabels())











    def load(self):
        print("Getting File Names")
        #scan stocks directory,
        #Grab all stock tickers
        unformatted_stock_file_names = os.listdir(self.stocks_directory)
        for each in unformatted_stock_file_names:
            self.stock_ticker_list.append(each.replace(".us.txt", ""))


        #scan ETFs directory,
        #Grab all ETF tickers
        unformatted_etf_file_names = os.listdir(self.etfs_directory)
        for each in unformatted_etf_file_names:
            self.etf_ticker_list.append(each.replace(".us.txt", ""))

        print("Importing Stocks")
        #Use stock tickers to create an object for each ticker:
        for each_ticker in self.stock_ticker_list:
            self.Stocks[each_ticker] = Stock(each_ticker)

            #Open file in overwrite mode
            file = open(self.stocks_directory + str(each_ticker) + ".us.txt", "r")
            file_contents = str(file.read())
            lines = file_contents.splitlines();
            for i in range (1,len(lines)):
                row = str(lines[i]).split(",")
                self.Stocks[each_ticker].data.append({'Date': row[0],'Open': row[1],'High': row[2],'Low': row[3],'Close': row[4],'Volume': row[5],'OpenInt': row[6]})
            file.close()

        print("Importing Stocks Complete\n\nImporting ETFs")

        #Use ETF tickers to create an object for each:
        for each_ticker in self.etf_ticker_list:
            self.ETFs[each_ticker] = Stock(each_ticker)
            file = open(self.etfs_directory + str(each_ticker) + ".us.txt", "r")
            file_contents = str(file.read())
            lines = file_contents.splitlines();
            for i in range (1,len(lines)):
                row = str(lines[i]).split(",")
                self.ETFs[each_ticker].data.append({'Date': row[0],'Open': row[1],'High': row[2],'Low': row[3],'Close': row[4],'Volume': row[5],'OpenInt': row[6]})
            file.close()

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

        for i in range(1, 200):
            if(len(data) % i == 0):
                chunks = int(len(data) / i)
                chunk_size = i

        print(chunks)
        chunked_data = np.split(data, chunks)

        tempStock = []

        for i in range(chunks):
            tempStock.append(Stock("Tesla", "TSLA", chunked_data[i].tolist()))

        return(tempStock)

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
