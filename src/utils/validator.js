/**
 * Validator Utility for SWY
 * Validates chart configuration and data
 */

import logger from './logger.js';

// Safe CSS color patterns: hex (3/4/6/8 digits), rgb()/rgba()/hsl()/hsla() functional
// notation, or a plain CSS keyword/identifier. Anything else (url(), quotes,
// semicolons, parentheses imbalance, etc.) is rejected to prevent CSS injection.
const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const FUNCTIONAL_COLOR_REGEX = /^(?:rgba?|hsla?)\(\s*[-0-9.,%\s]+\)$/i;
const KEYWORD_COLOR_REGEX = /^[a-zA-Z]+$/;

const Validator = {
  /**
   * Validate bar chart configuration
   * @param {Object} config - Chart configuration object
   * @returns {boolean}
   */
  validateBarChart(config) {
    if (!config) {
      logger.error('Bar chart config is required');
      return false;
    }

    if (!Array.isArray(config.data) || config.data.length === 0) {
      logger.error('Bar chart requires data array with at least one element');
      return false;
    }

    // Validate each data point
    for (let i = 0; i < config.data.length; i += 1) {
      const point = config.data[i];
      if (!point.xLabel) {
        logger.error(`Bar chart data[${i}]: xLabel is required`);
        return false;
      }
      if (typeof point.yValue !== 'number' || !Number.isFinite(point.yValue)) {
        logger.error(`Bar chart data[${i}]: yValue must be a finite number`);
        return false;
      }
      if (point.yValue < 0) {
        logger.error(`Bar chart data[${i}]: yValue must be non-negative`);
        return false;
      }
    }

    return true;
  },

  /**
   * Validate pie chart configuration
   * @param {Object} config - Chart configuration object
   * @returns {boolean}
   */
  validatePieChart(config) {
    if (!config) {
      logger.error('Pie chart config is required');
      return false;
    }

    if (!Array.isArray(config.data) || config.data.length === 0) {
      logger.error('Pie chart requires data array with at least one element');
      return false;
    }

    if (!config.total || config.total <= 0 || !Number.isFinite(config.total)) {
      logger.error('Pie chart requires a positive, finite total value');
      return false;
    }

    // Validate each data point
    for (let i = 0; i < config.data.length; i += 1) {
      const point = config.data[i];
      if (!point.label) {
        logger.error(`Pie chart data[${i}]: label is required`);
        return false;
      }
      if (typeof point.value !== 'number' || !Number.isFinite(point.value) || point.value < 0) {
        logger.error(`Pie chart data[${i}]: value must be a non-negative finite number`);
        return false;
      }
    }

    return true;
  },

  /**
   * Validate line chart configuration
   * @param {Object} config - Chart configuration object
   * @returns {boolean}
   */
  validateLineChart(config) {
    if (!config) {
      logger.error('Line chart config is required');
      return false;
    }

    if (!Array.isArray(config.data) || config.data.length === 0) {
      logger.error('Line chart requires data array with at least one element');
      return false;
    }

    // Validate each data point
    for (let i = 0; i < config.data.length; i += 1) {
      const point = config.data[i];
      if (!point.xLabel) {
        logger.error(`Line chart data[${i}]: xLabel is required`);
        return false;
      }
      if (typeof point.yValue !== 'number' || !Number.isFinite(point.yValue)) {
        logger.error(`Line chart data[${i}]: yValue must be a finite number`);
        return false;
      }
      if (point.yValue < 0) {
        logger.error(`Line chart data[${i}]: yValue must be non-negative`);
        return false;
      }
    }

    return true;
  },

  /**
   * Validate color format (hex, rgb()/rgba(), hsl()/hsla() or keyword)
   * Rejects anything that could inject additional CSS (e.g. "red); background:url(...)")
   * @param {string} color - Color string
   * @returns {boolean}
   */
  isValidColor(color) {
    if (!color) return true; // Color is optional

    const value = String(color).trim();
    if (value === '') return true;

    if (HEX_COLOR_REGEX.test(value)) {
      return true;
    }

    if (FUNCTIONAL_COLOR_REGEX.test(value)) {
      return true;
    }

    // Plain keywords are safe: CSS ignores unknown identifiers
    if (KEYWORD_COLOR_REGEX.test(value)) {
      return true;
    }

    return false;
  },

  /**
   * Resolve a color to a safe value, falling back when invalid
   * @param {string} color - Requested color string
   * @param {string} fallback - Color to use when the requested color is invalid
   * @param {string} [context=''] - Optional context for the warning message
   * @returns {string}
   */
  resolveColor(color, fallback, context = '') {
    if (color && !Validator.isValidColor(color)) {
      logger.warn(`Invalid color ignored${context ? ` (${context})` : ''}: ${color}`);
      return fallback;
    }
    return color || fallback;
  },

  /**
   * Validate chart options for JavaScript API
   * @param {Object} options - Chart initialization options
   * @returns {boolean}
   */
  validateChartOptions(options) {
    if (!options) {
      logger.error('Chart options are required');
      return false;
    }

    if (!options.container) {
      logger.error('Chart options: container property is required');
      return false;
    }

    if (!options.data) {
      logger.error('Chart options: data property is required');
      return false;
    }

    return true;
  },
};

export default Validator;
