/*
    The purpose of the displayScript.js file is to
    house all functions that interact with the HTML
    This includes jQuery, HTML DOM, and dynamic HTML
*/


//
//Event handler functions
// vvvvvvvvvvvvvvvvvvvvvv


//Function used when clicking stock-list items to display graph.
function handleChartDisplay(e) {
    if (!e)
        e = window.event;
    var sender = e.srcElement || e.target;
    var ticker = sender.id.split("-")[1];
    setCursor("wait");
    setStockListBackcolor(sender.parentElement.parentElement);
    setActiveStock(ticker);
    getStockDataByTicker(ticker, false, displayStockChart);
}

//Function used when clicking any of the date selector buttons.
function handleFilterDateRange(e) {
    var sender = e.srcElement || e.target;
    var dateRangeValue = sender.innerHTML;
    setDatePickerBackcolor(sender);
    setDateFilterValue(dateRangeValue);
    displayStockChart(getActiveStockTicker());
}

//Function used when switching between Stock and ETF
function handleSwapStockAndETF(e) {
    var sender = e.srcElement || e.target;
    setETFStockPickerBackColor(sender);
    //filter by etf/stock
}

//Function used to delete a stock
function handleDeleteStock(e) {
    var sender = e.srcElement || e.target;
    //deleteStock(getActiveStockTicker(), null);
    deleteStock("a", null);
    document.getElementById("outer-" + getActiveStockTicker()).remove();
}

//Function used to delete a stock
function handleReloadStock(e) {
    var sender = e.srcElement || e.target;
    var ticker = getActiveStockTicker();
    getStockDataByTicker(ticker, true, displayStockChart);
}

//
// Display functions
// vvvvvvvvvvvvvvvvv

//Stock chart display function.
function displayStockChart(ticker) {
    console.log("Displaying Chart");
    //Set stock title and initial date range
    setActiveStockDateRange();


    if (!!document.getElementById("labelPlaceholder")) {
        const newlabel = document.createElement('label');
        newlabel.innerHTML = '  <label class="header-label" id="selected-stock-name"></label>';
        document.getElementById('labelPlaceholder').parentNode.replaceChild(newlabel, document.getElementById('labelPlaceholder'));
    }

    if (!!document.getElementById("graphPlaceholder")) {
        const newGraph = document.createElement('div');
        newGraph.innerHTML = '  <div><canvas id="myChart"></canvas></div>';
        document.getElementById('graphPlaceholder').parentNode.replaceChild(newGraph, document.getElementById('graphPlaceholder'));
    }

    document.getElementById('selected-stock-name').innerHTML = getStockTitleByTicker(ticker);
    //Gather chart values
    var prevClosingValue = getStockInPortfolioByTicker(ticker).getPriceChangeFromPreviousDay();
    var selectedRadioValue = getSelectedRadioButtonValue();
    var chartValues = getChartValuesByTicker(selectedRadioValue, ticker);
    var volumes = getChartVolumeByTicker(selectedRadioValue, ticker);
    var dateValues = getClosingDatesByTicker(ticker);

    //Fill chart
    var ctx = document.getElementById('myChart').getContext('2d');

    for (var i = 0, length = volumes.length; i < length; i++) {
        volumes[i] = volumes[i] / 1000000;
    }
    var gradient = ctx.createLinearGradient(0, 0, 0, Math.max(...chartValues) * 2);
    var lineColor = "#FFFFFF"

    if (parseFloat(prevClosingValue) < 0) {
        gradient.addColorStop(0, 'rgba(255,0,0,0.7)');
        gradient.addColorStop(1, 'rgba(255,0,0,0.1)');
        lineColor = "#FF0000";
    } else {
        gradient.addColorStop(0, 'rgba(0,255,0, 0.7)');
        gradient.addColorStop(1, 'rgba(0,255,0, 0.1)');
        lineColor = "#00FF00";
    }

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dateValues,
            datasets: [{
                label: 'Volume',
                data: volumes,
                backgroundColor: 'black',
                order: 2
            }, {
                label: String(selectedRadioValue) + ' Price',
                type: 'line',
                fill: true,
                data: chartValues,
                borderColor: lineColor,
                backgroundColor: gradient,
                pointHoverBorderColor: "#0000FF",
                pointRadius: 0,
                borderWidth: 1,
                order: 1
            }],
            options: {
                tooltips: {
                    mode: 'nearest',
                    mode: 'x'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        }
    });
    setCursor("default");
}

//Dynamic Stock list display function
function displayStockList() {
    if (!!document.getElementById("listPlaceholder")) {
        const newlist = document.createElement('div');
        newlist.innerHTML = '  <div class="stock-selection-sect" id="stockHeader"></div>';
        document.getElementById('listPlaceholder').parentNode.replaceChild(newlist, document.getElementById('listPlaceholder'));
    }

    var stockHeader = document.getElementById('stockHeader');
    var boxContol = "";
    var index = 0;
    console.log("Displaying Stock List");

    getStocksInPortfolio().forEach(stock => {
        if (index < 20) {
            var cssType;
            if(stock.priceChangeFromPreviousDay < 0){
                cssType = "\"box red detail-label-small\""
            }
            else if(stock.priceChangeFromPreviousDay >= 0){
                cssType = "\"box green detail-label-small\""
            }
            boxContol +=
                "<div onclick = handleChartDisplay(event)>" +
                "   <div name=\"stockSummary\" class=\"stock-selection-summary\" id=\"outer-" + stock.label + "\">" +
                "       <div class=\"stock-selection-left\" id=\"left-" + stock.label + "\">" +
                "           <div class=\"stock-selection-summary-stock-name\"id=\"divName-" + stock.label + "\">" +
                "               <label class=\"detail-label\" id=\"fullName-" + stock.label + "\">" + stock.name + "</label>" +
                "           </div>" +
                "           <div class=\"stock-selection-summary-short-name\" id=\"ticker-" + stock.label + "\">" +
                "               <label class=\"detail-label-small\" id=\"shortName-" + stock.label + "\">" + stock.label + "</label>" +
                "           </div>" +
                "      </div>" +
                "      <div class=\"stock-selection-right\" id=\"right-" + stock.label + "\">" +
                "           <div class=\"stock-selection-summary-price\" id=\"price-" + stock.label + "\">" +
                "               <label class=\"detail-label-price\" id=\"labelPrice-" + stock.label + "\">$" + stock.price + "</label>" +
                "           </div>" +
                "           <div class=\".stock-selection-change-value\" id=\"change-" + stock.label + "\">" +
                "               <label class= " + cssType  + " id=\"labelChange-" + stock.label + "\">" + stock.priceChangeFromPreviousDay + "%</label>" +
                "           </div>" +
                "       </div>" +
                "   </div>" +
                "</div>";

        }
        index++;
    });
    stockHeader.innerHTML = boxContol;
    setDatePickerBackcolor(document.getElementById('button-1W'));
    setETFStockPickerBackColor(document.getElementById('button-stock'));
    getStockDataByTicker(getActiveStockTicker(), false, displayStockChart);
}

//
// Utility functions
//

function getSelectedRadioButtonValue() {
    return document.getElementById('stockPropertyDropdownButton').innerText;
}

//Sets all elements on page to specified cursor.
//https://stackoverflow.com/questions/192900/wait-cursor-over-entire-html-page
function setCursor(cursor) {
    var x = document.querySelectorAll("*");
    for (var i = 0; i < x.length; i++) {
        x[i].style.cursor = cursor;
    }
}

//Sets the back color of the date-picker buttons to indicate which is selected
function setDatePickerBackcolor(sender) {
    var dateButtons = document.getElementsByName('datePicker');
    for (var i = 0; i < dateButtons.length; i++) {
        if (dateButtons[i] == sender) {
            dateButtons[i].style.background = '#FFFFFF';
            dateButtons[i].style.fontWeight = "bold";
            dateButtons[i].style.color = 'black';
            dateButtons[i].style.borderColor = 'black';
        }
        else {
            dateButtons[i].style.background = '#373c42';
            dateButtons[i].style.fontWeight = "normal";
            dateButtons[i].style.color = '#D8D8D8';
        }
    }
}

function setStockListBackcolor(sender) {
    var StockSummarybox = document.getElementsByName('stockSummary');
    for (var i = 0; i < StockSummarybox.length; i++) {
        if (StockSummarybox[i] == sender) {
            StockSummarybox[i].style.background = '#363C41';
            StockSummarybox[i].style.fontWeight = "normal";
            StockSummarybox[i].style.color = 'D8D8D8';
            StockSummarybox[i].style.borderColor = 'black';
        }
        else {
            StockSummarybox[i].style.background = '#2D3134';
            StockSummarybox[i].style.fontWeight = "normal";
            StockSummarybox[i].style.color = '#D8D8D8';
        }
    }
}

//Sets the back color of the Stock/ETF picker buttons to indicate which is selected
function setETFStockPickerBackColor(sender) {
    console.log(myPortfolio);
    var dateButtons = document.getElementsByName('ETForStockPicker');
    for (var i = 0; i < dateButtons.length; i++) {
        if (dateButtons[i] == sender) {
            dateButtons[i].style.background = '#FFFFFF';
            dateButtons[i].style.fontWeight = "bold";
            dateButtons[i].style.color = 'black';
            dateButtons[i].style.borderColor = 'black';
        }
        else {
            dateButtons[i].style.background = '#373c42';
            dateButtons[i].style.fontWeight = "normal";
            dateButtons[i].style.color = '#D8D8D8';
        }
    }
}
