/*
 * Guide content, read straight from the step-data modules (via Vite, so JSX, images and CSS imports
 * resolve exactly as they do in the app). The content-preservation tests compare this against a
 * baseline captured before the guide redesign, so presentation work can never silently drop a fact.
 *
 *   node scripts/guide-content.mjs --write-baseline   # rewrite scripts/fixtures/guide-content.baseline.json
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createServer } from 'vite';

const root = resolve(import.meta.dirname, '..');
export const BASELINE_PATH = resolve(root, 'scripts/fixtures/guide-content.baseline.json');
export const REMOVALS_PATH = resolve(root, 'scripts/fixtures/approved-removals.json');

export const GUIDES = [
  { guide: 'origins', route: '/maps/origins', file: 'maps/origins/src/data/originsGuide.jsx' },
  { guide: 'revelations', route: '/maps/revelations', file: 'maps/revelations/src/data/revGuideSteps.jsx' },
  { guide: 'gorod-krovi', route: '/maps/gorod-krovi', file: 'maps/gorod-krovi/src/data/gorodGuideSteps.jsx' },
  { guide: 'der-eisendrache', route: '/maps/der-eisendrache', file: 'maps/der-eisendrache/src/data/deGuideSteps.jsx' },
  { guide: 'zetsubou-no-shima', route: '/maps/zetsubou-no-shima', file: 'maps/zetsubou-no-shima/src/data/zetsGuideSteps.jsx' },
  { guide: 'shadows-of-evil', route: '/maps/shadows-of-evil', file: 'maps/shadows-of-evil/src/data/soeGuideSteps.jsx' },
  { guide: 'mob-of-the-dead', route: '/maps/mob-of-the-dead', file: 'maps/mob-of-the-dead/src/data/mobGuideSteps.jsx' },
  { guide: 'kino-side', route: '/side-easter-eggs/kino', file: 'apps/hub/src/data/sideEE/Kino.js', exportName: 'kinoSteps' },
];

export async function loadGuides() {
  const server = await createServer({
    root,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const guides = [];
    for (const { guide, route, file, exportName = 'default' } of GUIDES) {
      const module = await server.ssrLoadModule(`/${file}`);
      guides.push({ guide, route, steps: module[exportName] });
    }
    return guides;
  } finally {
    await server.close();
  }
}

const clean = (value) => (typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '');

function refStrings(refs = [], out) {
  for (const ref of refs) {
    out.push(clean(ref.label));
    switch (ref.type) {
      case 'sequence':
        ref.items?.forEach((item) => out.push(clean(item)));
        out.push(clean(ref.note));
        break;
      case 'image':
        out.push(clean(ref.alt), clean(ref.caption));
        break;
      case 'facts':
        ref.items?.forEach((item) => out.push(clean(item.k), clean(item.v)));
        break;
      case 'chips':
      case 'list':
        ref.items?.forEach((item) => out.push(clean(item)));
        break;
      case 'warning':
        out.push(clean(ref.text));
        break;
      case 'tabs':
        ref.tabs?.forEach((tab) => {
          out.push(clean(tab.label));
          refStrings(tab.refs, out);
          tab.problems?.forEach((line) => out.push(clean(line)));
          tab.links?.forEach((link) => out.push(clean(link.label), clean(link.to)));
        });
        break;
      default:
        // `custom` refs are components; the rendered-text baseline covers what they show.
        break;
    }
  }
  return out;
}

export function stepStrings(step) {
  const out = [clean(step.title), clean(step.goal)];
  step.critical?.forEach((line) => out.push(clean(line)));
  refStrings(step.refs, out);
  step.tasks?.forEach((task) => out.push(clean(task.label), clean(task.hint)));
  step.how?.forEach((line) => out.push(clean(line)));
  step.problems?.forEach((line) => out.push(clean(line)));
  step.links?.forEach((link) => out.push(clean(link.label), clean(link.to)));
  if (step.video) out.push(clean(step.video.label), clean(step.video.url));
  return out.filter(Boolean);
}

// Every guide-facing string of one guide, trimmed, de-duplicated, in data order.
export function guideStrings({ steps }) {
  return [...new Set(steps.flatMap(stepStrings))];
}

// Every tabs ref: its step, tab ids, and the strings each tab carries for itself.
export function guideTabs({ steps }) {
  return steps.flatMap((step) => (step.refs ?? [])
    .filter((ref) => ref.type === 'tabs')
    .map((ref) => ({
      step: step.id,
      tabIds: ref.tabs.map((tab) => tab.id),
      perTab: Object.fromEntries(ref.tabs.map((tab) => [tab.id, [
        ...(tab.problems ?? []).map(clean),
        ...(tab.links ?? []).flatMap((link) => [clean(link.label), clean(link.to)]),
      ].filter(Boolean)])),
    })));
}

export function snapshot(guides) {
  return Object.fromEntries(guides.map((entry) => [entry.guide, {
    route: entry.route,
    ids: entry.steps.map((step) => step.id),
    strings: guideStrings(entry),
    tabs: guideTabs(entry),
  }]));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href && process.argv.includes('--write-baseline')) {
  const data = snapshot(await loadGuides());
  writeFileSync(BASELINE_PATH, `${JSON.stringify(data, null, 2)}\n`);
  const total = Object.values(data).reduce((sum, guide) => sum + guide.strings.length, 0);
  console.log(`Wrote ${BASELINE_PATH}: ${Object.keys(data).length} guides, ${total} strings.`);
}
