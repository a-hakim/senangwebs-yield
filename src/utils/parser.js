/**
 * Parser Utility for SWY
 * Extracts and normalizes chart configuration from HTML attributes
 */

import logger from './logger.js';
import DOM from './dom.js';

const Parser = {
  /**
   * Parse bar chart data from HTML
   * @param {Element} element - Chart container element
   * @returns {Object|null}
   */
  parseBarChart(element) {
    try {
      const config = {
        type: 'bar-chart',
        xAxis: DOM.getAttribute(element, 'data-swy-x-axis') || 'X-Axis',
        yAxis: DOM.getAttribute(element, 'data-swy-y-axis') || 'Y-Axis',
        data: [],
      };

      const dataElements = DOM.selectAll('[data-swy-x-label]', element);
      dataElements.forEach((dataEl) => {
        const xLabel = DOM.getAttribute(dataEl, 'data-swy-x-label');
        const yValue = parseFloat(DOM.getAttribute(dataEl, 'data-swy-y-value')) || 0;
        const color = DOM.getAttribute(dataEl, 'data-swy-color') || null;

        config.data.push({
          xLabel,
          yValue,
          color,
        });
      });

      return config;
    } catch (error) {
      logger.error('Failed to parse bar chart', error);
      return null;
    }
  },

  /**
   * Parse pie chart data from HTML
   * @param {Element} element - Chart container element
   * @returns {Object|null}
   */
  parsePieChart(element) {
    try {
      const config = {
        type: 'pie-chart',
        total: parseFloat(DOM.getAttribute(element, 'data-swy-total')) || null,
        data: [],
      };

      const dataElements = DOM.selectAll('[data-swy-label]', element);
      let calculatedTotal = 0;

      dataElements.forEach((dataEl) => {
        const label = DOM.getAttribute(dataEl, 'data-swy-label');
        const value = parseFloat(DOM.getAttribute(dataEl, 'data-swy-value')) || 0;
        const color = DOM.getAttribute(dataEl, 'data-swy-color') || null;

        config.data.push({
          label,
          value,
          color,
        });

        calculatedTotal += value;
      });

      // Use calculated total if total attribute not provided
      if (!config.total) {
        config.total = calculatedTotal;
      }

      return config;
    } catch (error) {
      logger.error('Failed to parse pie chart', error);
      return null;
    }
  },

  /**
   * Parse line chart data from HTML
   * @param {Element} element - Chart container element
   * @returns {Object|null}
   */
  parseLineChart(element) {
    try {
      const config = {
        type: 'line-chart',
        xAxis: DOM.getAttribute(element, 'data-swy-x-axis') || 'X-Axis',
        yAxis: DOM.getAttribute(element, 'data-swy-y-axis') || 'Y-Axis',
        data: [],
      };

      const dataElements = DOM.selectAll('[data-swy-x-label]', element);
      dataElements.forEach((dataEl) => {
        const xLabel = DOM.getAttribute(dataEl, 'data-swy-x-label');
        const yValue = parseFloat(DOM.getAttribute(dataEl, 'data-swy-y-value')) || 0;
        const color = DOM.getAttribute(dataEl, 'data-swy-color') || null;

        config.data.push({
          xLabel,
          yValue,
          color,
        });
      });

      return config;
    } catch (error) {
      logger.error('Failed to parse line chart', error);
      return null;
    }
  },

  /**
   * Parse chart configuration from HTML element
   * @param {Element} element - Chart container element
   * @returns {Object|null}
   */
  parseChartFromHTML(element) {
    if (!element) {
      logger.error('Invalid element provided to parser');
      return null;
    }

    const chartType = DOM.getAttribute(element, 'data-swy-type');

    switch (chartType) {
      case 'bar-chart':
        return this.parseBarChart(element);
      case 'pie-chart':
        return this.parsePieChart(element);
      case 'line-chart':
        return this.parseLineChart(element);
      default:
        logger.error(`Unknown chart type: ${chartType}`);
        return null;
    }
  },

  /**
   * Find all chart elements in the DOM
   * @returns {Element[]}
   */
  findAllCharts() {
    try {
      const swyContainers = DOM.selectAll('[data-swy]');
      const charts = [];

      swyContainers.forEach((container) => {
        const chartElements = DOM.selectAll('[data-swy-type]', container);
        chartElements.forEach((chartEl) => {
          charts.push(chartEl);
        });
      });

      return charts;
    } catch (error) {
      logger.error('Failed to find all charts', error);
      return [];
    }
  },
};

export default Parser;
