from Stock import Stock
from JSON_Converter import JSON_Converter
import json
from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from Database import Database
import time
import os

def my_publish_callback(envelope, status):
    # Check whether request successfully completed or not
    if not status.is_error():
        pass
class MySubscribeCallback(SubscribeCallback):

    def __init__(self):
        global database
        database = Database([], [])

    def presence(self, pubnub, presence):
        pass
    def status(self, pubnub, status):
        pass
    def message(self, pubnub, message):
        controlCommand = message.message
        print(message)
        if(controlCommand["requester"] == "Client"):


            if(controlCommand["operation"] == "GetStockLabels"):
                pubnub.publish().channel('FinanceSub').message({
                    "requester": "Server",
                    "operation": "ReturnStockLabels",
                    "amount": "100",
                    "data": database.getLabels("stock", controlCommand["amount"])
                }).pn_async(my_publish_callback)

            elif(controlCommand["operation"] == "GetStockData"):
                response = JSON_Converter.convertStockToJSON(self.database.get("stock", controlCommand["stock"]))
                #pubnub.publish(channel="FinanceSub", message=response)
            elif(controlCommand["operation"] == "GetStockPrediction"):
                pubnub.publish().channel('FinanceSub').message({
                    "requester": "Server",
                    "operation": "ReturnStockLabels",
                    "amount": "100",
                    "data": database.getLabels("stock", controlCommand["amount"])
                }).pn_async(my_publish_callback)

            elif(controlCommand["operation"] == "GetETFLabels"):
                pubnub.publish().channel('FinanceSub').message({
                    "requester": "Server",
                    "operation": "ReturnETFLabels",
                    "amount": "100",
                    "data": database.getLabels("etf", controlCommand["amount"])
                }).pn_async(my_publish_callback)

            elif(controlCommand["operation"] == "GetETFData"):
                database.get("etf", controlCommand["etf"])
            elif(controlCommand["operation"] == "GetETFPrediction"):
                database.get("etf", controlCommand["etf"])
            else:
                print("OOPS something went wrong")
        else:
            pass

class Cloud:
    def __init__(self):
        pnconfig = PNConfiguration()
        pnconfig.publish_key = 'pub-c-7cd0dca0-eb36-44f8-bfef-d692af28f7d4'
        pnconfig.subscribe_key = 'sub-c-01442846-0b27-11eb-8b70-9ebeb8f513a7'
        global pubnub
        pubnub = PubNub(pnconfig)

        pubnub.add_listener(MySubscribeCallback())
        pubnub.subscribe().channels("FinanceSub").execute()
