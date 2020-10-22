function handleChartDisplay(e) {
    if (!e)
        e = window.event;
    var sender = e.srcElement || e.target;
    var ticker = sender.id.split("-")[1];
    setCursor("wait");
    getStockDataByTicker(ticker, displayStockChart);
}
function displayStockChart(ticker) {
    console.log("Displaying Chart");
    //Set stock title
    document.getElementById('selected-stock-name').innerHTML = getStockTitleByTicker(ticker);
    //Gather chart values
    var prevClosingValue = getStockInPortfolioByTicker(ticker).getPriceChangeFromPreviousDay();
    var selectedRadioValue = getSelectedRadioButtonValue();
    var chartValues = getChartValuesByTicker(selectedRadioValue, ticker);
    var dateValues = getClosingDatesByTicker(ticker);
    //consol.log("\n\n\n\t\t" + (prevClosingValue.contains("-")) ? "#FF0000" : "#00FF00")
    //Fill chart
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dateValues,
            datasets: [{
                //label: ticker,
                fill: false,
                data: chartValues,
                //borderColor: "#FF0000",
                //borderDash: [5, 5],
                //backgroundColor: "#FF0000",
                //pointBackgroundColor: "#55bae7",
                //pointBorderColor: "#55bae7",
                //pointHoverBackgroundColor: "#55bae7",
                //pointHoverBorderColor: "#0000FF",
                borderWidth: 1
            }],
            options: {
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
    setCursor("default");
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
                "   <div class=\"stock-selection-summary\" id=\"outer-" + stock.label + "\">" +
                "       <div class=\"stock-selection-left\" id=\"left-" + stock.label + "\">" +
                "           <div class=\"stock-selection-summary-stock-name\"id=\"divName-" + stock.label + "\">" +
                "               <label class=\"detail-label\" id=\"fullName-" + stock.label + "\">" + stock.name + "</label>" +
                "           </div>" +
                "           <div class=\"stock-selection-summary-short-name\" id=\"ticker-" + stock.label + "\">" +
                "               <label class=\"detail-label-small\" id=\"shortName-" + stock.label + "\">" + stock.label + "</label>" +
                "           </div>" +
                "      </div>" +
                "      <div class=\"stock-selection-right\" id=\"right-" + stock.label + "\">" +
                "           <div class=\"stock-selection-summary-price\" id=\"price-" + stock.label + "\">" +
                "               <label class=\"detail-label-small\" id=\"labelPrice-" + stock.label + "\">$" + stock.price + "</label>" +
                "           </div>" +
                "           <div class=\".stock-selection-change-value\" id=\"change-" + stock.label + "\">" +
                "               <label class=\"detail-label-small\" id=\"labelChange-" + stock.label + "\">" + stock.priceChangeFromPreviousDay + "%</label>" +
                "           </div>" +
                "       </div>" +
                "   </div>" +
                "</div>";
        }
        index++;
    });
    stockHeader.innerHTML = boxContol;
    var stockHeader = document.getElementById('load-button').remove();
}

function handleFilterDateRange(e) {
    var sender = e.srcElement || e.target;
    var dateRangeValue = sender.value;
    setDatePickerBackcolor(sender);
    setDateRangeByDatePickerButton(dateRangeValue);
}

//
// Utility functions
//

function getSelectedRadioButtonValue() {
    var selectedRadioValue = "";
    var radios = document.getElementsByName('chart-type');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            selectedRadioValue = radios[i].value;
        }
    }
    return selectedRadioValue;
}

//https://stackoverflow.com/questions/192900/wait-cursor-over-entire-html-page
function setCursor(cursor) {
    var x = document.querySelectorAll("*");
    for (var i = 0; i < x.length; i++) {
        x[i].style.cursor = cursor;
    }
}

function setDatePickerBackcolor(sender) {
    var dateButtons = document.getElementsByName('datePicker');
    for (var i = 0; i < dateButtons.length; i++) {
        if (dateButtons[i] == sender) {
            dateButtons[i].style.background = '#FFFFFF';
            dateButtons[i].style.fontWeight = "bold";
            dateButtons[i].style.color = 'black';
            dateButtons[i].style.borderColor = 'black';
        }
        else {
            dateButtons[i].style.background = '#373c42';
            dateButtons[i].style.fontWeight = "normal";
            dateButtons[i].style.color = '#D8D8D8';
        }
    }
}
