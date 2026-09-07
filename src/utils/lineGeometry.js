/** SVG commands for evenly spaced categorical points, in SVG coordinates. */
export default function linePath(points, curve = 'linear') {
  if (!points.length) return '';
  let path = `M ${points[0].x} ${points[0].y}`;
  if (curve !== 'smooth' || points.length < 3) {
    points.slice(1).forEach((point) => {
      path += curve === 'step' ? ` H ${point.x} V ${point.y}` : ` L ${point.x} ${point.y}`;
    });
    return path;
  }

  const slopes = points.slice(1).map((point, i) => (
    (point.y - points[i].y) / (point.x - points[i].x)
  ));
  // Harmonic tangents vanish at extrema and stay within the monotonicity bound.
  const tangents = points.map((point, i) => {
    if (i === 0) return slopes[0];
    if (i === points.length - 1) return slopes[i - 1];
    const before = slopes[i - 1];
    const after = slopes[i];
    return before * after <= 0 ? 0 : (2 * before * after) / (before + after);
  });
  points.slice(1).forEach((point, i) => {
    const previous = points[i];
    const third = (point.x - previous.x) / 3;
    path += ` C ${previous.x + third} ${previous.y + third * tangents[i]}`;
    path += ` ${point.x - third} ${point.y - third * tangents[i + 1]} ${point.x} ${point.y}`;
  });
  return path;
}
