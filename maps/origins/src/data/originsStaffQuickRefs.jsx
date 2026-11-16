import React from 'react';
import LightningSwitchBoard from '../components/LightningSwitchBoard';
import originsStaffPages from './originsStaffPages';

/*
 * The Main Guide's staff quick-reference tabs (main's live layout: one tab per staff in "Build the Staffs"
 * and "Secure the Keys"), read straight from the staff pages' data so no staff fact exists twice.
 * Merge with main, 2026-11-15: this is a mapping only. Edit a staff fact in originsStaffPages.js.
 */
const ORDER = ['ice', 'fire', 'wind', 'lightning'];

// Upgrade lines are strings, or { label, text } where the staff page leads the line with a bold label.
const line = (item) => (typeof item === 'string' ? item : `${item.label}: ${item.text}`);

const tabs = (tone, refsFor) => ORDER.map((id) => ({
  id,
  label: originsStaffPages[id].name,
  tone: tone[id],
  refs: refsFor(originsStaffPages[id]),
}));

const buildRefs = (staff) => [{ type: 'facts', items: staff.build }];

const upgradeRefs = (staff) => {
  const { puzzle, upgrade } = staff;
  return [
    ...(puzzle.pianoCode ? [{ type: 'sequence', label: 'Piano code', items: puzzle.pianoCode }] : []),
    { type: 'image', ...puzzle.chart },
    // Lightning's switches: the same board the Lightning page uses (main's tab showed it too).
    ...(staff.id === 'lightning' ? [{ type: 'custom', key: 'lightning-switches', render: () => <LightningSwitchBoard /> }] : []),
    { type: 'list', items: [...puzzle.steps, ...(upgrade.anyOrder ? [line(upgrade.anyOrder)] : []), ...upgrade.steps.map(line)] },
  ];
};

export const staffQuickRefs = (tone) => ({
  build: [{ type: 'tabs', label: 'Staff', tabs: tabs(tone, buildRefs) }],
  upgrade: [{ type: 'tabs', label: 'Staff', tabs: tabs(tone, upgradeRefs) }],
});
