import Validator from './validator.js';
import logger from './logger.js';

export const DEFAULT_PALETTE = Object.freeze([
  '#ff6600', '#2a22a2', '#33cc33', '#ddd222', '#ff5733', '#c70039', '#900c3f', '#FF69B4',
]);

const COMMON = { animate: true, palette: DEFAULT_PALETTE };
const DEFAULTS = {
  'bar-chart': {
    orientation: 'vertical', barGap: 20, barRadius: 0, showValues: true,
  },
  'pie-chart': {
    variant: 'pie',
    holeSize: 60,
    centerText: '',
    showLabels: true,
    showLegend: true,
    legendPosition: 'right',
  },
  'line-chart': {
    variant: 'line',
    curve: 'linear',
    lineColor: '#2a22a2',
    lineWidth: 3,
    showPoints: true,
    pointSize: 10,
    fillOpacity: 0.2,
  },
};

function validColor(value) {
  return typeof value === 'string' && value.trim() !== '' && Validator.isValidColor(value)
    && (typeof CSS === 'undefined' || !CSS.supports || CSS.supports('color', value));
}

function isValid(key, value, fallback, type) {
  if (key === 'palette') return Array.isArray(value) && value.length > 0 && value.every(validColor);
  if (key === 'lineColor') return validColor(value);
  if (key === 'orientation') return ['vertical', 'horizontal'].includes(value);
  if (key === 'variant') return (type === 'pie-chart' ? ['pie', 'doughnut'] : ['line', 'area']).includes(value);
  if (key === 'curve') return ['linear', 'smooth', 'step'].includes(value);
  if (key === 'legendPosition') return ['right', 'bottom'].includes(value);
  if (typeof fallback === 'number') {
    if (typeof value !== 'number' || !Number.isFinite(value)) return false;
    if (key === 'holeSize') return value >= 10 && value <= 90;
    if (key === 'fillOpacity') return value >= 0 && value <= 1;
    if (key === 'lineWidth' || key === 'pointSize') return value > 0;
    return value >= 0;
  }
  return typeof value === typeof fallback;
}

/** Normalize only presentation options; data validation stays with each renderer. */
export function normalizeOptions(type, input = {}) {
  const defaults = { ...COMMON, ...DEFAULTS[type] };
  return Object.entries(defaults).reduce((normalized, [key, fallback]) => {
    let value = input[key];
    if (value === undefined) value = fallback;
    if (!isValid(key, value, fallback, type)) {
      logger.warn(`${type}: invalid ${key} option; using default`);
      value = fallback;
    }
    normalized[key] = Array.isArray(value) ? [...value] : value;
    return normalized;
  }, {});
}

/** Read attributes individually: JSON is needed only for the color palette. */
export function parseOptions(element, type) {
  const raw = {};
  Object.entries({ ...COMMON, ...DEFAULTS[type] }).forEach(([key, fallback]) => {
    const attribute = `data-swy-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
    const value = element.getAttribute(attribute);
    if (value === null) return;
    if (key === 'palette') {
      try {
        raw[key] = JSON.parse(value);
      } catch (error) {
        raw[key] = null; // Normalization emits the same warning as the JS API.
      }
    } else if (typeof fallback === 'boolean') {
      raw[key] = value === 'true' || (value === 'false' ? false : value);
    } else if (typeof fallback === 'number') {
      raw[key] = value.trim() === '' ? NaN : Number(value);
    } else {
      raw[key] = value;
    }
  });
  return normalizeOptions(type, raw);
}

export function paletteColor(config, index) {
  const palette = config.palette || DEFAULT_PALETTE;
  return palette[index % palette.length];
}

export function applyAnimation(container, config) {
  if (!config.animate) container.classList.add('swy-no-animation');
}
