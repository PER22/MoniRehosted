/* *********************************************************

********************************************************** */

class Stock {
    constructor() {
        this.name = "";
        this.label = "";
        this.price = 0;
        this.data = [];
        this.velocity = {};
        this.movingAverage = {};
        this.movingAverageFilters = ["1W", "3M"];
        this.priceChangeFromPreviousDay = 0;
        this.loaded = false;
    }
    setName(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    setLabel(label) {
        this.label = label;
    }
    getLabel() {
        return this.label;
    }
    setData(data) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
    setPrice(price) {
        this.price = price;
    }
    getPrice() {
        return this.price;
    }
    setPriceChangeFromPreviousDay(priceChangeFromPreviousDay) {
        this.priceChangeFromPreviousDay = priceChangeFromPreviousDay;
    }
    getPriceChangeFromPreviousDay() {
        return this.priceChangeFromPreviousDay;
    }
    setLoaded(loaded) {
        this.loaded = loaded;
    }
    isLoaded() {
        return this.loaded;
    }
    getVelocity() {
        return this.velocity;
    }
    getMovingAverage() {
        return this.movingAverage;
    }
    sortDataByDate() {
        this.data.sort((a, b) => {
            if (a.date > b.date) return 1;
            else if (a.date < b.date) return -1;
            else return 0;
        });
    }

    //Turns json element into StockData object and adds to data array.
    addStockDetailFromServer(element) {
        var stockData = new StockData(element.Date, parseFloat(element.Open), parseFloat(element.High), parseFloat(element.Low), parseFloat(element.Close), parseFloat(element.Volume), element.OpenInt)
        this.data.push(stockData);
    }

    getStockDates(startDate, endDate) {
        var stockDates = []
        for (var i = 0; i < this.data.length; i++) {
            var stockDate = Date.parse(this.data[i].getDate());
            var startDateVal = Date.parse(startDate);
            var endDateVal = Date.parse(endDate);
            if (stockDate >= startDateVal && stockDate <= endDateVal)
                stockDates.push(this.data[i].getDate());
        }
        return stockDates;
    }

    getOpeningPrices(startDate, endDate) {
        var openingPrices = []
        for (var i = 0; i < this.data.length; i++) {
            var stockDate = Date.parse(this.data[i].getDate());
            var startDateVal = Date.parse(startDate);
            var endDateVal = Date.parse(endDate);
            if (stockDate >= startDateVal && stockDate <= endDateVal)
                openingPrices.push(this.data[i].getOpen());
        }
        return openingPrices;
    }

    getClosingPrices(startDate, endDate) {
        var closingPrices = []
        for (var i = 0; i < this.data.length; i++) {
            var stockDate = Date.parse(this.data[i].getDate());
            var startDateVal = Date.parse(startDate);
            var endDateVal = Date.parse(endDate);
            if (stockDate >= startDateVal && stockDate <= endDateVal)
                closingPrices.push(this.data[i].getClose());
        }
        return closingPrices;
    }

    getLowPrices(startDate, endDate) {
        var lowPrices = []
        for (var i = 0; i < this.data.length; i++) {
            var stockDate = Date.parse(this.data[i].getDate());
            var startDateVal = Date.parse(startDate);
            var endDateVal = Date.parse(endDate);
            if (stockDate >= startDateVal && stockDate <= endDateVal)
                lowPrices.push(this.data[i].getLow());
        }
        return lowPrices;
    }

    getHighPrices(startDate, endDate) {
        var highPrices = []
        for (var i = 0; i < this.data.length; i++) {
            var stockDate = Date.parse(this.data[i].getDate());
            var startDateVal = Date.parse(startDate);
            var endDateVal = Date.parse(endDate);
            if (stockDate >= startDateVal && stockDate <= endDateVal)
                highPrices.push(this.data[i].getHigh());
        }
        return highPrices;
    }

    getVolumes(startDate, endDate) {
        var volumes = []
        for (var i = 0; i < this.data.length; i++) {
            var stockDate = Date.parse(this.data[i].getDate());
            var startDateVal = Date.parse(startDate);
            var endDateVal = Date.parse(endDate);
            if (stockDate >= startDateVal && stockDate <= endDateVal)
                volumes.push(this.data[i].getVolume());
        }
        return volumes;
    }
    getStockDetailCount(startDate, endDate) {
        var count = 1;
        for (var i = 0; i < this.data.length; i++) {
            var stockDate = Date.parse(this.data[i].getDate());
            var startDateVal = Date.parse(startDate);
            var endDateVal = Date.parse(endDate);
            if (stockDate >= startDateVal && stockDate <= endDateVal)
                count++;
        }
        return count;
    }
    getLastData() {
        return this.data[this.data.length - 1];
    }
    getMovingAverageByKey(key, numberOfDays) {
        var dataSet = this.movingAverage[key];
        return dataSet.slice(dataSet.length - numberOfDays, dataSet.length - 1);
    }
    doesMovingAverageExist(key) {
        return (key in this.movingAverage);
    }
    doesVelocityExist(key) {
        return (key in this.velocity);
    }
    addVelocityRecord(key, data) {
        if (this.velocity[key] == undefined)
            this.velocity[key] = data;
        else
            this.velocity[key].push(data);
    }
    getVelocityByKey(key, numberOfDays) {
        var dataSet = this.velocity[key];
        return (dataSet == undefined) ? [] : dataSet.slice(dataSet.length - numberOfDays, dataSet.length - 1);
    }
    addMovingAverageRecord(key, data) {
        if (this.movingAverage[key] == undefined)
            this.movingAverage[key] = data;
        else
            this.movingAverage[key].push(data);
    }
    setMovingAverageFilter(movingAverageFilters) {
        this.movingAverageFilters = movingAverageFilters;
    }
    getMovingAverageFilter() {
        return this.movingAverageFilters;
    }
}

class StockData {
    constructor(date, open, high, low, close, volume) {
        this.date = date;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume;
    }

    setDate(date) {
        this.date = date;
    }
    getDate() {
        return this.date;
    }
    setOpen(open) {
        this.open = open;
    }
    getOpen() {
        return this.open;
    }
    setLow(low) {
        this.low = low;
    }
    getLow() {
        return this.low;
    }
    setHigh(high) {
        this.high = high;
    }
    getHigh() {
        return this.high;
    }
    setClose(close) {
        this.close = close;
    }
    getClose() {
        return this.close;
    }
    setVolume(volume) {
        this.volume = volume;
    }
    getVolume() {
        return this.volume;
    }
}

//module.exports = {Stock, StockData}
