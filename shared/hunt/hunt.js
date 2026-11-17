/*
 * Headless hunt picker: the logic behind every "choose an area, then a spot" page (Revelations eggs, runes,
 * rocks, throws; any map's collectibles). No markup, no styles: a look supplies those and spreads optionProps
 * onto its own buttons. One pattern everywhere:
 *   - a hunt is sets of items: [{ id, label, items: [{ id, label, ...anything } ] }]; ids are slugs
 *   - one set is current; at most one item in it is current (null until the player picks one)
 *   - ?pick=<set> or ?pick=<set>.<item> deep-links a choice; anything unknown falls back, never throws
 *   - next/prev walk every item across sets in order and stop at the ends
 *   - each group is a radio group: arrows, Home and End move and wrap, one tab stop per group
 * React glue lives in useHunt.js.
 */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeHunt(sets) {
  if (!Array.isArray(sets) || sets.length === 0) throw new Error('hunt: no sets');
  const seen = new Set();
  const out = sets.map((set) => {
    if (!SLUG.test(set.id ?? '')) throw new Error(`hunt: id "${set.id}" must be a slug (a-z, 0-9, -)`);
    if (seen.has(set.id)) throw new Error(`hunt: duplicate set id "${set.id}"`);
    seen.add(set.id);
    if (!set.label) throw new Error(`hunt: set "${set.id}" has no label`);
    if (!set.items?.length) throw new Error(`hunt: set "${set.id}" has no items`);
    const items = new Set();
    for (const item of set.items) {
      if (!SLUG.test(item.id ?? '')) throw new Error(`hunt: id "${item.id}" must be a slug (a-z, 0-9, -)`);
      if (items.has(item.id)) throw new Error(`hunt: duplicate item id "${item.id}" in set "${set.id}"`);
      items.add(item.id);
      if (!item.label) throw new Error(`hunt: item "${item.id}" in set "${set.id}" has no label`);
    }
    return { ...set, items: [...set.items] };
  });
  return { sets: out };
}

const setOf = (hunt, id) => hunt.sets.find((set) => set.id === id);
const flat = (hunt) => hunt.sets.flatMap((set) => set.items.map((item) => ({ setId: set.id, itemId: item.id, label: item.label })));

export function initialPick(hunt, search = '') {
  let pick = '';
  try { pick = new URLSearchParams(search).get('pick') ?? ''; } catch { pick = ''; }
  const [setId, itemId] = pick.split('.');
  const set = setOf(hunt, setId);
  if (!set) return { setId: hunt.sets[0].id, itemId: null };
  return { setId: set.id, itemId: set.items.some((item) => item.id === itemId) ? itemId : null };
}

export const pickParam = ({ setId, itemId }) => (itemId ? `${setId}.${itemId}` : setId);

export function huntReducer(hunt) {
  const order = flat(hunt);
  return (state, action) => {
    switch (action.type) {
      case 'set':
        return setOf(hunt, action.id) ? { setId: action.id, itemId: null } : state;
      case 'item':
        return setOf(hunt, state.setId)?.items.some((item) => item.id === action.id) ? { ...state, itemId: action.id } : state;
      case 'next':
      case 'prev': {
        const { prev, next } = neighbours(hunt, state, order);
        const to = action.type === 'next' ? next : prev;
        return to ? { setId: to.setId, itemId: to.itemId } : state;
      }
      default:
        return state;
    }
  };
}

// The items before and after the current one, across sets. With no item chosen, next is the set's first item.
export function neighbours(hunt, state, order = flat(hunt)) {
  if (!state.itemId) {
    const first = order.find((entry) => entry.setId === state.setId);
    return { prev: null, next: first ?? null };
  }
  const i = order.findIndex((entry) => entry.setId === state.setId && entry.itemId === state.itemId);
  return { prev: order[i - 1] ?? null, next: order[i + 1] ?? null };
}

export const HUNT_KEYS = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];

// Which option a key moves to inside one group (ids in order), or null for keys the group does not handle.
export function keyAction(key, ids, current) {
  if (!HUNT_KEYS.includes(key) || ids.length === 0) return null;
  const i = ids.indexOf(current);
  if (i === -1) return { id: ids[0] };
  if (key === 'Home') return { id: ids[0] };
  if (key === 'End') return { id: ids[ids.length - 1] };
  const step = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1;
  return { id: ids[(i + step + ids.length) % ids.length] };
}

// Spread onto one option's button. The group around it gets role="radiogroup" and an aria-label.
export function optionProps({ id, current, ids, onPick }) {
  const checked = id === current;
  return {
    role: 'radio',
    'aria-checked': checked,
    tabIndex: checked || (current == null && id === ids[0]) ? 0 : -1,
    'data-hunt-id': id,
    onClick: () => onPick(id),
    onKeyDown: (event) => {
      const move = keyAction(event.key, ids, current);
      if (!move) return;
      event.preventDefault();
      onPick(move.id);
    },
  };
}
