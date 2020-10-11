from Stock import Stock
from JSON_Converter import JSON_Converter
import json
from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from Database import Database
from time import sleep
import time
import os

def my_publish_callback(envelope, status):
    # Check whether request successfully completed or not
    if not status.is_error():
        print("Request could not be completed")
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
            assetType = ("stock" if ("stock" in controlCommand["operation"].lower()) else "etf")
            #-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
            #-=-=-=-=-=-=-=- Stocks -=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
            #-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
            if("Labels" in controlCommand["operation"]):
                pubnub.publish().channel('FinanceSub').message({
                    "requester": "Server",
                    "operation": "ReturnStockLabels" if (assetType == "stock") else "ReturnETFLabels",
                    "amount": controlCommand["amount"],
                    "data": database.getLabels(assetType, controlCommand["amount"])
                }).pn_async(my_publish_callback)


            elif("Data" in controlCommand["operation"]):
                originalAsset = database.get(assetType, controlCommand[assetType])

                for i in range(len(originalAsset)):
                    print(str(i) + ". Chunk")
                    pubnub.publish().channel('FinanceSub').message({
                        "requester": "Server",
                        "operation": "ReturnStockData" if (assetType == "stock") else "ReturnETFData",
                        "assetType": controlCommand[assetType],
                        "part": i,
                        "total": len(originalAsset),
                        "data": originalAsset[0].toJSON()
                    }).pn_async(my_publish_callback)
                    #sleep(0.2)


            elif("Prediction" in controlCommand["operation"]):
                pubnub.publish().channel('FinanceSub').message({
                    "requester": "Server",
                    "operation": "ReturnStockPredictions" if (assetType == "stock") else "ReturnETFPredictions",
                    assetType: controlCommand[assetType],
                    "data": JSON_Converter.convertStockToJSON(database.get(assetType, controlCommand[assetType]))
                }).pn_async(my_publish_callback)
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
