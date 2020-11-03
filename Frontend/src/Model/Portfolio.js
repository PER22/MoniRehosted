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
    //Translates dateFilter to numeric day value
    translateDateFilterToNumericValue() {
        var numericValue = 0;
        if (this.dateFilter == "1W") {
            numericValue = 7;
        }
        else if (this.dateFilter == "1M") {
            numericValue = 31;
        }
        else if (this.dateFilter == "3M") {
            numericValue = 93;
        }
        else if (this.dateFilter == "6M") {
            numericValue = 183;
        }
        else if (this.dateFilter == "1Y") {
            numericValue = 365;
        }
        else if (this.dateFilter == "2Y") {
            numericValue = 730;
        }
        else if (this.dateFilter == "5Y") {
            numericValue = 1825;
        }
        else if (this.dateFilter == "10Y") {
            numericValue = 3750;
        }
        else if (this.dateFilter == "ALL") {
            numericValue = 18250;
        }
        return numericValue;
    }
    //Sets startDate and endDate depending on selected datePickerButton
    setStartDateBasedOnEndDate() {
        var numericDayValue = this.translateDateFilterToNumericValue();
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


    generateStock() {
        var stocks = []
        for (var i = 0; i < 1; i++) {
            var data = []
            for (var k = 0; k < 20; k++) {
                var low = (Math.random() * 200);
                this.lows.push(low);
                var d = new Date();
                d.setDate(d.getDate() + k);
                this.dates.push(d.getMonth() + "-" + d.getDate());
                data[k] = new StockData(d, (Math.random() * 500), (Math.random() * 600), low,
                    (Math.random() * 600), (Math.random() * 200));
            }
            stocks[i] = new Stock('Telsa', 'TSLA', data);

        }
        //console.log(this.dates);
        return stocks;
    }
}