/*
    The purpose of the displayScript.js file is to
    house all functions that interact with the HTML
    This includes jQuery, HTML DOM, and dynamic HTML
*/


//
//Event handler functions
// vvvvvvvvvvvvvvvvvvvvvv


//Function used when clicking stock-list items to display graph.
function handleChartDisplay(e) {
    if (!e)
        e = window.event;
    var sender = e.srcElement || e.target;
    var ticker = sender.id.split("-")[1];
    setCursor("wait");
    setStockListBackcolor(sender.parentElement.parentElement);
    setActiveStock(ticker);
    getStockDataByTicker(ticker, false, displayStockChart);
}

//Function used when clicking an item in the DateRange drop down
function handleFilterDateRange(e) {
    var sender = e.srcElement || e.target;
    var dateRangeValue = sender.innerHTML;
    setPeriodDropDownName(dateRangeValue + " v");
    setDateFilterValue(dateRangeValue);
    displayStockChart(getActiveStockTicker());
}

//Function used when clicking an item in the DisplayValue drop down
function handlFilterDisplayValue(e) {
    var sender = e.srcElement || e.target;
    var displayValue = sender.innerHTML;
    setDisplayFilterValue(displayValue);
    setDisplayValueDropDownName(displayValue + " v");
    displayStockChart(getActiveStockTicker());
}

//Function used when clicking an item in the Analytics drop down
function handleFilterAnalytics(e) {
    var sender = e.srcElement || e.target;
    var analytic = sender.innerHTML;
    setAnalyticFilterValue(analytic);
    setAnalyticsDropDownName(analytic + " v");
    displayStockChart(getActiveStockTicker());
}

//Function used when switching between Stock and ETF
function handleSwapStockAndETF(e) {
    var sender = e.srcElement || e.target;
    setETFStockPickerBackColor(sender);
    //filter by etf/stock
}

//Function used to delete a stock
function handleDeleteStock(e) {
    var sender = e.srcElement || e.target;
    //deleteStock(getActiveStockTicker(), null);
    deleteStock("a", null);
    document.getElementById("outer-" + getActiveStockTicker()).remove();
}

//Function used to delete a stock
function handleReloadStock(e) {
    var sender = e.srcElement || e.target;
    var ticker = getActiveStockTicker();
    getStockDataByTicker(ticker, true, displayStockChart);
}

//
// Display functions
// vvvvvvvvvvvvvvvvv

//Stock chart display function.
function displayStockChart(ticker) {
    console.log("Displaying Chart");
    //Set stock title and initial date range
    setActiveStockDateRange();
    replaceAnimationAfterLoad();

    //Gather chart values
    var stockTitle = getStockTitleByTicker(ticker);
    var prevClosingValue = getStockInPortfolioByTicker(ticker).getPriceChangeFromPreviousDay();
    var lastDay = getStockInPortfolioByTicker(ticker).getLastData();
    var selectedDisplayValue = getSelectedDisplayValue();
    var chartValues = getChartValuesByTicker(selectedDisplayValue, ticker);
    var volumes = getChartVolumeByTicker(selectedDisplayValue, ticker);
    var dateValues = getClosingDatesByTicker(ticker);

    updateHeader(stockTitle, prevClosingValue, lastDay.getOpen(), lastDay.getClose(),lastDay.getLow(), lastDay.getHigh(), lastDay.getVolume(), ticker, prevClosingValue)

    //fillChartJS(prevClosingValue, chartValues, volumes, dateValues, selectedDisplayValue);
    //fillPlotlyChart(dateValues, chartValues);
    //fillCandleChart(dateValues, ticker);

    //fillChartJS(prevClosingValue, chartValues, volumes, dateValues, selectedDisplayValue);
    fillPlotlyChart(dateValues, chartValues);
    setCursor("default");
}

function fillPlotlyChart(dateValues, chartValues) {
    chartDiv.innerHTML = "";
    chartDiv = document.getElementById('chartDiv');
    var min = Math.min(...chartValues) - 2;
    var max = Math.max(...chartValues) + 2;

    var trace1 = {
        type: "scatter",
        mode: "lines",
        x: dateValues,
        y: chartValues,
        fill: 'tonexty',
        line: { color: '#17BECF' }
    }
    var data = [trace1];

    var layout = {
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        height: 735,
        xaxis: {
            gridcolor: '#373c42',
            gridwidth: 1,
            linecolor: '#636363',
        },
        yaxis: {
            gridcolor: '#373c42',
            gridwidth: 1,
            linecolor: '#636363',
            range: [min,max]
        }
    }
    Plotly.newPlot(chartDiv, data, layout=layout);
}

function fillCandleChart(dateValues, ticker) {
    chartDiv.innerHTML = "";
    chartDiv = document.getElementById('chartDiv');

    var trace1 = {
        type: "candlestick",
        //mode: "lines",
        x: dateValues,
        xaxis : 'x',
        yaxis: 'y',
        close: getClosingValuesByTicker(ticker),
        high: getHighValuesByTicker(ticker),
        low: getLowValuesByTicker(ticker),
        open: getOpeningValuesByTicker(ticker),

       decreasing: {
           line: {color: '#c2331f'},
           fillcolor: '#c2331f'
        },
       increasing: {
           line: {color: '#209e54'},
           fillcolor : '#209e54'   
        },
       
    };
    var data = [trace1];

    var layout = {
        showlegend: false, 
        xaxis: {
            autorange: true, 
            rangeslider: {visible: false}, 
            gridcolor: '#373c42',
            gridwidth: 1,
            linecolor: '#636363',
            type: 'date',
        },
        yaxis: {
            gridcolor: '#373c42',
            gridwidth: 1,
            linecolor: '#636363',
            
          },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        font: {
            //family: 'Courier New, monospace',
            size: 14,
            color: '#FFFFFF'
          }
        
      };
      Plotly.newPlot(chartDiv, data, layout);
}


function fillChartJS(prevClosingValue, chartValues, volumes, dateValues, selectedDisplayValue) {
    //Fill chart
    var ctx = document.getElementById('myChart').getContext('2d');
    for (var i = 0, length = volumes.length; i < length; i++) {
        volumes[i] = volumes[i] / 1000000;
    }
    var gradient = ctx.createLinearGradient(0, 0, 0, 400);
    var lineColor = "#FFFFFF"

    if (parseFloat(prevClosingValue) < 0) {
        gradient.addColorStop(0, 'rgba(255,0,0,0.5)');
        gradient.addColorStop(1, 'rgba(255,0,0,0.0)');
        lineColor = "#FF0000";
    } else {
        gradient.addColorStop(0, 'rgba(0,255,0, 0.7)');
        gradient.addColorStop(1, 'rgba(0,255,0, 0.1)');
        lineColor = "#00FF00";
    }



    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dateValues,
            datasets: [{
                label: String(selectedDisplayValue) + ' Price',
                type: 'line',
                fill: true,
                data: chartValues,
                borderColor: lineColor,
                backgroundColor: gradient,
                pointHoverBorderColor: "#0000FF",
                pointRadius: 0,
                borderWidth: 1,
                order: 1
            }],
            options: {
                tooltips: {
                    mode: 'nearest',
                    mode: 'x'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        }
                    }]
                }
            }
        }
    });
}

//Dynamic Stock list display function
function displayStockList() {
    if (!!document.getElementById("listPlaceholder")) {
        const newlist = document.createElement('div');
        newlist.innerHTML = '  <div class="stock-selection-sect" id="stockHeader"></div>';
        document.getElementById('listPlaceholder').parentNode.replaceChild(newlist, document.getElementById('listPlaceholder'));
    }

    var stockHeader = document.getElementById('stockHeader');
    var boxContol = "";
    var index = 0;
    console.log("Displaying Stock List");

    getStocksInPortfolio().forEach(stock => {
        if (index < 20) {
            var cssType;
            if (stock.priceChangeFromPreviousDay < 0) {
                cssType = "\"box red detail-label-small\""
            }
            else if (stock.priceChangeFromPreviousDay >= 0) {
                cssType = "\"box green detail-label-small\""
            }
            boxContol +=
                "<div onclick = handleChartDisplay(event)>" +
                "   <div name=\"stockSummary\" class=\"stock-selection-summary\" id=\"outer-" + stock.label + "\">" +
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
                "               <label class=\"detail-label-price\" id=\"labelPrice-" + stock.label + "\">$" + stock.price + "</label>" +
                "           </div>" +
                "           <div class=\".stock-selection-change-value\" id=\"change-" + stock.label + "\">" +
                "               <label class= " + cssType + " id=\"labelChange-" + stock.label + "\">" + stock.priceChangeFromPreviousDay + "%</label>" +
                "           </div>" +
                "       </div>" +
                "   </div>" +
                "</div>";

        }
        index++;
    });
    stockHeader.innerHTML = boxContol;
    //setDatePickerBackcolor(document.getElementById('button-1W'));
    //setETFStockPickerBackColor(document.getElementById('button-stock'));
    getStockDataByTicker(getActiveStockTicker(), false, displayStockChart);
}

//
// Utility functions
//

function getSelectedDisplayValue() {
    return document.getElementById('stockPropertyDropdownButton').innerText;
}

//Sets all elements on page to specified cursor.
//https://stackoverflow.com/questions/192900/wait-cursor-over-entire-html-page
function setCursor(cursor) {
    var x = document.querySelectorAll("*");
    for (var i = 0; i < x.length; i++) {
        x[i].style.cursor = cursor;
    }
}

//Sets the back color of the StockList item to indicate which is selected
function setStockListBackcolor(sender) {
    var StockSummarybox = document.getElementsByName('stockSummary');
    for (var i = 0; i < StockSummarybox.length; i++) {
        if (StockSummarybox[i] == sender) {
            StockSummarybox[i].style.background = '#363C41';
            StockSummarybox[i].style.fontWeight = "normal";
            StockSummarybox[i].style.color = 'D8D8D8';
            StockSummarybox[i].style.borderColor = 'black';
        }
        else {
            StockSummarybox[i].style.background = '#2D3134';
            StockSummarybox[i].style.fontWeight = "normal";
            StockSummarybox[i].style.color = '#D8D8D8';
        }
    }
}

//Sets the back color of the Stock/ETF picker buttons to indicate which is selected
function setETFStockPickerBackColor(sender) {
    console.log(myPortfolio);
    var dateButtons = document.getElementsByName('ETForStockPicker');
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

//Updates Period Drop Down name when list item is clicked
function setPeriodDropDownName(name) {
    document.getElementById('periodDropdownButton').innerHTML = name;
}

//Updates Property Drop Down name when list item is clicked
function setDisplayValueDropDownName(name) {
    document.getElementById('stockPropertyDropdownButton').innerHTML = name;
}

//Updates Property Drop Down name when list item is clicked
function setAnalyticsDropDownName(name) {
    document.getElementById('analyticDropdownButton').innerHTML = name;
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function scrolled(e) {
    if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
        scrolledToBottom(e);
    }
}

function replaceAnimationAfterLoad(stock){
  //Name of Company
  if (!!document.getElementById("labelPlaceholder")) {
      const newlabel = document.createElement('label');
      newlabel.innerHTML = '  <label class="header-label" id="selected-stock-name"></label>';
      document.getElementById('labelPlaceholder').parentNode.replaceChild(newlabel, document.getElementById('labelPlaceholder'));
  }

  //Price Of Company
  if (!!document.getElementById("pricePlaceholder")) {
      const newlabel = document.createElement('h1');
      newlabel.innerHTML = '  <h1 class="header-label" id="selected-stock-price">340</h1>';
      document.getElementById('pricePlaceholder').parentNode.replaceChild(newlabel, document.getElementById('pricePlaceholder'));
  }

  //Currency and Trend of Company Asset
  if (!!document.getElementById("currencyPlaceholder")) {
      const newlabel = document.createElement('label');
      newlabel.innerHTML = '<div id="selected-stock-trend"></div>' +
                           '<br>' +
                           '<label class="" id="selected-stock-currency">USD</label>';
      document.getElementById('currencyPlaceholder').parentNode.replaceChild(newlabel, document.getElementById('currencyPlaceholder'));
  }

  //Open / Close Price of Asset
  if (!!document.getElementById("openClosePlaceholder")) {
      const newlabel = document.createElement('label');
      newlabel.innerHTML = '<label class="" id="selected-stock-PreviousClose">Previous Close: </label> ' +
                           '<label class="" id=""></label>' +
                           '<br>' +
                           '<label class="" id="selected-stock-Open">Open: </label>';
      document.getElementById('openClosePlaceholder').parentNode.replaceChild(newlabel, document.getElementById('openClosePlaceholder'));
  }

  //Range / Colume of Asset
  if (!!document.getElementById("rangeVolumePlaceholder")) {
      const newlabel = document.createElement('label');
      newlabel.innerHTML = '<label class="" id="selected-stock-range">Day\'s Range: </label> ' +
                           '<br>' +
                           '<label class="" id="selected-stock-volume">Volume: </label>';
      document.getElementById('rangeVolumePlaceholder').parentNode.replaceChild(newlabel, document.getElementById('rangeVolumePlaceholder'));
  }

  //Graph of Asset
  if (!!document.getElementById("graphPlaceholder")) {
      const newGraph = document.createElement('div');
      newGraph.innerHTML = '  <div id="chartDiv"><canvas id="myChart"></canvas></div>';
      document.getElementById('graphPlaceholder').parentNode.replaceChild(newGraph, document.getElementById('graphPlaceholder'));
  }
}

function updateHeader(header, prevClosingValue, open, close, low, high, volume, label, priceChangeFromPreviousDay) {

  var cssType;
  if (priceChangeFromPreviousDay < 0) {
      cssType = "\"box red detail-label-small\""
  }
  else{
      cssType = "\"box green detail-label-small\""
  }

  document.getElementById('selected-stock-name').innerHTML =  header;
  document.getElementById('selected-stock-price').innerHTML =  close;
  document.getElementById('selected-stock-trend').innerHTML = "<div class=\".stock-selection-change-value\" id=\"change-" + label + "\">" +
                                                              "<label class= " + cssType + " id=\"labelChange-" + label + "\">" + priceChangeFromPreviousDay + "%</label>" +
                                                              "</div>";
  document.getElementById('selected-stock-PreviousClose').innerHTML = 'Previous Close: $' + prevClosingValue;
  document.getElementById('selected-stock-Open').innerHTML = 'Open: $' + open;
  document.getElementById('selected-stock-range').innerHTML = 'Day\'s Range: $' + low + ' - $' + high;
  document.getElementById('selected-stock-volume').innerHTML = 'Volume: ' + volume;
}
