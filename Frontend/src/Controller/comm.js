/*
    The purpose of the comm.js file is to house all functions that access our Pubnub server.
    Anything that interacts with the server exists here.
*/

function requestData(dataString) {
    switch (dataString) {
        case "deleteStock":
            // code block
            break;
        case "deleteETF":
            // code block
            break;
        default:
        // code block
    }
}

function deleteStock(ticker, _callback) {

    // Update this block with your publish/subscribe keys
    pubnub = new PubNub({
        publishKey: "pub-c-9ec7d15f-4966-4f9e-9f34-b7ca51622aac",
        subscribeKey: "sub-c-08c91d8c-196f-11eb-bc34-ce6fd967af95"
    })

    function publishSampleMessage() {
        console.log("Publish to a channel 'FinanceSub'");
        // With the right payload, you can publish a message, add a reaction to a message,
        // send a push notification, or send a small payload called a signal.
        var publishPayload = {
            channel: "FinanceSub",
            message: {
                "requester": "Client",
                "operation": "DeleteStock",
                "stock": ticker
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
            if (msg.message.requester == "Server") {
                console.log(message.data);
                _callback();
            }
        },
    })

    console.log("Subscribing...");

    pubnub.subscribe({
        channels: ['FinanceSub']
    });
};


function getSideBarData(_callback) {

    // Update this block with your publish/subscribe keys
    pubnub = new PubNub({
        publishKey: "pub-c-9ec7d15f-4966-4f9e-9f34-b7ca51622aac",
        subscribeKey: "sub-c-08c91d8c-196f-11eb-bc34-ce6fd967af95"
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
                "amount": "a"
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
                console.log(msg.message);
                _callback();
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

function getStockDataByTicker(ticker, _callback) {
    //Return if stock data is already loaded
    if (myPortfolio.getStockByTicker(ticker).isLoaded()) {
        _callback(ticker);
        return;
    }
    //Initialize Stock object
    var stock = new Stock();
    var indx = 0;
    // Update this block with your publish/subscribe keys
    pubnub = new PubNub({
        publishKey: "pub-c-9ec7d15f-4966-4f9e-9f34-b7ca51622aac",
        subscribeKey: "sub-c-08c91d8c-196f-11eb-bc34-ce6fd967af95"
    })

    //Publishes data request to server
    function publishSampleMessage() {
        console.log("Publish to a channel 'FinanceSub'");
        var publishPayload = {
            channel: "FinanceSub",
            message: {
                "requester": "Client",
                "operation": "GetStockData",
                "stock": ticker
            }
        }
        pubnub.publish(publishPayload, function (status, response) {
        });
    }

    //Listener to wait for response from server
    pubnub.addListener({
        status: function (statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                publishSampleMessage();
            }
        },
        message: function (msg) {
            if (msg.message.requester == "Server") {
                stock = myPortfolio.getStockByTicker(ticker);
                if (stock.getData() == null) stock.setData([]);
                msg.message.data.data.forEach(element => { stock.addStockDetailFromServer(element) });
                stock.sortDataByDate();
                console.log("imported " + ticker + " data");
                indx++;
                if (indx == msg.message.total) {
                    stock.setLoaded(true);
                    _callback(ticker);
                }
            }
            else {
                var test = msg.message.data;
            }
        },
        presence: function (presenceEvent) {
        }
    })

    console.log("Subscribing...");

    pubnub.subscribe({
        channels: ['FinanceSub']
    });


    console.log(myPortfolio);
}

function getData(label) {

    // Update this block with your publish/subscribe keys
    pubnub = new PubNub({
        publishKey: "pub-c-9ec7d15f-4966-4f9e-9f34-b7ca51622aac",
        subscribeKey: "sub-c-08c91d8c-196f-11eb-bc34-ce6fd967af95"
    })
    var stock = new Stock()
    function publishSampleMessage() {
        console.log("Publish to a channel 'FinanceSub'");
        // With the right payload, you can publish a message, add a reaction to a message,
        // send a push notification, or send a small payload called a signal.
        var publishPayload = {
            channel: "FinanceSub",
            message: {
                "requester": "Client",
                "operation": "GetStockData",
                "stock": label
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
                stock.label = msg.message.assetType;
                stock.name = msg.message.data.name;
                msg.message.data.data.forEach(element => { stock.AddStockDetailFromServer(element) });
                console.log(msg.message);
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

    myPortfolio.addStock(stock)
};
