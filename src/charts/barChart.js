/**
 * Bar Chart Implementation for SWY
 * Uses HTML/CSS for rendering instead of Canvas
 */

import DOM from '../utils/dom.js';
import Validator from '../utils/validator.js';
import logger from '../utils/logger.js';
import { normalizeOptions, paletteColor, applyAnimation } from '../utils/options.js';

class BarChart {
  constructor(element, config) {
    this.element = element;
    this.config = config ? { ...config, ...normalizeOptions('bar-chart', config) } : config;
    this.container = null;
  }

  /**
   * Render the bar chart
   */
  render() {
    // Validate configuration
    if (!Validator.validateBarChart(this.config)) {
      logger.error('Invalid bar chart configuration');
      this.renderError();
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
      applyAnimation(this.container, this.config);
      const horizontal = this.config.orientation === 'horizontal';
      if (horizontal) this.container.classList.add('swy-bar-horizontal');
      if (this.config.barGap !== 20) {
        this.container.style.setProperty('--swy-bar-gap', `${this.config.barGap}px`);
      }
      this.container.style.setProperty('--swy-bar-radius', `${this.config.barRadius}px`);

      // Calculate max value for scaling
      const values = data.map((d) => d.yValue);
      const scale = BarChart.calculateScale(values);

      // Create wrapper for bars
      const wrapper = DOM.create('div', {}, 'swy-bar-chart-wrapper');

      // Create bars
      data.forEach((point, index) => {
        const percentage = (point.yValue / scale) * 100;
        const color = Validator.resolveColor(
          point.color,
          paletteColor(this.config, index),
          `bar chart data[${index}] "${point.xLabel || ''}"`,
        );
        const label = point.xLabel || `Item ${index + 1}`;

        const bar = DOM.createBar(percentage, color, label, point.yValue);
        const shape = bar.querySelector('.swy-bar');
        if (!this.config.showValues) bar.querySelector('.swy-bar-value').remove();
        if (horizontal) {
          const track = DOM.create('div', {}, 'swy-bar-track');
          shape.style.height = '';
          shape.style.width = `${percentage}%`;
          shape.style.setProperty('--swy-bar-width', `${percentage}%`);
          DOM.append(track, shape);
          DOM.append(bar, track);
        }
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

      DOM.append(axesSection, horizontal ? [yAxisLabel, xAxisLabel] : [xAxisLabel, yAxisLabel]);
      DOM.append(this.container, axesSection);

      // Accessible summary (visually hidden)
      const summary = DOM.createAccessibleSummary(
        `${horizontal ? 'Horizontal bar' : 'Bar'} chart: ${this.config.yAxis || 'Y-Axis'} by ${this.config.xAxis || 'X-Axis'}`,
        data.map((point) => `${point.xLabel || ''}: ${DOM.formatNumber(point.yValue)}`),
      );
      DOM.append(this.container, summary);

      // Append to element
      DOM.append(this.element, this.container);

      logger.debug('Bar chart rendered successfully');
      return true;
    } catch (error) {
      logger.error('Failed to render bar chart', error);
      this.renderError();
      return false;
    }
  }

  /**
   * Show a visible fallback message in place of the chart
   * @private
   */
  renderError() {
    if (!this.element || this.element.querySelector('.swy-render-error')) {
      return;
    }
    DOM.clear(this.element);
    DOM.append(this.element, DOM.createErrorMessage('SWY: chart could not be rendered. Check the console for details.'));
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
    return paletteColor({}, index);
  }
}

export default BarChart;
