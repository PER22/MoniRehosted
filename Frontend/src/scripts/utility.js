/*
    The purpose of the utilty.js file is to house an instance of the Portflio class.
    Anything that interacts with the user's portfolio exists in this space.
*/

//Instantiate myPortfolio object.
var myPortfolio = new Portfolio();

/*Function that access myPortfolio*/
function getPortfolioTitle() {
    return myPortfolio.getName();
}

function loadStocksFromServer() {
    myPortfolio = new Portfolio();
    myPortfolio.setName("Tester");
    //displayConfigurationBox("Trend", getDisplayValueFilter(), getDateFilterValue());
    getSideBarData(displayStockList);
}

//Returns stocks array from myPortfolio
function getStocksInPortfolio() {
    return myPortfolio.getStocks();
}


//Returns stock object from myPortfolio
function getStockInPortfolioByTicker(ticker) {
    return myPortfolio.getStockByTicker(ticker);
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
    return stock.getStockDates(myPortfolio.getStartDate(), myPortfolio.getEndDate());
}
//Returns array of closing values for a given ticker
function getClosingValuesByTicker(ticker) {
    var stock = myPortfolio.getStockByTicker(ticker);
    return stock.getClosingPrices(myPortfolio.getStartDate(), myPortfolio.getEndDate());
}
//Returns array of opening values for a given ticker
function getOpeningValuesByTicker(ticker) {
    var stock = myPortfolio.getStockByTicker(ticker);
    return stock.getOpeningPrices(myPortfolio.getStartDate(), myPortfolio.getEndDate());
}
//Returns array of high values for a given ticker
function getHighValuesByTicker(ticker) {
    var stock = myPortfolio.getStockByTicker(ticker);
    return stock.getHighPrices(myPortfolio.getStartDate(), myPortfolio.getEndDate());
}
//Returns array of low values for a given ticker
function getLowValuesByTicker(ticker) {
    var stock = myPortfolio.getStockByTicker(ticker);
    return stock.getLowPrices(myPortfolio.getStartDate(), myPortfolio.getEndDate());
}
//Returns array of volume values for a given ticker
function getChartVolumeByTicker(valueType, ticker) {
    var stock = myPortfolio.getStockByTicker(ticker);
    return stock.getVolumes(myPortfolio.getStartDate(), myPortfolio.getEndDate());
}
//Returns array of velocities for a given ticker
function getVelocityValuesByTicker(key, ticker) {
    var stock = myPortfolio.getStockByTicker(ticker);
    var numberOfDays = myPortfolio.getNumberOfStockDetailsInRange();
    return stock.getVelocityByKey(key, numberOfDays);
}
//Sets Portfolio date range based off selected date-picker-button
function setDateRangeByDatePickerButton(datePickerButtonValue) {
    //myPortfolio.setPortfolioDateRange(datePickerButtonValue);
}
//Sets date filter for pulling data to display on chart
function setDateFilterValue(datePickerButtonValue) {
    myPortfolio.setDateFilter(datePickerButtonValue);
}
//Gets date filter for pulling data to display on chart
function getDateFilterValue() {
    return myPortfolio.getDateFilter();
}
//Sets date filter for pulling data to display on chart
function setDisplayFilterValue(displayPickerButtonValue) {
    myPortfolio.setValueFilter(displayPickerButtonValue);
}
//Gets date filter for pulling data to display on chart
function getDisplayValueFilter() {
    return myPortfolio.getValueFilter();
}
//Sets analytic filter for pulling data to display on chart
function setAnalyticFilterValue(analyticPickerButtonValue) {
    myPortfolio.setAnalyticFilter(analyticPickerButtonValue);
}
//Gets analytic filter for pulling data to display on chart
function getAnalyticFilterValue() {
    return myPortfolio.getAnalyticFilter();
}
//Sets analytic filter for pulling data to display on chart
function setMovingAverageFilterValue(movingAveragePickerButtonValues) {
    var activeStock = myPortfolio.getActiveStock();
    activeStock.setMovingAverageFilter(movingAveragePickerButtonValues);
}
//Returns number of days in dateFilter
function getNumberOfDaysByDateFilter(dateFilter) {
    return myPortfolio.translateDateFilterToNumericValue(dateFilter);
}
//Returns array containing Trend1 and Trend 2 dateFilters
function getMovingAverageDateFilter() {
    var activeStock = myPortfolio.getActiveStock();
    return activeStock.getMovingAverageFilter();
}
//Sets date range for current active stock
function setActiveStockDateRange() {
    var activeStock = myPortfolio.getActiveStock();
    myPortfolio.setEndDate(activeStock.data[activeStock.data.length - 1].getDate());
    myPortfolio.setStartDateBasedOnEndDate();
}
//Sets endDate depending on final day in dataset, startDate by offsetting endDate by whichever button is clicked
function setDateRangeByTicker(ticker) {
    var stock = myPortfolio.getStockByTicker(ticker);
    myPortfolio.setEndDate(stock.getData()[stock.getData().length - 1].getDate());
}
//Sets stock currently being displayed by ticker
function setActiveStock(ticker) {
    if (ticker == "") {
        myPortfolio.setActiveStockIndex(0);
    }
    else {
        myPortfolio.setActiveStockIndexByTicker(ticker);
    }
}
//Returns label of stock being currently displayed
function getActiveStockTicker() {
    return myPortfolio.getActiveStockTicker();
}
//Sets Portfolio date range based off selected date-picker-button
function getVolumeValuesByTicker(datePickerButtonValue) {
    var stock = myPortfolio.getStockByTicker(datePickerButtonValue);
    return stock.getVolumes();
}
//Checks if the moving average data already exists in dataset
function doesMovingAverageExist(key) {
    return myPortfolio.validateMovingAverageImport(key);
}
//Checks if velocity array has been filled.
function doesVelocityExist(key) {
    return myPortfolio.validateVelocityImport(key);
}
//Gets moving average from stock
function getActiveStockMovingAverage(key) {
    var activeStock = myPortfolio.getActiveStock();
    var numberOfDays = myPortfolio.getNumberOfStockDetailsInRange();
    return activeStock.getMovingAverageByKey(key, numberOfDays);
}
function getLatestDateInSet(type, key) {
    var activeStock = myPortfolio.getActiveStock();
    var noReload = false;
    if (type == "Trend") {
        noReload = (activeStock.data.length == 0);
    }
    else if (type == "MovingAverage") {
        noReload = !isActiveMovingAverageLoaded(key);
    }
    else if (type == "Velocity") {
        noReload = !isActiveVelocityLoaded();
    }
    return (noReload) ? "" : activeStock.data[activeStock.data.length - 1].getDate();
}

function setIsETFActive(etf) {
    myPortfolio.setIsETF(etf);
}
function getIsETFActive() {
    return myPortfolio.getIsETF();
}

function getETFsInPortfolio() {
    return myPortfolio.getETFs();
}

function isActiveMovingAverageLoaded(key) {
    var activeStock = myPortfolio.getActiveStock();
    return (myPortfolio.validateMovingAverageImport(key));
}
function isActiveVelocityLoaded() {
    var activeStock = myPortfolio.getActiveStock();
    return (Object.keys(activeStock.getVelocity()).length != 0);
}

function getTrendDataByDisplayValue(ticker, displayValue) {
    var data = [];
    if (displayValue == "Highs")
        data = getHighValuesByTicker(ticker);
    else if (displayValue == "Lows")
        data = getLowValuesByTicker(ticker);
    else if (displayValue == "Opening")
        data = getOpeningValuesByTicker(ticker);
    else if (displayValue == "Closing")
        data = getClosingValuesByTicker(ticker);
    return data;
}

//Returns dataset based on selected radio button
function getChartValuesByTicker(valueType, ticker) {
    var analyticFilter = myPortfolio.getAnalyticFilter();
    var valuesArray = [];
    if (analyticFilter == "Moving Average" || analyticFilter == "Crossover") {
        var dataFilters = getMovingAverageDateFilter();
        trendOne = getActiveStockMovingAverage(dataFilters[0] + "-" + myPortfolio.getValueFilter());
        if (analyticFilter == "Crossover") {
            trendTwo = getActiveStockMovingAverage(dataFilters[1] + "-" + myPortfolio.getValueFilter());
            valuesArray = [trendOne, trendTwo, getTrendDataByDisplayValue(ticker, myPortfolio.getValueFilter())];
        }
        else {
            valuesArray = [trendOne, getTrendDataByDisplayValue(ticker, myPortfolio.getValueFilter())];
        }
    }
    else if (analyticFilter == "Velocity") {
        var displayValueFilter = myPortfolio.getValueFilter();
        valuesArray = [getVelocityValuesByTicker(displayValueFilter, ticker), getTrendDataByDisplayValue(ticker, myPortfolio.getValueFilter())];
    }
    else {
        valuesArray = getTrendDataByDisplayValue(ticker, myPortfolio.getValueFilter());
    }
    return valuesArray;
}