async function displayStock() {
    //document.getElementById('selectedStockName').innerHTML = getPortfolioTitle();
    displayStockChart();
    // displayStockList();
}

function handleChartDisplay(e) {
    if (!e)
        e = window.event;
    var sender = e.srcElement || e.target;
    var ticker = sender.id.split("-")[1];
    getStockDataByTicker(ticker, displayStockChart);
}
function displayStockChart(ticker) {
    var closingValues = getClosingValuesByTicker(ticker);
    var dateValues = getClosingValuesByTicker(ticker);
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dateValues,
            datasets: [{
                label: 'Stock',
                data: closingValues,
                borderWidth: 1
            }],
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        }
    });
}

function displayStockList() {
    var stockHeader = document.getElementById('stockHeader');
    var boxContol = "";
    var index = 0;
    console.log("Displaying Stock List");
    getStocksInPortfolio().forEach(stock => {
        if (index < 20) {
            boxContol +=
                "<div onclick=handleChartDisplay(event)>" +
                "<div class=\"stock-selection-summary\" id=\"outer-" + stock.label + "\">" +
                "<div class=\"stock-selection-left\" id=\"left-" + stock.label + "\">" +
                "<div class=\"stock-selection-summary-stock-name\"id=\"divName-" + stock.label + "\">" +
                "<label class=\"detail-label\" id=\"fullName-" + stock.label + "\">" + stock.name + "</label>" +
                " </div>" +
                " <div class=\"stock-selection-summary-short-name\" id=\"ticker-" + stock.label + "\">" +
                " <label class=\"detail-label-small\" id=\"shortName-" + stock.label + "\">" + stock.label + "</label>" +
                " </div>" +
                " </div>" +
                " <div class=\"stock-selection-summary-price\" id=\"price-" + stock.label + "\">" +
                "<label class=\"detail-label-small\" id=\"labelPrice-" + stock.label + "\">$" + stock.data + "</label>" +
                "</div>" +
                "</div>";
        }
        index++;
    });
    stockHeader.innerHTML = boxContol;
    var stockHeader = document.getElementById('load-button').remove();
}

function appendStock(stock, table) {
    let rows = table.getElementsByTagName("tr");
    //console.log(rows)
    let row = table.insertRow(rows.length);

    let br = row.insertCell(0);

    br.innerHTML = '<br>'
}