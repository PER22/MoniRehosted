/* *********************************************************
 
********************************************************** */

class Stock{
    constructor(name, label, data){
        this.name = name;
        this.label = label;
        this.data =data;
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
}

module.exports = {Stock, StockData}