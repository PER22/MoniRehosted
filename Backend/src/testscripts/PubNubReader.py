from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
import time
import os
pnconfig = PNConfiguration()
pnconfig.publish_key = 'pub-c-7a762d1f-b8f0-4463-a1aa-8bb59616f2b4'
pnconfig.subscribe_key = 'sub-c-200f3c34-29f4-11eb-8e02-129fdf4b0d84'
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