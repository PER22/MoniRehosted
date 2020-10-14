#!/usr/bin/env python
# coding: utf-8

# In[1]:


#Imports Only
import os
from os.path import dirname
from Model.Stock import Stock
import time


# In[2]:


#FileIO class
class FileIO:
    def __init__(self):
        #create empty lists for tickers and pricelists
        self.stock_ticker_list = []
        self.etf_ticker_list = []
        self.loaded = False
        
        #empty dictionary for all stocks/ETFs
        self.all_stocks = {}
        self.all_etfs = {}
    
        #go to correct file location to see the different companies.
        dirname = (os.path.dirname(__file__))[:-8]
        dataDirectory = os.path.join(dirname, 'data') + os.sep

        #Stocks directory
        self.stocks_directory = dataDirectory + "Stocks" + os.sep
        #ETFs directory
        self.etfs_directory = dataDirectory + "ETFs" + os.sep
        

        
    
    def load(self):
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
        
        #Use stock tickers to create an object for each ticker:   
        for each_ticker in self.stock_ticker_list:
            self.all_stocks[each_ticker] = Stock(each_ticker)
            #Open file in overwrite mode
            file = open(self.stocks_directory + str(each_ticker) + ".us.txt", "r")
            file_contents = str(file.read())
            lines = file_contents.splitlines();
            for i in range (1,len(lines)):
                comma_sep_vals = str(lines[i]).split(",")
                self.all_stocks[each_ticker].data.append(comma_sep_vals)
            file.close()
        #Use ETF tickers to create an object for each:                                     
        for each_ticker in self.etf_ticker_list:
            self.all_etfs[each_ticker] = Stock(each_ticker)
            file = open(self.etfs_directory + str(each_ticker) + ".us.txt", "r")
            file_contents = str(file.read())
            lines = file_contents.splitlines();
            for i in range (1,len(lines)):
                comma_sep_vals = str(lines[i]).split(",")
                self.all_etfs[each_ticker].data.append(comma_sep_vals)
            file.close()
            
        self.loaded = True
        return (self.stock_ticker_list, self.all_stocks, self.etf_ticker_list, self.all_etfs)
    
    #I can't see a reason to save them all to file again, but here it is.
    def save_all_assets(self):
        if self.loaded == False:
            print("FileIO.save_all() can not be called before calling FileIO.load()")
            return
        #save Stocks
        for each_ticker in self.all_stocks:
            file_object = open(self.stocks_directory + each_ticker + ".us.txt",'w')
            file_to_build = "Date,Open,High,Low,Close,Volume,OpenInt\n"
            for each_entry in self.all_stocks[each_ticker].data:
                line_to_build = ""
                for i in range(6):
                    line_to_build = line_to_build + str(self.all_stocks[each_ticker].data[each_entry][i]) + ", "
                line_to_build = line_to_build + str(self.all_stocks[each_ticker].data[each_entry][6]) + "\n"
                file_to_build += line_to_build
            file_object.write(file_to_build)
            file_object.close()
        #save all ETFs    
        for each_ticker in self.all_etfs:
            file_object = open(self.etfs_directory + each_ticker + ".us.txt",'w')
            #build file for individual ETF
            file_to_build = "Date,Open,High,Low,Close,Volume,OpenInt\n"
            for each_entry in self.all_etfs[each_ticker].data:
                #Build 1 days worth of data
                line_to_build = ""
                for i in range(6):
                    line_to_build = line_to_build + str(self.all_etfs[each_ticker].data[each_entry][i]) + ", "    
                line_to_build = line_to_build + str(self.all_etfs[each_ticker].data[each_entry][6]) + "\n"
                #append line to file
                file_to_build += line_to_build
            file_object.write(file_to_build)
            file_object.close()
            
    
 #   def append_rows_to_an_asset_file(self,stock_ticker,rows_of_new_price_data):
 #       #if this is a valid stock
 #       if stock_ticker in self.stock_ticker_list:
 #           #open its file in append mode.
 #           file_object = open(self.stocks_directory + each_ticker + ".us.txt",'a')
 #           string_to_append = ""
 #           for i in range(len(rows)
 #               string_to_append = 
 #       elif stock_ticker in self.etf_ticker_list:
 #           
 #       else
 #           print("FileIO.py: Unable to find stock_ticker")
        
        
        


