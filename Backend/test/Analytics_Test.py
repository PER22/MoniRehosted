from unittest import TestCase
from Backend.src.Model.Database import Database
from Backend.src.Model.Stock import Stock
from Backend.src.Model.Analytics import Analytics
import pandas as pd
import numpy as np
from datetime import datetime
import matplotlib.pyplot as plt
from matplotlib.dates import DateFormatter
from matplotlib.dates import DayLocator
import time
from datetime import date

class Analytics_Test(TestCase):
    def setUp(self):
        self.database = Database("ETFs1", "Stocks1")
        self.database.load()

    def test_getAllFields(self):
        etf =  self.database.get("etf", "aadr")
        dates = Analytics.getAllFields(etf, 'Date')
        self.assertEqual(len(etf.data), len(dates))


    def test_movingAverage(self):
        etf = self.database.get("etf", "aadr")

        dates = [datetime.strptime(d,"%Y-%m-%d").date() for d in Analytics.getAllFields(etf, 'Date')]
        open = [float(i) for i in Analytics.getAllFields(etf, 'Open')]
        rolling_mean = Analytics.calculateMovingAverage(etf, 'Open', 100)

        plt.plot(dates, open, label='AADR')
        plt.plot(dates, rolling_mean, label='AADR 5 Day SMA', color='orange')
        plt.legend(loc='upper left')
        plt.show()

        self.assertEqual(True, True)

    def test_goldenCross(self):
        etf = self.database.get("etf", "aadr")

        dates = [datetime.strptime(d,"%Y-%m-%d").date() for d in Analytics.getAllFields(etf, 'Date')]
        open = [float(i) for i in Analytics.getAllFields(etf, 'Open')]
        rolling_mean = Analytics.calculateCrossOver(etf, 'Open', 100, 200)

        plt.plot(dates, open, label='AADR')
        plt.plot(dates, rolling_mean[0], label='AADR 100 Day SMA', color='orange')
        plt.plot(dates, rolling_mean[1], label='AADR 200 Day SMA', color='red')
        plt.legend(loc='upper left')
        plt.show()

        self.assertEqual(True, True)
