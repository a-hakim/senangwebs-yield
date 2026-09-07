/**
 * SenangWebs Yield (SWY) - Main Library
 * A lightweight, dependency-free JavaScript library for creating simple data visualizations
 * Uses HTML and CSS for rendering charts (minimal SVG for line chart paths)
 */

import './styles/charts.css';
import DOM from './utils/dom.js';
import Parser from './utils/parser.js';
import logger from './utils/logger.js';
import { normalizeOptions } from './utils/options.js';
import BarChart from './charts/barChart.js';
import PieChart from './charts/pieChart.js';
import LineChart from './charts/lineChart.js';

// Version is injected from package.json at build time (webpack DefinePlugin)
const VERSION = typeof __SWY_VERSION__ !== 'undefined' ? __SWY_VERSION__ : null;
const RESIZE_DEBOUNCE_MS = 150;

// Chart registry
const chartRegistry = new Map();
let chartIdCounter = 0;

// Resize handling
const pendingResizeCharts = new Set();
const lastSizes = new Map();
let resizeTimer = null;
let resizeObserver = null;

const CHART_CONSTRUCTORS = {
  'bar-chart': BarChart,
  'pie-chart': PieChart,
  'line-chart': LineChart,
};

/**
 * Register a rendered chart, replacing any previous chart for the same element
 * @param {string} chartId - Unique chart identifier
 * @param {Object} chart - Rendered chart instance
 */
function registerChart(chartId, chart) {
  chartRegistry.forEach((registeredChart, registeredId) => {
    if (registeredChart.element === chart.element) {
      chartRegistry.delete(registeredId);
    }
  });

  chartRegistry.set(chartId, chart);
}

/**
 * Check whether an element already has a registered chart
 * @param {Element} element - Chart container element
 * @returns {boolean}
 */
function isChartRegistered(element) {
  return Array.from(chartRegistry.values()).some((chart) => chart.element === element);
}

/**
 * Find the registered chart for an element, if any
 * @param {Element} element - Chart container element
 * @returns {Object|undefined}
 */
function getRegisteredChart(element) {
  return Array.from(chartRegistry.values()).find((chart) => chart.element === element);
}

/**
 * Schedule a re-render for charts whose containers changed size
 * @private
 */
function scheduleChartRerender(chart) {
  pendingResizeCharts.add(chart);

  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    const charts = Array.from(pendingResizeCharts);
    pendingResizeCharts.clear();

    charts.forEach((pendingChart) => {
      if (!pendingChart.element.isConnected) {
        // Prune detached charts
        chartRegistry.forEach((registeredChart, chartId) => {
          if (registeredChart.element === pendingChart.element) {
            chartRegistry.delete(chartId);
          }
        });
        return;
      }

      if (!pendingChart.render()) {
        logger.warn('Failed to re-render chart after resize');
      }
    });
  }, RESIZE_DEBOUNCE_MS);
}

/**
 * Lazily create the shared ResizeObserver
 * @returns {ResizeObserver|null}
 * @private
 */
function getResizeObserver() {
  if (resizeObserver || typeof ResizeObserver === 'undefined') {
    return resizeObserver;
  }

  resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      const last = lastSizes.get(entry.target);
      if (last && last.w === width && last.h === height) {
        return; // Initial observation or no real change
      }
      lastSizes.set(entry.target, { w: width, h: height });

      const chart = getRegisteredChart(entry.target);
      if (chart) {
        scheduleChartRerender(chart);
      }
    });
  });

  return resizeObserver;
}

/**
 * Observe a rendered chart's element for container-driven size changes
 * @param {Object} chart - Rendered chart instance
 */
function observeChart(chart) {
  const observer = getResizeObserver();
  if (!observer) {
    return;
  }

  const rect = chart.element.getBoundingClientRect();
  lastSizes.set(chart.element, { w: rect.width, h: rect.height });
  observer.observe(chart.element);
}

/**
 * Initialize a chart for an element with a parsed config
 * @param {string} type - Chart type key ("bar-chart", "pie-chart", "line-chart")
 * @param {Element} element - Chart container element
 * @param {Object} config - Parsed chart configuration
 * @returns {boolean}
 */
function initChart(type, element, config) {
  const ChartConstructor = CHART_CONSTRUCTORS[type];
  if (!ChartConstructor) {
    logger.warn(`Unknown chart type: ${type}`);
    return false;
  }

  const chart = new ChartConstructor(element, config);
  const chartId = `${type}-${chartIdCounter}`;
  chartIdCounter += 1;

  if (chart.render()) {
    registerChart(chartId, chart);
    observeChart(chart);
    logger.debug(`Chart initialized: ${chartId}`);
    return true;
  }

  return false;
}

/**
 * Initialize bar chart from JavaScript API
 * @param {Object} options - Chart configuration
 * @returns {boolean}
 */
function initBarChart(options) {
  if (!options || typeof options !== 'object') {
    logger.error('Chart options are required');
    return false;
  }

  const container = DOM.select(options.container);
  if (!container) {
    logger.error(`Container not found: ${options.container}`);
    return false;
  }

  const config = {
    type: 'bar-chart',
    ...normalizeOptions('bar-chart', options),
    xAxis: options.xAxis || 'X-Axis',
    yAxis: options.yAxis || 'Y-Axis',
    data: options.data || [],
  };

  return initChart('bar-chart', container, config);
}

/**
 * Initialize pie chart from JavaScript API
 * @param {Object} options - Chart configuration
 * @returns {boolean}
 */
function initPieChart(options) {
  if (!options || typeof options !== 'object') {
    logger.error('Chart options are required');
    return false;
  }

  const container = DOM.select(options.container);
  if (!container) {
    logger.error(`Container not found: ${options.container}`);
    return false;
  }

  // Calculate total if not provided
  let { total } = options;
  if (!total && Array.isArray(options.data)) {
    total = options.data.reduce((sum, point) => sum + (point.value || 0), 0);
  }

  const config = {
    type: 'pie-chart',
    ...normalizeOptions('pie-chart', options),
    total: total || 0,
    data: options.data || [],
  };

  return initChart('pie-chart', container, config);
}

/**
 * Initialize line chart from JavaScript API
 * @param {Object} options - Chart configuration
 * @returns {boolean}
 */
function initLineChart(options) {
  if (!options || typeof options !== 'object') {
    logger.error('Chart options are required');
    return false;
  }

  const container = DOM.select(options.container);
  if (!container) {
    logger.error(`Container not found: ${options.container}`);
    return false;
  }

  const config = {
    type: 'line-chart',
    ...normalizeOptions('line-chart', options),
    xAxis: options.xAxis || 'X-Axis',
    yAxis: options.yAxis || 'Y-Axis',
    data: options.data || [],
  };

  return initChart('line-chart', container, config);
}

/**
 * Initialize all charts from HTML attributes (auto-initialization)
 */
function initializeFromHTML() {
  const charts = Parser.findAllCharts();

  charts.forEach((chartElement) => {
    if (isChartRegistered(chartElement)) {
      return;
    }

    const config = Parser.parseChartFromHTML(chartElement);
    if (config) {
      initChart(config.type, chartElement, config);
    }
  });
}

/**
 * Set debug mode
 * @param {boolean} enabled - Enable/disable debug logging
 */
function setDebugMode(enabled) {
  logger.setDebugMode(enabled);
}

/**
 * Get library version
 * @returns {string}
 */
function getVersion() {
  return VERSION;
}

/**
 * Reinitialize all charts (useful for responsive layouts)
 */
function reinitialize() {
  chartRegistry.forEach((chart, chartId) => {
    if (!chart.element.isConnected) {
      chartRegistry.delete(chartId);
      return;
    }

    if (!chart.render()) {
      logger.warn(`Failed to reinitialize chart: ${chartId}`);
    }
  });

  // Initialize declarative charts added after page load.
  initializeFromHTML();
}

/**
 * Set up responsive re-rendering. Uses ResizeObserver when available so that
 * container-driven size changes (sidebars, tabs, flex/grid reflow) are handled,
 * with a window resize listener as fallback.
 * @private
 */
function setupResizeHandling() {
  const observer = getResizeObserver();

  if (observer) {
    chartRegistry.forEach((chart) => observeChart(chart));
  } else {
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        logger.debug('Window resized, reinitializing charts');
        reinitialize();
      }, RESIZE_DEBOUNCE_MS);
    });
  }
}

/**
 * Tear down the library: clear the registry, disconnect observers and
 * remove all listeners. Useful for SPA unmounts and test cleanup.
 */
function destroy() {
  window.clearTimeout(resizeTimer);
  pendingResizeCharts.clear();
  lastSizes.clear();

  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }

  chartRegistry.clear();
  chartIdCounter = 0;
}

// Global SWY object
const SWY = {
  version: VERSION,
  initBarChart,
  initPieChart,
  initLineChart,
  setDebugMode,
  getVersion,
  reinitialize,
  destroy,
};

// Auto-initialize on DOM ready
DOM.onReady(() => {
  logger.debug('SWY library initialized');
  initializeFromHTML();
  setupResizeHandling();
});

// Export as ES module
export default SWY;
