function displayStock() {
    document.getElementById('selectedStockName').innerHTML = getPortfolioTitle();
    loadStocksFromServer();
    displayStockChart();
    displayStockList();
}

function displayStockChart() {
    var data = getStocksInPortfolio();
    var dates = getDatesInPortfolio();
    var lows = getLowsInPortfolio();
    console.log(data);
    console.log(lows);

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
    var data = getDatesInPortfolio();
    var list = "<ol>";
    for (var i = 0; i < data.length; i++) {
        list += "<li onclick=displayStockChart()>Tesla - " + data[i] + "</li>";
    }
    list += "</ol>";
    console.log(list);
    stockHeader.innerHTML = list;
}

function appendStock(stock, table) {
    let rows = table.getElementsByTagName("tr");
    console.log(rows)
    let row = table.insertRow(rows.length);

    let br = row.insertCell(0);

    br.innerHTML = '<br>'
}