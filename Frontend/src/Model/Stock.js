/* *********************************************************
 
********************************************************** */

class Stock{
	/*
	constructor(name, label, data) {
		this.name = name;
		this.label = label;
		this.data = data;
	}
	*/
	constructor() {
		this.name = "";
		this.label = "";
		this.data = [];
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
  
	//pushed data to be sorted
	AddStockDetailFromServer(element){
		var stockData = new StockData(element.Date, element.Open, element.High, element.Low, element.Close, element.OpenInt, element.Volume)

		this.data.push(stockData);
		this.data.sort((a, b) => {
			if(a.date > b.date) return 1;
			else if(a.date < b.date) return -1;
			else return 0;
		});

	}

	getStockDates() {
		var stockDates = []
		for (var i = 0; i < this.data.length; i++) {
			stockDates.push(this.data[i].getDate());
		}
		return stockDates;
	}
	getClosingPrices() {
		var closingPrices = []
		for (var i = 0; i < this.data.length; i++) {
			closingPrices.push(this.data[i].getClose());
		}
		return closingPrices;
    }
}

class StockData{
    constructor(date, open, high, low, close, volume){
        this.date = date;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume;
	}

	setDate(date){
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
	setLow(low){
		this.low = low;
	}
	getLow() {
		return this.low;
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