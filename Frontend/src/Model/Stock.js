/* *********************************************************
 
********************************************************** */

class Stock{
	constructor(name, label, data) {
		this.name = name;
		this.label = label;
		this.data = data;
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