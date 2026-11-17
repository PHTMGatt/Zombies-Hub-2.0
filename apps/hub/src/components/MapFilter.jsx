import React, { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_FILTER, FILTER_PARAM, MAP_FILTERS, filterStorageKey, resolveFilter } from '../data/mapFilters';
import '../styles/compStyles/MapFilter.css';

const readStored = (page) => {
  try {
    return window.localStorage.getItem(filterStorageKey(page));
  } catch {
    return null;
  }
};
const store = (page, value) => {
  try {
    if (value === DEFAULT_FILTER) window.localStorage.removeItem(filterStorageKey(page));
    else window.localStorage.setItem(filterStorageKey(page), value);
  } catch { /* private mode: the URL still carries the choice */ }
};

// The page's filter: the link's ?show= wins (shareable), else the last choice on this device, else All.
export function useMapFilter(page) {
  const [searchParams, setSearchParams] = useSearchParams();
  const fromUrl = searchParams.get(FILTER_PARAM);
  const filter = resolveFilter(page, fromUrl, readStored(page));

  // A remembered choice shows in the address bar too, so the link always matches what is on screen.
  useEffect(() => {
    if (fromUrl !== (filter === DEFAULT_FILTER ? null : filter)) {
      setSearchParams((params) => {
        const next = new URLSearchParams(params);
        if (filter === DEFAULT_FILTER) next.delete(FILTER_PARAM);
        else next.set(FILTER_PARAM, filter);
        return next;
      }, { replace: true, preventScrollReset: true });
    }
  }, [filter, fromUrl, setSearchParams]);

  const setFilter = useCallback((value) => {
    const next = resolveFilter(page, value);
    store(page, next);
    setSearchParams((params) => {
      const updated = new URLSearchParams(params);
      if (next === DEFAULT_FILTER) updated.delete(FILTER_PARAM);
      else updated.set(FILTER_PARAM, next);
      return updated;
    }, { replace: true, preventScrollReset: true });
  }, [page, setSearchParams]);

  return [filter, setFilter];
}

// Native radios: arrow keys move the choice and screen readers announce "Show, radio group, 2 of 3".
export default function MapFilter({ page, value, onChange, counts }) {
  return (
    <fieldset className="map-filter">
      <legend className="map-filter__legend">Show</legend>
      <div className="map-filter__options">
        {MAP_FILTERS[page].map((option) => (
          <label key={option.id} className="map-filter__option" data-filter={option.id}>
            <input
              type="radio"
              name={`map-filter-${page}`}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <span className="map-filter__label">{option.label}</span>
            {counts && <span className="map-filter__count">{counts[option.id]}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
