var myPortfolio = new Portfolio();

/*Function that access myPortfolio*/
function getPortfolioTitle() {
    return myPortfolio.getName();
}

function loadStocksFromServer() {
    myPortfolio = new Portfolio();
    myPortfolio.setName("Tester");
    getSideBarData();
}

//Returns stocks array from myPortfolio
function getStocksInPortfolio() {
    return myPortfolio.getStocks();
}

//Returns dates array from myPortfolio
function getDatesInPortfolio() {
    return myPortfolio.getDates();
}

//Returns array of lows from myPortfolio
function getLowsInPortfolio() {
    return myPortfolio.getLows();
}

function getSideBarData() {

    // Update this block with your publish/subscribe keys
    pubnub = new PubNub({
        publishKey: "pub-c-7cd0dca0-eb36-44f8-bfef-d692af28f7d4",
        subscribeKey: "sub-c-01442846-0b27-11eb-8b70-9ebeb8f513a7"
    })

    function publishSampleMessage() {
        console.log("Publish to a channel 'FinanceSub'");
        // With the right payload, you can publish a message, add a reaction to a message,
        // send a push notification, or send a small payload called a signal.
        var publishPayload = {
            channel: "FinanceSub",
            message: {
                "requester": "Client",
                "operation": "GetStockLabels",
                "amount": "100"
            }
        }
        pubnub.publish(publishPayload, function (status, response) {
            //console.log(status, response);
        })
    }

    pubnub.addListener({
        status: function (statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                publishSampleMessage();
            }
        },
        message: function (msg) {
            //console.log(msg.message);
            if (msg.message.requester == "Server") {
                myPortfolio.importStocks(msg.message.data);
                console.log("imported");               
            }
        },
        presence: function (presenceEvent) {
            // This is where you handle presence. Not important for now :)
        }
    })

    console.log("Subscribing...");

    pubnub.subscribe({
        channels: ['FinanceSub']
    });
};

function getData() {

    // Update this block with your publish/subscribe keys
    pubnub = new PubNub({
        publishKey: "pub-c-7cd0dca0-eb36-44f8-bfef-d692af28f7d4",
        subscribeKey: "sub-c-01442846-0b27-11eb-8b70-9ebeb8f513a7"
    })

    function publishSampleMessage() {
        console.log("Publish to a channel 'FinanceSub'");
        // With the right payload, you can publish a message, add a reaction to a message,
        // send a push notification, or send a small payload called a signal.
        var publishPayload = {
            channel: "FinanceSub",
            message: {
                "requester": "Client",
                "operation": "GetStockData",
                "stock": "TSLA"
            }
        }
        pubnub.publish(publishPayload, function (status, response) {
            //console.log(status, response);
        })
    }

    pubnub.addListener({
        status: function (statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                publishSampleMessage();
            }
        },
        message: function (msg) {
            //console.log(msg.message);
            if (msg.message.requester == "Server") {
                console.log(msg.message)
                console.log("imported");
            }
        },
        presence: function (presenceEvent) {
            // This is where you handle presence. Not important for now :)
        }
    })

    console.log("Subscribing...");

    pubnub.subscribe({
        channels: ['FinanceSub']
    });
};