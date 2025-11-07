# Getting Started

This guide will help you create your first chart with SenangWebs Yield.

## Basic Setup

### Step 1: Include SWY

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My First Chart</title>
  </head>
  <body>
    <script src="path/to/swy.min.js"></script>
  </body>
</html>
```

### Step 2: Create a Container

```html
<div id="my-chart" style="width: 400px; height: 300px;"></div>
```

### Step 3: Initialize a Chart

Using JavaScript API:

```javascript
SWY.initBarChart({
  container: '#my-chart',
  xAxis: 'Month',
  yAxis: 'Sales',
  data: [
    { xLabel: 'Jan', yValue: 100 },
    { xLabel: 'Feb', yValue: 150 },
    { xLabel: 'Mar', yValue: 120 },
  ],
});
```

Or using HTML attributes:

```html
<div data-swy>
  <div data-swy-type="bar-chart" data-swy-x-axis="Month" data-swy-y-axis="Sales">
    <div data-swy-x-label="Jan" data-swy-y-value="100"></div>
    <div data-swy-x-label="Feb" data-swy-y-value="150"></div>
    <div data-swy-x-label="Mar" data-swy-y-value="120"></div>
  </div>
</div>
```

## Complete Example

Here's a complete HTML file with all three chart types:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SWY Getting Started</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f5f5f5;
      }
      .chart-container {
        background: white;
        padding: 20px;
        margin: 20px 0;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      h1,
      h2 {
        color: #333;
      }
    </style>
  </head>
  <body>
    <h1>Welcome to SenangWebs Yield</h1>

    <!-- Bar Chart -->
    <div class="chart-container">
      <h2>Sales by Quarter</h2>
      <div id="bar-chart" style="width: 100%; height: 300px;"></div>
    </div>

    <!-- Pie Chart -->
    <div class="chart-container">
      <h2>Market Share</h2>
      <div id="pie-chart" style="width: 100%; height: 300px;"></div>
    </div>

    <!-- Line Chart -->
    <div class="chart-container">
      <h2>Website Traffic</h2>
      <div id="line-chart" style="width: 100%; height: 300px;"></div>
    </div>

    <script src="path/to/swy.min.js"></script>
    <script>
      // Bar Chart
      SWY.initBarChart({
        container: '#bar-chart',
        xAxis: 'Quarter',
        yAxis: 'Sales (thousands)',
        data: [
          { xLabel: 'Q1', yValue: 250, color: '#ff6600' },
          { xLabel: 'Q2', yValue: 300, color: '#2a22a2' },
          { xLabel: 'Q3', yValue: 280, color: '#33cc33' },
          { xLabel: 'Q4', yValue: 350, color: '#ddd222' },
        ],
      });

      // Pie Chart
      SWY.initPieChart({
        container: '#pie-chart',
        total: 100,
        data: [
          { label: 'Company A', value: 35, color: '#ff6600' },
          { label: 'Company B', value: 30, color: '#2a22a2' },
          { label: 'Company C', value: 25, color: '#33cc33' },
          { label: 'Others', value: 10, color: '#ddd222' },
        ],
      });

      // Line Chart
      SWY.initLineChart({
        container: '#line-chart',
        xAxis: 'Month',
        yAxis: 'Visitors',
        data: [
          { xLabel: 'Jan', yValue: 1000, color: '#33cc33' },
          { xLabel: 'Feb', yValue: 1500, color: '#ff6600' },
          { xLabel: 'Mar', yValue: 1200, color: '#2a22a2' },
          { xLabel: 'Apr', yValue: 2000, color: '#ddd222' },
          { xLabel: 'May', yValue: 2500, color: '#ff5733' },
        ],
      });
    </script>
  </body>
</html>
```

## Adding Custom Colors

You can specify colors for individual data points:

```javascript
SWY.initBarChart({
  container: '#chart',
  xAxis: 'Category',
  yAxis: 'Value',
  data: [
    { xLabel: 'Item A', yValue: 100, color: '#FF5733' },
    { xLabel: 'Item B', yValue: 200, color: '#33FF57' },
    { xLabel: 'Item C', yValue: 150, color: '#3357FF' },
  ],
});
```

## Dynamic Data from APIs

Fetch data from an API and create a chart:

```javascript
// Fetch data from API
fetch('/api/sales')
  .then((response) => response.json())
  .then((data) => {
    // Transform data for SWY
    const chartData = data.map((item) => ({
      xLabel: item.name,
      yValue: item.value,
      color: item.color,
    }));

    // Create chart
    SWY.initBarChart({
      container: '#chart',
      xAxis: 'Product',
      yAxis: 'Sales',
      data: chartData,
    });
  });
```

## Debug Mode

Enable debug logging to troubleshoot issues:

```javascript
SWY.setDebugMode(true);

// Now all operations will be logged to console
SWY.initBarChart({ ... });
```

## Common Patterns

### Responsive Charts

Charts automatically resize with their container:

```html
<style>
  #responsive-chart {
    width: 100%;
    max-width: 800px;
    height: 400px;
  }
</style>

<div id="responsive-chart"></div>

<script src="path/to/swy.min.js"></script>
<script>
  SWY.initBarChart({
      container: '#responsive-chart',
      xAxis: 'Month',
      yAxis: 'Sales',
      data: [ ... ]
  });
</script>
```

### Multiple Charts

You can create multiple charts on the same page:

```html
<div id="chart1" style="width: 49%; display: inline-block;"></div>
<div id="chart2" style="width: 49%; display: inline-block;"></div>

<script>
  SWY.initBarChart({
    container: '#chart1',
    /* config */
  });

  SWY.initPieChart({
    container: '#chart2',
    /* config */
  });
</script>
```

### Updating Charts

To update a chart with new data, reinitialize it:

```javascript
// Update chart
SWY.initBarChart({
  container: '#chart',
  xAxis: 'Month',
  yAxis: 'Sales',
  data: newData, // Your updated data
});
```

## What's Next?

- Explore the [HTML API Documentation](html-api.md)
- Read the [JavaScript API Reference](javascript-api.md)
- Check out [Browser Support](browser-support.md)
- View more [Examples](../examples/)
