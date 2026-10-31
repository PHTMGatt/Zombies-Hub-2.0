/*
 * Every piece of text a page showed before the guide redesign must still be on that page, unless it is
 * listed in scripts/fixtures/approved-removals.json (layer "rendered") with a reason and spec section.
 * Pieces are matched against the page's whole visible text, so restyling or regrouping never fails it;
 * only text that disappeared does.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { criticalRoutes } from './critical-routes.mjs';
import { REMOVALS_PATH } from './guide-content.mjs';
import { captureSegments, newContentContext, renderedPath } from './content-snapshot.mjs';

const approved = JSON.parse(readFileSync(REMOVALS_PATH, 'utf8')).filter((entry) => entry.layer === 'rendered');
const isApproved = (text, route) => approved.some((entry) => {
  if (entry.routes && !entry.routes.includes(route)) return false;
  return entry.pattern ? new RegExp(entry.pattern).test(text) : entry.text === text;
});

const browser = await chromium.launch({ headless: true });
const results = [];
try {
  const context = await newContentContext(browser);
  const page = await context.newPage();
  for (const [name, route] of criticalRoutes) {
    if (!existsSync(renderedPath(name))) continue;
    const { segments } = JSON.parse(readFileSync(renderedPath(name), 'utf8'));
    const now = (await captureSegments(page, route)).join(' \n ');
    const missing = segments.filter((text) => !now.includes(text) && !isApproved(text, route));
    assert.deepEqual(missing, [], `${route} lost text that it showed before the redesign`);
    results.push(`${route} (${segments.length} pieces)`);
  }
} finally {
  await browser.close();
}
console.log(`${results.length}/${results.length} pages keep all their baseline text.`);
results.forEach((line) => console.log(`- ${line}`));
