/**
 * Pie Chart Implementation for SWY
 * Uses pure HTML and CSS for rendering (conic-gradient)
 */

import DOM from '../utils/dom.js';
import Validator from '../utils/validator.js';
import logger from '../utils/logger.js';
import { normalizeOptions, paletteColor, applyAnimation } from '../utils/options.js';

class PieChart {
  constructor(element, config) {
    this.element = element;
    this.config = config ? { ...config, ...normalizeOptions('pie-chart', config) } : config;
    this.container = null;
  }

  /**
   * Render the pie chart
   */
  render() {
    // Validate configuration
    if (!Validator.validatePieChart(this.config)) {
      logger.error('Invalid pie chart configuration');
      this.renderError();
      return false;
    }

    const { data, total } = this.config;
    if (data.length === 0 || total <= 0) {
      logger.warn('No data or total is zero for pie chart');
      return false;
    }

    try {
      // Clear container
      DOM.clear(this.element);

      // Create main chart container
      this.container = DOM.create('div', {}, 'swy-chart-container');
      DOM.addClass(this.container, 'swy-pie-chart');
      applyAnimation(this.container, this.config);
      if (this.config.variant === 'doughnut') this.container.classList.add('swy-doughnut-chart');
      if (this.config.legendPosition === 'bottom') this.container.classList.add('swy-legend-bottom');

      // Create pie chart wrapper
      const pieWrapper = DOM.create('div', {}, 'swy-pie-wrapper');

      // Create the pie using conic-gradient
      const pieCircle = PieChart.createPieCircle(data, total, this.config);
      DOM.append(pieWrapper, pieCircle);

      DOM.append(this.container, pieWrapper);

      // Create legend
      const legend = DOM.create('div', {}, 'swy-pie-legend');

      data.forEach((point, index) => {
        const percentage = Math.min((point.value / total) * 100, 100);
        const color = Validator.resolveColor(
          point.color,
          paletteColor(this.config, index),
          `pie chart data[${index}] "${point.label || ''}"`,
        );

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
            textContent: `${percentage.toFixed(1)}%`,
          },
          'swy-pie-legend-value',
        );

        const labelWrapper = DOM.create('div', {}, 'swy-pie-legend-text');
        DOM.append(labelWrapper, [labelDiv, valueDiv]);

        DOM.append(legendItem, [colorBox, labelWrapper]);
        DOM.append(legend, legendItem);
      });

      if (this.config.showLegend) DOM.append(this.container, legend);

      // Accessible summary (visually hidden)
      const summary = DOM.createAccessibleSummary(
        `${this.config.variant === 'doughnut' ? 'Doughnut' : 'Pie'} chart with total ${DOM.formatNumber(total)}${this.config.variant === 'doughnut' && this.config.centerText ? `: ${this.config.centerText}` : ''}`,
        data.map((point) => {
          const pct = Math.min((point.value / total) * 100, 100);
          return `${point.label || ''}: ${DOM.formatNumber(point.value)} (${pct.toFixed(1)}%)`;
        }),
      );
      DOM.append(this.container, summary);

      // Append to element
      DOM.append(this.element, this.container);
      PieChart.fitLabels(pieCircle, this.config);

      logger.debug('Pie chart rendered successfully');
      return true;
    } catch (error) {
      logger.error('Failed to render pie chart', error);
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
   * Create pie circle using conic-gradient
   * @private
   */
  static createPieCircle(data, total, options = {}) {
    const config = normalizeOptions('pie-chart', options);
    const pieCircle = DOM.create('div', {}, 'swy-pie-circle');

    // Build conic-gradient string, clamping cumulative stops to 100% so that
    // overflowing slices (sum > total) collapse instead of producing invalid stops
    const gradientStops = [];
    let currentPercent = 0;

    data.forEach((point, index) => {
      const percentage = (point.value / total) * 100;
      const color = Validator.resolveColor(
        point.color,
        paletteColor(config, index),
        `pie chart data[${index}] "${point.label || ''}"`,
      );

      const start = Math.min(currentPercent, 100);
      currentPercent += percentage;
      const end = Math.min(currentPercent, 100);

      if (end <= start) {
        return; // Slice fully consumed by earlier overflow
      }

      gradientStops.push(`${color} ${start}%`);
      gradientStops.push(`${color} ${end}%`);
    });

    if (currentPercent < 100) gradientStops.push(`transparent ${currentPercent}%`, 'transparent 100%');
    const gradientString = `conic-gradient(from -90deg, ${gradientStops.join(', ')})`;
    if (config.variant === 'doughnut') {
      const ring = DOM.create('div', {}, 'swy-doughnut-ring');
      ring.style.background = gradientString;
      const mask = `radial-gradient(closest-side, transparent ${config.holeSize}%, black ${config.holeSize + 0.2}%)`;
      ring.style.maskImage = mask;
      ring.style.webkitMaskImage = mask;
      DOM.append(pieCircle, ring);
      const center = DOM.create('div', { textContent: config.centerText }, 'swy-doughnut-center');
      center.style.width = `${config.holeSize * 0.7}%`;
      center.style.maxHeight = `${config.holeSize * 0.7}%`;
      DOM.append(pieCircle, center);
    } else {
      pieCircle.style.background = gradientString;
    }

    // Add percentage labels on slices
    currentPercent = 0;
    data.forEach((point) => {
      const percentage = (point.value / total) * 100;
      const start = Math.min(currentPercent, 100);
      const end = Math.min(currentPercent + percentage, 100);
      const midPercent = (start + end) / 2;
      // CSS conic angles start at the top; from -90deg starts at the left.
      const angle = (midPercent / 100) * 360 - 180;

      if (config.showLabels && end - start > 5) {
        // Only show label if slice is big enough
        const label = DOM.create(
          'div',
          {
            textContent: `${Math.min(percentage, 100).toFixed(1)}%`,
          },
          'swy-pie-label',
        );

        // Coordinates are percentages of diameter, not radius.
        const radius = config.variant === 'doughnut' ? (50 + config.holeSize / 2) / 2 : 30;
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

  /** Hide labels that cannot fit inside a small disc or thin ring. */
  static fitLabels(circle, config) {
    const rect = circle.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const radius = Math.min(rect.width, rect.height) / 2;
    const inner = config.variant === 'doughnut' ? radius * (config.holeSize / 100) : 0;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    circle.querySelectorAll('.swy-pie-label').forEach((label) => {
      const box = label.getBoundingClientRect();
      const dx = Math.max(box.left - cx, cx - box.right, 0);
      const dy = Math.max(box.top - cy, cy - box.bottom, 0);
      const fits = Math.hypot(dx, dy) >= inner
        && [box.left, box.right].every((x) => [box.top, box.bottom]
          .every((y) => Math.hypot(x - cx, y - cy) <= radius));
      if (!fits) label.style.visibility = 'hidden';
    });
  }

  /**
   * Get default color for pie slice
   * @private
   */
  static getDefaultSliceColor(index) {
    return paletteColor({}, index);
  }
}

export default PieChart;
