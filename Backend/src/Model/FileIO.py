import sys
from Backend.src.Model.Stock import Stock
import yfinance as yf
import requests
from threading import Thread
import csv
import numpy as np
import os
import math
from datetime import date
from Backend.src.Model.Stock import Stock

class FileIO:
    @staticmethod
    def getCSVNames(directory):
        nameList = []
        unformatted_files = os.listdir(directory)
        for each in unformatted_files:
            if(".DS_Store" not in each):
                nameList.append(each.replace(".us.txt", ""))

        nameList.sort()
        return(nameList)

    @staticmethod
    def loadCSV(ticker_list, dir, thread=0):
        assetList = {}
        total = len(ticker_list)
        current = 1
        for each_ticker in ticker_list:

            with open(dir + str(each_ticker) + ".us.txt", "r") as f:
                data = list(csv.DictReader(f))

            assetList[each_ticker] = Stock("", each_ticker, data)
            FileIO.printCompletion(total, current, thread)
            current += 1
        return(assetList)


    @staticmethod
    def updateCSV(asset, filepath):
        csv_columns = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'OpenInt']

        print(filepath)
        try:
            with open(filepath, 'w') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
                writer.writeheader()
                for data in asset.data:
                    writer.writerow(data)
        except IOError:
            print("I/O error")
            return False

        return True


    @staticmethod
    def printCompletion(total, current, thread = 0):
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