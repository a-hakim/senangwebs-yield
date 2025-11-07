# HTML API Documentation

The HTML API allows you to define charts directly in your HTML markup using `data-*` attributes. This is the recommended approach for most use cases as it's declarative and easy to understand.

## Basic Structure

All charts must be wrapped in a container with the `data-swy` attribute:

```html
<div data-swy>
  <div data-swy-type="[chart-type]">
    <!-- Chart data elements -->
  </div>
</div>
```

## Bar Chart

Display categorical data with vertical bars.

### Attributes

| Attribute          | Element   | Type      | Required | Description                          |
| ------------------ | --------- | --------- | -------- | ------------------------------------ |
| `data-swy`         | Container | -         | Yes      | Marks the main container             |
| `data-swy-type`    | Chart     | String    | Yes      | Must be `"bar-chart"`                |
| `data-swy-x-axis`  | Chart     | String    | No       | Label for X-axis (default: "X-Axis") |
| `data-swy-y-axis`  | Chart     | String    | No       | Label for Y-axis (default: "Y-Axis") |
| `data-swy-x-label` | Data      | String    | Yes      | Label for individual bar             |
| `data-swy-y-value` | Data      | Number    | Yes      | Value for the bar                    |
| `data-swy-color`   | Data      | Hex Color | No       | Color for the bar                    |

### Example

```html
<div data-swy>
  <div data-swy-type="bar-chart" data-swy-x-axis="Products" data-swy-y-axis="Sales (units)">
    <div data-swy-x-label="Product A" data-swy-y-value="150" data-swy-color="#ff6600"></div>
    <div data-swy-x-label="Product B" data-swy-y-value="200"></div>
    <div data-swy-x-label="Product C" data-swy-y-value="250" data-swy-color="#33cc33"></div>
  </div>
</div>
```

## Pie Chart

Display proportional data as slices of a pie.

### Attributes

| Attribute        | Element   | Type      | Required | Description                              |
| ---------------- | --------- | --------- | -------- | ---------------------------------------- |
| `data-swy`       | Container | -         | Yes      | Marks the main container                 |
| `data-swy-type`  | Chart     | String    | Yes      | Must be `"pie-chart"`                    |
| `data-swy-total` | Chart     | Number    | No       | Total value (auto-calculated if omitted) |
| `data-swy-label` | Data      | String    | Yes      | Label for pie slice                      |
| `data-swy-value` | Data      | Number    | Yes      | Value for the slice                      |
| `data-swy-color` | Data      | Hex Color | No       | Color for the slice                      |

### Example

```html
<div data-swy>
  <div data-swy-type="pie-chart" data-swy-total="1000">
    <div data-swy-label="Service A" data-swy-value="400" data-swy-color="#ff6600"></div>
    <div data-swy-label="Service B" data-swy-value="300" data-swy-color="#2a22a2"></div>
    <div data-swy-label="Service C" data-swy-value="300" data-swy-color="#33cc33"></div>
  </div>
</div>
```

## Line Chart

Display data trends over categories or time.

### Attributes

| Attribute          | Element   | Type      | Required | Description                          |
| ------------------ | --------- | --------- | -------- | ------------------------------------ |
| `data-swy`         | Container | -         | Yes      | Marks the main container             |
| `data-swy-type`    | Chart     | String    | Yes      | Must be `"line-chart"`               |
| `data-swy-x-axis`  | Chart     | String    | No       | Label for X-axis (default: "X-Axis") |
| `data-swy-y-axis`  | Chart     | String    | No       | Label for Y-axis (default: "Y-Axis") |
| `data-swy-x-label` | Data      | String    | Yes      | Label for data point on X-axis       |
| `data-swy-y-value` | Data      | Number    | Yes      | Value for the data point             |
| `data-swy-color`   | Data      | Hex Color | No       | Color for the data point             |

### Example

```html
<div data-swy>
  <div data-swy-type="line-chart" data-swy-x-axis="Month" data-swy-y-axis="Visitors">
    <div data-swy-x-label="January" data-swy-y-value="1000" data-swy-color="#33cc33"></div>
    <div data-swy-x-label="February" data-swy-y-value="1500" data-swy-color="#ff6600"></div>
    <div data-swy-x-label="March" data-swy-y-value="1200"></div>
    <div data-swy-x-label="April" data-swy-y-value="2000" data-swy-color="#2a22a2"></div>
  </div>
</div>
```

## Color Values

Colors can be specified as:

- **Hex colors**: `#ff6600`, `#2a22a2`, `#33cc33`
- **Short hex**: `#f60`, `#2a2`, `#3c3`
- **RGB**: `rgb(255, 102, 0)`
- **Named colors**: `red`, `blue`, `green`, etc.

## Complete Example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>SWY HTML API Example</title>
    <style>
      body {
        font-family: Arial;
        padding: 20px;
      }
      .chart-row {
        margin: 30px 0;
      }
      [data-swy] {
        max-width: 100%;
      }
    </style>
  </head>
  <body>
    <h1>Data Visualization with SWY</h1>

    <!-- Bar Chart Example -->
    <div class="chart-row">
      <h2>Quarterly Revenue</h2>
      <div data-swy>
        <div data-swy-type="bar-chart" data-swy-x-axis="Quarter" data-swy-y-axis="Revenue ($1000s)">
          <div data-swy-x-label="Q1" data-swy-y-value="250" data-swy-color="#ff6600"></div>
          <div data-swy-x-label="Q2" data-swy-y-value="300" data-swy-color="#2a22a2"></div>
          <div data-swy-x-label="Q3" data-swy-y-value="280" data-swy-color="#33cc33"></div>
          <div data-swy-x-label="Q4" data-swy-y-value="350" data-swy-color="#ddd222"></div>
        </div>
      </div>
    </div>

    <!-- Pie Chart Example -->
    <div class="chart-row">
      <h2>Market Distribution</h2>
      <div data-swy>
        <div data-swy-type="pie-chart" data-swy-total="100">
          <div data-swy-label="Company A" data-swy-value="35" data-swy-color="#ff6600"></div>
          <div data-swy-label="Company B" data-swy-value="30" data-swy-color="#2a22a2"></div>
          <div data-swy-label="Company C" data-swy-value="20" data-swy-color="#33cc33"></div>
          <div data-swy-label="Others" data-swy-value="15" data-swy-color="#ddd222"></div>
        </div>
      </div>
    </div>

    <!-- Line Chart Example -->
    <div class="chart-row">
      <h2>Monthly Website Traffic</h2>
      <div data-swy>
        <div data-swy-type="line-chart" data-swy-x-axis="Month" data-swy-y-axis="Visitors (thousands)">
          <div data-swy-x-label="Jan" data-swy-y-value="50" data-swy-color="#33cc33"></div>
          <div data-swy-x-label="Feb" data-swy-y-value="80"></div>
          <div data-swy-x-label="Mar" data-swy-y-value="65"></div>
          <div data-swy-x-label="Apr" data-swy-y-value="90"></div>
          <div data-swy-x-label="May" data-swy-y-value="120"></div>
        </div>
      </div>
    </div>

    <script src="path/to/swy.min.js"></script>
  </body>
</html>
```

## Best Practices

1. **Always wrap charts in `data-swy`** container
2. **Use meaningful axis labels** for clarity
3. **Specify colors for consistency** with your brand
4. **Test responsiveness** by resizing the browser
5. **Use semantic HTML** in your data elements
6. **Validate numeric values** - ensure `data-swy-y-value` is a valid number

## Error Handling

The library logs errors to the console:

- Missing required attributes
- Invalid chart types
- Malformed numeric values
- Duplicate attribute values

Enable debug mode to see detailed information:

```html
<script src="path/to/swy.min.js"></script>
<script>
  SWY.setDebugMode(true);
</script>
```

## Comparison with JavaScript API

| Feature        | HTML API    | JavaScript API |
| -------------- | ----------- | -------------- |
| Setup          | Declarative | Programmatic   |
| Learning Curve | Easier      | Moderate       |
| Dynamic Data   | Limited     | Full           |
| Code Length    | Concise     | Verbose        |
| Flexibility    | Limited     | High           |
| Performance    | Equal       | Equal          |

Use HTML API for static charts and JavaScript API for dynamic data.
