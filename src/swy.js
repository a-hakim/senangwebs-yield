/**
 * SenangWebs Yield (SWY) - Main Library
 * A lightweight, dependency-free JavaScript library for creating simple data visualizations
 * Uses HTML and CSS for rendering charts (minimal SVG for line chart paths)
 */

import './styles/charts.css';
import DOM from './utils/dom.js';
import Parser from './utils/parser.js';
import Validator from './utils/validator.js';
import logger from './utils/logger.js';
import BarChart from './charts/barChart.js';
import PieChart from './charts/pieChart.js';
import LineChart from './charts/lineChart.js';

// Version
const VERSION = '1.0.0';

// Chart registry
const chartRegistry = new Map();
let chartIdCounter = 0;

/**
 * Initialize bar chart from JavaScript API
 * @param {Object} options - Chart configuration
 * @returns {boolean}
 */
function initBarChart(options) {
  if (!Validator.validateChartOptions(options)) {
    return false;
  }

  const container = DOM.select(options.container);
  if (!container) {
    logger.error(`Container not found: ${options.container}`);
    return false;
  }

  const config = {
    type: 'bar-chart',
    xAxis: options.xAxis || 'X-Axis',
    yAxis: options.yAxis || 'Y-Axis',
    data: options.data || [],
  };

  const barChart = new BarChart(container, config);
  const chartId = `bar-chart-${chartIdCounter}`;
  chartIdCounter += 1;

  if (barChart.render()) {
    chartRegistry.set(chartId, barChart);
    logger.debug(`Bar chart initialized: ${chartId}`);
    return true;
  }

  return false;
}

/**
 * Initialize pie chart from JavaScript API
 * @param {Object} options - Chart configuration
 * @returns {boolean}
 */
function initPieChart(options) {
  if (!Validator.validateChartOptions(options)) {
    return false;
  }

  const container = DOM.select(options.container);
  if (!container) {
    logger.error(`Container not found: ${options.container}`);
    return false;
  }

  // Calculate total if not provided
  let { total } = options;
  if (!total && options.data) {
    total = options.data.reduce((sum, point) => sum + (point.value || 0), 0);
  }

  const config = {
    type: 'pie-chart',
    total: total || 0,
    data: options.data || [],
  };

  const pieChart = new PieChart(container, config);
  const chartId = `pie-chart-${chartIdCounter}`;
  chartIdCounter += 1;

  if (pieChart.render()) {
    chartRegistry.set(chartId, pieChart);
    logger.debug(`Pie chart initialized: ${chartId}`);
    return true;
  }

  return false;
}

/**
 * Initialize line chart from JavaScript API
 * @param {Object} options - Chart configuration
 * @returns {boolean}
 */
function initLineChart(options) {
  if (!Validator.validateChartOptions(options)) {
    return false;
  }

  const container = DOM.select(options.container);
  if (!container) {
    logger.error(`Container not found: ${options.container}`);
    return false;
  }

  const config = {
    type: 'line-chart',
    xAxis: options.xAxis || 'X-Axis',
    yAxis: options.yAxis || 'Y-Axis',
    data: options.data || [],
  };

  const lineChart = new LineChart(container, config);
  const chartId = `line-chart-${chartIdCounter}`;
  chartIdCounter += 1;

  if (lineChart.render()) {
    chartRegistry.set(chartId, lineChart);
    logger.debug(`Line chart initialized: ${chartId}`);
    return true;
  }

  return false;
}

/**
 * Initialize all charts from HTML attributes (auto-initialization)
 */
function initializeFromHTML() {
  const charts = Parser.findAllCharts();

  charts.forEach((chartElement) => {
    const chartType = DOM.getAttribute(chartElement, 'data-swy-type');
    let config = null;

    switch (chartType) {
      case 'bar-chart':
        config = Parser.parseBarChart(chartElement);
        if (config) {
          const barChart = new BarChart(chartElement, config);
          const chartId = `bar-chart-${chartIdCounter}`;
          chartIdCounter += 1;
          if (barChart.render()) {
            chartRegistry.set(chartId, barChart);
            logger.debug(`Bar chart auto-initialized: ${chartId}`);
          }
        }
        break;

      case 'pie-chart':
        config = Parser.parsePieChart(chartElement);
        if (config) {
          const pieChart = new PieChart(chartElement, config);
          const chartId = `pie-chart-${chartIdCounter}`;
          chartIdCounter += 1;
          if (pieChart.render()) {
            chartRegistry.set(chartId, pieChart);
            logger.debug(`Pie chart auto-initialized: ${chartId}`);
          }
        }
        break;

      case 'line-chart':
        config = Parser.parseLineChart(chartElement);
        if (config) {
          const lineChart = new LineChart(chartElement, config);
          const chartId = `line-chart-${chartIdCounter}`;
          chartIdCounter += 1;
          if (lineChart.render()) {
            chartRegistry.set(chartId, lineChart);
            logger.debug(`Line chart auto-initialized: ${chartId}`);
          }
        }
        break;

      default:
        logger.error(`Unknown chart type: ${chartType}`);
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
  // Clear existing charts
  chartRegistry.clear();
  chartIdCounter = 0;

  // Reinitialize from HTML
  initializeFromHTML();
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
};

// Auto-initialize on DOM ready
DOM.onReady(() => {
  logger.debug('SWY library initialized');
  initializeFromHTML();
});

// Handle window resize for responsive charts
window.addEventListener('resize', () => {
  logger.debug('Window resized, reinitializing charts');
  reinitialize();
});

// Export as ES module
export default SWY;
