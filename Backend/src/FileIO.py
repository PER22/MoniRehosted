#!/usr/bin/env python
# coding: utf-8

# In[1]:


#Imports Only
import os
from os.path import dirname
from Stock import Stock 
import time


# In[2]:


#FileIO class
class FileIO:
    def __init__(self):
        #create empty lists for tickers and pricelists
        self.stock_ticker_list = []
        self.etf_ticker_list = []
        self.stock_list = []
        self.etf_list = []
        
        #empty dictionary for all stocks/ETFs
        self.all_stocks = {}
        self.all_etfs = {}
    
        #go to correct file location to see the different companies.
        current_working_directory = os.getcwd()
        data_directory = os.path.dirname(current_working_directory) + os.sep + "data" + os.sep
        #Stocks directory
        self.stocks_directory = data_directory + "Stocks" + os.sep
        #ETFs directory
        self.etfs_directory = data_directory + "ETFs" + os.sep
        

        
    
    def load(self):
        start_time = time.time()
        unformatted_stock_file_names = os.listdir(self.stocks_directory)
        #Grab all stock/ETF tickers
        for each in unformatted_stock_file_names:
            self.stock_ticker_list.append(each.replace(".us.txt", ""))
        unformatted_etf_file_names = os.listdir(self.etfs_directory)
        for each in unformatted_etf_file_names:
            self.etf_ticker_list.append(each.replace(".us.txt", ""))
        

        count_rows_processed = 0
        #Use stock/ETF tickers to create an object for each   
        for each_ticker in self.stock_ticker_list:
            self.all_stocks[each_ticker] = Stock(each_ticker)
            file = open(self.stocks_directory + str(each_ticker) + ".us.txt", "r")
            file_contents = str(file.read())
            lines = file_contents.splitlines();
            count_rows_processed += len(lines)
            for i in range (1,len(lines)):
                comma_sep_vals = str(lines[i]).split(",")
                self.all_stocks[each_ticker].data.append(comma_sep_vals)
            file.close()
            
        for each_ticker in self.etf_ticker_list:
            self.all_etfs[each_ticker] = Stock(each_ticker)
            file = open(self.etfs_directory + str(each_ticker) + ".us.txt", "r")
            file_contents = str(file.read())
            lines = file_contents.splitlines();
            count_rows_processed += len(lines)
            for i in range (1,len(lines)):
                comma_sep_vals = str(lines[i]).split(",")
                self.all_etfs[each_ticker].data.append(comma_sep_vals)
            file.close()

        end_time = time.time()
        total_time = round(end_time - start_time)
        
        print(str(count_rows_processed) + " rows processed in " + str(total_time) + " seconds.")    
        
        return (self.all_stocks, self.all_etfs)

    def save(self:
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
            
        #save ETFs



