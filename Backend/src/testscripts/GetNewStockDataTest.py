import yfinance as yf
from Backend.src.Model.Database import Database
from Backend.src.Model.Stock import Stock
import numpy as np
from datetime import date

#Start the database and load in the data
database = Database("ETFs1", "Stocks1")
database.load()

#define the ticker symbol
tickerSymbol = 'aaba'

#load the Stock from the database
stock = database.Stocks[tickerSymbol]

#get starting and ending date
startingDate = stock.data[-1]['Date']
endningDate = today = date.today()

#Don't update anything if there is nothing to update
if(startingDate != endningDate):

    #get data on this ticker
    tickerData = yf.Ticker(tickerSymbol.upper())

    #get the historical prices for this ticker
    tickerDf = tickerData.history(period='1d', start=startingDate, end=endningDate)

    print("Length of Stock data before update: " + str(len(stock.data)))


    for j in range(len(tickerDf)):
        stock.data.append({'Date': '2017-11-10',
                           'Open': tickerDf.iloc[j]['Open'],
                           'High': tickerDf.iloc[j]['High'],
                           'Low': tickerDf.iloc[j]['Low'],
                           'Close': tickerDf.iloc[j]['Close'],
                           'Volume': tickerDf.iloc[j]['Volume'],
                           'OpenInt': '0'})

    print("Length of Stock data after update: " + str(len(stock.data)))
else:
    print("Nothing to update")