var myPortfolio = new Portfolio();

/*Function that access myPortfolio*/
function getPortfolioTitle() {
    return myPortfolio.getName();
}


async function loadStocksFromServer() {    
    myPortfolio = new Portfolio();
    myPortfolio.setName("Tester");
    myPortfolio.setStocksArray(myPortfolio.generateStock());    
}

//Returns stocks array from myPortfolio
function getStocksInPortfolio() {
    return myPortfolio.getStocks();
}

//Returns dates array from myPortfolio
function getDatesInPortfolio() {
    return myPortfolio.getDates();
}

//Returns array of lows from myPortfolio
function getLowsInPortfolio() {
    return myPortfolio.getLows();
}