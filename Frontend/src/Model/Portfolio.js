class Portfolio {
    constructor() {
        this.name;
        this.owner;
        this.stocks = [];
        this.startDate;
        this.endDate;
        this.activeStockIndex = 0;
        this.dateFilter = "1W";
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
    //Sets startDate and endDate depending on selected datePickerButton
    setStartDateBasedOnEndDate() {
        var newDate = "";
        if (this.dateFilter == "1W") {
            newDate = this.dateManipulation(this.endDate, 7, 0, 0, "-");
        }
        else if (this.dateFilter == "1M") {
            newDate = this.dateManipulation(this.endDate, 31, 0, 0, "-");
        }
        else if (this.dateFilter == "3M") {
            newDate = this.dateManipulation(this.endDate, 93, 0, 0, "-");
        }
        else if (this.dateFilter == "6M") {
            newDate = this.dateManipulation(this.endDate, 183, 0, 0, "-");
        }
        else if (this.dateFilter == "1Y") {
            newDate = this.dateManipulation(this.endDate, 365, 0, 0, "-");
        }
        else if (this.dateFilter == "2Y") {
            newDate = this.dateManipulation(this.endDate, 730, 0, 0, "-");
        }
        else if (this.dateFilter == "5Y") {
            newDate = this.dateManipulation(this.endDate, 1825, 0, 0, "-");
        }
        else if (this.dateFilter == "10Y") {
            newDate = this.dateManipulation(this.endDate, 3650, 0, 0, "-");
        }
        else if (this.dateFilter == "ALL") {
            newDate = this.dateManipulation(this.endDate, 18250, 0, 0, "-");
        }
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