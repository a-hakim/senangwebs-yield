/**
 * Validator Utility for SWY
 * Validates chart configuration and data
 */

import logger from './logger.js';

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
      if (typeof point.yValue !== 'number') {
        logger.error(`Bar chart data[${i}]: yValue must be a number`);
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

    if (!config.total || config.total <= 0) {
      logger.error('Pie chart requires a positive total value');
      return false;
    }

    // Validate each data point
    for (let i = 0; i < config.data.length; i += 1) {
      const point = config.data[i];
      if (!point.label) {
        logger.error(`Pie chart data[${i}]: label is required`);
        return false;
      }
      if (typeof point.value !== 'number' || point.value < 0) {
        logger.error(`Pie chart data[${i}]: value must be a non-negative number`);
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
      if (typeof point.yValue !== 'number') {
        logger.error(`Line chart data[${i}]: yValue must be a number`);
        return false;
      }
    }

    return true;
  },

  /**
   * Validate color format (hex or named color)
   * @param {string} color - Color string
   * @returns {boolean}
   */
  isValidColor(color) {
    if (!color) return true; // Color is optional

    // Check for hex color
    const hexRegex = /^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/;
    if (hexRegex.test(color)) {
      return true;
    }

    // Check for named color (basic check)
    const namedColors = ['red', 'green', 'blue', 'black', 'white', 'yellow', 'orange', 'purple', 'pink'];
    if (namedColors.includes(color.toLowerCase())) {
      return true;
    }

    // Check for rgb/rgba
    if (color.startsWith('rgb')) {
      return true;
    }

    return false;
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
