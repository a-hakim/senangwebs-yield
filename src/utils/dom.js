/**
 * DOM Utility Functions for SWY
 * Provides DOM manipulation and element selection helpers
 */

import logger from './logger.js';

const DOM = {
  /**
   * Select a single element using CSS selector
   * @param {string} selector - CSS selector
   * @param {Element} [context=document] - Optional parent element
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
   * @param {Element} [context=document] - Optional parent element
   * @returns {Element[]}
   */
  selectAll(selector, context = document) {
    try {
      return Array.from(context.querySelectorAll(selector));
    } catch (error) {
      logger.error(`Failed to select elements with selector: ${selector}`, error);
      return [];
    }
  },

  /**
   * Create a new element
   * @param {string} tagName - HTML tag name
   * @param {Object} attributes - Optional attributes ("textContent" sets safe
   *   text, other keys are set via setAttribute)
   * @param {string} [className=''] - Optional CSS class name
   * @returns {Element}
   */
  create(tagName, attributes = {}, className = '') {
    const element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    Object.keys(attributes).forEach((key) => {
      if (key === 'textContent') {
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
   * Create a visible fallback message when a chart fails to render
   * @param {string} message - Error message shown to the user
   * @returns {HTMLElement}
   */
  createErrorMessage(message) {
    const errorEl = this.create('div', { textContent: message }, 'swy-render-error');
    errorEl.setAttribute('role', 'alert');
    return errorEl;
  },

  /**
   * Create an accessible, visually hidden summary for a chart
   * @param {string} label - Short accessible name for the chart
   *   (e.g. "Bar chart: Sales by Quarter")
   * @param {string[]} entries - Human-readable data entries (e.g. "Q1: 150")
   * @returns {Element} Element with role="img", aria-label and a
   *   screen-reader data list
   */
  createAccessibleSummary(label, entries) {
    const wrapper = this.create('div', { 'data-swy-summary': '' }, 'swy-sr-only');

    const figure = this.create('div', { role: 'img', 'aria-label': label });
    DOM.append(wrapper, figure);

    const list = this.create('ul', {}, 'swy-sr-only');
    entries.forEach((entry) => {
      DOM.append(list, DOM.create('li', { textContent: entry }));
    });
    DOM.append(wrapper, list);

    return wrapper;
  },

  /**
   * Create a bar element for bar charts
   * @param {number} height - Bar height percentage (0-100)
   * @param {string} color - Bar color
   * @param {string} label - Bar label
   * @param {number} value - Bar value
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
   * Format number for display
   * @param {number} num - Number to format
   * @returns {string}
   */
  formatNumber(num) {
    if (typeof num !== 'number' || Number.isNaN(num)) {
      return String(num);
    }
    const sign = num < 0 ? '-' : '';
    const abs = Math.abs(num);
    if (abs >= 1000000) {
      return `${sign}${(abs / 1000000).toFixed(1)}M`;
    }
    if (abs >= 1000) {
      return `${sign}${(abs / 1000).toFixed(1)}K`;
    }
    return num.toFixed(num % 1 === 0 ? 0 : 1);
  },
};

export default DOM;
