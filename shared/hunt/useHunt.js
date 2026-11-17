import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { huntReducer, initialPick, neighbours, optionProps, pickParam } from './hunt.js';

/*
 * React glue for the headless hunt picker (hunt.js). Give it a normalized hunt; get the current set and item,
 * prop getters for the two radio groups, and prev/next. Markup and looks belong to the page.
 *
 *   const h = useHunt(revHunts.eggs, { onItem: (item, set) => video.playSegment(item.video.start, item.video.end) });
 *   <div role="radiogroup" aria-label="Map area">{h.sets.map((s) => <button {...h.setProps(s.id)}>{s.label}</button>)}</div>
 *   <div role="radiogroup" aria-label="Spots">{h.set.items.map((i) => <button {...h.itemProps(i.id)}>{i.label}</button>)}</div>
 *   <button onClick={h.prev} disabled={!h.prevItem}>Previous</button> <button onClick={h.next} disabled={!h.nextItem}>Next</button>
 *
 * The choice is mirrored to ?pick= (replace, no scroll) so a link opens the same spot. After a keyboard move the
 * focus follows the newly checked option, as in a native radio group. onSet / onItem fire on the player's own
 * choices (never on load), so a video only jumps when asked.
 */
export default function useHunt(hunt, { onSet, onItem } = {}) {
  const [params, setParams] = useSearchParams();
  const reduce = useMemo(() => huntReducer(hunt), [hunt]);
  const [state, dispatch] = useReducer(reduce, undefined, () => initialPick(hunt, `?${params.toString()}`));
  const focusNext = useRef(null);
  const chosen = useRef(false);

  const set = hunt.sets.find((entry) => entry.id === state.setId);
  const item = set.items.find((entry) => entry.id === state.itemId) ?? null;
  const { prev: prevItem, next: nextItem } = neighbours(hunt, state);

  useEffect(() => {
    const value = pickParam(state);
    if (params.get('pick') === value || (!chosen.current && !params.get('pick'))) return;
    const next = new URLSearchParams(params);
    next.set('pick', value);
    setParams(next, { replace: true, preventScrollReset: true });
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps -- mirror state to the URL, not the reverse

  useEffect(() => {
    if (!chosen.current) return;
    if (state.itemId) onItem?.(item, set); else onSet?.(set);
  }, [state.setId, state.itemId]); // eslint-disable-line react-hooks/exhaustive-deps -- fire on a new choice only

  useEffect(() => {
    if (!focusNext.current) return;
    document.querySelector(`[data-hunt-group="${focusNext.current.group}"] [data-hunt-id="${focusNext.current.id}"]`)?.focus();
    focusNext.current = null;
  });

  const choose = useCallback((action, group) => {
    chosen.current = true;
    if (group) focusNext.current = { group, id: action.id };
    dispatch(action);
  }, []);

  const setIds = hunt.sets.map((entry) => entry.id);
  const itemIds = set.items.map((entry) => entry.id);
  const groupKey = (group) => `${hunt.sets[0].id}-${group}`;
  return {
    sets: hunt.sets,
    set,
    item,
    prevItem,
    nextItem,
    // Spread on each group's wrapper: <div role="radiogroup" aria-label=… {...h.groupProps('sets')}>
    groupProps: (group) => ({ role: 'radiogroup', 'data-hunt-group': groupKey(group) }),
    setProps: (id) => optionProps({ id, current: state.setId, ids: setIds, onPick: (to) => choose({ type: 'set', id: to }, groupKey('sets')) }),
    itemProps: (id) => optionProps({ id, current: state.itemId, ids: itemIds, onPick: (to) => choose({ type: 'item', id: to }, groupKey('items')) }),
    prev: () => choose({ type: 'prev' }),
    next: () => choose({ type: 'next' }),
  };
}
