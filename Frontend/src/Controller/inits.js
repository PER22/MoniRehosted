async function initializePortfolio() {
    loadPortfolio();
}
async function loadPortfolio() {
    await loadStocksFromServer();
    displayStock();
}