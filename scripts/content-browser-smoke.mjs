/*
 * Every piece of text a page showed before the guide redesign must still be on that page, unless it is
 * listed in scripts/fixtures/approved-removals.json (layer "rendered") with a reason and spec section.
 * Pieces are matched against the page's whole visible text, so restyling or regrouping never fails it;
 * only text that disappeared does. Text that moved to another page of the same map (a flat main guide's
 * detail moving to its Step details tab, /maps/<map>/step-details) still counts as kept.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { criticalRoutes } from './critical-routes.mjs';
import { REMOVALS_PATH } from './guide-content.mjs';
import { captureSegments, newContentContext, renderedPath } from './content-snapshot.mjs';

const approved = JSON.parse(readFileSync(REMOVALS_PATH, 'utf8')).filter((entry) => entry.layer === 'rendered');
const transient = new Set(['Player unavailable here — use YouTube.']);
const isApproved = (text, route) => approved.some((entry) => {
  if (entry.routes && !entry.routes.includes(route)) return false;
  return entry.pattern ? new RegExp(entry.pattern).test(text) : entry.text === text;
});

const browser = await chromium.launch({ headless: true });
const results = [];
try {
  const context = await newContentContext(browser);
  const page = await context.newPage();
  const pages = criticalRoutes.filter(([name]) => existsSync(renderedPath(name)));
  // Every critical page is read, baseline or not: a new Step details tab has no baseline of its own.
  const shown = new Map();
  for (const [, route] of criticalRoutes) shown.set(route, (await captureSegments(page, route)).join(' \n '));
  const mapOf = (route) => route.match(/^\/maps\/[^/]+/)?.[0];
  for (const [name, route] of pages) {
    const { segments } = JSON.parse(readFileSync(renderedPath(name), 'utf8'));
    const sameMap = [...shown].filter(([other]) => other !== route && mapOf(route) && mapOf(other) === mapOf(route));
    const missing = segments.filter((text) => !transient.has(text) && !shown.get(route).includes(text) && !isApproved(text, route));
    const moved = missing.filter((text) => sameMap.some(([, otherText]) => otherText.includes(text)));
    const lost = missing.filter((text) => !moved.includes(text));
    assert.deepEqual(lost, [], `${route} lost text that it showed before the redesign`);
    results.push(`${route} (${segments.length} pieces${moved.length ? `, ${moved.length} moved to another page of this map` : ''})`);
  }
} finally {
  await browser.close();
}
console.log(`${results.length}/${results.length} pages keep all their baseline text.`);
results.forEach((line) => console.log(`- ${line}`));
