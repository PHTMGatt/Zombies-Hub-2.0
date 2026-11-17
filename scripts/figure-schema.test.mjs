import assert from 'node:assert/strict';
import test from 'node:test';
import { figureProblems } from '../shared/figure/figureSchema.js';

const good = {
  src: '/assets/bone-spawn-x1.webp',
  alt: 'Bone above the candle inside the spawn church',
  caption: 'Shoot it with a Pack-a-Punched bullet weapon',
  width: 1280,
  height: 720,
};

test('a complete figure has no problems', () => {
  assert.deepEqual(figureProblems(good), []);
  assert.deepEqual(figureProblems({
    ...good,
    srcSet: [{ src: '/a-640.webp', width: 640 }, { src: '/a-1280.webp', width: 1280 }],
    pins: [{ n: 1, x: 42.5, y: 30, label: 'Bone' }, { n: 2, x: 80, y: 75, label: 'Stand here' }],
    arrow: { from: [80, 75], to: [42.5, 30] },
    focus: '50% 30%',
  }), []);
});

test('missing or unusable basics are named, with where they are', () => {
  const at = (figure) => figureProblems(figure, 'rev/bones#spawn');
  assert.deepEqual(at({ ...good, src: '' }), ['rev/bones#spawn: no image (src)']);
  assert.deepEqual(at({ ...good, alt: '' }), ['rev/bones#spawn: no alt text']);
  assert.deepEqual(at({ ...good, alt: 'bone-spawn.webp' }), ['rev/bones#spawn: alt text "bone-spawn.webp" is a file name, describe the place instead']);
  assert.deepEqual(at({ ...good, alt: 'Bone' }), ['rev/bones#spawn: alt text "Bone" is too short to identify the place (8+ characters)']);
  assert.deepEqual(at({ ...good, caption: '  ' }), ['rev/bones#spawn: no caption']);
  assert.deepEqual(at({ ...good, width: undefined }), ['rev/bones#spawn: width and height are needed (no layout shift)']);
  assert.deepEqual(at({ ...good, height: 0 }), ['rev/bones#spawn: width and height are needed (no layout shift)']);
});

test('pins, arrows, srcSet and focus are checked', () => {
  const at = (extra) => figureProblems({ ...good, ...extra });
  assert.deepEqual(at({ pins: [{ n: 1, x: 120, y: 30, label: 'Bone' }] }), ['figure: pin 1 is outside the image (x 120, y 30; use 0–100 %)']);
  assert.deepEqual(at({ pins: [{ n: 1, x: 10, y: 10, label: '' }] }), ['figure: pin 1 has no label']);
  assert.deepEqual(at({ pins: [{ n: 1, x: 1, y: 1, label: 'A' }, { n: 1, x: 2, y: 2, label: 'B' }] }), ['figure: pin number 1 is used twice']);
  assert.deepEqual(at({ pins: [{ n: 2, x: 1, y: 1, label: 'A' }] }), ['figure: pins must be numbered 1, 2, 3… in order (got 2)']);
  assert.deepEqual(at({ arrow: { from: [10, 10], to: [10, 140] } }), ['figure: arrow point 10,140 is outside the image (use 0–100 %)']);
  assert.deepEqual(at({ srcSet: [{ src: '/b.webp', width: 1280 }, { src: '/a.webp', width: 640 }] }), ['figure: srcSet widths must go up (1280, 640)']);
  assert.deepEqual(at({ srcSet: [{ src: '/a.webp', width: 1600 }] }), ['figure: srcSet width 1600 is wider than the image (1280)']);
  assert.deepEqual(at({ focus: 'top-ish' }), ['figure: focus "top-ish" must be "x% y%"']);
});
