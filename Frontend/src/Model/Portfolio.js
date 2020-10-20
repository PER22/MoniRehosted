class Portfolio {
    constructor() {
        this.name;
        this.owner;
        this.stocks = [];
        this.dates = [];
        this.lows = [];
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
    setDates(dates) {
        this.dates = dates;
    }
    getDates() {
        return this.dates;
    }
    setLows(lows) {
        this.lows = lows;
    }
    getLows() {
        return this.lows;
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
            add.setData(stock.price);
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