# Revelations Cinematic Shell Design

## Intent
Restore the older Revelations visual identity the user prefers while keeping the newer, more readable 12-step guide behavior.

## Goals
- Keep the global Zombies Hub navigation separate from map navigation.
- Restore the wide, map-art header with title/subtitle on the left and one map navigation row on the right.
- Keep the blurred Revelations background and translucent/glass reading surfaces.
- Keep the current 12-step sidebar, focused step panel, bullets, reference links, and previous/next controls.
- Remove the duplicated bottom quick-reference navigation from the main guide.
- Preserve the themed footer and atmospheric bleed into it.
- Keep responsive behavior usable on tablet/mobile.

## Non-goals
- Do not rewrite quest data.
- Do not change routes.
- Do not redesign the other map guides in this pass.
- Do not remove the global Zombies Hub header.

## Constraints
- React 19 / React Router 7 / Vite 6.
- Reuse existing Revelations assets and component structure.
- No new dependencies.

## Approaches
1. **Rollback the whole old Revelations implementation.** Rejected because it would throw away the newer step organization and corrected data.
2. **Keep the current structure and only recolor it.** Rejected because the user specifically wants the older header/body/footer composition and the current centered stacked header is part of the problem.
3. **Hybrid restoration (chosen).** Keep current data/interaction, restore the older horizontal hero/header composition and glass/blur atmosphere, and remove duplicate navigation.

## Builder calls
- The top map nav is the only map-level navigation row.
- Contextual links inside an individual step remain because they are content actions, not duplicate global/map navigation.
- Desktop header uses a left-title/right-nav layout; mobile collapses to a stacked layout.
