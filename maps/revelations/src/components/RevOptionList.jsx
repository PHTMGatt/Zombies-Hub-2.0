import React from 'react';

export function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '';
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

export function formatRange(start, end) {
  return Number.isFinite(end) && end > start ? `${formatTime(start)} – ${formatTime(end)}` : formatTime(start);
}

// Numbered, timestamped choices that jump the guide video. One pattern for every Revelations reference.
function RevOptionList({ label, options, activeKey, onSelect }) {
  return (
    <div className="rev-options" role="group" aria-label={label}>
      {options.map((option, index) => {
        const active = option.key === activeKey;
        return (
          <button
            key={option.key}
            type="button"
            className={`rev-option${active ? ' is-active' : ''}`}
            aria-pressed={active}
            onClick={() => onSelect(option)}
          >
            <span className="rev-option__index">{index + 1}</span>
            <span className="rev-option__body">
              <span className="rev-option__title">{option.title}</span>
              {option.meta && <span className="rev-option__meta">{option.meta}</span>}
            </span>
            <span className="rev-option__play" aria-hidden="true">▶</span>
          </button>
        );
      })}
    </div>
  );
}

export default RevOptionList;
