/**
 * Bar Chart Implementation for SWY
 * Uses HTML/CSS for rendering instead of Canvas
 */

import DOM from '../utils/dom.js';
import Validator from '../utils/validator.js';
import logger from '../utils/logger.js';

class BarChart {
  constructor(element, config) {
    this.element = element;
    this.config = config;
    this.container = null;
  }

  /**
   * Render the bar chart
   */
  render() {
    // Validate configuration
    if (!Validator.validateBarChart(this.config)) {
      logger.error('Invalid bar chart configuration');
      return false;
    }

    const { data } = this.config;
    if (data.length === 0) {
      logger.warn('No data provided for bar chart');
      return false;
    }

    try {
      // Clear container
      DOM.clear(this.element);

      // Create main chart container
      this.container = DOM.create('div', {}, 'swy-chart-container');
      DOM.addClass(this.container, 'swy-bar-chart');

      // Calculate max value for scaling
      const values = data.map((d) => d.yValue);
      const scale = BarChart.calculateScale(values);

      // Create wrapper for bars
      const wrapper = DOM.create('div', {}, 'swy-bar-chart-wrapper');

      // Create bars
      data.forEach((point, index) => {
        const percentage = (point.yValue / scale) * 100;
        const color = point.color || BarChart.getDefaultBarColor(index);
        const label = point.xLabel || `Item ${index + 1}`;

        const bar = DOM.createBar(percentage, color, label, point.yValue);
        DOM.append(wrapper, bar);
      });

      DOM.append(this.container, wrapper);

      // Create axis labels section
      const axesSection = DOM.create('div', {}, 'swy-bar-chart-axes');

      const xAxisLabel = DOM.create(
        'div',
        {
          textContent: this.config.xAxis || 'X-Axis',
        },
        'swy-bar-chart-axis-label',
      );

      const yAxisLabel = DOM.create(
        'div',
        {
          textContent: this.config.yAxis || 'Y-Axis',
        },
        'swy-bar-chart-axis-label',
      );

      DOM.append(axesSection, [xAxisLabel, yAxisLabel]);
      DOM.append(this.container, axesSection);

      // Append to element
      DOM.append(this.element, this.container);

      logger.debug('Bar chart rendered successfully');
      return true;
    } catch (error) {
      logger.error('Failed to render bar chart', error);
      return false;
    }
  }

  /**
   * Calculate scale for bar heights
   * @private
   */
  static calculateScale(values) {
    const maxValue = Math.max(...values, 0) || 1;

    // Round up to nearest nice number
    const magnitude = 10 ** Math.floor(Math.log10(maxValue));
    const scaled = Math.ceil(maxValue / magnitude) * magnitude;

    return scaled;
  }

  /**
   * Get default color for bar
   * @private
   */
  static getDefaultBarColor(index) {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140'];
    return colors[index % colors.length];
  }
}

export default BarChart;
