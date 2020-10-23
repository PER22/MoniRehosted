import yfinance as yf
import numpy as np

#define the ticker symbol
tickerSymbol = 'MSFT'

#get data on this ticker
tickerData = yf.Ticker(tickerSymbol)

#get the historical prices for this ticker
tickerDf = tickerData.history(period='1d', start='2010-1-1', end='2020-1-25')

#see your data
print(np.array(tickerDf)[0, 1:6])
print(tickerDf.iloc[0])