import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import SWY from '../src/swy.js';
import Parser from '../src/utils/parser.js';
import logger from '../src/utils/logger.js';
import { DEFAULT_PALETTE, normalizeOptions, parseOptions } from '../src/utils/options.js';
import linePath from '../src/utils/lineGeometry.js';
import PieChart from '../src/charts/pieChart.js';

const data = [{ xLabel: 'A', yValue: 20 }, { xLabel: 'B', yValue: 80 }, { xLabel: 'C', yValue: 40 }];
const slices = data.map((point) => ({ label: point.xLabel, value: point.yValue }));

function host(id = 'chart') {
  const element = document.createElement('div');
  element.id = id;
  document.body.appendChild(element);
  return element;
}

function attributes(element, options) {
  Object.entries(options).forEach(([key, value]) => {
    element.setAttribute(`data-swy-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`,
      Array.isArray(value) ? JSON.stringify(value) : String(value));
  });
}

beforeEach(() => {
  SWY.destroy();
  document.body.innerHTML = '';
  vi.spyOn(logger, 'warn').mockImplementation(() => {});
  vi.spyOn(logger, 'error').mockImplementation(() => {});
});

afterEach(() => {
  SWY.destroy();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('presentation option contracts', () => {
  it.each([
    ['bar-chart', { orientation: 'horizontal', barGap: 0, barRadius: 9, showValues: false }],
    ['pie-chart', { variant: 'doughnut', holeSize: 75, centerText: '<Total>', showLabels: false, showLegend: false, legendPosition: 'bottom' }],
    ['line-chart', { variant: 'area', curve: 'step', lineColor: 'rgb(12, 34, 56)', lineWidth: 6, showPoints: false, pointSize: 15, fillOpacity: 0 }],
  ])('normalizes identical HTML and JS options for %s', (type, settings) => {
    const options = { ...settings, palette: ['rgb(12, 34, 56)', '#abcdef'], animate: false };
    const element = host();
    attributes(element, options);
    expect(parseOptions(element, type)).toEqual(normalizeOptions(type, options));
  });

  it('retains the original appearance defaults and copies palettes', () => {
    expect(normalizeOptions('bar-chart')).toMatchObject({ orientation: 'vertical', barGap: 20, barRadius: 0, showValues: true, animate: true });
    expect(normalizeOptions('pie-chart')).toMatchObject({ variant: 'pie', showLabels: true, showLegend: true, legendPosition: 'right' });
    expect(normalizeOptions('line-chart')).toMatchObject({ variant: 'line', curve: 'linear', lineColor: '#2a22a2', lineWidth: 3, showPoints: true, pointSize: 10 });
    const palette = ['red'];
    const config = normalizeOptions('bar-chart', { palette });
    palette[0] = 'blue';
    expect(config.palette).toEqual(['red']);
    expect(normalizeOptions('bar-chart').palette).toEqual(DEFAULT_PALETTE);
  });

  it.each([
    ['bar-chart', { orientation: 'diagonal', barGap: -1, barRadius: Infinity, showValues: 'false', animate: null, palette: [] }],
    ['pie-chart', { variant: 'ring', holeSize: 95, centerText: {}, showLabels: 0, showLegend: 'yes', legendPosition: 'left' }],
    ['line-chart', { variant: 'scatter', curve: 'bezier', lineColor: 'red; color: blue', lineWidth: 0, pointSize: -1, fillOpacity: 2 }],
  ])('falls back for invalid %s settings', (type, options) => {
    expect(normalizeOptions(type, options)).toEqual(normalizeOptions(type));
    expect(logger.warn).toHaveBeenCalled();
  });

  it('rejects empty numbers, malformed palettes, and ambiguous HTML booleans', () => {
    const element = host();
    element.setAttribute('data-swy-bar-gap', '');
    element.setAttribute('data-swy-palette', 'red,blue');
    element.setAttribute('data-swy-animate', '');
    expect(parseOptions(element, 'bar-chart')).toEqual(normalizeOptions('bar-chart'));
    element.setAttribute('data-swy-show-values', 'false');
    expect(parseOptions(element, 'bar-chart').showValues).toBe(false);
  });
});

describe('rendered variations', () => {
  it.each([
    ['bar-chart', 'initBarChart', { orientation: 'horizontal', barGap: 4, barRadius: 5, showValues: false }],
    ['pie-chart', 'initPieChart', { variant: 'doughnut', holeSize: 70, centerText: '140', legendPosition: 'bottom' }],
    ['line-chart', 'initLineChart', { variant: 'area', curve: 'smooth', lineColor: '#123456', lineWidth: 5, showPoints: false }],
  ])('renders equivalent HTML and JavaScript %s charts and retains options', (type, method, options) => {
    const api = host('api');
    const wrapper = host('html');
    wrapper.setAttribute('data-swy', '');
    const element = document.createElement('div');
    attributes(element, { type, ...options, animate: false, palette: ['red', 'blue'] });
    const points = type === 'pie-chart' ? slices : data;
    points.forEach((point) => {
      const child = document.createElement('div');
      attributes(child, point);
      element.appendChild(child);
    });
    wrapper.appendChild(element);
    expect(Parser.parseChartFromHTML(element)).not.toBeNull();
    expect(SWY[method]({ container: '#api', ...options, animate: false, palette: ['red', 'blue'], data: points })).toBe(true);
    SWY.reinitialize();
    expect(element.innerHTML).toBe(api.innerHTML);
    const original = api.innerHTML;
    SWY.reinitialize();
    expect(api.innerHTML).toBe(original);
    expect(element.querySelector('.swy-no-animation')).not.toBeNull();
  });

  it('uses horizontal widths, swapped axis titles, hidden values, and palette precedence', () => {
    const element = host();
    SWY.initBarChart({ container: '#chart', orientation: 'horizontal', xAxis: 'Category', yAxis: 'Revenue', showValues: false,
      palette: ['red', 'blue'], data: [...data, { xLabel: 'D', yValue: 10, color: '#abcdef' }] });
    const bars = element.querySelectorAll('.swy-bar');
    expect(bars[0].style.width).toBe('25%');
    expect(bars[0].style.height).toBe('');
    expect(Array.from(bars, (bar) => bar.style.getPropertyValue('--bar-color'))).toEqual(['red', 'blue', 'red', '#abcdef']);
    expect(element.querySelector('.swy-bar-value')).toBeNull();
    expect(element.querySelector('.swy-bar-chart-axis-label').textContent).toBe('Revenue');
    expect(element.querySelector('[role="img"]').getAttribute('aria-label')).toContain('Horizontal bar');
    expect(element.querySelectorAll('.swy-sr-only li')).toHaveLength(4);
  });

  it('renders a transparent ring and safe center text independently of labels and legend', () => {
    const element = host();
    SWY.initPieChart({ container: '#chart', variant: 'doughnut', centerText: '<img src=x onerror=alert(1)>', showLabels: false, showLegend: false, data: slices });
    const ring = element.querySelector('.swy-doughnut-ring');
    expect(ring.style.maskImage).toContain('transparent 60%');
    expect(element.querySelector('.swy-pie-circle').style.background).toBe('');
    expect(element.querySelector('.swy-doughnut-center').textContent).toBe('<img src=x onerror=alert(1)>');
    expect(element.querySelector('img')).toBeNull();
    expect(element.querySelector('.swy-pie-label')).toBeNull();
    expect(element.querySelector('.swy-pie-legend')).toBeNull();
    expect(element.querySelectorAll('.swy-sr-only li')).toHaveLength(3);
  });

  it('ignores hole/text settings on ordinary pies and places labels in their slices', () => {
    const element = host();
    SWY.initPieChart({ container: '#chart', holeSize: 90, centerText: 'ignored', data: [{ label: 'A', value: 50 }, { label: 'B', value: 50 }] });
    expect(element.querySelector('.swy-doughnut-center')).toBeNull();
    const labels = element.querySelectorAll('.swy-pie-label');
    expect(parseFloat(labels[0].style.left)).toBeCloseTo(50);
    expect(parseFloat(labels[0].style.top)).toBeCloseTo(20);
    expect(parseFloat(labels[1].style.top)).toBeCloseTo(80);
  });

  it('clamps overflowing slices and positions labels using visible portions', () => {
    const circle = PieChart.createPieCircle([{ label: 'A', value: 80 }, { label: 'B', value: 80 }, { label: 'C', value: 10 }], 100, { variant: 'doughnut' });
    expect(circle.querySelector('.swy-doughnut-ring').style.background).toContain('100%');
    expect(circle.querySelectorAll('.swy-pie-label')).toHaveLength(2);
    const label = circle.querySelectorAll('.swy-pie-label')[1];
    expect(parseFloat(label.style.left)).toBeCloseTo(50 + 40 * Math.cos(144 * Math.PI / 180));
    expect(parseFloat(label.style.top)).toBeCloseTo(50 + 40 * Math.sin(144 * Math.PI / 180));
  });

  it('leaves unused totals transparent and suppresses labels that cross a ring boundary', () => {
    const circle = PieChart.createPieCircle([{ label: 'A', value: 10 }], 100, { variant: 'doughnut' });
    expect(circle.querySelector('.swy-doughnut-ring').style.background).toContain('transparent 10%');
    circle.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 });
    const label = circle.querySelector('.swy-pie-label');
    label.getBoundingClientRect = () => ({ left: 40, right: 60, top: 40, bottom: 60 });
    PieChart.fitLabels(circle, { variant: 'doughnut', holeSize: 60 });
    expect(label.style.visibility).toBe('hidden');
  });

  it('styles area fills and markers independently, retaining a single-point segment', () => {
    const element = host();
    SWY.initLineChart({ container: '#chart', variant: 'area', lineColor: '#123456', lineWidth: 6, pointSize: 18, fillOpacity: 0.35,
      palette: ['red'], data: [{ xLabel: 'A', yValue: 0.25 }] });
    expect(element.querySelector('.swy-area-fill').getAttribute('d')).toMatch(/L 10 100 L 0 100 Z$/);
    expect(element.querySelector('.swy-area-fill').style.fillOpacity).toBe('0.35');
    expect(element.querySelector('.swy-line-path').style.strokeWidth).toBe('6px');
    expect(element.querySelector('.swy-line-path').getAttribute('x2')).toBe('10');
    expect(element.querySelector('.swy-line-point').style.width).toBe('18px');
    expect(element.querySelector('.swy-line-point').style.backgroundColor).toBe('red');
    SWY.initLineChart({ container: '#chart', showPoints: false, data: [{ xLabel: 'A', yValue: 0 }] });
    expect(element.querySelector('.swy-line-point')).toBeNull();
    expect(element.querySelector('.swy-line-path')).not.toBeNull();
  });

  it.each(['linear', 'smooth', 'step'])('handles zero, fractional, and dense data with %s curves', (curve) => {
    const element = host();
    const points = Array.from({ length: 200 }, (_, i) => ({ xLabel: `P${i}`, yValue: i % 3 === 0 ? 0 : i / 100 }));
    expect(SWY.initLineChart({ container: '#chart', variant: 'area', curve, data: points })).toBe(true);
    expect(element.querySelectorAll('.swy-line-point')).toHaveLength(200);
    expect(element.querySelector('.swy-area-fill').getAttribute('d')).not.toMatch(/NaN|Infinity/);
    expect(SWY.initLineChart({ container: '#chart', variant: 'area', curve, data: data.map((point) => ({ ...point, yValue: 0 })) })).toBe(true);
    expect(element.querySelector('.swy-area-fill').getAttribute('d')).not.toMatch(/NaN|Infinity/);
  });

  it.each([
    ['initBarChart', { orientation: 'horizontal' }, [{ xLabel: 'A', yValue: -1 }]],
    ['initPieChart', { variant: 'doughnut' }, [{ label: 'A', value: -1 }]],
    ['initLineChart', { variant: 'area' }, [{ xLabel: 'A', yValue: NaN }]],
  ])('preserves data failures in %s', (method, options, invalid) => {
    const element = host();
    expect(SWY[method]({ container: '#chart', ...options, data: invalid })).toBe(false);
    expect(element.querySelector('.swy-render-error')).not.toBeNull();
    expect(SWY[method]({ container: '#chart', ...options, data: [] })).toBe(false);
  });

  it('retains variation settings on container resize', () => {
    vi.useFakeTimers();
    let onResize;
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback) { onResize = callback; }
      observe() {}
      disconnect() {}
    });
    const element = host();
    SWY.initLineChart({ container: '#chart', variant: 'area', curve: 'step', showPoints: false, animate: false, data });
    const original = element.querySelector('.swy-line-path');
    onResize([{ target: element, contentRect: { width: 320, height: 300 } }]);
    vi.advanceTimersByTime(151);
    expect(element.querySelector('.swy-line-path')).not.toBe(original);
    expect(element.querySelector('.swy-line-path').getAttribute('d')).toContain(' H ');
    expect(element.querySelector('.swy-area-fill')).not.toBeNull();
    expect(element.querySelector('.swy-line-point')).toBeNull();
    expect(element.querySelector('.swy-no-animation')).not.toBeNull();
  });
});

describe('curve geometry', () => {
  it('holds the previous value until the next category in step mode', () => {
    expect(linePath([{ x: 0, y: 80 }, { x: 50, y: 20 }, { x: 100, y: 60 }], 'step'))
      .toBe('M 0 80 H 50 V 20 H 100 V 60');
  });

  it('keeps smooth interpolation within each pair of endpoint values', () => {
    const points = [100, 99, 0, 50, 50, 20, 100].map((y, i) => ({ x: i * 10, y }));
    const path = linePath(points, 'smooth');
    const segments = [...path.matchAll(/C ([\d.e+-]+) ([\d.e+-]+) ([\d.e+-]+) ([\d.e+-]+) ([\d.e+-]+) ([\d.e+-]+)/g)];
    expect(segments).toHaveLength(points.length - 1);
    segments.forEach((segment, i) => {
      const controls = [points[i].y, Number(segment[2]), Number(segment[4]), points[i + 1].y];
      for (let step = 0; step <= 20; step += 1) {
        const t = step / 20;
        const y = (1 - t) ** 3 * controls[0] + 3 * (1 - t) ** 2 * t * controls[1]
          + 3 * (1 - t) * t ** 2 * controls[2] + t ** 3 * controls[3];
        expect(y).toBeGreaterThanOrEqual(Math.min(controls[0], controls[3]) - 1e-9);
        expect(y).toBeLessThanOrEqual(Math.max(controls[0], controls[3]) + 1e-9);
      }
    });
  });
});
