import signal
import sys
from time import sleep
from Backend.src.Model.Database import Database
import csv
import numpy as np
import os
import json
import math
from Backend.src.Model.Stock  import Stock

database = Database()

database.load()

#print(database.getLabels('etf','a'))

print(database.getLabels('stock','a'))