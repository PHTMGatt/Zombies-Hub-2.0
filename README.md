# Zombies Hub 2.0

Zombies Hub 2.0 is the unified rebuild of the existing Zombies Hub and its standalone map/Easter egg guide applications.

## Goal

Keep the existing Hub and map-guide experiences intact while removing the separate Render-to-Render navigation. The finished application will use one React root, one router, one deployment, and one persistent Hub shell.

Dedicated map guides remain isolated as feature modules under `maps/` so their pages, components, styles, data, and assets do not get mixed together.

## Planned structure

```text
Zombies-Hub-2.0/
├── apps/
│   └── hub/
│       └── src/
│           ├── app/
│           ├── components/
│           ├── data/
│           ├── pages/
│           └── styles/
├── maps/
│   ├── origins/
│   ├── mob-of-the-dead/
│   ├── der-eisendrache/
│   ├── zetsubou-no-shima/
│   ├── gorod-krovi/
│   └── revelations/
├── shared/
│   ├── assets/
│   ├── hooks/
│   ├── styles/
│   ├── ui/
│   └── utilities/
└── docs/
```

## Migration rule

The original repositories are read-only source material. All migration and integration work happens in this repository.

Migration order:

1. Audit existing Hub and guide repositories.
2. Establish the 2.0 shell and route architecture.
3. Migrate the original Hub without changing its behavior unnecessarily.
4. Migrate Origins as the first integrated map guide.
5. Verify the shared Hub header + Origins sub-header pattern.
6. Migrate the remaining dedicated guide applications one at a time.
7. Remove external Render/iframe dependencies only after equivalent internal routes are verified.

See `docs/architecture.md` and `docs/migration-inventory.md` for the working design and audit notes.
