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

        return(None)

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