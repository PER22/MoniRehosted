#!/usr/bin/env python3
import signal
import sys
from time import sleep
import RPi.GPIO as GPIO
from Lid import Lid
from Sensors import Sensors
from Cloud import Cloud

#Other Variables
lidController = Lid()
sensors = Sensors(lidController)
cloud = Cloud(lidController)

#This method let's the user ctrl-c out of the program
def signal_handler(sig, frame):
    GPIO.cleanup()
    sys.exit(0)

if __name__ == '__main__':

    #Makes sure you can exit the program
    signal.signal(signal.SIGINT, signal_handler)

    i = 0
    while True:
        #do nothing
        print "Off"
        sleep(0.2)
