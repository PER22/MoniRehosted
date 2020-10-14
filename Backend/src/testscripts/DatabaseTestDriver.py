import signal
import sys
from time import sleep
from Model.Database import Database
import csv
import numpy as np
import os
import json
import math
from Model.Stock  import Stock

# #Other Variables
# database = Database()
# #database.load()
#
# # #This method let's the user ctrl-c out of the program
# # def signal_handler(sig, frame):
# #     sys.exit(0)
#
# if __name__ == '__main__':
#
#     print(len(database.get("etf", "amjl")))
#     print(len(Database().createDummyStock()))
#
#     #Makes sure you can exit the program
#     # signal.signal(signal.SIGINT, signal_handler)
#
#     # i = 0
#     # while True:
#     #     #do nothing
#     #     print("Off")
#     #     sleep(0.2)
#
# print("Amount of Rows: " + str(len(data)/2))
# print("Amount of Data per # of rows: " + str(sys.getsizeof(data[0:2346])))
# print("Amount of Data for entire data set: " + str(sys.getsizeof(data)))
# print(sys.getsizeof(data[0:int(len(data))]) > 28000)
#
# print(len(data))
#
#
# print("\n\nLOOP:")
# for i in range(len(data)):
#     if(sys.getsizeof(data[0:i]) > 28000):
#         print("PEMEES " + str(sys.getsizeof(data[0:i])))
#         print(i)
#         break







#   3494 lines per packet

#-=-=-=- Helper Function -=-=-=-=-=-
dirname = (os.path.dirname(__file__))[:-15] #adrd
filename = os.path.join(dirname, 'data/Stocks/vz.us.txt')
refferenceVal = 3494

with open(filename, 'r') as f:
    reader = csv.DictReader(f)
    #headers = next(reader)
    #data = list(reader)
    for row in reader:
        print(row)

# rowsLeftover = len(data)
# total = len(data)
# numChunks = int(math.ceil(rowsLeftover / refferenceVal))
#
# chunkList = []
#
# for i in range(numChunks):
#     if(refferenceVal <= rowsLeftover):
#         chunkList.append(Stock("Penis", "pns", data[total-rowsLeftover: refferenceVal * (i + 1)]))
#         rowsLeftover -= refferenceVal
#     else:
#         chunkList.append(Stock("Penis", "pns", data[total-rowsLeftover: total -1]))

#print(chunkList[2].toString())

