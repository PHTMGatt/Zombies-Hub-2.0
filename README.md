# Zombies Hub 2.0

A unified **Call of Duty Zombies guide hub** built with React and Vite.

**Live 2.0:** https://zombies-hub-2-0.onrender.com/

**Original 1.0 Hub:** https://zombies-hub.onrender.com/

Zombies Hub 2.0 brings the Hub, full Easter Egg guides, Side Easter Eggs, reference images, videos, and map-specific tools into **one application**.

The goal is simple: open a map and quickly answer **“what do I do next?”** without digging through a huge wiki page or waiting for another guide site to load.

## 1.0 vs 2.0

### Zombies Hub 1.0

The original version used a **separate React application and a separate Render service for each dedicated map guide**.

The Hub, Origins, Mob of the Dead, Der Eisendrache, Revelations, and the other dedicated guides all ran as independent programs. Moving between them meant moving between separate deployments, with duplicated app code and the possibility of Render cold-start/loading delays.

It proved the idea, but the system was slower, more fragmented, and harder to maintain.

### Zombies Hub 2.0

2.0 rebuilds the project as **one React application, one router, one codebase, and one Render service**.

Every dedicated guide now loads as an internal route inside the Hub. The result is much faster and more seamless map-to-map navigation, less duplicated code, simpler maintenance, and one consistent application shell while each map still keeps its own visual identity.

| Zombies Hub 1.0 | Zombies Hub 2.0 |
| --- | --- |
| Separate React app for each guide | **One React application** |
| Separate Render service for each guide | **One Render service** |
| Guide-to-guide website jumps | **Internal React routing** |
| More duplicated code and dependencies | **Shared architecture** |
| More chances for cold-start delays | **Faster, smoother navigation** |
| Independent app shells | **One Hub shell + map-specific guide navigation** |

## Dedicated Guides

Zombies Hub 2.0 currently includes full internal guides for:

- Origins
- Mob of the Dead
- Shadows of Evil
- Der Eisendrache
- Zetsubou No Shima
- Gorod Krovi
- Revelations

Each map keeps its own colors, artwork, guide sections, tools, and personality while running inside the same React application.

**Origins** is the main usability reference: short, visual, and easy to follow while playing. **Revelations** is the main visual reference, especially for map atmosphere and header/footer integration.

## Guide Features

The project includes main Easter Egg routes, Staff/Bow/weapon guides, puzzle references, map-specific solvers, boss-fight references, Side Easter Eggs, and video/timestamp references when they actually make a step easier to understand.

The Side Easter Egg section also includes an advanced **Origins Speed Run** guide with robot/snow routing, cycle strategy, tank and Lightning skips, staff duplication, ending setup, and Lightning Staff switch reference images.

Accuracy matters as much as presentation. Dedicated maps are being checked against full walkthroughs so the guide remains useful while somebody is actually running the Easter Egg.

## Project Structure

```text
Zombies-Hub-2.0/
├── apps/hub/              # Main Hub application
├── maps/                  # Dedicated map modules
│   ├── origins/
│   ├── mob-of-the-dead/
│   ├── shadows-of-evil/
│   ├── der-eisendrache/
│   ├── zetsubou-no-shima/
│   ├── gorod-krovi/
│   └── revelations/
├── shared/
├── docs/
└── scripts/
```

The app uses one BrowserRouter. Map CSS is scoped by module so one guide cannot accidentally restyle another guide or the main Hub.

## Local Development

```bash
npm install
npm run dev
```

Production verification/build:

```bash
npm run build
```

Render build:

```bash
npm run render
```

Render publishes the generated `dist` directory. SPA rewriting keeps direct routes such as `/maps/origins` working after a refresh.

## Visual QA Screenshots

During development, a temporary `screenshots/` folder can be used to capture the live Render pages at desktop and mobile sizes. These screenshots are only for visual QA and can be deleted once the polish pass is complete.

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — application architecture
- [`docs/migration-inventory.md`](docs/migration-inventory.md) — migration notes
- [`docs/polish-roadmap.md`](docs/polish-roadmap.md) — polish and QA roadmap
- [`docs/origins-interactive-roadmap.md`](docs/origins-interactive-roadmap.md) — future interactive Origins tools

---

**Zombies Hub 2.0 is one fast, unified Zombies companion instead of a collection of separate guide sites.**
