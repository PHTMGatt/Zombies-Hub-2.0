# Zombies Hub 2.0

👾 Welcome to **Zombies Hub 2.0** — the next generation of the Call of Duty Zombies companion hub. 👾

Zombies Hub 2.0 takes the original Zombies Hub and its separate map/Easter Egg guide sites and brings them together into **one unified React application** built to be faster, cleaner, easier to follow, and much easier to maintain.

The goal is simple:

> Give players the correct information they need, exactly when they need it, without making them dig through a wiki or wait for another website to load.

## 🧟 Original Zombies Hub

The original Hub is still available here:

[https://zombies-hub.onrender.com](https://zombies-hub.onrender.com)

The original repositories and deployments remain untouched while Zombies Hub 2.0 is built and verified.

## 📸 Original Hub Screenshot

![Zombies Hub Screenshot](apps/hub/src/assets/images/GHRM.jpg)

## 🚀 What Makes Zombies Hub 2.0 Better?

The original Zombies Hub proved the concept. **2.0 turns it into one complete Zombies guide platform.**

| Original Zombies Hub | Zombies Hub 2.0 |
| --- | --- |
| Main Hub and dedicated guides lived on separate Render services | **One React app and one deployment** |
| Dedicated maps were loaded through external Render pages / iframes | **Dedicated maps load instantly as internal routes** |
| Separate services could take minutes to spin up | **No Render-to-Render waiting between guides** |
| Every guide had its own independent app shell | **One persistent global Zombies Hub shell** |
| Headers and layouts could overlap or feel disconnected | **Global Hub header + organized map-specific navigation** |
| Map projects used different routing, dependency versions, and global CSS | **Central routing with isolated map modules and scoped styling** |
| Guide presentation varied heavily between maps | **Shared guide framework while preserving each map's personality** |
| Some maps relied heavily on videos, long text, or bare-bones pages | **Guide-first design focused on clear objectives and next steps** |
| Accuracy depended on the original individual guide | **Dedicated accuracy audits before a map is considered finished** |
| Side Easter Egg coverage was limited | **Side Easter Egg and music Easter Egg expansion planned across maps** |
| No unified path for interactive practice tools | **Architecture supports future interactive guides, solvers, and speedrun trainers** |

## 🗺️ Hub Sections

- **Featured Maps**  
  Quick access to major guides and useful Zombies resources.

- **All Maps**  
  Browse the full Black Ops 1–3 map collection with map imagery, DLC information, and Easter Egg status.

- **Easter Egg Maps**  
  Jump directly into maps with Main Easter Egg content.

- **Side Easter Eggs**  
  Smaller Easter Eggs, music Easter Eggs, hidden interactions, and map-specific extras.

## 🧭 Dedicated Map Guides

Zombies Hub 2.0 currently integrates these full guide applications directly into the Hub:

- **Origins**
- **Mob of the Dead**
- **Der Eisendrache**
- **Zetsubou No Shima**
- **Gorod Krovi**
- **Revelations**

They are no longer separate destinations. Each guide lives under the Hub through routes such as:

```text
/maps/origins
/maps/mob-of-the-dead
/maps/der-eisendrache
/maps/zetsubou-no-shima
/maps/gorod-krovi
/maps/revelations
```

## 🎯 Guide Philosophy

Every map should answer one question clearly:

> **What do I need to do next?**

The project is moving toward a common guide framework:

1. Map header and local navigation
2. Main Easter Egg guide
3. Clear step-by-step progression
4. Quick-reference images and puzzle diagrams
5. Videos and timestamps only when they make a step easier to understand
6. Map-specific tools and solvers
7. Side Easter Eggs
8. Tips and speedrun references
9. Map footer

The structure stays familiar across maps while the artwork, colors, backgrounds, and special tools preserve each map's identity.

### Current design references

- **Origins** is the usability and guide-structure standard: simple, direct, visual, and easy to scan.
- **Revelations** is the visual presentation standard: strong header/footer treatment, background integration, and cohesive map identity.

## ✅ Accuracy Matters

A polished page is useless if the Easter Egg information is wrong.

Before a dedicated guide is considered complete, Zombies Hub 2.0 is being reviewed for:

- Correct Easter Egg step order
- Prerequisites
- Missing steps
- Staff / weapon puzzle solutions
- Switch codes and orientations
- Player-count requirements
- Boss-fight requirements
- Rewards
- Side Easter Eggs
- Video timestamps

The goal is for Zombies Hub to become something players can confidently keep open while they are actually running an Easter Egg.

## 🧩 Modular Architecture

Even though everything runs as one application, maps remain cleanly separated in the repository.

```text
Zombies-Hub-2.0/
├── apps/
│   └── hub/
├── maps/
│   ├── origins/
│   ├── mob-of-the-dead/
│   ├── der-eisendrache/
│   ├── zetsubou-no-shima/
│   ├── gorod-krovi/
│   └── revelations/
├── shared/
└── docs/
```

This keeps map-specific components, pages, data, assets, and styles isolated while still allowing shared UI and infrastructure where it actually makes sense.

## 🧪 Current Status

The core migration is complete:

- Original Hub migrated into 2.0
- Dedicated map repositories copied into organized map modules
- One React root
- One React Router setup
- Dedicated guides mounted as internal routes
- External dedicated-map iframe behavior removed
- Legacy Render map links converted to internal routes
- CSS isolation added to reduce style collisions between guides
- Production build passing

The current phase is **accuracy verification + visual polish**.

Priority work includes:

- Revelations video/timestamp reliability
- Mob of the Dead guide accuracy + overhaul
- Der Eisendrache guide/bow accuracy + major UI overhaul
- Gorod Krovi step accuracy + conversion from wiki-like text to actionable guide steps
- Origins footer polish and Lightning Staff switch verification
- Mobile spacing and responsive cleanup
- Expanding Side Easter Egg coverage

See [`docs/polish-roadmap.md`](docs/polish-roadmap.md) for the detailed map-by-map plan.

## ⚡ Future: Interactive Guides & Speedrun Training

Once the static guides are verified and polished, Zombies Hub 2.0 is designed to support interactive tools.

Origins is planned as the first test map, including ideas such as:

- Interactive Easter Egg / speedrun practice
- Wind Staff puzzle simulation
- Ice Staff symbol-matching practice
- Lightning Staff switch practice
- Correct / incorrect feedback
- Optional sound and animation

The static guide will always remain available — interactive tools will supplement it, not replace it.

## 💻 Local Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## 📚 Project Documentation

- [`docs/architecture.md`](docs/architecture.md) — application architecture
- [`docs/migration-inventory.md`](docs/migration-inventory.md) — migration/audit notes
- [`docs/polish-roadmap.md`](docs/polish-roadmap.md) — current accuracy and polish roadmap

---

🧟 **Zombies Hub 2.0 is being built to be more than a collection of Zombies pages — the goal is one fast, accurate, professional guide system players can actually rely on.**
