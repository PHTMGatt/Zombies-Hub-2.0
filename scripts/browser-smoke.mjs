import { chromium } from 'playwright';
import { settled, stepDetails } from './smoke-helpers.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const artifactsDir = new URL('../artifacts/', import.meta.url);
const out = new URL('../artifacts/browser-smoke.json', import.meta.url);
import { VIEWPORTS } from './smoke-viewports.mjs';
const routes = [
  '/',
  '/allmaps',
  '/easter-eggs',
  '/side-easter-eggs',
  '/maps/origins',
  '/maps/mob-of-the-dead',
  '/maps/shadows-of-evil',
  '/maps/der-eisendrache',
  '/maps/zetsubou-no-shima',
  '/maps/gorod-krovi',
  '/maps/revelations',
];
const results = [];

const assertNoHorizontalOverflow = async (page, route) => {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  assert(
    dimensions.scrollWidth <= dimensions.clientWidth + 1,
    `${route} overflows horizontally: ${dimensions.scrollWidth}px > ${dimensions.clientWidth}px`,
  );
};

const assertImagesLoaded = async (page, route, selector) => {
  // Lazy images, and the closed full-screen copies that only load when opened, are told to load now:
  // this looks for broken images, not ones that are simply off screen.
  const brokenImages = await page.locator(selector).evaluateAll(async images => {
    await Promise.all(images.map(image => { image.loading = 'eager'; return image.decode().catch(() => {}); }));
    return images
      .filter(image => !image.complete || image.naturalWidth === 0)
      .map(image => image.getAttribute('alt') || image.getAttribute('src') || 'unnamed image');
  });
  assert.deepEqual(brokenImages, [], `${route} has broken images: ${brokenImages.join(', ')}`);
};

await fs.mkdir(artifactsDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const { name: viewportName, width, height } of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    for (const route of routes) {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      assert(response?.ok(), `${route} returned ${response?.status()}`);
      assert.equal(errors.length, 0, `${route} page errors: ${errors.join('; ')}`);
      // The head follows the route: one description, OG copies of title and description, a canonical URL.
      const head = await page.evaluate(() => ({
        title: document.title,
        descriptions: [...document.querySelectorAll('meta[name="description"]')].map((meta) => meta.content),
        ogTitle: document.querySelector('meta[property="og:title"]')?.content,
        ogDescription: document.querySelector('meta[property="og:description"]')?.content,
        canonical: document.querySelector('link[rel="canonical"]')?.href,
      }));
      assert.equal(head.descriptions.length, 1, `${route} has exactly one meta description`);
      assert.equal(head.ogTitle, head.title, `${route} og:title matches the page title`);
      assert.equal(head.ogDescription, head.descriptions[0], `${route} og:description matches the description`);
      assert.equal(head.canonical, new URL(route, base).href, `${route} canonical is its own URL`);
      if (route.startsWith('/maps/')) {
        // Short guides must still pin the map footer to the bottom edge, with no dead band beneath it.
        const gapBelowFooter = await page.evaluate(() => {
          const footer = document.querySelector('.map-module footer');
          if (!footer) return null;
          return Math.round(document.documentElement.scrollHeight - (footer.getBoundingClientRect().bottom + window.scrollY));
        });
        assert(gapBelowFooter !== null, `${route} renders no map footer`);
        assert(gapBelowFooter <= 1, `${route} leaves ${gapBelowFooter}px of dead space below the map footer`);
        // Pinned map headers must not swallow a phone screen.
        const pinnedHeader = await page.evaluate(() => {
          const header = document.querySelector('.map-module header');
          if (!header || !['sticky', 'fixed'].includes(getComputedStyle(header).position)) return 0;
          return header.offsetHeight;
        });
        assert(pinnedHeader <= { phone: 130, landscape: 0, desktop: 110 }[viewportName], `${route} pins a ${pinnedHeader}px map header at ${width}px`);
      }
      results.push({ width, route, passed: true });
    }

    // Card art loads as cards near the screen, not all 30 covers up front; every card's art still loads.
    await page.goto(`${base}/allmaps`, { waitUntil: 'networkidle' });
    const cardArt = () => page.locator('.map-card .bg-main').evaluateAll((layers) => layers.map((layer) => layer.style.backgroundImage));
    let art = await cardArt();
    assert(art[0].startsWith('url('), 'the first map card shows its art');
    assert.equal(art.at(-1), '', 'the last map card waits to load its art');
    for (const card of await page.locator('.map-card').all()) await card.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('.map-card .bg-main')].every((layer) => layer.style.backgroundImage.startsWith('url(')),
      null, { timeout: 5000 }).catch(() => {});
    art = await cardArt();
    const missingArt = art.filter((value) => !value.startsWith('url(')).length;
    assert.equal(missingArt, 0, `${missingArt} map cards never loaded their art`);
    const brokenArt = await page.evaluate(async (urls) => (await Promise.all(urls.map((url) => new Promise((done) => {
      const image = new Image();
      image.onload = () => done(null);
      image.onerror = () => done(url);
      image.src = url;
    })))).filter(Boolean), [...new Set(art.map((value) => value.slice(5, -2)))]);
    assert.deepEqual(brokenArt, [], `map card art fails to load: ${brokenArt.join(', ')}`);

    await page.goto(`${base}/allmaps`);
    await page.getByRole('searchbox').fill('Origins');
    assert((await page.locator('.map-card').count()) > 0);
    assert((await page.locator('.map-card').allTextContents()).every(text => text.includes('Origins')));
    await page.getByRole('searchbox').fill('no-map-can-match-this');
    await page.getByText(/No maps matched/).waitFor();

    // Show filter: All / Easter Eggs / Full guides. It filters the cards, lives in the link (?show=), is
    // remembered on this device, works with arrow keys, and every option is a 44px target.
    await page.goto(`${base}/allmaps`, { waitUntil: 'networkidle' });
    assert.equal(await page.getByRole('group', { name: 'Show' }).count(), 1, 'the Show options are one named group');
    const cards = page.locator('.map-card');
    const allCount = await cards.count();
    const optionHeights = await page.locator('.map-filter__option').evaluateAll((options) => options.map((option) => option.getBoundingClientRect().height));
    assert(optionHeights.length === 3 && optionHeights.every((h) => h >= 44), `Show options are 44px targets: ${optionHeights.join(', ')}`);
    // The radios follow the URL, and React Router applies ?show= as a transition: on a slow machine (CI) the
    // new choice is checked, and the cards filtered, a moment after the click or key press. So wait for the
    // checked radio (same render as the cards) instead of reading it at once; Playwright's check() would
    // also throw on the brief flip back.
    const showIs = (value, message) => page.waitForFunction((id) => document.querySelector(`.map-filter input[value="${id}"]`)?.checked, value, { timeout: 5000 })
      .catch(() => assert.fail(message ?? `Show: ${value} is chosen`));
    const choose = async (name, value) => { await page.getByRole('radio', { name }).click(); await showIs(value); };
    await choose(/Full guides/, 'full-guides');
    await page.waitForURL(/[?&]show=full-guides/);
    assert.equal(await cards.count(), 8, 'Full guides: the seven full guides (Origins is listed for BO2 and BO3)');
    assert((await cards.allTextContents()).every((text) => !/Nacht|Five|TranZit/i.test(text)), 'Full guides hides maps without one');
    await page.reload({ waitUntil: 'networkidle' });
    await showIs('full-guides', 'the link keeps the choice');
    await page.goto(`${base}/allmaps`, { waitUntil: 'networkidle' });
    await page.waitForURL(/[?&]show=full-guides/);
    await showIs('full-guides', 'the choice is remembered on this device');
    await page.getByRole('radio', { name: /Full guides/ }).focus();
    await page.keyboard.press('ArrowLeft');
    await showIs('easter-eggs', 'arrow keys move the choice');
    await page.waitForURL(/[?&]show=easter-eggs/);
    const eggCount = await cards.count();
    assert(eggCount > 8 && eggCount < allCount, `Easter Eggs shows the quest maps (${eggCount} of ${allCount})`);
    await choose(/All maps/, 'all');
    await page.waitForURL((url) => !url.searchParams.has('show'));
    assert.equal(await cards.count(), allCount, 'All maps brings every card back');
    assert.equal(await page.evaluate(() => localStorage.getItem('zh-map-filter:allmaps')), null, 'All is the default, nothing stored');
    await page.goto(`${base}/allmaps?show=not-a-filter`, { waitUntil: 'networkidle' });
    await page.waitForURL((url) => !url.searchParams.has('show'));
    await showIs('all', 'an unknown ?show= falls back to All');
    await page.goto(`${base}/easter-eggs?show=video-guides`, { waitUntil: 'networkidle' });
    await showIs('video-guides');
    const badges = await page.locator('.map-card .map-ee-chip').allTextContents();
    assert(badges.length > 0 && badges.every((badge) => badge === 'Video guide'), `Video guides shows only video-guide cards: ${[...new Set(badges)].join(', ')}`);
    await choose(/Full guides/, 'full-guides');
    await page.waitForURL(/[?&]show=full-guides/);
    const fullBadges = await page.locator('.map-card .map-ee-chip').allTextContents();
    assert(fullBadges.every((badge) => /Full guide|Complete/.test(badge)), `Full guides shows only full-guide cards: ${[...new Set(fullBadges)].join(', ')}`);
    await page.evaluate(() => localStorage.removeItem('zh-map-filter:easter-eggs'));

    // Side Easter Eggs is a visually sensitive hub page. Protect its card count,
    // responsive grid, navigation, overflow, and capture both target viewports.
    await page.goto(`${base}/side-easter-eggs`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Side Easter Eggs' }).waitFor();
    const sideCards = page.locator('.side-ee-card');
    assert.equal(await sideCards.count(), 5, 'Side Easter Eggs keeps all five guide cards');
    const sideArtworkRatios = await sideCards.evaluateAll(cards => Promise.all(cards.map(async card => {
      const image = card.querySelector('.side-ee-card__art');
      if (!image?.currentSrc) throw new Error('Side Easter Egg card has no rendered artwork source');
      await image.decode();
      return image.naturalWidth / image.naturalHeight;
    })));
    assert(
      sideArtworkRatios.every(ratio => ratio >= 1.6 && ratio <= 1.9),
      `Side Easter Egg cards use clean widescreen artwork instead of catalog strips: ${sideArtworkRatios.join(', ')}`,
    );
    // Count cards in the first visual row (the grid uses extra tracks to center a short last row).
    // offsetTop ignores the hover lift, so a pointer left over a card cannot skew the row count.
    const sideColumns = await sideCards.evaluateAll(cards => {
      const firstTop = cards[0].offsetTop;
      return cards.filter(card => card.offsetTop === firstTop).length;
    });
    assert.equal(sideColumns, { phone: 1, landscape: 3, desktop: 3 }[viewportName], `Side Easter Eggs uses the expected ${width}px grid (got ${sideColumns})`);
    await assertNoHorizontalOverflow(page, '/side-easter-eggs');
    await page.screenshot({
      path: fileURLToPath(new URL(`../artifacts/side-easter-eggs-${width}.png`, import.meta.url)),
      fullPage: true,
    });
    const firstSideTarget = await sideCards.first().getAttribute('href');
    assert(firstSideTarget, 'Side Easter Egg card has a destination');
    await sideCards.first().click();
    await page.waitForLoadState('networkidle');
    assert.equal(new URL(page.url()).pathname, firstSideTarget, 'Side Easter Egg card reaches its intended route');
    await page.waitForFunction(() => document.activeElement?.id === 'zh-main');
    assert.equal(
      await page.evaluate(() => document.activeElement?.id),
      'zh-main',
      'client-side route navigation moves focus to the new guide landmark',
    );
    await page.getByRole('link', { name: /Back to Side Easter Eggs/i }).click();
    await page.waitForLoadState('networkidle');
    assert.equal(new URL(page.url()).pathname, '/side-easter-eggs', 'Side Easter Egg detail returns to the list');

    // Origins is a core guide and should retain working map-specific navigation.
    await page.goto(`${base}/maps/origins`, { waitUntil: 'networkidle' });
    const originsLinks = page.locator('a[href^="/maps/origins/"]');
    assert((await originsLinks.count()) > 0, 'Origins exposes at least one guide navigation link');
    const originsTarget = await originsLinks.first().getAttribute('href');
    assert(originsTarget, 'Origins guide link has a destination');
    await originsLinks.first().click();
    await page.waitForLoadState('networkidle');
    assert.equal(new URL(page.url()).pathname, originsTarget, 'Origins guide navigation reaches its intended route');

    // OG is a separate, historical read-only route; the new UI guide stays at the canonical address.
    await page.goto(`${base}/maps/origins/og`, { waitUntil: 'networkidle' });
    assert(await page.locator('.origins-og .guide-grid').isVisible(), 'OG restores its original two-column guide structure');
    assert.match(await page.locator('.origins-og').innerText(), /Rain Fire/, 'OG preserves named historical steps');

    // Origins guide: one sequence. Each step's answer is on the page; its how-to sits under "More on this step".
    await page.goto(`${base}/maps/origins`, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    // The flat guide's titles start with a screen-reader-only "Step N:".
    const stepTitle = async (id) => (await page.locator(`#${id} :is(h2, h3)`).innerText()).replace(/^Step \d+:\s*/, '');
    assert.equal(await stepTitle('secure-keys'), 'Ascend from Darkness');
    assert.equal(await stepTitle('thunder-fists'), 'Thunder Fists');
    // The staff placement answer is one tap away, on the Step details tab (flat main guide).
    assert.match(await (await stepDetails(page, base, '/maps/origins', 'secure-keys')).innerText(), /Odin · middle robot/, 'Staff placement answer is on Step details');
    assert(await page.locator('section.step-details__step[data-step="secure-keys"] .step-details__how').isVisible(), 'Step details shows the how-to');
    // Speed Run is always open: the last Origins nav item, reachable with empty storage, no lock copy anywhere.
    await page.evaluate(() => window.localStorage.clear());
    await page.goto(`${base}/maps/origins`, { waitUntil: 'networkidle' });
    const navLinks = page.locator('.origins-nav-link');
    const lastNav = navLinks.last();
    assert.equal((await lastNav.innerText()).trim(), 'Speed Run', 'Speed Run is the last Origins nav item');
    await lastNav.scrollIntoViewIfNeeded();
    const navBox = await lastNav.boundingBox();
    assert(navBox && navBox.x >= 0 && navBox.x + navBox.width <= width + 1, 'Speed Run nav item can sit fully inside the viewport');
    await assertNoHorizontalOverflow(page, '/maps/origins (nav scrolled)');
    await page.goto(`${base}/side-easter-eggs/origins-speedrun`, { waitUntil: 'networkidle' });
    assert.equal(new URL(page.url()).pathname, '/maps/origins/speed-run', 'Old Origins Speed Run address redirects into the Origins guide');
    await page.getByRole('heading', { name: 'Origins Speed Run', level: 2 }).waitFor();
    assert.equal(await page.locator('.speedrun-gate').count(), 0, 'no Speed Run lock screen');
    assert.doesNotMatch(await page.locator('main').innerText(), /to unlock Speedrun/i);

    // The Electrical Panel is a hidden achievement only, now inside the switches panel: solving every
    // switch in Practice turns records "Electrical Panel Solved" and links to Speed Run.
    // A finished run of the old tracker set the same legacy flag; that must not mark the panel solved.
    await page.evaluate(() => localStorage.setItem('zh-origins-speedrun-unlocked', 'true'));
    await page.goto(`${base}/maps/origins/lightning-staff`, { waitUntil: 'networkidle' });
    const board = page.locator('#switches');
    await board.getByRole('button', { name: 'Practice turns' }).click();
    assert.doesNotMatch(await board.locator('.switch-board__count').innerText(), /Electrical Panel solved/, 'the old tracker unlock does not mark the panel solved');
    const achievementsNow = () => page.evaluate(() => JSON.parse(localStorage.getItem('zh-achievements') || '{}').unlocked ?? {});
    assert(!(await achievementsNow())['origins/speedrun-unlocked'], 'the legacy flag records no achievement');
    await page.evaluate(() => localStorage.removeItem('zh-origins-speedrun-unlocked'));
    await board.getByRole('button', { name: 'Sound on' }).click();
    const switchCards = board.locator('.switch-card button');
    assert.equal(await switchCards.count(), 7, 'the panel is playable: seven switches');
    for (let index = 0; index < 7; index += 1) {
      for (let turn = 0; turn < 4 && !/Set/.test(await switchCards.nth(index).innerText()); turn += 1) await switchCards.nth(index).click();
      assert.match(await switchCards.nth(index).innerText(), /Set/, `switch ${index + 1} can be set`);
    }
    assert.match(await board.locator('.switch-board__count').innerText(), /Electrical Panel solved/);
    const lightningText = await page.locator('main').innerText();
    assert.doesNotMatch(lightningText, /Speedrun mode/i, 'no Speedrun-mode copy on the Lightning page');
    assert.doesNotMatch(lightningText, /unlock/i, 'nothing on the Lightning page claims to unlock');
    assert((await achievementsNow())['origins/speedrun-unlocked'], 'panel solve records the hidden achievement');
    await page.getByRole('link', { name: 'Open Speed Run' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Next checkpoint' }).click();
    assert.match(await page.locator('.speedrun-panel h3').innerText(), /Ice \+ Wind Staff/);
    await page.goto(`${base}/maps/origins/speed-run/lightning`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.switch-card .switch-dial').count(), 7, 'Speed Run shows all seven Lightning switch dials');
    await page.getByRole('button', { name: 'Practice turns' }).click();
    await page.getByRole('button', { name: 'Sound on' }).click();
    const churchUpper = page.locator('.switch-card').getByRole('button', { name: /^Church Upper:/ });
    await churchUpper.click();
    assert.match(await churchUpper.innerText(), /Set/, 'One turn sets Church Upper (needs ×1)');
    await assertNoHorizontalOverflow(page, '/maps/origins/speed-run/lightning');
    await page.evaluate(() => window.localStorage.clear());

    // The sticky Origins header must stay compact on phones, with an unclipped title and the active staff in view.
    await page.goto(`${base}/maps/origins/lightning-staff`, { waitUntil: 'networkidle' });
    const originsHeader = await page.evaluate(() => {
      const active = document.querySelector('.origins-nav-link.active').getBoundingClientRect();
      const title = document.querySelector('.origins-map-header .header-title').getBoundingClientRect();
      return {
        height: document.querySelector('.origins-map-header').offsetHeight,
        activeInView: active.left >= 0 && active.right <= window.innerWidth,
        titleInView: title.left >= 0 && title.right <= window.innerWidth,
      };
    });
    assert(originsHeader.height <= { phone: 130, landscape: 130, desktop: 100 }[viewportName], `Origins sticky header is ${originsHeader.height}px tall at ${width}px`);
    assert(originsHeader.activeInView, 'Origins keeps the active staff tab in view');
    assert(originsHeader.titleInView, 'Origins header title is not clipped');

    // Origins guide health must cover the actual staff pages, not only the shell.
    await page.goto(`${base}/maps/origins`, { waitUntil: 'networkidle' });
    const originsAudio = page.locator('.audio-players audio');
    assert.equal(await originsAudio.count(), 2, 'Origins main guide keeps both audio controls');
    assert(
      await originsAudio.evaluateAll(players => players.every(player => (player.getAttribute('aria-label') || '').trim().length > 0)),
      'Origins audio controls expose accessible names',
    );
    await assertImagesLoaded(page, '/maps/origins', '.origins-route-content img');
    await assertNoHorizontalOverflow(page, '/maps/origins');

    const originsStaffGuides = [
      {
        route: '/maps/origins/fire-staff',
        heading: 'Fire Staff',
        required: [/Generator 6/i, /glowing plane/i, /torch/i],
      },
      {
        route: '/maps/origins/ice-staff',
        heading: 'Ice Staff',
        required: [/(Tank Station|Generator 2)/i, /gravestone/i],
      },
      {
        route: '/maps/origins/wind-staff',
        heading: 'Wind Staff',
        required: [/Wind Tunnel/i, /Generator 4/i, /smoking stone balls/i],
      },
      {
        route: '/maps/origins/lightning-staff',
        heading: 'Lightning Staff',
        required: [/Purple Record/i, /Lightning Tunnel/i, /Generator 5/i],
      },
    ];

    for (const guide of originsStaffGuides) {
      await page.goto(`${base}${guide.route}`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: guide.heading, exact: true, level: 2 }).waitFor();
      const guideText = await page.locator('.origins-route-content').innerText();
      for (const requiredText of guide.required) {
        assert.match(guideText, requiredText, `${guide.route} is missing ${requiredText}`);
      }
      await assertImagesLoaded(page, guide.route, '.origins-route-content img');
      await assertNoHorizontalOverflow(page, guide.route);
    }

    // Mob of the Dead should retain its own guide navigation rather than
    // silently regressing while other map-specific shells evolve.
    await page.goto(`${base}/maps/mob-of-the-dead`, { waitUntil: 'networkidle' });
    const mobLinks = page.locator('a[href^="/maps/mob-of-the-dead/"]');
    assert((await mobLinks.count()) > 0, 'Mob of the Dead exposes at least one guide navigation link');
    const mobTarget = await mobLinks.first().getAttribute('href');
    assert(mobTarget, 'Mob of the Dead guide link has a destination');
    await mobLinks.first().click();
    await page.waitForLoadState('networkidle');
    assert.equal(new URL(page.url()).pathname, mobTarget, 'Mob of the Dead guide navigation reaches its intended route');

    await page.goto(`${base}/maps/revelations/apothicon-upgrade`);
    await page.locator('.rev-option').nth(1).click();
    const fallback = page.getByRole('link', { name: 'Watch the selected timestamp on YouTube' });
    assert.match(await fallback.getAttribute('href'), /&t=[1-9]\d*s$/);

    // Gorod's valve solver is a gameplay-critical interactive tool. Keep its
    // randomized-puzzle flow covered at both mobile and desktop widths.
    await page.goto(`${base}/maps/gorod-krovi/valves`, { waitUntil: 'networkidle' });
    const selects = page.locator('.gorod-valve-fields select');
    await selects.first().waitFor();
    assert.equal(await selects.count(), 2, 'valve solver exposes both required inputs');
    await selects.nth(0).selectOption({ label: 'Armory' });
    await selects.nth(1).selectOption({ label: 'Department Store' });
    const solution = page.locator('.gorod-valve-solution');
    await solution.waitFor();
    assert.match(await solution.textContent(), /Armory\s*→\s*Department Store/);
    assert((await page.locator('.gorod-valve-setting').count()) > 0, 'known valve route renders stored settings');
    await page.getByRole('button', { name: 'Reset' }).click();
    await page.getByText('Select both locations.').waitFor();
    assert.equal(await selects.nth(0).inputValue(), '');
    assert.equal(await selects.nth(1).inputValue(), '');

    results.push({ width, interactions: 'map search, empty state, Side Easter Egg layout/navigation, Origins staff guide content/images/overflow and navigation, Mob guide navigation, video timestamp fallback, Gorod valve solver solution/reset', passed: true });
    await context.close();
  }

  // Short landscape phones (844×390): chrome scrolls away so guide content reaches the first screen.
  {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 } });
    const page = await context.newPage();
    const pinned = () => page.evaluate(() => [...document.querySelectorAll('.hub-header, .map-module header')]
      .filter((el) => ['fixed', 'sticky'].includes(getComputedStyle(el).position))
      .map((el) => el.className));
    for (const route of routes) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      assert.deepEqual(await pinned(), [], `${route} pins a header at 844×390`);
    }
    await page.goto(base, { waitUntil: 'networkidle' });
    const headline = await page.locator('h1').boundingBox();
    assert(headline && headline.y + headline.height <= 390, `Home headline ends at ${Math.round(headline.y + headline.height)}px, below the 390px landscape viewport`);
    await page.goto(`${base}/side-easter-eggs/kino`, { waitUntil: 'networkidle' });
    const kinoStep = await page.locator('li.guide-seq__step h3, li.flat-guide__step h2').first().boundingBox();
    assert(kinoStep && kinoStep.y + kinoStep.height <= 390, `Kino's first step title ends at ${Math.round(kinoStep ? kinoStep.y + kinoStep.height : NaN)}px; it must be fully on the 390px landscape screen`);
    results.push({ width: 844, height: 390, check: 'no pinned headers; Home headline and Kino first step in the first screen', passed: true });

    // With the hub bar scrolled away, sticky panels must not keep an empty band where it used to be.
    await page.goto(`${base}/maps/revelations/apothicon-upgrade`, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, 700));
    await settled(page);
    const stickyTops = await page.evaluate(() => [...document.querySelectorAll('main *')]
      .filter((el) => getComputedStyle(el).position === 'sticky' && el.getBoundingClientRect().height > 0)
      .map((el) => ({ el: el.className, top: Math.round(el.getBoundingClientRect().top), cssTop: getComputedStyle(el).top })));
    for (const item of stickyTops) assert(parseFloat(item.cssTop) <= 20, `${item.el} sticks ${item.cssTop} from the top at 844×390, leaving an empty band where the hub bar was`);
    results.push({ width: 844, height: 390, check: 'sticky panels sit at the top once the hub bar scrolls away', passed: true });

    // Measured, not asserted until each map's own redesign: where the first step title starts.
    for (const route of routes.filter((item) => item.startsWith('/maps/'))) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      const first = await page.locator('li.guide-seq__step h3, li.flat-guide__step h2, li.run-step h3').first().boundingBox({ timeout: 5000 }).catch(() => null);
      results.push({ width: 844, height: 390, route, metric: 'first step title top (px)', value: first ? Math.round(first.y) : null, passed: true });
    }
    await context.close();
  }
} finally {
  await browser.close();
}
await fs.writeFile(out, JSON.stringify(results, null, 2));
const failed = results.filter(r => !r.passed);
console.log(`${results.length - failed.length}/${results.length} browser route checks passed.`);
for (const f of failed) console.error(`${f.width}px ${f.route}: ${f.error}`);
if (failed.length) process.exitCode = 1;
