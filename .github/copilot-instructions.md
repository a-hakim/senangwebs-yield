# SenangWebs Yield (SWY) - AI Coding Agent Instructions

## Project Overview

**SenangWebs Yield** is a lightweight, zero-dependency JavaScript visualization library that renders bar, pie, and line charts using HTML/CSS/SVG instead of Canvas. It supports both declarative HTML attributes (`data-swy-*`) and a programmatic JavaScript API.

**Key Architecture Principle**: Render charts as pure HTML/CSS with minimal SVG (only for line paths) to enable responsive design, easy CSS customization, and better accessibility compared to Canvas-based solutions.

## Core Architecture

### Dual Initialization System
The library supports **two distinct initialization paths** that converge at chart classes:

1. **HTML Auto-initialization** (Primary): `Parser.findAllCharts()` → `Parser.parseBarChart/PieChart/LineChart()` → Chart class constructor → `render()`
   - Triggered automatically on `DOM.onReady()` 
   - Re-triggered on window resize for responsiveness
   - Scans for `[data-swy]` containers with `data-swy-type` attributes

2. **JavaScript API**: `SWY.initBarChart(options)` → Chart class constructor → `render()`
   - Programmatic control for dynamic data
   - Returns boolean success indicator

**Critical Pattern**: Both paths create the same config object structure `{type, xAxis, yAxis, data}` before instantiating chart classes. Charts are stateless - they only render, never update.

### Module Structure

```
src/
├── swy.js                  # Entry point, dual API, auto-init, global SWY export
├── charts/                 # Chart implementations (each extends pattern: constructor + render())
│   ├── barChart.js        # HTML/CSS bars with percentage height
│   ├── pieChart.js        # CSS conic-gradient for pie slices
│   └── lineChart.js       # SVG path for line, HTML for dots/axes
├── utils/                  # Shared utilities
│   ├── dom.js             # DOM manipulation (select, create, append, addClass, etc.)
│   ├── parser.js          # Extract chart config from data-swy-* attributes
│   ├── validator.js       # Validate config before rendering
│   └── logger.js          # Singleton logger with debug mode toggle
└── styles/
    └── charts.css         # All chart styles (imported in swy.js)
```

**Import Pattern**: All modules use ES6 imports with `.js` extensions. Webpack handles bundling to UMD format with global `SWY` export.

## Development Workflows

### Build Commands
```bash
npm run dev          # Webpack dev server on localhost:8080 with hot reload
npm run build        # Production build → dist/swy.min.js + swy.min.css
npm run build:dev    # Development build → dist/swy.js + swy.css (with source maps)
npm run watch        # Continuous development build
```

**Build Output**: Webpack creates UMD bundle exporting global `SWY` object. CSS extracted separately via `MiniCssExtractPlugin`. Production mode strips console logs and minifies.

### Code Quality
```bash
npm run lint         # ESLint check (Airbnb base config)
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Prettier format src/**, examples/**, docs/**
```

**ESLint Config** (`.eslintrc.json`): Airbnb base with relaxed rules:
- `no-console: off` (logger uses console)
- `import/extensions: off` (explicit .js extensions required)
- `no-param-reassign: off`, `no-restricted-syntax: off`, `guard-for-in: off`

**Prettier Config** (`.prettierrc.json`): Single quotes, 2-space tabs, 120 char width, trailing commas (ES5)

### Testing Local Changes
1. `npm run build:dev` to generate `dist/swy.js` and `dist/swy.css`
2. Open `examples/index.html` in browser (references `../dist/swy.min.css` and `../dist/swy.min.js`)
3. Or use `npm run dev` for live reload during development

## Code Patterns & Conventions

### Chart Implementation Pattern
Every chart class follows this structure:
```javascript
class ChartType {
  constructor(element, config) {
    this.element = element;  // Container DOM element
    this.config = config;    // Parsed/validated config
    this.container = null;   // Main chart wrapper (created in render)
  }

  render() {
    // 1. Validate config using Validator.validateChartType(this.config)
    // 2. Clear element: DOM.clear(this.element)
    // 3. Create container: DOM.create('div', {}, 'swy-chart-container')
    // 4. Build chart DOM structure using DOM utilities
    // 5. Append to element: DOM.append(this.element, this.container)
    // 6. Return true/false for success
  }

  static getDefaultColor(index) { /* ... */ }
  static calculateScale(values) { /* ... */ }  // For bar/line charts
}
```

**Never mutate `this.element` directly** - always use `DOM` utility functions for consistency and error handling.

### Data Attribute Naming
HTML API uses consistent prefixes:
- Container: `data-swy` (presence triggers chart detection)
- Type: `data-swy-type="bar-chart|pie-chart|line-chart"`
- Axes: `data-swy-x-axis="Label"`, `data-swy-y-axis="Label"`
- Data points: `data-swy-x-label`, `data-swy-y-value` (bar/line), `data-swy-label`, `data-swy-value` (pie)
- Styling: `data-swy-color="#hex"`, `data-swy-total="360"` (pie only)

### Error Handling Philosophy
- **Fail gracefully**: All chart `render()` methods return `false` on failure, never throw
- **Log everything**: Use `logger.error()` for failures, `logger.debug()` for success
- **Validate early**: Run `Validator.validateChartType()` before any DOM manipulation
- **Guard clauses**: Check container existence, data length, numeric validity upfront

### CSS Class Naming Convention
All classes prefixed with `swy-` to avoid conflicts:
- Containers: `swy-chart-container`, `swy-bar-chart`, `swy-pie-chart`, `swy-line-chart`
- Components: `swy-bar-chart-wrapper`, `swy-pie-legend`, `swy-line-point`
- Modifiers: Applied via `DOM.addClass()`

## Critical Implementation Details

### Chart Registry & Auto-initialization
- `chartRegistry` (Map) stores all initialized charts by ID
- `chartIdCounter` provides unique IDs (`bar-chart-0`, `pie-chart-1`, etc.)
- Auto-init happens in two places: `DOM.onReady()` and `window.resize` event
- **Responsive behavior**: Window resize clears registry and re-renders all charts from HTML

### Pie Chart Rendering
Uses **CSS conic-gradient** instead of SVG/Canvas:
```javascript
// Build gradient string: "color1 0% 33.3%, color2 33.3% 66.6%, ..."
const gradientStops = data.map(/*...*/).join(', ');
pieCircle.style.background = `conic-gradient(${gradientStops})`;
```
This enables pure CSS rendering with hardware acceleration.

### Line Chart SVG Path
Only chart type using SVG (for smooth curves). Pattern:
1. Create `<svg>` with responsive viewBox
2. Build `<path>` element with `d` attribute (M and L commands)
3. Create HTML elements for dots/axes/labels separately

### Validator Data Requirements
- **Bar/Line**: `data` array with `{xLabel: string, yValue: number, color?: string}`
- **Pie**: `data` array with `{label: string, value: number, color?: string}`, plus `total: number`
- All validators return boolean and log specific error messages

## Adding New Features

### Adding a New Chart Type
1. Create `src/charts/newChart.js` following the class pattern
2. Import in `src/swy.js`: `import NewChart from './charts/newChart.js'`
3. Add `initNewChart(options)` function in `swy.js`
4. Add case to `initializeFromHTML()` switch statement
5. Create `Parser.parseNewChart(element)` in `utils/parser.js`
6. Create `Validator.validateNewChart(config)` in `utils/validator.js`
7. Add styles to `src/styles/charts.css` with `swy-new-chart` prefix
8. Export function in `SWY` object at bottom of `swy.js`

### Modifying Existing Charts
- **Never change** the config object structure - it would break both APIs
- Add optional config properties with defaults in `init*Chart()` functions
- Update corresponding `Parser.parse*Chart()` to extract new attributes
- Add validation in `Validator.validate*Chart()` for new properties

## Common Pitfalls

1. **Don't mutate DOM directly** - always use `DOM` utilities for cross-browser safety
2. **Don't forget `.js` extensions** in imports - ESLint won't catch this
3. **Chart re-renders on resize** - state is not preserved, charts are stateless
4. **Debug mode is off by default** - call `SWY.setDebugMode(true)` to see debug logs
5. **CSS must be loaded** - library won't work without `swy.css` included
6. **Color defaults cycle** - `getDefaultColor(index % colors.length)` wraps around

## File References

- Entry point: `src/swy.js` (exports global `SWY` object)
- Webpack config: `webpack.config.js` (UMD build, dev server on port 8080)
- Examples: `examples/index.html` (comprehensive demo of all chart types)
- Docs: `docs/*.md` (installation, HTML API, JavaScript API, browser support)
