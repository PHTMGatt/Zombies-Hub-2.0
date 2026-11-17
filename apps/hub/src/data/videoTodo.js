/*
 * Main Easter Egg maps with no dedicated guide and no video guide. Two lists:
 *
 * A map that exists in two games has one route per game: the original is `<slug>`, the Zombies Chronicles (Black Ops 3)
 * remaster `<slug>-chronicles`. Pattern (Bryen, 2026-11-16): original-game entry = Coming Soon, BO3 remaster = guide.
 *
 * - videoTodoSlugs: get the small card (title, one line, related maps) with a "video guide coming soon" note on
 *   /easter-eggs/<slug>. Empty since Grey's grey-32 ids were verified (oEmbed, public, embeddable) and added to
 *   EasterEggGuides.js on 2026-11-16 (TranZit, Die Rise, Buried, The Giant, Shangri-La BO3). To use it again, add the slug here
 *   and keep the TODO honest: only verified ids (creator priority: 1 CodeNamePizza, 2 MrTLexify, 3 MrRoflWaffles).
 * - comingSoonSlugs: deliberately left empty (Bryen, 2026-11-16; Shangri-La BO1 only, TranZit went back to a small card): the route keeps the original "Coming Soon" page and
 *   the card on /easter-eggs keeps "No guide yet". No TODO. Remove a slug only when Bryen wants it filled in.
 */
export const videoTodoSlugs = [];
export const comingSoonSlugs = ['shangri-la'];
