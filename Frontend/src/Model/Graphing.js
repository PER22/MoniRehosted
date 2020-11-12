class Graphing {
    constructor() {
    }

    displayTrendPlotly(chartDiv, xData, yData, isPositive) {
        //Validate data passed in
        if (!this.validateData(xData, yData)) return;
        this.clearChartDiv(chartDiv);
        this.fillPlotlyChart(chartDiv, xData, yData, isPositive)
    }
    displayTrendChartJS(chartDiv, xData, yData, isPositive) {
        //Validate data passed in
        if (!this.validateData(xData, yData)) return;
        this.clearChartDiv(chartDiv);
        this.fillChartJS(chartDiv, xData, yData, isPositive);
    }

    displayCandleChart(chartDiv, high, low, open, close, xData) {
        //Validate data passed in
        if (!this.validateData(high, xData)) return;
        if (!this.validateData(low, xData)) return;
        if (!this.validateData(open, xData)) return;
        if (!this.validateData(close, xData)) return;
        //this.clearChartDiv(chartDiv);
        this.fillCandleChart(chartDiv, high, low, open, close, xData);
    }

    fillCandleChart(chartDiv, high, low, open, close, xData) {
        var trace = {
            type: "candlestick",
            x: xData,
            xaxis: 'x',
            yaxis: 'y',
            close: close,
            high: high,
            low: low,
            open: open,

            decreasing: {
                line: { color: '#c2331f' },
                fillcolor: '#c2331f'
            },
            increasing: {
                line: { color: '#209e54' },
                fillcolor: '#209e54'
            },

        };
        var data = [trace];
        var layout = {
            showlegend: false,
            xaxis: {
                autorange: true,
                rangeslider: { visible: false },
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
                size: 14,
                color: '#FFFFFF'
            }

        };
        Plotly.newPlot(chartDiv, data, layout);
    }

    fillPlotlyChart(chartDiv, xData, yData, isPositive) {
        var min = Math.min(...yData[0]) - 1;
        var max = Math.max(...yData[0]) + 1;
        if (min < 0) min = 0;

        var traces = [];
        for (var i = 0; i < xData.length; i++) {
            var trace = {
                type: "scatter",
                mode: "lines",
                x: xData[i],
                y: yData[i],
                fill: 'tonexty',
                line: { color: '#17BECF' }
            }
            traces.push(trace);
        }

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
                range: [min, max]
            }
        }
        Plotly.newPlot(chartDiv, traces, layout = layout);
    }
    fillChartJS(chartDiv, xData, yData, isPositive) {
        //Fill chart
        var ctx = document.getElementById('myChart').getContext('2d')
        //Scale volume data
        //for (var i = 0, length = volumes.length; i < length; i++) {
        //    volumes[i] = volumes[i] / 1000000;
        //}

        //Set up colors for graph
        var gradient = ctx.createLinearGradient(0, 0, 0, 400);
        var lineColor = ["#FFFFFF"];
        var seriesNames = ["Trend 1", "Trend 2", "Trend 3"];
        if (yData.length == 1) {
            if (!isPositive) {
                gradient.addColorStop(0, 'rgba(255,0,0,0.5)');
                gradient.addColorStop(1, 'rgba(255,0,0,0.0)');
                lineColor = ["#FF0000"];
            } else {
                gradient.addColorStop(0, 'rgba(0,255,0, 0.7)');
                gradient.addColorStop(1, 'rgba(0,255,0, 0.1)');
                lineColor = ["#00FF00"];
            }
        }
        else {
            gradient.addColorStop(0, 'rgba(255,0,0,0.0)');
            gradient.addColorStop(1, 'rgba(255,0,0,0.0)');
            lineColor = [(!isPositive) ? "#FF0000" : "#00FF00", "#0000FF", "#FFFF00"];
        }

        var dataSets = [];
        for (var i = 0; i < yData.length; i++) {
            var dataset = {
                label: seriesNames[i],
                type: 'line',
                fill: true,
                data: yData[i],
                borderColor: lineColor[i],
                backgroundColor: gradient,
                pointHoverBorderColor: "#0000FF",
                pointRadius: 0,
                borderWidth: 1,
                order: 1
            };
            dataSets.push(dataset);
        }

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: xData[0],
                datasets: dataSets,
                options: {
                    tooltips: {
                      mode: "index",
                      intersect: true,
                      position: 'nearest',
                      bodySpacing: 4
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

    validateData(xData, yData) {
        var valid = true;
        if (xData.length == 0 || yData.length == 0) {
            console.log("xData or yData is null");
            valid = false;
        }
        else if (xData.length != yData.length) {
            console.log("Number of datasets in xData does not match that of yData");
            valid = false;
        }
        if (Array.isArray(xData[0])) {
            for (var i = 0; i < xData.length; i++) {
                if (xData[i].length != yData[i].length) {
                    console.log("Number of records in xData[" + i + "] does not match that of yData[" + i + "] ");
                    valid = false;
                }
            }
        }
        return valid;
    }
    clearChartDiv(chartDiv) {
        chartDiv.innerHTML = '<canvas id="myChart"></canvas>';
    }
}
