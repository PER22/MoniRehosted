/* *********************************************************
 
********************************************************** */
class Stock{
    constructor(name, label){
        this.name = name;
        this.label = label;
    }
}
/*
tesla = new Stock("Tesla", "TSLA");
console.log(tesla.name);
console.log(tesla.label);
*/
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


