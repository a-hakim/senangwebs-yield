import { describe, it, expect, beforeEach } from 'vitest';
import Parser from '../src/utils/parser.js';
import DOM from '../src/utils/dom.js';

function createBarChartHTML(values, opts = {}) {
  const container = document.createElement('div');
  container.setAttribute('data-swy', '');

  const chart = document.createElement('div');
  chart.setAttribute('data-swy-type', 'bar-chart');
  if (opts.xAxis) chart.setAttribute('data-swy-x-axis', opts.xAxis);
  if (opts.yAxis) chart.setAttribute('data-swy-y-axis', opts.yAxis);

  values.forEach(({ xLabel, yValue, color }) => {
    const item = document.createElement('div');
    if (xLabel !== undefined) item.setAttribute('data-swy-x-label', xLabel);
    if (yValue !== undefined) item.setAttribute('data-swy-y-value', yValue);
    if (color !== undefined) item.setAttribute('data-swy-color', color);
    chart.appendChild(item);
  });

  container.appendChild(chart);
  document.body.appendChild(container);
  return chart;
}

function createPieChartHTML(values, opts = {}) {
  const container = document.createElement('div');
  container.setAttribute('data-swy', '');

  const chart = document.createElement('div');
  chart.setAttribute('data-swy-type', 'pie-chart');
  if (opts.total !== undefined) chart.setAttribute('data-swy-total', String(opts.total));

  values.forEach(({ label, value, color }) => {
    const item = document.createElement('div');
    if (label !== undefined) item.setAttribute('data-swy-label', label);
    if (value !== undefined) item.setAttribute('data-swy-value', value);
    if (color !== undefined) item.setAttribute('data-swy-color', color);
    chart.appendChild(item);
  });

  container.appendChild(chart);
  document.body.appendChild(container);
  return chart;
}

describe('Parser', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('parseBarChart', () => {
    it('parses valid bar chart data', () => {
      const element = createBarChartHTML([
        { xLabel: 'A', yValue: '150', color: '#ff6600' },
        { xLabel: 'B', yValue: '200.5' },
      ], { xAxis: 'Quarter', yAxis: 'Sales' });

      const config = Parser.parseBarChart(element);

      expect(config.type).toBe('bar-chart');
      expect(config.xAxis).toBe('Quarter');
      expect(config.yAxis).toBe('Sales');
      expect(config.data).toEqual([
        { xLabel: 'A', yValue: 150, color: '#ff6600' },
        { xLabel: 'B', yValue: 200.5, color: null },
      ]);
    });

    it('defaults axis titles when attributes are missing', () => {
      const element = createBarChartHTML([{ xLabel: 'A', yValue: '10' }]);
      const config = Parser.parseBarChart(element);

      expect(config.xAxis).toBe('X-Axis');
      expect(config.yAxis).toBe('Y-Axis');
    });

    it('skips items with invalid numeric values and warns', () => {
      const element = createBarChartHTML([
        { xLabel: 'A', yValue: '150' },
        { xLabel: 'B', yValue: 'abc' },
        { xLabel: 'C' },
        { xLabel: 'D', yValue: '300' },
      ]);

      const config = Parser.parseBarChart(element);

      expect(config.data).toHaveLength(2);
      expect(config.data[0].xLabel).toBe('A');
      expect(config.data[1].xLabel).toBe('D');
    });

    it('parses zero values as legitimate data', () => {
      const element = createBarChartHTML([{ xLabel: 'A', yValue: '0' }]);
      const config = Parser.parseBarChart(element);

      expect(config.data).toHaveLength(1);
      expect(config.data[0].yValue).toBe(0);
    });
  });

  describe('parsePieChart', () => {
    it('auto-calculates the total when not provided', () => {
      const element = createPieChartHTML([
        { label: 'A', value: '120' },
        { label: 'B', value: '80' },
      ]);

      const config = Parser.parsePieChart(element);
      expect(config.total).toBe(200);
    });

    it('uses the provided total', () => {
      const element = createPieChartHTML(
        [
          { label: 'A', value: '120' },
          { label: 'B', value: '80' },
        ],
        { total: 360 },
      );

      const config = Parser.parsePieChart(element);
      expect(config.total).toBe(360);
    });

    it('falls back to auto-calculated total for invalid total values', () => {
      const element = createPieChartHTML([{ label: 'A', value: '50' }], { total: 'abc' });

      const config = Parser.parsePieChart(element);
      expect(config.total).toBe(50);
    });

    it('skips items with invalid values', () => {
      const element = createPieChartHTML([
        { label: 'A', value: '50' },
        { label: 'B', value: 'not-a-number' },
        { label: 'C', value: '70' },
      ]);

      const config = Parser.parsePieChart(element);
      expect(config.data).toHaveLength(2);
      expect(config.total).toBe(120);
    });
  });

  describe('parseLineChart', () => {
    it('parses line chart data', () => {
      const container = document.createElement('div');
      container.setAttribute('data-swy', '');
      const chart = document.createElement('div');
      chart.setAttribute('data-swy-type', 'line-chart');

      [['Mon', '50'], ['Tue', '80']].forEach(([xLabel, yValue]) => {
        const item = document.createElement('div');
        item.setAttribute('data-swy-x-label', xLabel);
        item.setAttribute('data-swy-y-value', yValue);
        chart.appendChild(item);
      });

      container.appendChild(chart);
      document.body.appendChild(container);

      const config = Parser.parseLineChart(chart);

      expect(config.type).toBe('line-chart');
      expect(config.data).toEqual([
        { xLabel: 'Mon', yValue: 50, color: null },
        { xLabel: 'Tue', yValue: 80, color: null },
      ]);
    });
  });

  describe('parseChartFromHTML', () => {
    it('returns null and warns for unknown chart types', () => {
      const element = document.createElement('div');
      element.setAttribute('data-swy-type', 'radar-chart');

      expect(Parser.parseChartFromHTML(element)).toBeNull();
    });

    it('returns null for missing elements', () => {
      expect(Parser.parseChartFromHTML(null)).toBeNull();
    });
  });

  describe('findAllCharts', () => {
    it('finds charts nested inside data-swy containers', () => {
      createBarChartHTML([{ xLabel: 'A', yValue: '10' }]);
      const charts = Parser.findAllCharts();

      expect(charts).toHaveLength(1);
      expect(charts[0].getAttribute('data-swy-type')).toBe('bar-chart');
    });
  });
});

describe('DOM.formatNumber', () => {
  it('formats millions and thousands with abbreviations', () => {
    expect(DOM.formatNumber(1500000)).toBe('1.5M');
    expect(DOM.formatNumber(1500)).toBe('1.5K');
  });

  it('formats negative large numbers symmetrically', () => {
    expect(DOM.formatNumber(-1500)).toBe('-1.5K');
    expect(DOM.formatNumber(-1500000)).toBe('-1.5M');
  });

  it('keeps integers and decimals readable', () => {
    expect(DOM.formatNumber(42)).toBe('42');
    expect(DOM.formatNumber(4.25)).toBe('4.3');
    expect(DOM.formatNumber(0)).toBe('0');
  });
});
