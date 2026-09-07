import { describe, it, expect } from 'vitest';
import Validator from '../src/utils/validator.js';
import BarChart from '../src/charts/barChart.js';
import LineChart from '../src/charts/lineChart.js';

describe('Validator.validateBarChart', () => {
  it('accepts valid configurations', () => {
    expect(Validator.validateBarChart({
      data: [{ xLabel: 'A', yValue: 10 }],
    })).toBe(true);
  });

  it('accepts zero values', () => {
    expect(Validator.validateBarChart({
      data: [{ xLabel: 'A', yValue: 0 }],
    })).toBe(true);
  });

  it('rejects negative values', () => {
    expect(Validator.validateBarChart({
      data: [{ xLabel: 'A', yValue: -5 }],
    })).toBe(false);
  });

  it('rejects non-finite values', () => {
    expect(Validator.validateBarChart({
      data: [{ xLabel: 'A', yValue: Number.NaN }],
    })).toBe(false);
    expect(Validator.validateBarChart({
      data: [{ xLabel: 'A', yValue: Infinity }],
    })).toBe(false);
  });

  it('rejects empty or missing data', () => {
    expect(Validator.validateBarChart({ data: [] })).toBe(false);
    expect(Validator.validateBarChart({})).toBe(false);
    expect(Validator.validateBarChart(null)).toBe(false);
  });

  it('rejects missing xLabel', () => {
    expect(Validator.validateBarChart({
      data: [{ yValue: 10 }],
    })).toBe(false);
  });
});

describe('Validator.validateLineChart', () => {
  it('accepts valid configurations', () => {
    expect(Validator.validateLineChart({
      data: [{ xLabel: 'Mon', yValue: 5.5 }],
    })).toBe(true);
  });

  it('rejects negative values', () => {
    expect(Validator.validateLineChart({
      data: [{ xLabel: 'Mon', yValue: -1 }],
    })).toBe(false);
  });
});

describe('Validator.validatePieChart', () => {
  it('accepts valid configurations', () => {
    expect(Validator.validatePieChart({
      total: 100,
      data: [{ label: 'A', value: 50 }],
    })).toBe(true);
  });

  it('rejects zero or negative totals', () => {
    expect(Validator.validatePieChart({
      total: 0,
      data: [{ label: 'A', value: 50 }],
    })).toBe(false);

    expect(Validator.validatePieChart({
      total: -5,
      data: [{ label: 'A', value: 50 }],
    })).toBe(false);
  });

  it('rejects negative slice values', () => {
    expect(Validator.validatePieChart({
      total: 100,
      data: [{ label: 'A', value: -50 }],
    })).toBe(false);
  });
});

describe('Validator.isValidColor / resolveColor', () => {
  it('accepts hex colors of 3, 4, 6 and 8 digits', () => {
    expect(Validator.isValidColor('#ff6600')).toBe(true);
    expect(Validator.isValidColor('#f60')).toBe(true);
    expect(Validator.isValidColor('#ff6600ff')).toBe(true);
    expect(Validator.isValidColor('#f60f')).toBe(true);
  });

  it('accepts rgb/rgba/hsl functional notation', () => {
    expect(Validator.isValidColor('rgb(255, 102, 0)')).toBe(true);
    expect(Validator.isValidColor('rgba(255,102,0,0.5)')).toBe(true);
    expect(Validator.isValidColor('hsl(24, 100%, 50%)')).toBe(true);
  });

  it('accepts plain keywords and is optional', () => {
    expect(Validator.isValidColor('tomato')).toBe(true);
    expect(Validator.isValidColor('')).toBe(true);
    expect(Validator.isValidColor(null)).toBe(true);
    expect(Validator.isValidColor(undefined)).toBe(true);
  });

  it('rejects CSS injection payloads', () => {
    expect(Validator.isValidColor('red); background:url(https://evil.example/x)')).toBe(false);
    expect(Validator.isValidColor('red; } body { display:none')).toBe(false);
    expect(Validator.isValidColor('url(https://evil.example)')).toBe(false);
    expect(Validator.isValidColor('"red"')).toBe(false);
    expect(Validator.isValidColor('expression(alert(1))')).toBe(false);
  });

  it('resolveColor falls back for invalid colors', () => {
    expect(Validator.resolveColor('bad); color', '#ff6600')).toBe('#ff6600');
    expect(Validator.resolveColor(null, '#2a22a2')).toBe('#2a22a2');
    expect(Validator.resolveColor('#ff6600', '#2a22a2')).toBe('#ff6600');
  });
});

describe('Chart scale calculation', () => {
  it('rounds up to the nearest magnitude multiple', () => {
    expect(BarChart.calculateScale([150, 320])).toBe(400);
    expect(BarChart.calculateScale([90])).toBe(90);
  });

  it('handles all-zero data and empty input without NaN', () => {
    expect(BarChart.calculateScale([0, 0])).toBe(1);
    expect(BarChart.calculateScale([])).toBe(1);
  });

  it('handles fractional values', () => {
    expect(LineChart.calculateScale([1.2, 3.7])).toBe(4);
    expect(LineChart.calculateScale([0.05])).toBe(0.05);
  });
});
