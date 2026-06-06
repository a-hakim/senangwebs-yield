---
name: senangwebs-yield
description: Zero-dependency data visualization library for bar, pie, and line charts using HTML/CSS/SVG with declarative data attributes.
version: 1.0.2
package: senangwebs-yield
---

# SenangWebs Yield (SWY)

## Quick Reference

- **Purpose**: Dependency-free HTML/CSS charts with SVG used for line paths
- **Entry**: `dist/swy.min.js` (UMD global `SWY`)
- **Dependencies**: none
- **Scripts**: `npm run dev`, `npm run build`, `npm run build:dev`, `npm run watch`, `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run test`, `npm run serve`

## Workflow

Read `README.md`, `package.json`, and touched source files. Match existing patterns and preserve the `swy-` CSS prefix.

## HTML Data Attributes

### Bar Chart
| Attribute | Description |
|---|---|
| `data-swy` | Chart flag |
| `data-swy-type` | `"bar-chart"` |
| `data-swy-x-axis` | X-axis title |
| `data-swy-y-axis` | Y-axis title |
| `data-swy-x-label` | X-axis item label |
| `data-swy-y-value` | Y-axis item value |
| `data-swy-color` | Bar color (hex) |

### Pie Chart
| Attribute | Description |
|---|---|
| `data-swy-type` | `"pie-chart"` |
| `data-swy-total` | Total value (for percentage calc) |
| `data-swy-label` | Slice label |
| `data-swy-value` | Slice value |
| `data-swy-color` | Slice color (hex) |

### Line Chart
| Attribute | Description |
|---|---|
| `data-swy-type` | `"line-chart"` |
| `data-swy-x-axis` | X-axis title |
| `data-swy-y-axis` | Y-axis title |
| `data-swy-x-label` | Point label |
| `data-swy-y-value` | Point value |
| `data-swy-color` | Line color (hex) |

## JavaScript API

```js
SWY.initBarChart({ container, xAxis, yAxis, data })
SWY.initPieChart({ container, total, data })
SWY.initLineChart({ container, xAxis, yAxis, data })
SWY.setDebugMode(true | false)
SWY.reinitialize()    // re-render registered charts and discover new HTML charts
SWY.getVersion()
```

## Focus Areas

- Three chart types: bar (HTML/CSS), pie (CSS conic-gradient), line (HTML/CSS with SVG polyline)
- Zero dependencies: pure HTML/CSS/SVG rendering, no Canvas
- Dual init: declarative via data attributes or JS API
- Responsive: resize events are debounced by 150ms before `SWY.reinitialize()`
- Registry: one chart instance per container; reinitialization retains JavaScript API charts
- Customizable: colors per data point, default palette of 8 colors
- CSS classes: `swy-bar-chart`, `swy-pie-chart`, `swy-line-chart`, `swy-bar`, `swy-line-path`, `swy-legend-item`, `swy-axis-label`
- Accessibility: rendered labels use text content; verify semantics when changing markup

## Implementation Guidance

- Preserve backward compatibility for all attributes, method names, and CSS classes
- Test with single data point, empty data, and large datasets
- SVG rendering must scale correctly across container widths
- Verify color defaults cycle through palette when not specified
- Preserve registry behavior: replace prior instances for the same container and prune detached containers

## Validation

```bash
npm run lint
npm run build
npm test        # placeholder
```

Use `npm run format` only when intentionally formatting all source and example files.
