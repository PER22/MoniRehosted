var myPortfolio = new Portfolio();

/*Function that access myPortfolio*/
function getPortfolioTitle() {
    return myPortfolio.getName();
}

function loadStocksFromServer() {
    myPortfolio = new Portfolio();
    myPortfolio.setName("Tester");
    getSideBarData(displayStockList);
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
//Returns Stock.name value for a given ticker
function getStockTitleByTicker(ticker) {
    var stock = myPortfolio.getStockByTicker(ticker);
    return stock.getName();
}
//Returns array of dates for a given ticker
function getClosingDatesByTicker(ticker) {
    var stock = myPortfolio.getStockByTicker(ticker);
    return stock.getStockDates();
}
//Returns array of closing values for a given ticker
function getClosingValuesByTicker(ticker) {
    var stock = myPortfolio.getStockByTicker(ticker);
    return stock.getClosingPrices();
}
//Returns array of opening values for a given ticker
function getOpeningValuesByTicker(ticker) {
    var stock = myPortfolio.getStockByTicker(ticker);
    return stock.getClosingPrices();
}
//Returns array of high values for a given ticker
function getHighValuesByTicker(ticker) {
    var stock = myPortfolio.getStockByTicker(ticker);
    return stock.getClosingPrices();
}
//Returns array of low values for a given ticker
function getClosingValuesByTicker(ticker) {
    var stock = myPortfolio.getStockByTicker(ticker);
    return stock.getClosingPrices();
}

function getChartValuesByTicker(valueType, ticker) {
    var valuesArray = [];
    if (valueType == "closing") {
        valuesArray = getClosingValuesByTicker(ticker);
    }
    else if (valueType == "opening") {
        valuesArray = getOpeningValuesByTicker(ticker);
    }
    else if (valueType == "high") {
        valuesArray = getHighValuesByTicker(ticker);
    }
    else if (valueType == "low") {
        valuesArray = getLowValuesByTicker(ticker);
    }
    return valuesArray;
}



//
// Server Access Functions
//  vvvvvvvvvvvvvvvvvvvvv


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
                displayStockList();
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
        publishKey: "pub-c-7cd0dca0-eb36-44f8-bfef-d692af28f7d4",
        subscribeKey: "sub-c-01442846-0b27-11eb-8b70-9ebeb8f513a7"
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
                stock.label = msg.message.assetType
                stock.name = msg.message.data.name
                msg.message.data.data.forEach(element => { stock.AddStockDetailFromServer(element) })
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

    myPortfolio.addStock(stock)
};
