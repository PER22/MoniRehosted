class Portfolio {
    constructor() {
        this.name;
        this.owner;
        this.stocks = [];
        this.startDate;
        this.endDate;
        this.activeStockIndex = 0;
        this.dateFilter = "3M";
        this.valueFilter = "Closing";
        this.analyticFilter = "Trend";
    }
    setName(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    setOwner(owner) {
        this.owner = owner;
    }
    getOwner() {
        return this.owner;
    }
    setStartDate(startDate) {
        this.startDate = startDate;
    }
    getStartDate() {
        return this.startDate;
    }
    setEndDate(endDate) {
        this.endDate = endDate;
    }
    getEndDate() {
        return this.endDate;
    }
    setLows(lows) {
        this.lows = lows;
    }
    getLows() {
        return this.lows;
    }
    setDateFilter(dateFilter) {
        this.dateFilter = dateFilter;
    }
    getDateFilter() {
        return this.dateFilter;
    }
    setValueFilter(valueFilter) {
        this.valueFilter = valueFilter;
    }
    getValueFilter() {
        return this.valueFilter;
    }
    setAnalyticFilter(analyticFilter) {
        this.analyticFilter = analyticFilter;
    }
    getAnalyticFilter() {
        return this.analyticFilter;
    }
    setMovingAverageFilter(analyticFilter) {
        this.analyticFilter = analyticFilter;
    }
    getMovingAverageFilter() {
        return this.analyticFilter;
    }
    setActiveStockIndexByTicker(ticker) {
        for (var i = 0; i < this.stocks.length; i++) {
            if (this.stocks[i].getLabel() == ticker) {
                this.activeStockIndex = i;
                break;
            }
        }
    }
    setActiveStockIndex(activeStockIndex) {
        this.activeStockIndex = activeStockIndex;
    }
    getActiveStockIndex() {
        return this.activeStockIndex;
    }
    getActiveStockTicker() {
        return this.stocks[this.activeStockIndex].getLabel();
    }
    getActiveStock() {
        return this.stocks[this.activeStockIndex];
    }
    //Translates dateFilter to numeric day value
    translateDateFilterToNumericValue(dateFilter) {
        var numericValue = 0;
        if (dateFilter == "1W") {
            numericValue = 7;
        }
        else if (dateFilter == "1M") {
            numericValue = 31;
        }
        else if (dateFilter == "3M") {
            numericValue = 93;
        }
        else if (dateFilter == "6M") {
            numericValue = 183;
        }
        else if (dateFilter == "1Y") {
            numericValue = 365;
        }
        else if (dateFilter == "2Y") {
            numericValue = 730;
        }
        else if (dateFilter == "5Y") {
            numericValue = 1825;
        }
        else if (dateFilter == "10Y") {
            numericValue = 3750;
        }
        else if (dateFilter == "ALL") {
            numericValue = 18250;
        }
        return numericValue;
    }
    //Sets startDate and endDate depending on selected datePickerButton
    setStartDateBasedOnEndDate() {
        var numericDayValue = this.translateDateFilterToNumericValue(this.dateFilter);
        var newDate = this.dateManipulation(this.endDate, numericDayValue, 0, 0, "-");
        this.setStartDate(newDate);
    }
    //https://stackoverflow.com/questions/1296358/subtract-days-from-a-date-in-javascript
    dateManipulation(date, days, hrs, mins, operator) {
        date = new Date(date);
        if (operator == "-") {
            var durationInMs = (((24 * days) * 60) + (hrs * 60) + mins) * 60000;
            var newDate = new Date(date.getTime() - durationInMs);
        } else {
            var durationInMs = (((24 * days) * 60) + (hrs * 60) + mins) * 60000;
            var newDate = new Date(date.getTime() + durationInMs);
        }
        return newDate.toLocaleDateString('en-ZA').replace("/", "-").replace("/", "-");
    }

    /*
     * 
     *  Stocks functions
     * 
    */
    addStock(stock) {
        this.stocks.push(stock);
    }
    setStocksArray(stocks) {
        this.stocks = stocks;
    }
    getStocks() {
        return this.stocks;
    }
    async populateStocksFromServer() {
        this.stocks = generateStock();
    }
    validateMovingAverageImport(key) {
        var activeStock = this.getActiveStock();
        return activeStock.doesMovingAverageExist(key);
    }
    validateVelocityImport(key) {
        var activeStock = this.getActiveStock();
        return (activeStock.getVelocity(key, 10).length != 0);
    }
    importMovingAverage(type, ticker, key, response) {
        var activeStock = this.getActiveStock();
        activeStock.addMovingAverageRecord(key, response);
    }
    importVelocity(type, key, response) {
        var activeStock = this.getActiveStock();
        activeStock.addVelocityRecord(key, response);
    }
    importStocks(portfolio) {
        portfolio.forEach(stock => {
            let add = new Stock();
            add.setName(stock.name);
            add.setLabel(stock.label);
            add.setPrice(stock.price);
            add.setPriceChangeFromPreviousDay(stock.change);
            this.stocks.push(add);
        });
    }
    getStockByTicker(ticker) {
        var stockFound = new Stock();
        for (var i = 0; i < this.stocks.length; i++) {
            if (this.stocks[i].getLabel() == ticker) {
                stockFound = this.stocks[i];
                break;
            }
        }
        return stockFound;
    }
    getNumberOfStockDetailsInRange() {
        var activeStock = this.getActiveStock();
        return activeStock.getStockDetailCount(this.startDate, this.endDate);
    }
    getNumberOfStockDetailsByRange(startDate, endDate) {
        var activeStock = this.getActiveStock();
        return activeStock.getStockDetailCount(startDate, endDate);
    }
}