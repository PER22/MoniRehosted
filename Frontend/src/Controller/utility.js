var myPortfolio = new Portfolio();
//const{Stock, StockData} = require('./Model/Stock')

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

//Returns array of closing values for a given ticker
function getClosingValuesByTicker(ticker) {
    var stock = myPortfolio.getStockByTicker(ticker);
    return stock.getClosingPrices();
}
//Returns array of dates for a given ticker
function getClosingValuesByTicker(ticker) {
    var stock = myPortfolio.getStockByTicker(ticker);
    return stock.getStockDates();
}

function getSideBarData(_callback) {

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
    //Initialize Stock object
    var stock = new Stock()
    // Update this block with your publish/subscribe keys
    pubnub = new PubNub({
        publishKey: "pub-c-7cd0dca0-eb36-44f8-bfef-d692af28f7d4",
        subscribeKey: "sub-c-01442846-0b27-11eb-8b70-9ebeb8f513a7"
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
                stock.setData([]);
                msg.message.data.data.forEach(element => { stock.data.push(element) })
                console.log("imported " + ticker + " data");
                _callback(ticker);
            }
        },
        presence: function (presenceEvent) {
        }
    })

    console.log("Subscribing...");

    pubnub.subscribe({
        channels: ['FinanceSub']
    });

    myPortfolio.addStock(stock)
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
                msg.message.data.data.forEach(element => {stock.data.push(element)})
                //stock.data.push(msg.message.data.data)
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
    /*
    stock.data.sort(function(a,b){
        var dateA = new Date(a.Date), dateB = new Date(b.Date);
        return dateA - dateB;
    });
    */
    
   
    myPortfolio.addStock(stock)
};

