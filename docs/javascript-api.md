# JavaScript API Reference

The JavaScript API provides programmatic access to create and manage charts. This is ideal for dynamic data, API responses, or when you need more control over chart creation.

## Global SWY Object

The `SWY` global object is automatically created when the library loads. All chart initialization methods are called on this object.

### Available Methods

- `SWY.initBarChart(options)` - Create a bar chart
- `SWY.initPieChart(options)` - Create a pie chart
- `SWY.initLineChart(options)` - Create a line chart
- `SWY.setDebugMode(enabled)` - Enable/disable debug logging
- `SWY.reinitialize()` - Reinitialize all charts
- `SWY.getVersion()` - Get library version

## SWY.initBarChart(options)

Create a bar chart programmatically.

### Parameters

```javascript
{
    container: String,           // (Required) CSS selector for container
    xAxis: String,               // (Optional) X-axis label
    yAxis: String,               // (Optional) Y-axis label
    data: Array                  // (Required) Array of data objects
}
```

### Data Format

Each data object should have:

```javascript
{
    xLabel: String,              // (Required) Label for the bar
    yValue: Number,              // (Required) Numeric value for the bar
    color: String                // (Optional) Hex color code
}
```

### Returns

`boolean` - `true` if chart rendered successfully, `false` otherwise

### Examples

#### Basic Bar Chart

```javascript
SWY.initBarChart({
  container: '#chart',
  xAxis: 'Month',
  yAxis: 'Sales',
  data: [
    { xLabel: 'January', yValue: 300 },
    { xLabel: 'February', yValue: 400 },
    { xLabel: 'March', yValue: 500 },
  ],
});
```

#### Bar Chart with Colors

```javascript
SWY.initBarChart({
  container: '#chart',
  xAxis: 'Product',
  yAxis: 'Units Sold',
  data: [
    { xLabel: 'Product A', yValue: 150, color: '#ff6600' },
    { xLabel: 'Product B', yValue: 200, color: '#2a22a2' },
    { xLabel: 'Product C', yValue: 250, color: '#33cc33' },
  ],
});
```

## SWY.initPieChart(options)

Create a pie chart programmatically.

### Parameters

```javascript
{
    container: String,           // (Required) CSS selector for container
    total: Number,               // (Optional) Total value for percentages
    data: Array                  // (Required) Array of data objects
}
```

### Data Format

Each data object should have:

```javascript
{
    label: String,               // (Required) Label for the slice
    value: Number,               // (Required) Numeric value
    color: String                // (Optional) Hex color code
}
```

### Returns

`boolean` - `true` if chart rendered successfully, `false` otherwise

### Examples

#### Basic Pie Chart

```javascript
SWY.initPieChart({
  container: '#chart',
  total: 500,
  data: [
    { label: 'Service A', value: 200 },
    { label: 'Service B', value: 150 },
    { label: 'Service C', value: 150 },
  ],
});
```

#### Pie Chart with Auto-calculated Total

```javascript
SWY.initPieChart({
  container: '#chart',
  // total is optional and will be auto-calculated
  data: [
    { label: 'Item 1', value: 100, color: '#ff6600' },
    { label: 'Item 2', value: 200, color: '#2a22a2' },
    { label: 'Item 3', value: 150, color: '#33cc33' },
  ],
});
```

## SWY.initLineChart(options)

Create a line chart programmatically.

### Parameters

```javascript
{
    container: String,           // (Required) CSS selector for container
    xAxis: String,               // (Optional) X-axis label
    yAxis: String,               // (Optional) Y-axis label
    data: Array                  // (Required) Array of data objects
}
```

### Data Format

Each data object should have:

```javascript
{
    xLabel: String,              // (Required) Label on X-axis
    yValue: Number,              // (Required) Numeric value
    color: String                // (Optional) Hex color code
}
```

### Returns

`boolean` - `true` if chart rendered successfully, `false` otherwise

### Examples

#### Basic Line Chart

```javascript
SWY.initLineChart({
  container: '#chart',
  xAxis: 'Week',
  yAxis: 'Sales',
  data: [
    { xLabel: 'Week 1', yValue: 100 },
    { xLabel: 'Week 2', yValue: 150 },
    { xLabel: 'Week 3', yValue: 200 },
    { xLabel: 'Week 4', yValue: 250 },
  ],
});
```

#### Line Chart with Colors

```javascript
SWY.initLineChart({
  container: '#chart',
  xAxis: 'Month',
  yAxis: 'Website Traffic',
  data: [
    { xLabel: 'January', yValue: 1000, color: '#33cc33' },
    { xLabel: 'February', yValue: 1500, color: '#ff6600' },
    { xLabel: 'March', yValue: 1200, color: '#2a22a2' },
    { xLabel: 'April', yValue: 2000, color: '#ddd222' },
  ],
});
```

## SWY.setDebugMode(enabled)

Enable or disable debug logging.

### Parameters

- `enabled` (boolean) - `true` to enable, `false` to disable

### Usage

```javascript
// Enable debug mode
SWY.setDebugMode(true);

// All operations will now log to console
SWY.initBarChart({ ... });

// Disable debug mode
SWY.setDebugMode(false);
```

## SWY.reinitialize()

Reinitialize all HTML-based charts. Useful for responsive layouts or after DOM changes.

### Usage

```javascript
SWY.reinitialize();
```

### Example: Responsive Reinitialize

```javascript
window.addEventListener('resize', () => {
  SWY.reinitialize();
});
```

## SWY.getVersion()

Get the library version.

### Returns

`string` - Version number (e.g., "1.0.0")

### Usage

```javascript
const version = SWY.getVersion();
console.log('SWY Version:', version); // "1.0.0"
```

## Complete Examples

### Fetching Data from API

```javascript
fetch('/api/sales-data')
  .then((response) => response.json())
  .then((data) => {
    // Transform API data to SWY format
    const chartData = data.map((item) => ({
      xLabel: item.month,
      yValue: item.sales,
      color: item.color,
    }));

    // Create chart
    SWY.initBarChart({
      container: '#sales-chart',
      xAxis: 'Month',
      yAxis: 'Sales ($)',
      data: chartData,
    });
  })
  .catch((error) => console.error('Error fetching data:', error));
```

### Dynamic Chart Creation

```javascript
function createChartsFromData(datasets) {
    datasets.forEach((dataset, index) => {
        const containerId = `chart-${index}`;

        // Create container dynamically
        const container = document.createElement('div');
        container.id = containerId;
        container.style.width = '100%';
        container.style.height = '300px';
        document.body.appendChild(container);

        // Create chart
        if (dataset.type === 'bar') {
            SWY.initBarChart({
                container: `#${containerId}`,
                xAxis: dataset.xLabel,
                yAxis: dataset.yLabel,
                data: dataset.data
            });
        }
    });
}

// Usage
createChartsFromData([
    {
        type: 'bar',
        xLabel: 'Month',
        yLabel: 'Revenue',
        data: [ ... ]
    }
]);
```

### Error Handling

```javascript
const success = SWY.initBarChart({
  container: '#chart',
  xAxis: 'Category',
  yAxis: 'Value',
  data: [
    { xLabel: 'A', yValue: 100 },
    { xLabel: 'B', yValue: 200 },
  ],
});

if (!success) {
  console.error('Failed to create chart');
  // Handle error - check console for details
}
```

### Multiple Charts

```javascript
// Create multiple charts at once
SWY.initBarChart({
    container: '#chart1',
    xAxis: 'Category',
    yAxis: 'Value',
    data: [ ... ]
});

SWY.initPieChart({
    container: '#chart2',
    data: [ ... ]
});

SWY.initLineChart({
    container: '#chart3',
    xAxis: 'Time',
    yAxis: 'Value',
    data: [ ... ]
});
```

## Troubleshooting

### "Container not found" Error

Make sure the container element exists before calling chart initialization:

```javascript
// Wrong - container doesn't exist yet
SWY.initBarChart({
    container: '#chart',
    data: [ ... ]
});

// Right - container exists
SWY.initBarChart({
    container: '#existing-element-id',
    data: [ ... ]
});
```

### "SWY is not defined" Error

Ensure the library is loaded before using it:

```html
<!-- Make sure this is in your HTML -->
<script src="path/to/swy.min.js"></script>

<!-- Then your chart code -->
<script>
  SWY.initBarChart({ ... });
</script>
```

### Chart Not Rendering

Check for these common issues:

1. Container element exists and has a size
2. Data array is not empty
3. Data format matches specification
4. Enable debug mode: `SWY.setDebugMode(true)`

## Type Reference

### ChartOptions

```typescript
interface BarChartOptions {
  container: string;
  xAxis?: string;
  yAxis?: string;
  data: BarDataPoint[];
}

interface BarDataPoint {
  xLabel: string;
  yValue: number;
  color?: string;
}

interface PieChartOptions {
  container: string;
  total?: number;
  data: PieDataPoint[];
}

interface PieDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface LineChartOptions {
  container: string;
  xAxis?: string;
  yAxis?: string;
  data: LineDataPoint[];
}

interface LineDataPoint {
  xLabel: string;
  yValue: number;
  color?: string;
}
```
