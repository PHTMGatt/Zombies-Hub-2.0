# Revelations Cinematic Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the older cinematic Revelations shell while preserving the current 12-step guide and removing duplicate map navigation.

**Architecture:** Keep the existing Revelations route/component boundaries. Change only the main guide markup where duplicate navigation exists and restyle the Revelations header/main-guide/footer surfaces with existing assets and CSS.

**Tech Stack:** React 19, React Router 7, Vite 6, CSS, Node test runner.

**Spec:** `docs/superpowers/specs/2026-10-26-revelations-cinematic-shell-design.md`

## Global Constraints
- No route changes.
- No quest-data rewrites.
- No new dependencies.
- Preserve mobile responsiveness.

## Review Focus
- Main guide must expose only one map-level navigation row.
- Step-specific reference links must remain available.
- Header must not overflow at desktop/tablet widths.
- Main content must remain readable over the blurred background.
- Footer must remain visually connected without covering content.

---

### Task 1: Lock the duplicate-navigation regression

**Files:**
- Create: `scripts/revelations-shell.test.mjs`
- Test: `scripts/revelations-shell.test.mjs`

**Interfaces:**
- Consumes: Revelations JSX/CSS source files.
- Produces: source-level regression coverage for the shell contract.

- [ ] **Step 1:** Add a failing Node test asserting the main guide no longer contains `rev-main-shortcuts` and the header still contains `rev-header__nav`.
- [ ] **Step 2:** Run `npm test`; expected result before implementation is failure on duplicate shortcuts.
- [ ] **Step 3:** Commit the failing test.

### Task 2: Remove duplicated main-guide navigation and restore semantic shell

**Files:**
- Modify: `maps/revelations/src/pages/MainGuide.jsx`
- Modify: `maps/revelations/src/styles/MainGuide.css`

**Interfaces:**
- Consumes: current `apothiconSteps`, `referenceLinks`, top `Header` navigation.
- Produces: one map nav, current 12-step interaction, cinematic glass guide layout.

- [ ] **Step 1:** Remove the bottom `rev-main-shortcuts` nav.
- [ ] **Step 2:** Preserve step-specific reference links and previous/next controls.
- [ ] **Step 3:** Restyle the main shell toward the older open/glass composition with stronger blur, cyan/purple glow, and less dashboard-like framing.
- [ ] **Step 4:** Run `npm test`; expected PASS.

### Task 3: Restore horizontal cinematic header and footer continuity

**Files:**
- Modify: `maps/revelations/src/components/Header.css`
- Modify: `maps/revelations/src/components/Footer.css`

**Interfaces:**
- Consumes: existing `Header.jsx`, `Footer.jsx`, `Rev3.png` asset.
- Produces: desktop left-title/right-nav hero, responsive stacked mobile hero, atmospheric footer bleed.

- [ ] **Step 1:** Restore the desktop horizontal header composition with the existing map art and glow treatment.
- [ ] **Step 2:** Keep responsive wrapping/stacking to prevent overflow.
- [ ] **Step 3:** Tune footer overlay/bleed so it visually joins the blurred body without covering guide content.
- [ ] **Step 4:** Run `npm run check`, `npm test`, and `npm run compile`.

### Task 4: Browser/CI verification

**Files:** none

- [ ] **Step 1:** Open a PR so repository CI runs source verification, unit tests, production compile, and browser route regression checks.
- [ ] **Step 2:** Inspect the workflow result and fix any failure before completion.
