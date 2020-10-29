#!/usr/bin/env python3
import signal
import sys
from time import sleep
import sys
sys.path.insert(1, '../')
from Gateway.Cloud import Cloud

#Other Variables
cloud = Cloud()

#This method let's the user ctrl-c out of the program
def signal_handler(sig, frame):
    sys.exit(0)

if __name__ == '__main__':

    #Makes sure you can exit the program
    signal.signal(signal.SIGINT, signal_handler)

    i = 0
    while True:
        #do nothing
        print("Off")
        sleep(0.2)
