/*
 * Main Easter Egg maps with no dedicated guide and no video guide yet. Two kinds:
 *
 * A map that exists in two games has one route per game: the original is `<slug>`, the Zombies Chronicles (Black Ops 3)
 * remaster `<slug>-chronicles`. Pattern (Bryen, 2026-11-16): original-game entry = Coming Soon, BO3 remaster = guide.
 *
 * - videoTodoSlugs: get the small card (title, one line, related maps) with a "video guide coming soon" note on
 *   /easter-eggs/<slug>. TODO(grey-32): add each verified YouTube video id to EasterEggGuides.js (videoUrl; check it
 *   with the oEmbed endpoint first), then remove the slug here. Never add an id that has not been verified.
 * - comingSoonSlugs: deliberately left empty (Bryen, 2026-11-16): the route keeps the original "Coming Soon" page and
 *   the card on /easter-eggs keeps "No guide yet". No TODO. Remove a slug only when Bryen wants it filled in.
 */
export const videoTodoSlugs = ['die-rise', 'buried', 'the-giant', 'shangri-la-chronicles'];
export const comingSoonSlugs = ['shangri-la', 'tranzit'];
