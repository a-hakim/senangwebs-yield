/**
 * DOM Utility Functions for SWY
 * Provides DOM manipulation and element selection helpers
 */

import logger from './logger.js';

const DOM = {
  /**
   * Select a single element using CSS selector
   * @param {string} selector - CSS selector
   * @param {Element} context - Optional parent element
   * @returns {Element|null}
   */
  select(selector, context = document) {
    try {
      return context.querySelector(selector);
    } catch (error) {
      logger.error(`Failed to select element with selector: ${selector}`, error);
      return null;
    }
  },

  /**
   * Select multiple elements using CSS selector
   * @param {string} selector - CSS selector
   * @param {Element} context - Optional parent element
   * @returns {NodeList}
   */
  selectAll(selector, context = document) {
    try {
      return context.querySelectorAll(selector);
    } catch (error) {
      logger.error(`Failed to select elements with selector: ${selector}`, error);
      return [];
    }
  },

  /**
   * Create a new element
   * @param {string} tagName - HTML tag name
   * @param {Object} attributes - Optional attributes to set
   * @param {string} className - Optional CSS class name
   * @returns {Element}
   */
  create(tagName, attributes = {}, className = '') {
    const element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    Object.keys(attributes).forEach((key) => {
      if (key === 'innerHTML') {
        element.innerHTML = attributes[key];
      } else if (key === 'textContent') {
        element.textContent = attributes[key];
      } else {
        element.setAttribute(key, attributes[key]);
      }
    });

    return element;
  },

  /**
   * Get attribute value
   * @param {Element} element - DOM element
   * @param {string} attributeName - Attribute name
   * @returns {string|null}
   */
  getAttribute(element, attributeName) {
    if (!element) return null;
    return element.getAttribute(attributeName);
  },

  /**
   * Set attribute value
   * @param {Element} element - DOM element
   * @param {string} attributeName - Attribute name
   * @param {string} value - Attribute value
   */
  setAttribute(element, attributeName, value) {
    if (element) {
      element.setAttribute(attributeName, value);
    }
  },

  /**
   * Add CSS class to element
   * @param {Element} element - DOM element
   * @param {string} className - Class name
   */
  addClass(element, className) {
    if (element) {
      element.classList.add(className);
    }
  },

  /**
   * Remove CSS class from element
   * @param {Element} element - DOM element
   * @param {string} className - Class name
   */
  removeClass(element, className) {
    if (element) {
      element.classList.remove(className);
    }
  },

  /**
   * Check if element has CSS class
   * @param {Element} element - DOM element
   * @param {string} className - Class name
   * @returns {boolean}
   */
  hasClass(element, className) {
    if (!element) return false;
    return element.classList.contains(className);
  },

  /**
   * Clear all children of an element
   * @param {Element} element - DOM element
   */
  clear(element) {
    if (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  },

  /**
   * Append child element(s)
   * @param {Element} parent - Parent element
   * @param {Element|Element[]} children - Child element(s)
   */
  append(parent, children) {
    if (!parent) return;
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (child) parent.appendChild(child);
      });
    } else if (children) {
      parent.appendChild(children);
    }
  },

  /**
   * Get element dimensions and position
   * @param {Element} element - DOM element
   * @returns {Object} Object with width, height, top, left, right, bottom
   */
  getRect(element) {
    if (!element) {
      return {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      };
    }
    const rect = element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
    };
  },

  /**
   * On document ready handler
   * @param {Function} callback - Function to call when DOM is ready
   */
  onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  },

  /**
   * Get computed style of an element
   * @param {Element} element - DOM element
   * @param {string} property - CSS property name
   * @returns {string}
   */
  getComputedStyle(element, property) {
    if (!element) return null;
    return window.getComputedStyle(element).getPropertyValue(property);
  },

  /**
   * Parse data attributes from element
   * @param {Element} element - DOM element
   * @returns {Object} Object with data attributes
   */
  getDataAttributes(element) {
    if (!element) return {};
    return { ...element.dataset };
  },

  /**
   * Create a bar element for bar charts
   * @param {number} height - Bar height percentage (0-100)
   * @param {string} color - Bar color
   * @param {string} label - Bar label
   * @param {number|string} value - Bar value
   * @returns {HTMLElement}
   */
  createBar(height, color, label, value) {
    const barGroup = this.create('div', {}, 'swy-bar-group');

    const bar = this.create('div', {}, 'swy-bar');
    bar.style.setProperty('--bar-color', color);
    bar.style.height = `${height}%`;
    bar.style.setProperty('--bar-height', `${height}%`);
    this.addClass(bar, 'swy-bar-animate');

    const valueLabel = this.create(
      'div',
      {
        textContent: this.formatNumber(value),
      },
      'swy-bar-value',
    );

    bar.appendChild(valueLabel);
    barGroup.appendChild(bar);

    const barLabel = this.create(
      'div',
      {
        textContent: label,
      },
      'swy-bar-label',
    );
    barGroup.appendChild(barLabel);

    return barGroup;
  },

  /**
   * Create a line element connecting two points
   * @param {number} x1 - Start X coordinate (percentage)
   * @param {number} y1 - Start Y coordinate (percentage)
   * @param {number} x2 - End X coordinate (percentage)
   * @param {number} y2 - End Y coordinate (percentage)
   * @param {string} color - Line color
   * @returns {HTMLElement}
   */
  createLine(x1, y1, x2, y2, color) {
    const line = this.create('div', {}, 'swy-html-line');

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    line.style.width = `${length}%`;
    line.style.left = `${x1}%`;
    line.style.top = `${y1}%`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = '0 0';
    line.style.backgroundColor = color;

    return line;
  },

  /**
   * Create a data point element for line charts
   * @param {number} x - X coordinate (percentage)
   * @param {number} y - Y coordinate (percentage)
   * @param {string} color - Point color
   * @param {string} label - Point label
   * @param {number|string} value - Point value
   * @returns {HTMLElement}
   */
  createPoint(x, y, color, label, value) {
    const point = this.create('div', {}, 'swy-line-point');
    point.style.left = `${x}%`;
    point.style.top = `${y}%`;
    point.style.backgroundColor = color;

    const tooltip = this.create(
      'div',
      {
        textContent: `${label}: ${this.formatNumber(value)}`,
      },
      'swy-line-tooltip',
    );

    point.appendChild(tooltip);

    return point;
  },

  /**
   * Create a pie slice using CSS conic gradient
   * @param {number} startPercent - Start percentage (0-100)
   * @param {number} endPercent - End percentage (0-100)
   * @param {string} color - Slice color
   * @param {string} label - Slice label
   * @param {number} value - Slice value
   * @param {number} percentage - Slice percentage
   * @returns {HTMLElement}
   */
  createPieSlice(startPercent, endPercent, color, label, value, percentage) {
    const slice = this.create('div', {}, 'swy-pie-slice');
    slice.style.setProperty('--start-angle', `${startPercent * 3.6}deg`);
    slice.style.setProperty('--end-angle', `${endPercent * 3.6}deg`);
    slice.style.setProperty('--slice-color', color);

    // Store data for tooltip
    slice.dataset.label = label;
    slice.dataset.value = value;
    slice.dataset.percentage = percentage.toFixed(1);

    return slice;
  },

  /**
   * Create grid lines for charts
   * @param {number} count - Number of grid lines
   * @param {string} direction - 'horizontal' or 'vertical'
   * @returns {HTMLElement}
   */
  createGridLines(count, direction) {
    const container = this.create('div', {}, `swy-grid-${direction}`);

    for (let i = 0; i <= count; i += 1) {
      const line = this.create('div', {}, 'swy-grid-line');
      const position = (i / count) * 100;

      if (direction === 'horizontal') {
        line.style.top = `${position}%`;
      } else {
        line.style.left = `${position}%`;
      }

      this.append(container, line);
    }

    return container;
  },

  /**
   * Create axis labels for charts
   * @param {Array} labels - Array of label strings
   * @param {string} axis - 'x' or 'y'
   * @returns {HTMLElement}
   */
  createAxisLabels(labels, axis) {
    const container = this.create('div', {}, `swy-axis-labels-${axis}`);

    labels.forEach((label, index) => {
      const labelEl = this.create(
        'div',
        {
          textContent: label,
        },
        'swy-axis-label',
      );

      const position = (index / (labels.length - 1 || 1)) * 100;

      if (axis === 'x') {
        labelEl.style.left = `${position}%`;
      } else {
        labelEl.style.top = `${100 - position}%`;
      }

      this.append(container, labelEl);
    });

    return container;
  },

  /**
   * Format number for display
   * @param {number} num - Number to format
   * @returns {string}
   */
  formatNumber(num) {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(num % 1 === 0 ? 0 : 1);
  },
};

export default DOM;
