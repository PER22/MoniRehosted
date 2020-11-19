/*
    The purpose of the comm.js file is to house all functions that access our Pubnub server.
    Anything that interacts with the server exists here.
*/

//Global PubNub object
pubnub = null;

function subscribePubNub() {
    pubnub = new PubNub({
        publishKey: "pub-c-7a762d1f-b8f0-4463-a1aa-8bb59616f2b4",
        subscribeKey: "sub-c-200f3c34-29f4-11eb-8e02-129fdf4b0d84"
    });
    pubnub.subscribe({
        channels: ['FinanceSub']
    });
    console.log("Subscribed...");
}

//Publishes request to Pubnub server.
function publishMessage(message) {
    var publishPayload = {
        channel: "FinanceSub",
        message: message
    }
    pubnub.publish(publishPayload, function (status, response) { })
}

function requestData(dataString, ticker, operation, field, timePeriod, incremental) {
    var message = "";
    var client = "Client-" + myPortfolio.getPubNubClient();
    switch (dataString) {
        case "deleteStock":
            message = {
                "requester": client,
                "operation": "DeleteStock",
                "asset": ticker
            };
            break;
        case "deleteETF":
            message = {
                "requester": client,
                "operation": "DeleteETF",
                "asset": ticker
            };
            break;
        case "GetStockLabels":
            message = {
                "requester": client,
                "operation": "GetStockLabels",
                "amount": "a"
            };
            break;
        case "GetETFLabels":
            message = {
                "requester": client,
                "operation": "GetETFLabels",
                "amount": "a"
            };
            break;
        case "GetStockData":
            message = {
                "requester": client,
                "operation": "GetStockData",
                "asset": ticker,
                "incremental": (incremental) ? "True" : "False"
            }
            break;
        case "GetETFData":
            message = {
                "requester": client,
                "operation": "GetETFData",
                "asset": ticker,
                "incremental": incremental
            }
            break;
        case "StockMovingAverage":
            message = {
                "requester": client,
                "operation": "StockMovingAverage",
                "asset": ticker,
                "displayValue": field, //"Open"/"Close"/"High"/"Low"
                "numberOfDays": timePeriod, //"100"
                "incremental": incremental
            }
            break;
        case "ETFMovingAverage":
            message = {
                "requester": client,
                "operation": "ETFMovingAverage",
                "asset": ticker,
                "displayValue": field, //"Open"/"Close"/"High"/"Low"
                "numberOfDays": timePeriod, //"100"
                "incremental": incremental
            }
            break;
        case "StockVelocity":
            message = {
                "requester": client,
                "operation": "StockVelocity",
                "asset": ticker,
                "displayValue": field,
                "incremental": incremental
            }
            break;
        case "ETFVelocity":
            message = {
                "requester": client,
                "operation": "ETFVelocity",
                "asset": ticker,
                "displayValue": field,
                "incremental": incremental
            }
            break;
        default:
    }
    return message;
}

function getAnalytics(operation, ticker, displayValue, numberOfDays, dateFilter, _callback) {
    var incremental = updateIncrementally(operation.includes("MovingAverage") ? "MovingAverage" : "Velocity", dateFilter + '-' + displayValue);
    if (operation.includes("MovingAverage") && doesMovingAverageExist(dateFilter + '-' + displayValue) && !incremental) {
        _callback(ticker);
        return;
    }
    if (operation.includes("Velocity") && doesVelocityExist(displayValue) && !incremental) {
        _callback(ticker);
        return;
    }

    var packetIndex = 0;
    var dataRequest = requestData(operation, ticker, operation, displayValue, numberOfDays.toString(), incremental);
    response = [];
    var listener = {
        status: function (statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                publishMessage(dataRequest);
            }
        },
        message: function (msg) {
            if (msg.message.requester == (myPortfolio.getPubNubClient() + 1)) {
                response.push(msg.message);
                packetIndex++;
                console.log("Imported " + ticker + ": " + operation);
                if (packetIndex == msg.message.total) {
                    type = (operation.includes("Stock") ? 'stock' : 'etf');
                    res = [];
                    //Sort response by
                    response.sort((a, b) => {
                        if (a.part > b.part) return 1;
                        else if (a.part < b.part) return -1;
                        else return 0;
                    });
                    //Clean up response
                    for (var i = 0; i < response.length; i++) {
                        response[i].data.split(",").forEach(a => {
                            res.push(parseFloat(a.replace(/[^\d.-]/g, '')));
                        })
                    }
                    console.log(res);
                    if (operation.includes("MovingAverage"))
                        myPortfolio.importMovingAverage(type, ticker, dateFilter + '-' + displayValue, res);
                    else if (operation.includes("Velocity"))
                        myPortfolio.importVelocity(type, displayValue, res);

                    pubnub.removeListener(listener);
                    if (_callback.name == "loadSecondMovingAverage")
                        _callback();
                    else
                        _callback(ticker);
                }
            }
        }
    };
    console.log("Requesting data...");
    pubnub.addListener(listener);

    pubnub.subscribe({
        channels: ['FinanceSub']
    });
}

function getSideBarData(_callback) {
    //Set up variables
    var packetIndex = 0;
    var dataRequest;
    if (getIsETFActive()) {
        dataRequest = requestData("GetETFLabels");
    }
    else {
        dataRequest = requestData("GetStockLabels");
    }
    //Listen for response
    var listener = {
        status: function (statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                publishMessage(dataRequest);
            }
        },
        message: function (msg) {
            if (msg.message.requester == (myPortfolio.getPubNubClient() + 1)) {
                if (getIsETFActive()) {
                    myPortfolio.importETFs(msg.message.data);
                    console.log("Imported SideBar ETF Data");
                }
                else {
                    myPortfolio.importStocks(msg.message.data);
                    console.log("Imported SideBar STOCK Data");
                }

                packetIndex++;
                if (packetIndex == msg.message.total) {
                    pubnub.removeListener(listener);
                    _callback();
                }
            }
        }
    };
    console.log("Requesting data...");
    pubnub.addListener(listener);

    pubnub.subscribe({
        channels: ['FinanceSub']
    });
};



function deleteStock(ticker, _callback) {
    //Set up variables
    var dataRequest = requestData("deleteStock", ticker);

    //Listen for response
    var listener = {
        status: function (statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                publishMessage(dataRequest);
            }
        },
        message: function (msg) {
            if (msg.message.requester == (myPortfolio.getPubNubClient() + 1)) {
                pubnub.removeListener(listener);
                console.log(message);
            }
        }
    };
    console.log("Requesting data...");
    pubnub.addListener(listener);
    pubnub.subscribe({
        channels: ['FinanceSub']
    });
};

function getAssetDataByTicker(ticker, reload, _callback) {
    //Return if stock data is already loaded
    var incremental = updateIncrementally("Trend");
    if (myPortfolio.getStockByTicker(ticker).isLoaded() && !reload && !incremental) {
        _callback(ticker);
        return;
    }
    //Initialize Stock object
    var stock = new Stock();
    var indx = 0;
    var reloaded = false;
    var dataRequest = "";
    if (getIsETFActive()) {
        dataRequest = requestData("GetETFData", ticker, "", "", "", incremental);
    }
    else {
        dataRequest = requestData("GetStockData", ticker, "", "", "", incremental);
    }


    //Listener to wait for response from server
    var listener = {
        status: function (statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                publishMessage(dataRequest);
            }
        },
        message: function (msg) {
            if (msg.message.requester == (myPortfolio.getPubNubClient() + 1)) {
                stock = myPortfolio.getStockByTicker(ticker);
                if (stock.getData() == null || (reload && !reloaded)) {
                    stock.setData([]);
                    reloaded = true;
                }
                msg.message.data.data.forEach(element => { stock.addStockDetailFromServer(element) });
                stock.sortDataByDate();
                console.log("imported " + ticker + " data");
                indx++;
                if (indx == msg.message.total) {
                    stock.setLoaded(true);
                    pubnub.removeListener(listener);
                    _callback(ticker);
                }
            }
        }
    };

    console.log("Requesting data...");
    pubnub.addListener(listener);

    pubnub.subscribe({
        channels: ['FinanceSub']
    });

    console.log(myPortfolio);
}

function updateIncrementally(type,key) {
    var latestDateNumber = new Date(getLatestDateInSet(type, key)).getDate() + 2;
    var currentDateNumber = new Date().getDate();
    return (getLatestDateInSet(type, key) == "" || latestDateNumber == NaN) ? false : (latestDateNumber != currentDateNumber);
}