#Import the Modules Required
import time
from pubnub import Pubnub
from Speaker import Speaker
from EasterEggs import *
from Language import Language

class Cloud:
    # Initialize the Pubnub Keys
    g_pub_key = "pub-c-e172d2c0-f4ff-4cb7-b610-46e2cbce18d5"
    g_sub_key = "sub-c-82bf53a4-bd8a-11ea-a44f-6e05387a1df4"
    trashCanLid = None
    language = Language()

    '''****************************************************************************************
    Function Name   :   init
    Description     :   Initalize the pubnub keys and Starts Subscribing
    Parameters      :   None
    ****************************************************************************************'''
    def __init__(self, newTrashCanLid):
        #Pubnub Initialization
        global pubnub
        pubnub = Pubnub(publish_key = self.g_pub_key, subscribe_key = self.g_sub_key)
        pubnub.subscribe(channels = 'Trash-Client', callback = self.callback, error = self.callback, reconnect = self.reconnect, disconnect = self.disconnect)

        self.trashCanLid = newTrashCanLid

    '''****************************************************************************************
    Function Name   :   alexaControl
    Description     :   Alexa Control, commands received and action performed
    Parameters      :   controlCommand
    ****************************************************************************************'''
    def lidControl(self, controlCommand):
        if(controlCommand.has_key("trigger")):
            if(controlCommand["trigger"] == "open" and controlCommand["status"] == 1):
                self.trashCanLid.openLid()
            elif(controlCommand["trigger"] == "close" and controlCommand["status"] == 0):
                self.trashCanLid.closeLid()

            elif(controlCommand["trigger"] == "trashDay" and controlCommand["status"] == 1):
                print("It's Trash Day")
                Speaker.trashDay()

            elif(controlCommand["trigger"] == "kobeMode" and controlCommand["status"] == 1):
                print("KOBE MODE")
                KobeBryant.play(self.trashCanLid)
            elif(controlCommand["trigger"] == "halloween" and controlCommand["status"] == 1):
                print("BOOOO It's halloween")
                Halloween.play(self.trashCanLid)

            elif(controlCommand["trigger"] == "music" and controlCommand["status"] == 1):
                print("Let's get down on it")
                Music.play()
            elif(controlCommand["trigger"] == "system" and controlCommand["status"] == 1):
                print("Reboot yo self")
                System.reboot()
            elif(controlCommand["trigger"] == "languageChange"):
                supportedLanguages = ['English', 'German', 'Arabic', 'Spanish', 'Chinese']
                self.language.setLanguage(supportedLanguages[controlCommand["status"]])
                print("Language changed to " + supportedLanguages[controlCommand["status"]])
            else:
                print("OOPS something went wrong")
        else:
            pass


    '''****************************************************************************************
    Function Name   :   callback
    Description     :   Waits for the message from the alexaTrigger channel
    Parameters      :   message - Sensor Status sent from the hardware
                        channel - channel for the callback
    ****************************************************************************************'''
    def callback(self, message, channel):
        if(message.has_key("requester")):
            self.lidControl(message)
        else:
            pass

    '''****************************************************************************************
    Function Name   :   error
    Description     :   If error in the channel, prints the error
    Parameters      :   message - error message
    ****************************************************************************************'''
    def error(self, message):
        print("ERROR : " + str(message))

    '''****************************************************************************************
    Function Name   :   reconnect
    Description     :   Responds if server connects with pubnub
    Parameters      :   message
    ****************************************************************************************'''
    def reconnect(self, message):
        print("RECONNECTED")

    '''****************************************************************************************
    Function Name   :   disconnect
    Description     :   Responds if server disconnects from pubnub
    Parameters      :   message
    ****************************************************************************************'''
    def disconnect(self, message):
        print("DISCONNECTED")
