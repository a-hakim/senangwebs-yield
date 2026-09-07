/**
 * Parser Utility for SWY
 * Extracts and normalizes chart configuration from HTML attributes
 */

import logger from './logger.js';
import DOM from './dom.js';
import { parseOptions } from './options.js';

const Parser = {
  /**
   * Parse a numeric data-swy attribute. Returns null when the attribute is
   * missing or not a finite number, and logs a warning naming the culprit.
   * @param {Element} element - Element holding the attribute
   * @param {string} attributeName - Attribute name
   * @param {string} context - Description used in warnings (e.g. "bar chart data[3]")
   * @returns {number|null}
   * @private
   */
  parseNumericAttribute(element, attributeName, context) {
    const raw = DOM.getAttribute(element, attributeName);

    if (raw === null || raw.trim() === '') {
      logger.warn(`${context}: missing or empty "${attributeName}" attribute, item skipped`);
      return null;
    }

    const value = Number(raw);
    if (!Number.isFinite(value)) {
      logger.warn(`${context}: "${attributeName}" is not a valid number ("${raw}"), item skipped`);
      return null;
    }

    return value;
  },

  /**
   * Compare a computed total with a user-provided total, tolerating
   * floating-point drift
   * @param {number} calculated - Sum of slice values
   * @param {number} provided - User-provided total
   * @returns {boolean}
   * @private
   */
  totalsMatch(calculated, provided) {
    const tolerance = Number.EPSILON * Math.max(provided, 1);
    return Math.abs(calculated - provided) <= tolerance;
  },

  /**
   * Parse bar chart data from HTML
   * @param {Element} element - Chart container element
   * @returns {Object|null}
   */
  parseBarChart(element) {
    try {
      const config = {
        type: 'bar-chart',
        ...parseOptions(element, 'bar-chart'),
        xAxis: DOM.getAttribute(element, 'data-swy-x-axis') || 'X-Axis',
        yAxis: DOM.getAttribute(element, 'data-swy-y-axis') || 'Y-Axis',
        data: [],
      };

      const dataElements = DOM.selectAll('[data-swy-x-label]', element);
      dataElements.forEach((dataEl, index) => {
        const xLabel = DOM.getAttribute(dataEl, 'data-swy-x-label');
        const context = `Bar chart data[${index}] "${xLabel || ''}"`;
        const yValue = this.parseNumericAttribute(dataEl, 'data-swy-y-value', context);

        if (yValue === null) {
          return;
        }

        config.data.push({
          xLabel,
          yValue,
          color: DOM.getAttribute(dataEl, 'data-swy-color') || null,
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
        ...parseOptions(element, 'pie-chart'),
        total: null,
        data: [],
      };

      const rawTotal = DOM.getAttribute(element, 'data-swy-total');
      if (rawTotal !== null && rawTotal.trim() !== '') {
        const total = Number(rawTotal);
        if (!Number.isFinite(total) || total <= 0) {
          logger.warn(`Pie chart: "data-swy-total" is not a positive number ("${rawTotal}"), falling back to auto-calculated total`);
        } else {
          config.total = total;
        }
      }

      const dataElements = DOM.selectAll('[data-swy-label]', element);
      let calculatedTotal = 0;

      dataElements.forEach((dataEl, index) => {
        const label = DOM.getAttribute(dataEl, 'data-swy-label');
        const context = `Pie chart data[${index}] "${label || ''}"`;
        const value = this.parseNumericAttribute(dataEl, 'data-swy-value', context);

        if (value === null) {
          return;
        }

        config.data.push({
          label,
          value,
          color: DOM.getAttribute(dataEl, 'data-swy-color') || null,
        });

        calculatedTotal += value;
      });

      // Use calculated total if total attribute not provided
      if (config.total === null) {
        config.total = calculatedTotal;
      } else if (!Parser.totalsMatch(calculatedTotal, config.total)) {
        logger.warn(
          `Pie chart: sum of values (${calculatedTotal}) does not match provided total (${config.total}). Percentages are calculated against the provided total.`,
        );
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
        ...parseOptions(element, 'line-chart'),
        xAxis: DOM.getAttribute(element, 'data-swy-x-axis') || 'X-Axis',
        yAxis: DOM.getAttribute(element, 'data-swy-y-axis') || 'Y-Axis',
        data: [],
      };

      const dataElements = DOM.selectAll('[data-swy-x-label]', element);
      dataElements.forEach((dataEl, index) => {
        const xLabel = DOM.getAttribute(dataEl, 'data-swy-x-label');
        const context = `Line chart data[${index}] "${xLabel || ''}"`;
        const yValue = this.parseNumericAttribute(dataEl, 'data-swy-y-value', context);

        if (yValue === null) {
          return;
        }

        config.data.push({
          xLabel,
          yValue,
          color: DOM.getAttribute(dataEl, 'data-swy-color') || null,
        });
      });

      return config;
    } catch (error) {
      logger.error('Failed to parse line chart', error);
      return null;
    }
  },

  /**
   * Parse chart configuration from HTML element based on its data-swy-type
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
        logger.warn(`Unknown or missing chart type: ${chartType}`);
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
        DOM.selectAll('[data-swy-type]', container).forEach((chartEl) => {
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
