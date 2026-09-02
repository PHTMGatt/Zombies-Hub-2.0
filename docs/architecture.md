# Zombies Hub 2.0 Architecture

## Core decision

Zombies Hub 2.0 will be one React application, not multiple independently bootstrapped React apps embedded together.

The application will have:

- one React root
- one `BrowserRouter`
- one Hub shell
- one persistent Hub header/navigation
- map-specific sub-layouts and headers
- one production deployment

Dedicated map guides will still remain isolated in their own folders so they behave like self-contained feature modules.

## Why this is needed

The current Hub loads dedicated map guides through external Render URLs inside iframes. The Hub itself also renders a fixed global navbar and some map routes add `MapsHubHeader` above the iframe. Each dedicated guide then renders its own header and router inside the iframe.

That creates multiple independent layout systems and multiple navigation layers. It also means each map depends on a separate Render service waking up before the guide is usable.

In 2.0, dedicated guides will be imported and mounted directly under namespaced routes such as:

```text
/maps/origins/*
/maps/mob-of-the-dead/*
/maps/der-eisendrache/*
/maps/zetsubou-no-shima/*
/maps/gorod-krovi/*
/maps/revelations/*
```

## Layout ownership

### Hub shell

The Hub owns:

- global site header/navigation
- global routing
- global footer behavior
- site-wide theme controls
- top-level page spacing
- shared tokens/utilities

### Map module

Each dedicated map owns:

- its map-specific header/sub-navigation
- its pages
- its map-specific components
- its data
- its media/assets
- its visual theme

A map must not redefine Hub shell classes or global `body`, `html`, `#root`, `main`, `a`, `button`, or generic `.header` selectors without scoping them under that map's root class.

Example:

```css
.origins-map { ... }
.origins-map .origins-header { ... }
.origins-map .origins-nav { ... }
```

rather than:

```css
body { ... }
.header { ... }
.nav-links { ... }
```

This is the main protection against map CSS changing the Hub header.

## Recommended structure

```text
Zombies-Hub-2.0/
├── apps/
│   └── hub/
│       └── src/
│           ├── app/
│           │   ├── App.jsx
│           │   ├── AppRoutes.jsx
│           │   └── HubLayout.jsx
│           ├── components/
│           ├── data/
│           ├── pages/
│           └── styles/
├── maps/
│   ├── origins/
│   │   └── src/
│   │       ├── components/
│   │       ├── data/
│   │       ├── pages/
│   │       ├── styles/
│   │       └── OriginsRoutes.jsx
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

The exact internal file names may evolve during migration, but the ownership boundaries should remain stable.

## Router pattern

The Hub router will mount map modules beneath their route namespace.

Conceptually:

```jsx
<Route element={<HubLayout />}>
  <Route path="/" element={<Home />} />
  <Route path="/allmaps" element={<AllMaps />} />
  <Route path="/maps/origins/*" element={<OriginsRoutes />} />
  <Route path="/maps/mob-of-the-dead/*" element={<MobRoutes />} />
</Route>
```

Inside Origins, old routes like `/FireStaff` become relative routes such as `fire-staff`, producing a final URL like:

```text
/maps/origins/fire-staff
```

This keeps the Hub header mounted while the Origins header/nav renders directly beneath it.

## Migration philosophy

This is an integration project, not a redesign-from-scratch project.

Existing UI, content, components, tools, map data, and assets should be preserved unless a change is required for:

- route namespacing
- dependency compatibility
- CSS isolation
- removal of iframe/Render dependencies
- accessibility/responsiveness fixes discovered during migration

The old repositories remain untouched.
