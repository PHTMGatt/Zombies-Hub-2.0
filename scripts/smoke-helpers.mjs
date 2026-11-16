// Shared readiness waits for the browser smokes: wait for the page to be done, never for a fixed time.

// Web fonts loaded and two frames painted: late font swaps and the guide's fonts-ready deep-link landing
// (shared/guide/GuideSteps.jsx) have run, so positions read now are final.
export const settled = (page) => page.evaluate(() => document.fonts.ready
  .then(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))));
