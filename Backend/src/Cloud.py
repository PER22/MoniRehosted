#Import the Modules Required
import time
from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory, PNOperationType
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from StockTypes import StockTypes
from Stock import Stock
from JSON_Converter import JSON_Converter
import json

class MySubscribeCallback(SubscribeCallback):
    def presence(self, pubnub, presence):
        pass  # handle incoming presence data

    def status(self, pubnub, status):
        if status.category == PNStatusCategory.PNUnexpectedDisconnectCategory:
            pass  # This event happens when radio / connectivity is lost

        elif status.category == PNStatusCategory.PNConnectedCategory:
            # Connect event. You can do stuff like publish, and know you'll get it.
            # Or just use the connected event to confirm you are subscribed for
            # UI / internal notifications, etc
            pubnub.publish().channel('FinanceSub').message('Hello world!')
        elif status.category == PNStatusCategory.PNReconnectedCategory:
            pass
            # Happens as part of our regular operation. This event happens when
            # radio / connectivity is lost, then regained.
        elif status.category == PNStatusCategory.PNDecryptionErrorCategory:
            pass
            # Handle message decryption error. Probably client configured to
            # encrypt messages and on live data feed it received plain text.

    def message(self, pubnub, message):
        if(message.has_key("requester") and (message["requester"] == "Client")):
            controlCommand = message.message
            if(controlCommand.has_key("operation")):
                if(controlCommand["operation"] == "GetStockLabels"):
                    response = json.dumps(JSON_Converter.buildJSON("Server", "ReturnStockLabels", "amount", controlCommand["amount"],
                                                                   JSON_Converter.convertListToJSON(self.database.getLabels("stock", controlCommand["amount"]))))

                    print(response)
                    pubnub.publish().channel('FinanceSub').message(response)
                elif(controlCommand["operation"] == "GetStockData"):


                    response = JSON_Converter.convertStockToJSON(self.database.get("stock", controlCommand["stock"]))
                    pubnub.publish(channel="FinanceSub", message=response)
                elif(controlCommand["operation"] == "GetStockPrediction"):
                    self.database.get("stock", controlCommand["stock"])

                elif(controlCommand["operation"] == "GetETFLabels"):
                    response = JSON_Converter.buildJSON("Server", "ReturnETFLabels", "amount", controlCommand["amount"],
                                                        JSON_Converter.convertListToJSON(self.database.getLabels("stock", controlCommand["amount"])))
                elif(controlCommand["operation"] == "GetETFData"):
                    self.database.get("etf", controlCommand["etf"])
                elif(controlCommand["operation"] == "GetETFPrediction"):
                    self.database.get("etf", controlCommand["etf"])
                else:
                    print("OOPS something went wrong")
            else:
                pass
        else:
            pass





class Cloud:
    # Initialize the Pubnub Keys
    g_pub_key = "pub-c-7cd0dca0-eb36-44f8-bfef-d692af28f7d4"
    g_sub_key = "sub-c-01442846-0b27-11eb-8b70-9ebeb8f513a7"
    database = StockTypes([], [])


    def __init__(self):
        #Pubnub Initialization
        pnconfig = PNConfiguration()
        global pubnub

        pnconfig.subscribe_key = self.g_pub_key
        pnconfig.publish_key = self.g_sub_key
        pnconfig.uuid = 'FinanceServerUUID98721340123984'

        pubnub = PubNub(pnconfig)

        pubnub.add_listener(MySubscribeCallback())
        pubnub.subscribe().channels('FinanceSub').execute()

        pubnub.publish().channel("my_channel").message({
            'name': 'Alex',
            'online': True
        }).sync()