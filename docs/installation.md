# Installation Guide

## Overview

SenangWebs Yield (SWY) is available through multiple installation methods. Choose the one that best fits your project setup.

## NPM Installation

The recommended way to install SWY for modern projects:

```bash
npm install senangwebs-yield
```

### Using in ES6 Modules

```javascript
import SWY from 'senangwebs-yield';

// Now use SWY
SWY.initBarChart({ ... });
```

### Using in CommonJS

```javascript
const SWY = require('senangwebs-yield');

// Now use SWY
SWY.initBarChart({ ... });
```

## CDN Installation

Use a CDN to include SWY without any build tools:

### jsDelivr

```html
<script src="https://cdn.jsdelivr.net/npm/senangwebs-yield@1.0.0/dist/swy.min.js"></script>
```

### CDN with Specific Version

```html
<!-- Version 1.0.0 -->
<script src="https://cdn.jsdelivr.net/npm/senangwebs-yield@1.0.0/dist/swy.min.js"></script>

<!-- Latest version -->
<script src="https://cdn.jsdelivr.net/npm/senangwebs-yield/dist/swy.min.js"></script>
```

## Manual Download

1. Download `swy.min.js` from the [releases page](https://github.com/senangwebs/senangwebs-yield/releases)
2. Place it in your project directory
3. Include it in your HTML:

```html
<script src="path/to/swy.min.js"></script>
```

## Framework Integration

### React

```jsx
import React, { useEffect } from 'react';
import SWY from 'senangwebs-yield';

function BarChartComponent() {
  useEffect(() => {
    SWY.initBarChart({
      container: '#bar-chart',
      xAxis: 'Categories',
      yAxis: 'Values',
      data: [
        { xLabel: 'A', yValue: 100 },
        { xLabel: 'B', yValue: 200 },
      ],
    });
  }, []);

  return <div id="bar-chart" style={{ width: '100%', height: '300px' }} />;
}

export default BarChartComponent;
```

### Vue 3

```vue
<template>
  <div id="bar-chart"></div>
</template>

<script>
import { onMounted } from 'vue';
import SWY from 'senangwebs-yield';

export default {
  setup() {
    onMounted(() => {
      SWY.initBarChart({
        container: '#bar-chart',
        xAxis: 'Categories',
        yAxis: 'Values',
        data: [
          { xLabel: 'A', yValue: 100 },
          { xLabel: 'B', yValue: 200 },
        ],
      });
    });
  },
};
</script>
```

### Angular

```typescript
import { Component, OnInit } from '@angular/core';
import SWY from 'senangwebs-yield';

@Component({
  selector: 'app-bar-chart',
  template: '<div id="bar-chart"></div>',
})
export class BarChartComponent implements OnInit {
  ngOnInit() {
    SWY.initBarChart({
      container: '#bar-chart',
      xAxis: 'Categories',
      yAxis: 'Values',
      data: [
        { xLabel: 'A', yValue: 100 },
        { xLabel: 'B', yValue: 200 },
      ],
    });
  }
}
```

## Troubleshooting

### SWY is not defined

**Problem:** Getting "SWY is not defined" error

**Solution:** Make sure the script is loaded before using SWY:

```html
<script src="path/to/swy.min.js"></script>
<script>
  // SWY is available here
  SWY.initBarChart({ ... });
</script>
```

### Charts not rendering

**Problem:** Charts not appearing on the page

**Solutions:**

1. Ensure the container element exists
2. Check browser console for errors
3. Verify data format matches API specification
4. Enable debug mode: `SWY.setDebugMode(true)`

### Module not found (NPM)

**Problem:** Getting module not found error

**Solution:** Make sure you've installed the package:

```bash
npm install senangwebs-yield
```

## Verify Installation

Create a simple test file to verify everything is working:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>SWY Test</title>
  </head>
  <body>
    <div id="test-chart" style="width: 400px; height: 300px;"></div>

    <script src="path/to/swy.min.js"></script>
    <script>
      SWY.initBarChart({
        container: '#test-chart',
        xAxis: 'Test',
        yAxis: 'Values',
        data: [
          { xLabel: 'A', yValue: 100 },
          { xLabel: 'B', yValue: 200 },
        ],
      });
    </script>
  </body>
</html>
```

If you see a bar chart with two bars, installation was successful!

## Next Steps

- Read the [Getting Started Guide](getting-started.md)
- Check the [HTML API Documentation](html-api.md)
- Review the [JavaScript API Reference](javascript-api.md)
- Explore [Examples](../examples/)
