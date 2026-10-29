import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

test('Zetsubou makes the every-player Trial requirement explicit wherever the cog setup is explained', () => {
  const sources = [
    read('maps/zetsubou-no-shima/src/data/zetsRun.js'),
    read('maps/zetsubou-no-shima/src/data/zetsGear.js'),
    read('maps/zetsubou-no-shima/src/pages/MainGuide.jsx'),
    read('maps/zetsubou-no-shima/src/pages/Prerequisites.jsx'),
    read('maps/zetsubou-no-shima/src/pages/Cogs.jsx'),
    read('maps/zetsubou-no-shima/src/components/CogSteps/CogThree.jsx'),
  ];

  for (const source of sources) {
    assert.match(source, /(every|each) player/i);
    assert.match(source, /(all three|three).*Trial/i);
  }
});

test('Zetsubou AA-shell cog explains Blue Water plus one KT-4/Masamune shot per round for three rounds', () => {
  const sources = [
    read('maps/zetsubou-no-shima/src/data/zetsRun.js'),
    read('maps/zetsubou-no-shima/src/components/CogSteps/CogTwo.jsx'),
  ];

  for (const source of sources) {
    assert.match(source, /Blue Water/i);
    assert.match(source, /KT-4|Masamune/i);
    assert.match(source, /(once|one).*each round|each round.*(once|one)/i);
    assert.match(source, /three rounds/i);
  }
});

test('Zetsubou Masamune guide uses the giant-spider fang terminology instead of pincer', () => {
  const sources = [
    read('maps/zetsubou-no-shima/src/data/zetsRun.js'),
    read('maps/zetsubou-no-shima/src/data/zetsGear.js'),
  ];

  for (const source of sources) {
    assert.match(source, /fang/i);
    assert.doesNotMatch(source, /pincer/i);
  }
});
