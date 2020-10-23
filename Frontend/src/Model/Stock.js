/* *********************************************************

********************************************************** */

class Stock{
	constructor() {
		this.name = "";
		this.label = "";
		this.price = 0;
		this.data = [];
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
	sortDataByDate() {
		this.data.sort((a, b) => {
			if (a.date > b.date) return 1;
			else if (a.date < b.date) return -1;
			else return 0;
		});
	}
	//Turns json element into StockData object and adds to data array.
	addStockDetailFromServer(element){
		var stockData = new StockData(element.Date, element.Open, element.High, element.Low, element.Close, element.Volume, element.OpenInt)
		this.data.push(stockData);
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

  getClosingPrices() {
		var closingPrices = []
		for (var i = 0; i < this.data.length; i++) {
			closingPrices.push(this.data[i].getClose());
		}
		return closingPrices;
	}
	getVolumes() {
		var volumes = []
		for (var i = 0; i < this.data.length; i++) {
			volumes.push(this.data[i].getVolume());
		}
		return volumes;
	}
	getLowPrices() {
		var lowPrices = []
		for (var i = 0; i < this.data.length; i++) {
			lowPrices.push(this.data[i].getLow());
		}
		return lowPrices;
	}
	getHighPrices() {
		var highPrices = []
		for (var i = 0; i < this.data.length; i++) {
			highPrices.push(this.data[i].getHigh());
		}
		return highPrices;
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
