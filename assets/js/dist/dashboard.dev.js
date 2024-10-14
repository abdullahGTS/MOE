"use strict";

//dashboard.js
// Unified Product Colors
var sharedColors = {
  gasoline95: '#009C62',
  gasoline91: '#e55141',
  // gasoline91: '#4156e5',
  diesel: '#FAB75C',
  online: '#42bc74',
  offline: '#d23050'
}; // Unified Product Value from the DOM

var GetCurrentProductValue = {
  currentGasoline95Value: null,
  currentGasoline91Value: null,
  currentDieselValue: null,
  parseFormattedNumber: function parseFormattedNumber(numberStr) {
    return parseFloat(numberStr.replace(/,/g, '').trim());
  },
  getCurrentValue: function getCurrentValue(elementId) {
    var element = document.getElementById(elementId);

    if (element) {
      var valueText = element.innerText || element.textContent;
      return GetCurrentProductValue.parseFormattedNumber(valueText);
    } else {
      console.error("Element with ID ".concat(elementId, " not found."));
      return 0; // Fallback value if the element is not found
    }
  },
  // Method to initialize values
  init: function init() {
    GetCurrentProductValue.currentGasoline95Value = GetCurrentProductValue.getCurrentValue('gasoline95-value');
    GetCurrentProductValue.currentGasoline91Value = GetCurrentProductValue.getCurrentValue('gasoline91-value');
    GetCurrentProductValue.currentDieselValue = GetCurrentProductValue.getCurrentValue('diesel-value');
  }
}; // Format the Value for each Product

var FormatNumbers = {
  init: function init() {
    var valuesNodeList = document.querySelectorAll(".gts-value");

    if (valuesNodeList.length) {
      FormatNumbers.formatNumbersInSpans();
    }
  },
  formatNumbersInSpans: function formatNumbersInSpans() {
    document.querySelectorAll('.gts-value h3 span').forEach(function (span) {
      var originalNumber = span.textContent;
      var numberToFormat = parseFloat(originalNumber.replace(/,/g, '')); // Remove any commas or formatting

      if (!isNaN(numberToFormat)) {
        // Format the number without changing its decimal points
        var formattedNumber = numberToFormat.toLocaleString('en-US', {
          useGrouping: true
        });
        span.textContent = formattedNumber;
      }
    });
  }
}; // Tending Value for Product Usage from Last Monther

var TrendingUpdates = {
  init: function init() {
    // Call the applyTrendingUpdates function
    TrendingUpdates.applyTrendingUpdates(1020038.997, GetCurrentProductValue.currentGasoline95Value, 'gasoline95');
    TrendingUpdates.applyTrendingUpdates(221038.997, GetCurrentProductValue.currentGasoline91Value, 'gasoline91');
    TrendingUpdates.applyTrendingUpdates(608038.997, GetCurrentProductValue.currentDieselValue, 'diesel');
  },
  calculatePercentageChange: function calculatePercentageChange(firstWeek, lastWeek) {
    // Handle the case where the first week value is zero to avoid division by zero
    if (firstWeek === 0) {
      return lastWeek > 0 ? 100 : 0; // Handle edge case where the value changes from 0 to something else
    }

    return (lastWeek - firstWeek) / firstWeek * 100;
  },
  updateTrendingElement: function updateTrendingElement(element, percentageChange, formattedPercentage) {
    var trendingElement = element.querySelector('.trending');
    var trendingTagElement = element.querySelector('.trending-tag');
    var trendingDurationElement = element.querySelector('.trending-duration'); // Remove existing 'up' or 'down' classes

    trendingElement.classList.remove('up', 'down');
    trendingTagElement.innerHTML = ''; // Clear existing content

    trendingDurationElement.innerHTML = ''; // Clear existing content

    var trendMessage = ''; // Add class and icon based on trend

    if (percentageChange > 0) {
      trendingElement.classList.add('up');
      trendingTagElement.innerHTML = "\n                <span class=\"mat-icon material-symbols-sharp\">trending_up</span> ".concat(formattedPercentage, "%\n            ");
      trendMessage = 'Up from last month';
    } else if (percentageChange < 0) {
      trendingElement.classList.add('down');
      trendingTagElement.innerHTML = "\n                <span class=\"mat-icon material-symbols-sharp\">trending_down</span> ".concat(formattedPercentage, "%\n            ");
      trendMessage = 'Down from last month';
    } else {
      trendMessage = 'No change from last month';
    } // Append the trend message to the .trending-duration element


    if (trendingDurationElement) {
      trendingDurationElement.innerHTML = "".concat(trendMessage);
    }
  },
  applyTrendingUpdates: function applyTrendingUpdates(firstWeek, lastWeek, className) {
    // Calculate percentage change
    var percentageChange = TrendingUpdates.calculatePercentageChange(firstWeek, lastWeek);
    var formattedPercentage = Math.abs(percentageChange.toFixed(2)); // Find the element with the className

    var element = document.querySelector(".".concat(className));

    if (element) {
      TrendingUpdates.updateTrendingElement(element, percentageChange, formattedPercentage);
    }
  }
}; // Pie Chart for Product Usage

var GasolineUsagePieChart = {
  init: function init() {
    // Step 1: Load Google Charts library
    google.charts.load('current', {
      packages: ['corechart']
    }); // Step 2: Set callback to run when the library is loaded

    google.charts.setOnLoadCallback(GasolineUsagePieChart.drawPieChart);
  },
  // Step 4: Function to draw the Pie Chart
  drawPieChart: function drawPieChart() {
    // Create the data table
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Fuel Type');
    data.addColumn('number', 'Liters'); // Add the data rows

    data.addRows([['Gasoline 95', GetCurrentProductValue.currentGasoline95Value], ['Gasoline 91', GetCurrentProductValue.currentGasoline91Value], ['Diesel', GetCurrentProductValue.currentDieselValue]]);
    var windowWidth = window.innerWidth; // Set chart options (no 3D and custom colors with borders)

    var options = {
      title: '',
      is3D: false,
      slices: {
        0: {
          offset: 0.07,
          textStyle: {
            color: 'white'
          },
          color: sharedColors.gasoline95,
          borderColor: '#990000',
          borderWidth: 0
        },
        // Gasoline 95
        1: {
          offset: 0.12,
          textStyle: {
            color: 'white'
          },
          backgroundColor: '#00ff00',
          color: sharedColors.gasoline91,
          borderColor: '#009900',
          borderWidth: 0
        },
        // Gasoline 91
        2: {
          offset: 0.07,
          textStyle: {
            color: 'white'
          },
          color: sharedColors.diesel,
          fillOpacity: 0.3,
          borderColor: '#000099',
          borderWidth: 0
        } // Diesel

      },
      chartArea: {
        width: windowWidth < 769 ? '90%' : '75%',
        height: windowWidth < 769 ? '90%' : '75%'
      },
      // Make chart area 80% of the wrapper size
      pieSliceText: 'percentage',
      // Show percentage in slices
      legend: {
        position: 'none'
      } // Hide the default legend

    }; // Draw the chart in the specified div

    var gasolineChartWrapper = document.getElementById('currentUsageChart');
    var chart = new google.visualization.PieChart(gasolineChartWrapper);
    chart.draw(data, options); // Step 5: Draw the legend beneath the chart

    GasolineUsagePieChart.createLegend(gasolineChartWrapper);
  },
  // Step 6: Create a custom legend with colored circles below the chart
  createLegend: function createLegend(wrapper) {
    var legendData = [{
      label: 'Gasoline 95',
      color: sharedColors.gasoline95
    }, {
      label: 'Gasoline 91',
      color: sharedColors.gasoline91
    }, {
      label: 'Diesel',
      color: sharedColors.diesel
    }];
    var legendContainer = wrapper.parentNode.querySelector('.chart-legend');
    legendData.forEach(function (item) {
      var legendItem = document.createElement('div');
      legendItem.classList.add('legend-item');
      legendItem.innerHTML = "\n            <span class=\"legend-color\" style=\"background-color: ".concat(item.color, ";\"></span>\n            <span class=\"legend-label\">").concat(item.label, "</span>\n          ");
      legendContainer.appendChild(legendItem);
    });
  }
}; // Area Chart for Fuel Usage for the Last 4 Weeks

var FuelUsageAreaChart = {
  init: function init() {
    // Load Google Charts library
    google.charts.load('current', {
      packages: ['corechart']
    }); // Set callback to run when the library is loaded

    google.charts.setOnLoadCallback(FuelUsageAreaChart.drawAreaChart);
  },
  // Function to draw the Area Chart
  drawAreaChart: function drawAreaChart() {
    // Create the data table
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Week');
    data.addColumn('number', 'Gasoline 95');
    data.addColumn('number', 'Gasoline 91');
    data.addColumn('number', 'Diesel'); // Add data rows for the last 4 weeks

    data.addRows([['Week 1', 600000, 500000, 400000], // Week 1 values
    ['Week 2', 1020000, 310000, 615000], // Week 2 values
    ['Week 3', 500150, 809000, 59000], // Week 3 values
    ['Week 4', GetCurrentProductValue.currentGasoline95Value || 0, GetCurrentProductValue.currentGasoline91Value || 0, GetCurrentProductValue.currentDieselValue || 0] // Current week values
    ]); // Set chart options

    var windowWidth = window.innerWidth;
    var options = {
      title: '',
      isStacked: false,
      // Stack the areas (true, false, 'relative', 'percent')
      colors: [sharedColors.gasoline95, sharedColors.gasoline91, sharedColors.diesel],
      chartArea: {
        width: '80%',
        height: windowWidth < 1281 ? '65%' : '65%'
      },
      // Make chart area 80% of the wrapper size
      legend: {
        position: 'none'
      },
      // Position the legend at the bottom
      hAxis: {
        title: ''
      },
      vAxis: {
        title: ''
      },
      keepInBounds: true,
      curveType: 'function',
      connectSteps: true
    }; // Draw the chart in the specified div

    var areaChartWrapper = document.getElementById('comparisonUsageChart');
    var chart = new google.visualization.LineChart(areaChartWrapper); // AreaChart or LineChart or ColumnChart

    chart.draw(data, options); // Create a custom legend below the chart

    FuelUsageAreaChart.createLegend(areaChartWrapper);
  },
  // Create a custom legend with colored circles below the chart
  createLegend: function createLegend(wrapper) {
    var legendData = [{
      label: 'Gasoline 95',
      color: sharedColors.gasoline95
    }, {
      label: 'Gasoline 91',
      color: sharedColors.gasoline91
    }, {
      label: 'Diesel',
      color: sharedColors.diesel
    }];
    var legendContainer = wrapper.parentNode.querySelector('.chart-legend');
    legendData.forEach(function (item) {
      var legendItem = document.createElement('div');
      legendItem.classList.add('legend-item');
      legendItem.innerHTML = "\n            <span class=\"legend-color\" style=\"background-color: ".concat(item.color, ";\"></span>\n            <span class=\"legend-label\">").concat(item.label, "</span>\n          ");
      legendContainer.appendChild(legendItem);
    });
  }
}; // Doughnut Chart for Sites Status

var SiteStatusChart = {
  init: function init() {
    // Load Google Charts library
    google.charts.load('current', {
      packages: ['corechart']
    }); // Set callback to run when the library is loaded

    google.charts.setOnLoadCallback(SiteStatusChart.drawSteppedAreaChart);
  },
  // Function to draw the Stepped Area Chart
  drawSteppedAreaChart: function drawSteppedAreaChart() {
    // Step 1: Get values from DOM
    var onlineValue = parseInt(document.getElementById('online-value').textContent, 10);
    var offlineValue = parseInt(document.getElementById('offline-value').textContent, 10); // Step 2: Create the data table

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Status');
    data.addColumn('number', 'Online');
    data.addColumn('number', 'Offline'); // Add the data rows for Online and Offline

    data.addRows([['Online', onlineValue, 0], ['Offline', 0, offlineValue]]); // Step 3: Set chart options

    var options = {
      title: '',
      isStacked: false,
      // Stack the areas for better comparison
      hAxis: {
        title: '',
        textStyle: {
          fontSize: 12
        }
      },
      vAxis: {
        title: '',
        minValue: 0
      },
      // colors: ['#288048', '#e53434'],  // Custom colors for Online and Offline
      colors: [sharedColors.online, sharedColors.offline],
      chartArea: {
        width: '70%',
        height: '70%'
      },
      legend: {
        position: 'none'
      } // Hide default legend

    }; // Step 4: Draw the chart in the specified div

    var chartWrapper = document.getElementById('siteStatusChart');
    var chart = new google.visualization.SteppedAreaChart(chartWrapper);
    chart.draw(data, options); // Step 5: Draw the custom legend below the chart

    SiteStatusChart.createLegend(chartWrapper);
  },
  // Step 6: Create a custom legend with colored circles below the chart
  createLegend: function createLegend(wrapper) {
    var legendData = [{
      label: 'Online',
      color: sharedColors.online
    }, {
      label: 'Offline',
      color: sharedColors.offline
    }];
    var legendContainer = wrapper.parentNode.querySelector('.chart-legend');
    legendData.forEach(function (item) {
      var legendItem = document.createElement('div');
      legendItem.classList.add('legend-item');
      legendItem.innerHTML = "\n                <span class=\"legend-color\" style=\"background-color: ".concat(item.color, ";\"></span>\n                <span class=\"legend-label\">").concat(item.label, "</span>\n            ");
      legendContainer.appendChild(legendItem);
    });
  }
}; // We will Reload Charts on Menu Collapsed

var ReloadCharts = {
  // Initialize the menu toggle functionality
  init: function init() {
    // Attach the click event listener to #toggle-menu
    document.getElementById('toggle-menu').addEventListener('click', ReloadCharts.chartReload);
  },
  chartReload: function chartReload() {
    // Step 1: Check if the .gts-charts element exists
    if (document.querySelector('.gts-charts')) {
      // Step 2: Kill current charts by clearing their containers
      var chartContainers = document.querySelectorAll('.gts-charts .chart-area');
      var chartLegend = document.querySelectorAll('.gts-charts .chart-legend'); // Assuming each chart has a wrapper

      chartContainers.forEach(function (container) {
        container.innerHTML = ''; // Clear the chart container
      });
      chartLegend.forEach(function (container) {
        container.innerHTML = ''; // Clear the chart container
      }); // Optional: If your charts have specific cleanup logic, call that here
      // Example: GasolineUsagePieChart.clear(); or similar if implemented
      // Step 3: Reload the charts

      GasolineUsagePieChart.init();
      FuelUsageAreaChart.init();
      SiteStatusChart.init();
    }
  }
};
pageReady(function () {
  GetCurrentProductValue.init();
  FormatNumbers.init();
  GasolineUsagePieChart.init();
  FuelUsageAreaChart.init();
  TrendingUpdates.init();
  SiteStatusChart.init();
  ReloadCharts.init();
});