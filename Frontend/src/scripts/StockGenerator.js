/************************************************************
 *
 *********************************************************** */

const {Stock, StockData} = require('./Model/Stock')

function generateStock() {
    var stocks =[]
    for(var i =0; i <100; i++) {
        var data =[]
        for(var k =0; k <50; k++) {
            data[k] =new StockData(Date(), (Math.random() * 500), (Math.random() * 600), (Math.random() * 200),
                (Math.random() * 600), (Math.random() * 200));
        }
        stocks[i] =new Stock('Telsa', 'TSLA', data);
        console.log(stocks[i])
    }
    return stocks;
}
generateStock()

