/*
 * Main Easter Egg maps that have no video guide yet. Their /easter-eggs/<slug> page is a small card
 * (title, one line, related maps) with a "video guide coming soon" note.
 * TODO(grey-32): add each verified YouTube video id to EasterEggGuides.js (videoUrl) once Grey's research ticket
 * delivers it, then remove the slug here. Never add an id that has not been verified.
 */
export const videoTodoSlugs = ['shangri-la', 'tranzit', 'die-rise', 'buried', 'the-giant'];

/*
 * Shangri-La is deliberately left without a guide (Bryen, 2026-11-16): its /easter-eggs/shangri-la route keeps the
 * "Coming Soon" page and its card keeps "No guide yet". Slugs here skip the small card even though they are on the
 * TODO list above. Remove it from here only when Bryen wants Shangri-La filled in.
 */
export const comingSoonSlugs = ['shangri-la'];
