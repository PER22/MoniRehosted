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
    setAnalyticFilterValue("Trend");
    setAnalyticsDropDownName("Trend v");
    displayConfigurationBox("Trend", getDisplayValueFilter(), getDateFilterValue());
    getStockDataByTicker(ticker, false, displayStockChart);
}

//Function used when clicking an item in the DateRange drop down
function handleFilterDateRange(e) {
    var sender = e.srcElement || e.target;
    var dateRangeValue = sender.innerHTML;
    setPeriodDropDownName(sender, dateRangeValue + " v");
    setDateFilterValue(dateRangeValue);
    displayStockChart(getActiveStockTicker(), (document.getElementById("analyticDropdownButton").innerHTML.replace(' v', '') == "Candle Stick"));
}

//Function used when clicking an item in the DisplayValue drop down
function handleFilterDisplayValue(e) {
    setCursor("wait");
    var sender = e.srcElement || e.target;
    var displayValue = sender.innerHTML;
    setDisplayFilterValue(displayValue.split(' ')[0]);
    setDisplayValueDropDownName(displayValue + " v");
    var val = document.getElementById("analyticDropdownButton").innerHTML.replace(' v', '');
    if (val == "Moving Average" || val == "Crossover")
        loadMovingAverage(val == "Crossover");
    else if (val == "Velocity")
        loadVelocity();
    else
        displayStockChart(getActiveStockTicker(), val == "Candle Stick");
}

//Function used when clicking an item in the Analytics drop down
function handleFilterAnalytics(e) {
    var sender = e.srcElement || e.target;
    var analytic = sender.innerHTML;
    setCursor("wait");
    setAnalyticFilterValue(analytic);
    setAnalyticsDropDownName(analytic + " v");
    if (analytic == "Moving Average" || analytic == "Crossover")
        loadMovingAverage(analytic == "Crossover");
    else if (analytic == "Velocity")
        loadVelocity();
    else
        displayStockChart(getActiveStockTicker(), (analytic == "Candle Stick"));
    if ((analytic == "Candle Stick"))
        toggleChartJSVisibility(false);
    displayConfigurationBox(analytic, getDisplayValueFilter(), getDateFilterValue());
}

//Function used when changing a period drop down for Moving Average
function handleFilterMovingAverage(e) {
    setCursor("wait");
    var sender = e.srcElement || e.target;
    var dateRangeValue = sender.innerHTML;
    var trendOneFilter = document.getElementById('trendOnePeriodDropDown').innerHTML.replace(' v', '');
    var trendTwoFilter = (getAnalyticFilterValue() == "Crossover") ? document.getElementById('trendTwoPeriodDropDown').innerHTML.replace(' v', '') : "";
    if (sender.parentElement.parentElement.firstElementChild.id == "trendTwoPeriodDropDown") {
        trendTwoFilter = dateRangeValue;
    }
    else {
        trendOneFilter = dateRangeValue;
    }
    setPeriodDropDownName(sender, dateRangeValue + " v");
    setMovingAverageFilterValue((getAnalyticFilterValue() == "Crossover") ? [trendOneFilter, trendTwoFilter] : [trendOneFilter]);
    getAnalytics('StockMovingAverage', getActiveStockTicker(), getDisplayValueFilter(), getNumberOfDaysByDateFilter(dateRangeValue), dateRangeValue, displayStockChart);
}


//Function used when clicking 'Moving Average' in the Analytics drop down
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
    setCursor("wait");
    getStockDataByTicker(ticker, true, displayStockChart);
}

//
// Display functions
// vvvvvvvvvvvvvvvvv

//Stock chart display function.
function displayStockChart(ticker, candleChart) {
    if (document.getElementById('testDiv').innerHTML.trim() == "") {
        displayConfigurationBox(getAnalyticFilterValue(), getDisplayValueFilter(), getDateFilterValue());
    }
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
    if (Array.isArray(chartValues[0])) {
        dateValues = []
        for (var i = 0; i < chartValues.length; i++) {
            dateValues.push(getClosingDatesByTicker(ticker));
        }
    }
    else if (!candleChart) {
        chartValues = [chartValues];
        dateValues = [dateValues];
    }

    updateHeader(stockTitle, prevClosingValue, lastDay.getOpen(), lastDay.getClose(), lastDay.getLow(), lastDay.getHigh(), lastDay.getVolume(), ticker, prevClosingValue)


    var graph = new Graphing();
    var chartDiv = document.getElementById('chartDiv');
    if (candleChart)
        graph.displayCandleChart(chartDiv, getHighValuesByTicker(ticker), getLowValuesByTicker(ticker), getOpeningValuesByTicker(ticker), getClosingValuesByTicker(ticker), dateValues);
    else
        graph.displayTrendChartJS(chartDiv, dateValues, chartValues, (prevClosingValue > 0));
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
    getStockDataByTicker(getActiveStockTicker(), false, displayStockChart);
}

function displayConfigurationBox(analyticFilter, displayValue, period) {
    var headerDiv = document.getElementById('testDiv');
    var displayConfigurationBox =
        "<div id=\"divConfigurationBox\">" +
        createAnalyticsDiv(analyticFilter) +
        createDefaultsDiv(displayValue, period) +
        createConfigurationDiv(analyticFilter) +
        createActionsDiv() +
        "</div>";
    headerDiv.innerHTML = displayConfigurationBox;
    return displayConfigurationBox;
}

function createAnalyticsDiv(analyticFilter) {
    var analyticsDiv =
        "<div id=\"divAnalytics\" class=\"horizontal-container\">" +
        "    <div class=\"title-container\">" +
        "             <label>Select Analytic</label>" +
        "    </div>" +
        "    <div class=\"horizontal-container\">" +
        "           <li class=\"dropdown\">" +
        "                   <a class=\"dropbtn\" id=\"analyticDropdownButton\">" + analyticFilter + " v</a>" +
        "                   <div class=\"dropdown-content\">" +
        "                        <a onclick=\"handleFilterAnalytics(event)\">Trend</a>" +
        "                        <a onclick=\"handleFilterAnalytics(event)\">Candle Stick</a>" +
        "                        <a onclick=\"handleFilterAnalytics(event)\">Moving Average</a>" +
        "                        <a onclick=\"handleFilterAnalytics(event)\">Crossover</a>" +
        "                        <a onclick=\"handleFilterAnalytics(event)\">Velocity</a>" +
        "                    </div>" +
        "           </li>" +
        "    </div>" +
        "</div>";
    return analyticsDiv;
}

function createDefaultsDiv(displayValue, period) {
    var defaultsDiv =
        "<div id=\"divAnalytics\">" +
        "    <div class=\"row\">" +
        "           <div class=\"col m8 padding-small txt-center\">" +
        "                  <label style=\"text-decoration: underline;\">Display Value</label>" +
        "                   <li class=\"dropdown\">" +
        "                       <a class=\"dropbttn\" id=\"stockPropertyDropdownButton\">" + displayValue + " Prices v</a>" +
        "                           <div class=\"dropdown-content\">" +
        "                               <a id=\"Closing Prices v\" onclick=\"handleFilterDisplayValue(event)\">Closing Prices</a>" +
        "                               <a id=\"Opening Prices v\" onclick=\"handleFilterDisplayValue(event)\">Opening Prices</a>" +
        "                               <a id=\"Highs v\" onclick=\"handleFilterDisplayValue(event)\">Highs</a>" +
        "                               <a id=\"Lows v\" onclick=\"handleFilterDisplayValue(event)\">Lows</a>" +
        "                           </div>" +
        "                   </li>" +
        "           </div>" +
        "            <div class=\"col m4 padding-small txt-center\">" +
        "                   <label style=\"text-decoration: underline;\">Period</label>" +
        "                       <li class=\"dropdown\">" +
        "                           <a class=\"dropbttn\" id=\"periodDropdownButton\">" + period + " v</a>" +
        "                                <div class=\"dropdown-content\">" +
        "                                   <a id=\"1W v\" onclick=\"handleFilterDateRange(event)\">1W</a>" +
        "                                   <a id=\"1M v\" onclick=\"handleFilterDateRange(event)\">1M</a>" +
        "                                   <a id=\"3M v\" onclick=\"handleFilterDateRange(event)\">3M</a>" +
        "                                   <a id=\"6M v\" onclick=\"handleFilterDateRange(event)\">6M</a>" +
        "                                   <a id=\"1Y v\" onclick=\"handleFilterDateRange(event)\">1Y</a>" +
        "                                   <a id=\"2Y v\" onclick=\"handleFilterDateRange(event)\">2Y</a>" +
        "                                   <a id=\"5Y v\" onclick=\"handleFilterDateRange(event)\">5Y</a>" +
        "                                   <a id=\"10Y v\" onclick=\"handleFilterDateRange(event)\">10Y</a>" +
        "                                   <a id=\"ALL v\" onclick=\"handleFilterDateRange(event)\">ALL</a>" +
        "                             </div>" +
        "                      </li>" +
        "            </div>" +
        "    </div>" +
        "</div>";
    return defaultsDiv;
}

function createConfigurationDiv(analytic) {
    var configurationDiv = "";
    if (analytic == "Moving Average") {
        configurationDiv = createMovingAverageConfigurationDiv();
    }
    else if (analytic == "Crossover") {
        configurationDiv = createCrossoverConfigurationDiv();
    }
    return configurationDiv;
}

function createMovingAverageConfigurationDiv() {
    var configurationDiv =
        "<div id=\"divConfigurations\">" +
        "    <div class=\"title-container\">" +
        "             <label>Configuration</label>" +
        "    </div>" +
        "    <div class=\"row\">" +
        "           <div class=\"col m4 padding-small centered\">" +
        "               <label style=\"text-decoration: underline;\">Trend 1</label>" +
        "               <li class=\"dropdown\">" +
        "                       <a class=\"dropbtn\" id=\"trendOnePeriodDropDown\">1W v</a>" +
        "                       <div class=\"dropdown-content\">" +
        "                           <a id=\"1W v\" onclick=\"handleFilterMovingAverage(event)\">1W</a>" +
        "                           <a id=\"1M v\" onclick=\"handleFilterMovingAverage(event)\">1M</a>" +
        "                           <a id=\"3M v\" onclick=\"handleFilterMovingAverage(event)\">3M</a>" +
        "                           <a id=\"6M v\" onclick=\"handleFilterMovingAverage(event)\">6M</a>" +
        "                           <a id=\"1Y v\" onclick=\"handleFilterMovingAverage(event)\">1Y</a>" +
        "                           <a id=\"2Y v\" onclick=\"handleFilterMovingAverage(event)\">2Y</a>" +
        "                           <a id=\"5Y v\" onclick=\"handleFilterMovingAverage(event)\">5Y</a>" +
        "                           <a id=\"10Y v\" onclick=\"handleFilterMovingAverage(event)\">10Y</a>" +
        "                           <a id=\"ALL v\" onclick=\"handleFilterMovingAverage(event)\">ALL</a>" +
        "                    </div>" +
        "               </li>" +
        "           </div>" +
        "    </div>" +
        "</div>";
    return configurationDiv;
}
function createCrossoverConfigurationDiv() {
    var configurationDiv =
        "<div id=\"divConfigurations\">" +
        "    <div class=\"title-container\">" +
        "             <label>Configuration</label>" +
        "    </div>" +
        "    <div class=\"row\">" +
        "           <div class=\"col m4 padding-small centered\">" +
        "               <label style=\"text-decoration: underline;\">Trend 1</label>" +
        "               <li class=\"dropdown\">" +
        "                       <a class=\"dropbtn\" id=\"trendOnePeriodDropDown\">1W v</a>" +
        "                       <div class=\"dropdown-content\">" +
        "                           <a id=\"1W v\" onclick=\"handleFilterMovingAverage(event)\">1W</a>" +
        "                           <a id=\"1M v\" onclick=\"handleFilterMovingAverage(event)\">1M</a>" +
        "                           <a id=\"3M v\" onclick=\"handleFilterMovingAverage(event)\">3M</a>" +
        "                           <a id=\"6M v\" onclick=\"handleFilterMovingAverage(event)\">6M</a>" +
        "                           <a id=\"1Y v\" onclick=\"handleFilterMovingAverage(event)\">1Y</a>" +
        "                           <a id=\"2Y v\" onclick=\"handleFilterMovingAverage(event)\">2Y</a>" +
        "                           <a id=\"5Y v\" onclick=\"handleFilterMovingAverage(event)\">5Y</a>" +
        "                           <a id=\"10Y v\" onclick=\"handleFilterMovingAverage(event)\">10Y</a>" +
        "                           <a id=\"ALL v\" onclick=\"handleFilterMovingAverage(event)\">ALL</a>" +
        "                    </div>" +
        "               </li>" +
        "           </div>" +
        "            <div class=\"col m4 padding-small centered\">" +
        "               <label style=\"text-decoration: underline;\">Trend 2</label>" +
        "               <li class=\"dropdown\">" +
        "                       <a class=\"dropbtn\" id=\"trendTwoPeriodDropDown\">3M v</a>" +
        "                       <div class=\"dropdown-content\">" +
        "                           <a id=\"1W v\" onclick=\"handleFilterMovingAverage(event)\">1W</a>" +
        "                           <a id=\"1M v\" onclick=\"handleFilterMovingAverage(event)\">1M</a>" +
        "                           <a id=\"3M v\" onclick=\"handleFilterMovingAverage(event)\">3M</a>" +
        "                           <a id=\"6M v\" onclick=\"handleFilterMovingAverage(event)\">6M</a>" +
        "                           <a id=\"1Y v\" onclick=\"handleFilterMovingAverage(event)\">1Y</a>" +
        "                           <a id=\"2Y v\" onclick=\"handleFilterMovingAverage(event)\">2Y</a>" +
        "                           <a id=\"5Y v\" onclick=\"handleFilterMovingAverage(event)\">5Y</a>" +
        "                           <a id=\"10Y v\" onclick=\"handleFilterMovingAverage(event)\">10Y</a>" +
        "                           <a id=\"ALL v\" onclick=\"handleFilterMovingAverage(event)\">ALL</a>" +
        "                       </div>" +
        "               </li>" +
        "            </div>" +
        "    </div>" +
        "</div>";
    return configurationDiv;
}

function createActionsDiv() {
    var actionsDiv =
        "<div class=\"row\" id=\"divActions\" >" +
        "    <div class=\"title-container\">" +
        "             <label>Actions</label>" +
        "    </div>" +
        "<div class=\"col m4 padding-small\">" +
        "    <a onclick=\"handleReloadStock(event)\" class=\"dropbtn\">Reload</a>" +
        "</div>" +
        "<div class=\"col m4 padding-small\">" +
        "    <a  onclick=\"handleDeleteStock(event)\" class=\"dropbtn\">Delete</a>" +
        "</div>" +
        "<div class=\"col m4 padding-small\">" +
        "    <a class=\"dropbtn\">Export</a>" +
        "</div>" +
        "</div>";
    return actionsDiv;
}

//
// Utility functions
//

function loadVelocity() {
    var ticker = getActiveStockTicker();
    var displayValue = getDisplayValueFilter();
    var dateFilter = getDateFilterValue();
    getAnalytics('StockVelocity', ticker, displayValue, 0, dateFilter, displayStockChart);
}

function loadMovingAverage(crossover) {
    var ticker = getActiveStockTicker();
    var displayValue = getDisplayValueFilter();
    var dateFilters = (crossover) ? ["1W", "3M"] : getMovingAverageDateFilter();
    var movingAverageDateFilter = getNumberOfDaysByDateFilter(dateFilters[0]);
    getAnalytics('StockMovingAverage', ticker, displayValue, movingAverageDateFilter, dateFilters[0], (crossover) ? loadSecondMovingAverage : displayStockChart);
}

function loadSecondMovingAverage() {
    var ticker = getActiveStockTicker();
    var displayValue = getDisplayValueFilter();
    var dateFilters = (crossover) ? ["1W", "3M"] : getMovingAverageDateFilter();
    var movingAverageDateFilter = getNumberOfDaysByDateFilter(dateFilters[1]);
    getAnalytics('StockMovingAverage', ticker, displayValue, movingAverageDateFilter, dateFilters[1], displayStockChart);
}

function toggleMovingAverageDateFilterDropDownVisibility(on) {

    document.getElementById("movingAverageDropdownButton").style.display = (on) ? "block" : "none";
}
function toggleChartJSVisibility(on) {
    document.getElementById('myChart').style.display = (on) ? "block" : "none";
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
function setPeriodDropDownName(sender, name) {
    sender.parentElement.parentElement.firstElementChild.innerHTML = name;
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
