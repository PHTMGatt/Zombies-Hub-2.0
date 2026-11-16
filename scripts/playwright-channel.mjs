// Preload for the browser smokes: ZH_BROWSER_CHANNEL=chrome (or msedge) runs them on an installed browser
// instead of Playwright's own Chromium (useful on a PC whose Playwright browser cache is incomplete).
// Usage: node --import ./scripts/playwright-channel.mjs scripts/browser-smoke.mjs
import { chromium } from 'playwright';

const channel = process.env.ZH_BROWSER_CHANNEL;
if (channel) {
  const launch = chromium.launch.bind(chromium);
  chromium.launch = (options = {}) => launch({ channel, ...options });
}
