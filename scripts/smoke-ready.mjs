/*
 * Imported first by every browser smoke: after page.goto / reload / goBack / goForward / waitForURL, wait until
 * the app has rendered the route, not just until the network is idle.
 *
 * On a slow machine (CI runner, throttled CPU) "networkidle" can fire while React is still turning the lazy route
 * chunk into DOM, so a check that reads the page at once finds nothing. The app is ready when its main area holds
 * content and the route's "Loading your guide…" fallback (App.jsx RouteLoading) is gone. Pages that are not the
 * app (a browser error page while offline, about:blank) count as ready. Waiting never fails a smoke on its own:
 * after 30s the smoke's own assertion reports what is wrong.
 */
import { chromium } from 'playwright';

export const READY_TIMEOUT = 30_000;

export function appReady() {
  if (!document.getElementById('root')) return true; // not the app
  const main = document.getElementById('zh-main');
  if (!main) return false; // React has not mounted yet
  const host = main.firstElementChild;
  if (!host || !host.firstElementChild) return false;
  return !host.querySelector(':scope > .zh-status-page[role="status"]'); // the route's loading fallback
}

export const waitForApp = (page) => page.waitForFunction(appReady, null, { timeout: READY_TIMEOUT }).catch(() => {});

function readyPage(page) {
  if (page.__zhReady) return page;
  page.__zhReady = true;
  for (const method of ['goto', 'reload', 'goBack', 'goForward', 'waitForURL']) {
    const original = page[method].bind(page);
    page[method] = async (...args) => {
      const result = await original(...args);
      await waitForApp(page);
      return result;
    };
  }
  return page;
}

function readyContext(context) {
  if (context.__zhReady) return context;
  context.__zhReady = true;
  const newPage = context.newPage.bind(context);
  context.newPage = async (...args) => readyPage(await newPage(...args));
  return context;
}

if (!chromium.__zhReady) {
  chromium.__zhReady = true;
  const launch = chromium.launch.bind(chromium);
  chromium.launch = async (...args) => {
    const browser = await launch(...args);
    const newContext = browser.newContext.bind(browser);
    browser.newContext = async (...contextArgs) => readyContext(await newContext(...contextArgs));
    const newPage = browser.newPage.bind(browser);
    browser.newPage = async (...pageArgs) => readyPage(await newPage(...pageArgs));
    return browser;
  };
}
