---
name: senangwebs-yield
description: Zero-dependency data visualization library for bar, pie, and line charts using HTML/CSS/SVG with declarative data attributes.
version: 1.0.3
package: senangwebs-yield
---

# SenangWebs Yield (SWY)

## Quick Reference

- **Purpose**: Dependency-free HTML/CSS charts with SVG used for line paths
- **Entry**: `dist/swy.min.js` (UMD global `SWY`)
- **Dependencies**: none
- **Scripts**: `npm run dev`, `npm run build`, `npm run build:dev`, `npm run watch`, `npm run lint`, `npm run lint:fix`, `npm run format`, `npm test`, `npm run test:watch`, `npm run serve`

## Workflow

Read `README.md`, `package.json`, and touched source files. Match existing patterns and preserve the `swy-` CSS prefix. Tests live in `tests/` (Vitest + jsdom, config in `vitest.config.mjs`).

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
SWY.destroy()         // clear registry + observers, reset state (SPA unmounts, tests)
SWY.getVersion()
```

## Focus Areas

- Three chart types: bar (HTML/CSS), pie (CSS conic-gradient), line (HTML/CSS with SVG polyline)
- Zero dependencies: pure HTML/CSS/SVG rendering, no Canvas
- Dual init: declarative via data attributes or JS API
- Responsive: per-container ResizeObserver re-renders (debounced 150ms); window-resize fallback when ResizeObserver is unavailable
- Registry: one chart instance per container; reinitialization retains JavaScript API charts and prunes detached containers via `element.isConnected`
- Customizable: colors per data point, one shared default palette of 8 colors across all chart types
- Data validation: unparseable numeric attributes are skipped with a console warning; negative values are rejected; invalid colors fall back to the palette; pie gradient stops are clamped to 100%
- Fail visibly: render failures log `console.error` (kept in the production bundle) and show a `.swy-render-error` fallback element
- Accessibility: each chart renders a `role="img"` accessible name plus a visually hidden (`swy-sr-only`) data summary list
- CSS classes: `swy-bar-chart`, `swy-pie-chart`, `swy-line-chart`, `swy-bar`, `swy-line-path`, `swy-pie-legend-item`, `swy-sr-only`, `swy-render-error`

## Implementation Guidance

- Preserve backward compatibility for all attributes, method names, and CSS classes
- Test with single data point, empty data, invalid values, negative values, and large datasets
- SVG rendering must scale correctly across container widths
- Verify color defaults cycle through the shared palette when not specified
- Preserve registry behavior: replace prior instances for the same container and prune detached containers
- The version constant is injected from `package.json` via webpack DefinePlugin (`__SWY_VERSION__`) - never hardcode it in `src/swy.js`

## Validation

```bash
npm run lint
npm test
npm run build
```

## Chart variations and presentation options

- Keep the three chart types and initializers; use top-level options / matching kebab-case data-swy attributes.
- Shared normalization is in src/utils/options.js; defaults and palettes must stay consistent between HTML and JS. HTML palettes are JSON arrays, booleans are explicit true/false strings.
- All charts: palette, animate. Bars: orientation (vertical/horizontal), barGap, barRadius, showValues.
- Pies: variant (pie/doughnut), holeSize, centerText, showLabels, showLegend, legendPosition (right/bottom).
- Lines: variant (line/area), curve (linear/smooth/step), lineColor, lineWidth, showPoints, pointSize, fillOpacity.
- Horizontal bars retain category/value data semantics and swap visual axis title positions. Smooth SVG paths use monotone interpolation; stepped paths hold previous values. Area fills close to zero.
- Doughnut masking lives on a separate ring layer so center text and slice labels remain unmasked. Pie labels account for the conic-gradient start angle and visible, clamped slice extents.
- Preserve existing CSS hooks. Additional hooks: swy-bar-horizontal, swy-doughnut-chart, swy-doughnut-ring, swy-doughnut-center, swy-legend-bottom, swy-area-chart, swy-area-fill, swy-no-animation.
- Keep summaries even when values, labels, legends, or markers are hidden; preserve normalized settings on resize/reinitialize. Honor reduced motion and animate: false.
- Regression coverage: tests/variations.test.js. Follow the user's permission requirement before running unit tests.
