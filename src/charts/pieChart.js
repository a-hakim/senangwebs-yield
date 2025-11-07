/**
 * Pie Chart Implementation for SWY
 * Uses pure HTML and CSS for rendering (conic-gradient)
 */

import DOM from '../utils/dom.js';
import Validator from '../utils/validator.js';
import logger from '../utils/logger.js';

class PieChart {
  constructor(element, config) {
    this.element = element;
    this.config = config;
    this.container = null;
  }

  /**
   * Render the pie chart
   */
  render() {
    // Validate configuration
    if (!Validator.validatePieChart(this.config)) {
      logger.error('Invalid pie chart configuration');
      return false;
    }

    const { data, total } = this.config;
    if (data.length === 0 || total === 0) {
      logger.warn('No data or total is zero for pie chart');
      return false;
    }

    try {
      // Clear container
      DOM.clear(this.element);

      // Create main chart container
      this.container = DOM.create('div', {}, 'swy-chart-container');
      DOM.addClass(this.container, 'swy-pie-chart');

      // Create pie chart wrapper
      const pieWrapper = DOM.create('div', {}, 'swy-pie-wrapper');

      // Create the pie using conic-gradient
      const pieCircle = PieChart.createPieCircle(data, total);
      DOM.append(pieWrapper, pieCircle);

      DOM.append(this.container, pieWrapper);

      // Create legend
      const legend = DOM.create('div', {}, 'swy-pie-legend');

      data.forEach((point, index) => {
        const percentage = ((point.value / total) * 100).toFixed(1);
        const color = point.color || PieChart.getDefaultSliceColor(index);

        const legendItem = DOM.create('div', {}, 'swy-pie-legend-item');

        const colorBox = DOM.create('div', {}, 'swy-pie-legend-color');
        colorBox.style.backgroundColor = color;

        const labelDiv = DOM.create(
          'div',
          {
            textContent: point.label || `Slice ${index + 1}`,
          },
          'swy-pie-legend-label',
        );

        const valueDiv = DOM.create(
          'div',
          {
            textContent: `${percentage}%`,
          },
          'swy-pie-legend-value',
        );

        const labelWrapper = DOM.create('div', {}, 'swy-pie-legend-text');
        DOM.append(labelWrapper, [labelDiv, valueDiv]);

        DOM.append(legendItem, [colorBox, labelWrapper]);
        DOM.append(legend, legendItem);
      });

      DOM.append(this.container, legend);

      // Append to element
      DOM.append(this.element, this.container);

      logger.debug('Pie chart rendered successfully');
      return true;
    } catch (error) {
      logger.error('Failed to render pie chart', error);
      return false;
    }
  }

  /**
   * Create pie circle using conic-gradient
   * @private
   */
  static createPieCircle(data, total) {
    const pieCircle = DOM.create('div', {}, 'swy-pie-circle');

    // Build conic-gradient string
    const gradientStops = [];
    let currentPercent = 0;

    data.forEach((point, index) => {
      const percentage = (point.value / total) * 100;
      const color = point.color || PieChart.getDefaultSliceColor(index);

      gradientStops.push(`${color} ${currentPercent}%`);
      currentPercent += percentage;
      gradientStops.push(`${color} ${currentPercent}%`);
    });

    const gradientString = `conic-gradient(from -90deg, ${gradientStops.join(', ')})`;
    pieCircle.style.background = gradientString;

    // Add percentage labels on slices
    currentPercent = 0;
    data.forEach((point) => {
      const percentage = (point.value / total) * 100;
      const midPercent = currentPercent + percentage / 2;
      const angle = (midPercent / 100) * 360 - 90; // Start from top

      if (percentage > 5) {
        // Only show label if slice is big enough
        const label = DOM.create(
          'div',
          {
            textContent: `${percentage.toFixed(1)}%`,
          },
          'swy-pie-label',
        );

        // Position label at 60% radius
        const radius = 60; // percentage
        const angleRad = (angle * Math.PI) / 180;
        const x = 50 + radius * Math.cos(angleRad);
        const y = 50 + radius * Math.sin(angleRad);

        label.style.left = `${x}%`;
        label.style.top = `${y}%`;

        DOM.append(pieCircle, label);
      }

      currentPercent += percentage;
    });

    return pieCircle;
  }

  /**
   * Get default color for pie slice
   * @private
   */
  static getDefaultSliceColor(index) {
    const colors = ['#ff6600', '#2a22a2', '#33cc33', '#ddd222', '#ff5733', '#c70039', '#900c3f', '#FF69B4'];
    return colors[index % colors.length];
  }
}

export default PieChart;
