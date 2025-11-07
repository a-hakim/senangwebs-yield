/**
 * Line Chart Implementation for SWY
 * Uses HTML/CSS for rendering with minimal SVG for line paths
 */

import DOM from '../utils/dom.js';
import Validator from '../utils/validator.js';
import logger from '../utils/logger.js';

class LineChart {
  constructor(element, config) {
    this.element = element;
    this.config = config;
    this.container = null;
  }

  /**
   * Render the line chart
   */
  render() {
    // Validate configuration
    if (!Validator.validateLineChart(this.config)) {
      logger.error('Invalid line chart configuration');
      return false;
    }

    const { data } = this.config;
    if (data.length === 0) {
      logger.warn('No data provided for line chart');
      return false;
    }

    try {
      // Clear container
      DOM.clear(this.element);

      // Create main chart container
      this.container = DOM.create('div', {}, 'swy-chart-container');
      DOM.addClass(this.container, 'swy-line-chart');

      // Create chart area
      const chartArea = DOM.create('div', {}, 'swy-line-chart-area');

      // Calculate scale
      const values = data.map((d) => d.yValue);
      const scale = LineChart.calculateScale(values);

      // Create grid
      const grid = LineChart.createGrid(data.length);
      DOM.append(chartArea, grid);

      // Create axes
      const axes = LineChart.createAxes(data, scale);
      DOM.append(chartArea, axes);

      // Create data visualization area
      const dataArea = DOM.create('div', {}, 'swy-line-data-area');

      // Draw lines and points
      LineChart.drawLineAndPoints(dataArea, data, scale);

      DOM.append(chartArea, dataArea);
      DOM.append(this.container, chartArea);

      // Create axis labels
      const axisLabels = this.createAxisLabels();
      DOM.append(this.container, axisLabels);

      // Append to element
      DOM.append(this.element, this.container);

      logger.debug('Line chart rendered successfully');
      return true;
    } catch (error) {
      logger.error('Failed to render line chart', error);
      return false;
    }
  }

  /**
   * Create grid lines
   * @private
   */
  static createGrid(dataPointCount) {
    const gridContainer = DOM.create('div', {}, 'swy-line-grid');

    // Horizontal grid lines (5 lines)
    for (let i = 0; i <= 5; i += 1) {
      const line = DOM.create('div', {}, 'swy-grid-line-horizontal');
      line.style.bottom = `${(i / 5) * 100}%`;
      DOM.append(gridContainer, line);
    }

    // Vertical grid lines
    for (let i = 0; i < dataPointCount; i += 1) {
      const line = DOM.create('div', {}, 'swy-grid-line-vertical');
      line.style.left = `${(i / (dataPointCount - 1 || 1)) * 100}%`;
      DOM.append(gridContainer, line);
    }

    return gridContainer;
  }

  /**
   * Create axes with labels
   * @private
   */
  static createAxes(data, scale) {
    const axesContainer = DOM.create('div', {}, 'swy-line-axes');

    // Y-axis labels
    const yAxisLabels = DOM.create('div', {}, 'swy-y-axis-labels');
    const step = scale / 5;
    for (let i = 0; i <= 5; i += 1) {
      const value = i * step;
      const label = DOM.create(
        'div',
        {
          textContent: DOM.formatNumber(value),
        },
        'swy-y-axis-label',
      );
      label.style.bottom = `${(i / 5) * 100}%`;
      DOM.append(yAxisLabels, label);
    }
    DOM.append(axesContainer, yAxisLabels);

    // X-axis labels
    const xAxisLabels = DOM.create('div', {}, 'swy-x-axis-labels');
    data.forEach((point, index) => {
      const label = DOM.create(
        'div',
        {
          textContent: point.xLabel || `X${index}`,
        },
        'swy-x-axis-label',
      );
      label.style.left = `${(index / (data.length - 1 || 1)) * 100}%`;
      DOM.append(xAxisLabels, label);
    });
    DOM.append(axesContainer, xAxisLabels);

    return axesContainer;
  }

  /**
   * Draw line and data points
   * @private
   */
  static drawLineAndPoints(container, data, scale) {
    // Calculate point positions
    const points = data.map((point, index) => {
      const xPercent = (index / (data.length - 1 || 1)) * 100;
      const yPercent = (point.yValue / scale) * 100;
      return {
        x: xPercent,
        y: yPercent,
        data: point,
        index,
      };
    });

    // Create SVG for line path (minimal SVG usage for proper line rendering)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'swy-line-svg-overlay');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('viewBox', '0 0 100 100');

    // Create polyline path
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    const pointsStr = points.map((p) => `${p.x},${100 - p.y}`).join(' ');
    polyline.setAttribute('points', pointsStr);
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', '#2a22a2');
    polyline.setAttribute('stroke-width', '0.5');
    polyline.setAttribute('stroke-linecap', 'round');
    polyline.setAttribute('stroke-linejoin', 'round');
    polyline.setAttribute('vector-effect', 'non-scaling-stroke');
    polyline.classList.add('swy-line-path');
    polyline.classList.add('swy-line-animate');

    svg.appendChild(polyline);
    container.appendChild(svg);

    // Draw data points
    points.forEach((point) => {
      const color = point.data.color || LineChart.getDefaultPointColor(point.index);

      const pointEl = DOM.create('div', {}, 'swy-line-point');
      pointEl.style.left = `${point.x}%`;
      pointEl.style.bottom = `${point.y}%`;
      pointEl.style.backgroundColor = color;

      // Add tooltip
      const tooltip = DOM.create(
        'div',
        {
          textContent: `${point.data.xLabel || `X${point.index}`}: ${DOM.formatNumber(point.data.yValue)}`,
        },
        'swy-line-tooltip',
      );
      DOM.append(pointEl, tooltip);

      DOM.append(container, pointEl);
    });
  }

  /**
   * Create axis labels (X-Axis, Y-Axis titles)
   * @private
   */
  createAxisLabels() {
    const labelsContainer = DOM.create('div', {}, 'swy-line-axis-titles');

    const xAxisTitle = DOM.create(
      'div',
      {
        textContent: this.config.xAxis || 'X-Axis',
      },
      'swy-x-axis-title',
    );
    DOM.append(labelsContainer, xAxisTitle);

    const yAxisTitle = DOM.create(
      'div',
      {
        textContent: this.config.yAxis || 'Y-Axis',
      },
      'swy-y-axis-title',
    );
    DOM.append(labelsContainer, yAxisTitle);

    return labelsContainer;
  }

  /**
   * Calculate scale for chart heights
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
   * Get default color for point
   * @private
   */
  static getDefaultPointColor(index) {
    const colors = ['#ff6600', '#2a22a2', '#33cc33', '#ddd222', '#ff5733', '#c70039', '#900c3f', '#FF69B4'];
    return colors[index % colors.length];
  }
}

export default LineChart;
