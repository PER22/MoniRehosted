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
from statistics import mean


class Analytics:
    @staticmethod
    def calculateVelocity(stock, field):

        data = [float(i) for i in Analytics.getAllFields(stock, field)]

        scores = []

        scores.append(0)

        for i in range(1,len(data)):
            scores.append(((data[i] - data[i-1]) / data[i-1]) * 100)

        return(scores)

    @staticmethod
    def calculateVelocityChunked(stock, field):

        data = Analytics.calculateVelocity(stock, field)

        refferenceVal = 500 #3494
        rowsLeftover = len(data)
        total = len(data)
        numChunks = int(math.ceil(rowsLeftover / refferenceVal))

        chunkList = []

        for i in range(numChunks):
            if(refferenceVal <= rowsLeftover):
                chunkList.append(data[total-rowsLeftover: refferenceVal * (i + 1)])
                rowsLeftover -= refferenceVal
            else:
                chunkList.append(data[total-rowsLeftover: total -1])

        print("Returning Data")
        return(chunkList)

    @staticmethod
    def calculateMovingAverageChunked(stock, field, period):

        if(period < 1):
            return([])

        data = Analytics.calculateMovingAverage(stock, field, period)

        refferenceVal = 500 #3494
        rowsLeftover = len(data)
        total = len(data)
        numChunks = int(math.ceil(rowsLeftover / refferenceVal))

        chunkList = []

        for i in range(numChunks):
            if(refferenceVal <= rowsLeftover):
                chunkList.append(data[total-rowsLeftover: refferenceVal * (i + 1)])
                rowsLeftover -= refferenceVal
            else:
                chunkList.append(data[total-rowsLeftover: total -1])

        print("Returning Data")
        return(chunkList)

    @staticmethod
    def calculateMovingAverage(stock, field, period):

        data = [float(i) for i in Analytics.getAllFields(stock, field)]

        scores = []

        for _ in range(period):
            scores.append(data[0])

        for i in range(len(data) - period):
            scores.append(mean(data[i:i+period]))

        return(scores)

    @staticmethod
    def calculateCrossOver(stock, field, firstPeriod, secondPeriod):
        movingAverages = [Analytics.calculateMovingAverage(stock, field, firstPeriod),
                          Analytics.calculateMovingAverage(stock, field, secondPeriod)]



        return(movingAverages)

    @staticmethod
    def calculateGoldenDeath(stock, field, firstPeriod, secondPeriod):

        return(None)

    @staticmethod
    def getAllFields(stock, field):
        tempList = []

        for item in stock.data:
            tempList.append(item[field])

        return(tempList)


    @staticmethod
    def fieldFilter(field):
        if("clos" in str(field).lower()):
            return "Close"
        else:
            return "Open"