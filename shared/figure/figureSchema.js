/*
 * What a guide figure needs before it can ship, as plain-language problems (an empty list means fine).
 * Used by GuideFigure in development and by scripts/data-check.mjs at build time, so a missing picture, alt
 * text, caption or size fails the build with the figure's name instead of shipping a broken spot.
 *
 * A figure: { src, alt, caption, width, height, srcSet?: [{ src, width }], focus?: 'x% y%',
 *             pins?: [{ n, x, y, label }], arrow?: { from: [x, y], to: [x, y] } }   (x, y in % of the image)
 */
const inside = (value) => typeof value === 'number' && value >= 0 && value <= 100;
const FILE_NAME = /^[\w.-]+\.(webp|png|jpe?g|avif|gif)$/i;

export function figureProblems(figure, where = 'figure') {
  const problems = [];
  const say = (text) => problems.push(`${where}: ${text}`);
  const alt = (figure.alt ?? '').trim();

  if (!figure.src) say('no image (src)');
  if (!alt) say('no alt text');
  else if (FILE_NAME.test(alt)) say(`alt text "${alt}" is a file name, describe the place instead`);
  else if (alt.length < 8) say(`alt text "${alt}" is too short to identify the place (8+ characters)`);
  if (!(figure.caption ?? '').trim()) say('no caption');
  if (!(figure.width > 0 && figure.height > 0)) say('width and height are needed (no layout shift)');

  const pins = figure.pins ?? [];
  const numbers = new Set();
  pins.forEach((pin, i) => {
    if (numbers.has(pin.n)) say(`pin number ${pin.n} is used twice`);
    else if (pin.n !== i + 1) say(`pins must be numbered 1, 2, 3… in order (got ${pin.n})`);
    numbers.add(pin.n);
    if (!inside(pin.x) || !inside(pin.y)) say(`pin ${pin.n} is outside the image (x ${pin.x}, y ${pin.y}; use 0–100 %)`);
    if (!(pin.label ?? '').trim()) say(`pin ${pin.n} has no label`);
  });

  if (figure.arrow) {
    for (const point of [figure.arrow.from, figure.arrow.to]) {
      if (!Array.isArray(point) || !inside(point[0]) || !inside(point[1])) say(`arrow point ${point} is outside the image (use 0–100 %)`);
    }
  }

  if (figure.srcSet) {
    const widths = figure.srcSet.map((entry) => entry.width);
    if (widths.some((w, i) => i > 0 && w <= widths[i - 1])) say(`srcSet widths must go up (${widths.join(', ')})`);
    const widest = Math.max(...widths);
    if (figure.width && widest > figure.width) say(`srcSet width ${widest} is wider than the image (${figure.width})`);
  }

  if (figure.focus != null && !/^\d{1,3}(\.\d+)?% \d{1,3}(\.\d+)?%$/.test(figure.focus)) say(`focus "${figure.focus}" must be "x% y%"`);
  return problems;
}
