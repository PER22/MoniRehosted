from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
import time
import os
pnconfig = PNConfiguration()
pnconfig.publish_key = 'pub-c-9ec7d15f-4966-4f9e-9f34-b7ca51622aac'
pnconfig.subscribe_key = 'sub-c-08c91d8c-196f-11eb-bc34-ce6fd967af95'
pnconfig.ssl = True
pubnub = PubNub(pnconfig)
def my_publish_callback(envelope, status):
    # Check whether request successfully completed or not
    if not status.is_error():
        pass
class MySubscribeCallback(SubscribeCallback):
    def presence(self, pubnub, presence):
        pass
    def status(self, pubnub, status):
        pass
    def message(self, pubnub, message):
        print("From server: " + str(message.message))
pubnub.add_listener(MySubscribeCallback())
pubnub.subscribe().channels("FinanceSub").execute()
## publish a message
while True:
    msg = input("Input a message to publish: ")
    if msg == 'exit': os._exit(1)
    #pubnub.publish().channel("FinanceSub").message(str(msg)).pn_async(my_publish_callback)