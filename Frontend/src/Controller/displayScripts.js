async function displayStock() {
    //document.getElementById('selectedStockName').innerHTML = getPortfolioTitle();
    displayStockChart();
   // displayStockList();
}

function displayStockChart(e) {
    if (!e)
        e = window.event;
    var sender = e.srcElement || e.target;

    //getData();
    var data = getStocksInPortfolio();
    var dates = getDatesInPortfolio();
    var lows = getLowsInPortfolio();
    //console.log(data);
    //console.log(lows);

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Stock',
                data: lows,
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
                "<div>" +
                "<div class=\"stock-selection-summary\" onclick=displayStockChart(event)>" +
                "<div class=\"stock-selection-left\">" +
                "<div class=\"stock-selection-summary-stock-name\" data-tag='1337'>" +
                "<label class=\"detail-label\" id=\"stock-selection-name-label\">" + stock.name + "</label>" +
                " </div>" +
                " <div class=\"stock-selection-summary-short-name\">" +
                " <label class=\"detail-label-small\" id=\"stock-selection-short-name-label\">" + stock.label + "</label>" +
                " </div>" +
                " </div>" +
                " <div class=\"stock-selection-summary-price\">" +
                "<label class=\"detail-label-small\" id=\"stock-selection-summary-price-label\">$" + stock.data + "</label>" +
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