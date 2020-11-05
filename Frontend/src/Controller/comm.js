/*
    The purpose of the comm.js file is to house all functions that access our Pubnub server.
    Anything that interacts with the server exists here.
*/

//Global PubNub object
pubnub = null;

function subscribePubNub() {
    pubnub = new PubNub({
        publishKey: "pub-c-9ec7d15f-4966-4f9e-9f34-b7ca51622aac",
        subscribeKey: "sub-c-08c91d8c-196f-11eb-bc34-ce6fd967af95"
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

function requestData(dataString, ticker, operation, field, timePeriod) {
    var message = "";
    switch (dataString) {
        case "deleteStock":
            message = {
                "requester": "Client",
                "operation": "DeleteStock",
                "stock": ticker
            };
            break;
        case "deleteETF":
            message = {
                "requester": "Client",
                "operation": "DeleteETF",
                "stock": ticker
            };
            break;
        case "getSideBar":
            message = {
                "requester": "Client",
                "operation": "GetStockLabels",
                "amount": "a"
            };
            break;
        case "getStockData":
            message = {
                "requester": "Client",
                "operation": "GetStockData",
                "stock": ticker
            }
            break;
        case "getAnalytics":
            message = {
                "requester": "Client",
                "operation": operation, //"StockMovingAverage",
                "stock": ticker,
                "displayValue": field, //"Open"/"Close"/"High"/"Low"
                "numberOfDays": timePeriod //"100"
            }
            break;
        default:
    }
    return message;
}

function getAnalytics(operation, ticker, displayValue, numberOfDays, date) {
    var packetIndex = 0;
    var dataRequest =requestData('getAnalytics', ticker, operation, displayValue, numberOfDays.toString());
    response =[];

    console.log(dataRequest)
    var listener = {
        status: function (statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                publishMessage(dataRequest);
            }
        },
        message: function (msg) {
            if (msg.message.requester == "Server") {
                response.push(msg.message);
                packetIndex++;
                if (packetIndex == msg.message.total) {
                    type =(operation =="StockMovingAverage"? 'stock': 'etf');
                    res =[];
                    response.sort((a,b) => {
                        if(a.part >b.part) return 1;
                        else if (a.part < b.part) return -1;
                        else return 0;
                    });
                    for(var i =0; i <response.length; i++) {
                        response[i].data.split(",").forEach(a =>{
                            res.push(a.replace(/[^\d.-]/g, ''));
                        })
                    }
                    console.log(res)
                    myPortfolio.importMovingAverage(type, ticker,date+'-'+field, res);
                    pubnub.removeListener(listener);
                }
            }
        }
    };
    pubnub.addListener(listener);

    pubnub.subscribe({
        channels: ['FinanceSub']
    });
}

function getSideBarData(_callback) {
    //Set up variables
    var packetIndex = 0;
    var dataRequest = requestData("getSideBar");

    //Listen for response
    var listener = {
        status: function (statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                publishMessage(dataRequest);
            }
        },
        message: function (msg) {
            if (msg.message.requester == "Server") {
                myPortfolio.importStocks(msg.message.data);
                console.log("Imported SideBarData");
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
};



function deleteStock(ticker, _callback) {
    //Set up variables
    var dataRequest = requestData("deleteStock");

    //Listen for response
    var listener = {
        status: function (statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                publishMessage(dataRequest);
            }
        },
        message: function (msg) {
            if (msg.message.requester == "Server") {
                pubnub.removeListener(listener);
                console.log(message);
            }
        }
    };
    console.log("Requesting data...");
    pubnub.addListener(listener);
};


function getStockDataByTicker(ticker, reload, _callback) {
    //Return if stock data is already loaded
    if (myPortfolio.getStockByTicker(ticker).isLoaded() && !reload) {
        _callback(ticker);
        return;
    }
    //Initialize Stock object
    var stock = new Stock();
    var indx = 0;
    var reloaded = false;
    var dataRequest = requestData("getStockData", ticker);

    //Listener to wait for response from server
   var listener = {
        status: function (statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                publishMessage(dataRequest);
            }
        },
        message: function (msg) {
            if (msg.message.requester == "Server") {
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