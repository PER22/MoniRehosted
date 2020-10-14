import signal
import sys
from time import sleep
from Model.Database import Database

#Other Variables
database = Database()

# #This method let's the user ctrl-c out of the program
# def signal_handler(sig, frame):
#     sys.exit(0)

if __name__ == '__main__':

    print(database.ETFs["aadr"].toJSON())

    #Makes sure you can exit the program
    # signal.signal(signal.SIGINT, signal_handler)

    # i = 0
    # while True:
    #     #do nothing
    #     print("Off")
    #     sleep(0.2)

