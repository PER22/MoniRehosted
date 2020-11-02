/*
    The purpose of the inits.js file is to set up each webpage onload()
    Anything that interacts with form onload() exists here.
*/

function initializePortfolio() {
    subscribePubNub();
    loadStocksFromServer();
}