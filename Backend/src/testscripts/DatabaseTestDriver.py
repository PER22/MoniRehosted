import signal
import sys
from time import sleep
#from Model.Database import Database
import csv
import numpy as np
import os
import json
import math
from Model.Stock  import Stock

database =Database()

database.load()

print(database.getLabels('stock','a'))