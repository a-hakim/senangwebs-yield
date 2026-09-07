import { describe, it, expect, beforeEach, vi } from 'vitest';
import SWY from '../src/swy.js';
import logger from '../src/utils/logger.js';
import pkg from '../package.json';

function createContainer(id) {
  const el = document.createElement('div');
  el.id = id;
  document.body.appendChild(el);
  return el;
}

describe('SWY JavaScript API', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    SWY.destroy();
    logger.setDebugMode(false);
  });

  describe('initBarChart', () => {
    it('renders a bar chart and returns true', () => {
      createContainer('bar-api');
      const result = SWY.initBarChart({
        container: '#bar-api',
        xAxis: 'Months',
        yAxis: 'Revenue',
        data: [
          { xLabel: 'Jan', yValue: 150 },
          { xLabel: 'Feb', yValue: 300 },
        ],
      });

      expect(result).toBe(true);
      expect(document.querySelector('#bar-api .swy-bar-chart')).not.toBeNull();
      expect(document.querySelectorAll('#bar-api .swy-bar-group')).toHaveLength(2);
    });

    it('returns false for unknown containers', () => {
      expect(SWY.initBarChart({ container: '#missing', data: [{ xLabel: 'A', yValue: 1 }] })).toBe(false);
    });

    it('returns false for invalid data', () => {
      createContainer('bar-invalid');
      expect(SWY.initBarChart({ container: '#bar-invalid', data: [] })).toBe(false);
      expect(SWY.initBarChart({ container: '#bar-invalid', data: [{ xLabel: 'A', yValue: -3 }] })).toBe(false);
    });

    it('replaces a previously registered chart on the same container', () => {
      createContainer('bar-replace');
      expect(SWY.initBarChart({ container: '#bar-replace', data: [{ xLabel: 'A', yValue: 10 }] })).toBe(true);
      expect(SWY.initBarChart({
        container: '#bar-replace',
        data: [{ xLabel: 'A', yValue: 10 }, { xLabel: 'B', yValue: 20 }],
      })).toBe(true);

      // Only the latest chart remains rendered on the container
      expect(document.querySelectorAll('#bar-replace .swy-bar-group')).toHaveLength(2);
    });

    it('uses the documented default palette when no color given', () => {
      createContainer('bar-colors');
      SWY.initBarChart({
        container: '#bar-colors',
        data: [{ xLabel: 'A', yValue: 10 }],
      });

      const bar = document.querySelector('#bar-colors .swy-bar');
      expect(bar).not.toBeNull();
      expect(bar.style.getPropertyValue('--bar-color')).toBe('#ff6600');
    });

    it('falls back to the palette for invalid colors', () => {
      createContainer('bar-badcolor');
      const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
      SWY.initBarChart({
        container: '#bar-badcolor',
        data: [{ xLabel: 'A', yValue: 10, color: 'red); background:url(https://evil.example)' }],
      });

      const bar = document.querySelector('#bar-badcolor .swy-bar');
      expect(bar).not.toBeNull();
      expect(bar.style.getPropertyValue('--bar-color')).toBe('#ff6600');
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe('initPieChart', () => {
    it('renders a pie chart with an auto-calculated total', () => {
      createContainer('pie-api');
      const result = SWY.initPieChart({
        container: '#pie-api',
        data: [
          { label: 'A', value: 120 },
          { label: 'B', value: 80 },
        ],
      });

      expect(result).toBe(true);
      expect(document.querySelector('#pie-api .swy-pie-chart')).not.toBeNull();
      expect(document.querySelectorAll('#pie-api .swy-pie-legend-item')).toHaveLength(2);
    });

    it('rejects charts where all values are zero', () => {
      createContainer('pie-zero');
      expect(SWY.initPieChart({
        container: '#pie-zero',
        data: [{ label: 'A', value: 0 }],
      })).toBe(false);
    });
  });

  describe('initLineChart', () => {
    it('renders a line chart', () => {
      createContainer('line-api');
      const result = SWY.initLineChart({
        container: '#line-api',
        xAxis: 'Day',
        yAxis: 'Visitors',
        data: [
          { xLabel: 'Mon', yValue: 50 },
          { xLabel: 'Tue', yValue: 80 },
        ],
      });

      expect(result).toBe(true);
      expect(document.querySelector('#line-api .swy-line-chart')).not.toBeNull();
      expect(document.querySelector('#line-api .swy-line-svg-overlay polyline')).not.toBeNull();
    });

    it('renders a reference segment instead of a degenerate polyline for single points', () => {
      createContainer('line-single');
      SWY.initLineChart({
        container: '#line-single',
        data: [{ xLabel: 'Mon', yValue: 50 }],
      });

      expect(document.querySelector('#line-single .swy-line-svg-overlay polyline')).toBeNull();
      expect(document.querySelector('#line-single .swy-line-svg-overlay line')).not.toBeNull();
    });
  });

  describe('HTML auto-initialization', () => {
    it('initializes declarative charts', () => {
      document.body.innerHTML = `
        <div data-swy>
          <div data-swy-type="bar-chart" data-swy-x-axis="Quarters" data-swy-y-axis="Revenue">
            <div data-swy-x-label="Q1" data-swy-y-value="150"></div>
            <div data-swy-x-label="Q2" data-swy-y-value="250"></div>
          </div>
        </div>
      `;

      SWY.reinitialize();

      expect(document.querySelector('.swy-bar-chart')).not.toBeNull();
      expect(document.querySelectorAll('.swy-bar-group')).toHaveLength(2);
    });

    it('does not double-initialize on repeated calls', () => {
      document.body.innerHTML = `
        <div data-swy>
          <div data-swy-type="bar-chart">
            <div data-swy-x-label="A" data-swy-y-value="10"></div>
          </div>
        </div>
      `;

      SWY.reinitialize();
      SWY.reinitialize();

      expect(document.querySelectorAll('.swy-bar-chart')).toHaveLength(1);
    });

    it('warns and skips charts with unknown types', () => {
      const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
      document.body.innerHTML = `
        <div data-swy>
          <div data-swy-type="radar-chart">
            <div data-swy-x-label="A" data-swy-y-value="10"></div>
          </div>
        </div>
      `;

      SWY.reinitialize();

      expect(document.querySelector('.swy-bar-chart')).toBeNull();
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('skips items with unparseable values instead of rendering zeros silently', () => {
      const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
      document.body.innerHTML = `
        <div data-swy>
          <div data-swy-type="bar-chart">
            <div data-swy-x-label="A" data-swy-y-value="abc"></div>
            <div data-swy-x-label="B" data-swy-y-value="100"></div>
          </div>
        </div>
      `;

      SWY.reinitialize();

      expect(document.querySelectorAll('.swy-bar-group')).toHaveLength(1);
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('clamps overflowing pie slices when the sum exceeds the provided total', () => {
      document.body.innerHTML = `
        <div data-swy>
          <div data-swy-type="pie-chart" data-swy-total="100">
            <div data-swy-label="A" data-swy-value="80"></div>
            <div data-swy-label="B" data-swy-value="80"></div>
          </div>
        </div>
      `;

      const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
      SWY.reinitialize();

      const pie = document.querySelector('.swy-pie-circle');
      expect(pie).not.toBeNull();
      expect(pie.style.background).toContain('100%');
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe('reinitialize', () => {
    it('prunes charts whose containers were detached', () => {
      const container = createContainer('prune-me');
      expect(SWY.initBarChart({ container: '#prune-me', data: [{ xLabel: 'A', yValue: 5 }] })).toBe(true);

      container.remove();
      SWY.reinitialize();

      // After pruning, re-initializing a same-id container works cleanly
      const fresh = createContainer('prune-me');
      expect(SWY.initBarChart({ container: '#prune-me', data: [{ xLabel: 'A', yValue: 5 }] })).toBe(true);
      expect(fresh.querySelector('.swy-bar-chart')).not.toBeNull();
    });
  });

  describe('version and lifecycle', () => {
    it('exposes a version via getVersion() and SWY.version consistently', () => {
      expect(SWY.getVersion()).toBe(SWY.version);
      expect(SWY.getVersion()).toBe(pkg.version);
    });

    it('destroy() clears the registry so containers can be re-initialized', () => {
      createContainer('destroy-me');
      expect(SWY.initBarChart({ container: '#destroy-me', data: [{ xLabel: 'A', yValue: 10 }] })).toBe(true);

      SWY.destroy();
      expect(SWY.initBarChart({ container: '#destroy-me', data: [{ xLabel: 'B', yValue: 20 }] })).toBe(true);
      expect(document.querySelectorAll('#destroy-me .swy-bar-group')).toHaveLength(1);
    });
  });

  describe('accessibility', () => {
    it('renders an accessible summary with role="img" and a data list', () => {
      createContainer('a11y');
      SWY.initBarChart({
        container: '#a11y',
        xAxis: 'Quarters',
        yAxis: 'Revenue',
        data: [
          { xLabel: 'Q1', yValue: 150 },
          { xLabel: 'Q2', yValue: 250 },
        ],
      });

      const summary = document.querySelector('#a11y [data-swy-summary] [role="img"]');
      expect(summary).not.toBeNull();
      expect(summary.getAttribute('aria-label')).toBe('Bar chart: Revenue by Quarters');
      expect(document.querySelectorAll('#a11y [data-swy-summary] li')).toHaveLength(2);
    });
  });

  describe('render failure fallback', () => {
    it('shows a visible error message when rendering fails', () => {
      createContainer('fail-bar');
      const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});

      SWY.initBarChart({ container: '#fail-bar', data: null });

      expect(document.querySelector('#fail-bar .swy-render-error')).not.toBeNull();
      expect(document.querySelector('#fail-bar [role="alert"]')).not.toBeNull();
      errorSpy.mockRestore();
    });
  });
});
