/*
 * What the browser smokes rely on, by role and visible text, never by class name or DOM shape, so the tests keep
 * working whichever look a map ends up with (2026-11-16 quality reset). A redesign must keep these true:
 *   - each map guide has one <nav> named "<Map> guide navigation", its tabs are links in it, the current one
 *     carries aria-current="page" (NavLink does this);
 *   - each main-guide step is a heading named "Step N: <title>" inside <main> (FlatGuide's hidden "Step N: "
 *     prefix), and the step's element keeps id={step.id} for #step deep links.
 * Class names stay free for the designers.
 */
export const GUIDE_NAV = /guide navigation$/i;

export const guideNav = (page) => page.getByRole('navigation', { name: GUIDE_NAV });
export const guideTabs = (page) => guideNav(page).getByRole('link');
export const currentTab = (page) => guideNav(page).locator('a[aria-current="page"]');
export const mainSteps = (page) => page.getByRole('main').getByRole('heading', { name: /^Step \d+:/ });
// The flat main guide's list (the one holding the "Step N:" headings).
export const stepList = (page) => page.getByRole('main').getByRole('list').filter({ has: page.getByRole('heading', { name: /^Step 1:/ }) });

// Picker pages (video + choices). In any look the choices are buttons or radios inside a labelled group or list
// in <main>, the chosen one has aria-pressed or aria-checked, and the player says what plays in a role="status".
export const CHOSEN = '[aria-pressed="true"], [aria-checked="true"]';
export const clipOptions = (page) => page.getByRole('main').locator(':is([role="group"], [role="radiogroup"], ol, ul)[aria-label] :is(button, [role="radio"])');
export const chosenClip = (page) => clipOptions(page).and(page.locator(CHOSEN));
export const nowPlaying = (page) => page.getByRole('status').filter({ hasNotText: /^Loading your guide/ }).first();

// In the page: the guide nav's sideways-scrolling box (the nav itself or the nearest box around its links that
// clips or scrolls), how many tabs it holds, and which tabs sit left of where the row can scroll back to.
export function tabRowReach() {
  const nav = [...document.querySelectorAll('nav')].find((element) => /guide navigation$/i.test(element.getAttribute('aria-label') || ''));
  if (!nav) return { found: false, tabs: 0, unreachable: [] };
  const links = [...nav.querySelectorAll('a')];
  let row = links[0]?.parentElement ?? nav;
  while (row !== nav && getComputedStyle(row).overflowX === 'visible') row = row.parentElement;
  const saved = row.scrollLeft;
  row.scrollLeft = 0; // the furthest left the row can scroll
  const start = row.getBoundingClientRect().left;
  const name = (link) => link.textContent.trim() || link.getAttribute('aria-label') || link.querySelector('img')?.alt || '?';
  const unreachable = links.map((link) => ({ name: name(link), left: link.getBoundingClientRect().left - start }))
    .filter((tab) => tab.left < -1).map((tab) => `${tab.name} (${Math.round(tab.left)}px)`);
  row.scrollLeft = saved;
  return { found: true, tabs: links.length, unreachable };
}
