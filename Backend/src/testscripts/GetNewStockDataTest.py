import yfinance as yf
from Backend.src.Model.Database import Database
from Backend.src.Model.Stock import Stock
import numpy as np
import csv
from datetime import date


#Start the database and load in the data
database = Database("ETFs1", "Stocks1")
database.load()

#define the ticker symbol
tickerSymbol = 'a'

#load the Stock from the database
stock = database.Stocks[tickerSymbol]

print('\n\n\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n\n\n')

def updateData():
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
            stock.data.append({'Date': str(tickerDf.iloc[j].name).split()[0],
                               'Open': str(round(tickerDf.iloc[j]['Open'], 2)),
                               'High': str(round(tickerDf.iloc[j]['High'], 2)),
                               'Low': str(round(tickerDf.iloc[j]['Low'], 2)),
                               'Close': str(round(tickerDf.iloc[j]['Close'], 2)),
                               'Volume': str(round(tickerDf.iloc[j]['Volume'], 2)),
                               'OpenInt': '0'})

        print("Length of Stock data after update: " + str(len(stock.data)))
    else:
        print("Nothing to update")

def updateCSV():
    csv_columns = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'OpenInt']

    csv_file = database.stocks_directory + database.stock_ticker_list[0]

    print(csv_file)
    try:
        with open(csv_file, 'w') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
            writer.writeheader()
            for data in stock.data:
                writer.writerow(data)
    except IOError:
        print("I/O error")

updateData()
updateCSV()