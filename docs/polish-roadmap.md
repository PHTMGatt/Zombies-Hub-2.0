# Zombies Hub 2.0 — Polish & Accuracy Roadmap

## Product goal

Zombies Hub 2.0 should feel like a professional, trustworthy guide that players actually want to keep open while playing.

The guiding question for every page is:

> What does the player need to do next?

Text, images, timestamps, videos, solvers, and interactive tools are all supporting tools. They should never make the guide feel like a wiki dump or a random collection of embeds.

## Core design philosophy

### Shared structure, unique flavor

Every map should use the same underlying wireframe and information flow so the experience feels cohesive across the entire Hub.

Map personality should come from:
- Artwork
- Color palette
- Header/footer imagery
- Background treatment
- Map-specific icons
- Unique tools such as the Gorod Krovi valve solver

Examples:
- Origins / Der Eisendrache: icy blue / white
- Gorod Krovi: fire / red / orange
- Mob of the Dead: dark prison / hellfire / industrial tones
- Revelations: blue / cosmic / fractured-universe aesthetic

## Gold standards

### Origins = usability / information architecture standard

Origins is the strongest reference for how a guide should *feel* to use:
- Simple
- Direct
- Easy to scan
- Images carry information where they are better than paragraphs
- Main guide + staff-specific sections
- No unnecessary clutter

Origins should stay largely intact.

### Revelations = visual presentation standard

Revelations currently has the strongest overall visual language:
- Header
- Footer
- Background / content transition
- Theme consistency
- Strong map identity

Its header/footer treatment should be the visual quality target for the other dedicated maps without making every map look identical.

## Standard map-guide wireframe

Each dedicated map should move toward this shared structure:

1. **Map header / local navigation**
2. **Main Easter Egg guide**
3. **Step-by-step progression**
4. **Quick-reference images / diagrams**
5. **Media only where it improves clarity**
6. **Map-specific tools / solvers**
7. **Side Easter Eggs**
8. **Tips / speedrun references**
9. **Map footer**

The guide should favor concise steps and visual references over long prose.

## Accuracy rule

Polish is not enough. Every dedicated guide must be checked against reliable gameplay information before it is considered complete.

We need to verify:
- Correct Easter Egg order
- Missing prerequisites
- Missing steps
- Staff / weapon puzzle solutions
- Switch orientations / codes
- Required player counts where relevant
- Boss-fight requirements
- Rewards
- Side Easter Eggs
- Video timestamps

A beautiful guide with incorrect or missing information is not acceptable.

## Current map assessments

### Origins

**Status:** strongest overall guide; preserve structure.

Work:
- Improve footer so it visually matches the quality of the page/header.
- Keep existing guide structure essentially untouched.
- Verify Lightning Staff switch reference / switch orientations.
- Add the existing Lightning Staff speedrun switch-reference image as an optional quick-reference card.
- Do not clutter the primary guide.

Future feature:
- Add an **Interactive Guide / Speedrun Trainer** entry to the map navigation.
- Interactive staff puzzle practice.
- Wind Staff rotating-symbol puzzle simulation.
- Ice Staff symbol-matching practice.
- Lightning switch practice.
- Correct / incorrect feedback.
- Eventually use sounds / animation where appropriate.

This is a later phase after the static guide is fully polished and verified.

### Revelations

**Status:** strongest header/footer/theme; internal guide presentation needs normalization.

Keep:
- Header design
- Footer design
- Overall blue/cosmic identity
- Main-guide interaction concept
- Useful timestamp navigation

Fix / improve:
- Investigate video embeds intermittently showing black screens / slow loading.
- Investigate timestamp reliability and seek behavior.
- Reduce the feeling that Apothicon Upgrade, Egg Locations, Summoning Key, and Sound Step are four unrelated UI systems.
- Create one consistent media-card / timestamp interaction pattern.
- Keep different content types where needed, but make them share the same visual hierarchy.
- Preserve animations that already feel good, such as the Sound Step slide transition.

### Mob of the Dead

**Status:** functional but bare-bones; information accuracy needs review.

Keep:
- Dark glossy / glass content-card treatment.
- Darkened / blurred background behind readable content.
- Yellow map accent / hover behavior if it fits the final theme.

Fix / improve:
- Audit the Easter Egg information for correctness and completeness.
- Rework the header to feel tighter and more professional.
- Reorganize the guide around clear progression instead of flat pages.
- Add stronger hierarchy: requirements, current step, objective, quick tips, media where useful.
- Preserve the prison / hellfire identity.

### Der Eisendrache

**Status:** requires major overhaul.

Problems:
- Content exists, but presentation feels unfinished / wireframe-like.
- Bow-selection page is too plain.
- Main guide leans too heavily on timestamps without enough guide structure.
- Parts / Wisps / Bows do not feel like one cohesive product.

Fix / improve:
- Audit all Easter Egg information and bow information.
- Rebuild the page hierarchy around the shared map-guide framework.
- Create a stronger visual bow selector.
- Give Base / Electric / Fire / Wolf / Void bows clear visual identity and concise requirements.
- Keep useful timestamped video references, but do not let the videos become the entire guide.
- Bring header/footer quality closer to Revelations while keeping the icy-castle theme.

### Gorod Krovi

**Status:** functional, but too text-heavy and wiki-like.

Keep:
- Red / fire / dragon theme.
- Valve Solver and other useful map-specific tools.

Fix / improve:
- Audit Easter Egg step accuracy and completeness.
- Convert long prose into actionable guide steps.
- Break dense sections into objectives, requirements, actions, warnings, and quick-reference content.
- Make the experience feel like a guide rather than an article.
- Keep the Valve Solver easy to reach.

### Zetsubou No Shima

**Status:** migrated and functional; full polish / accuracy review still required.

Work:
- Apply the same guide-first framework.
- Verify Main Guide, prerequisites, blueprint, cogs, boss fight, and buildables.
- Preserve the swamp / green visual identity.
- Review side Easter Eggs and useful music / hidden-content references.

## Side Easter Eggs

The Side Easter Eggs section should become more complete over time.

Goals:
- Add meaningful side Easter Eggs for each map.
- Include music Easter Eggs where that is the primary / notable side Easter Egg.
- Some maps can contain multiple music Easter Eggs.
- Add missing maps such as Shi No Numa where appropriate.
- Keep entries concise and useful; video can be used when it is the clearest explanation.

## Responsive / mobile polish

Current Hub behavior is generally good, but cards can become tight at narrow widths.

Review:
- Card minimum widths
- Grid breakpoints
- Padding
- Header wrapping
- Local map navigation wrapping
- Video / media card sizing
- Footer spacing

The goal is graceful reflow, not simply shrinking desktop layouts until they fit.

## Immediate priorities

### P0 — correctness and broken behavior

1. Revelations video loading / black-screen / timestamp behavior.
2. Verify Mob of the Dead Easter Egg information.
3. Verify Der Eisendrache Easter Egg + bows.
4. Verify Gorod Krovi Easter Egg progression.
5. Verify questionable Origins Lightning Staff switch information.

### P1 — visual / structural polish

1. Origins footer.
2. Revelations internal media / timestamp UI consistency.
3. Mob of the Dead header + guide hierarchy overhaul.
4. Der Eisendrache full UI / guide overhaul.
5. Gorod Krovi conversion from wiki-like prose to actionable guide steps.
6. Mobile spacing / card responsiveness.

### P2 — expansion

1. Expand Side Easter Eggs / music Easter Eggs.
2. Add additional useful quick references.
3. Improve map-specific artwork where current source art limits quality.

### Later phase — interactive training

Start with Origins:
- Interactive Easter Egg / Speedrun Trainer
- Staff puzzle practice
- Switch practice
- Feedback / validation
- Optional sound / animation

Do not let this delay the verified, polished static guide.

## Definition of done for a map

A map is not finished until:
- Every required Easter Egg step is present.
- Information has been verified.
- The player can immediately tell what to do next.
- Long text is reduced where a visual / short instruction works better.
- Images and videos genuinely improve clarity.
- Local navigation is obvious.
- Header / footer feel intentional.
- Desktop and mobile layouts are usable.
- No broken media, timestamps, routes, or assets remain.
- The map feels like part of Zombies Hub 2.0 while still having its own identity.
