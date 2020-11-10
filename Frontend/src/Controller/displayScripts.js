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

//Function used when clicking an item in the DateRange drop down
function handleFilterDateRange(e) {
    var sender = e.srcElement || e.target;
    var dateRangeValue = sender.innerHTML;
    setPeriodDropDownName(dateRangeValue + " v");
    setDateFilterValue(dateRangeValue);
    displayStockChart(getActiveStockTicker(), (document.getElementById("analyticDropdownButton").innerHTML.replace(' v', '') == "Candle Stick"));
}

//Function used when clicking an item in the DisplayValue drop down
function handlFilterDisplayValue(e) {
    var sender = e.srcElement || e.target;
    var displayValue = sender.innerHTML;
    setDisplayFilterValue(displayValue.split(' ')[0]);
    setDisplayValueDropDownName(displayValue + " v");
    var val = document.getElementById("analyticDropdownButton").innerHTML.replace(' v', '');
    if (val == "Moving Average")
        loadMovingAverage();
    else
        displayStockChart(getActiveStockTicker());
}

//Function used when clicking an item in the Analytics drop down
function handleFilterAnalytics(e) {
    var sender = e.srcElement || e.target;
    var analytic = sender.innerHTML;
    setCursor("wait");
    setAnalyticFilterValue(analytic);
    setAnalyticsDropDownName(analytic + " v");
    if (analytic == "Moving Average")
        loadMovingAverage();
    else
        displayStockChart(getActiveStockTicker(), (analytic == "Candle Stick"));
    toggleMovingAverageDateFilterDropDownVisibility((analytic == "Moving Average"));
}

function handleDisplayMovingAverage(e) {
    var sender = e.srcElement || e.target;
    var dateRangeValue = sender.innerHTML;
    setCursor("wait");
    setMovingAverageFilterValue(dateRangeValue);
    setMovingAverageDripDownName(dateRangeValue + " v");
    getAnalytics('StockMovingAverage', getActiveStockTicker(), getDisplayValueFilter(), getMovingAverageDateFilterNumOfDays(), getMovingAverageDateFilter(), displayStockChart);
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
    deleteStock(getActiveStockTicker(), null);
    document.getElementById("outer-" + getActiveStockTicker()).remove();
}

//Function used to delete a stock
function handleReloadStock(e) {
    var sender = e.srcElement || e.target;
    var ticker = getActiveStockTicker();
    getStockDataByTicker(ticker, true, displayStockChart);
}

function loadMovingAverage() {
    var ticker = getActiveStockTicker();
    var displayValue = getDisplayValueFilter();
    var movingAverageDateFilter = getMovingAverageDateFilterNumOfDays();
    var chartDateFilter = getMovingAverageDateFilter();
    getAnalytics('StockMovingAverage', ticker, displayValue, movingAverageDateFilter, chartDateFilter, displayStockChart);
}

//
// Display functions
// vvvvvvvvvvvvvvvvv

//Stock chart display function.
function displayStockChart(ticker, candleChart) {
    console.log("Displaying Chart");
    //Set stock title and initial date range
    setActiveStockDateRange();
    replaceAnimationAfterLoad();

    //Gather chart values
    var stockTitle = getStockTitleByTicker(ticker);
    var prevClosingValue = getStockInPortfolioByTicker(ticker).getPriceChangeFromPreviousDay();
    var lastDay = getStockInPortfolioByTicker(ticker).getLastData();
    var selectedDisplayValue = getSelectedDisplayValue();
    var chartValues = getChartValuesByTicker(selectedDisplayValue, ticker);
    var volumes = getChartVolumeByTicker(selectedDisplayValue, ticker);
    var dateValues = getClosingDatesByTicker(ticker);

    updateHeader(stockTitle, prevClosingValue, lastDay.getOpen(), lastDay.getClose(), lastDay.getLow(), lastDay.getHigh(), lastDay.getVolume(), ticker, prevClosingValue)

    //Wipe chart div
    var chartDiv = document.getElementById('chartDiv');

    var graph = new Graphing();
    if (candleChart)
        graph.displayCandleChart(chartDiv, getHighValuesByTicker(ticker), getLowValuesByTicker(ticker), getOpeningValuesByTicker(ticker), getClosingValuesByTicker(ticker), xData);
    else
        graph.displayTrendChartJS(document.getElementById('myChart').getContext('2d'), [dateValues, dateValues], [chartValues, volumes], true);
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
            if (stock.priceChangeFromPreviousDay < 0) {
                cssType = "\"box red detail-label-small\""
            }
            else if (stock.priceChangeFromPreviousDay >= 0) {
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
                "               <label class= " + cssType + " id=\"labelChange-" + stock.label + "\">" + stock.priceChangeFromPreviousDay + "%</label>" +
                "           </div>" +
                "       </div>" +
                "   </div>" +
                "</div>";

        }
        index++;
    });
    stockHeader.innerHTML = boxContol;
    //setDatePickerBackcolor(document.getElementById('button-1W'));
    //setETFStockPickerBackColor(document.getElementById('button-stock'));
    getStockDataByTicker(getActiveStockTicker(), false, displayStockChart);
}

//
// Utility functions
//

function toggleMovingAverageDateFilterDropDownVisibility(on) {

    document.getElementById("movingAverageDropdownButton").style.display = (on) ? "block" : "none";
}

function getSelectedDisplayValue() {
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

//Sets the back color of the StockList item to indicate which is selected
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

//Updates Period Drop Down name when list item is clicked
function setPeriodDropDownName(name) {
    document.getElementById('periodDropdownButton').innerHTML = name;
}

//Updates Display Value Drop Down name when list item is clicked
function setDisplayValueDropDownName(name) {
    document.getElementById('stockPropertyDropdownButton').innerHTML = name;
}

//Updates Analytics Drop Down name when list item is clicked
function setAnalyticsDropDownName(name) {
    document.getElementById('analyticDropdownButton').innerHTML = name;
}

//Updates Property Drop Down name when list item is clicked
function setMovingAverageDripDownName(name) {
    document.getElementById('movingAverageDropdownButton').innerHTML = name;
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function scrolled(e) {
    if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
        scrolledToBottom(e);
    }
}

function replaceAnimationAfterLoad(stock) {
    //Name of Company
    if (!!document.getElementById("labelPlaceholder")) {
        const newlabel = document.createElement('label');
        newlabel.innerHTML = '  <label class="header-label" id="selected-stock-name"></label>';
        document.getElementById('labelPlaceholder').parentNode.replaceChild(newlabel, document.getElementById('labelPlaceholder'));
    }

    //Price Of Company
    if (!!document.getElementById("pricePlaceholder")) {
        const newlabel = document.createElement('h1');
        newlabel.innerHTML = '  <h1 class="header-label" id="selected-stock-price">340</h1>';
        document.getElementById('pricePlaceholder').parentNode.replaceChild(newlabel, document.getElementById('pricePlaceholder'));
    }

    //Currency and Trend of Company Asset
    if (!!document.getElementById("currencyPlaceholder")) {
        const newlabel = document.createElement('label');
        newlabel.innerHTML = '<div id="selected-stock-trend"></div>' +
            '<br>' +
            '<label class="" id="selected-stock-currency">USD</label>';
        document.getElementById('currencyPlaceholder').parentNode.replaceChild(newlabel, document.getElementById('currencyPlaceholder'));
    }

    //Open / Close Price of Asset
    if (!!document.getElementById("openClosePlaceholder")) {
        const newlabel = document.createElement('label');
        newlabel.innerHTML = '<label class="" id="selected-stock-PreviousClose">Previous Close: </label> ' +
            '<label class="" id=""></label>' +
            '<br>' +
            '<label class="" id="selected-stock-Open">Open: </label>';
        document.getElementById('openClosePlaceholder').parentNode.replaceChild(newlabel, document.getElementById('openClosePlaceholder'));
    }

    //Range / Colume of Asset
    if (!!document.getElementById("rangeVolumePlaceholder")) {
        const newlabel = document.createElement('label');
        newlabel.innerHTML = '<label class="" id="selected-stock-range">Day\'s Range: </label> ' +
            '<br>' +
            '<label class="" id="selected-stock-volume">Volume: </label>';
        document.getElementById('rangeVolumePlaceholder').parentNode.replaceChild(newlabel, document.getElementById('rangeVolumePlaceholder'));
    }

    //Graph of Asset
    if (!!document.getElementById("graphPlaceholder")) {
        const newGraph = document.createElement('div');
        newGraph.innerHTML = '  <div id="chartDiv"><canvas id="myChart"></canvas></div>';
        document.getElementById('graphPlaceholder').parentNode.replaceChild(newGraph, document.getElementById('graphPlaceholder'));
    }
}

function updateHeader(header, prevClosingValue, open, close, low, high, volume, label, priceChangeFromPreviousDay) {

    var cssType;
    if (priceChangeFromPreviousDay < 0) {
        cssType = "\"box red detail-label-small\""
    }
    else {
        cssType = "\"box green detail-label-small\""
    }

    document.getElementById('selected-stock-name').innerHTML = header;
    document.getElementById('selected-stock-price').innerHTML = close;
    document.getElementById('selected-stock-trend').innerHTML = "<div class=\".stock-selection-change-value\" id=\"change-" + label + "\">" +
        "<label class= " + cssType + " id=\"labelChange-" + label + "\">" + priceChangeFromPreviousDay + "%</label>" +
        "</div>";
    document.getElementById('selected-stock-PreviousClose').innerHTML = 'Previous Close: $' + prevClosingValue;
    document.getElementById('selected-stock-Open').innerHTML = 'Open: $' + open;
    document.getElementById('selected-stock-range').innerHTML = 'Day\'s Range: $' + low + ' - $' + high;
    document.getElementById('selected-stock-volume').innerHTML = 'Volume: ' + volume;
}
