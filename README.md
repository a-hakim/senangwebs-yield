# SenangWebs Yield (SWY)

A lightweight, dependency-free JavaScript library for creating beautiful data visualizations using HTML, CSS, and SVG. Define charts with custom HTML attributes or use the JavaScript API. Perfect for developers who need quick, professional-looking charts without the overhead of large charting libraries.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)
[![CI](https://github.com/a-hakim/senangwebs-yield/actions/workflows/ci.yml/badge.svg)](https://github.com/a-hakim/senangwebs-yield/actions/workflows/ci.yml)

![SenangWebs Yield Preview](https://raw.githubusercontent.com/a-hakim/senangwebs-yield/master/swy_preview.png)

SenangWebs Yield [Demo](https://dev.use.senangwebs.com/maker/senangwebs-yield).

## Features

- **Lightweight** - Zero external dependencies, vanilla JavaScript
- **Modern Rendering** - Uses HTML, CSS, and SVG instead of Canvas for better versatility and responsive design
- **Declarative** - HTML-first approach with `data-swy` attributes
- **Flexible** - JavaScript API for dynamic use cases
- **Chart Types** - Vertical/horizontal bars, pie/doughnut charts, and line/area charts with linear, smooth, or stepped curves
- **Customizable** - Easy to style with CSS, no coding knowledge required
- **Accessible** - Charts expose `role="img"` with an accessible name, plus a visually hidden data summary for screen readers
- **Data Safety** - Unparseable values and invalid colors are skipped/rejected with console warnings instead of silently corrupting the chart
- **Fail Visibly** - If a chart cannot render, a clear error message appears in place instead of an empty container
- **Auto-initialization** - Charts initialize automatically from HTML markup on page load
- **Responsive Updates** - Existing charts re-render after a debounced container resize (ResizeObserver, with window-resize fallback)

## Installation

### NPM
```bash
npm install senangwebs-yield
```

### Direct Script Tag
```html
<!-- Include both CSS and JS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/senangwebs-yield@latest/dist/swy.min.css">
<script src="https://cdn.jsdelivr.net/npm/senangwebs-yield@latest/dist/swy.min.js"></script>
```

### Manual Download
Download `swy.min.css` and `swy.min.js` from the [releases page](https://github.com/a-hakim/senangwebs-yield/releases) and include them in your HTML:
```html
<link rel="stylesheet" href="path/to/swy.min.css">
<script src="path/to/swy.min.js"></script>
```

> **Note:** Both the CSS and JavaScript files are required for charts to render properly.

## Quick Start

### HTML API (Recommended)

Define charts directly in your HTML using `data-swy` attributes. Charts automatically initialize on page load!

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="path/to/swy.min.css">
</head>
<body>
    <!-- Bar Chart -->
    <div data-swy>
        <div data-swy-type="bar-chart" 
             data-swy-x-axis="Company" 
             data-swy-y-axis="Sales">
            <div data-swy-x-label="Company A" data-swy-y-value="150" data-swy-color="#ff6600"></div>
            <div data-swy-x-label="Company B" data-swy-y-value="200" data-swy-color="#2a22a2"></div>
            <div data-swy-x-label="Company C" data-swy-y-value="250" data-swy-color="#33cc33"></div>
        </div>
    </div>

    <!-- Pie Chart -->
    <div data-swy>
        <div data-swy-type="pie-chart" data-swy-total="360">
            <div data-swy-label="Product X" data-swy-value="120" data-swy-color="#ff6600"></div>
            <div data-swy-label="Product Y" data-swy-value="90" data-swy-color="#2a22a2"></div>
            <div data-swy-label="Product Z" data-swy-value="150" data-swy-color="#33cc33"></div>
        </div>
    </div>

    <!-- Line Chart -->
    <div data-swy>
        <div data-swy-type="line-chart" 
             data-swy-x-axis="Day" 
             data-swy-y-axis="Visitors">
            <div data-swy-x-label="Monday" data-swy-y-value="50"></div>
            <div data-swy-x-label="Tuesday" data-swy-y-value="80"></div>
            <div data-swy-x-label="Wednesday" data-swy-y-value="65"></div>
            <div data-swy-x-label="Thursday" data-swy-y-value="90"></div>
        </div>
    </div>

    <script src="path/to/swy.min.js"></script>
</body>
</html>
```

### JavaScript API

For dynamic charts, data from APIs, or programmatic control:

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="path/to/swy.min.css">
</head>
<body>
    <!-- Empty containers for charts -->
    <div id="bar-chart-container"></div>
    <div id="pie-chart-container"></div>
    <div id="line-chart-container"></div>

    <script src="path/to/swy.min.js"></script>
    <script>
        // Bar Chart
        SWY.initBarChart({
            container: '#bar-chart-container',
            xAxis: 'Month',
            yAxis: 'Revenue ($K)',
            data: [
                { xLabel: 'January', yValue: 300, color: '#ff6600' },
                { xLabel: 'February', yValue: 400, color: '#2a22a2' },
                { xLabel: 'March', yValue: 500, color: '#33cc33' }
            ]
        });

        // Pie Chart
        SWY.initPieChart({
            container: '#pie-chart-container',
            total: 500, // Optional, auto-calculated if omitted
            data: [
                { label: 'Service A', value: 200, color: '#ff6600' },
                { label: 'Service B', value: 150, color: '#2a22a2' },
                { label: 'Service C', value: 150, color: '#33cc33' }
            ]
        });

        // Line Chart
        SWY.initLineChart({
            container: '#line-chart-container',
            xAxis: 'Week',
            yAxis: 'Sales',
            data: [
                { xLabel: 'Week 1', yValue: 100 },
                { xLabel: 'Week 2', yValue: 150 },
                { xLabel: 'Week 3', yValue: 200 },
                { xLabel: 'Week 4', yValue: 250 }
            ]
        });

        // Fetch data from API and create chart
        fetch('/api/chart-data')
            .then(response => response.json())
            .then(data => {
                SWY.initBarChart({
                    container: '#api-chart',
                    xAxis: 'Category',
                    yAxis: 'Value',
                    data: data.items
                });
            });
    </script>
</body>
</html>
```

## Chart Types

### Bar Chart
Display categorical data with vertical bars.

**HTML Attributes:**
- `data-swy-type="bar-chart"` - Chart type
- `data-swy-x-axis` - X-axis label
- `data-swy-y-axis` - Y-axis label
- `data-swy-x-label` - Individual bar label
- `data-swy-y-value` - Bar value (numeric)
- `data-swy-color` - Optional bar color

**JavaScript Options:**
```javascript
{
    container: '#element-id',
    xAxis: 'Category Label',
    yAxis: 'Value Label',
    data: [
        { xLabel: 'Label', yValue: 100, color: '#ff6600' }
    ]
}
```

### Pie Chart
Display proportional data as pie slices.

**HTML Attributes:**
- `data-swy-type="pie-chart"` - Chart type
- `data-swy-total` - Total value for percentages
- `data-swy-label` - Slice label
- `data-swy-value` - Slice value (numeric)
- `data-swy-color` - Optional slice color

**JavaScript Options:**
```javascript
{
    container: '#element-id',
    total: 100, // Optional, auto-calculated if omitted
    data: [
        { label: 'Category', value: 30, color: '#ff6600' }
    ]
}
```

### Line Chart
Display data trends over time or categories.

**HTML Attributes:**
- `data-swy-type="line-chart"` - Chart type
- `data-swy-x-axis` - X-axis label
- `data-swy-y-axis` - Y-axis label
- `data-swy-x-label` - Point label on x-axis
- `data-swy-y-value` - Point value (numeric)
- `data-swy-color` - Optional point color

**JavaScript Options:**
```javascript
{
    container: '#element-id',
    xAxis: 'Time Label',
    yAxis: 'Value Label',
    data: [
        { xLabel: 'Point 1', yValue: 100, color: '#33cc33' }
    ]
}
```

## Customization

### Chart variations and options

Use the existing `SWY.initBarChart`, `SWY.initPieChart`, and `SWY.initLineChart` methods. Pass presentation options at the top level alongside `data`. HTML uses the corresponding kebab-case attribute on the element with `data-swy-type`; chart types and data-point formats are unchanged.

| Chart | JavaScript option | HTML attribute | Values / default |
|---|---|---|---|
| All | `palette` | `data-swy-palette` | Nonempty color array; existing eight-color palette by default |
| All | `animate` | `data-swy-animate` | Boolean; `true` |
| Bar | `orientation` | `data-swy-orientation` | `vertical` (default), `horizontal` |
| Bar | `barGap` | `data-swy-bar-gap` | Nonnegative pixels; 20 (15 at mobile widths when default) |
| Bar | `barRadius` | `data-swy-bar-radius` | Nonnegative pixels; 0; rounds the value end of each bar |
| Bar | `showValues` | `data-swy-show-values` | Boolean; `true`; category labels remain visible |
| Pie | `variant` | `data-swy-variant` | `pie` (default), `doughnut` |
| Pie | `holeSize` | `data-swy-hole-size` | 10?90 percent of diameter; 60; doughnut only |
| Pie | `centerText` | `data-swy-center-text` | Plain text; empty; doughnut only |
| Pie | `showLabels` | `data-swy-show-labels` | Boolean; `true`; slice percentages |
| Pie | `showLegend` | `data-swy-show-legend` | Boolean; `true` |
| Pie | `legendPosition` | `data-swy-legend-position` | `right` (default), `bottom`; stacks on mobile |
| Line | `variant` | `data-swy-variant` | `line` (default), `area` |
| Line | `curve` | `data-swy-curve` | `linear` (default), `smooth`, `step` |
| Line | `lineColor` | `data-swy-line-color` | CSS color; `#2a22a2`; also colors the area fill |
| Line | `lineWidth` | `data-swy-line-width` | Positive pixels; 3 |
| Line | `showPoints` | `data-swy-show-points` | Boolean; `true`; hiding markers also hides their hover tooltips |
| Line | `pointSize` | `data-swy-point-size` | Positive pixels; 10 |
| Line | `fillOpacity` | `data-swy-fill-opacity` | 0?1; 0.2; area only |

HTML booleans require the literal strings `"true"` or `"false"`. HTML palettes use JSON arrays, including for colors with commas:

```html
<div data-swy style="height: 360px">
  <div data-swy-type="bar-chart" data-swy-orientation="horizontal"
       data-swy-bar-radius="6" data-swy-bar-gap="12" data-swy-animate="false"
       data-swy-palette='["rgb(15, 118, 110)", "#2563eb"]'>
    <div data-swy-x-label="Jan" data-swy-y-value="35"></div>
    <div data-swy-x-label="Feb" data-swy-y-value="65"></div>
  </div>
</div>
```

Equivalent JavaScript (using an empty container):

```javascript
SWY.initBarChart({
  container: '#horizontal-bars',
  orientation: 'horizontal', barRadius: 6, barGap: 12, animate: false,
  palette: ['rgb(15, 118, 110)', '#2563eb'],
  data: [{ xLabel: 'Jan', yValue: 35 }, { xLabel: 'Feb', yValue: 65 }]
});

SWY.initPieChart({
  container: '#doughnut',
  variant: 'doughnut', holeSize: 65, centerText: '100 visits', legendPosition: 'bottom',
  data: [{ label: 'Jan', value: 35 }, { label: 'Feb', value: 65 }]
});

SWY.initLineChart({
  container: '#area',
  variant: 'area', curve: 'smooth', lineColor: '#0f766e',
  lineWidth: 4, showPoints: false, fillOpacity: 0.25,
  data: [{ xLabel: 'Jan', yValue: 35 }, { xLabel: 'Feb', yValue: 65 }, { xLabel: 'Mar', yValue: 50 }]
});
```

- Palettes cycle over bars, slices, and line markers. Valid per-item colors override the palette; line stroke and area fill use `lineColor` independently.
- Invalid optional settings produce a warning and fall back to defaults. Numbers must be finite, and JavaScript booleans must be actual booleans. An invalid palette falls back as a whole. Invalid chart data retains the existing validation behavior.
- Horizontal charts retain `xLabel` / `yValue` data and `xAxis` / `yAxis` category/value titles; titles move with their visual axes.
- Smooth curves use monotone interpolation without overshoot. Stepped curves hold the previous value until the next category. Area fills close to zero; single-point charts retain a short reference segment.
- Doughnut centers are transparent, so the container background remains visible. Center text is rendered as text, never HTML, and is clipped to the hole when too long. Percentage labels use visible slice midpoints and are hidden if they cannot fit inside a small disc or thin ring. The legend and accessible summary retain the data.
- Explicit pie totals still control percentages, and overflow is clamped. Any unused portion of an explicit total is transparent.
- `animate: false` disables chart animations and transitions. All charts also respect `prefers-reduced-motion: reduce`.
- Options persist through container resize and `SWY.reinitialize()`. Reinitialize rerenders saved options; call an initializer again to replace a configuration.

See [the examples page](examples/index.html) for paired, runnable HTML and JavaScript examples of every variation, with expandable source snippets.

### Default Colors
All chart types use the same predefined color palette when no `color` is specified:
- `#ff6600` - Orange
- `#2a22a2` - Blue
- `#33cc33` - Green
- `#ddd222` - Yellow
- `#ff5733` - Red-Orange
- `#c70039` - Crimson
- `#900c3f` - Purple
- `#FF69B4` - Hot Pink

Colors accept hex (`#f60`, `#ff6600`, `#ff6600ff`), `rgb()`/`rgba()`, `hsl()`/`hsla()`, and CSS keyword formats. Invalid color strings are rejected with a console warning and the palette default is used instead.

### CSS Customization
Since charts are rendered with HTML and CSS, you can easily customize their appearance:

```css
/* Customize bar chart colors */
.swy-bar-chart .swy-bar {
    transition: opacity 0.3s ease;
}

.swy-bar-chart .swy-bar:hover {
    opacity: 0.8;
}

/* Customize pie chart labels */
.swy-pie-chart .swy-legend-item {
    font-size: 14px;
    font-weight: bold;
}

/* Customize line chart */
.swy-line-chart .swy-line-path {
    stroke-width: 3;
}

/* Customize axis labels */
.swy-axis-label {
    font-size: 12px;
    color: #666;
}

/* Change chart container styling */
[data-swy] {
    background: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
}
```

### Responsive Design
Charts automatically resize to fit their container. A `ResizeObserver` watches each chart's container and re-renders it in place (debounced by 150 ms) when its size changes - including container-driven changes such as sidebar toggles, tab panels, and flex/grid reflow. Browsers without `ResizeObserver` fall back to a debounced window resize listener.

```css
/* Make chart containers responsive */
[data-swy] {
    width: 100%;
    max-width: 800px;
    height: 400px;
}

/* For mobile devices */
@media (max-width: 768px) {
    [data-swy] {
        height: 300px;
    }
}
```

> **Minimum container sizes:** to render fully, give chart containers at least ~300px of height and width (bar charts need ~250px of vertical space, line charts ~280px, and the pie is a 300px circle that scales down fluidly with its container where `aspect-ratio` is supported).

## API Reference

### Global SWY Object

The library exposes a global `SWY` object with the following methods:

#### `SWY.initBarChart(options)`
Initialize a bar chart programmatically. Initializing the same container again replaces its previously registered chart.

**Parameters:**
- `options.container` (string) - CSS selector for the container element
- `options.xAxis` (string) - Label for the X-axis
- `options.yAxis` (string) - Label for the Y-axis
- `options.data` (array) - Array of data points with `xLabel`, `yValue`, and optional `color`

**Returns:** `boolean` - `true` if successful, `false` otherwise

**Example:**
```javascript
SWY.initBarChart({
    container: '#my-chart',
    xAxis: 'Months',
    yAxis: 'Revenue ($K)',
    data: [
        { xLabel: 'Jan', yValue: 150, color: '#ff6600' },
        { xLabel: 'Feb', yValue: 200, color: '#2a22a2' }
    ]
});
```

#### `SWY.initPieChart(options)`
Initialize a pie chart programmatically.

**Parameters:**
- `options.container` (string) - CSS selector for the container element
- `options.total` (number, optional) - Total value for percentage calculation (auto-calculated if omitted)
- `options.data` (array) - Array of data points with `label`, `value`, and optional `color`

**Returns:** `boolean` - `true` if successful, `false` otherwise

**Example:**
```javascript
SWY.initPieChart({
    container: '#my-pie',
    data: [
        { label: 'Category A', value: 120, color: '#ff6600' },
        { label: 'Category B', value: 80, color: '#2a22a2' }
    ]
});
```

#### `SWY.initLineChart(options)`
Initialize a line chart programmatically.

**Parameters:**
- `options.container` (string) - CSS selector for the container element
- `options.xAxis` (string) - Label for the X-axis
- `options.yAxis` (string) - Label for the Y-axis
- `options.data` (array) - Array of data points with `xLabel`, `yValue`, and optional `color`

**Returns:** `boolean` - `true` if successful, `false` otherwise

**Example:**
```javascript
SWY.initLineChart({
    container: '#my-line',
    xAxis: 'Days',
    yAxis: 'Visitors',
    data: [
        { xLabel: 'Mon', yValue: 50 },
        { xLabel: 'Tue', yValue: 80 }
    ]
});
```

#### `SWY.setDebugMode(enabled)`
Enable or disable debug logging to the console.

**Parameters:**
- `enabled` (boolean) - `true` to enable debug mode, `false` to disable

**Example:**
```javascript
SWY.setDebugMode(true); // Enable debug logs
```

#### `SWY.reinitialize()`
Re-render all registered charts and initialize any new declarative charts added after page load. Detached chart containers are removed from the internal registry.

**Returns:** `void`

**Example:**
```javascript
// After changing a chart container's layout or adding new data-swy markup
SWY.reinitialize();
```

#### `SWY.destroy()`
Tear down the library: clear the chart registry, disconnect resize observers, and reset internal state. Useful for SPA unmounts and test cleanup. After calling `destroy()`, charts can be re-initialized normally.

**Returns:** `void`

**Example:**
```javascript
SWY.destroy();
```

#### `SWY.getVersion()`
Get the current library version.

**Returns:** `string` - Version number (e.g., "1.1.0")

**Example:**
```javascript
console.log('SWY Version:', SWY.getVersion());
```

## Data Validation

SWY validates its input and fails loudly rather than silently:

- **Invalid numeric values** - a `data-swy-y-value` / `data-swy-value` that is missing or not a number causes that data item to be **skipped**, with a console warning naming the offending item.
- **Negative values** are rejected for all chart types (pie already required non-negative values).
- **Pie totals** - when an explicit `data-swy-total` differs from the sum of the slice values, a warning is logged and percentages are calculated against the provided total; gradient stops are clamped so overflowing slices can't corrupt the render.
- **Render failures** produce a visible error message in place of the chart (plus `console.error`), never a silently emptied container.

## Browser Support

SWY works on all modern browsers that support HTML5, CSS3, and SVG. Note that **pie charts use CSS `conic-gradient`**, which sets the effective minimum versions:

| Browser | Version |
|---------|---------|
| Chrome  | 69+     |
| Firefox | 83+     |
| Safari  | 12.1+   |
| Edge    | 79+     |
| Opera   | 56+     |
| Mobile Safari | iOS 12.2+ |
| Chrome Mobile | Android 69+ |

**Note:** Bar and line charts render with basic HTML/CSS/SVG and work on older browsers; only the pie chart requires the versions above. There is no IE support. Doughnut charts additionally require CSS radial-gradient masking (standard or WebKit-prefixed); ordinary pies do not use masks.

### Accessibility Notes
Each chart renders an accessible name (`role="img"` + `aria-label`, e.g. "Bar chart: Revenue by Quarters") and a visually hidden list of its data for screen readers. Known limitation: hover tooltips (line chart points) are not keyboard/touch accessible - the data summary serves as the accessible alternative.

## Development

### Setup
Clone the repository and install dependencies:
```bash
git clone https://github.com/senangwebs/senangwebs-yield.git
cd senangwebs-yield
npm install
```

### Development Server
Start the development server with hot reload:
```bash
npm run dev
```
This will open the examples page at `http://localhost:8080`.

### Test
Run the test suite (Vitest + jsdom):
```bash
npm test
```

Watch mode for tests:
```bash
npm run test:watch
```

CI runs lint, tests, and build on Node 18/20/22 via GitHub Actions (`.github/workflows/ci.yml`).

### Build
Build the production-ready files:
```bash
npm run build
```
Output files are created in the `dist/` directory:
- `swy.min.js` - Minified JavaScript
- `swy.min.css` - Minified CSS

Run `npm run build:dev` to create the non-minified `swy.js` and `swy.css` files.

### Development Build
Build without minification for debugging:
```bash
npm run build:dev
```

### Watch Mode
Automatically rebuild on file changes:
```bash
npm run watch
```

### Lint
Check code for style and quality issues:
```bash
npm run lint
```

Fix linting issues automatically:
```bash
npm run lint:fix
```

### Format
Format code with Prettier:
```bash
npm run format
```

### Project Structure
```
senangwebs-yield/
├── src/
│   ├── swy.js              # Main entry point
│   ├── charts/
│   │   ├── barChart.js     # Bar chart implementation
│   │   ├── pieChart.js     # Pie chart implementation
│   │   └── lineChart.js    # Line chart implementation
│   ├── styles/
│   │   └── charts.css      # Chart styling
│   └── utils/
│       ├── dom.js          # DOM utilities
│       ├── logger.js       # Logging utilities
│       ├── parser.js       # HTML attribute parser
│       └── validator.js    # Input validation
├── tests/                  # Vitest test suite
├── dist/                   # Built files (generated)
├── examples/               # Example HTML files
└── webpack.config.js       # Build configuration
```

## Use Cases

SenangWebs Yield is perfect for:
- **Dashboards** - Quick visualizations for admin panels and analytics dashboards
- **Reports** - Embedding charts in web-based reports
- **Documentation** - Adding charts to technical documentation
- **Presentations** - Interactive web-based presentations
- **Educational Content** - Teaching data visualization concepts
- **Lightweight Projects** - Where full-featured charting libraries are overkill
- **No-Code Solutions** - Content editors can add charts via HTML without JavaScript knowledge

## Performance

- **Small Bundle Size** - About 27KB minified (JS + CSS combined)
- **Fast Rendering** - HTML/CSS rendering is faster than Canvas for simple charts
- **Zero Dependencies** - No jQuery, React, or other frameworks required
- **Efficient Updates** - Only the charts whose containers actually changed size are re-rendered (debounced, via ResizeObserver)
- **Mobile Optimized** - Smooth performance on mobile devices

## Examples

Check out the `/examples` directory for complete working examples:
- **index.html** - Comprehensive showcase of all chart types
- HTML API examples
- JavaScript API examples
- Advanced examples with larger datasets
- Responsive design demonstrations

## License

MIT License - see [LICENSE.md](LICENSE.md) for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Guidelines
1. Follow the existing code style (ESLint + Prettier)
2. Add examples for new features
3. Add or update tests (`npm test`) - CI enforces lint, tests, and build
4. Update documentation as needed
5. Test on multiple browsers
6. Keep the library lightweight and dependency-free
