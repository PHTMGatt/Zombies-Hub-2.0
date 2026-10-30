import React, { useId, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MAPS } from '../achievements/achievements';
import { MAP_NAMES, search } from './searchIndex';
import './search.css';

const KIND_LABEL = { guide: 'Tracked guide', ref: 'Reference', tool: 'Tool', page: 'Page' };
const EXAMPLES = ['ice staff code', 'gorod valves', 'mob plane parts', 'DE wisps', 'soe train symbols'];

/*
 * Type what you'd say out loud ("gorod valves") and jump straight to it. Enter opens the top result.
 * Results that point into a guide open its reference sheet without moving your run.
 */
export default function SearchBox({ autoFocus = false, initialQuery = '', compact = false }) {
  const [query, setQuery] = useState(initialQuery);
  const results = useMemo(() => search(query).slice(0, compact ? 5 : 10), [query, compact]);
  const navigate = useNavigate();
  const id = useId();

  const submit = (event) => {
    event.preventDefault();
    if (results[0]) navigate(results[0].to);
  };

  return (
    <div className={`zh-search${compact ? ' is-compact' : ''}`}>
      <form role="search" onSubmit={submit}>
        <label htmlFor={id} className="zh-search__label">Find it fast</label>
        <input
          id={id}
          type="search"
          value={query}
          placeholder="Try “gorod valves” or “ice staff code”"
          autoComplete="off"
          autoFocus={autoFocus}
          enterKeyHint="go"
          aria-controls={`${id}-results`}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>

      <div id={`${id}-results`} aria-live="polite">
        {query.trim() === '' ? (
          !compact && (
            <p className="zh-search__examples">
              {EXAMPLES.map((example) => (
                <button key={example} type="button" onClick={() => setQuery(example)}>{example}</button>
              ))}
            </p>
          )
        ) : results.length === 0 ? (
          <p className="zh-search__empty">Nothing matches “{query}”. Try a map name plus what you need, like “mob skulls”.</p>
        ) : (
          <ol className="zh-search__results">
            {results.map((entry) => {
              const accent = MAPS[entry.map]?.accent ?? '#6dc2ff';
              return (
                <li key={`${entry.map}-${entry.title}-${entry.to}`}>
                  <Link to={entry.to} style={{ '--search-accent': accent }}>
                    <span className="zh-search__map">{MAP_NAMES[entry.map] ?? 'Zombies Hub'}</span>
                    <strong>{entry.title}</strong>
                    <span className="zh-search__kind">{KIND_LABEL[entry.kind]}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
