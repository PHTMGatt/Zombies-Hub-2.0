import './smoke-ready.mjs'; // first: waits for the app to render after each navigation
// Accessibility smoke (no extra dependencies): the checks a screen-reader or thumb user trips over first,
// on every critical and prerendered route, on a 390×844 phone.
// - <html lang>, at least one <h1>, no duplicate ids (aria references and #links break on them).
// - every <img> has an alt attribute (empty is fine for decoration).
// - every visible button, link, input, select and textarea has an accessible name.
// - tap targets: visible buttons, selects and navigation/tab links are at least 44px tall
//   (the project standard; inline links inside a sentence are exempt, as in WCAG 2.5.8).
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { criticalRoutePaths } from './critical-routes.mjs';
import { prerenderRoutes } from './prerender-meta.mjs';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const pages = [...new Set([...criticalRoutePaths, ...prerenderRoutes()])];
const MIN_TARGET = 44;

const audit = () => {
  const problems = [];
  const visible = (el) => {
    const box = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return box.width > 0 && box.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !el.closest('[hidden], [aria-hidden="true"], dialog:not([open])');
  };
  const name = (el) => {
    const labelledBy = el.getAttribute('aria-labelledby');
    const fromIds = labelledBy ? labelledBy.split(/\s+/).map((id) => document.getElementById(id)?.textContent ?? '').join(' ') : '';
    const labels = el.labels ? [...el.labels].map((label) => label.textContent).join(' ') : '';
    const imgAlt = [...el.querySelectorAll('img[alt], svg[aria-label]')].map((img) => img.getAttribute('alt') ?? img.getAttribute('aria-label')).join(' ');
    return [el.getAttribute('aria-label'), fromIds, labels, el.textContent, imgAlt, el.getAttribute('title'), el.getAttribute('placeholder'), el.value && el.type === 'submit' ? el.value : '']
      .filter(Boolean).join(' ').trim();
  };
  const describe = (el) => `<${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${el.className && typeof el.className === 'string' ? `.${el.className.trim().split(/\s+/).join('.')}` : ''}> "${(el.textContent || '').trim().slice(0, 40)}"`;

  if (!document.documentElement.getAttribute('lang')) problems.push('<html> has no lang');
  if (!document.querySelector('h1')) problems.push('no <h1>');
  const ids = new Map();
  for (const el of document.querySelectorAll('[id]')) ids.set(el.id, (ids.get(el.id) ?? 0) + 1);
  for (const [id, count] of ids) if (count > 1) problems.push(`id "${id}" is used ${count} times`);
  for (const img of document.querySelectorAll('img:not([alt])')) problems.push(`img without alt: ${img.getAttribute('src')?.split('/').pop()}`);

  const controls = [...document.querySelectorAll('button, a[href], input:not([type="hidden"]), select, textarea, [role="button"], [role="tab"]')].filter(visible);
  for (const el of controls) {
    if (!name(el)) problems.push(`no accessible name: ${describe(el)}`);
    const inSentence = el.tagName === 'A' && el.closest('p, li, dd, td, figcaption') && !el.closest('nav, [role="tablist"], [role="navigation"]');
    const isNavLink = el.tagName === 'A' && el.closest('nav, [role="tablist"], [role="navigation"]');
    const mustBeTall = ['BUTTON', 'SELECT'].includes(el.tagName) || el.getAttribute('role') === 'tab' || isNavLink;
    if (mustBeTall && !inSentence && el.getBoundingClientRect().height < 44 - 0.5) {
      problems.push(`tap target ${Math.round(el.getBoundingClientRect().height)}px tall: ${describe(el)}`);
    }
  }
  return problems;
};

const browser = await chromium.launch({ headless: true });
const problems = [];
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  for (const route of pages) {
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => !document.querySelector('.zh-status-page[role="status"]'), null, { timeout: 10000 }).catch(() => {});
    for (const problem of await page.evaluate(audit)) problems.push(`${route}: ${problem}`);
  }
  await context.close();
} finally {
  await browser.close();
}

if (process.env.A11Y_REPORT) console.log(problems.join('\n'));
assert.deepEqual(problems, [], `accessibility problems (${problems.length}):\n${problems.slice(0, 60).join('\n')}`);
console.log(`a11y: ${pages.length} routes at 390×844: lang, h1, unique ids, alt text, names and ${MIN_TARGET}px tap targets`);
