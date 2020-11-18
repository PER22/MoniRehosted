from Backend.src.Model.Stock import Stock
from pubnub.callbacks import SubscribeCallback
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from Backend.src.Model.Database import Database
from Backend.src.Model.Analytics import Analytics
import csv
import json
from pubnub.exceptions import PubNubException

import math
import os

def my_publish_callback(envelope, status):
    # Check whether request successfully completed or not
    if not status.is_error():
        print("Request could not be completed")
        pass
class MySubscribeCallback(SubscribeCallback):

    def __init__(self):
        global database
        database = Database("ETFs1", "Stocks1")
        database.load()

    def presence(self, pubnub, presence):
        pass
    def status(self, pubnub, status):
        pass
    def message(self, pubnub, message):
        controlCommand = message.message
        print(message)
        try:
            if("Client" in str(controlCommand["requester"])):
                assetType = ("stock" if ("stock" in controlCommand["operation"].lower()) else "etf")
                print("before")
                serverID = int(str(controlCommand["requester"]).replace("Client-", "")) + 1
                #-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                #-=-=-=-=-=-=-=- Stocks -=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                #-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                if("Labels" in controlCommand["operation"]):
                    listOfLabels = database.getLabels(assetType, controlCommand["amount"])
                    for i in range(len(listOfLabels)):
                        print(str(i) + ". Chunk")
                        pubnub.publish().channel('FinanceSub').message({
                            "requester": serverID,
                            "operation": "ReturnAssetLabels",
                            "amount": controlCommand["amount"],
                            "part": (i + 1),
                            "total": len(listOfLabels),
                            "data": listOfLabels[i]
                        }).pn_async(my_publish_callback)


                elif("Data" in controlCommand["operation"]):
                    originalAsset = database.getChunked(assetType, controlCommand['asset'])
                    for i in range(len(originalAsset)):
                        print(str(i) + ". Chunk")
                        pubnub.publish().channel('FinanceSub').message({
                            "requester": serverID,
                            "operation": "ReturnAssetData",
                            "assetType": controlCommand['asset'],
                            "part": (i + 1),
                            "total": len(originalAsset),
                            "data": originalAsset[i].toJSON()
                        }).pn_async(my_publish_callback)

                elif("Delete" in controlCommand["operation"]):
                    pubnub.publish().channel('FinanceSub').message({
                        "requester": serverID,
                        "operation": "DeleteAsset",
                        "status": database.delete(assetType, controlCommand['asset'])
                    }).pn_async(my_publish_callback)

                elif("Prediction" in controlCommand["operation"]):
                    pubnub.publish().channel('FinanceSub').message({
                        "requester": serverID,
                        "operation": "ReturnAssetPredictions",
                        "assetType": controlCommand['asset'],
                        "data": Stock("Your", "mama", {"open": "4", "cclose": "5"})
                    }).pn_async(my_publish_callback)

                elif("MovingAverage" in controlCommand["operation"]):
                    asset = database.get(assetType, controlCommand['asset'])
                    data = Analytics.calculateMovingAverageChunked(asset, Analytics.fieldFilter(controlCommand["displayValue"]), int(controlCommand["numberOfDays"]))

                    for i in range(len(data)):
                        pubnub.publish().channel('FinanceSub').message({
                            "requester": serverID,
                            "operation": "MovingAverage",
                            "part": (i + 1),
                            "total": len(data),
                            "data": json.dumps(data[i])
                        }).pn_async(my_publish_callback)


                elif("Velocity" in controlCommand["operation"]):
                    asset = database.get(assetType, controlCommand['asset'])
                    data = Analytics.calculateVelocityChunked(asset, Analytics.fieldFilter(controlCommand["displayValue"]))

                    for i in range(len(data)):
                        pubnub.publish().channel('FinanceSub').message({
                            "requester": serverID,
                            "operation": "Velocity",
                            "part": (i + 1),
                            "total": len(data),
                            "data": json.dumps(data[i])
                        }).pn_async(my_publish_callback)

                elif("CrossOver" in controlCommand["operation"]):
                    asset = database.get(assetType, controlCommand['asset'])

                    pubnub.publish().channel('FinanceSub').message({
                        "requester": serverID,
                        "operation": "CrossOver",
                        "status": Analytics.calculateCrossOver(asset, Analytics.fieldFilter(controlCommand["displayValue"]), int(controlCommand["firstTimePeriod"]), int(controlCommand["secondTimePeriod"]))
                    }).pn_async(my_publish_callback)

                else:
                    print("OOPS something went wrong")
            else:
                pass
        except PubNubException as e:
            print("\n\nThere was an error with the request\n\n")

class Cloud:
    def __init__(self):
        pnconfig = PNConfiguration()
        pnconfig.publish_key = 'pub-c-9ec7d15f-4966-4f9e-9f34-b7ca51622aac'
        pnconfig.subscribe_key = 'sub-c-08c91d8c-196f-11eb-bc34-ce6fd967af95'
        global pubnub
        pubnub = PubNub(pnconfig)

        pubnub.add_listener(MySubscribeCallback())
        pubnub.subscribe().channels("FinanceSub").execute()





def testReturn():
    dirname = (os.path.dirname(__file__))[:-11] #adrd
    filename = os.path.join(dirname, 'data/Stocks/vz.us.txt')
    refferenceVal = 120 #3494

    with open(filename, 'r') as f:
        data = list(csv.DictReader(f))

    rowsLeftover = len(data)
    total = len(data)
    numChunks = int(math.ceil(rowsLeftover / refferenceVal))

    chunkList = []

    for i in range(numChunks):
        if(refferenceVal <= rowsLeftover):
            chunkList.append(Stock("Penis", "pns", data[total-rowsLeftover: refferenceVal * (i + 1)]))
            rowsLeftover -= refferenceVal
        else:
            chunkList.append(Stock("Penis", "pns", data[total-rowsLeftover: total -1]))


    return(chunkList)