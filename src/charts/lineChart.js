/**
 * Line Chart Implementation for SWY
 * Uses HTML/CSS for rendering with minimal SVG for line paths
 */

import DOM from '../utils/dom.js';
import Validator from '../utils/validator.js';
import logger from '../utils/logger.js';
import linePath from '../utils/lineGeometry.js';
import { normalizeOptions, paletteColor, applyAnimation } from '../utils/options.js';

// Maximum x-axis labels rendered before thinning kicks in
const MAX_X_LABELS = 12;

class LineChart {
  constructor(element, config) {
    this.element = element;
    this.config = config ? { ...config, ...normalizeOptions('line-chart', config) } : config;
    this.container = null;
  }

  /**
   * Render the line chart
   */
  render() {
    // Validate configuration
    if (!Validator.validateLineChart(this.config)) {
      logger.error('Invalid line chart configuration');
      this.renderError();
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
      applyAnimation(this.container, this.config);
      if (this.config.variant === 'area') this.container.classList.add('swy-area-chart');

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
      LineChart.drawLineAndPoints(dataArea, data, scale, this.config);

      DOM.append(chartArea, dataArea);
      DOM.append(this.container, chartArea);

      // Create axis labels
      const axisLabels = this.createAxisLabels();
      DOM.append(this.container, axisLabels);

      // Accessible summary (visually hidden)
      const summary = DOM.createAccessibleSummary(
        `${this.config.variant === 'area' ? 'Area' : 'Line'} chart${this.config.curve === 'linear' ? '' : ` (${this.config.curve})`}: ${this.config.yAxis || 'Y-Axis'} by ${this.config.xAxis || 'X-Axis'}`,
        data.map((point) => `${point.xLabel || ''}: ${DOM.formatNumber(point.yValue)}`),
      );
      DOM.append(this.container, summary);

      // Append to element
      DOM.append(this.element, this.container);

      logger.debug('Line chart rendered successfully');
      return true;
    } catch (error) {
      logger.error('Failed to render line chart', error);
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

    // X-axis labels, thinned when there are too many to display legibly
    const xAxisLabels = DOM.create('div', {}, 'swy-x-axis-labels');
    const labelStep = data.length > MAX_X_LABELS ? Math.ceil(data.length / MAX_X_LABELS) : 1;
    data.forEach((point, index) => {
      const labelText = point.xLabel || `X${index}`;
      const label = DOM.create(
        'div',
        {
          textContent: index % labelStep === 0 || index === data.length - 1 ? labelText : '',
          title: labelText,
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
  static drawLineAndPoints(container, data, scale, options = {}) {
    const config = normalizeOptions('line-chart', options);
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

    const coordinates = points.map((point) => ({ x: point.x, y: 100 - point.y }));
    // Give a singleton a short reference segment, including when points are hidden.
    if (coordinates.length === 1) {
      coordinates.push({ x: Math.min(coordinates[0].x + 10, 100), y: coordinates[0].y });
    }
    const pathData = linePath(coordinates, config.curve);
    if (config.variant === 'area') {
      const fill = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const last = coordinates[coordinates.length - 1];
      fill.setAttribute('d', `${pathData} L ${last.x} 100 L ${coordinates[0].x} 100 Z`);
      fill.setAttribute('class', 'swy-area-fill swy-line-animate');
      fill.style.fill = config.lineColor;
      fill.style.fillOpacity = config.fillOpacity;
      svg.appendChild(fill);
    }

    // Keep the existing polyline hook for the default straight-line rendering.
    const tag = points.length === 1 ? 'line' : 'polyline';
    const stroke = document.createElementNS('http://www.w3.org/2000/svg', config.curve === 'linear' ? tag : 'path');
    if (config.curve !== 'linear') {
      stroke.setAttribute('d', pathData);
    } else if (points.length === 1) {
      stroke.setAttribute('x1', coordinates[0].x);
      stroke.setAttribute('y1', coordinates[0].y);
      stroke.setAttribute('x2', coordinates[1].x);
      stroke.setAttribute('y2', coordinates[1].y);
    } else {
      stroke.setAttribute('points', coordinates.map((point) => `${point.x},${point.y}`).join(' '));
    }
    stroke.setAttribute('fill', 'none');
    stroke.setAttribute('vector-effect', 'non-scaling-stroke');
    stroke.setAttribute('class', 'swy-line-path swy-line-animate');
    if (config.lineColor !== '#2a22a2') stroke.style.stroke = config.lineColor;
    if (config.lineWidth !== 3) stroke.style.strokeWidth = `${config.lineWidth}px`;
    svg.appendChild(stroke);

    container.appendChild(svg);

    // Draw data points
    if (!config.showPoints) return;
    points.forEach((point) => {
      const color = Validator.resolveColor(
        point.data.color,
        paletteColor(config, point.index),
        `line chart data[${point.index}] "${point.data.xLabel || ''}"`,
      );

      const pointEl = DOM.create('div', {}, 'swy-line-point');
      if (config.pointSize !== 10) {
        pointEl.style.width = `${config.pointSize}px`;
        pointEl.style.height = `${config.pointSize}px`;
      }
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
    return paletteColor({}, index);
  }
}

export default LineChart;
